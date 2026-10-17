/**
 * Ecology midterm review (FOR7312), from the midterm review lecture, the Tree Physiology and
 * Forest Succession lectures, and the Ecology notes. Shade tolerance follows the lecture's table.
 */
import type { RankDrill, SortDrill, StudyCard, StudyGuide, TestQuestion } from './types';

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
  },
  {
    section: REGIONS, q: 'Name Canada’s forest regions.',
    a: ['Boreal', 'Subalpine', 'Montane', 'Coast', 'Columbian', 'Deciduous (Carolinian)', 'Great Lakes–St. Lawrence', 'Acadian', 'Grasslands', 'Tundra'],
  },
  {
    section: REGIONS, q: 'Name the forest regions of Ontario. Which one is Pembroke in?',
    a: [
      'Boreal: about 50% of Ontario, the largest in Ontario and Canada.',
      'Hudson Bay Lowlands: about 26%.',
      'Great Lakes–St. Lawrence (GLSL): about 20%, the second largest. Pembroke and Renfrew County are here.',
      'Deciduous (Carolinian): about 3%, the southernmost.',
      'Most of Ontario’s population lives in the GLSL and Deciduous regions.',
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
  },
  {
    section: REGIONS, q: 'Describe Ontario’s Great Lakes–St. Lawrence forest region and its dominant species.',
    a: [
      'Conifers: Pw (white pine), Pr (red pine), He (hemlock), white cedar, Sw (white spruce).',
      'Hardwoods: Mh (sugar maple), By (yellow birch), Be (beech), Mr (red maple), Bd (basswood), Or (red oak).',
      'Wildlife: black bear, wolves, white-tailed deer, moose, beaver, muskrat, otters, migratory birds.',
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
  },

  // ---- Shade tolerance & silviculture ----
  {
    section: SHADE, q: 'Define shade tolerance. Why does it matter?',
    a: [
      'The capacity of a tree to develop and grow in the shade of, and in competition with, other trees.',
      'Shade tolerance determines the choice of silvicultural system.',
    ],
  },
  {
    section: SHADE, q: 'What are the shade tolerance classes, and how much sun does each need?',
    a: SHADE_TABLE.map((r) => `${r.level}: ${r.sun}`),
  },
  { section: SHADE, q: 'Name the shade-intolerant species (intolerant and very intolerant).', a: speciesIn('Very intolerant', 'Intolerant') },
  { section: SHADE, q: 'Name the intermediate (mid-tolerant) species.', a: speciesIn('Intermediate') },
  { section: SHADE, q: 'Name the shade-tolerant species (tolerant and very tolerant).', a: speciesIn('Tolerant', 'Very tolerant') },
  {
    section: SHADE, q: 'What are the 3 silvicultural systems, and which shade tolerance goes with each?',
    a: ['Clearcut: intolerant and very intolerant species.', 'Shelterwood: intermediate species.', 'Selection: tolerant and very tolerant species.'],
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
  },
  {
    section: SHADE, q: 'Describe the shelterwood system (SH).',
    a: [
      'Most of the overstory is removed in a series of 2 or more harvests, to establish and shelter regeneration under the remaining canopy.',
      'Even-aged. Regeneration establishes in 30–70% sunlight (leave 40–60% crown closure).',
      'For mid-tolerant species such as white pine and red oak. Red oak (OrUS) only needs 1 final removal cut.',
      'Must be tree marked (except final removals); protect regeneration in the first and final removals.',
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
  },
  {
    section: SHADE, q: 'What is the difference between even-aged and uneven-aged stands?',
    a: [
      'Uneven-aged: three or more age classes, often a diversity of species. E.g. a tolerant hardwood stand (sugar maple, beech, yellow birch).',
      'Even-aged: small age differences between trees, often one species. E.g. an intolerant poplar, jack pine or black spruce stand.',
    ],
  },
  {
    section: SHADE, q: 'Define release, elastic and gap phase.',
    a: [
      'Release (response to release): a tree’s ability to respond to a sudden change from shade to full or high sunlight, e.g. when a tree falls and opens a gap.',
      'Elastic: a tree that responds well to release (e.g. maples). Black cherry shows little response.',
      'Gap phase: species that establish under the canopy and wait, shade-tolerant enough to survive, until a local disturbance opens a gap they can grow into.',
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
  },
  {
    section: SHADE, extra: true, q: 'Why is it hard to guess a shade-tolerant tree’s age from its size?',
    a: ['Tolerant trees can live for many years suppressed in the shade, growing slowly, so a small tree can be old.'],
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
  },
  {
    section: PHYS, q: 'What are the main parts of a tree?',
    a: ['Roots: root hair zone, radicle, lateral roots, taproot.', 'Bole / trunk.', 'Crown: branches (limbs), top and foliage.'],
  },
  {
    section: PHYS, q: 'Define xylem, phloem and cambium.',
    a: [
      'Xylem: carries water and dissolved minerals FROM the roots TO the leaves/needles, and gives physical support. The wood (sapwood and heartwood).',
      'Phloem: carries food (sugars) FROM the leaves/needles TO the roots and the places where new wood is being made. Part of the inner bark.',
      'Vascular cambium: the layer between them that makes new xylem toward the inside and new phloem toward the outside, adding a new ring each year.',
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
  },
  {
    section: PHYS, q: 'How do growth rings form?',
    a: [
      'Trees go dormant in winter and stop growing. In spring, growth starts again, which makes a visible colour change.',
      'Earlywood: grown quickly in spring; light coloured, low density.',
      'Latewood: grown in summer; dense, dark, thick-walled cells.',
      'One earlywood + latewood band = one growth ring = one year.',
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
  },
  {
    section: PHYS, q: 'What problems can come up when aging a tree from its rings (dendrochronology)?',
    a: ['1. A double pith', '2. Hitting branch stubs', '3. Extensive scarring', '4. Centre rot', 'Also false and missing rings, which make the count wrong.'],
  },
  {
    section: PHYS, q: 'What is reaction wood?',
    a: ['Wood a tree forms to support itself after it is pushed or leaning (e.g. after something falls on it, or wind).', 'Tension wood in hardwoods; compression wood in conifers.'],
  },
  {
    section: PHYS, q: 'Where and how do buds form on a branch?',
    a: [
      'Terminal bud: at the end of the twig.',
      'Lateral buds: off the side of the stem or branch.',
      'Vegetative buds grow into leaves and branch growth; reproductive buds grow into flowers or cones.',
      'A bud can develop into a seed cone, a vegetative shoot or a pollen cone, or stay latent or abort.',
    ],
  },
  {
    section: PHYS, extra: true, q: 'What is transpiration?',
    a: ['Water moves from the roots up through the tree to small pores under the leaves, where it evaporates into the air.', 'Trees and plants release about 10% of the moisture in the atmosphere.'],
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
  },
  {
    section: REPRO, q: 'How is pollen moved between trees?',
    a: ['Wind: carries pollen to another tree.', 'Insects and birds: flowers often have nectaries (sugary nectar) and strong, sweet odours to attract them.'],
  },
  {
    section: REPRO, q: 'How are seeds dispersed?',
    a: [
      'Wind: winged seeds (maples, ash, pine) are carried further.',
      'Gravity.',
      'Streams and snowmelt.',
      'Birds and animals: eat nuts or fleshy fruit and spread the seeds through digestion (e.g. red oak), or seeds stick to fur and drop off.',
    ],
  },
  {
    section: REPRO, q: 'What factors influence flowering / cone production?',
    a: ['Age (not too young or too old)', 'Plant hormones', 'Lack of nutrients: nitrogen (photosynthesis) and potassium (growth)', 'Temperature', 'Soil moisture', 'Light quality and intensity: as close to full sunlight as possible (canopy placement)'],
  },
  {
    section: REPRO, q: 'Define dioecious and monoecious, with examples.',
    a: [
      'Dioecious: male and female organs on SEPARATE trees. E.g. poplars, ash, willows.',
      'Monoecious: male and female organs on the SAME tree, either:',
      'Separately on the same tree (female at the top, male at the bottom): spruces, pines, beech, red oak.',
      'Together in the same flower (a perfect flower): elm, basswood, black cherry.',
    ],
  },
  {
    section: REPRO, q: 'Where are male and female cones on a conifer, and why?',
    a: [
      'Male (pollen) cones: lower in the crown.',
      'Female (ovulate / seed) cones: higher up in the crown.',
      'Why: the top is closer to full sunlight, giving energy for flowers and seeds, and it helps prevent inbreeding (self-pollination).',
    ],
  },
  {
    section: REPRO, q: 'How do young and mature cones differ?',
    a: ['Conelet (immature cone): small and upright.', 'Mature cone: drooping (hangs down).'],
  },
  {
    section: REPRO, q: 'What are serotinous cones?',
    a: ['Cones that only open to release seed when exposed to intense heat (fire) of 50 °C or more.', 'E.g. jack pine; black spruce cones are semi-serotinous.'],
  },
  {
    section: REPRO, q: 'What are the other (vegetative) forms of reproduction, and which species use them?',
    a: [
      'Layering: an undetached branch on or in the soil roots and grows into a new tree. E.g. cedar, black spruce.',
      'Stem sprouts: regeneration from the stem.',
      'Stump sprouts (coppice growth): regeneration from the stump. E.g. red oak, basswood, red maple.',
      'Root sprouts (suckering): regeneration from the roots. E.g. poplar, white elm.',
    ],
  },
  {
    section: REPRO, extra: true, q: 'What are the parts of a flower?',
    a: [
      'Pistil (female) in the centre, surrounded by stamens (male; the anthers make pollen), then petals (the corolla) and sepals (the calyx).',
      'A complete flower has all four; a perfect flower has both pistils and stamens.',
    ],
  },

  // ---- Succession ----
  {
    section: SUCC, q: 'What is forest succession?',
    a: ['The dynamic changes in the forest by which one community succeeds (replaces) another through time.'],
  },
  {
    section: SUCC, q: 'What is the difference between primary and secondary succession?',
    a: [
      'Primary: the disturbance removes the soil and organisms, leaving bare rock, gravel, silt or sand. E.g. volcano, landslide, glaciers, flooding.',
      'Secondary: the disturbance leaves the soil intact, and usually seeds, spores and roots too. E.g. fire, wind, insects, disease, humans (harvesting, abandoned farm fields).',
    ],
  },
  {
    section: SUCC, q: 'What are the 3 stages of succession, with example species?',
    a: [
      'Pioneer: seed into open areas after major disturbances. E.g. poplar, white birch, larch; fire-dependent jack pine and black spruce.',
      'Intermediate (gap phase): establish under the canopy and wait for a gap. E.g. ash, oak, red maple, yellow birch, basswood, white spruce, white pine.',
      'Climax: establish in the shaded understory and persist, filling the canopy as old trees die. E.g. sugar maple, beech, hemlock, ironwood (GLSL); black spruce and balsam fir (Boreal).',
    ],
  },
  {
    section: SUCC, q: 'What are the major disturbances that restart succession?',
    a: ['Fire', 'Disease / insect epidemic', 'Flooding', 'Glacier', 'Landslide', 'Human activity', 'Wind'],
  },
  {
    section: SUCC, extra: true, q: 'How does harvesting fit into the succession cycle?',
    a: ['1. Harvest', '2. Competition control and establishment of regeneration', '3. Stand thinning / tending', '4. Harvest again'],
  },
];

const TEST: TestQuestion[] = [
  { q: 'Which forest region is Pembroke in?', choices: ['Boreal', 'Great Lakes–St. Lawrence', 'Deciduous (Carolinian)', 'Hudson Bay Lowlands'], answer: 1, why: 'Pembroke and Renfrew County are in the GLSL region.' },
  { q: 'What is the largest forest region in Ontario?', choices: ['Boreal', 'Great Lakes–St. Lawrence', 'Deciduous', 'Acadian'], answer: 0, why: 'Boreal: about 50% of Ontario, and the largest in Canada.' },
  { q: 'Which region has the most tree species but the least forest?', choices: ['Boreal', 'GLSL', 'Deciduous (Carolinian)', 'Hudson Bay Lowlands'], answer: 2, why: 'The Deciduous region is mostly cleared for farms and cities.' },
  { q: 'Which is a dominant GLSL hardwood?', choices: ['Trembling aspen', 'Sugar maple', 'Black walnut', 'Balsam poplar'], answer: 1, why: 'GLSL hardwoods: Mh, By, Be, Mr, Bd, Or.' },
  { q: 'Shade tolerance determines…', choices: ['A tree’s height', 'The choice of silvicultural system', 'The forest region', 'Seed viability'], answer: 1, why: 'Tolerance → selection, shelterwood or clearcut.' },
  { q: 'Which species is very shade tolerant?', choices: ['Jack pine', 'Red oak', 'Sugar maple', 'White birch'], answer: 2, why: 'Very tolerant: beech, balsam fir, hemlock, ironwood, sugar maple.' },
  { q: 'Red oak is…', choices: ['Very intolerant', 'Intolerant', 'Intermediate', 'Very tolerant'], answer: 2, why: 'Red oak is intermediate, which is why it is managed with shelterwood.' },
  { q: 'Which silvicultural system suits intolerant species?', choices: ['Selection', 'Shelterwood', 'Clearcut', 'Group selection only'], answer: 2, why: 'Intolerant → clearcut; intermediate → shelterwood; tolerant → selection.' },
  { q: 'In the shelterwood system, regeneration establishes in…', choices: ['> 70% sunlight', '30–70% sunlight', 'About 30% sunlight', '1–3% sunlight'], answer: 1, why: 'Clearcut > 70%; shelterwood 30–70%; selection about 30% (≥ 70% crown closure).' },
  { q: 'The selection system creates…', choices: ['Even-aged stands', 'Uneven-aged stands', 'Single-species stands', 'Pioneer stands'], answer: 1, why: 'Selection keeps an uneven-aged stand with mature cover forever.' },
  { q: 'An uneven-aged stand has at least…', choices: ['2 age classes', '3 age classes', '5 age classes', '10 age classes'], answer: 1, why: 'Three or more age classes.' },
  { q: 'A tree that responds well to release is called…', choices: ['Serotinous', 'Elastic', 'Dioecious', 'Climax'], answer: 1, why: 'Elastic trees, like maples, respond well to sudden light.' },
  { q: 'Which age phase is less than 1 m high?', choices: ['Sapling', 'Polewood', 'Seedling / germinant', 'Boltwood'], answer: 2, why: 'Seedling < 1 m; regeneration < 3 cm DBH / < 2 m; sapling < 5 m; polewood < 10 cm DBH.' },
  { q: 'Mature trees are greater than…', choices: ['10 cm DBH', '15 cm DBH', '25 cm DBH', '40 cm DBH'], answer: 2, why: 'Boltwood < 25 cm DBH; mature > 25 cm DBH.' },
  { q: 'Xylem carries…', choices: ['Sugars from the leaves to the roots', 'Water and minerals from the roots to the leaves', 'Only air', 'Seeds'], answer: 1, why: 'Xylem: water up. Phloem: food from the leaves to the roots and growing areas.' },
  { q: 'Which layer makes new xylem and phloem?', choices: ['Pith', 'Heartwood', 'Vascular cambium', 'Outer bark'], answer: 2, why: 'The vascular cambium: xylem inward, phloem outward.' },
  { q: 'Latewood is…', choices: ['Light and low density', 'Dense and dark', 'Found only in conifers', 'The pith'], answer: 1, why: 'Earlywood (spring) is light; latewood (summer) is dense and dark.' },
  { q: 'Which is a problem when aging a tree from its rings?', choices: ['Earlywood', 'A double pith', 'Rays', 'Sapwood'], answer: 1, why: 'Double pith, branch stubs, extensive scarring, centre rot.' },
  { q: 'Gymnosperms have…', choices: ['Enclosed seeds', 'Naked seeds', 'No seeds', 'Perfect flowers'], answer: 1, why: 'Gymno = naked; angio = enclosed.' },
  { q: 'Which tree is dioecious?', choices: ['Red oak', 'Basswood', 'Poplar', 'White pine'], answer: 2, why: 'Dioecious (separate male and female trees): poplars, ash, willows.' },
  { q: 'Elm, basswood and black cherry have…', choices: ['Separate male and female trees', 'Perfect flowers', 'Serotinous cones', 'No flowers'], answer: 1, why: 'Monoecious with both organs in the same (perfect) flower.' },
  { q: 'Female cones are usually found…', choices: ['Low in the crown', 'High in the crown', 'On the roots', 'Only on dead branches'], answer: 1, why: 'Higher up, closer to full sunlight, which also helps prevent inbreeding.' },
  { q: 'Serotinous cones open at temperatures of at least…', choices: ['20 °C', '35 °C', '50 °C', '100 °C'], answer: 2, why: '≥ 50 °C, e.g. jack pine (black spruce is semi-serotinous).' },
  { q: 'Root suckering is typical of…', choices: ['Poplar and white elm', 'Cedar and black spruce', 'Red pine', 'Balsam fir'], answer: 0, why: 'Root sprouts: poplar, white elm. Layering: cedar, black spruce.' },
  { q: 'Stump sprouting (coppice growth) is typical of…', choices: ['Jack pine', 'Red oak, basswood and red maple', 'White spruce', 'Tamarack'], answer: 1, why: 'Stump sprouts: red oak, basswood, red maple.' },
  { q: 'Seed stratification is…', choices: ['Spreading seeds by wind', 'Storing seeds under set conditions to overcome dormancy', 'The capacity of a seed to germinate', 'Transfer of pollen'], answer: 1, why: 'Viability is the capacity to germinate; pollination is pollen transfer.' },
  { q: 'Which is an example of primary succession?', choices: ['After a forest fire', 'On an abandoned farm field', 'After a glacier retreats', 'After a harvest'], answer: 2, why: 'Primary = soil removed (glacier, volcano, landslide). Fire and harvest are secondary.' },
  { q: 'Which is a pioneer species?', choices: ['Sugar maple', 'Hemlock', 'White birch', 'Ironwood'], answer: 2, why: 'Pioneers: poplar, white birch, larch, jack pine, black spruce.' },
  { q: 'Which is a GLSL climax species?', choices: ['Trembling aspen', 'Beech', 'Jack pine', 'Larch'], answer: 1, why: 'GLSL climax: sugar maple, beech, hemlock, ironwood.' },
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
  cards: CARDS, test: TEST, sorts: SORTS, ranks: RANKS,
};
