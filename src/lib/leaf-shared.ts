import type { LeafGroup, Species } from '@/data/species';

export type { Arrangement, LeafGroup, LeafType, Lookalike, Species } from '@/data/species';

/** The leaf species and groups as stored in the database. Safe to use in the browser. */
export interface LeafData {
  species: Species[];
  groups: Record<string, LeafGroup>;
  byId: Record<string, Species>;
}

export function makeLeaf(species: Species[], groups: Record<string, LeafGroup>): LeafData {
  return { species, groups, byId: Object.fromEntries(species.map((s) => [s.id, s])) };
}

export function speciesLabel(leaf: LeafData, id: string): string {
  const s = leaf.byId[id];
  if (!s) return id;
  return s.code === s.common ? s.common : `${s.code} · ${s.common}`;
}

export function groupLabel(leaf: LeafData, id: string): string {
  return leaf.groups[id]?.label ?? id;
}
