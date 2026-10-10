// Downloads candidate leaf photos from Wikimedia Commons into public/leaves/<id>/
// and records attribution in src/data/image-credits.json.
//
// Usage: node scripts/fetch-images.mjs [id ...]   (no args = all species)
// After running, review the photos and delete any that are not good leaf shots,
// then run `node scripts/fetch-images.mjs --prune` to drop credits for deleted files.

import fs from 'node:fs/promises';
import path from 'node:path';

const UA = 'LeafID-learning-app/1.0 (educational, non-commercial)';
const API = 'https://commons.wikimedia.org/w/api.php';
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public', 'leaves');
const CREDITS = path.join(ROOT, 'src', 'data', 'image-credits.json');
const PER_SPECIES = 8;

// id -> [scientific name, extra search terms]
const SPECIES = {
  Mh: ['Acer saccharum'], Mr: ['Acer rubrum'], Ms: ['Acer saccharinum'], Mm: ['Acer negundo'],
  Mp: ['Acer pensylvanicum'], Or: ['Quercus rubra'], Ow: ['Quercus alba'], Ob: ['Quercus macrocarpa'],
  Be: ['Fagus grandifolia'], Iw: ['Ostrya virginiana'], Bw: ['Betula papyrifera'],
  By: ['Betula alleghaniensis'], Al: ['Alnus incana', 'Alnus rugosa'], Ew: ['Ulmus americana'],
  Bd: ['Tilia americana'], Aw: ['Fraxinus americana'], Ab: ['Fraxinus nigra'],
  El: ['Sambucus canadensis', 'Sambucus nigra subsp. canadensis'], Am: ['Sorbus americana'],
  Bn: ['Juglans cinerea'], Wb: ['Juglans nigra'], Sumac: ['Rhus typhina'],
  Pl: ['Populus grandidentata'], Pt: ['Populus tremuloides'], Pb: ['Populus balsamifera'],
  Pd: ['Populus deltoides'], Mt: ['Acer spicatum'], Wi: ['Salix'], Cb: ['Prunus serotina'],
  Cc: ['Prunus virginiana'], Cp: ['Prunus pensylvanica'], Hobblebush: ['Viburnum lantanoides'],
  Hazel: ['Corylus cornuta'],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;
  for (let i = 0; i < 6; i++) {
    await sleep(2500 * (i + 1));
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    const text = await res.text();
    try { return JSON.parse(text); } catch { /* rate limited, retry */ }
  }
  throw new Error(`API failed: ${url}`);
}

const isPhoto = (t) => /\.(jpe?g|png)$/i.test(t);

async function categoryFiles(cat) {
  const j = await api({ action: 'query', list: 'categorymembers', cmtitle: cat, cmtype: 'file', cmlimit: '50' });
  return (j.query?.categorymembers ?? []).map((m) => m.title).filter(isPhoto);
}

async function searchFiles(q) {
  const j = await api({ action: 'query', list: 'search', srsearch: q, srnamespace: '6', srlimit: '30' });
  return (j.query?.search ?? []).map((m) => m.title).filter(isPhoto);
}

async function candidates(names) {
  const found = [];
  for (const sci of names) {
    for (const cat of [`Category:${sci} (leaves)`, `Category:${sci} leaves`, `Category:Leaves of ${sci}`]) {
      found.push(...(await categoryFiles(cat)));
    }
  }
  if (found.length < PER_SPECIES) {
    for (const sci of names) {
      const hits = await searchFiles(`"${sci}" leaf OR leaves`);
      found.push(...hits.filter((t) => t.toLowerCase().includes(sci.split(' ')[1].toLowerCase())));
    }
  }
  // Prefer titles that mention leaves; drop bark/flower/fruit-only shots.
  const bad = /bark|flower|fruit|seed|catkin|twig|bud|trunk|habit|map|herbar|range|nut|samara|cone/i;
  const unique = [...new Set(found)].filter((t) => !bad.test(t));
  unique.sort((a, b) => Number(/lea[fv]/i.test(b)) - Number(/lea[fv]/i.test(a)));
  return unique;
}

const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function info(titles) {
  const j = await api({
    action: 'query', titles: titles.join('|'), prop: 'imageinfo',
    iiprop: 'url|extmetadata|size', iiurlwidth: '900',
  });
  return Object.values(j.query?.pages ?? {}).map((p) => {
    const ii = p.imageinfo?.[0];
    if (!ii) return null;
    const m = ii.extmetadata ?? {};
    return {
      title: p.title,
      thumb: ii.thumburl,
      page: ii.descriptionurl,
      width: ii.width,
      height: ii.height,
      artist: strip(m.Artist?.value) || 'Unknown',
      license: strip(m.LicenseShortName?.value) || 'See source',
      licenseUrl: m.LicenseUrl?.value ?? null,
    };
  }).filter(Boolean);
}

async function loadCredits() {
  try { return JSON.parse(await fs.readFile(CREDITS, 'utf8')); } catch { return {}; }
}

async function prune() {
  const credits = await loadCredits();
  for (const id of Object.keys(credits)) {
    const dir = path.join(OUT, id);
    const files = new Set(await fs.readdir(dir).catch(() => []));
    credits[id] = credits[id].filter((c) => files.has(c.file));
  }
  await fs.writeFile(CREDITS, JSON.stringify(credits, null, 2) + '\n');
  console.log('Pruned credits to match files on disk.');
}

/** Add specific hand-picked Commons files: --add <id> "File:A.jpg" "File:B.jpg" */
async function add(id, titles) {
  const credits = await loadCredits();
  const dir = path.join(OUT, id);
  await fs.mkdir(dir, { recursive: true });
  credits[id] ??= [];
  let n = Math.max(0, ...(await fs.readdir(dir)).map((f) => parseInt(f) || 0)) + 1;
  for (const m of await info(titles)) {
    if (!m.thumb) continue;
    await sleep(800);
    const res = await fetch(m.thumb, { headers: { 'User-Agent': UA } });
    if (!res.ok) continue;
    const file = `${n++}.jpg`;
    await fs.writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
    credits[id].push({ file, source: m.page, artist: m.artist, license: m.license, licenseUrl: m.licenseUrl });
  }
  await fs.writeFile(CREDITS, JSON.stringify(credits, null, 2) + '\n');
  console.log(`${id}: now ${credits[id].length} images`);
}

async function main() {
  if (process.argv.includes('--prune')) return prune();
  const addAt = process.argv.indexOf('--add');
  if (addAt > -1) return add(process.argv[addAt + 1], process.argv.slice(addAt + 2));
  const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const targets = ids.length ? ids : Object.keys(SPECIES);
  const credits = await loadCredits();
  await fs.mkdir(path.dirname(CREDITS), { recursive: true });

  for (const id of targets) {
    const titles = (await candidates(SPECIES[id])).slice(0, PER_SPECIES * 2);
    const metas = (await info(titles.slice(0, 50)))
      .filter((m) => m.thumb && /cc|public domain|pd/i.test(m.license))
      .slice(0, PER_SPECIES);
    const dir = path.join(OUT, id);
    await fs.mkdir(dir, { recursive: true });
    credits[id] = [];
    let n = 1;
    for (const m of metas) {
      await sleep(800);
      const res = await fetch(m.thumb, { headers: { 'User-Agent': UA } });
      if (!res.ok) continue;
      const file = `${n++}.jpg`;
      await fs.writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
      credits[id].push({ file, source: m.page, artist: m.artist, license: m.license, licenseUrl: m.licenseUrl });
    }
    console.log(`${id}: ${credits[id].length} images (from ${titles.length} candidates)`);
    await fs.writeFile(CREDITS, JSON.stringify(credits, null, 2) + '\n');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
