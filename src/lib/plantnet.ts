import { createHash } from 'node:crypto';
import type { Species } from '@/data/species';

/*
 * Leaf identification via Pl@ntNet (https://my.plantnet.org/doc/api/identify).
 * Pl@ntNet knows tens of thousands of plants; we keep only the guesses that are in our species list
 * and report the best outside guess separately so the uploader can tell "not a tree we teach".
 */

// Eastern Canada flora (covers Ontario); with "all", southern US oaks outscored red oak in testing.
const ENDPOINT = 'https://my-api.plantnet.org/v2/identify/k-eastern-canada';

export const plantnetEnabled = !!process.env.PLANTNET_API_KEY;

export interface IdentifyMatch {
  speciesId: string;
  /** 0–1, summed over Pl@ntNet results that map to this species (e.g. several Alnus for "Alnus spp."). */
  score: number;
  /** The name Pl@ntNet gave its top result for this species. */
  plantnetName: string;
  /** False when only the genus matched (we teach one species of it, Pl@ntNet named another). */
  exact: boolean;
}

export interface IdentifyResult {
  matches: IdentifyMatch[];
  /** Pl@ntNet's top guess when it isn't one of our species, if it outscores our best match. */
  outside: { name: string; commonName: string | null; score: number } | null;
}

interface PlantnetResult {
  score: number;
  species: {
    scientificNameWithoutAuthor: string;
    genus: { scientificNameWithoutAuthor: string };
    commonNames?: string[];
  };
}

export class IdentifyError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const nameParts = (s: Species) => s.scientific.trim().toLowerCase().split(/\s+/);

/**
 * Our scientific names are "Genus epithet" or "Genus spp."; Pl@ntNet may add infraspecific parts
 * ("Sambucus nigra subsp. canadensis"), so any matching epithet in its name counts.
 */
function isExactMatch(s: Species, r: PlantnetResult): boolean {
  const [genus, epithet] = nameParts(s);
  if (r.species.genus.scientificNameWithoutAuthor.toLowerCase() !== genus) return false;
  if (!epithet || epithet.startsWith('spp')) return true;
  return r.species.scientificNameWithoutAuthor.toLowerCase().split(/\s+/).slice(1).includes(epithet);
}

/**
 * Finds our species for a Pl@ntNet result. When we teach only one species of a genus, any species of
 * that genus maps to it (Pl@ntNet splits elderberry into S. nigra and S. canadensis, for example).
 */
function findSpecies(species: Species[], r: PlantnetResult): { s: Species; exact: boolean } | null {
  const exact = species.find((s) => isExactMatch(s, r));
  if (exact) return { s: exact, exact: true };
  const genus = r.species.genus.scientificNameWithoutAuthor.toLowerCase();
  const sameGenus = species.filter((s) => nameParts(s)[0] === genus);
  return sameGenus.length === 1 ? { s: sameGenus[0], exact: false } : null;
}

/** Uploads this confident that the photo is the claimed species skip the community vote. */
export const AUTO_APPROVE_SCORE = 0.9;

/**
 * Pl@ntNet's confidence when it agrees with the uploader's species well enough to auto-approve, else null.
 * Only exact species matches count; a genus-only match (another elderberry, say) still goes to a vote.
 * Never throws: if Pl@ntNet is unavailable the photo just goes to the community as usual.
 */
export async function autoApproveScore(photo: Blob, claimed: string, species: Species[]): Promise<number | null> {
  if (!plantnetEnabled || !species.some((s) => s.id === claimed)) return null;
  try {
    const top = (await identifyLeaf(photo, species)).matches[0];
    return top && top.speciesId === claimed && top.exact && top.score >= AUTO_APPROVE_SCORE ? top.score : null;
  } catch (e) {
    console.error('auto-approve check failed', e);
    return null;
  }
}

// Results by photo hash, so "Suggest a species" and then submitting the same photo uses one Pl@ntNet call.
const CACHE_MS = 3_600_000;
const cache = new Map<string, { at: number; result: IdentifyResult }>();

export async function identifyLeaf(photo: Blob, species: Species[]): Promise<IdentifyResult> {
  const bytes = Buffer.from(await photo.arrayBuffer());
  const hash = createHash('sha256').update(bytes).digest('hex');
  const hit = cache.get(hash);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.result;

  const result = await callPlantnet(new Blob([new Uint8Array(bytes)], { type: photo.type || 'image/jpeg' }), species);
  for (const [k, v] of cache) if (Date.now() - v.at >= CACHE_MS) cache.delete(k);
  cache.set(hash, { at: Date.now(), result });
  return result;
}

async function callPlantnet(photo: Blob, species: Species[]): Promise<IdentifyResult> {
  const key = process.env.PLANTNET_API_KEY;
  if (!key) throw new IdentifyError('Leaf identification is not set up', 503);

  const body = new FormData();
  body.append('images', photo, 'leaf.jpg');
  body.append('organs', 'leaf');
  const url = `${ENDPOINT}?api-key=${encodeURIComponent(key)}&nb-results=20&lang=en`;

  const res = await fetch(url, { method: 'POST', body, signal: AbortSignal.timeout(20_000) });
  // Pl@ntNet answers 404 when it can't find any plant in the photo.
  if (res.status === 404) return { matches: [], outside: null };
  if (res.status === 429) throw new IdentifyError('Daily identification limit reached — try again tomorrow', 429);
  if (!res.ok) {
    console.error('Pl@ntNet identify failed', res.status, await res.text().catch(() => ''));
    throw new IdentifyError('Leaf identification is unavailable right now', 502);
  }

  const results: PlantnetResult[] = (await res.json()).results ?? [];
  const byId = new Map<string, IdentifyMatch>();
  let outside: IdentifyResult['outside'] = null;
  for (const r of results) {
    const found = findSpecies(species, r);
    if (found) {
      const m = byId.get(found.s.id);
      if (m) {
        m.score = Math.min(1, m.score + r.score);
        m.exact ||= found.exact;
      } else {
        byId.set(found.s.id, {
          speciesId: found.s.id, score: r.score, plantnetName: r.species.scientificNameWithoutAuthor, exact: found.exact,
        });
      }
    } else if (!outside) {
      outside = { name: r.species.scientificNameWithoutAuthor, commonName: r.species.commonNames?.[0] ?? null, score: r.score };
    }
  }

  const matches = [...byId.values()].sort((a, b) => b.score - a.score).slice(0, 3);
  if (outside && matches[0] && outside.score <= matches[0].score) outside = null;
  return { matches, outside };
}
