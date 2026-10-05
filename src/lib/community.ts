import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { exec, LEGACY_UPLOAD_DIR, one, query, transaction } from './db';
import { isSpecies } from './leaf';

export type SubmissionStatus = 'pending' | 'verified' | 'disputed' | 'rejected';

/** Votes needed from other users before a photo can be verified. */
export const MIN_VOTES = 1;
/** Share of all IDs (uploader's claim + votes) the leading species needs. */
export const AGREEMENT = 0.7;
/** After this many votes with no agreement, the photo is marked disputed. */
export const DISPUTE_AFTER = 6;

/** Plain-language version of the rule above, for page copy. */
export function verificationRule() {
  if (MIN_VOTES === 1) {
    return "as soon as someone else agrees with the uploader's ID (if people disagree, it waits until " +
      `${Math.round(AGREEMENT * 100)}% of all IDs match)`;
  }
  return `once at least ${MIN_VOTES} other people have voted and ${Math.round(AGREEMENT * 100)}% of all IDs agree`;
}

export interface Submission {
  id: string;
  userId: string;
  uploader: string;
  uploaderEmail: string | null;
  claimed: string;
  note: string | null;
  status: SubmissionStatus;
  consensus: string | null;
  createdAt: number;
  votes: number;
  tally: { species: string; count: number }[];
  myVote: string | null;
  /** Set by an admin (or auto-approval); the crowd can no longer change the outcome. */
  moderated: boolean;
  /** Pl@ntNet confidence when auto-approved, otherwise null. */
  autoScore: number | null;
}

interface Row {
  id: string;
  user_id: string;
  uploader: string | null;
  uploader_email: string | null;
  claimed: string;
  note: string | null;
  status: SubmissionStatus;
  consensus: string | null;
  created_at: number;
  moderated: number;
  auto_score: number | null;
}

// Guests have random placeholder emails, so theirs is reported as null.
const SELECT =
  'SELECT s.*, u.name AS uploader, CASE WHEN u.isAnonymous = 1 THEN NULL ELSE u.email END AS uploader_email ' +
  'FROM submission s LEFT JOIN `user` u ON u.id = s.user_id';

/** Attach vote tallies (and the viewer's own vote) to rows with two queries total. */
async function hydrate(rows: Row[], viewerId: string | null): Promise<Submission[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const marks = ids.map(() => '?').join(',');
  const tallies = await query<{ submission_id: string; species: string; count: number }>(
    `SELECT submission_id, species, COUNT(*) AS count FROM vote WHERE submission_id IN (${marks})
      GROUP BY submission_id, species ORDER BY count DESC`,
    ids,
  );
  const mine = viewerId
    ? await query<{ submission_id: string; species: string }>(
        `SELECT submission_id, species FROM vote WHERE user_id = ? AND submission_id IN (${marks})`,
        [viewerId, ...ids],
      )
    : [];
  return rows.map((row) => {
    const tally = tallies.filter((t) => t.submission_id === row.id).map(({ species, count }) => ({ species, count }));
    return {
      id: row.id,
      userId: row.user_id,
      uploader: row.uploader ?? 'Unknown',
      uploaderEmail: row.uploader_email,
      claimed: row.claimed,
      note: row.note,
      status: row.status,
      consensus: row.consensus,
      createdAt: Number(row.created_at),
      votes: tally.reduce((n, t) => n + t.count, 0),
      tally,
      myVote: mine.find((m) => m.submission_id === row.id)?.species ?? null,
      moderated: !!row.moderated,
      autoScore: row.auto_score,
    };
  });
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

/**
 * `approve`: an admin uploading their own photo can verify it straight away (an admin decision).
 * `autoScore`: Pl@ntNet agreed with `claimed` this confidently, so it's verified without a vote.
 */
export async function createSubmission(
  userId: string, claimed: string, file: Buffer, note: string | null, approve = false, autoScore: number | null = null,
) {
  const verified = approve || autoScore !== null;
  if (!(await isSpecies(claimed))) throw new Error('Unknown species');
  if (file.length > MAX_UPLOAD_BYTES) throw new Error('Image is larger than 8 MB');
  const mime = sniff(file);
  if (!mime) throw new Error('Only JPEG, PNG or WebP images are allowed');
  const id = crypto.randomUUID();
  // The photo row and its bytes are written together, so there's never one without the other.
  await transaction(async (conn) => {
    await conn.execute(
      `INSERT INTO submission (id, user_id, claimed, file, note, status, consensus, moderated, auto_score, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        // `file` is kept as a descriptive name; the bytes live in submission_image.
        id, userId, claimed, `${id}.${MIME_EXT[mime]}`, note?.slice(0, 500) || null,
        // Moderated so a later recount of (zero) votes can't drop it back to pending.
        verified ? 'verified' : 'pending', verified ? claimed : null, verified ? 1 : 0,
        approve ? null : autoScore, Date.now(),
      ],
    );
    await conn.execute(`INSERT INTO submission_image (submission_id, mime, data) VALUES (?, ?, ?)`, [id, mime, file]);
  });
  return id;
}

export async function getSubmission(id: string, viewerId: string | null): Promise<Submission | null> {
  const rows = await query<Row>(`${SELECT} WHERE s.id = ?`, [id]);
  return (await hydrate(rows, viewerId))[0] ?? null;
}

export async function submissionImage(id: string): Promise<{ data: Buffer; mime: string } | null> {
  return (await one<{ data: Buffer; mime: string }>(`SELECT data, mime FROM submission_image WHERE submission_id = ?`, [id])) ?? null;
}

/**
 * One-time move of photos saved as files (before they were stored in the database).
 * Photos whose file is gone — e.g. wiped by a redeploy — can't be shown or recovered,
 * so those submissions (and their votes) are removed. Safe to run on every start.
 */
export async function importLegacyImages() {
  const orphans = await query<{ id: string; file: string }>(
    `SELECT s.id, s.file FROM submission s LEFT JOIN submission_image i ON i.submission_id = s.id WHERE i.submission_id IS NULL`,
  );
  let imported = 0;
  let removed = 0;
  for (const { id, file } of orphans) {
    const buf = await fs.readFile(path.join(/*turbopackIgnore: true*/ LEGACY_UPLOAD_DIR, path.basename(file))).catch(() => null);
    const mime = buf && sniff(buf);
    if (buf && mime) {
      await exec(`INSERT IGNORE INTO submission_image (submission_id, mime, data) VALUES (?, ?, ?)`, [id, mime, buf]);
      imported++;
    } else {
      await exec(`DELETE FROM submission WHERE id = ?`, [id]);
      removed++;
    }
  }
  if (imported || removed) {
    console.log(`[uploads] moved ${imported} photo(s) into the database; removed ${removed} whose image file was missing`);
  }
}

/** Pending photos this user can still vote on (not their own, not already voted). */
export async function reviewQueue(userId: string, limit = 20): Promise<Submission[]> {
  const rows = await query<Row>(
    `${SELECT} WHERE s.status IN ('pending', 'disputed') AND s.user_id != ?
       AND NOT EXISTS (SELECT 1 FROM vote v WHERE v.submission_id = s.id AND v.user_id = ?)
     ORDER BY s.created_at LIMIT ?`,
    [userId, userId, limit],
  );
  return hydrate(rows, userId);
}

export async function userSubmissions(userId: string): Promise<Submission[]> {
  return hydrate(await query<Row>(`${SELECT} WHERE s.user_id = ? ORDER BY s.created_at DESC`, [userId]), userId);
}

export async function recentlyVerified(limit = 12): Promise<Submission[]> {
  return hydrate(await query<Row>(`${SELECT} WHERE s.status = 'verified' ORDER BY s.created_at DESC LIMIT ?`, [limit]), null);
}

export async function castVote(submissionId: string, userId: string, species: string): Promise<Submission> {
  if (!(await isSpecies(species))) throw new Error('Unknown species');
  const sub = await getSubmission(submissionId, userId);
  if (!sub) throw new Error('Photo not found');
  if (sub.userId === userId) throw new Error("You can't vote on your own photo");
  if (sub.status === 'rejected') throw new Error('This photo was removed by a moderator');

  await exec(
    `INSERT INTO vote (submission_id, user_id, species, created_at) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE species = VALUES(species), created_at = VALUES(created_at)`,
    [submissionId, userId, species, Date.now()],
  );

  if (!sub.moderated) await recomputeStatus(submissionId);
  return (await getSubmission(submissionId, userId))!;
}

/** Re-evaluate every open photo, e.g. after the voting rules above change. */
export async function recheckOpenSubmissions() {
  const open = await query<{ id: string }>(`SELECT id FROM submission WHERE status IN ('pending', 'disputed') AND moderated = 0`);
  for (const { id } of open) await recomputeStatus(id);
}

/** Re-evaluate a photo after its votes changed outside castVote (e.g. accounts merged). */
export async function recheckSubmission(id: string) {
  const sub = await getSubmission(id, null);
  if (sub && !sub.moderated) await recomputeStatus(id);
}

/** The uploader's claim counts as one ID; the crowd's votes decide. */
async function recomputeStatus(id: string) {
  const sub = await getSubmission(id, null);
  if (!sub) return;
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
  await exec(`UPDATE submission SET status = ?, consensus = ? WHERE id = ?`, [status, consensus, id]);
}

export async function deleteSubmission(id: string, userId: string) {
  const row = await one<{ user_id: string }>(`SELECT user_id FROM submission WHERE id = ?`, [id]);
  if (!row || row.user_id !== userId) throw new Error('Photo not found');
  // The image row goes with it (ON DELETE CASCADE).
  await exec(`DELETE FROM submission WHERE id = ?`, [id]);
}

// ---------- admin moderation ----------

export async function listSubmissions(status: SubmissionStatus | 'all', limit = 60): Promise<Submission[]> {
  const rows =
    status === 'all'
      ? await query<Row>(`${SELECT} ORDER BY s.created_at DESC LIMIT ?`, [limit])
      : await query<Row>(`${SELECT} WHERE s.status = ? ORDER BY s.created_at DESC LIMIT ?`, [status, limit]);
  return hydrate(rows, null);
}

export async function submissionCounts(): Promise<Record<SubmissionStatus, number>> {
  const rows = await query<{ status: SubmissionStatus; n: number }>(`SELECT status, COUNT(*) AS n FROM submission GROUP BY status`);
  const out: Record<SubmissionStatus, number> = { pending: 0, verified: 0, disputed: 0, rejected: 0 };
  for (const r of rows) out[r.status] = r.n;
  return out;
}

/** Admin decision: approve as a species, reject, or hand back to the crowd. */
export async function moderate(id: string, action: 'approve' | 'reject' | 'reopen', species?: string) {
  if (!(await one(`SELECT 1 FROM submission WHERE id = ?`, [id]))) throw new Error('Photo not found');
  if (action === 'approve') {
    if (!species || !(await isSpecies(species))) throw new Error('Choose a species to approve as');
    await exec(`UPDATE submission SET status = 'verified', consensus = ?, moderated = 1, auto_score = NULL WHERE id = ?`, [species, id]);
  } else if (action === 'reject') {
    await exec(`UPDATE submission SET status = 'rejected', consensus = NULL, moderated = 1, auto_score = NULL WHERE id = ?`, [id]);
  } else {
    await transaction(async (conn) => {
      await conn.execute(`DELETE FROM vote WHERE submission_id = ?`, [id]);
      await conn.execute(`UPDATE submission SET status = 'pending', consensus = NULL, moderated = 0, auto_score = NULL WHERE id = ?`, [id]);
    });
  }
}

export async function adminDeleteSubmission(id: string) {
  const res = await exec(`DELETE FROM submission WHERE id = ?`, [id]);
  if (res.affectedRows === 0) throw new Error('Photo not found');
}

/** Remove everything a user created (used when an admin deletes the account). */
export async function deleteUserContent(userId: string) {
  const affected = await query<{ id: string }>(`SELECT DISTINCT submission_id AS id FROM vote WHERE user_id = ?`, [userId]);
  await transaction(async (conn) => {
    await conn.execute(`DELETE FROM submission WHERE user_id = ?`, [userId]);
    await conn.execute(`DELETE FROM vote WHERE user_id = ?`, [userId]);
    await conn.execute(`DELETE FROM attempt WHERE user_id = ?`, [userId]);
    await conn.execute(`DELETE FROM topic_attempt WHERE user_id = ?`, [userId]);
  });
  // Their votes are gone, so re-check photos they had voted on.
  for (const { id } of affected) {
    const sub = await getSubmission(id, null);
    if (sub && !sub.moderated) await recomputeStatus(id);
  }
}
