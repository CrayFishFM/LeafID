import type { Rating, Topic } from './types';

// Severity and AGS/UGS, from the Forest Health defect table: major is always UGS, minor is always
// AGS, and moderate can go either way.
const major = (note?: string): Rating[] => [{ severity: 'major', stock: 'UGS', note }];
const moderate = (note?: string): Rating[] => [{ severity: 'moderate', stock: 'either', note }];
const MAJOR = major();
const MODERATE = moderate();
const MINOR: Rating[] = [{ severity: 'minor', stock: 'AGS' }];

export const DEFECTS: Topic = {
  id: 'defects',
  title: 'Hardwood defect ID',
  short: 'Defects',
  blurb: '30 hardwood defects, from the hardwood defect picture ID practice quiz.',
  question: 'Which defect is this?',
  noun: 'defect',
  source: 'Hardwood Defect Picture ID practice quiz',
  groups: {
    form: 'Stem form',
    wounds: 'Scars, seams & cavities',
    conks: 'Conks & decay fungi',
    disease: 'Cankers, diseases & insects',
  },
  items: [
    {
      id: 'crook', name: 'Crook', group: 'form', images: ['02.webp'],
      tips: [
        'An abrupt bend or dog-leg in the stem, usually where the leader was lost and a branch took over.',
        'The kink is short and sharp; a sweep is a long, gradual curve.',
      ],
      lookalikes: ['sweep', 'lean'],
      ratings: MINOR,
    },
    {
      id: 'true-tinder', name: 'True tinder fungus', scientific: 'Fomes fomentarius', group: 'conks', images: ['03.webp'],
      tips: [
        'Hard, hoof-shaped conks that are grey with lighter and darker bands.',
        'Most often on birch and beech; several conks often line up on the stem.',
        'A sign of white rot in the stem.',
      ],
      lookalikes: ['false-tinder', 'artists-conk'],
      ratings: major('Usually found on dead birch.'),
    },
    {
      id: 'sweep', name: 'Sweep', group: 'form', images: ['04.webp'],
      tips: [
        'A long, gradual curve along the stem.',
        'The bend is spread over the length of the log; a crook is a sharp kink.',
      ],
      lookalikes: ['crook', 'lean'],
      ratings: MINOR,
    },
    {
      id: 'dark-face-scar', name: 'Dark face scar', group: 'wounds', images: ['05.webp'],
      tips: [
        'An open wound where the exposed wood has gone dark and soft.',
        'Dark wood is a sign that decay has already set in behind the scar.',
      ],
      lookalikes: ['white-face-scar', 'cavity'],
      ratings: [
        { when: 'Smaller than 900 cm²', severity: 'moderate', stock: 'either', note: 'Small dark face scars (< 900 cm²) are moderate.' },
        { when: 'Larger than 900 cm²', severity: 'major', stock: 'UGS', note: 'Large dark face scars (> 900 cm²) are major.' },
      ],
    },
    {
      id: 'spine-tooth', name: 'Spine tooth fungus', scientific: 'Climacodon septentrionalis', group: 'conks', images: ['06.webp'],
      tips: [
        'Large, overlapping clusters of cream to white shelves.',
        'Teeth or spines, not pores, on the underside.',
        'Usually on sugar maple; a sign of heart rot.',
      ],
      lookalikes: ['mossy-top', 'yellow-cap'],
      ratings: MAJOR,
    },
    {
      id: 'clinker', name: 'Clinker fungus', aka: 'Chaga', scientific: 'Inonotus obliquus', group: 'conks', images: ['07.webp'],
      tips: [
        'A black, deeply cracked mass that looks like burnt charcoal.',
        'Grows out of the stem, mostly on birch; the inside is rusty orange-brown.',
        'A sign of extensive heart rot.',
      ],
      lookalikes: ['coal-fungus', 'black-knot', 'burl'],
      ratings: major('Mostly on yellow and white birch.'),
    },
    {
      id: 'shoestring-root-rot', name: 'Shoestring root rot', aka: 'Armillaria', scientific: 'Armillaria spp.', group: 'conks', images: ['08.webp'],
      tips: [
        'Black, shoestring-like strands (rhizomorphs) under the bark.',
        'White fans of fungus between the bark and the wood.',
        'Clusters of honey-coloured mushrooms at the base of the tree in the fall.',
      ],
      lookalikes: ['yellow-cap', 'coal-fungus'],
      ratings: major('Think shoes: it is on the roots, at the base of the tree.'),
    },
    {
      id: 'burl', name: 'Burl', group: 'form', images: ['09.webp'],
      tips: [
        'A rounded, bark-covered swelling on the stem.',
        'Inside, the grain is swirled and twisted.',
      ],
      lookalikes: ['clinker', 'butt-flare'],
      ratings: MINOR,
    },
    {
      id: 'punk-knot', name: 'Punk knot fungus', group: 'conks', images: ['10.webp'],
      tips: [
        'A swollen knot or branch stub with soft, punky, rotten wood in the middle.',
        'Shows that decay has entered the stem through the old branch.',
      ],
      lookalikes: ['false-tinder', 'burl'],
      ratings: MAJOR,
    },
    {
      id: 'sun-scald', name: 'Sun scald', group: 'wounds', images: ['11.webp'],
      tips: [
        'Long, vertical strips of dead bark that crack and peel away.',
        'On the sunny south or southwest side, often after the stand was opened up.',
      ],
      lookalikes: ['frost-crack', 'white-face-scar'],
      ratings: moderate('Found on young trees; the scar faces the sun.'),
    },
    {
      id: 'butternut-canker', name: 'Butternut canker', group: 'disease', images: ['12.webp'],
      tips: [
        'Sunken, elongated cankers on butternut, often with black, sooty, inky stains.',
        'Leads to dying branches and a thinning crown.',
        'Butternut is an endangered species in Ontario.',
      ],
      lookalikes: ['black-bark', 'nectria-canker', 'eutypella-canker'],
      ratings: MAJOR,
    },
    {
      id: 'butt-flare', name: 'Butt flare', aka: 'Barreling', group: 'form', images: ['13.webp'],
      tips: [
        'The base of the stem bulges or swells out like a barrel.',
        'Can mean butt rot inside the lower log.',
      ],
      lookalikes: ['burl', 'sweep'],
      ratings: major('Only counts as barreling when the bloat is in the first 2 m of the stem.'),
    },
    {
      id: 'black-bark', name: 'Black bark', group: 'disease', images: ['14.webp'],
      tips: [
        'Patches or streaks of bark that have turned black, unlike the rest of the stem.',
        'Look for where the dark bark starts and stops along the trunk.',
      ],
      lookalikes: ['butternut-canker', 'fluxing-seam', 'coal-fungus'],
      ratings: MAJOR,
    },
    {
      id: 'white-face-scar', name: 'White face scar', group: 'wounds', images: ['15.webp'],
      tips: [
        'An open wound where the exposed wood is still pale and firm.',
        'Light-coloured wood means decay has not taken hold yet.',
      ],
      lookalikes: ['dark-face-scar', 'sun-scald'],
      ratings: MINOR,
    },
    {
      id: 'coal-fungus', name: 'Coal fungus', scientific: 'Kretzschmaria deusta', group: 'conks', images: ['16.webp'],
      tips: [
        'Black, brittle, crusty patches that look like lumps of coal.',
        'Found at the base of the tree; a sign of butt rot.',
      ],
      lookalikes: ['clinker', 'black-bark'],
      ratings: MAJOR,
    },
    {
      id: 'fluxing-seam', name: 'Fluxing seam', group: 'wounds', images: ['17.webp'],
      tips: [
        'A seam or crack that weeps sap, leaving a dark, wet-looking stain down the bark.',
        'The fluxing (bleeding) is what sets it apart from a plain frost crack.',
      ],
      lookalikes: ['frost-crack', 'spiral-seam', 'black-bark'],
      ratings: [MODERATE[0], { when: 'Actively oozing', severity: 'moderate', stock: 'UGS', note: 'A fluxing seam that is oozing is UGS.' }],
    },
    {
      id: 'frost-crack', name: 'Frost crack', aka: 'Seam', group: 'wounds', images: ['18.webp'],
      tips: [
        'A straight, vertical crack running up the stem.',
        'Often has ridges of callus along its edges where it has tried to heal.',
      ],
      lookalikes: ['spiral-seam', 'fluxing-seam', 'sun-scald'],
      ratings: MODERATE,
    },
    {
      id: 'sugar-maple-borer', name: 'Sugar maple borer', group: 'disease', images: ['19.webp'],
      tips: [
        'A curved, S-shaped or diagonal scar on sugar maple, with a callus ridge around it.',
        'Left by the larva tunnelling under the bark.',
      ],
      lookalikes: ['dark-face-scar', 'eutypella-canker'],
      ratings: MODERATE,
    },
    {
      id: 'lean', name: 'Lean greater than 10°', group: 'form', images: ['20.webp'],
      tips: [
        'The whole stem tilts more than 10° away from vertical.',
        'The stem can be straight; it is the angle from the base that counts.',
      ],
      lookalikes: ['sweep', 'crook'],
      ratings: MODERATE,
    },
    {
      id: 'nectria-canker', name: 'Nectria canker', aka: 'Target canker', group: 'disease', images: ['21.webp'],
      tips: [
        'Rings of callus around a sunken centre, like a target.',
        'The bark falls away from the centre, showing the ridges.',
      ],
      lookalikes: ['eutypella-canker', 'butternut-canker'],
      ratings: MAJOR,
    },
    {
      id: 'eutypella-canker', name: 'Eutypella canker', aka: 'Cobra canker', group: 'disease', images: ['22.webp'],
      tips: [
        'A large canker on maple with bark still stuck to the centre.',
        'Thick, swollen callus around the edge gives a cobra-head shape.',
      ],
      lookalikes: ['nectria-canker', 'sugar-maple-borer'],
      ratings: MAJOR,
    },
    {
      id: 'epicormic-branching', name: 'Epicormic branching', group: 'form', images: ['23.webp'],
      tips: [
        'Small sprouts and twigs growing straight out of the main stem.',
        'Often appears after the tree is stressed or suddenly opened up.',
      ],
      lookalikes: ['burl', 'punk-knot'],
      ratings: MINOR,
    },
    {
      id: 'spiral-seam', name: 'Spiral seam', group: 'wounds', images: ['24.webp'],
      tips: [
        'A seam or crack that twists around the stem.',
        'It follows a spiral grain instead of running straight up.',
      ],
      lookalikes: ['frost-crack', 'fluxing-seam'],
      ratings: MODERATE,
    },
    {
      id: 'beech-bark-disease', name: 'Beech bark disease', group: 'disease', images: ['25.webp'],
      tips: [
        'White, woolly specks of scale insects on smooth beech bark.',
        'Later, the bark becomes pitted with tarry spots and small cankers.',
      ],
      lookalikes: ['nectria-canker', 'black-bark'],
      ratings: major('Only UGS once the fruiting bodies are there. Scale insects alone are not UGS.'),
    },
    {
      id: 'yellow-cap', name: 'Yellow cap fungus', scientific: 'Pholiota spp.', group: 'conks', images: ['26.webp'],
      tips: [
        'Clusters of yellow to golden mushrooms with caps and stalks.',
        'Often grow out of wounds or seams on the stem; a sign of decay.',
      ],
      lookalikes: ['shoestring-root-rot', 'spine-tooth'],
      ratings: major('Grows on the stem from a seam.'),
    },
    {
      id: 'false-tinder', name: 'False tinder fungus', scientific: 'Phellinus igniarius', group: 'conks', images: ['27.webp'],
      tips: [
        'Hoof-shaped conk with a black, deeply cracked top.',
        'Rusty-brown to light edge and a brown pore surface underneath.',
        'A sign of heavy heart rot.',
      ],
      lookalikes: ['true-tinder', 'artists-conk', 'punk-knot'],
      ratings: major('Almost always (99%) on poplar.'),
    },
    {
      id: 'black-knot', name: 'Black knot on cherry', group: 'disease', images: ['28.webp'],
      tips: [
        'Hard, black, lumpy swellings on the twigs and branches of cherry.',
        'Looks like burnt sausages wrapped around the branch.',
      ],
      lookalikes: ['clinker', 'coal-fungus'],
      ratings: [MODERATE[0], { when: 'More than 50% of the crown affected', severity: 'moderate', stock: 'UGS', note: 'Black knot on more than 50% of the crown is UGS.' }],
    },
    {
      id: 'mossy-top', name: 'Mossy top fungus', scientific: 'Oxyporus populinus', group: 'conks', images: ['29.webp'],
      tips: [
        'Small, white, overlapping shelves, often covered in moss on top.',
        'Usually on maple; a sign of heart rot.',
      ],
      lookalikes: ['spine-tooth', 'artists-conk'],
      ratings: major('Counted as major/UGS, but it acts very slowly: a tree caught early may still be kept as AGS.'),
    },
    {
      id: 'cavity', name: 'Cavity on main stem', group: 'wounds', images: ['30.webp'],
      tips: [
        'An open hole leading into the stem.',
        'Means decay inside, but may also be used as a wildlife den or nest.',
      ],
      lookalikes: ['dark-face-scar', 'punk-knot'],
      ratings: major('UGS, but keep the tree when you can: cavities are good for wildlife.'),
    },
    {
      id: 'artists-conk', name: 'Artist’s conk', scientific: 'Ganoderma applanatum', group: 'conks', images: ['31.webp'],
      tips: [
        'Flat, shelf-like conk with a brown top.',
        'White pore surface underneath that turns brown when scratched.',
        'Usually low on the stem; a sign of butt rot.',
      ],
      lookalikes: ['true-tinder', 'false-tinder', 'mossy-top'],
      ratings: MAJOR,
    },
  ],
};
