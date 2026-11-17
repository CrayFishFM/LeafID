import type { Topic } from './types';

/** Images are named <slide><letter>.webp in public/quizzes/twigs/, from the slide they came from. */
const imgs = (slide: number, letters: string) => [...letters].map((l) => `${String(slide).padStart(2, '0')}${l}.webp`);

/** Bud arrangement is always plain on a real twig, so every question gives it. */
const opposite = (...more: string[]) => ['Buds and leaf scars are opposite.', ...more];
const alternate = (...more: string[]) => ['Buds and leaf scars are alternate.', ...more];

const ASH_BUDS = { file: 'ash-buds.webp', alt: 'Ash buds compared: white, black and green ash' };
const WALNUT_SCARS = [
  { file: 'walnut-leaf-scars.webp', alt: 'Butternut and black walnut leaf scars side by side' },
  { file: 'walnut-leaf-scars-close.webp', alt: 'Butternut and black walnut leaf scars, close up' },
];

export const TWIGS: Topic = {
  id: 'twigs',
  title: 'Twig ID',
  short: 'Twigs',
  blurb: 'Winter ID of Ontario hardwoods and shrubs by their twigs: bud shape and colour, bud scales, leaf scars, lenticels, pith and arrangement.',
  question: 'Which tree is this twig from?',
  noun: 'twig',
  source: 'Dendrology: Twig Identification (TwigIDForTechfinal)',
  groups: {
    opposite: 'Opposite: maples, ashes & hobblebush',
    nuts: 'Walnuts, sumac & oaks',
    birches: 'Beech, birches & relatives',
    poplars: 'Poplars & willows',
    others: 'Basswood, elm & cherry',
  },
  items: [
    // ---- Opposite arrangement ----
    {
      id: 'sugar-maple', code: 'Mh', name: 'Sugar maple', scientific: 'Acer saccharum', group: 'opposite',
      images: imgs(7, 'ab'),
      inHand: opposite(),
      tips: [
        'Sharp-pointed, cone-shaped terminal bud with many overlapping scales.',
        'Opposite arrangement.',
        'Twig shiny reddish-brown to green.',
      ],
      lookalikes: ['red-maple', 'norway-maple', 'silver-maple'],
    },
    {
      id: 'red-maple', code: 'Mr', name: 'Red maple', scientific: 'Acer rubrum', group: 'opposite',
      images: imgs(8, 'ab'),
      inHand: opposite(),
      tips: [
        'Blunt terminal bud with 3 or more scales (fewer than sugar maple).',
        'Shiny red to grey twigs; the current year\'s growth is red.',
        'Opposite arrangement. One of the first trees to flush in spring (clusters of red flower buds).',
      ],
      lookalikes: ['silver-maple', 'sugar-maple', 'striped-maple'],
    },
    {
      id: 'silver-maple', code: 'Ms', name: 'Silver maple', scientific: 'Acer saccharinum', group: 'opposite',
      images: imgs(9, 'ab'),
      inHand: opposite('Broken twig has an unpleasant (rank) smell.'),
      tips: [
        'Resembles red maple: red twigs and blunt red buds, often in clusters.',
        'Opposite arrangement.',
      ],
      lookalikes: ['red-maple', 'sugar-maple'],
    },
    {
      id: 'striped-maple', code: 'Mp', name: 'Striped maple', scientific: 'Acer pensylvanicum', group: 'opposite',
      images: imgs(10, 'abc'),
      inHand: opposite('Twig smooth and hairless.'),
      tips: [
        'Bark smooth, green with whitish vertical stripes (reddish in the current year).',
        'Terminal bud slightly flattened with a rounded tip; reddish bud scales.',
        'Twigs hairless and reddish when young; lateral buds elongated and held close to the twig.',
      ],
      lookalikes: ['red-maple', 'manitoba-maple'],
    },
    {
      id: 'manitoba-maple', code: 'Mm', name: 'Manitoba maple', aka: 'Box elder', scientific: 'Acer negundo', group: 'opposite',
      images: imgs(11, 'ab'),
      inHand: opposite('Whitish bloom on the twig rubs off; leaf scars meet in raised points around the twig.'),
      tips: [
        'Twig greenish-purple to brown (often with a whitish bloom).',
        'Terminal bud ovoid; lateral buds large and pressed against the twig.',
        'Opposite arrangement.',
      ],
      lookalikes: ['norway-maple', 'white-ash', 'striped-maple'],
    },
    {
      id: 'norway-maple', code: 'Mn', name: 'Norway maple', scientific: 'Acer platanoides', group: 'opposite', note: 'Introduced',
      images: imgs(12, 'ab'),
      inHand: opposite(),
      tips: [
        'Large, plump buds, purple-green or reddish-purple.',
        'Leaf scars meet around the twig; "shoulders" on the twig past the lateral buds.',
        'Opposite arrangement.',
      ],
      lookalikes: ['sugar-maple', 'manitoba-maple'],
    },
    {
      id: 'white-ash', code: 'Aw', name: 'White ash', scientific: 'Fraxinus americana', group: 'opposite',
      images: imgs(13, 'a'),
      inHand: opposite('Twig stout and smooth.'), hintImages: [ASH_BUDS],
      tips: [
        'Uppermost lateral buds sit close to the terminal bud, "tight" to the twig: white is tight.',
        'Terminal bud wider than long.',
        'Opposite arrangement.',
      ],
      lookalikes: ['black-ash', 'manitoba-maple'],
    },
    {
      id: 'black-ash', code: 'Ab', name: 'Black ash', scientific: 'Fraxinus nigra', group: 'opposite',
      images: imgs(14, 'ab'),
      inHand: opposite('Raised lenticels feel rough.'), hintImages: [ASH_BUDS],
      tips: [
        'Uppermost lateral buds set below the terminal, not tight to it: black is slack.',
        'Dark, pointed terminal bud like a chocolate chip.',
        'Raised lenticels on the twig. Opposite arrangement.',
      ],
      lookalikes: ['white-ash'],
    },
    {
      id: 'hobblebush', name: 'Hobblebush', scientific: 'Viburnum lantanoides', group: 'opposite',
      images: imgs(36, 'abcd'),
      inHand: opposite('Buds have no scales: soft and fuzzy to the touch.'),
      tips: [
        'Naked buds (no scales) covered in tan, scruffy hairs that extend down the twig.',
        'Opposite buds; twig brownish-green with light lenticels.',
        'Bark grey-brown and warty. Branches fall over and root where they touch the ground.',
      ],
      lookalikes: ['staghorn-sumac', 'striped-maple'],
    },

    // ---- Walnuts, sumac & oaks ----
    {
      id: 'butternut', code: 'Bn', name: 'Butternut', scientific: 'Juglans cinerea', group: 'nuts',
      images: imgs(15, 'ab'),
      inHand: alternate('Cut lengthwise: pith chambered and dark chocolate-brown.', 'Fringe of hairs above the leaf scar (the eyebrow).'), hintImages: WALNUT_SCARS,
      tips: [
        'Leaf scar like a monkey\'s face with a single "eyebrow" (hairy fringe) above it.',
        'Elongated, pale yellow terminal bud; orange-yellow twig.',
        'Pith chambered, reddish-brown (dark).',
      ],
      lookalikes: ['black-walnut'],
    },
    {
      id: 'black-walnut', code: 'Wb', name: 'Black walnut', scientific: 'Juglans nigra', group: 'nuts',
      images: imgs(16, 'a'),
      inHand: alternate('Cut lengthwise: pith chambered and light orange-yellow / tan.', 'No hairy fringe above the leaf scar.'), hintImages: WALNUT_SCARS,
      tips: [
        'Leaf scar deeply notched: a monkey face getting hit in the head with a walnut. No eyebrow.',
        'Terminal bud ovoid, pale grey.',
        'Orange-brown twig; pith orange-yellow (light).',
      ],
      lookalikes: ['butternut'],
    },
    {
      id: 'staghorn-sumac', name: 'Staghorn sumac', scientific: 'Rhus typhina', group: 'nuts',
      images: imgs(17, 'ab'),
      inHand: alternate('Twig thick and velvety-hairy, like an antler in velvet.', 'Cut twig: large orange-brown pith; may ooze milky sap.'),
      tips: [
        'Stout twigs covered in velvety hairs (key ID feature!), like a deer\'s antler in velvet.',
        'No terminal bud.',
        'Leaf scar crescent-shaped, almost surrounding the bud.',
      ],
      lookalikes: ['hobblebush', 'butternut'],
    },
    {
      id: 'red-oak', code: 'Or', name: 'Red oak', scientific: 'Quercus rubra', group: 'nuts',
      images: imgs(18, 'ab'),
      inHand: alternate('Cut lengthwise: pith star-shaped (5-pointed) in cross-section.'),
      tips: [
        'Clusters of several terminal buds at the twig tip (all oaks).',
        'Buds ovoid and pointed, with many bud scales.',
        'Twig reddish-brown.',
      ],
      lookalikes: ['white-oak', 'bur-oak'],
    },
    {
      id: 'white-oak', code: 'Ow', name: 'White oak', scientific: 'Quercus alba', group: 'nuts',
      images: imgs(19, 'ab'),
      inHand: alternate('Cut lengthwise: pith star-shaped (5-pointed) in cross-section.'),
      tips: [
        'Clustered terminal buds, rounder and blunter than red oak.',
        'Lateral buds diverge (stand out) from the twig.',
        'Twig green to reddish-green.',
      ],
      lookalikes: ['red-oak', 'bur-oak'],
    },
    {
      id: 'bur-oak', code: 'Ob', name: 'Bur oak', scientific: 'Quercus macrocarpa', group: 'nuts',
      images: imgs(20, 'ab'),
      inHand: alternate('Corky ridges you can feel on the twig.', 'Cut: pith star-shaped (5-pointed).'),
      tips: [
        'Twig yellow-brown, often with corky ridges.',
        'Buds blunt-pointed, often with pointed scales; clustered at the tip.',
        'Lateral buds pressed against the twig.',
      ],
      lookalikes: ['white-oak', 'red-oak'],
    },

    // ---- Beech, birches & relatives ----
    {
      id: 'american-beech', code: 'Be', name: 'American beech', scientific: 'Fagus grandifolia', group: 'birches',
      images: imgs(21, 'ab'),
      inHand: alternate('Buds very long (2 cm+) and sharp to the touch.'),
      tips: [
        'Long, slender, sharp "cigar-shaped" buds.',
        'Twig slender with a slight zig-zag.',
        'Alternate arrangement.',
      ],
      lookalikes: ['ironwood', 'black-willow'],
    },
    {
      id: 'white-birch', code: 'Bw', name: 'White birch', aka: 'Paper birch', scientific: 'Betula papyrifera', group: 'birches',
      images: imgs(23, 'abc'),
      inHand: alternate('Raised lenticels make the twig feel rough.', 'No wintergreen taste when chewed.'),
      tips: [
        'Raised lenticels give a rough feel to the slender twig.',
        'Buds slender, tapering to a blunt point; scales green at the base, brown toward the tip.',
        'Dwarf (spur) shoots and catkins present.',
      ],
      lookalikes: ['yellow-birch', 'ironwood', 'speckled-alder'],
    },
    {
      id: 'yellow-birch', code: 'By', name: 'Yellow birch', scientific: 'Betula alleghaniensis', group: 'birches',
      images: imgs(24, 'ab'),
      inHand: alternate('Chewed or scraped twig tastes and smells of wintergreen.'),
      tips: [
        'Wintergreen flavour if the twig is chewed.',
        'Buds sharp-pointed, with 2 shades of brown on each scale.',
        'Slender brown twigs; dwarf shoots present.',
      ],
      lookalikes: ['white-birch', 'black-cherry', 'ironwood'],
    },
    {
      id: 'ironwood', code: 'Iw', name: 'Ironwood', aka: 'Hop-hornbeam', scientific: 'Ostrya virginiana', group: 'birches',
      images: imgs(25, 'a'),
      inHand: alternate('Twig thin and tough; no wintergreen taste.'),
      tips: [
        'Slender dark reddish-brown twigs, not as wide as the buds.',
        'Buds ovoid and pointed, spreading from the twig; no true terminal bud.',
        'No dwarf shoots (unlike the birches).',
      ],
      lookalikes: ['yellow-birch', 'beaked-hazel', 'american-beech'],
    },
    {
      id: 'speckled-alder', code: 'Al', name: 'Speckled alder', scientific: 'Alnus incana', group: 'birches',
      images: imgs(26, 'abcd'),
      inHand: alternate('Cut twig: pith triangular in cross-section.'),
      tips: [
        'Buds on a short but obvious stalk, with 2 or 3 scales.',
        'Twigs brown to reddish or greyish, with scattered white lenticels; bark has pale horizontal lenticels.',
        'Male catkins may be present over winter.',
      ],
      lookalikes: ['beaked-hazel', 'white-birch'],
    },
    {
      id: 'beaked-hazel', name: 'Beaked hazel', scientific: 'Corylus cornuta', group: 'birches',
      images: imgs(35, 'abc'),
      inHand: alternate('Twig smooth or with sparse fine hairs, no sticky glandular hairs.'),
      tips: [
        'Buds with 2-toned scales, greyish-brown with darker bases; flower buds ovoid with an acute tip (tiny red flowers in spring).',
        'Twigs with a slight zig-zag; smooth or sparsely hairy, no glandular hairs.',
        'Short catkins present over winter.',
      ],
      lookalikes: ['speckled-alder', 'ironwood'],
    },

    // ---- Poplars & willows ----
    {
      id: 'black-willow', code: 'Wi', name: 'Black willow', scientific: 'Salix nigra', group: 'poplars',
      images: imgs(27, 'ab'),
      inHand: alternate('Twig brittle: snaps off cleanly at the base.', 'Each bud covered by a single cap-like scale.'),
      tips: [
        'Buds narrow and conical, covered by a single cap-like scale, pressed to the twig.',
        'Buds shiny brown to yellow-brown.',
        'Twig light to reddish-brown, can be purplish-brown.',
      ],
      lookalikes: ['weeping-willow', 'american-beech'],
    },
    {
      id: 'weeping-willow', name: 'Weeping willow', scientific: 'Salix babylonica', group: 'poplars', note: 'Ornamental',
      images: imgs(28, 'a'),
      inHand: alternate('Long, limp, whip-like twig.', 'Each bud covered by a single cap-like scale.'), hintImages: [{ file: 'weeping-willow-form.webp', alt: 'Weeping willow tree in winter with drooping yellow twigs' }],
      tips: [
        'Long, slender, whip-like twigs; this year\'s growth yellow-orange.',
        'Lateral buds pressed against the twig like duck bills (most willows).',
      ],
      lookalikes: ['black-willow'],
    },
    {
      id: 'balsam-poplar', code: 'Pb', name: 'Balsam poplar', scientific: 'Populus balsamifera', group: 'poplars',
      images: imgs(29, 'ab'),
      inHand: alternate('Buds sticky with resin and strongly balsam-scented when crushed.'),
      tips: [
        'Large terminal bud, sticky and fragrant (resinous).',
        'Bud round with 5 scales.',
        'Twig bright reddish-brown, becoming dark and orange as it matures.',
      ],
      lookalikes: ['eastern-cottonwood', 'largetooth-aspen'],
    },
    {
      id: 'eastern-cottonwood', code: 'Pd', name: 'Eastern cottonwood', scientific: 'Populus deltoides', group: 'poplars',
      images: imgs(30, 'ab'),
      inHand: alternate('Buds slightly sticky and fragrant.', 'Cut twig: pith star-shaped (5-pointed).'),
      tips: [
        'Terminal bud 3-sided (angled), yellow-brown.',
        'Twig stout and smooth, yellow-brown.',
      ],
      lookalikes: ['balsam-poplar', 'largetooth-aspen'],
    },
    {
      id: 'trembling-aspen', code: 'Pt', name: 'Trembling aspen', scientific: 'Populus tremuloides', group: 'poplars',
      images: imgs(31, 'ab'),
      inHand: alternate('Buds shiny, slightly sticky but not fragrant.'),
      tips: [
        'Buds dark reddish-brown and shiny, tips curving inward toward the twig.',
        'Twig slender, dark green or brownish-grey, with oval lenticels.',
      ],
      lookalikes: ['largetooth-aspen', 'balsam-poplar'],
    },
    {
      id: 'largetooth-aspen', code: 'Pl', name: 'Largetooth aspen', scientific: 'Populus grandidentata', group: 'poplars',
      images: imgs(32, 'ab'),
      inHand: alternate('Buds dusty-feeling, not sticky or fragrant.'),
      tips: [
        'Buds dull brown and dusty-looking, not clasping the twig.',
        'Twig moderately coarse, dull brown to grey, with orange lenticels.',
        'Not resinous or fragrant like the other poplars.',
      ],
      lookalikes: ['trembling-aspen', 'eastern-cottonwood'],
    },

    // ---- Basswood, elm & cherry ----
    {
      id: 'basswood', code: 'Bd', name: 'Basswood', scientific: 'Tilia americana', group: 'others',
      images: imgs(22, 'ab'),
      inHand: alternate('Twig zig-zags; buds lopsided with 2–3 visible scales.', 'Inner bark fibrous and stringy.'),
      tips: [
        'Buds red, lopsided, like red popcorn kernels (2–3 visible scales).',
        'Twig yellow-brown; leaf scar semi-oval.',
      ],
      lookalikes: ['red-maple', 'american-elm'],
    },
    {
      id: 'american-elm', code: 'Ew', name: 'American elm', aka: 'White elm', scientific: 'Ulmus americana', group: 'others',
      images: imgs(33, 'ab'),
      inHand: alternate(),
      tips: [
        'End bud bent (canted) to one side; buds somewhat flattened.',
        'Lateral buds pressed against the slender twig.',
        'Twigs grey-brown with few lenticels.',
      ],
      lookalikes: ['basswood', 'ironwood', 'black-cherry'],
    },
    {
      id: 'black-cherry', code: 'Cb', name: 'Black cherry', scientific: 'Prunus serotina', group: 'others',
      images: imgs(34, 'ab'),
      inHand: alternate('Scraped twig smells of bitter almond.'),
      tips: [
        'Buds blunt with about 10 scales: darker brown tips and a green base.',
        'Twig slender and reddish-brown (bitter almond smell when scraped).',
      ],
      lookalikes: ['yellow-birch', 'american-elm'],
    },
  ],
};
