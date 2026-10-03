import { SPECIES } from '@/data/species';
import { submissionCounts } from './community';
import { one, query } from './db';

const DAY = 86_400_000;

export interface DayActivity {
  /** yyyy-mm-dd (server local time) */
  day: string;
  answers: number;
  signups: number;
}

function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function overview() {
  const now = Date.now();
  const weekAgo = now - 7 * DAY;

  const start = new Date(now - 13 * DAY);
  start.setHours(0, 0, 0, 0);

  // Better Auth stores dates as DATETIME; the app stores epoch milliseconds.
  const [users, answers, votes, submissions, attemptTimes, signupTimes] = await Promise.all([
    one<{ total: number; verified: number | null; admins: number | null; banned: number | null; recent: number | null }>(
      `SELECT COUNT(*) AS total,
              SUM(emailVerified = 1) AS verified,
              SUM(role = 'admin') AS admins,
              SUM(banned = 1) AS banned,
              SUM(createdAt >= ?) AS recent
         FROM \`user\``,
      [new Date(weekAgo)],
    ),
    one<{ total: number; correct: number | null; recent: number | null; learners: number }>(
      `SELECT COUNT(*) AS total, SUM(correct) AS correct,
              SUM(created_at >= ?) AS recent,
              COUNT(DISTINCT CASE WHEN created_at >= ? THEN user_id END) AS learners
         FROM attempt`,
      [weekAgo, weekAgo],
    ),
    one<{ n: number }>(`SELECT COUNT(*) AS n FROM vote`),
    submissionCounts(),
    query<{ created_at: number }>(`SELECT created_at FROM attempt WHERE created_at >= ?`, [start.getTime()]),
    query<{ createdAt: Date }>('SELECT createdAt FROM `user` WHERE createdAt >= ?', [start]),
  ]);

  // Last 14 days of answers and sign-ups, zero-filled.
  const days = new Map<string, DayActivity>();
  for (let t = start.getTime(); t <= now; t += DAY) days.set(dayKey(t), { day: dayKey(t), answers: 0, signups: 0 });
  for (const r of attemptTimes) {
    const d = days.get(dayKey(Number(r.created_at)));
    if (d) d.answers++;
  }
  for (const r of signupTimes) {
    const d = days.get(dayKey(new Date(r.createdAt).getTime()));
    if (d) d.signups++;
  }

  return {
    users: {
      total: users?.total ?? 0,
      verified: users?.verified ?? 0,
      admins: users?.admins ?? 0,
      banned: users?.banned ?? 0,
      recent: users?.recent ?? 0,
    },
    answers: {
      total: answers?.total ?? 0,
      correct: answers?.correct ?? 0,
      recent: answers?.recent ?? 0,
      learners: answers?.learners ?? 0,
    },
    submissions,
    votes: votes?.n ?? 0,
    activity: [...days.values()],
  };
}

/** Accuracy per species across all learners — hardest first. */
export async function speciesDifficulty() {
  const rows = await query<{ species: string; attempts: number; correct: number }>(
    `SELECT species, COUNT(*) AS attempts, SUM(correct) AS correct FROM attempt GROUP BY species`,
  );
  const by = new Map(rows.map((r) => [r.species, r]));
  return SPECIES.map((s) => {
    const r = by.get(s.id);
    return { id: s.id, attempts: r?.attempts ?? 0, accuracy: r ? r.correct / r.attempts : null };
  }).sort((a, b) => (a.accuracy ?? 2) - (b.accuracy ?? 2));
}

export async function globalConfusions(limit = 8) {
  return query<{ species: string; chosen: string; count: number }>(
    `SELECT species, chosen, COUNT(*) AS count FROM attempt WHERE correct = 0
     GROUP BY species, chosen ORDER BY count DESC LIMIT ?`,
    [limit],
  );
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string | null;
  banned: boolean;
  banReason: string | null;
  createdAt: Date;
  attempts: number;
  correct: number;
  uploads: number;
  votes: number;
  lastActive: number | null;
}

export const USERS_PER_PAGE = 25;

export async function listUsers(search: string, page: number) {
  const q = `%${search.trim().toLowerCase()}%`;
  const where = 'WHERE LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ?';
  const [count, rows] = await Promise.all([
    one<{ n: number }>(`SELECT COUNT(*) AS n FROM \`user\` u ${where}`, [q, q]),
    query<Omit<AdminUserRow, 'emailVerified' | 'banned'> & { emailVerified: number; banned: number | null }>(
      `SELECT u.id, u.name, u.email, u.emailVerified, u.role, u.banned, u.banReason, u.createdAt,
              COALESCE(a.attempts, 0) AS attempts, COALESCE(a.correct, 0) AS correct, a.lastActive,
              (SELECT COUNT(*) FROM submission s WHERE s.user_id = u.id) AS uploads,
              (SELECT COUNT(*) FROM vote v WHERE v.user_id = u.id) AS votes
         FROM \`user\` u
         LEFT JOIN (
           SELECT user_id, COUNT(*) AS attempts, SUM(correct) AS correct, MAX(created_at) AS lastActive
             FROM attempt GROUP BY user_id
         ) a ON a.user_id = u.id
         ${where}
        ORDER BY u.createdAt DESC LIMIT ? OFFSET ?`,
      [q, q, USERS_PER_PAGE, (page - 1) * USERS_PER_PAGE],
    ),
  ]);
  return {
    total: count?.n ?? 0,
    users: rows.map((r) => ({
      ...r,
      emailVerified: !!r.emailVerified,
      banned: !!r.banned,
      lastActive: r.lastActive == null ? null : Number(r.lastActive),
    })) as AdminUserRow[],
  };
}
