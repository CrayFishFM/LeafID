import credits from '@/data/image-credits.json';
import { one, query } from './db';
import { isSpecies } from './leaf';

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

/** Every built-in photo, including ones an admin has hidden (for admin views). */
export function allLibraryPhotos(): Photo[] {
  return LIBRARY;
}

export function libraryPhotoByKey(key: string): Photo | undefined {
  return LIBRARY.find((p) => p.key === key);
}

export async function hiddenImageKeys(): Promise<Set<string>> {
  const rows = await query<{ image_key: string }>(`SELECT image_key FROM hidden_image`);
  return new Set(rows.map((r) => r.image_key));
}

/** Built-in photos that are visible (not pulled down by an admin). */
export async function libraryPhotos(species?: string): Promise<Photo[]> {
  const hidden = await hiddenImageKeys();
  return LIBRARY.filter((p) => !hidden.has(p.key) && (!species || p.species === species));
}

export async function communityPhotos(species?: string): Promise<Photo[]> {
  const rows = species
    ? await query<{ id: string; consensus: string }>(`SELECT id, consensus FROM submission WHERE status = 'verified' AND consensus = ?`, [species])
    : await query<{ id: string; consensus: string }>(`SELECT id, consensus FROM submission WHERE status = 'verified'`);
  return rows.map((r) => ({ key: `sub:${r.id}`, url: `/api/photos/${r.id}`, species: r.consensus, community: true }));
}

/** Every photo the quiz can use: curated library plus community photos the crowd verified. */
export async function allPhotos(): Promise<Photo[]> {
  const [library, community] = await Promise.all([libraryPhotos(), communityPhotos()]);
  return [...library, ...community];
}

/** Resolve a photo key back to its true species (server-side answer checking). */
export async function speciesForKey(key: string): Promise<string | null> {
  if (key.startsWith('lib:')) {
    const species = key.slice(4).split('/')[0];
    return (await isSpecies(species)) && LIBRARY.some((p) => p.key === key) ? species : null;
  }
  if (key.startsWith('sub:')) {
    const row = await one<{ consensus: string }>(`SELECT consensus FROM submission WHERE id = ? AND status = 'verified'`, [key.slice(4)]);
    return row?.consensus ?? null;
  }
  return null;
}
