'use client';

import { createContext, useContext, useMemo } from 'react';
import type { LeafGroup, Species } from '@/data/species';
import { makeLeaf, type LeafData } from '@/lib/leaf-shared';

const LeafContext = createContext<LeafData | null>(null);

/** Gives browser components the species list from the database (loaded in the root layout). */
export function LeafProvider({ species, groups, children }: { species: Species[]; groups: Record<string, LeafGroup>; children: React.ReactNode }) {
  const value = useMemo(() => makeLeaf(species, groups), [species, groups]);
  return <LeafContext.Provider value={value}>{children}</LeafContext.Provider>;
}

export function useLeaf(): LeafData {
  const leaf = useContext(LeafContext);
  if (!leaf) throw new Error('useLeaf must be used inside <LeafProvider>');
  return leaf;
}
