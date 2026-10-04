'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { castVote, deleteSubmission } from '@/lib/community';
import { speciesForKey } from '@/lib/photos';
import { getLeaf, isSpecies } from '@/lib/leaf';
import { recordAttempt } from '@/lib/progress';
import { isReportReason, reportImage } from '@/lib/reports';
import { hintFor, isScope, MAX_HINTS, nextQuestion } from '@/lib/quiz';

export async function getQuestion(scope: string, avoid: string[]) {
  const user = await requireUser();
  return await nextQuestion(user.id, isScope(await getLeaf(), scope) ? scope : 'all', avoid.slice(0, 5));
}

export async function getHint(imageKey: string, level: number) {
  await requireUser();
  const species = await speciesForKey(imageKey);
  if (!species || level < 0 || level >= MAX_HINTS) return null;
  return await hintFor(species, level);
}

export async function submitAnswer(imageKey: string, chosen: string, hints: number) {
  const user = await requireUser();
  const species = await speciesForKey(imageKey);
  if (!species || !(await isSpecies(chosen))) throw new Error('Invalid answer');
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

export async function report(imageKey: string, reason: string, note: string) {
  const user = await requireUser();
  if (!isReportReason(reason)) return { ok: false as const, error: 'Choose a reason' };
  try {
    const { alreadyReported } = await reportImage(user.id, imageKey, reason, note);
    return { ok: true as const, alreadyReported };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
