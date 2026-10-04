import { recheckSubmission } from './community';
import { moveReports } from './reports';
import { exec, one, query, transaction } from './db';

const DAY = 86_400_000;

/**
 * Move a guest's progress, uploads and votes onto the account they just signed in to.
 * Called by Better Auth right before it deletes the guest user.
 */
export async function mergeGuestInto(guestId: string, userId: string) {
  const voted = await query<{ id: string }>(`SELECT submission_id AS id FROM vote WHERE user_id = ?`, [guestId]);
  const guest = await one<{ createdAt: Date }>('SELECT createdAt FROM `user` WHERE id = ?', [guestId]);
  let answers = 0;
  await transaction(async (conn) => {
    const [a] = await conn.execute(`UPDATE attempt SET user_id = ? WHERE user_id = ?`, [userId, guestId]);
    const [t] = await conn.execute(`UPDATE topic_attempt SET user_id = ? WHERE user_id = ?`, [userId, guestId]);
    answers = ((a as { affectedRows?: number }).affectedRows ?? 0) + ((t as { affectedRows?: number }).affectedRows ?? 0);
    await conn.execute(`UPDATE submission SET user_id = ? WHERE user_id = ?`, [userId, guestId]);
    // If both the guest and the account voted on a photo, keep the account's vote.
    await conn.execute(`UPDATE IGNORE vote SET user_id = ? WHERE user_id = ?`, [userId, guestId]);
    await conn.execute(`DELETE FROM vote WHERE user_id = ?`, [guestId]);
    // Nobody may vote on their own photo, including after a merge.
    await conn.execute(
      `DELETE v FROM vote v JOIN submission s ON s.id = v.submission_id WHERE v.user_id = ? AND s.user_id = ?`,
      [userId, userId],
    );
  });
  for (const { id } of voted) await recheckSubmission(id);
  await moveReports(guestId, userId);
  // For the admin dashboard: how many guests go on to make an account.
  await exec(`INSERT INTO guest_conversion (user_id, guest_created_at, answers, created_at) VALUES (?, ?, ?, ?)`, [
    userId, guest ? new Date(guest.createdAt).getTime() : null, answers, Date.now(),
  ]).catch((e) => console.error('[guests] could not record conversion:', e.message));
}

/** Guests that can never come back (no live session) and left nothing for the community. */
const STALE_GUEST = `u.isAnonymous = 1
  AND NOT EXISTS (SELECT 1 FROM session s WHERE s.userId = u.id AND s.expiresAt > NOW())
  AND NOT EXISTS (SELECT 1 FROM submission x WHERE x.user_id = u.id)
  AND NOT EXISTS (SELECT 1 FROM vote v WHERE v.user_id = u.id)`;

/**
 * Remove stale guests. Their quiz history only mattered to them.
 * Guests who uploaded or voted are kept so community photos keep their history.
 */
export async function cleanupGuests() {
  const stale = await query<{ id: string }>(`SELECT u.id FROM \`user\` u WHERE ${STALE_GUEST} LIMIT 1000`);
  for (const { id } of stale) {
    await transaction(async (conn) => {
      await conn.execute(`DELETE FROM attempt WHERE user_id = ?`, [id]);
      await conn.execute(`DELETE FROM topic_attempt WHERE user_id = ?`, [id]);
      await conn.execute('DELETE FROM session WHERE userId = ?', [id]);
      await conn.execute('DELETE FROM account WHERE userId = ?', [id]);
      await conn.execute('DELETE FROM `user` WHERE id = ?', [id]);
    });
  }
  lastCleanup = { at: Date.now(), removed: stale.length };
  return stale.length;
}

/** Last cleanup run in this server process (cleanup runs on start and then daily). */
let lastCleanup: { at: number; removed: number } | null = null;

export async function guestCount() {
  const rows = await query<{ n: number }>('SELECT COUNT(*) AS n FROM `user` WHERE isAnonymous = 1');
  return rows[0]?.n ?? 0;
}

export interface GuestStats {
  total: number;
  newThisWeek: number;
  /** Still have a session, so they can come back. */
  live: number;
  /** Answered a question in the last 7 days. */
  activeThisWeek: number;
  /** Uploaded or voted; kept by cleanup even after their session ends. */
  contributors: number;
  /** Will be removed by the next cleanup. */
  removable: number;
  /** Sessions that end in the next 7 days (unless the guest visits again). */
  expiringSoon: number;
  answers: { guests: number; everyone: number };
  uploads: number;
  votes: number;
  conversions: { total: number; thisWeek: number; answersMoved: number };
  lastCleanup: { at: number; removed: number } | null;
}

export async function guestStats(): Promise<GuestStats> {
  const weekAgo = Date.now() - 7 * DAY;
  const g = `(SELECT id FROM \`user\` WHERE isAnonymous = 1)`;
  const [users, active, answers, community, conversions] = await Promise.all([
    one<Record<'total' | 'newThisWeek' | 'live' | 'contributors' | 'removable' | 'expiringSoon', number | null>>(
      `SELECT COUNT(*) AS total,
              SUM(u.createdAt >= ?) AS newThisWeek,
              SUM(EXISTS (SELECT 1 FROM session s WHERE s.userId = u.id AND s.expiresAt > NOW())) AS live,
              SUM(EXISTS (SELECT 1 FROM submission x WHERE x.user_id = u.id) OR EXISTS (SELECT 1 FROM vote v WHERE v.user_id = u.id)) AS contributors,
              SUM(${STALE_GUEST}) AS removable,
              SUM((SELECT MAX(s.expiresAt) FROM session s WHERE s.userId = u.id) BETWEEN NOW() AND NOW() + INTERVAL 7 DAY) AS expiringSoon
         FROM \`user\` u WHERE u.isAnonymous = 1`,
      [new Date(weekAgo)],
    ),
    one<{ n: number }>(
      `SELECT COUNT(DISTINCT user_id) AS n FROM (
         SELECT user_id FROM attempt WHERE created_at >= ? AND user_id IN ${g}
         UNION ALL SELECT user_id FROM topic_attempt WHERE created_at >= ? AND user_id IN ${g}) x`,
      [weekAgo, weekAgo],
    ),
    one<{ guests: number | null; everyone: number }>(
      `SELECT SUM(user_id IN ${g}) AS guests, COUNT(*) AS everyone FROM (
         SELECT user_id FROM attempt WHERE created_at >= ?
         UNION ALL SELECT user_id FROM topic_attempt WHERE created_at >= ?) x`,
      [weekAgo, weekAgo],
    ),
    one<{ uploads: number; votes: number }>(
      `SELECT (SELECT COUNT(*) FROM submission WHERE user_id IN ${g}) AS uploads,
              (SELECT COUNT(*) FROM vote WHERE user_id IN ${g}) AS votes`,
    ),
    one<{ total: number; thisWeek: number | null; answersMoved: number | null }>(
      `SELECT COUNT(*) AS total, SUM(created_at >= ?) AS thisWeek, SUM(answers) AS answersMoved FROM guest_conversion`,
      [weekAgo],
    ),
  ]);
  return {
    total: users?.total ?? 0,
    newThisWeek: users?.newThisWeek ?? 0,
    live: users?.live ?? 0,
    activeThisWeek: active?.n ?? 0,
    contributors: users?.contributors ?? 0,
    removable: users?.removable ?? 0,
    expiringSoon: users?.expiringSoon ?? 0,
    answers: { guests: answers?.guests ?? 0, everyone: answers?.everyone ?? 0 },
    uploads: community?.uploads ?? 0,
    votes: community?.votes ?? 0,
    conversions: { total: conversions?.total ?? 0, thisWeek: conversions?.thisWeek ?? 0, answersMoved: conversions?.answersMoved ?? 0 },
    lastCleanup,
  };
}
