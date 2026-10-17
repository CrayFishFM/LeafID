import { DEFECTS } from './defects';
import { FISH } from './fish';
import type { Topic, TopicItem } from './types';

export type { Topic, TopicItem } from './types';

/**
 * Starting content for the extra quizzes beside leaf ID. It is copied into the database on
 * start (quiz_topic / quiz_item) and from then on admins edit it there; changing a name or tip
 * here does not overwrite the database. New topics, new items and new photos are picked up.
 * Put a topic's photos in public/quizzes/<id>/.
 */
export const TOPIC_SEED: Topic[] = [FISH, DEFECTS];

export function topicItem(topic: Topic, id: string): TopicItem | undefined {
  return topic.items.find((i) => i.id === id);
}

export const topicImageUrl = (topic: Topic, file: string) => `/quizzes/${topic.id}/${file}`;

/** Full display name, e.g. "Brook trout (Speckled trout)". */
export const itemLabel = (i: TopicItem) => (i.aka ? `${i.name} (${i.aka})` : i.name);

/** An item without its photo list or ratings, so the answer to a question is not sent to the browser. */
export const clientItem = (i: TopicItem) => ({
  id: i.id, name: i.name, aka: i.aka, note: i.note, scientific: i.scientific, group: i.group, tips: i.tips, lookalikes: i.lookalikes,
});
