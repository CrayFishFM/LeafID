import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { SPECIES_BY_ID } from '@/data/species';
import { db, UPLOAD_DIR } from './db';

export type SubmissionStatus = 'pending' | 'verified' | 'disputed';

/** Votes needed from other users before a photo can be verified. */
export const MIN_VOTES = 3;
/** Share of all IDs (uploader's claim + votes) the leading species needs. */
export const AGREEMENT = 0.7;
/** After this many votes with no agreement, the photo is marked disputed. */
export const DISPUTE_AFTER = 6;

export interface Submission {
  id: string;
  userId: string;
  uploader: string;
  claimed: string;
  note: string | null;
  status: SubmissionStatus;
  consensus: string | null;
  createdAt: number;
  votes: number;
  tally: { species: string; count: number }[];
  myVote: string | null;
}

interface Row {
  id: string;
  user_id: string;
  uploader: string | null;
  claimed: string;
  note: string | null;
  status: SubmissionStatus;
  consensus: string | null;
  created_at: number;
}

const SELECT = `SELECT s.*, u.name AS uploader FROM submission s LEFT JOIN user u ON u.id = s.user_id`;

function hydrate(row: Row, viewerId: string | null): Submission {
  const tally = db
    .prepare(`SELECT species, COUNT(*) AS count FROM vote WHERE submission_id = ? GROUP BY species ORDER BY count DESC`)
    .all(row.id) as { species: string; count: number }[];
  const mine = viewerId
    ? (db.prepare(`SELECT species FROM vote WHERE submission_id = ? AND user_id = ?`).get(row.id, viewerId) as
        | { species: string }
        | undefined)
    : undefined;
  return {
    id: row.id,
    userId: row.user_id,
    uploader: row.uploader ?? 'Unknown',
    claimed: row.claimed,
    note: row.note,
    status: row.status,
    consensus: row.consensus,
    createdAt: row.created_at,
    votes: tally.reduce((n, t) => n + t.count, 0),
    tally,
    myVote: mine?.species ?? null,
  };
}

const MIME_EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Check magic bytes so a renamed non-image can't be stored. */
function sniff(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return null;
}

export async function createSubmission(userId: string, claimed: string, file: Buffer, note: string | null) {
  if (!SPECIES_BY_ID[claimed]) throw new Error('Unknown species');
  if (file.length > MAX_UPLOAD_BYTES) throw new Error('Image is larger than 8 MB');
  const mime = sniff(file);
  if (!mime) throw new Error('Only JPEG, PNG or WebP images are allowed');
  const id = crypto.randomUUID();
  const name = `${id}.${MIME_EXT[mime]}`;
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), file);
  db.prepare(`INSERT INTO submission (id, user_id, claimed, file, note, created_at) VALUES (?, ?, ?, ?, ?, ?)`).run(
    id, userId, claimed, name, note?.slice(0, 500) || null, Date.now(),
  );
  return id;
}

export function getSubmission(id: string, viewerId: string | null): Submission | null {
  const row = db.prepare(`${SELECT} WHERE s.id = ?`).get(id) as Row | undefined;
  return row ? hydrate(row, viewerId) : null;
}

export function submissionFile(id: string): { file: string; mime: string } | null {
  const row = db.prepare(`SELECT file FROM submission WHERE id = ?`).get(id) as { file: string } | undefined;
  if (!row) return null;
  const ext = path.extname(row.file).slice(1);
  const mime = Object.entries(MIME_EXT).find(([, e]) => e === ext)?.[0] ?? 'application/octet-stream';
  return { file: path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, row.file), mime };
}

/** Pending photos this user can still vote on (not their own, not already voted). */
export function reviewQueue(userId: string, limit = 20): Submission[] {
  const rows = db
    .prepare(
      `${SELECT} WHERE s.status IN ('pending', 'disputed') AND s.user_id != ?
         AND NOT EXISTS (SELECT 1 FROM vote v WHERE v.submission_id = s.id AND v.user_id = ?)
       ORDER BY s.created_at LIMIT ?`,
    )
    .all(userId, userId, limit) as Row[];
  return rows.map((r) => hydrate(r, userId));
}

export function userSubmissions(userId: string): Submission[] {
  const rows = db.prepare(`${SELECT} WHERE s.user_id = ? ORDER BY s.created_at DESC`).all(userId) as Row[];
  return rows.map((r) => hydrate(r, userId));
}

export function recentlyVerified(limit = 12): Submission[] {
  const rows = db
    .prepare(`${SELECT} WHERE s.status = 'verified' ORDER BY s.created_at DESC LIMIT ?`)
    .all(limit) as Row[];
  return rows.map((r) => hydrate(r, null));
}

export function castVote(submissionId: string, userId: string, species: string): Submission {
  if (!SPECIES_BY_ID[species]) throw new Error('Unknown species');
  const sub = getSubmission(submissionId, userId);
  if (!sub) throw new Error('Photo not found');
  if (sub.userId === userId) throw new Error("You can't vote on your own photo");

  db.prepare(
    `INSERT INTO vote (submission_id, user_id, species, created_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(submission_id, user_id) DO UPDATE SET species = excluded.species, created_at = excluded.created_at`,
  ).run(submissionId, userId, species, Date.now());

  recomputeStatus(submissionId);
  return getSubmission(submissionId, userId)!;
}

/** The uploader's claim counts as one ID; the crowd's votes decide. */
function recomputeStatus(id: string) {
  const sub = getSubmission(id, null)!;
  const counts = new Map<string, number>([[sub.claimed, 1]]);
  for (const t of sub.tally) counts.set(t.species, (counts.get(t.species) ?? 0) + t.count);
  const total = sub.votes + 1;
  const [leader, leaderCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  let status: SubmissionStatus = 'pending';
  let consensus: string | null = null;
  if (sub.votes >= MIN_VOTES && leaderCount / total >= AGREEMENT) {
    status = 'verified';
    consensus = leader;
  } else if (sub.votes >= DISPUTE_AFTER) {
    status = 'disputed';
  }
  db.prepare(`UPDATE submission SET status = ?, consensus = ? WHERE id = ?`).run(status, consensus, id);
}

export async function deleteSubmission(id: string, userId: string) {
  const row = db.prepare(`SELECT file, user_id FROM submission WHERE id = ?`).get(id) as
    | { file: string; user_id: string }
    | undefined;
  if (!row || row.user_id !== userId) throw new Error('Photo not found');
  db.prepare(`DELETE FROM submission WHERE id = ?`).run(id);
  await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, row.file), { force: true });
}
