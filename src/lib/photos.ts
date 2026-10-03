import credits from '@/data/image-credits.json';
import { SPECIES_BY_ID } from '@/data/species';
import { db } from './db';

export interface Credit {
  file: string;
  source: string;
  artist: string;
  license: string;
  licenseUrl: string | null;
}

export interface Photo {
  /** Stable id: "lib:<species>/<file>" or "sub:<submission id>". */
  key: string;
  url: string;
  species: string;
  credit?: Credit;
  community?: boolean;
}

const LIBRARY: Photo[] = Object.entries(credits as Record<string, Credit[]>).flatMap(([species, list]) =>
  list.map((c) => ({ key: `lib:${species}/${c.file}`, url: `/leaves/${species}/${c.file}`, species, credit: c })),
);

export function libraryPhotos(species?: string): Photo[] {
  return species ? LIBRARY.filter((p) => p.species === species) : LIBRARY;
}

export function communityPhotos(species?: string): Photo[] {
  const rows = (species
    ? db.prepare(`SELECT id, consensus FROM submission WHERE status = 'verified' AND consensus = ?`).all(species)
    : db.prepare(`SELECT id, consensus FROM submission WHERE status = 'verified'`).all()) as { id: string; consensus: string }[];
  return rows.map((r) => ({ key: `sub:${r.id}`, url: `/api/photos/${r.id}`, species: r.consensus, community: true }));
}

/** Every photo the quiz can use: curated library plus community photos the crowd verified. */
export function allPhotos(): Photo[] {
  return [...LIBRARY, ...communityPhotos()];
}

/** Resolve a photo key back to its true species (server-side answer checking). */
export function speciesForKey(key: string): string | null {
  if (key.startsWith('lib:')) {
    const species = key.slice(4).split('/')[0];
    return SPECIES_BY_ID[species] && LIBRARY.some((p) => p.key === key) ? species : null;
  }
  if (key.startsWith('sub:')) {
    const row = db.prepare(`SELECT consensus FROM submission WHERE id = ? AND status = 'verified'`).get(key.slice(4)) as
      | { consensus: string }
      | undefined;
    return row?.consensus ?? null;
  }
  return null;
}
