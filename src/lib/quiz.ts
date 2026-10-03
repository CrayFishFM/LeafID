import { GROUPS, SPECIES, SPECIES_BY_ID, type GroupId } from '@/data/species';
import { allPhotos } from './photos';
import { getProgress } from './progress';

export interface Question {
  imageKey: string;
  imageUrl: string;
  community: boolean;
  credit: string | null;
  choices: string[];
}

export type QuizScope = GroupId | 'all' | 'weak';

export function isScope(v: unknown): v is QuizScope {
  return v === 'all' || v === 'weak' || (typeof v === 'string' && v in GROUPS);
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

function weightedPick(items: { id: string; w: number }[]): string {
  const total = items.reduce((a, i) => a + i.w, 0);
  let r = Math.random() * total;
  for (const i of items) if ((r -= i.w) <= 0) return i.id;
  return items[items.length - 1].id;
}

/**
 * Adaptive question: species the learner is weak on (or hasn't seen) come up more often,
 * and wrong choices are drawn from look-alikes and the learner's own past mix-ups.
 */
export function nextQuestion(userId: string, scope: QuizScope, avoid: string[] = []): Question | null {
  const progress = getProgress(userId);
  const photos = allPhotos();
  const withPhotos = new Set(photos.map((p) => p.species));

  let pool = SPECIES.filter((s) => withPhotos.has(s.id));
  if (scope === 'weak') {
    const weak = progress.species.filter((s) => s.level === 'struggling' || s.level === 'learning').map((s) => s.id);
    if (weak.length >= 2) pool = pool.filter((s) => weak.includes(s.id));
  } else if (scope !== 'all') {
    pool = pool.filter((s) => s.group === scope);
  }
  if (pool.length === 0) return null;

  const stats = new Map(progress.species.map((s) => [s.id, s]));
  const candidates = pool.length > 2 ? pool.filter((s) => !avoid.includes(s.id)) : pool;
  const target = weightedPick(
    candidates.map((s) => {
      const st = stats.get(s.id)!;
      return { id: s.id, w: st.attempts === 0 ? 3 : 0.3 + (1 - st.mastery) * 4 };
    }),
  );

  const photo = pick(photos.filter((p) => p.species === target));

  // Distractors: personal confusions first, then look-alikes, then same group, then anything.
  const distractors: string[] = [];
  const add = (id: string) => {
    if (id !== target && SPECIES_BY_ID[id] && !distractors.includes(id) && distractors.length < 3) distractors.push(id);
  };
  const personal = progress.confusions.filter((c) => c.species === target).map((c) => c.chosen);
  shuffle(personal).slice(0, 1).forEach(add);
  shuffle(SPECIES_BY_ID[target].lookalikes.map((l) => l.id)).forEach(add);
  shuffle(SPECIES.filter((s) => s.group === SPECIES_BY_ID[target].group).map((s) => s.id)).forEach(add);
  shuffle(SPECIES.map((s) => s.id)).forEach(add);

  return {
    imageKey: photo.key,
    imageUrl: photo.url,
    community: !!photo.community,
    credit: photo.credit ? `${photo.credit.artist} · ${photo.credit.license}` : photo.community ? 'Community photo' : null,
    choices: shuffle([target, ...distractors]),
  };
}

/** Progressive hints that narrow the answer without giving it away. */
export function hintFor(species: string, level: number): string | null {
  const s = SPECIES_BY_ID[species];
  if (!s) return null;
  const hints = [
    `Leaves are ${s.arrangement} and ${s.leafType}.`,
    `Shape: ${s.shape}. Margin: ${s.margin.toLowerCase()}.`,
    `Look for this: ${s.keyFeatures[0].charAt(0).toLowerCase()}${s.keyFeatures[0].slice(1)}.`,
  ];
  return hints[level] ?? null;
}

export const MAX_HINTS = 3;
