/**
 * Ecology midterm review (FOR7312), from the midterm review lecture, the Tree Physiology and
 * Forest Succession lectures, and the Ecology notes. Shade tolerance follows the lecture's table.
 */
import { mc, multi, order, tf, typed, type RankDrill, type SortDrill, type StudyCard, type StudyGuide } from './types';

const REGIONS = 'Forest regions';
const SHADE = 'Shade tolerance & silviculture';
const PHYS = 'Tree physiology';
const REPRO = 'Reproduction';
const SUCC = 'Succession';

/** The lecture's shade tolerance table, with the % of full sunlight each class needs. */
export const SHADE_TABLE: { level: string; sun: string; species: string[] }[] = [
  { level: 'Very intolerant', sun: '60–100% sun', species: ['Largetooth aspen', 'Trembling aspen', 'Pin cherry', 'Jack pine', 'Balsam poplar', 'Tamarack', 'Willow'] },
  { level: 'Intolerant', sun: '30–60% sun', species: ['Black ash', 'White birch', 'Butternut', 'Black cherry', 'Hickory', 'Juniper', 'Red pine', 'Black walnut'] },
  { level: 'Intermediate', sun: '10–30% sun', species: ['White ash', 'Basswood', 'Yellow birch', 'White elm', 'Silver maple', 'Red oak', 'White oak', 'Scots pine', 'White pine'] },
  { level: 'Tolerant', sun: '3–10% sun', species: ['White cedar', 'Red maple', 'Black spruce', 'Red spruce', 'White spruce'] },
  { level: 'Very tolerant', sun: '1–3% sun', species: ['Beech', 'Balsam fir', 'Hemlock', 'Ironwood', 'Sugar maple'] },
];

const tolerance3 = (level: string) => (level.endsWith('intolerant') || level === 'Intolerant' ? 'Intolerant' : level === 'Intermediate' ? 'Intermediate' : 'Tolerant');
const speciesIn = (...levels: string[]) => SHADE_TABLE.filter((r) => levels.includes(r.level)).flatMap((r) => r.species);

const CARDS: StudyCard[] = [
  // ---- Forest regions ----
  {
    section: REGIONS, q: 'Define a forest region.',
    a: ['A geographic zone, or belt, whose vegetation cover is characterized by a fairly uniform dominant species and stand type.'],
    test: [
      mc('A forest region is a geographic zone whose vegetation has…', ['A fairly uniform dominant species and stand type', 'The same soil everywhere', 'One kind of wildlife', 'The same rainfall'], 0, 'A zone or belt with a fairly uniform dominant species and stand type.'),
    ],
  },
  {
    section: REGIONS, q: 'Name Canada’s forest regions.',
    a: ['Boreal', 'Subalpine', 'Montane', 'Coast', 'Columbian', 'Deciduous (Carolinian)', 'Great Lakes–St. Lawrence', 'Acadian', 'Grasslands', 'Tundra'],
    test: [
      multi('Select the forest regions of Canada.', ['Boreal', 'Acadian', 'Columbian', 'Subalpine', 'Taiga', 'Pacific Maritime'], [0, 1, 2, 3], 'Taiga and Pacific Maritime are not on the list: Boreal, Subalpine, Montane, Coast, Columbian, Deciduous, GLSL, Acadian, Grasslands, Tundra.'),
    ],
  },
  {
    section: REGIONS, q: 'Name the forest regions of Ontario. Which one is Pembroke in?',
    a: [
      'Boreal: about 50% of Ontario, the largest in Ontario and Canada. Split on the map into Boreal – Forest and Barren (far north) and Boreal – Predominantly Forest.',
      'Great Lakes–St. Lawrence (GLSL): about 20%, the second largest. Pembroke and Renfrew County are here.',
      'Deciduous (Carolinian): about 3%, the southernmost.',
      'Most of Ontario’s population lives in the GLSL and Deciduous regions.',
    ],
    test: [
      mc('Which forest region is Pembroke in?', ['Boreal – Predominantly Forest', 'Great Lakes–St. Lawrence', 'Deciduous (Carolinian)', 'Boreal – Forest and Barren'], 1, 'Pembroke and Renfrew County are in the GLSL region.'),
      order('Put Ontario’s forest regions in order of area, largest first.', ['Boreal', 'Great Lakes–St. Lawrence', 'Deciduous (Carolinian)'], 'About 50%, 20% and 3%.'),
      mc('On the Ontario map, the Boreal region is split into…', ['Forest and Barren, and Predominantly Forest', 'Northern and Southern Boreal', 'Coniferous and Mixedwood', 'Upland and Lowland'], 0, 'Boreal – Forest and Barren (far north) and Boreal – Predominantly Forest.'),
      tf('Most of Ontario’s population lives in the GLSL and Deciduous regions.', true, 'The Boreal is the largest region but has few people.'),
    ],
  },
  {
    section: REGIONS, q: 'Describe Ontario’s Boreal forest region and its dominant species.',
    a: [
      'Coniferous (softwood) and mixedwood forests dominate; heavily influenced by natural disturbances.',
      'Conifers: Bf (balsam fir), La (larch), Pj (jack pine), Sb (black spruce), Sw (white spruce).',
      'Hardwoods: Bw (white birch), Pb (balsam poplar), Pt (trembling aspen), willow.',
      'Wildlife: black bears, wolves, lynx, moose, caribou, great grey owl, pine marten.',
    ],
    test: [
      multi('Select the dominant Boreal species.', ['Jack pine (Pj)', 'Black spruce (Sb)', 'Balsam fir (Bf)', 'Sugar maple (Mh)', 'Red oak (Or)', 'Trembling aspen (Pt)'], [0, 1, 2, 5], 'Boreal conifers: Bf, La, Pj, Sb, Sw. Hardwoods: Bw, Pb, Pt, willow.'),
      tf('Boreal forests are heavily influenced by natural disturbances.', true, 'Conifer and mixedwood forests shaped by fire, insects and wind.'),
    ],
  },
  {
    section: REGIONS, q: 'Describe Ontario’s Great Lakes–St. Lawrence forest region and its dominant species.',
    a: [
      'Conifers: Pw (white pine), Pr (red pine), He (hemlock), white cedar, Sw (white spruce).',
      'Hardwoods: Mh (sugar maple), By (yellow birch), Be (beech), Mr (red maple), Bd (basswood), Or (red oak).',
      'Wildlife: black bear, wolves, white-tailed deer, moose, beaver, muskrat, otters, migratory birds.',
    ],
    test: [
      multi('Select the dominant GLSL hardwoods.', ['Sugar maple (Mh)', 'Yellow birch (By)', 'Beech (Be)', 'Balsam poplar (Pb)', 'Red oak (Or)', 'Basswood (Bd)'], [0, 1, 2, 4, 5], 'GLSL hardwoods: Mh, By, Be, Mr, Bd, Or. Balsam poplar is Boreal.'),
      mc('Which conifer is a dominant GLSL species?', ['Jack pine', 'Hemlock', 'Black spruce', 'Larch'], 1, 'GLSL conifers: Pw, Pr, He, white cedar, Sw.'),
    ],
  },
  {
    section: REGIONS, q: 'Describe Ontario’s Deciduous (Carolinian) forest region.',
    a: [
      'The southernmost region: mostly agriculture and urban areas, with scattered woodlots left on sites too poor to farm.',
      'The greatest diversity of tree species, but the lowest proportion of forest.',
      'Much the same hardwoods as the GLSL, plus Bn (butternut), Wb (black walnut), Ow (white oak) and hickory.',
      'Rare species such as the southern flying squirrel, red-bellied woodpecker and Massasauga rattlesnake.',
    ],
    test: [
      mc('Which region has the most tree species but the least forest?', ['Boreal', 'GLSL', 'Deciduous (Carolinian)'], 2, 'It is mostly cleared for farms and cities.'),
      multi('Which species are found in the Deciduous region but not the dominant GLSL list?', ['Butternut (Bn)', 'Black walnut (Wb)', 'White oak (Ow)', 'Hickory', 'Black spruce (Sb)'], [0, 1, 2, 3], 'Bn, Wb, Ow and hickory.'),
    ],
  },

  // ---- Shade tolerance & silviculture ----
  {
    section: SHADE, q: 'Define shade tolerance. Why does it matter?',
    a: [
      'The capacity of a tree to develop and grow in the shade of, and in competition with, other trees.',
      'Shade tolerance determines the choice of silvicultural system.',
    ],
    test: [
      mc('Shade tolerance determines…', ['A tree’s height', 'The choice of silvicultural system', 'The forest region', 'Seed viability'], 1, 'Tolerance → selection, shelterwood or clearcut.'),
      mc('Shade tolerance is the capacity of a tree to…', ['Develop and grow in the shade of, and in competition with, other trees', 'Survive a fire', 'Grow only in full sunlight', 'Keep its leaves over winter'], 0, 'Develop and grow in the shade of, and in competition with, other trees.'),
    ],
  },
  {
    section: SHADE, q: 'What are the shade tolerance classes, and how much sun does each need?',
    a: SHADE_TABLE.map((r) => `${r.level}: ${r.sun}`),
    test: [
      order('Put the shade tolerance classes in order, needing the MOST sun first.', ['Very intolerant', 'Intolerant', 'Intermediate', 'Tolerant', 'Very tolerant'], '60–100%, 30–60%, 10–30%, 3–10%, 1–3% sun.'),
      mc('Very tolerant trees need about…', ['60–100% sun', '30–60% sun', '10–30% sun', '1–3% sun'], 3, '1–3% of full sunlight.'),
    ],
  },
  { section: SHADE, q: 'Name the shade-intolerant species (intolerant and very intolerant).', a: speciesIn('Very intolerant', 'Intolerant'), test: [
      multi('Select the shade-INTOLERANT species.', ['Jack pine', 'Trembling aspen', 'White birch', 'Sugar maple', 'Red pine', 'Hemlock'], [0, 1, 2, 4], 'Sugar maple and hemlock are very tolerant.'),
      mc('Tamarack (larch) is…', ['Very intolerant', 'Intermediate', 'Tolerant', 'Very tolerant'], 0, 'Very intolerant (60–100% sun).'),
    ] },
  { section: SHADE, q: 'Name the intermediate (mid-tolerant) species.', a: speciesIn('Intermediate'), test: [
      multi('Select the INTERMEDIATE species.', ['Red oak', 'White pine', 'Yellow birch', 'Beech', 'Jack pine', 'Basswood'], [0, 1, 2, 5], 'Beech is very tolerant; jack pine very intolerant.'),
    ] },
  { section: SHADE, q: 'Name the shade-tolerant species (tolerant and very tolerant).', a: speciesIn('Tolerant', 'Very tolerant'), test: [
      multi('Select the shade-TOLERANT species.', ['Sugar maple', 'Beech', 'Hemlock', 'Balsam fir', 'Tamarack', 'Red maple'], [0, 1, 2, 3, 5], 'Tamarack is very intolerant.'),
      tf('In the lecture table, black spruce is shade tolerant.', true, 'Tolerant (3–10% sun), with white cedar, red maple, red and white spruce.'),
    ] },
  {
    section: SHADE, q: 'What are the 3 silvicultural systems, and which shade tolerance goes with each?',
    a: ['Clearcut: intolerant and very intolerant species.', 'Shelterwood: intermediate species.', 'Selection: tolerant and very tolerant species.'],
    test: [
      mc('Which silvicultural system suits INTOLERANT species?', ['Selection', 'Shelterwood', 'Clearcut', 'Group selection'], 2, 'Intolerant → clearcut.'),
      mc('Which system suits INTERMEDIATE species?', ['Selection', 'Shelterwood', 'Clearcut', 'No harvest'], 1, 'Intermediate → shelterwood.'),
      mc('Which system suits TOLERANT species?', ['Selection', 'Shelterwood', 'Clearcut', 'Seed tree'], 0, 'Tolerant → selection.'),
    ],
  },
  {
    section: SHADE, q: 'Describe the clearcut system (CC).',
    a: [
      'Most of the overstory is removed over a short period, creating a fully exposed site for a new even-aged stand.',
      'Regeneration establishes in more than 70% sunlight.',
      'All merchantable trees removed as per the CFSA; highly mechanized.',
      'Modified clearcut / clearcut with conditions: e.g. seed trees left for extra seed or site protection (shallow soils).',
      'Renewal: natural for poplar and birch; planted for red pine, jack pine and spruce.',
    ],
    test: [
      mc('In a clearcut, regeneration establishes in…', ['> 70% sunlight', '30–70% sunlight', 'About 30% sunlight', '1–3% sunlight'], 0, 'More than 70% sunlight.'),
      tf('After a clearcut, red pine, jack pine and spruce are usually renewed by planting.', true, 'Poplar and birch renew naturally.'),
    ],
  },
  {
    section: SHADE, q: 'Describe the shelterwood system (SH).',
    a: [
      'Most of the overstory is removed in a series of 2 or more harvests, to establish and shelter regeneration under the remaining canopy.',
      'Even-aged. Regeneration establishes in 30–70% sunlight (leave 40–60% crown closure).',
      'For mid-tolerant species such as white pine and red oak. Red oak (OrUS) only needs 1 final removal cut.',
      'Cuts: preparatory cut (around age 80) → regeneration cut (around 100) → first removal cut → final removal cut (around 120).',
      'Regeneration needs help (lots of prep), so it is the most costly system.',
      'Must be tree marked (except final removals); protect regeneration in the first and final removals.',
    ],
    test: [
      mc('In the shelterwood system, regeneration establishes in…', ['> 70% sunlight', '30–70% sunlight', 'About 30% sunlight', 'Full shade'], 1, '30–70% sunlight, leaving 40–60% crown closure.'),
      mc('A red oak shelterwood (OrUS) needs how many removal cuts?', ['1 final removal', '2', '3', 'None'], 0, 'OrUS only requires 1 (final) removal cut.'),
      order('Put the shelterwood cuts in order.', ['Preparatory cut', 'Regeneration cut', 'First removal cut', 'Final removal cut'], 'Prep (~80 years) → regeneration (~100) → first removal → final removal (~120).'),
      mc('Which silvicultural system costs the most?', ['Clearcut', 'Shelterwood', 'Selection', 'They all cost the same'], 1, 'Shelterwood: regeneration needs help and a lot of prep.'),
    ],
  },
  {
    section: SHADE, q: 'Describe the selection system (SEL).',
    a: [
      'Periodic partial harvests, choosing trees to cut and keep by vigour, risk and species preference (timed by basal area).',
      'Uneven-aged. Regeneration establishes under at least 70% crown closure (about 30% sunlight). Mature forest cover is kept forever.',
      'For tolerant hardwoods (maples, beech, ash, yellow birch) and hemlock. Must be marked by a certified tree marker.',
      'Group openings (less than 2 tree heights across) are used for red oak, yellow birch, cedar and black cherry.',
    ],
    test: [
      mc('The selection system keeps…', ['An even-aged stand', 'An uneven-aged stand with mature cover forever', 'A clearcut', 'A plantation'], 1, 'Uneven-aged, mature forest cover maintained in perpetuity.'),
      typed('Group openings in the selection system are less than how many tree heights across?', ['2'], 'Less than 2 tree heights, used for Or, By, cedar and black cherry.'),
    ],
  },
  {
    section: SHADE, q: 'What is the difference between even-aged and uneven-aged stands?',
    a: [
      'Uneven-aged: three or more age classes, often a diversity of species. E.g. a tolerant hardwood stand (sugar maple, beech, yellow birch).',
      'Even-aged: small age differences between trees, often one species. E.g. an intolerant poplar, jack pine or black spruce stand.',
    ],
    test: [
      typed('An uneven-aged stand has at least how many age classes?', ['3'], 'Three or more age classes.'),
      mc('Which is an example of an even-aged stand?', ['A tolerant hardwood stand', 'A jack pine stand', 'A sugar maple / beech stand', 'A hemlock selection stand'], 1, 'Even-aged: intolerant poplar, jack pine or black spruce stands.'),
    ],
  },
  {
    section: SHADE, q: 'Define release, elastic and gap phase.',
    a: [
      'Release (response to release): a tree’s ability to respond to a sudden change from shade to full or high sunlight, e.g. when a tree falls and opens a gap.',
      'Elastic: a tree that responds well to release (e.g. maples). Black cherry shows little response.',
      'Gap phase: species that establish under the canopy and wait, shade-tolerant enough to survive, until a local disturbance opens a gap they can grow into.',
    ],
    test: [
      mc('A tree that responds well to release is called…', ['Serotinous', 'Elastic', 'Dioecious', 'Climax'], 1, 'Elastic, e.g. maples.'),
      tf('Black cherry responds very well to sudden release.', false, 'Black cherry shows little response; maples respond very well.'),
    ],
  },
  {
    section: SHADE, q: 'What are the age / size phases of a tree?',
    a: [
      '1. Seedling or germinant: less than 1 m high.',
      '2. Regeneration: less than 3 cm DBH and/or less than 2 m high.',
      '3. Juvenile: doesn’t flower; leaves may look different from the adult’s; weaker wood. Includes sapling (< 5 m high) and polewood (< 10 cm DBH).',
      '4. Adult: boltwood (< 25 cm DBH) and mature (> 25 cm DBH).',
      '5. Old / over mature: flat-topped crown, internal rot, crown breaking up, deeply furrowed bark.',
    ],
    test: [
      order('Put the age / size phases in order, youngest first.', ['Seedling / germinant', 'Regeneration', 'Sapling', 'Polewood', 'Boltwood', 'Mature', 'Old / over mature'], 'Seedling < 1 m; regeneration < 3 cm DBH; sapling < 5 m; polewood < 10 cm; boltwood < 25 cm; mature > 25 cm.'),
      mc('A sapling is less than…', ['1 m high', '2 m high', '5 m high', '10 cm DBH'], 2, 'Less than 5 m high.'),
      typed('Mature trees are greater than how many cm DBH?', ['25'], 'Boltwood < 25 cm DBH; mature > 25 cm.'),
    ],
  },
  {
    section: SHADE, extra: true, q: 'Why is it hard to guess a shade-tolerant tree’s age from its size?',
    a: ['Tolerant trees can live for many years suppressed in the shade, growing slowly, so a small tree can be old.'],
    test: [
      tf('A small shade-tolerant tree can be very old.', true, 'Tolerant trees can live for years suppressed, growing slowly.'),
    ],
  },

  // ---- Tree physiology ----
  {
    section: PHYS, q: 'Define angiosperm and gymnosperm.',
    a: [
      'Angiosperm: seeds enclosed (in a fruit). Also called deciduous, hardwoods or broad-leaved trees.',
      'Gymnosperm: naked seeds (on cone scales). Also called conifers, softwoods or evergreens.',
      'Exception: ginkgo has broad, deciduous leaves but is a gymnosperm (its ovules are naked on stalks).',
      'All conifers except larch keep their green needles over winter.',
    ],
    test: [
      mc('Gymnosperms have…', ['Enclosed seeds', 'Naked seeds', 'No seeds', 'Perfect flowers'], 1, 'Gymno = naked; angio = enclosed.'),
      tf('Ginkgo is an angiosperm because its leaves are broad.', false, 'Ginkgo is a gymnosperm: its ovules are naked on stalks.'),
      mc('Which conifer loses its needles in winter?', ['Balsam fir', 'Larch', 'White pine', 'Hemlock'], 1, 'All conifers except larch keep their needles over winter.'),
    ],
  },
  {
    section: PHYS, q: 'What are the main parts of a tree?',
    a: ['Roots: root hair zone, radicle, lateral roots, taproot.', 'Bole / trunk.', 'Crown: branches (limbs), top and foliage.'],
    test: [
      multi('Which are parts of the crown?', ['Branches (limbs)', 'Foliage', 'Top', 'Taproot', 'Bole'], [0, 1, 2], 'The taproot is a root; the bole is the trunk.'),
      mc('The radicle is part of the…', ['Crown', 'Bole', 'Roots', 'Bark'], 2, 'Roots: root hair zone, radicle, lateral roots, taproot.'),
    ],
  },
  {
    section: PHYS, q: 'Define xylem, phloem and cambium.',
    a: [
      'Xylem: carries water and dissolved minerals FROM the roots TO the leaves/needles, and gives physical support. The wood (sapwood and heartwood).',
      'Phloem: carries food (sugars) FROM the leaves/needles TO the roots and the places where new wood is being made. Part of the inner bark.',
      'Vascular cambium: the layer between them that makes new xylem toward the inside and new phloem toward the outside, adding a new ring each year.',
    ],
    test: [
      mc('Xylem carries…', ['Sugars from the leaves to the roots', 'Water and minerals from the roots to the leaves', 'Only air', 'Seeds'], 1, 'Xylem: water up. Phloem: food from the leaves to the roots and growing areas.'),
      mc('Phloem carries…', ['Water up from the roots', 'Food from the leaves to the roots and growing areas', 'Nothing; it is dead', 'Pollen'], 1, 'Phloem is part of the inner bark.'),
      mc('Which layer makes new xylem and phloem?', ['Pith', 'Heartwood', 'Vascular cambium', 'Outer bark'], 2, 'The vascular cambium: xylem inward, phloem outward.'),
    ],
  },
  {
    section: PHYS, q: 'What are the layers in a cross-section of a trunk, from outside in?',
    a: [
      'Outer bark: dead tissue; the first line of defence (limits water loss, deters insects and fungi, protects from fire).',
      'Inner bark: the second line of defence, with the cork cambium and the active (secondary) phloem.',
      'Vascular cambium: makes xylem inward and phloem outward.',
      'Sapwood: outer rings; moves water from roots to leaves and stores food.',
      'Heartwood: older, darker central rings; no longer stores or moves anything.',
      'Pith: the very centre of the stem. Rays run from the centre outward and store and move nutrients sideways.',
    ],
    test: [
      order('Put the trunk layers in order, from the outside in.', ['Outer bark', 'Inner bark (phloem)', 'Vascular cambium', 'Sapwood', 'Heartwood', 'Pith'], 'The cambium sits between the phloem and the sapwood.'),
      tf('The outer bark is living tissue.', false, 'The outer bark is dead tissue: the first line of defence.'),
      mc('Which layer moves water from roots to leaves and stores food?', ['Heartwood', 'Sapwood', 'Pith', 'Outer bark'], 1, 'Sapwood. Heartwood no longer stores or moves anything.'),
    ],
  },
  {
    section: PHYS, q: 'How do growth rings form?',
    a: [
      'Trees go dormant in winter and stop growing. In spring, growth starts again, which makes a visible colour change.',
      'Earlywood: grown quickly in spring; light coloured, low density.',
      'Latewood: grown in summer; dense, dark, thick-walled cells.',
      'One earlywood + latewood band = one growth ring = one year.',
    ],
    test: [
      mc('Latewood is…', ['Light and low density', 'Dense, dark and thick-walled', 'Formed in early spring', 'The pith'], 1, 'Earlywood (spring) is light; latewood (summer) is dense and dark.'),
      tf('A tree forms one growth ring per year.', true, 'One earlywood + latewood band = one year.'),
    ],
  },
  {
    section: PHYS, q: 'What events can be dated from growth rings?',
    a: [
      'Wounds: fire scars, natural catastrophes (avalanches, flooding, landslides), mechanical damage.',
      'Changes in growth rate: release from cutting or blowdowns, release from drought, insect defoliation.',
      'Reaction wood: avalanches, landslides, windthrow.',
      'Abnormal rings: drought, frost, false rings, missing rings.',
    ],
    test: [
      mc('Fire scars and mechanical damage show up in the rings as…', ['Wounds', 'A change in growth rate', 'Reaction wood', 'False rings'], 0, 'Wounds: fire scars, natural catastrophes, mechanical damage.'),
      mc('Release after cutting or a blowdown shows up in the rings as…', ['A wound', 'A change in growth rate', 'A missing ring', 'A double pith'], 1, 'Changes in growth rate: release from cutting, blowdowns or drought, and insect defoliation.'),
      multi('Which are abnormal (aberrant) rings?', ['Frost rings', 'False rings', 'Missing rings', 'Fire scars'], [0, 1, 2], 'Abnormal rings: drought, frost, false and missing. Fire scars are wounds.'),
    ],
  },
  {
    section: PHYS, q: 'What problems can come up when aging a tree from its rings (dendrochronology)?',
    a: ['1. A double pith', '2. Hitting branch stubs', '3. Extensive scarring', '4. Centre rot', 'Also false and missing rings, which make the count wrong.'],
    test: [
      multi('Which are problems when aging a tree from its rings?', ['A double pith', 'Hitting branch stubs', 'Extensive scarring', 'Centre rot', 'Wide rings after release'], [0, 1, 2, 3], 'Double pith, branch stubs, scarring and centre rot (plus false and missing rings). Wide rings can still be counted.'),
    ],
  },
  {
    section: PHYS, q: 'What is reaction wood?',
    a: [
      'Wood a tree forms to support itself after it is pushed or leaning (e.g. after something falls on it, or wind).',
      'Conifers: compression wood, on the leeward side (memory aid: C–C).',
      'Hardwoods (broadleaf): tension (reaction) wood, on the windward side (memory aid: B–R).',
    ],
    test: [
      mc('Reaction wood in hardwoods is called…', ['Tension wood', 'Compression wood', 'Heartwood', 'Latewood'], 0, 'Tension wood in hardwoods; compression wood in conifers.'),
      mc('Reaction wood in conifers is called…', ['Tension wood', 'Compression wood', 'Sapwood', 'Earlywood'], 1, 'Compression wood.'),
      mc('On which side of a leaning conifer does compression wood form?', ['Leeward', 'Windward', 'Both sides equally', 'In the pith'], 0, 'Conifers: compression wood on the leeward side. Hardwoods: tension wood on the windward side.'),
    ],
  },
  {
    section: PHYS, q: 'Where and how do buds form on a branch?',
    a: [
      'Terminal bud: at the end of the twig. Usually contains vegetative structures (leaves, branch growth).',
      'Sub-terminal buds: just behind the terminal bud.',
      'Lateral buds: off the side of the stem or branch. They may develop into latent vegetative buds or reproductive buds (flowers, cones).',
      'Buds near the base of the shoot most often become pollen cones; those nearer the terminal become seed cones.',
      'Latent buds generally develop into new shoots, stimulated by removal of the terminal bud.',
      'Buds may also abort, which is common near the base of the shoot.',
    ],
    test: [
      mc('A bud at the end of a twig is a…', ['Lateral bud', 'Terminal bud', 'Latent bud', 'Sub-terminal bud'], 1, 'Terminal = end; sub-terminal = just behind it; lateral = off the side.'),
      mc('Terminal buds usually contain…', ['Vegetative structures', 'Pollen cones', 'Seed cones only', 'Nothing; they abort'], 0, 'Terminal buds are usually vegetative; lateral buds can be latent or reproductive.'),
      mc('Buds near the BASE of the shoot most often become…', ['Seed cones', 'Pollen cones', 'Terminal buds', 'Roots'], 1, 'Pollen cones near the base; seed cones nearer the terminal.'),
      mc('Latent buds are stimulated to grow into new shoots by…', ['Removal of the terminal bud', 'Fire', 'Pollination', 'Cold winters'], 0, 'Removing the terminal bud wakes up latent buds.'),
    ],
  },
  {
    section: PHYS, extra: true, q: 'What is transpiration?',
    a: ['Water moves from the roots up through the tree to small pores under the leaves, where it evaporates into the air.', 'Trees and plants release about 10% of the moisture in the atmosphere.'],
    test: [
      mc('About how much of the moisture in the atmosphere comes from transpiration?', ['1%', '10%', '50%', '90%'], 1, 'About 10%.'),
    ],
  },

  // ---- Reproduction ----
  {
    section: REPRO, q: 'Define pollination, seed stratification, germination and viability.',
    a: [
      'Pollination: the transfer of pollen, resulting in fertilization.',
      'Seed stratification: storing seeds under set conditions (temperature, moisture, gas exchange, medium…) for a set time to overcome dormancy so they can germinate.',
      'Germination: the plant embryo resumes growth after seed dispersal. Depends on temperature, soil moisture and oxygen.',
      'Viability: the capacity of a seed to germinate.',
    ],
    test: [
      mc('Viability is…', ['The transfer of pollen', 'The capacity of a seed to germinate', 'Storing seeds to overcome dormancy', 'Seed spread by wind'], 1, 'Viability = capacity to germinate.'),
      mc('Seed stratification is…', ['Spreading seeds by wind', 'Storing seeds under set conditions to overcome dormancy', 'The capacity of a seed to germinate', 'Transfer of pollen'], 1, 'Set temperature, moisture, gas exchange and medium for a set time.'),
      multi('Germination depends on…', ['Temperature', 'Soil moisture', 'Oxygen levels', 'Tree height'], [0, 1, 2], 'Temperature, soil moisture and oxygen levels.'),
      mc('Pollination is…', ['The transfer of pollen, resulting in fertilization', 'The capacity of a seed to germinate', 'The embryo resuming growth', 'Seed spread by animals'], 0, 'The transfer of pollen, resulting in fertilization.'),
    ],
  },
  {
    section: REPRO, q: 'How is pollen moved between trees?',
    a: ['Wind: carries pollen to another tree.', 'Insects and birds: flowers often have nectaries (sugary nectar) and strong, sweet odours to attract them.'],
    test: [
      multi('How is pollen moved between trees?', ['Wind', 'Insects', 'Birds', 'Gravity'], [0, 1, 2], 'Wind, insects and birds. Gravity is a seed dispersal method.'),
      tf('Nectaries make a sugary liquid that attracts insects and birds.', true, 'Nectar, plus strong sweet odours.'),
    ],
  },
  {
    section: REPRO, q: 'How are seeds dispersed?',
    a: [
      'Wind: winged seeds (maples, ash, pine) are carried further.',
      'Gravity.',
      'Streams and snowmelt.',
      'Birds and animals: eat nuts or fleshy fruit and spread the seeds through digestion (e.g. red oak), or seeds stick to fur and drop off.',
    ],
    test: [
      mc('Maple, ash and pine seeds have broad wings so they are dispersed by…', ['Wind', 'Gravity', 'Animals', 'Snowmelt'], 0, 'The wings let the wind carry them further.'),
      tf('Some seeds are dispersed by sticking to animal fur and dropping off later.', true, 'Animals also spread seeds by eating nuts or fleshy fruit.'),
      mc('Red oak acorns are mainly dispersed by…', ['Wind', 'Animals and birds', 'Snowmelt', 'Fire'], 1, 'Animals eat and move the nuts.'),
    ],
  },
  {
    section: REPRO, q: 'What factors influence flowering / cone production?',
    a: ['Age (not too young or too old)', 'Plant hormones', 'Lack of nutrients: nitrogen (photosynthesis) and potassium (growth)', 'Temperature', 'Soil moisture', 'Light quality and intensity: as close to full sunlight as possible (canopy placement)'],
    test: [
      mc('In flowering, nitrogen is important for ___ and potassium for ___.', ['Growth; photosynthesis', 'Photosynthesis; growth', 'Roots; bark', 'Seeds; leaves'], 1, 'Nitrogen (photosynthesis), potassium (growth).'),
      mc('For the best flowering, a tree’s crown should be…', ['As close to full sunlight as possible', 'In deep shade', 'Under the canopy', 'Light doesn’t matter'], 0, 'Light quality and intensity: as close to full sunlight as possible (canopy placement).'),
      tf('The youngest trees flower best.', false, 'Age matters: not too young or too old. Young trees may flower, but the seed won’t be viable.'),
    ],
  },
  {
    section: REPRO, q: 'Define dioecious and monoecious, with examples.',
    a: [
      'Dioecious: male and female organs on SEPARATE trees. E.g. poplars, ash, willows.',
      'Monoecious: male and female organs on the SAME tree, either:',
      'Separately on the same tree (female at the top, male at the bottom): spruces, pines, beech, red oak.',
      'Together in the same flower (a perfect flower): elm, basswood, black cherry.',
    ],
    test: [
      typed('Male and female organs on SEPARATE trees is called…', ['dioecious'], 'Dioecious: poplars, ash, willows.'),
      mc('Which tree is dioecious?', ['Red oak', 'Basswood', 'Poplar', 'White pine'], 2, 'Poplars, ash and willows.'),
      mc('Elm, basswood and black cherry have…', ['Separate male and female trees', 'Perfect flowers', 'Serotinous cones', 'No flowers'], 1, 'Monoecious, with both organs in the same (perfect) flower.'),
    ],
  },
  {
    section: REPRO, q: 'Where are male and female cones on a conifer, and why?',
    a: [
      'Male (pollen) cones: lower in the crown.',
      'Female (ovulate / seed) cones: higher up in the crown.',
      'Why: the top is closer to full sunlight, giving energy for flowers and seeds, and it helps prevent inbreeding (self-pollination).',
    ],
    test: [
      mc('Female (seed) cones are usually found…', ['Low in the crown', 'High in the crown', 'On the roots', 'Only on dead branches'], 1, 'Higher up; male pollen cones are lower.'),
      tf('Female cones sit high in the crown partly to help prevent inbreeding.', true, 'Also: the top is closer to full sunlight, giving energy for flowers and seeds.'),
    ],
  },
  {
    section: REPRO, q: 'Which parts of a conifer cone help determine how its seed is dispersed?',
    a: ['The scale, the seed and the seed wing: together they determine the vector of dispersal (e.g. a winged seed travels on the wind).'],
    test: [
      multi('Which cone parts help determine the vector of dispersal?', ['Scale', 'Seed', 'Seed wing', 'Peduncle'], [0, 1, 2], 'The scale, seed and seed wing.'),
    ],
  },
  {
    section: REPRO, q: 'How do young and mature cones differ?',
    a: ['Conelet (immature cone): small and upright.', 'Mature cone: drooping (hangs down).'],
    test: [
      mc('A conelet (immature cone) is…', ['Small and upright', 'Large and drooping', 'Woody and open', 'On the roots'], 0, 'Conelets are small and upright; mature cones droop.'),
    ],
  },
  {
    section: REPRO, q: 'What are serotinous cones?',
    a: ['Cones that only open to release seed when exposed to intense heat (fire) of 50 °C or more.', 'E.g. jack pine; black spruce cones are semi-serotinous.'],
    test: [
      typed('Serotinous cones open at temperatures of at least how many °C?', ['50'], '≥ 50 °C, from fire.'),
      mc('Which species has serotinous cones?', ['Jack pine', 'White pine', 'Hemlock', 'Balsam fir'], 0, 'Jack pine (black spruce is semi-serotinous).'),
    ],
  },
  {
    section: REPRO, q: 'What are the other (vegetative) forms of reproduction, and which species use them?',
    a: [
      'Layering: an undetached branch on or in the soil roots and grows into a new tree. E.g. cedar, black spruce.',
      'Stem sprouts: regeneration from the stem.',
      'Stump sprouts (coppice growth): regeneration from the stump. E.g. red oak, basswood, red maple.',
      'Root sprouts (suckering): regeneration from the roots. E.g. poplar, white elm.',
    ],
    test: [
      mc('Root suckering is typical of…', ['Poplar and white elm', 'Cedar and black spruce', 'Red pine', 'Balsam fir'], 0, 'Root sprouts: poplar, white elm.'),
      mc('Layering is typical of…', ['Red oak', 'Cedar and black spruce', 'Poplar', 'Basswood'], 1, 'A branch on the ground roots: cedar, black spruce.'),
      mc('Stump sprouting (coppice growth) is typical of…', ['Jack pine', 'Red oak, basswood and red maple', 'White spruce', 'Tamarack'], 1, 'Red oak, basswood, red maple.'),
    ],
  },
  {
    section: REPRO, extra: true, q: 'What are the parts of a flower?',
    a: [
      'Pistil (female) in the centre, surrounded by stamens (male; the anthers make pollen), then petals (the corolla) and sepals (the calyx).',
      'A complete flower has all four; a perfect flower has both pistils and stamens.',
    ],
    test: [
      mc('The female part of a flower is the…', ['Stamen', 'Pistil', 'Anther', 'Sepal'], 1, 'Pistil (female); stamens with anthers (male).'),
      mc('A flower with both pistils and stamens is…', ['Perfect', 'Dioecious', 'Serotinous', 'Incomplete'], 0, 'Perfect (bisexual).'),
    ],
  },
  {
    section: REPRO, q: 'What is a peduncle?',
    a: ['The stalk that holds a flower or a cluster of flowers (and later the fruit or cone) on the branch.'],
    check: 'On the midterm topic list, but not defined in the lecture slides. This is the standard botany definition.',
    test: [
      mc('A peduncle is…', ['The stalk that holds a flower or flower cluster', 'The female part of a flower', 'A seed wing', 'A bud at the end of a twig'], 0, 'The stalk of a flower or flower cluster.'),
    ],
  },

  // ---- Succession ----
  {
    section: SUCC, q: 'What is forest succession?',
    a: ['The dynamic changes in the forest by which one community succeeds (replaces) another through time.'],
    test: [
      mc('Forest succession is…', ['One community replacing another through time', 'Harvesting in rows', 'Seed dispersal by wind', 'Ring formation'], 0, 'The dynamic changes by which one community succeeds another.'),
    ],
  },
  {
    section: SUCC, q: 'What is the difference between primary and secondary succession?',
    a: [
      'Primary: the disturbance removes the soil and organisms, leaving bare rock, gravel, silt or sand. E.g. volcano, landslide, glaciers, flooding.',
      'Secondary: the disturbance leaves the soil intact, and usually seeds, spores and roots too. E.g. fire, wind, insects, disease, humans (harvesting, abandoned farm fields).',
    ],
    test: [
      mc('Which starts PRIMARY succession?', ['Forest fire', 'Abandoned farm field', 'Glacier', 'Harvest'], 2, 'Primary = soil removed (glacier, volcano, landslide, flooding).'),
      tf('In secondary succession the soil is left intact.', true, 'Seeds, spores and roots usually remain too.'),
    ],
  },
  {
    section: SUCC, q: 'What are the 3 stages of succession, with example species?',
    a: [
      'Pioneer: seed into open areas after major disturbances. E.g. poplar, white birch, larch; fire-dependent jack pine and black spruce.',
      'Intermediate (gap phase): establish under the canopy and wait for a gap. E.g. ash, oak, red maple, yellow birch, basswood, white spruce, white pine.',
      'Climax: establish in the shaded understory and persist, filling the canopy as old trees die. E.g. sugar maple, beech, hemlock, ironwood (GLSL); black spruce and balsam fir (Boreal).',
    ],
    test: [
      order('Put the stages of succession in order.', ['Pioneer', 'Intermediate (gap phase)', 'Climax'], 'Pioneer → intermediate → climax.'),
      mc('Which is a pioneer species?', ['Sugar maple', 'Hemlock', 'White birch', 'Ironwood'], 2, 'Poplar, white birch, larch, jack pine, black spruce.'),
      mc('Which is a GLSL climax species?', ['Trembling aspen', 'Beech', 'Jack pine', 'Larch'], 1, 'Sugar maple, beech, hemlock, ironwood.'),
      multi('Which are Boreal climax species?', ['Black spruce', 'Balsam fir', 'Trembling aspen', 'Jack pine'], [0, 1], 'Black spruce and balsam fir.'),
    ],
  },
  {
    section: SUCC, extra: true, q: 'How does harvesting fit into the succession cycle?',
    a: ['1. Harvest', '2. Competition control and establishment of regeneration', '3. Stand thinning / tending', '4. Harvest again'],
    test: [
      order('Put the harvest cycle in order.', ['Harvest', 'Competition control and regeneration', 'Stand thinning / tending', 'Harvest again'], 'Harvest → regen → tending → harvest.'),
    ],
  },
];

const SORTS: SortDrill[] = [
  {
    id: 'shade', title: 'Shade tolerance', prompt: 'Intolerant, intermediate or tolerant? (Very intolerant counts as intolerant; very tolerant as tolerant.)',
    bins: ['Intolerant', 'Intermediate', 'Tolerant'],
    items: SHADE_TABLE.flatMap((r) => r.species.slice(0, 3).map((sp) => ({ label: sp, bin: tolerance3(r.level) }))),
  },
  {
    id: 'system', title: 'Which silvicultural system?', prompt: 'Pick the system for a stand dominated by each species.',
    bins: ['Clearcut', 'Shelterwood', 'Selection'],
    items: [
      { label: 'Jack pine', bin: 'Clearcut' }, { label: 'Trembling aspen', bin: 'Clearcut' }, { label: 'Red pine', bin: 'Clearcut' },
      { label: 'White pine', bin: 'Shelterwood' }, { label: 'Red oak', bin: 'Shelterwood' },
      { label: 'Sugar maple', bin: 'Selection' }, { label: 'Beech', bin: 'Selection' }, { label: 'Hemlock', bin: 'Selection' },
    ],
  },
  {
    id: 'sex', title: 'Dioecious or monoecious?', prompt: 'Where are the male and female organs?',
    bins: ['Dioecious', 'Monoecious (separate)', 'Perfect flower'],
    items: [
      { label: 'Poplar', bin: 'Dioecious' }, { label: 'Ash', bin: 'Dioecious' }, { label: 'Willow', bin: 'Dioecious' },
      { label: 'Spruce', bin: 'Monoecious (separate)' }, { label: 'Pine', bin: 'Monoecious (separate)' }, { label: 'Red oak', bin: 'Monoecious (separate)' },
      { label: 'Elm', bin: 'Perfect flower' }, { label: 'Basswood', bin: 'Perfect flower' }, { label: 'Black cherry', bin: 'Perfect flower' },
    ],
  },
  {
    id: 'vegetative', title: 'Vegetative reproduction', prompt: 'How does each species reproduce without seed?',
    bins: ['Layering', 'Stump sprouts', 'Root suckers'],
    items: [
      { label: 'Cedar', bin: 'Layering' }, { label: 'Black spruce', bin: 'Layering' },
      { label: 'Red oak', bin: 'Stump sprouts' }, { label: 'Basswood', bin: 'Stump sprouts' }, { label: 'Red maple', bin: 'Stump sprouts' },
      { label: 'Poplar', bin: 'Root suckers' }, { label: 'White elm', bin: 'Root suckers' },
    ],
  },
  {
    id: 'stage', title: 'Succession stage', prompt: 'Pioneer, intermediate or climax (GLSL)?',
    bins: ['Pioneer', 'Intermediate', 'Climax'],
    items: [
      { label: 'Poplar', bin: 'Pioneer' }, { label: 'White birch', bin: 'Pioneer' }, { label: 'Larch', bin: 'Pioneer' }, { label: 'Jack pine', bin: 'Pioneer' },
      { label: 'Yellow birch', bin: 'Intermediate' }, { label: 'White pine', bin: 'Intermediate' }, { label: 'Basswood', bin: 'Intermediate' },
      { label: 'Sugar maple', bin: 'Climax' }, { label: 'Beech', bin: 'Climax' }, { label: 'Hemlock', bin: 'Climax' },
    ],
  },
  {
    id: 'succession', title: 'Primary or secondary succession?', prompt: 'Does the disturbance leave the soil?',
    bins: ['Primary', 'Secondary'],
    items: [
      { label: 'Volcano', bin: 'Primary' }, { label: 'Landslide', bin: 'Primary' }, { label: 'Glacier', bin: 'Primary' },
      { label: 'Forest fire', bin: 'Secondary' }, { label: 'Windstorm', bin: 'Secondary' }, { label: 'Harvesting', bin: 'Secondary' },
      { label: 'Abandoned farm field', bin: 'Secondary' },
    ],
  },
  {
    id: 'rings', title: 'Dating events from rings', prompt: 'What kind of ring evidence does each event leave?',
    bins: ['Wound', 'Growth rate change', 'Reaction wood', 'Abnormal ring'],
    items: [
      { label: 'Fire scar', bin: 'Wound' }, { label: 'Mechanical damage', bin: 'Wound' },
      { label: 'Release after cutting', bin: 'Growth rate change' }, { label: 'Insect defoliation', bin: 'Growth rate change' },
      { label: 'Windthrow', bin: 'Reaction wood' },
      { label: 'Frost', bin: 'Abnormal ring' }, { label: 'False ring', bin: 'Abnormal ring' }, { label: 'Missing ring', bin: 'Abnormal ring' },
    ],
  },
  {
    id: 'regions', title: 'Which forest region?', prompt: 'Where is each a dominant species?',
    bins: ['Boreal', 'GLSL', 'Deciduous only'],
    items: [
      { label: 'Jack pine (Pj)', bin: 'Boreal' }, { label: 'Black spruce (Sb)', bin: 'Boreal' }, { label: 'Balsam poplar (Pb)', bin: 'Boreal' },
      { label: 'Hemlock (He)', bin: 'GLSL' }, { label: 'Yellow birch (By)', bin: 'GLSL' }, { label: 'Red oak (Or)', bin: 'GLSL' },
      { label: 'Black walnut (Wb)', bin: 'Deciduous only' }, { label: 'Hickory', bin: 'Deciduous only' },
    ],
  },
];

const RANKS: RankDrill[] = [
  {
    id: 'phases', title: 'Age / size phases', prompt: 'Youngest / smallest at the top.',
    order: ['Seedling / germinant', 'Regeneration', 'Sapling', 'Polewood', 'Boltwood', 'Mature', 'Old / over mature'],
    explain: 'Seedling < 1 m; regeneration < 3 cm DBH; sapling < 5 m; polewood < 10 cm DBH; boltwood < 25 cm; mature > 25 cm.',
  },
  {
    id: 'sun', title: 'Shade tolerance classes', prompt: 'Needs the MOST sunlight at the top.',
    order: SHADE_TABLE.map((r) => r.level),
    explain: SHADE_TABLE.map((r) => `${r.level} ${r.sun}`).join(' · '),
  },
  {
    id: 'bark', title: 'Trunk layers', prompt: 'From the outside of the trunk to the centre.',
    order: ['Outer bark', 'Inner bark (phloem)', 'Vascular cambium', 'Sapwood', 'Heartwood', 'Pith'],
    explain: 'The cambium sits between the phloem (outside) and the xylem / sapwood (inside).',
  },
];

export const ECOLOGY: StudyGuide = {
  id: 'ecology', sections: [REGIONS, SHADE, PHYS, REPRO, SUCC], allLabel: 'All topics',
  cards: CARDS, sorts: SORTS, ranks: RANKS,
};
