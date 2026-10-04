'use server';

import { topicItem } from '@/data/topics';
import { SKIPPED } from '@/lib/answers';
import { requireUser } from '@/lib/auth';
import { getTopic } from '@/lib/topics';
import { isTopicScope, itemForKey, nextTopicQuestion, recordTopicAttempt, TOPIC_MAX_HINTS, topicHint } from '@/lib/topic-quiz';

async function topicOrThrow(id: string) {
  const topic = await getTopic(id);
  if (!topic) throw new Error('Unknown quiz');
  return topic;
}

export async function getTopicQuestion(topicId: string, scope: string, avoid: string[]) {
  const user = await requireUser();
  const topic = await topicOrThrow(topicId);
  return await nextTopicQuestion(user.id, topic, isTopicScope(topic, scope) ? scope : 'all', avoid.slice(0, 5));
}

export async function getTopicHint(topicId: string, imageKey: string, level: number) {
  await requireUser();
  const topic = await topicOrThrow(topicId);
  const item = itemForKey(topic, imageKey);
  if (!item || level < 0 || level >= TOPIC_MAX_HINTS) return null;
  return topicHint(topic, item, level);
}

export async function submitTopicAnswer(topicId: string, imageKey: string, chosen: string, hints: number) {
  const user = await requireUser();
  const topic = await topicOrThrow(topicId);
  const item = itemForKey(topic, imageKey);
  if (!item || (chosen !== SKIPPED && !topicItem(topic, chosen))) throw new Error('Invalid answer');
  const correct = item.id === chosen;
  await recordTopicAttempt(user.id, topic, {
    item: item.id,
    chosen,
    correct,
    hints: Math.max(0, Math.min(TOPIC_MAX_HINTS, Math.floor(hints))),
  });
  return { correct, item: item.id };
}
