import { SKIPPED } from './answers';
import { ALPHA, levelFor, type Level } from './levels';
import { shuffle, weightedPick } from './random';

/*
 * The adaptive quiz logic shared by leaf ID and the extra quizzes (fish, defects, water birds…):
 * scoring past answers, choosing what to ask next and choosing the wrong answers.
 */

export interface ItemStat {
  id: string;
  attempts: number;
  correct: number;
  /** 0–1, exponentially weighted so recent answers count most. */
  mastery: number;
  level: Level;
}

export interface Mixup { item: string; chosen: string; count: number }

export interface AttemptRow { item: string; chosen: string; correct: number; hints: number }

/** Per-item stats and mix-ups (most common first) from answers in the order they were given. */
export function tallyAttempts(ids: string[], rows: AttemptRow[]) {
  const stats = new Map<string, ItemStat>(ids.map((id) => [id, { id, attempts: 0, correct: 0, mastery: 0, level: 'new' }]));
  const mixups = new Map<string, Mixup>();
  let correct = 0;
  for (const r of rows) {
    const s = stats.get(r.item);
    if (!s) continue;
    // A hinted correct answer counts as half-learned.
    const score = r.correct ? (r.hints > 0 ? 0.5 : 1) : 0;
    s.attempts++;
    s.correct += r.correct;
    s.mastery += ALPHA * (score - s.mastery);
    correct += r.correct;
    if (!r.correct && r.chosen !== SKIPPED) {
      const k = `${r.item}>${r.chosen}`;
      const m = mixups.get(k) ?? { item: r.item, chosen: r.chosen, count: 0 };
      m.count++;
      mixups.set(k, m);
    }
  }
  for (const s of stats.values()) s.level = levelFor(s.attempts, s.mastery);
  return { stats: [...stats.values()], correct, mixups: [...mixups.values()].sort((a, b) => b.count - a.count) };
}

/** A quiz scope: 'all', 'weak' or one of the groups. */
export function isScope(groups: Record<string, unknown>, v: unknown): v is string {
  return v === 'all' || v === 'weak' || (typeof v === 'string' && v in groups);
}

/** The items a scope asks about. "Weak" falls back to everything until there are two weak items. */
export function scopePool<T extends { id: string; group: string }>(pool: T[], scope: string, stats: ItemStat[]): T[] {
  if (scope === 'weak') {
    const weak = stats.filter((s) => s.level === 'struggling' || s.level === 'learning').map((s) => s.id);
    return weak.length >= 2 ? pool.filter((i) => weak.includes(i.id)) : pool;
  }
  return scope === 'all' ? pool : pool.filter((i) => i.group === scope);
}

/** Weak and unseen items are picked more often; recently asked ones are skipped. */
export function pickAdaptive<T extends { id: string }>(pool: T[], stats: ItemStat[], avoid: string[]): T {
  const byId = new Map(stats.map((s) => [s.id, s]));
  // Skip recently asked items, unless that leaves nothing (e.g. a 3-item group after 3 answers).
  const fresh = pool.filter((i) => !avoid.includes(i.id));
  const candidates = pool.length > 2 && fresh.length > 0 ? fresh : pool;
  return weightedPick(candidates.map((item) => {
    const st = byId.get(item.id);
    return { item, w: !st || st.attempts === 0 ? 3 : 0.3 + (1 - st.mastery) * 4 };
  }));
}

/**
 * The answer plus three wrong choices, shuffled: one of the learner's past mix-ups for this item
 * (`mixedWith`), then look-alikes, then the same group, then anything.
 */
export function buildChoices(
  target: { id: string; group: string; lookalikes: string[] },
  all: { id: string; group: string }[],
  mixedWith: string[],
): string[] {
  const ids = new Set(all.map((i) => i.id));
  const wrong: string[] = [];
  const add = (id: string) => {
    if (id !== target.id && ids.has(id) && !wrong.includes(id) && wrong.length < 3) wrong.push(id);
  };
  shuffle(mixedWith).slice(0, 1).forEach(add);
  shuffle(target.lookalikes).forEach(add);
  shuffle(all.filter((i) => i.group === target.group).map((i) => i.id)).forEach(add);
  shuffle(all.map((i) => i.id)).forEach(add);
  return shuffle([target.id, ...wrong]);
}

/** A hint count from the browser, kept within 0…max. */
export const clampHints = (hints: number, max: number) => Math.max(0, Math.min(max, Math.floor(hints) || 0));
