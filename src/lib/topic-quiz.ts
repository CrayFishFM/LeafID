import { topicImageUrl, topicItem, type Topic, type TopicItem } from '@/data/topics';
import { SKIPPED } from './answers';
import { exec, query } from './db';
import { ALPHA, levelFor, type Level } from './progress';

export interface ItemStat {
  id: string;
  attempts: number;
  correct: number;
  mastery: number;
  level: Level;
}

export interface TopicProgress {
  total: number;
  correct: number;
  items: ItemStat[];
  confusions: { item: string; chosen: string; count: number }[];
}

export interface TopicQuestion {
  /** "<topic>:<file>". The file name says nothing about the answer. */
  imageKey: string;
  imageUrl: string;
  choices: string[];
}

export const TOPIC_MAX_HINTS = 2;

export function isTopicScope(topic: Topic, v: unknown): v is string {
  return v === 'all' || v === 'weak' || (typeof v === 'string' && v in topic.groups);
}

export async function getTopicProgress(userId: string, topic: Topic): Promise<TopicProgress> {
  const rows = await query<{ item: string; chosen: string; correct: number; hints: number }>(
    `SELECT item, chosen, correct, hints FROM topic_attempt WHERE user_id = ? AND topic = ? ORDER BY created_at, id`,
    [userId, topic.id],
  );
  const per = new Map<string, ItemStat>(topic.items.map((i) => [i.id, { id: i.id, attempts: 0, correct: 0, mastery: 0, level: 'new' }]));
  const confusions = new Map<string, { item: string; chosen: string; count: number }>();
  let correct = 0;
  for (const r of rows) {
    const s = per.get(r.item);
    if (!s) continue;
    // Same scoring as the leaf quiz: a hinted correct answer counts as half-learned.
    const score = r.correct ? (r.hints > 0 ? 0.5 : 1) : 0;
    s.attempts++;
    s.correct += r.correct;
    s.mastery += ALPHA * (score - s.mastery);
    correct += r.correct;
    if (!r.correct && r.chosen !== SKIPPED) {
      const k = `${r.item}>${r.chosen}`;
      const c = confusions.get(k) ?? { item: r.item, chosen: r.chosen, count: 0 };
      c.count++;
      confusions.set(k, c);
    }
  }
  for (const s of per.values()) s.level = levelFor(s.attempts, s.mastery);
  return {
    total: rows.length,
    correct,
    items: [...per.values()],
    confusions: [...confusions.values()].sort((a, b) => b.count - a.count),
  };
}

/** Number of answers per topic, for the quiz list. */
export async function topicTotals(userId: string): Promise<Record<string, { total: number; correct: number }>> {
  const rows = await query<{ topic: string; total: number; correct: number }>(
    `SELECT topic, COUNT(*) AS total, SUM(correct) AS correct FROM topic_attempt WHERE user_id = ? GROUP BY topic`,
    [userId],
  );
  return Object.fromEntries(rows.map((r) => [r.topic, { total: r.total, correct: r.correct }]));
}

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Adaptive, like the leaf quiz: weak and unseen items come up more, wrong choices are look-alikes. */
export async function nextTopicQuestion(userId: string, topic: Topic, scope: string, avoid: string[] = []): Promise<TopicQuestion | null> {
  const progress = await getTopicProgress(userId, topic);
  let pool = topic.items.filter((i) => i.images.length > 0);
  if (scope === 'weak') {
    const weak = progress.items.filter((s) => s.level === 'struggling' || s.level === 'learning').map((s) => s.id);
    if (weak.length >= 2) pool = pool.filter((i) => weak.includes(i.id));
  } else if (scope !== 'all') {
    pool = pool.filter((i) => i.group === scope);
  }
  if (pool.length === 0) return null;

  const stats = new Map(progress.items.map((s) => [s.id, s]));
  // Skip recently asked items, unless that leaves nothing (e.g. a 3-item group after 3 answers).
  const fresh = pool.filter((i) => !avoid.includes(i.id));
  const candidates = pool.length > 2 && fresh.length > 0 ? fresh : pool;
  const weighted = candidates.map((i) => {
    const st = stats.get(i.id)!;
    return { item: i, w: st.attempts === 0 ? 3 : 0.3 + (1 - st.mastery) * 4 };
  });
  let r = Math.random() * weighted.reduce((a, x) => a + x.w, 0);
  let target: TopicItem = weighted[weighted.length - 1].item;
  for (const x of weighted) if ((r -= x.w) <= 0) { target = x.item; break; }

  // Wrong choices: a past mix-up, then look-alikes, then the same group, then anything.
  const distractors: string[] = [];
  const add = (id: string) => {
    if (id !== target.id && topicItem(topic, id) && !distractors.includes(id) && distractors.length < 3) distractors.push(id);
  };
  shuffle(progress.confusions.filter((c) => c.item === target.id).map((c) => c.chosen)).slice(0, 1).forEach(add);
  shuffle(target.lookalikes).forEach(add);
  shuffle(topic.items.filter((i) => i.group === target.group).map((i) => i.id)).forEach(add);
  shuffle(topic.items.map((i) => i.id)).forEach(add);

  const file = pick(target.images);
  return {
    imageKey: `${topic.id}:${file}`,
    imageUrl: topicImageUrl(topic, file),
    choices: shuffle([target.id, ...distractors]),
  };
}

/** Which item a question's photo shows. */
export function itemForKey(topic: Topic, imageKey: string): TopicItem | null {
  const [t, file] = imageKey.split(':');
  if (t !== topic.id || !file) return null;
  return topic.items.find((i) => i.images.includes(file)) ?? null;
}

export function topicHint(topic: Topic, item: TopicItem, level: number): string | null {
  const hints = [`It's in the ${topic.groups[item.group].toLowerCase()} group.`, `Look for this: ${item.tips[0]}`];
  return hints[level] ?? null;
}

export async function recordTopicAttempt(userId: string, topic: Topic, a: { item: string; chosen: string; correct: boolean; hints: number }) {
  await exec(
    `INSERT INTO topic_attempt (user_id, topic, item, chosen, correct, hints, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, topic.id, a.item, a.chosen, a.correct ? 1 : 0, a.hints, Date.now()],
  );
}
