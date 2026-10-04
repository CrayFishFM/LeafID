import { SKIPPED } from './answers';
import { exec, query } from './db';
import { getLeaf } from './leaf';

export type Level = 'new' | 'struggling' | 'learning' | 'mastered';

export interface SpeciesStat {
  id: string;
  attempts: number;
  correct: number;
  /** 0–1, exponentially weighted so recent answers count most. */
  mastery: number;
  level: Level;
  lastSeen: number | null;
}

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

export const ALPHA = 0.35;
const DAY = 86_400_000;

export function levelFor(attempts: number, mastery: number): Level {
  if (attempts === 0) return 'new';
  if (mastery >= 0.8 && attempts >= 4) return 'mastered';
  if (mastery >= 0.5) return 'learning';
  return 'struggling';
}

export async function getProgress(userId: string): Promise<Progress> {
  const [rows, leaf] = await Promise.all([
    query<AttemptRow>(
      `SELECT species, chosen, correct, hints, created_at FROM attempt WHERE user_id = ? ORDER BY created_at, id`,
      [userId],
    ),
    getLeaf(),
  ]);

  const per = new Map<string, SpeciesStat>(
    leaf.species.map((s) => [s.id, { id: s.id, attempts: 0, correct: 0, mastery: 0, level: 'new', lastSeen: null }]),
  );
  const confusions = new Map<string, Confusion>();
  const weekAgo = Date.now() - 7 * DAY;
  const days = new Set<number>();
  let correct = 0, hinted = 0, last7Total = 0, last7Correct = 0;

  for (const r of rows) {
    const s = per.get(r.species);
    if (!s) continue;
    // A hinted correct answer counts as half-learned.
    const score = r.correct ? (r.hints > 0 ? 0.5 : 1) : 0;
    s.attempts++;
    s.correct += r.correct;
    s.mastery = s.mastery + ALPHA * (score - s.mastery);
    s.lastSeen = r.created_at;
    correct += r.correct;
    if (r.hints > 0) hinted++;
    if (r.created_at >= weekAgo) { last7Total++; last7Correct += r.correct; }
    days.add(Math.floor((r.created_at - new Date().getTimezoneOffset() * 60_000) / DAY));
    if (!r.correct && r.chosen !== SKIPPED) {
      const k = `${r.species}>${r.chosen}`;
      const c = confusions.get(k) ?? { species: r.species, chosen: r.chosen, count: 0 };
      c.count++;
      confusions.set(k, c);
    }
  }
  for (const s of per.values()) s.level = levelFor(s.attempts, s.mastery);

  // Consecutive days of practice ending today (or yesterday).
  const today = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60_000) / DAY);
  let dayStreak = 0;
  for (let d = days.has(today) ? today : today - 1; days.has(d); d--) dayStreak++;

  const groups = Object.keys(leaf.groups).map((id) => {
    const list = [...per.values()].filter((s) => leaf.byId[s.id].group === id);
    return { id, attempts: list.reduce((a, s) => a + s.attempts, 0), correct: list.reduce((a, s) => a + s.correct, 0) };
  });

  return {
    total: rows.length,
    correct,
    hinted,
    last7: { total: last7Total, correct: last7Correct },
    dayStreak,
    species: [...per.values()],
    groups,
    confusions: [...confusions.values()].sort((a, b) => b.count - a.count),
  };
}

export async function recordAttempt(userId: string, a: { species: string; chosen: string; correct: boolean; hints: number; image: string }) {
  await exec(
    `INSERT INTO attempt (user_id, species, chosen, correct, hints, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, a.species, a.chosen, a.correct ? 1 : 0, a.hints, a.image, Date.now()],
  );
}
