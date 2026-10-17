import { query } from './db';

const DAY = 86_400_000;

export interface Activity {
  total: number;
  correct: number;
  last7: { total: number; correct: number };
  dayStreak: number;
}

/** Answers across every quiz (leaf ID, topic quizzes and defect ratings), for the overall stats. */
export async function getActivity(userId: string): Promise<Activity> {
  const rows = await query<{ correct: number; created_at: number }>(
    `SELECT correct, created_at FROM attempt WHERE user_id = ?
     UNION ALL SELECT correct, created_at FROM topic_attempt WHERE user_id = ?`,
    [userId, userId],
  );
  const weekAgo = Date.now() - 7 * DAY;
  const offset = new Date().getTimezoneOffset() * 60_000;
  const days = new Set<number>();
  let correct = 0, last7Total = 0, last7Correct = 0;
  for (const r of rows) {
    correct += r.correct;
    if (r.created_at >= weekAgo) { last7Total++; last7Correct += r.correct; }
    days.add(Math.floor((r.created_at - offset) / DAY));
  }
  // Consecutive days of practice ending today (or yesterday), as on the leaf quiz.
  const today = Math.floor((Date.now() - offset) / DAY);
  let dayStreak = 0;
  for (let d = days.has(today) ? today : today - 1; days.has(d); d--) dayStreak++;
  return { total: rows.length, correct, last7: { total: last7Total, correct: last7Correct }, dayStreak };
}
