import { photoSide, topicImageUrl, topicItem, type Topic, type TopicItem } from '@/data/topics';
import type { Rating, Severity, Sex, Stock } from '@/data/topics/types';
import { buildChoices, isScope, pickAdaptive, scopePool, tallyAttempts, type ItemStat, type Mixup } from './adaptive';
import { exec, query } from './db';
import { SEVERITIES, STOCKS } from './grading';
import { pick } from './random';

export { SEVERITIES, STOCKS };
export type { ItemStat };

export interface TopicProgress {
  total: number;
  correct: number;
  items: ItemStat[];
  confusions: Mixup[];
}

export interface TopicQuestion {
  /** "<topic>:<file>". The file name says nothing about the answer. */
  imageKey: string;
  imageUrl: string;
  /** For a photo of two birds, which one to name, e.g. "the bird on the left". */
  focus?: string;
  choices: string[];
}

const SIDE_TEXT: Record<string, (noun: string) => string> = {
  left: (n) => `the ${n} on the left`,
  right: (n) => `the ${n} on the right`,
  top: (n) => `the ${n} on top`,
  bottom: (n) => `the lower ${n}`,
};

const focusText = (topic: Topic, image: string) => {
  const { side } = photoSide(image);
  return side ? SIDE_TEXT[side]?.(topic.noun) : undefined;
};

export const isTopicScope = (topic: Topic, v: unknown): v is string => isScope(topic.groups, v);

export async function getTopicProgress(userId: string, topic: Topic): Promise<TopicProgress> {
  const rows = await query<{ item: string; chosen: string; correct: number; hints: number }>(
    `SELECT item, chosen, correct, hints FROM topic_attempt WHERE user_id = ? AND topic = ? ORDER BY created_at, id`,
    [userId, topic.id],
  );
  const tally = tallyAttempts(topic.items.map((i) => i.id), rows);
  return { total: rows.length, correct: tally.correct, items: tally.stats, confusions: tally.mixups };
}

/** Number of answers per topic, for the quiz list. */
export async function topicTotals(userId: string): Promise<Record<string, { total: number; correct: number }>> {
  const rows = await query<{ topic: string; total: number; correct: number }>(
    `SELECT topic, COUNT(*) AS total, SUM(correct) AS correct FROM topic_attempt WHERE user_id = ? GROUP BY topic`,
    [userId],
  );
  return Object.fromEntries(rows.map((r) => [r.topic, { total: r.total, correct: r.correct }]));
}

/** Adaptive, like the leaf quiz: weak and unseen items come up more, wrong choices are look-alikes. */
export async function nextTopicQuestion(userId: string, topic: Topic, scope: string, avoid: string[] = []): Promise<TopicQuestion | null> {
  const progress = await getTopicProgress(userId, topic);
  const pool = scopePool(topic.items.filter((i) => i.images.length > 0), scope, progress.items);
  if (pool.length === 0) return null;

  const target = pickAdaptive(pool, progress.items, avoid);
  const file = pick(target.images);
  return {
    imageKey: `${topic.id}:${file}`,
    imageUrl: topicImageUrl(topic, file),
    focus: focusText(topic, file),
    choices: choicesFor(topic, target, progress),
  };
}

const choicesFor = (topic: Topic, target: TopicItem, progress: TopicProgress) =>
  buildChoices(target, topic.items, progress.confusions.filter((c) => c.item === target.id).map((c) => c.chosen));

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

// ---- Grading: severity (minor / moderate / major) and AGS / UGS ----

/** Grading answers are kept as topic_attempt rows under their own topic id, apart from the ID answers. */
export const gradeTopicId = (topicId: string) => `${topicId}:grade`;

export const isGraded = (topic: Topic) => topic.items.some((i) => i.ratings?.length);

/** Which of an item's rating cases a question asks about. `when` is the condition to show, if any. */
export interface GradeCase { index: number; when?: string }

export function pickGradeCase(item: TopicItem): GradeCase | null {
  if (!item.ratings?.length) return null;
  const index = Math.floor(Math.random() * item.ratings.length);
  return { index, when: item.ratings[index].when };
}

export interface GradeQuestion {
  imageKey: string;
  imageUrl: string;
  item: string;
  grade: GradeCase;
}

export interface GradeResult {
  rating: Rating;
  severityOk: boolean;
  stockOk: boolean;
}

export function getGradeProgress(userId: string, topic: Topic) {
  return getTopicProgress(userId, { ...topic, id: gradeTopicId(topic.id) });
}

/** A named photo to grade; items you grade wrong come up more often. */
export async function nextGradeQuestion(userId: string, topic: Topic, avoid: string[] = []): Promise<GradeQuestion | null> {
  const pool = topic.items.filter((i) => i.images.length > 0 && i.ratings?.length);
  if (pool.length === 0) return null;
  const target = pickAdaptive(pool, (await getGradeProgress(userId, topic)).items, avoid);
  const file = pick(target.images);
  return { imageKey: `${topic.id}:${file}`, imageUrl: topicImageUrl(topic, file), item: target.id, grade: pickGradeCase(target)! };
}

export async function recordGrade(userId: string, topic: Topic, item: TopicItem, caseIndex: number, severity: Severity, stock: Stock): Promise<GradeResult> {
  const rating = item.ratings?.[caseIndex];
  if (!rating) throw new Error('Invalid answer');
  const severityOk = rating.severity === severity;
  const stockOk = rating.stock === stock;
  await recordTopicAttempt(userId, { ...topic, id: gradeTopicId(topic.id) }, {
    item: item.id,
    chosen: `${severity}/${stock}`,
    correct: severityOk && stockOk,
    hints: 0,
  });
  return { rating, severityOk, stockOk };
}

// ---- Pairs: a species' male and female shown together; name the species ----

/** Pair answers are kept as topic_attempt rows under their own topic id, apart from the photo ID answers. */
export const pairTopicId = (topicId: string) => `${topicId}:pairs`;

interface PairSpecies { item: TopicItem; male: TopicItem; female: TopicItem }

/** Each species with photos of both sexes, as a stand-in item so progress and picking work as in the photo quiz. */
function pairSpecies(topic: Topic): PairSpecies[] {
  return Object.entries(topic.pairs ?? {}).flatMap(([id, name]) => {
    const of = (sex: Sex) => topic.items.find((i) => i.pair?.species === id && i.pair.sex === sex && i.images.length > 0);
    const male = of('male'), female = of('female');
    if (!male || !female) return [];
    const lookalikes = [...male.lookalikes, ...female.lookalikes]
      .map((l) => topicItem(topic, l)?.pair?.species)
      .filter((s): s is string => !!s && s !== id);
    const item: TopicItem = { id, name, group: male.group, tips: [male.tips[0], female.tips[0]], lookalikes: [...new Set(lookalikes)], images: [] };
    return [{ item, male, female }];
  });
}

export const hasPairs = (topic: Topic) => pairSpecies(topic).length >= 2;

/** The male-and-female quiz as a topic of its own, one item per species. */
export function pairTopic(topic: Topic): Topic {
  return { ...topic, id: pairTopicId(topic.id), items: pairSpecies(topic).map((p) => p.item) };
}

/** What the pairs quiz needs in the browser: each species with what to look for in each sex. */
export const clientPairs = (topic: Topic) =>
  pairSpecies(topic).map((p) => ({ id: p.item.id, name: p.item.name, anchor: p.male.id, male: p.male.tips, female: p.female.tips }));

/** One photo with both birds in it (`together`), or a male photo and a female photo side by side. */
interface PairView { together?: string; male: string; female: string }

function pairViews(p: PairSpecies): PairView[] {
  const sameFile = (a: string, b: string) => photoSide(a).file === photoSide(b).file;
  const single = (i: TopicItem) => i.images.filter((x) => !photoSide(x).side);
  const together = p.male.images.flatMap((m) => {
    const f = photoSide(m).side && p.female.images.find((x) => sameFile(x, m));
    return f ? [{ together: photoSide(m).file, male: m, female: f }] : [];
  });
  return [...together, ...single(p.male).flatMap((male) => single(p.female).map((female) => ({ male, female })))];
}

const viewKey = (v: PairView) => v.together ?? `${v.male}+${v.female}`;

const SIDE_LABEL: Record<string, string> = { left: 'on the left', right: 'on the right', top: 'on top', bottom: 'below' };

export interface PairQuestion {
  /** "<topic>:<file>" for a photo of both, or "<topic>:<male file>+<female file>". */
  imageKey: string;
  photos: { url: string; label: string }[];
  choices: string[];
}

/** Which species a pair question shows. */
export function pairForKey(topic: Topic, imageKey: string): TopicItem | null {
  const [t, key] = imageKey.split(':');
  if (t !== topic.id || !key) return null;
  return pairSpecies(topic).find((p) => pairViews(p).some((v) => viewKey(v) === key))?.item ?? null;
}

/** Adaptive like the photo quiz; the wrong choices are look-alike species. */
export async function nextPairQuestion(userId: string, topic: Topic, avoid: string[] = []): Promise<PairQuestion | null> {
  const species = pairSpecies(topic);
  if (species.length < 2) return null;
  const pt = { ...topic, id: pairTopicId(topic.id), items: species.map((p) => p.item) };
  const progress = await getTopicProgress(userId, pt);
  const chosen = pickAdaptive(pt.items, progress.items, avoid);
  const target = species.find((p) => p.item.id === chosen.id)!;

  // A photo of the two together comes up about as often as two separate photos.
  const views = pairViews(target);
  const together = views.filter((v) => v.together), apart = views.filter((v) => !v.together);
  const view = together.length && (!apart.length || Math.random() < 0.5) ? pick(together) : pick(apart);
  const side = (image: string) => SIDE_LABEL[photoSide(image).side ?? ''] ?? '';
  const photos = view.together
    ? [{ url: topicImageUrl(topic, view.together), label: `Male ${side(view.male)}, female ${side(view.female)}` }]
    : [{ url: topicImageUrl(topic, view.male), label: 'Male' }, { url: topicImageUrl(topic, view.female), label: 'Female' }];
  return { imageKey: `${topic.id}:${viewKey(view)}`, photos, choices: choicesFor(pt, target.item, progress) };
}
