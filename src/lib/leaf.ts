import { cache } from 'react';
import { cleanKeyTraits, KEY_TRAITS_SEED, type KeyTraits } from '@/data/leaf-key';
import { GROUP_SEED, SPECIES_SEED, type LeafGroup, type Lookalike } from '@/data/species';
import { cleanLines, cleanText, parseJson } from './content-utils';
import { exec, pool, query } from './db';
import { makeLeaf, type LeafData } from './leaf-shared';

/*
 * Leaf species live in leaf_group / leaf_species so admins can fix names and ID notes.
 * src/data/species.ts only seeds them: missing groups and species are added on start,
 * existing rows are never overwritten.
 */

interface GroupRow { id: string; label: string; blurb: string }
interface SpeciesRow {
  id: string; code: string; common: string; scientific: string; grp: string; arrangement: string; leaf_type: string;
  shape: string; margin: string; key_features: string; field_clues: string; lookalikes: string; key_traits: string | null;
  updated_at: number | null; updated_by: string | null;
}

const seedTraits = (id: string) => JSON.stringify(KEY_TRAITS_SEED[id] ?? {});

export async function seedLeaf() {
  for (const [n, [id, g]] of Object.entries(GROUP_SEED).entries()) {
    await pool.execute('INSERT IGNORE INTO leaf_group (id, label, blurb, sort) VALUES (?, ?, ?, ?)', [id, g.label, g.blurb, n]);
  }
  for (const [n, s] of SPECIES_SEED.entries()) {
    await pool.execute(
      `INSERT IGNORE INTO leaf_species (id, code, common, scientific, grp, arrangement, leaf_type, shape, margin, key_features, field_clues, lookalikes, key_traits, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.code, s.common, s.scientific, s.group, s.arrangement, s.leafType, s.shape, s.margin,
        JSON.stringify(s.keyFeatures), JSON.stringify(s.fieldClues), JSON.stringify(s.lookalikes), seedTraits(s.id), n],
    );
    // Species added before the leaf key existed get its starting traits once.
    await pool.execute('UPDATE leaf_species SET key_traits = ? WHERE id = ? AND key_traits IS NULL', [seedTraits(s.id), s.id]);
  }
}

/** All species and groups, read once per request. */
export const getLeaf = cache(async (): Promise<LeafData> => {
  const [groups, species] = await Promise.all([
    query<GroupRow>('SELECT id, label, blurb FROM leaf_group ORDER BY sort, id'),
    query<SpeciesRow>(
      `SELECT s.id, s.code, s.common, s.scientific, s.grp, s.arrangement, s.leaf_type, s.shape, s.margin,
              s.key_features, s.field_clues, s.lookalikes, s.key_traits, s.updated_at, u.name AS updated_by
         FROM leaf_species s LEFT JOIN \`user\` u ON u.id = s.updated_by ORDER BY s.sort, s.id`,
    ),
  ]);
  return makeLeaf(
    species.map((s) => ({
      id: s.id, code: s.code, common: s.common, scientific: s.scientific, group: s.grp,
      arrangement: s.arrangement === 'opposite' ? 'opposite' : 'alternate',
      leafType: s.leaf_type === 'compound' ? 'compound' : 'simple',
      shape: s.shape, margin: s.margin,
      keyFeatures: parseJson<string[]>(s.key_features, []),
      fieldClues: parseJson<string[]>(s.field_clues, []),
      lookalikes: parseJson<Lookalike[]>(s.lookalikes, []),
      keyTraits: cleanKeyTraits(parseJson<unknown>(s.key_traits ?? '{}', {})),
      updatedAt: s.updated_at, updatedBy: s.updated_by,
    })),
    Object.fromEntries(groups.map((g): [string, LeafGroup] => [g.id, { label: g.label, blurb: g.blurb }])),
  );
});

// ---- Admin edits ----

export interface SpeciesEdit {
  code: string; common: string; scientific: string; group: string; arrangement: string; leafType: string;
  shape: string; margin: string; keyFeatures: string[]; fieldClues: string[]; lookalikes: Lookalike[]; keyTraits: KeyTraits;
}

export async function updateSpecies(id: string, edit: SpeciesEdit, adminId: string) {
  const leaf = await getLeaf();
  if (!leaf.byId[id]) throw new Error('Species not found');
  if (!(edit.group in leaf.groups)) throw new Error('Choose a group');
  if (edit.arrangement !== 'opposite' && edit.arrangement !== 'alternate') throw new Error('Choose opposite or alternate');
  if (edit.leafType !== 'simple' && edit.leafType !== 'compound') throw new Error('Choose simple or compound');

  const seen = new Set<string>();
  const lookalikes = (Array.isArray(edit.lookalikes) ? edit.lookalikes : []).flatMap((l) => {
    if (!l || l.id === id || !leaf.byId[l.id] || seen.has(l.id)) return [];
    seen.add(l.id);
    const name = leaf.byId[l.id].common;
    return [{ id: l.id, tip: cleanText(l.tip, `How to tell it from ${name}`, 400)! }];
  });
  if (lookalikes.length > 6) throw new Error('Use 6 look-alikes or fewer');

  await exec(
    `UPDATE leaf_species SET code = ?, common = ?, scientific = ?, grp = ?, arrangement = ?, leaf_type = ?, shape = ?, margin = ?,
            key_features = ?, field_clues = ?, lookalikes = ?, key_traits = ?, updated_at = ?, updated_by = ?
      WHERE id = ?`,
    [
      cleanText(edit.code, 'Code', 16), cleanText(edit.common, 'Common name', 80), cleanText(edit.scientific, 'Scientific name', 120),
      edit.group, edit.arrangement, edit.leafType,
      cleanText(edit.shape, 'Shape', 200), cleanText(edit.margin, 'Margin', 200),
      JSON.stringify(cleanLines(edit.keyFeatures, 'Key feature')),
      JSON.stringify(cleanLines(edit.fieldClues, 'Field clue', { min: 0 })),
      JSON.stringify(lookalikes), JSON.stringify(cleanKeyTraits(edit.keyTraits)), Date.now(), adminId, id,
    ],
  );
}

/** Put a species back to the text it shipped with. */
export async function resetSpecies(id: string) {
  const s = SPECIES_SEED.find((x) => x.id === id);
  if (!s) throw new Error('This species has no original version to go back to');
  await exec(
    `UPDATE leaf_species SET code = ?, common = ?, scientific = ?, grp = ?, arrangement = ?, leaf_type = ?, shape = ?, margin = ?,
            key_features = ?, field_clues = ?, lookalikes = ?, key_traits = ?, updated_at = NULL, updated_by = NULL
      WHERE id = ?`,
    [s.code, s.common, s.scientific, s.group, s.arrangement, s.leafType, s.shape, s.margin,
      JSON.stringify(s.keyFeatures), JSON.stringify(s.fieldClues), JSON.stringify(s.lookalikes), seedTraits(id), id],
  );
}

export async function updateLeafGroups(groups: Record<string, { label: string; blurb: string }>, adminId: string) {
  const leaf = await getLeaf();
  const now = Date.now();
  for (const id of Object.keys(leaf.groups)) {
    const g = groups?.[id];
    const label = cleanText(g?.label, `Group name (${leaf.groups[id].label})`, 80);
    const blurb = cleanText(g?.blurb, `Description of ${label}`, 300);
    await exec('UPDATE leaf_group SET label = ?, blurb = ?, updated_at = ?, updated_by = ? WHERE id = ?', [label, blurb, now, adminId, id]);
  }
}

export async function isSpecies(id: unknown): Promise<boolean> {
  return typeof id === 'string' && !!(await getLeaf()).byId[id];
}
