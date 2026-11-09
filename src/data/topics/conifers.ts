import type { Topic } from './types';

/** Images are numbered NN.webp in public/quizzes/conifers/. */
const imgs = (...n: number[]) => n.map((x) => `${String(x).padStart(2, '0')}.webp`);

export const CONIFERS: Topic = {
  id: 'conifers',
  title: 'Conifer ID',
  short: 'Conifers',
  blurb: 'The Ontario conifers from Dendrology lectures 7–9: pines, spruces, tamarack, cedar, hemlock and balsam fir, by their needles and cones.',
  question: 'Which conifer is this?',
  noun: 'conifer',
  source: 'Dendrology lectures 7–9 (pines; spruces; larch, cedar, hemlock and fir)',
  groups: {
    pines: 'Pines',
    spruces: 'Spruces',
    others: 'Larch, cedar, hemlock & fir',
    ornamentals: 'Ornamentals',
  },
  items: [
    // ---- Lecture 7: pines (needles in bundles, wrapped in a sheath at the base) ----
    {
      id: 'white-pine', code: 'Pw', name: 'Eastern white pine', scientific: 'Pinus strobus', group: 'pines',
      images: imgs(1, 2, 3, 4),
      tips: [
        'Needles in bundles of 5, soft and flexible, 5–15 cm long.',
        'Long, slender cones that hang from the branch.',
        'Bark smooth and grey-green when young; dark and deeply furrowed with age.',
        'Habitat: dry to moist, rocky to loamy uplands; with tolerant hardwoods, red pine, hemlock or in pure stands.',
        'Silvicultural system: uniform shelterwood. Wood soft, light and straight-grained (lumber, plywood, furniture).',
      ],
      lookalikes: ['red-pine', 'scots-pine', 'jack-pine'],
    },
    {
      id: 'red-pine', code: 'Pr', name: 'Red pine', scientific: 'Pinus resinosa', group: 'pines',
      images: imgs(9, 10, 11),
      tips: [
        'Needles in bundles of 2, long: 10–16 cm.',
        'Bark reddish-brown in flat, scaly plates.',
        'Often in straight-row plantations.',
        'Habitat: dry to fresh, sandy uplands; pure stands or with white pine, jack pine or tolerant hardwoods.',
        'Silvicultural system: conventional clearcut; plantations. Takes preservatives well (utility poles, fences, structural lumber).',
      ],
      lookalikes: ['jack-pine', 'scots-pine', 'white-pine'],
    },
    {
      id: 'jack-pine', code: 'Pj', name: 'Jack pine', scientific: 'Pinus banksiana', group: 'pines',
      images: imgs(15, 16, 17),
      tips: [
        'Needles in bundles of 2, very short: 2–4 cm, flat and spread apart.',
        'Curved cones that point forward along the branch.',
        'Habitat: dry to fresh, sandy uplands (occasionally wet organic sites); with black spruce, white pine, red pine or in pure stands.',
        'Silvicultural system: conventional clearcut. Wood moderately hard and heavy (lumber, pulp, railway ties, poles).',
      ],
      lookalikes: ['scots-pine', 'red-pine'],
    },
    {
      id: 'scots-pine', code: 'Ps', name: 'Scots pine', scientific: 'Pinus sylvestris', group: 'pines',
      images: imgs(21, 22, 23),
      tips: [
        'Needles in bundles of 2, 4–8 cm long, flat and twisted, with a bluish tinge.',
        'Upper trunk and branches have orange, flaking bark.',
        'Introduced to North America: planted stands and landscaping.',
      ],
      lookalikes: ['jack-pine', 'red-pine', 'mugo-pine'],
    },

    // ---- Lecture 8: spruces (single, stiff, four-sided needles all around the twig) ----
    {
      id: 'white-spruce', code: 'Sw', name: 'White spruce', scientific: 'Picea glauca', group: 'spruces',
      images: imgs(27, 28),
      tips: [
        'Needles straight and stiff, growing all around the twig; tip pointed but not sharp; 15–22 mm.',
        'Bark smooth and thin when young, becoming scaly ("corn flake" bark); light grey darkening with age, newly exposed bark salmon-pink.',
        'Habitat: wide range of soils and climates; invades abandoned farmland; with trembling aspen, white birch, black spruce and balsam fir.',
        'Silvicultural system: conventional clearcut (pulp, lumber).',
      ],
      lookalikes: ['black-spruce', 'red-spruce'],
    },
    {
      id: 'black-spruce', code: 'Sb', name: 'Black spruce', scientific: 'Picea mariana', group: 'spruces',
      images: imgs(32),
      tips: [
        'Needles short (8–15 mm, about half of white spruce), straight and blunt-pointed, densely set along the twig, with a bluish hue.',
        'Narrow crown with a dense club-shaped top.',
        'Bark thin, scaly; reddish- or greyish-brown, newly exposed bark olive- or yellowish-green.',
        'Habitat: wet, poorly drained sites (if your feet are wet), usually in pure stands; with jack pine, white spruce, balsam fir, white birch and aspen.',
        'Silvicultural system: conventional clearcut (pulp, lumber).',
      ],
      lookalikes: ['white-spruce', 'red-spruce'],
    },
    {
      id: 'red-spruce', code: 'Sr', name: 'Red spruce', scientific: 'Picea rubens', group: 'spruces',
      images: imgs(36),
      tips: [
        'Needles curved and blunt-pointed, pointing forward and often pressed close to the twig; 10–16 mm; shiny yellowish (lime) green.',
        'Bark shredded when young, then scales or plates; reddish-brown becoming reddish-black, dark and furrowed at maturity.',
        'Habitat: cool, moist sites such as north-facing slopes and lake shores; with white pine, balsam fir, hemlock, yellow birch and sugar maple.',
        'Hybridizes with black spruce.',
      ],
      lookalikes: ['black-spruce', 'white-spruce'],
    },

    // ---- Lecture 9: larch, cedar, hemlock and balsam fir ----
    {
      id: 'tamarack', code: 'La', name: 'Tamarack', aka: 'Larch', scientific: 'Larix laricina', group: 'others',
      images: imgs(40, 41),
      tips: [
        'Soft needles in tufts of 15–60 on short spur shoots, 2–5 cm long, flattened above.',
        'Drops its needles in fall: the gold conifers around a bog.',
        'Very small cones.',
        'Bark thin and smooth when young, becoming scaly.',
        'Habitat: cold, wet, poorly drained bogs and muskeg, often a narrow pure band around a bog; with black spruce and eastern white cedar.',
      ],
      lookalikes: ['jack-pine', 'white-pine', 'black-spruce'],
    },
    {
      id: 'white-cedar', code: 'Ce', name: 'Eastern white cedar', scientific: 'Thuja occidentalis', group: 'others',
      images: imgs(46, 47),
      tips: [
        'Scale-like leaves (4–5 mm) in flat, fan-like sprays; smells like cedar.',
        'Bark thin, separating into long, narrow, flat strips; shiny reddish-brown when young, grey with age.',
        'Habitat: swamps, or very shallow dry soils over limestone; small pure stands or with white pine, yellow birch, hemlock, black ash and white elm.',
        'Silvicultural system: group selection, strip/patch cuts. Wood light, soft and resists decay (fence posts, shingles, decking).',
      ],
      lookalikes: ['eastern-hemlock', 'balsam-fir'],
    },
    {
      id: 'eastern-hemlock', code: 'He', name: 'Eastern hemlock', scientific: 'Tsuga canadensis', group: 'others',
      images: imgs(51, 52, 53),
      tips: [
        'Flat single needles, the smallest of these (10–20 mm), with a short stalk; tip blunt, rounded or notched.',
        'Underside has two bright white lines with a clear green margin.',
        'Thin twigs make the branch ends droop (less stout than balsam fir); small cones.',
        'Bark scaly when young, then deeply furrowed with broad, flat-topped ridges; inner bark bright reddish-purple.',
        'Very shade-tolerant; needs a cool, moist site. Good deer yard. Silvicultural system: group selection, selection.',
      ],
      lookalikes: ['balsam-fir', 'white-cedar'],
    },
    {
      id: 'balsam-fir', code: 'Bf', name: 'Balsam fir', scientific: 'Abies balsamea', group: 'others',
      images: imgs(58, 59, 60),
      tips: [
        'Flat single needles about twice as long as hemlock (15–25 mm), sitting straight out on the twig; tip rounded or notched.',
        'Strong balsam smell when crushed; upper surface shiny dark green, often with a few white dots near the tip.',
        'Bark smooth with raised resin blisters when young, breaking into irregular scales with age.',
        'Habitat: variety of soils and climates; pure or with aspen, white birch, the spruces and hemlock. Rots from the inside out as it grows.',
        'Uses: pulp, lumber, Christmas trees.',
      ],
      lookalikes: ['eastern-hemlock', 'white-spruce', 'black-spruce'],
    },

    // ---- Ornamentals (lecture 8) ----
    {
      id: 'mugo-pine', name: 'Mugo pine', scientific: 'Pinus mugo', group: 'ornamentals', note: 'Ornamental',
      images: imgs(65),
      tips: ['A low, rounded, shrubby pine used in landscaping.', 'Needles in bundles of 2.'],
      lookalikes: ['scots-pine', 'jack-pine'],
    },
  ],
};
