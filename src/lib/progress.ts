import { tallyAttempts, type ItemStat } from './adaptive';
import { exec, query } from './db';
import { getLeaf } from './leaf';

export type SpeciesStat = ItemStat;

export interface Confusion {
  species: string;
  chosen: string;
  count: number;
}

export interface Progress {
  total: number;
  correct: number;
  hinted: number;
  last7: { total: number; correct: number };
  dayStreak: number;
  species: SpeciesStat[];
  groups: { id: string; attempts: number; correct: number }[];
  confusions: Confusion[];
}

interface AttemptRow {
  species: string;
  chosen: string;
  correct: number;
  hints: number;
  created_at: number;
}

const DAY = 86_400_000;

export async function getProgress(userId: string): Promise<Progress> {
  const [rows, leaf] = await Promise.all([
    query<AttemptRow>(
      `SELECT species, chosen, correct, hints, created_at FROM attempt WHERE user_id = ? ORDER BY created_at, id`,
      [userId],
    ),
    getLeaf(),
  ]);

  const tally = tallyAttempts(leaf.species.map((s) => s.id), rows.map((r) => ({ ...r, item: r.species })));
  const weekAgo = Date.now() - 7 * DAY;
  const days = new Set<number>();
  let hinted = 0, last7Total = 0, last7Correct = 0;
  for (const r of rows) {
    if (!leaf.byId[r.species]) continue;
    if (r.hints > 0) hinted++;
    if (r.created_at >= weekAgo) { last7Total++; last7Correct += r.correct; }
    days.add(Math.floor((r.created_at - new Date().getTimezoneOffset() * 60_000) / DAY));
  }

  // Consecutive days of practice ending today (or yesterday).
  const today = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60_000) / DAY);
  let dayStreak = 0;
  for (let d = days.has(today) ? today : today - 1; days.has(d); d--) dayStreak++;

  const groups = Object.keys(leaf.groups).map((id) => {
    const list = tally.stats.filter((s) => leaf.byId[s.id].group === id);
    return { id, attempts: list.reduce((a, s) => a + s.attempts, 0), correct: list.reduce((a, s) => a + s.correct, 0) };
  });

  return {
    total: rows.length,
    correct: tally.correct,
    hinted,
    last7: { total: last7Total, correct: last7Correct },
    dayStreak,
    species: tally.stats,
    groups,
    confusions: tally.mixups.map((m) => ({ species: m.item, chosen: m.chosen, count: m.count })),
  };
}

export async function recordAttempt(userId: string, a: { species: string; chosen: string; correct: boolean; hints: number; image: string }) {
  await exec(
    `INSERT INTO attempt (user_id, species, chosen, correct, hints, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, a.species, a.chosen, a.correct ? 1 : 0, a.hints, a.image, Date.now()],
  );
}
