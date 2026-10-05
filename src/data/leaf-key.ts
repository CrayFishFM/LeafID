import type { Species } from './species';

/*
 * Questions for the step-by-step leaf key (/learn/key). Arrangement and simple/compound come from the
 * species' own fields; the answers to the other questions are each species' key traits, which admins
 * edit with the rest of the species (KEY_TRAITS_SEED only seeds them).
 * A species can have more than one value when it varies, so it still matches either answer.
 */

export type QuestionId =
  | 'arrangement' | 'leafType' | 'leaflets' | 'lobes' | 'lobeCount' | 'lobeDepth'
  | 'lobeTips' | 'widest' | 'shape' | 'petiole' | 'base' | 'margin'
  | 'endLeaflet' | 'twig' | 'bark' | 'habit';

export interface KeyOption {
  value: string;
  label: string;
  hint: string;
}

/** Questions answered from a species' key traits (the rest come from its own fields). */
export type TraitId = Exclude<QuestionId, 'arrangement' | 'leafType'>;
export type KeyTraits = Partial<Record<TraitId, string[]>>;

export interface KeyQuestion {
  id: QuestionId;
  /** Short name for the admin editor. */
  short: string;
  title: string;
  /** How to check this on the leaf in front of you. */
  help: string;
  options: KeyOption[];
  /** Only asked once every remaining species has this answer (e.g. lobes only for simple leaves). */
  requires?: { id: QuestionId; value: string };
}

/** In the order a key would ask them; the key skips questions that wouldn't narrow things down. */
export const KEY_QUESTIONS: KeyQuestion[] = [
  {
    id: 'arrangement', short: 'Arrangement', title: 'How are the leaves arranged on the twig?',
    help: 'Look where leaves (or their buds and scars) attach. Ignore the leaflets of a compound leaf.',
    options: [
      { value: 'opposite', label: 'Opposite', hint: 'In pairs, directly across from each other' },
      { value: 'alternate', label: 'Alternate', hint: 'One at a time, staggered up the twig' },
    ],
  },
  {
    id: 'leafType', short: 'Leaf type', title: 'Is it one blade, or many leaflets?',
    help: 'Find the bud: it sits where a whole leaf meets the twig, never at the base of a leaflet.',
    options: [
      { value: 'simple', label: 'Simple', hint: 'A single blade on each stalk' },
      { value: 'compound', label: 'Compound', hint: 'Several leaflets along one central stalk' },
    ],
  },
  {
    id: 'leaflets', short: 'Leaflets', title: 'How many leaflets are there?', requires: { id: 'leafType', value: 'compound' },
    help: 'Count every leaflet on one leaf, including the one at the tip.',
    options: [
      { value: 'few', label: '3 to 9', hint: 'A handful of fairly broad leaflets' },
      { value: 'many', label: '11 or more', hint: 'A long, feather-like row of leaflets' },
    ],
  },
  {
    id: 'lobes', short: 'Lobes', title: 'Does the leaf have lobes?', requires: { id: 'leafType', value: 'simple' },
    help: 'Lobes are big rounded or pointed sections separated by deep notches (sinuses), not just teeth.',
    options: [
      { value: 'palmate', label: 'Lobed like a hand', hint: 'Main veins and lobes spread from one point at the base' },
      { value: 'pinnate', label: 'Lobed like a feather', hint: 'Lobes line both sides of one central vein' },
      { value: 'none', label: 'No lobes', hint: 'Edge may be toothed, but no deep notches' },
    ],
  },
  {
    id: 'lobeCount', short: 'Number of lobes', title: 'How many main lobes?', requires: { id: 'lobes', value: 'palmate' },
    help: 'Count the large lobes; ignore tiny lobes near the stalk.',
    options: [
      { value: '3', label: '3 lobes', hint: 'Three main points' },
      { value: '5', label: '5 lobes', hint: 'Five main points' },
    ],
  },
  {
    id: 'lobeDepth', short: 'Notch depth', title: 'How deep are the notches between lobes?', requires: { id: 'lobes', value: 'palmate' },
    help: 'Compare the deepest notch to the distance from the leaf edge to where the stalk joins.',
    options: [
      { value: 'shallow', label: 'Less than halfway', hint: 'The leaf still looks solid in the middle' },
      { value: 'deep', label: 'Almost to the centre', hint: 'Lobes look like separate narrow fingers' },
    ],
  },
  {
    id: 'lobeTips', short: 'Lobe tips', title: 'Are the lobe tips pointed or rounded?', requires: { id: 'lobes', value: 'pinnate' },
    help: 'Look at the very end of each lobe — red oaks have a tiny bristle there.',
    options: [
      { value: 'pointed', label: 'Pointed, bristle-tipped', hint: 'Sharp tips ending in a fine bristle' },
      { value: 'rounded', label: 'Rounded', hint: 'Smooth, finger-like ends with no bristles' },
    ],
  },
  {
    id: 'widest', short: 'Widest part', title: 'Where is the leaf widest?', requires: { id: 'lobes', value: 'pinnate' },
    help: 'Picture the outline of the leaf around the lobes.',
    options: [
      { value: 'middle', label: 'Around the middle', hint: 'Lobes evenly spaced along the leaf' },
      { value: 'tip', label: 'Near the tip', hint: 'A deep "waist" in the middle and a broad, wavy top' },
    ],
  },
  {
    id: 'shape', short: 'Shape', title: 'What is the overall shape?', requires: { id: 'lobes', value: 'none' },
    help: 'Ignore the teeth and look at the outline.',
    options: [
      { value: 'round', label: 'Nearly round', hint: 'About as wide as it is long' },
      { value: 'oval', label: 'Oval or egg-shaped', hint: 'Longer than wide, with a pointed tip' },
      { value: 'heart', label: 'Heart-shaped', hint: 'Broad, with a notched base' },
      { value: 'triangle', label: 'Triangular', hint: 'Straight, flat base like a delta' },
      { value: 'lance', label: 'Long and narrow', hint: 'Tapers to a long point' },
    ],
  },
  {
    id: 'petiole', short: 'Leaf stalk', title: 'Roll the leaf stalk between your fingers. What shape is it?', requires: { id: 'lobes', value: 'none' },
    help: 'A flattened stalk is why aspen leaves flutter in the slightest breeze.',
    options: [
      { value: 'flat', label: 'Flattened', hint: 'Flat sideways, like a ribbon' },
      { value: 'round', label: 'Round', hint: 'Rolls easily, round in cross-section' },
    ],
  },
  {
    id: 'base', short: 'Base', title: 'Is the base of the leaf even?', requires: { id: 'lobes', value: 'none' },
    help: 'Look where the blade meets the stalk: do both sides start at the same point?',
    options: [
      { value: 'even', label: 'Even', hint: 'Both halves meet the stalk at the same spot' },
      { value: 'lopsided', label: 'Lopsided', hint: 'One side starts lower than the other' },
    ],
  },
  {
    id: 'margin', short: 'Edge', title: 'What does the edge of the leaf (or leaflet) look like?',
    help: 'Look closely along the edge, ignoring the lobes.',
    options: [
      { value: 'smooth', label: 'Smooth', hint: 'No teeth, or just a few large wavy points' },
      { value: 'fine', label: 'Fine teeth', hint: 'Small, even teeth like a saw' },
      { value: 'coarse', label: 'Large, coarse teeth', hint: 'Big, widely spaced or irregular teeth' },
      { value: 'double', label: 'Double teeth', hint: 'Big teeth with smaller teeth on them' },
    ],
  },
  {
    id: 'endLeaflet', short: 'Tip leaflet', title: 'Is there a leaflet at the very tip?', requires: { id: 'leafType', value: 'compound' },
    help: 'Look at the end of the central stalk. It can fall off, so check a few leaves.',
    options: [
      { value: 'present', label: 'Yes, one at the tip', hint: 'An odd number of leaflets' },
      { value: 'absent', label: 'No tip leaflet', hint: 'Ends in a pair, or just a stub' },
    ],
  },
  {
    id: 'twig', short: 'Twig', title: 'Feel the twig. Is it velvety?', requires: { id: 'leafType', value: 'compound' },
    help: 'Run a finger along the newest growth at the end of a branch.',
    options: [
      { value: 'velvety', label: 'Velvety', hint: 'Thick and fuzzy, like a deer antler in velvet' },
      { value: 'smooth', label: 'Not velvety', hint: 'Smooth, or only slightly hairy' },
    ],
  },
  {
    id: 'bark', short: 'Bark', title: 'What does the bark look like?', requires: { id: 'lobes', value: 'none' },
    help: 'Look at the trunk or larger branches, not the twigs.',
    options: [
      { value: 'papery', label: 'White and papery', hint: 'Chalky white, peels in sheets' },
      { value: 'curly', label: 'Bronze, curling strips', hint: 'Shiny golden to grey, peels in thin curls' },
      { value: 'shaggy', label: 'Shaggy narrow strips', hint: 'Small strips loose at both ends' },
      { value: 'smooth', label: 'Smooth', hint: 'Smooth grey or greenish, may have lenticels' },
      { value: 'furrowed', label: 'Ridged and furrowed', hint: 'Deep grooves between ridges' },
    ],
  },
  {
    id: 'habit', short: 'Growth form', title: 'Is it a shrub or a tree?',
    help: 'Step back and look at the whole plant.',
    options: [
      { value: 'shrub', label: 'Shrub or small understory tree', hint: 'Several stems or a thin trunk, under about 8 m' },
      { value: 'tree', label: 'Tree', hint: 'A single, sturdy trunk that reaches the canopy' },
    ],
  },
];

export const KEY_TRAITS_SEED: Record<string, KeyTraits> = {
  // Maples
  Mh: { lobes: ['palmate'], lobeCount: ['5'], lobeDepth: ['shallow'], margin: ['smooth'], habit: ['tree'] },
  Mr: { lobes: ['palmate'], lobeCount: ['3', '5'], lobeDepth: ['shallow'], margin: ['double', 'fine'], habit: ['tree'] },
  Ms: { lobes: ['palmate'], lobeCount: ['5'], lobeDepth: ['deep'], margin: ['coarse', 'double'], habit: ['tree'] },
  Mp: { lobes: ['palmate'], lobeCount: ['3'], lobeDepth: ['shallow'], margin: ['double', 'fine'], habit: ['shrub'] },
  // Oaks
  Or: { lobes: ['pinnate'], lobeTips: ['pointed'], widest: ['middle'], margin: ['smooth'], habit: ['tree'] },
  Ow: { lobes: ['pinnate'], lobeTips: ['rounded'], widest: ['middle'], margin: ['smooth'], habit: ['tree'] },
  Ob: { lobes: ['pinnate'], lobeTips: ['rounded'], widest: ['tip'], margin: ['smooth'], habit: ['tree'] },
  // Simple, unlobed
  Be: { lobes: ['none'], shape: ['oval'], petiole: ['round'], base: ['even'], margin: ['coarse'], bark: ['smooth'], habit: ['tree'] },
  Iw: { lobes: ['none'], shape: ['oval'], petiole: ['round'], base: ['even'], margin: ['double', 'fine'], bark: ['shaggy'], habit: ['tree'] },
  Bw: { lobes: ['none'], shape: ['oval'], petiole: ['round'], base: ['even'], margin: ['double'], bark: ['papery'], habit: ['tree'] },
  By: { lobes: ['none'], shape: ['oval'], petiole: ['round'], base: ['even'], margin: ['double'], bark: ['curly'], habit: ['tree'] },
  Al: { lobes: ['none'], shape: ['oval', 'round'], petiole: ['round'], base: ['even'], margin: ['double'], bark: ['smooth'], habit: ['shrub'] },
  Ew: { lobes: ['none'], shape: ['oval'], petiole: ['round'], base: ['lopsided'], margin: ['double', 'coarse'], bark: ['furrowed'], habit: ['tree'] },
  Bd: { lobes: ['none'], shape: ['heart'], petiole: ['round'], base: ['lopsided', 'even'], margin: ['coarse'], bark: ['furrowed'], habit: ['tree'] },
  Pl: { lobes: ['none'], shape: ['oval', 'round'], petiole: ['flat'], base: ['even'], margin: ['coarse'], bark: ['smooth'], habit: ['tree'] },
  Pt: { lobes: ['none'], shape: ['round'], petiole: ['flat'], base: ['even'], margin: ['fine'], bark: ['smooth'], habit: ['tree'] },
  Pb: { lobes: ['none'], shape: ['lance', 'oval'], petiole: ['round'], base: ['even'], margin: ['fine'], bark: ['furrowed', 'smooth'], habit: ['tree'] },
  Pd: { lobes: ['none'], shape: ['triangle'], petiole: ['flat'], base: ['even'], margin: ['coarse'], bark: ['furrowed'], habit: ['tree'] },
  // Compound
  Mm: { leaflets: ['few'], margin: ['coarse'], endLeaflet: ['present'], twig: ['smooth'], habit: ['tree'] },
  Aw: { leaflets: ['few'], margin: ['smooth'], endLeaflet: ['present'], twig: ['smooth'], habit: ['tree'] },
  Ab: { leaflets: ['few', 'many'], margin: ['fine'], endLeaflet: ['present'], twig: ['smooth'], habit: ['tree'] },
  El: { leaflets: ['few', 'many'], margin: ['fine'], endLeaflet: ['present'], twig: ['smooth'], habit: ['shrub'] },
  Am: { leaflets: ['many'], margin: ['fine'], endLeaflet: ['present'], twig: ['smooth'], habit: ['shrub', 'tree'] },
  Bn: { leaflets: ['many'], margin: ['fine'], endLeaflet: ['present'], twig: ['smooth'], habit: ['tree'] },
  Wb: { leaflets: ['many'], margin: ['fine'], endLeaflet: ['absent', 'present'], twig: ['smooth'], habit: ['tree'] },
  Sumac: { leaflets: ['many'], margin: ['fine'], endLeaflet: ['present'], twig: ['velvety'], habit: ['shrub'] },
};

/** The answers a species matches for a question, or undefined when the question doesn't apply to it. */
export function keyValues(s: Species, q: QuestionId): string[] | undefined {
  if (q === 'arrangement') return [s.arrangement];
  if (q === 'leafType') return [s.leafType];
  return s.keyTraits[q];
}

/** Keeps only known questions and answers, so saved traits can't break the key. */
export function cleanKeyTraits(raw: unknown): KeyTraits {
  const out: KeyTraits = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const q of KEY_QUESTIONS) {
    if (q.id === 'arrangement' || q.id === 'leafType') continue;
    const given = (raw as Record<string, unknown>)[q.id];
    if (!Array.isArray(given)) continue;
    const values = q.options.map((o) => o.value).filter((v) => given.includes(v));
    if (values.length) out[q.id] = values;
  }
  return out;
}
