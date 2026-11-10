import type { Rating, Topic } from './types';

/** Images are numbered NN.webp in public/quizzes/conifer-defects/, after the slide image they came from. */
const imgs = (...n: number[]) => n.map((x) => `${String(x).padStart(2, '0')}.webp`);

// Severity and AGS/UGS, from the Conifer Defect Indicators lecture: major defects degrade rapidly
// (always UGS), moderate degrade slowly (either way), minor keep their quality (always AGS).
const major = (note?: string): Rating[] => [{ severity: 'major', stock: 'UGS', note }];
const moderate = (note?: string): Rating[] => [{ severity: 'moderate', stock: 'either', note }];
const MAJOR = major();
const MODERATE = moderate();
const MINOR: Rating[] = [{ severity: 'minor', stock: 'AGS' }];

export const CONIFER_DEFECTS: Topic = {
  id: 'conifer-defects',
  title: 'Conifer defect ID',
  short: 'Conifer defects',
  blurb: '18 conifer defects, from the Conifer Defect Indicators lecture.',
  question: 'Which defect is this?',
  noun: 'defect',
  source: 'Conifer Defect Indicators lecture',
  groups: {
    rots: 'Root rots & decay fungi',
    pests: 'Rust, insects & animals',
    damage: 'Injuries & dieback',
    form: 'Stem form',
  },
  items: [
    // ---- Major: the tree will degrade rapidly ----
    {
      id: 'fomes-root-rot', name: 'Fomes root rot', scientific: 'Heterobasidion annosum', group: 'rots', images: imgs(11, 7, 8),
      tips: [
        'Conks at the root collar, in the litter layer: grey-brown to dark brown zoned top with a lighter margin.',
        'Underside biscuit-coloured with small pores.',
        'Individual trees or groups decline, with yellowing foliage and fading crowns; trees break at the root collar.',
        'Spreads through root grafts and fresh stumps or wounds: remove infected trees and neighbours whose crowns touch.',
      ],
      lookalikes: ['tomentosus-root-rot', 'velvet-top', 'shoestring-root-rot'],
      ratings: major('Pockets of dead red pine can also be lightning: look for a struck tree.'),
    },
    {
      id: 'shoestring-root-rot', name: 'Shoestring root rot', aka: 'Armillaria', scientific: 'Armillaria spp.', group: 'rots', images: imgs(14, 13, 12),
      tips: [
        'Fan-shaped white mycelial felt between the bark and the wood.',
        'Dark-brown or black shoestrings (rhizomorphs) under the bark or in the soil.',
        'Clusters of honey-coloured mushrooms at the root collar in the fall.',
        'Mostly attacks trees already weakened by stress; prone to windthrow.',
      ],
      lookalikes: ['fomes-root-rot', 'tomentosus-root-rot', 'barrelling'],
      ratings: MAJOR,
    },
    {
      id: 'tomentosus-root-rot', name: 'Tomentosus root rot', scientific: 'Inonotus tomentosus', group: 'rots', images: imgs(18, 17, 16),
      tips: [
        'Yellowish-brown conks with a velvety, plush top.',
        'On the ground: stalked with a thin circular cap. On the butt: thicker and shelf-like.',
        'Most common on spruces; lower branches die and the crown thins.',
      ],
      lookalikes: ['velvet-top', 'fomes-root-rot'],
      ratings: MAJOR,
    },
    {
      id: 'velvet-top', name: 'Velvet-top fungus', scientific: 'Phaeolus schweinitzii', group: 'rots', images: imgs(26, 29, 27),
      tips: [
        'Velvety, reddish-brown conks with a light yellow-brown margin, zoned in rings.',
        'Underside dirty green with large, irregular pores; turns red-brown when bruised.',
        'Thin brackets stacked on old basal wounds, or circular, sunken conks on the ground over a rotten root.',
        'Causes brown cubical rot in the heartwood.',
      ],
      lookalikes: ['tomentosus-root-rot', 'red-ring-rot'],
      ratings: MAJOR,
    },
    {
      id: 'red-ring-rot', name: 'Red ring rot', scientific: 'Phellinus pini', group: 'rots', images: imgs(31, 30),
      tips: [
        'Hoof- or shell-shaped conks on the underside of dead branch stubs of living trees.',
        'Top dull grey to brownish black with concentric furrows; underside light brown to gold and velvety.',
        'Mostly in mature and overmature pines; rot runs metres above and below each conk.',
      ],
      lookalikes: ['velvet-top', 'fomes-root-rot'],
      ratings: major('Does not kill the tree, but salvage it before the wood is lost.'),
    },
    {
      id: 'blister-rust', name: 'White pine blister rust', scientific: 'Cronartium ribicola', group: 'pests', images: imgs(19, 25, 21, 22, 20),
      tips: [
        'Orange-yellow spore blisters bursting through swollen bark on the stem or branches.',
        'Dead, brown branches (flags) and resin or sap running down the bole.',
        'Needs Ribes (currants and gooseberries) as an alternate host; it cannot spread pine to pine.',
      ],
      lookalikes: ['white-pine-weevil', 'dead-top', 'pine-engraver'],
      ratings: [
        { when: 'On the main stem', severity: 'major', stock: 'UGS', note: 'Blister rust on the main stem is major.' },
        { when: 'Only on lateral branches', severity: 'moderate', stock: 'either', note: 'Blister rust only on the side branches is moderate.' },
      ],
    },
    {
      id: 'barrelling', name: 'Barrelling', aka: 'Butt flare', group: 'form', images: imgs(33, 32),
      tips: [
        'The lower bole bulges out like a barrel: an unusual change in taper.',
        'Can mean advanced butt rot (a hollow butt) inside.',
      ],
      lookalikes: ['burl', 'shoestring-root-rot'],
      ratings: MAJOR,
    },

    // ---- Moderate: the tree will degrade slowly ----
    {
      id: 'white-pine-weevil', name: 'White pine weevil', scientific: 'Pissodes strobi', group: 'pests', images: imgs(37, 34, 36, 35),
      tips: [
        'The leader and top whorl wilt, curl over and turn brown (a "shepherd’s crook").',
        'In older trees, past attacks show as forked, crooked or multiple stems.',
        'Worst in open-grown pine: leave crown closure (shelterwood), do not clearcut white pine.',
      ],
      lookalikes: ['dead-top', 'blister-rust', 'crook-sweep'],
      ratings: MODERATE,
    },
    {
      id: 'pine-engraver', name: 'Pine engraver beetle', scientific: 'Ips pini', group: 'pests', images: imgs(45, 44, 42, 41, 43),
      tips: [
        'Small round entrance holes with yellow or reddish boring dust in the bark crevices.',
        'Engraved galleries on the wood under the bark.',
        'Foliage fades green to yellow to reddish-brown; often kills the top.',
        'Builds up in fresh slash and lightning-struck trees.',
      ],
      lookalikes: ['feeding-damage', 'dead-top'],
      ratings: MODERATE,
    },
    {
      id: 'feeding-damage', name: 'Feeding damage', aka: 'Porcupine, sapsucker', group: 'pests', images: imgs(47, 48, 46),
      tips: [
        'Porcupine: bark chewed off in patches high in the tree, which can girdle and kill the top.',
        'Yellow-bellied sapsucker: rows or bands of small holes in the bark, often oozing sap.',
      ],
      lookalikes: ['pine-engraver', 'mechanical-damage'],
      ratings: moderate('AGS or UGS depending on how bad it is and where. Heavy sapsucker feeding is 50+ holes in a band.'),
    },
    {
      id: 'dead-top', name: 'Broken or dead top', aka: 'Crown dieback', group: 'damage', images: imgs(51, 50, 49),
      tips: [
        'A snapped or dead leader, or thin, discoloured foliage and dead branches in the upper crown.',
        'A frayed, broom-like break is a bigger infection risk than a clean one.',
        'The upper crown is the main cone-bearing zone, so the tree makes less seed.',
      ],
      lookalikes: ['white-pine-weevil', 'lightning', 'blister-rust'],
      ratings: [MODERATE[0], { when: 'More than 50% of the crown affected', severity: 'moderate', stock: 'UGS', note: 'A broken or dead top over more than 50% of the crown is UGS.' }],
    },
    {
      id: 'lightning', name: 'Lightning injury', group: 'damage', images: imgs(53, 52),
      tips: [
        'A thin strip of bark blown off down the length of the bole, the wood singed or shattered.',
        'In red pine the strike travels through root grafts and kills neighbouring trees too.',
      ],
      lookalikes: ['mechanical-damage', 'fire-scar', 'dead-top'],
      ratings: MODERATE,
    },
    {
      id: 'fire-scar', name: 'Fire scar', group: 'damage', images: imgs(54, 57, 56),
      tips: [
        'A "church door": a tall, triangular scar at the base on one side of the tree.',
        'Charred bark around the edges of the wound.',
      ],
      lookalikes: ['mechanical-damage', 'lightning', 'root-wounds'],
      ratings: MODERATE,
    },
    {
      id: 'root-wounds', name: 'Root wounds', group: 'damage', images: imgs(59, 58),
      tips: [
        'Exposed roots with the bark scraped or torn off.',
        'Often from logging equipment and skid trails; an entry for root rots.',
      ],
      lookalikes: ['mechanical-damage', 'fire-scar'],
      ratings: MODERATE,
    },
    {
      id: 'mechanical-damage', name: 'Mechanical damage', aka: 'Stem wounds', group: 'damage', images: imgs(61, 60, 63, 62),
      tips: [
        'A scraped stem wound with a dry, case-hardened surface; little decay.',
        'From logging equipment or a tree falling into the stem; can be a problem in plantations.',
      ],
      lookalikes: ['lightning', 'fire-scar', 'root-wounds'],
      ratings: [
        { when: 'Smaller than 1000 cm²', severity: 'moderate', stock: 'either', note: 'Small wounds are moderate. 1000 cm² is about 32 × 32 cm.' },
        { when: 'Larger than 1000 cm²', severity: 'major', stock: 'UGS', note: 'Wounds over 1000 cm² (32 × 32 cm) are major on any tree; on a 10–31 cm dbh tree, so is a wound bigger than dbh².' },
      ],
    },
    {
      id: 'lean', name: 'Lean greater than 10°', group: 'form', images: imgs(64, 65),
      tips: [
        'The whole stem tilts more than 10° from vertical.',
        'The stem can be straight; it is the angle from the base that counts.',
      ],
      lookalikes: ['crook-sweep', 'barrelling'],
      ratings: MODERATE,
    },

    // ---- Minor: the tree will keep its quality over the cutting cycle ----
    {
      id: 'burl', name: 'Burl', group: 'form', images: imgs(67, 69),
      tips: [
        'A rounded, bark-covered swelling on the stem.',
        'Inside, the grain is swirled and twisted.',
      ],
      lookalikes: ['barrelling', 'crook-sweep'],
      ratings: MINOR,
    },
    {
      id: 'crook-sweep', name: 'Crook & sweep', group: 'form', images: imgs(68),
      tips: [
        'Crook: a sharp bend or dog-leg in the stem.',
        'Sweep: a long, gradual curve along the stem.',
      ],
      lookalikes: ['lean', 'white-pine-weevil', 'burl'],
      ratings: MINOR,
    },
  ],
};
