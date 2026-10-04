import { cache } from 'react';
import { TOPIC_SEED, type Topic, type TopicItem } from '@/data/topics';
import { cleanLines, cleanText, parseJson } from './content-utils';
import { exec, one, pool, query } from './db';

/*
 * The extra quizzes (fish, hardwood defects…) live in quiz_topic / quiz_item so admins can fix
 * names and tips. src/data/topics only seeds them: on start, missing topics, items and groups are
 * added and photo lists are refreshed (photos ship as files), but edited text is never overwritten.
 */

interface TopicRow {
  id: string; title: string; short: string; blurb: string; question: string; noun: string; source: string;
  groups: string; updated_at: number | null; updated_by: string | null;
}
interface ItemRow {
  topic: string; id: string; name: string; aka: string | null; note: string | null; scientific: string | null;
  grp: string; tips: string; lookalikes: string; images: string; updated_at: number | null; updated_by: string | null;
}

export async function seedTopics() {
  for (const [ti, t] of TOPIC_SEED.entries()) {
    await pool.execute(
      `INSERT IGNORE INTO quiz_topic (id, title, short, blurb, question, noun, source, \`groups\`, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.id, t.title, t.short, t.blurb, t.question, t.noun, t.source, JSON.stringify(t.groups), ti],
    );
    // Add groups that are new in the seed, keeping any labels an admin changed.
    const row = await one<{ groups: string }>('SELECT `groups` FROM quiz_topic WHERE id = ?', [t.id]);
    const groups = parseJson<Record<string, string>>(row?.groups ?? '{}', {});
    const merged = { ...t.groups, ...groups };
    if (Object.keys(merged).length !== Object.keys(groups).length) {
      await pool.execute('UPDATE quiz_topic SET `groups` = ? WHERE id = ?', [JSON.stringify(merged), t.id]);
    }
    for (const [ii, i] of t.items.entries()) {
      await pool.execute(
        `INSERT INTO quiz_item (topic, id, name, aka, note, scientific, grp, tips, lookalikes, images, sort)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE images = VALUES(images), sort = VALUES(sort)`,
        [t.id, i.id, i.name, i.aka ?? null, i.note ?? null, i.scientific ?? null, i.group,
          JSON.stringify(i.tips), JSON.stringify(i.lookalikes), JSON.stringify(i.images), ii],
      );
    }
  }
}

/** All topics with their items, read once per request. */
export const listTopics = cache(async (): Promise<Topic[]> => {
  const [topics, items] = await Promise.all([
    query<TopicRow>(
      `SELECT t.id, t.title, t.short, t.blurb, t.question, t.noun, t.source, t.\`groups\`, t.updated_at, u.name AS updated_by
         FROM quiz_topic t LEFT JOIN \`user\` u ON u.id = t.updated_by ORDER BY t.sort, t.id`,
    ),
    query<ItemRow>(
      `SELECT i.topic, i.id, i.name, i.aka, i.note, i.scientific, i.grp, i.tips, i.lookalikes, i.images, i.updated_at,
              u.name AS updated_by
         FROM quiz_item i LEFT JOIN \`user\` u ON u.id = i.updated_by ORDER BY i.sort, i.id`,
    ),
  ]);
  return topics.map((t) => ({
    id: t.id, title: t.title, short: t.short, blurb: t.blurb, question: t.question, noun: t.noun, source: t.source,
    groups: parseJson<Record<string, string>>(t.groups, {}),
    updatedAt: t.updated_at, updatedBy: t.updated_by,
    items: items.filter((i) => i.topic === t.id).map((i): TopicItem => ({
      id: i.id, name: i.name, aka: i.aka ?? undefined, note: i.note ?? undefined, scientific: i.scientific ?? undefined,
      group: i.grp,
      tips: parseJson<string[]>(i.tips, []),
      lookalikes: parseJson<string[]>(i.lookalikes, []),
      images: parseJson<string[]>(i.images, []),
      updatedAt: i.updated_at, updatedBy: i.updated_by,
    })),
  }));
});

export async function getTopic(id: unknown): Promise<Topic | null> {
  if (typeof id !== 'string') return null;
  return (await listTopics()).find((t) => t.id === id) ?? null;
}

// ---- Admin edits ----

export interface TopicEdit {
  title: string; short: string; blurb: string; question: string; noun: string; source: string;
  groups: Record<string, string>;
}

export async function updateTopic(id: string, edit: TopicEdit, adminId: string) {
  const topic = await getTopic(id);
  if (!topic) throw new Error('Quiz not found');
  // Group ids are referenced by items and links, so only their labels can change.
  const groups = Object.fromEntries(
    Object.keys(topic.groups).map((g) => [g, cleanText(edit.groups?.[g], `Group "${topic.groups[g]}"`, 60)!]),
  );
  await exec(
    'UPDATE quiz_topic SET title = ?, short = ?, blurb = ?, question = ?, noun = ?, source = ?, `groups` = ?, updated_at = ?, updated_by = ? WHERE id = ?',
    [
      cleanText(edit.title, 'Title', 80), cleanText(edit.short, 'Short name', 40), cleanText(edit.blurb, 'Description', 300),
      cleanText(edit.question, 'Question', 120), cleanText(edit.noun, 'Noun', 40), cleanText(edit.source, 'Source', 160),
      JSON.stringify(groups), Date.now(), adminId, id,
    ],
  );
}

export interface ItemEdit {
  name: string; aka: string; note: string; scientific: string; group: string;
  tips: string[]; lookalikes: string[];
}

export async function updateItem(topicId: string, itemId: string, edit: ItemEdit, adminId: string) {
  const topic = await getTopic(topicId);
  const item = topic?.items.find((i) => i.id === itemId);
  if (!topic || !item) throw new Error('Item not found');
  if (!(edit.group in topic.groups)) throw new Error('Choose a group');
  const tips = cleanLines(edit.tips, 'Tip');
  const ids = new Set(topic.items.map((i) => i.id));
  const lookalikes = [...new Set(Array.isArray(edit.lookalikes) ? edit.lookalikes : [])].filter((l) => l !== itemId && ids.has(l));
  if (lookalikes.length > 6) throw new Error('Pick 6 look-alikes or fewer');

  await exec(
    `UPDATE quiz_item SET name = ?, aka = ?, note = ?, scientific = ?, grp = ?, tips = ?, lookalikes = ?, updated_at = ?, updated_by = ?
      WHERE topic = ? AND id = ?`,
    [
      cleanText(edit.name, 'Name', 80), cleanText(edit.aka, 'Other name', 80, false), cleanText(edit.note, 'Tag', 80, false),
      cleanText(edit.scientific, 'Scientific name', 120, false), edit.group, JSON.stringify(tips), JSON.stringify(lookalikes),
      Date.now(), adminId, topicId, itemId,
    ],
  );
}

/** Put an item back to the text it shipped with. */
export async function resetItem(topicId: string, itemId: string) {
  const seed = TOPIC_SEED.find((t) => t.id === topicId)?.items.find((i) => i.id === itemId);
  if (!seed) throw new Error('This item has no original version to go back to');
  await exec(
    `UPDATE quiz_item SET name = ?, aka = ?, note = ?, scientific = ?, grp = ?, tips = ?, lookalikes = ?, updated_at = NULL, updated_by = NULL
      WHERE topic = ? AND id = ?`,
    [seed.name, seed.aka ?? null, seed.note ?? null, seed.scientific ?? null, seed.group,
      JSON.stringify(seed.tips), JSON.stringify(seed.lookalikes), topicId, itemId],
  );
}
