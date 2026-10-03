import { recheckSubmission } from './community';
import { moveReports } from './reports';
import { query, transaction } from './db';

/**
 * Move a guest's progress, uploads and votes onto the account they just signed in to.
 * Called by Better Auth right before it deletes the guest user.
 */
export async function mergeGuestInto(guestId: string, userId: string) {
  const voted = await query<{ id: string }>(`SELECT submission_id AS id FROM vote WHERE user_id = ?`, [guestId]);
  await transaction(async (conn) => {
    await conn.execute(`UPDATE attempt SET user_id = ? WHERE user_id = ?`, [userId, guestId]);
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
}

/**
 * Remove guests that can never come back (no live session) and left nothing for the
 * community. Their quiz history only mattered to them. Guests who uploaded or voted are kept.
 */
export async function cleanupGuests() {
  const stale = await query<{ id: string }>(
    `SELECT u.id FROM \`user\` u
      WHERE u.isAnonymous = 1
        AND NOT EXISTS (SELECT 1 FROM session s WHERE s.userId = u.id AND s.expiresAt > NOW())
        AND NOT EXISTS (SELECT 1 FROM submission x WHERE x.user_id = u.id)
        AND NOT EXISTS (SELECT 1 FROM vote v WHERE v.user_id = u.id)
      LIMIT 1000`,
  );
  for (const { id } of stale) {
    await transaction(async (conn) => {
      await conn.execute(`DELETE FROM attempt WHERE user_id = ?`, [id]);
      await conn.execute('DELETE FROM session WHERE userId = ?', [id]);
      await conn.execute('DELETE FROM account WHERE userId = ?', [id]);
      await conn.execute('DELETE FROM `user` WHERE id = ?', [id]);
    });
  }
  return stale.length;
}

export async function guestCount() {
  const rows = await query<{ n: number }>('SELECT COUNT(*) AS n FROM `user` WHERE isAnonymous = 1');
  return rows[0]?.n ?? 0;
}
