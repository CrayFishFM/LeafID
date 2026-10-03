import { SPECIES_BY_ID } from '@/data/species';
import { moderate } from './community';
import { exec, one, query, transaction } from './db';
import { libraryPhotoByKey } from './photos';

import type { ReportReason } from './report-reasons';

export { isReportReason, REPORT_REASONS, type ReportReason } from './report-reasons';

/** What an image key points at, or null if it doesn't exist (any more). */
async function resolveImage(key: string): Promise<{ url: string; species: string | null; community: boolean } | null> {
  if (key.startsWith('lib:')) {
    const p = libraryPhotoByKey(key);
    return p ? { url: p.url, species: p.species, community: false } : null;
  }
  if (key.startsWith('sub:') && /^sub:[0-9a-f-]{36}$/.test(key)) {
    const row = await one<{ consensus: string | null; claimed: string }>(`SELECT consensus, claimed FROM submission WHERE id = ?`, [key.slice(4)]);
    return row ? { url: `/api/photos/${key.slice(4)}`, species: row.consensus ?? row.claimed, community: true } : null;
  }
  return null;
}

/** File a report. Each person can report a photo once. */
export async function reportImage(userId: string, key: string, reason: ReportReason, note: string | null) {
  if (!(await resolveImage(key))) throw new Error('Photo not found');
  const res = await exec(
    `INSERT IGNORE INTO image_report (image_key, user_id, reason, note, created_at) VALUES (?, ?, ?, ?, ?)`,
    [key, userId, reason, note?.trim().slice(0, 500) || null, Date.now()],
  );
  return { alreadyReported: res.affectedRows === 0 };
}

export interface ReportedImage {
  key: string;
  url: string;
  species: string | null;
  community: boolean;
  count: number;
  firstReported: number;
  reports: { reason: ReportReason; note: string | null; reporter: string; createdAt: number }[];
}

/** Open reports grouped by photo, most-reported first. */
export async function openReports(): Promise<ReportedImage[]> {
  const rows = await query<{ image_key: string; reason: ReportReason; note: string | null; reporter: string | null; is_guest: number | null; created_at: number }>(
    `SELECT r.image_key, r.reason, r.note, u.name AS reporter, u.isAnonymous AS is_guest, r.created_at
       FROM image_report r LEFT JOIN \`user\` u ON u.id = r.user_id
      WHERE r.status = 'open' ORDER BY r.created_at`,
  );
  const byKey = new Map<string, ReportedImage>();
  for (const r of rows) {
    let item = byKey.get(r.image_key);
    if (!item) {
      const img = await resolveImage(r.image_key);
      // The photo was deleted since it was reported; nothing to review.
      if (!img) continue;
      item = { key: r.image_key, ...img, count: 0, firstReported: Number(r.created_at), reports: [] };
      byKey.set(r.image_key, item);
    }
    item.count++;
    item.reports.push({
      reason: r.reason,
      note: r.note,
      reporter: r.reporter == null ? 'Deleted user' : r.is_guest ? 'Guest' : r.reporter,
      createdAt: Number(r.created_at),
    });
  }
  return [...byKey.values()].sort((a, b) => b.count - a.count || a.firstReported - b.firstReported);
}

export async function openReportCount() {
  return (await one<{ n: number }>(`SELECT COUNT(DISTINCT image_key) AS n FROM image_report WHERE status = 'open'`))?.n ?? 0;
}

async function resolveReports(key: string, adminId: string, status: 'actioned' | 'dismissed') {
  await exec(
    `UPDATE image_report SET status = ?, resolved_at = ?, resolved_by = ? WHERE image_key = ? AND status = 'open'`,
    [status, Date.now(), adminId, key],
  );
}

/** Remove a photo from the app: hide a library photo, or reject a community upload. */
export async function pullDownImage(key: string, adminId: string) {
  if (!(await resolveImage(key))) throw new Error('Photo not found');
  if (key.startsWith('lib:')) {
    await exec(`INSERT IGNORE INTO hidden_image (image_key, hidden_by, hidden_at) VALUES (?, ?, ?)`, [key, adminId, Date.now()]);
  } else {
    await moderate(key.slice(4), 'reject');
  }
  await resolveReports(key, adminId, 'actioned');
}

export async function dismissReports(key: string, adminId: string) {
  await resolveReports(key, adminId, 'dismissed');
}

export interface HiddenLibraryImage {
  key: string;
  url: string;
  species: string;
  hiddenBy: string;
  hiddenAt: number;
}

export async function hiddenLibraryImages(): Promise<HiddenLibraryImage[]> {
  const rows = await query<{ image_key: string; hidden_by_name: string | null; hidden_at: number }>(
    `SELECT h.image_key, u.name AS hidden_by_name, h.hidden_at
       FROM hidden_image h LEFT JOIN \`user\` u ON u.id = h.hidden_by ORDER BY h.hidden_at DESC`,
  );
  return rows.flatMap((r) => {
    const p = libraryPhotoByKey(r.image_key);
    return p ? [{ key: p.key, url: p.url, species: p.species, hiddenBy: r.hidden_by_name ?? 'Unknown', hiddenAt: Number(r.hidden_at) }] : [];
  });
}

export async function restoreLibraryImage(key: string) {
  await exec(`DELETE FROM hidden_image WHERE image_key = ?`, [key]);
}

/** Keep a guest's reports when they sign in (see guests.ts). */
export async function moveReports(fromUserId: string, toUserId: string) {
  await transaction(async (conn) => {
    await conn.execute(`UPDATE IGNORE image_report SET user_id = ? WHERE user_id = ?`, [toUserId, fromUserId]);
    await conn.execute(`DELETE FROM image_report WHERE user_id = ?`, [fromUserId]);
  });
}

export const speciesName = (id: string | null) => (id && SPECIES_BY_ID[id] ? SPECIES_BY_ID[id].common : 'Unknown');
