import { buildChoices, isScope as isGroupScope, pickAdaptive, scopePool } from './adaptive';
import type { LeafData } from './leaf-shared';
import { getLeaf } from './leaf';
import { allPhotos } from './photos';
import { getProgress } from './progress';
import { pick } from './random';

export interface Question {
  imageKey: string;
  imageUrl: string;
  community: boolean;
  credit: string | null;
  choices: string[];
}

/** 'all', 'weak' or a group id. */
export type QuizScope = string;

export const isScope = (leaf: LeafData, v: unknown): v is QuizScope => isGroupScope(leaf.groups, v);

/**
 * Adaptive question: species the learner is weak on (or hasn't seen) come up more often,
 * and wrong choices are drawn from look-alikes and the learner's own past mix-ups.
 */
export async function nextQuestion(userId: string, scope: QuizScope, avoid: string[] = []): Promise<Question | null> {
  const [progress, photos, leaf] = await Promise.all([getProgress(userId), allPhotos(), getLeaf()]);
  const withPhotos = new Set(photos.map((p) => p.species));
  const pool = scopePool(leaf.species.filter((s) => withPhotos.has(s.id)), scope, progress.species);
  if (pool.length === 0) return null;

  const target = pickAdaptive(pool, progress.species, avoid);
  const photo = pick(photos.filter((p) => p.species === target.id));
  const mixedWith = progress.confusions.filter((c) => c.species === target.id).map((c) => c.chosen);

  return {
    imageKey: photo.key,
    imageUrl: photo.url,
    community: !!photo.community,
    credit: photo.credit ? `${photo.credit.artist} · ${photo.credit.license}` : photo.community ? 'Community photo' : null,
    choices: buildChoices({ ...target, lookalikes: target.lookalikes.map((l) => l.id) }, leaf.species, mixedWith),
  };
}

/** Progressive hints that narrow the answer without giving it away. */
export async function hintFor(species: string, level: number): Promise<string | null> {
  const s = (await getLeaf()).byId[species];
  if (!s) return null;
  const hints = [
    `Leaves are ${s.arrangement} and ${s.leafType}.`,
    `Shape: ${s.shape}. Margin: ${s.margin.toLowerCase()}.`,
    s.keyFeatures[0] && `Look for this: ${s.keyFeatures[0].charAt(0).toLowerCase()}${s.keyFeatures[0].slice(1)}.`,
  ];
  return hints[level] ?? null;
}

