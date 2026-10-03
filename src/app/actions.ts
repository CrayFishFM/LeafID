'use server';

import { revalidatePath } from 'next/cache';
import { SPECIES_BY_ID } from '@/data/species';
import { requireUser } from '@/lib/auth';
import { castVote, deleteSubmission } from '@/lib/community';
import { speciesForKey } from '@/lib/photos';
import { recordAttempt } from '@/lib/progress';
import { hintFor, isScope, MAX_HINTS, nextQuestion } from '@/lib/quiz';

export async function getQuestion(scope: string, avoid: string[]) {
  const user = await requireUser();
  return await nextQuestion(user.id, isScope(scope) ? scope : 'all', avoid.slice(0, 5));
}

export async function getHint(imageKey: string, level: number) {
  await requireUser();
  const species = await speciesForKey(imageKey);
  if (!species || level < 0 || level >= MAX_HINTS) return null;
  return hintFor(species, level);
}

export async function submitAnswer(imageKey: string, chosen: string, hints: number) {
  const user = await requireUser();
  const species = await speciesForKey(imageKey);
  if (!species || !SPECIES_BY_ID[chosen]) throw new Error('Invalid answer');
  const correct = species === chosen;
  await recordAttempt(user.id, {
    species,
    chosen,
    correct,
    hints: Math.max(0, Math.min(MAX_HINTS, Math.floor(hints))),
    image: imageKey,
  });
  return { correct, species };
}

export async function vote(submissionId: string, species: string) {
  const user = await requireUser();
  // No revalidation: the card reveals the result in place, and a refresh would drop it from the queue.
  return await castVote(submissionId, user.id, species);
}

export async function removeSubmission(submissionId: string) {
  const user = await requireUser();
  await deleteSubmission(submissionId, user.id);
  revalidatePath('/community/mine');
}
