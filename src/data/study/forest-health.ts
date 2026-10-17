/**
 * Forest Health midterm review (FOR7322), from the midterm review list and the lectures: Intro to
 * Forest Health, Hardwood Defect Indicators, Other Hardwood Defects, and Wildlife Cavity and Mast
 * Trees (all summarised from the Ontario Tree Marking Guide).
 */
import { DEFECTS } from '@/data/topics/defects';
import type { Severity, Stock } from '@/data/topics/types';
import { mc, multi, order, tf, typed, type RankDrill, type SortDrill, type StudyCard, type StudyGuide } from './types';

const BASICS = 'Pathology & fungi';
const GRADING = 'AGS, UGS & defects';
const OTHER = 'Other hardwood defects';
const MARKING = 'Tree marking';
const WILDLIFE = 'Cavity & mast trees';

/** Defects from the lectures that have no photo in the defect quiz. */
export const OTHER_DEFECTS: { name: string; severity: Severity; stock: Stock; note?: string }[] = [
  { name: 'Emerald ash borer', severity: 'major', stock: 'UGS' },
  { name: 'Fire scar (hardwoods)', severity: 'major', stock: 'UGS' },
  { name: 'Dutch elm disease', severity: 'major', stock: 'UGS' },
  { name: 'Oak wilt', severity: 'major', stock: 'UGS' },
  { name: 'Tar spot', severity: 'minor', stock: 'AGS' },
  { name: 'Frost damage', severity: 'minor', stock: 'AGS' },
  { name: 'Leaf scorch', severity: 'minor', stock: 'AGS' },
  { name: 'Tree absorption (CODIT)', severity: 'minor', stock: 'AGS' },
  { name: 'U-shaped fork', severity: 'minor', stock: 'AGS' },
  { name: 'V-shaped fork', severity: 'minor', stock: 'AGS' },
  { name: 'Wind or ice damage (crown)', severity: 'minor', stock: 'AGS' },
  { name: 'Wolf tree', severity: 'minor', stock: 'AGS' },
];

/** Every defect with a single severity, for the "major to minor" drills. */
export const ALL_DEFECTS: { name: string; severity: Severity }[] = [
  // Items whose cases all share one severity (e.g. an oozing fluxing seam is still moderate).
  ...DEFECTS.items.flatMap((i) =>
    i.ratings?.length && new Set(i.ratings.map((r) => r.severity)).size === 1 ? [{ name: i.name, severity: i.ratings[0].severity }] : []),
  { name: 'Large dark face scar (> 900 cm²)', severity: 'major' },
  { name: 'Small dark face scar (< 900 cm²)', severity: 'moderate' },
  ...OTHER_DEFECTS.map(({ name, severity }) => ({ name, severity })),
];

const names = (sev: Severity) => ALL_DEFECTS.filter((d) => d.severity === sev).map((d) => d.name);

const CARDS: StudyCard[] = [
  // ---- Pathology & fungi ----
  {
    section: BASICS, q: 'What is forest pathology? What else does forest health cover?',
    a: ['Forest pathology: the study of tree disease.', 'Forest entomology: the study of forest insects that affect tree health.', 'Together they make up forest health.'],
    test: [
      mc('Forest pathology is the study of…', ['Forest insects', 'Tree disease', 'Forest soils', 'Tree growth'], 1, 'Pathology = tree disease. Entomology = forest insects.'),
      typed('Forest health is made up of forest pathology and forest ____.', ['entomology', 'forest entomology'], 'Forest entomology: the study of forest insects that affect tree health.'),
    ],
  },
  {
    section: BASICS, q: 'What is the difference between abiotic and biotic conditions?',
    a: [
      'Abiotic = non-living (non-infectious). E.g. seams, cracks, mechanical damage, fire scars, broken branches. Mainly caused by weather (ice, snow, heat), fire and equipment/machinery. Found on the main stem, crown or roots.',
      'Biotic = living (infectious). E.g. insects, animals (squirrels, deer, forest techs…) and fungi. Caused by living things using or eating the tree. Found on leaves/needles, inside the stem or branches, or in the roots.',
    ],
    test: [
      multi('Select all the ABIOTIC (non-living) conditions.', ['Frost crack', 'Fire scar', 'Artist’s conk', 'Mechanical damage', 'Emerald ash borer', 'Broken branches'], [0, 1, 3, 5], 'Abiotic: seams, cracks, mechanical damage, fire scars, broken branches. Fungi and insects are biotic.'),
      tf('Biotic conditions are non-infectious.', false, 'Biotic = living and infectious (insects, animals, fungi). Abiotic = non-living, non-infectious.'),
      mc('Abiotic conditions are mainly caused by…', ['Fungi and insects', 'Weather, fire and equipment/machinery', 'Squirrels and deer', 'Lichen'], 1, 'Weather (ice, snow, heat), fire and equipment.'),
    ],
  },
  {
    section: BASICS, q: 'What are the parts of a fungus?',
    a: [
      'Fruitbody (fruiting body): the mushroom or conk you see, which releases spores.',
      'Spores: tiny “seeds” that spread the fungus.',
      'Hyphae: thread-like strands that feed and grow in the wood or soil. A mass of hyphae is the mycelium.',
    ],
    test: [
      mc('The thread-like strands of a fungus are called…', ['Spores', 'Hyphae', 'Conks', 'Gills'], 1, 'Hyphae; a mass of hyphae is the mycelium.'),
      typed('A mass of hyphae is called the ____.', ['mycelium'], 'Mycelium.'),
      mc('Which part of a fungus releases spores?', ['Hyphae', 'Mycelium', 'Fruitbody', 'Roots'], 2, 'The fruitbody (mushroom or conk).'),
    ],
  },
  {
    section: BASICS, q: 'How does a fungus spread and infect a tree?',
    a: [
      'The fruitbody releases spores, which are spread by wind, rain splash and insects.',
      'Spores land on the tree and get in through wounds or cracks, then germinate if moisture and food are present.',
      'Hyphae grow from the spores (hyphae from different spores mate) and feed through the wood as mycelium.',
      'The mycelium eventually forms a new fruitbody, and the cycle repeats.',
    ],
    test: [
      order('Put the fungal life cycle in order.', ['Fruitbody releases spores', 'Spores spread by wind, rain splash or insects', 'Spores get in through a wound and germinate', 'Hyphae grow through the wood as mycelium', 'A new fruitbody forms'], 'Spores → spread → enter a wound and germinate → mycelium → new fruitbody.'),
      tf('Spores usually get into a tree through wounds or cracks.', true, 'E.g. beech scale punctures turn into cracks the Neonectria fungus enters.'),
    ],
  },
  {
    section: BASICS, q: 'What are the 3 types of fungi?',
    a: [
      'Saprophytic: feed on dead plant tissue (dead trees or dead parts of trees). They recycle nutrients and decompose material.',
      'Parasitic: feed on live tissue. They harm trees but also create cavities. Most important for this course.',
      'Mycorrhizal (symbiotic): help trees grow. The mycelium attaches to tree roots and exchanges water and nutrients. A “very good” fungus.',
    ],
    test: [
      mc('Which type of fungus feeds on live tissue?', ['Saprophytic', 'Parasitic', 'Mycorrhizal', 'Symbiotic'], 1, 'Parasitic: live tissue; harms trees but creates cavities.'),
      mc('Which type of fungus helps trees grow?', ['Saprophytic', 'Parasitic', 'Mycorrhizal', 'Spine tooth'], 2, 'Mycorrhizal (symbiotic): attaches to roots and trades water and nutrients.'),
      tf('Saprophytic fungi feed on live tissue.', false, 'Saprophytic fungi feed on dead tissue and recycle nutrients.'),
    ],
  },
  {
    section: BASICS, q: 'Do lichen, algae and moss harm trees?',
    a: [
      'No. They live on the bark without harming the tree, so no control is needed.',
      'Lichen is a fungus and an alga living together (symbiosis). Moss doesn’t only grow on the north side: algae and moss grow on any moist, shady site.',
    ],
    test: [
      tf('Lichen, algae and moss harm trees and should be controlled.', false, 'They live on the bark without harming the tree; no control is needed.'),
      mc('Lichen is…', ['A fungus and an alga living together', 'A moss', 'A parasitic fungus', 'An insect'], 0, 'A symbiotic fungus + alga.'),
    ],
  },
  { section: BASICS, q: 'What does CFSA stand for?', a: ['Crown Forest Sustainability Act.'], test: [
      typed('What does CFSA stand for?', ['Crown Forest Sustainability Act'], 'Crown Forest Sustainability Act.'),
    ] },

  // ---- AGS, UGS & defects ----
  {
    section: GRADING, q: 'Define AGS.',
    a: [
      'Acceptable Growing Stock.',
      'Its form and appearance suggest it can reasonably be expected to maintain and/or improve its quality.',
      'Expected to contribute significantly to future crops as vigorous, high-quality stems (likely to keep growing for another ~20 years).',
    ],
    test: [
      typed('What does AGS stand for?', ['Acceptable Growing Stock'], 'Acceptable Growing Stock.'),
      tf('AGS trees can be expected to maintain and/or improve their quality.', true, 'And contribute vigorous, high-quality stems to future crops.'),
    ],
  },
  {
    section: GRADING, q: 'Define UGS.',
    a: [
      'Unacceptable Growing Stock.',
      'High risk: expected to decline during the next cutting cycle (likely to die in the next 20–25 years), so it can be harvested.',
      'May also be of poor form and/or low quality and can’t reasonably be expected to improve.',
    ],
    test: [
      typed('What does UGS stand for?', ['Unacceptable Growing Stock'], 'Unacceptable Growing Stock.'),
      mc('UGS trees are high risk and expected to decline during…', ['The next cutting cycle', 'The next 100 years', 'The next winter', 'Never'], 0, 'During the next cutting cycle (likely to die in 20–25 years).'),
    ],
  },
  {
    section: GRADING, q: 'What do major, moderate and minor defects mean for AGS / UGS?',
    a: [
      'Major: always UGS.',
      'Moderate: reduce quality potential; the tree will degrade slowly. Can go either way (AGS or UGS).',
      'Minor: the tree will maintain quality over the cutting cycle. Always AGS.',
      'The defect table is on page 66 of the Ontario Tree Marking Guide. Many trees have more than one defect.',
    ],
    test: [
      mc('A major defect means the tree is…', ['Always AGS', 'Always UGS', 'AGS or UGS', 'Not rated'], 1, 'Major = always UGS.'),
      mc('Trees with moderate defects will…', ['Degrade slowly', 'Maintain quality over the cutting cycle', 'Die within a year', 'Always be AGS'], 0, 'Moderate defects reduce quality potential; the tree degrades slowly.'),
      tf('Minor defects are always AGS.', true, 'The tree will maintain quality over the cutting cycle.'),
    ],
  },
  { section: GRADING, q: 'Name the major defects (always UGS).', a: names('major'), test: [
      multi('Select all the MAJOR defects.', ['Spine tooth fungus', 'Burl', 'Artist’s conk', 'Sunscald', 'Butt flare', 'Cobra canker', 'Crook'], [0, 2, 4, 5], 'Burl and crook are minor; sunscald is moderate.'),
      multi('Select all the MAJOR defects.', ['Coal fungus', 'Black bark', 'Lean > 10°', 'Fire scar', 'Epicormic branching', 'Emerald ash borer'], [0, 1, 3, 5], 'Lean is moderate; epicormic branching is minor.'),
    ] },
  { section: GRADING, q: 'Name the moderate defects.', a: names('moderate'), test: [
      multi('Select all the MODERATE defects.', ['Sugar maple borer', 'Spiral seam', 'Epicormic branching', 'Lean > 10°', 'Black bark', 'Sunscald', 'Sweep'], [0, 1, 3, 5], 'Epicormic branching and sweep are minor; black bark is major.'),
    ] },
  { section: GRADING, q: 'Name the minor defects (always AGS).', a: names('minor'), test: [
      multi('Select all the MINOR defects.', ['Burl', 'Crook', 'Mossy top', 'White face scar', 'Epicormic branching', 'Frost crack'], [0, 1, 3, 4], 'Mossy top and frost crack are moderate.'),
    ] },
  {
    section: GRADING, q: 'Classify from major to minor: sugar maple borer, burl and spine tooth fungus.',
    a: ['Spine tooth fungus: major (UGS).', 'Sugar maple borer: moderate.', 'Burl: minor (AGS).'],
    test: [
      order('Put these in order from major to minor.', ['Spine tooth fungus', 'Sugar maple borer', 'Burl'], 'Spine tooth = major, sugar maple borer = moderate, burl = minor.'),
      order('Put these in order from major to minor.', ['Artist’s conk', 'Black knot', 'Sweep'], 'Artist’s conk = major, black knot = moderate, sweep = minor.'),
    ],
  },
  {
    section: GRADING, q: 'When is a dark face scar major, and when is it moderate?',
    a: ['Larger than 900 cm²: major (UGS).', 'Smaller than 900 cm²: moderate.', '900 cm² is 30 cm × 30 cm, a little bigger than a sheet of paper.'],
    test: [
      mc('A dark face scar of 1,200 cm² is…', ['Minor', 'Moderate', 'Major', 'Not a defect'], 2, 'Over 900 cm² = major; under 900 cm² = moderate.'),
      typed('Above what size (in cm²) is a dark face scar a major defect?', ['900'], '900 cm² = 30 × 30 cm, a little bigger than a sheet of paper.'),
    ],
  },
  {
    section: GRADING, q: 'Which defects have exceptions to the usual AGS / UGS rule?',
    a: [
      'Mossy top: a moderate defect, but always UGS.',
      'Black knot (mainly on cherry): moderate, but UGS when more than 50% of the crown is affected.',
      'Fluxing seam: moderate, but UGS if it is oozing.',
      'Beech bark disease: major, but NOT UGS if there is only scale (no fungus fruiting bodies).',
      'Cavity on the main stem: major (UGS), but keep it when you can: it is good for wildlife.',
    ],
    test: [
      mc('Mossy top is…', ['Minor, always AGS', 'Moderate, always UGS', 'Major, always UGS', 'Moderate, either way'], 1, 'The lecture lists it as moderate, but always UGS.'),
      tf('A beech with beech scale insects only (no fungus) is UGS.', false, 'BBD is only UGS once the fungus is there.'),
      mc('Black knot becomes UGS when it affects more than…', ['10% of the crown', '25% of the crown', '50% of the crown', 'Any of the crown'], 2, 'More than 50% of the crown.'),
      tf('A fluxing seam that is oozing is UGS.', true, 'Fluxing seams are moderate, but UGS if oozing.'),
    ],
  },
  {
    section: GRADING, extra: true, q: 'What are the crown position classes?',
    a: ['D = Dominant', 'C = Codominant', 'I = Intermediate', 'S = Suppressed', 'Crown position, size and quality (plus bark characteristics) indicate a tree’s potential vigour.'],
    test: [
      order('Put the crown position classes in order, from the top of the canopy down.', ['Dominant', 'Codominant', 'Intermediate', 'Suppressed'], 'D, C, I, S.'),
      typed('In crown classes, what does “S” stand for?', ['Suppressed'], 'Suppressed: outcompeted, below the canopy.'),
    ],
  },

  // ---- Other hardwood defects ----
  {
    section: OTHER, q: 'What causes beech bark disease (BBD), and how is it rated?',
    a: [
      'The invasive beech scale insect (Cryptococcus fagisuga) feeds on the sap and punctures the bark. The punctures turn into cracks that let the Neonectria fungus in.',
      'The scale nymphs are covered in white, woolly wax; the fungus makes small orange-red fruiting bodies in lemon-shaped patterns.',
      '50–85% of infected beech die within 10 years.',
      'Major defect, UGS (not UGS if it is only scale).',
    ],
    test: [
      mc('Beech bark disease starts when ___ feeds on the sap.', ['The beech scale insect', 'Emerald ash borer', 'Elm bark beetles', 'Sap beetles'], 0, 'The invasive beech scale (Cryptococcus fagisuga) opens wounds for the Neonectria fungus.'),
      mc('What do BBD fungus fruiting bodies look like?', ['Small orange-red dots in lemon-shaped patterns', 'Large white shelves', 'Black, crusty lumps', 'Yellow mushrooms'], 0, 'Small orange-red fruiting bodies in lemon-shaped patterns.'),
      mc('About how many infected beech die within 10 years?', ['5–10%', '20–30%', '50–85%', '100%'], 2, '50–85%.'),
    ],
  },
  {
    section: OTHER, q: 'What are the 3 phases of beech bark disease?',
    a: [
      'Advancing front: the scale insect arrives and multiplies; little change yet, but the stand becomes open to the fungus.',
      'Killing front: high scale densities and severe fungus attack; large beech reach 50–85% mortality within 10 years.',
      'Aftermath forest: stands that survived the first wave. Root suckers from attacked trees choke out maple and birch regeneration and get infected in turn.',
    ],
    test: [
      order('Put the phases of beech bark disease in order.', ['Advancing front', 'Killing front', 'Aftermath forest'], 'Scale arrives → heavy fungus attack and mortality → surviving stands full of root suckers.'),
      mc('In which phase do beech root suckers choke out maple and birch regeneration?', ['Advancing front', 'Killing front', 'Aftermath forest', 'None'], 2, 'The aftermath forest.'),
    ],
  },
  {
    section: OTHER, q: 'How does BBD spread, and how is it controlled?',
    a: [
      'Scale insects spread by wind, animals and people moving beech wood with bark on. Fungal spores spread by wind and rain splash.',
      'Don’t move firewood. Keep resistant beech (no signs of scale) when managing forests.',
      'Impacts: lower beech wood quality, a lost mast (beechnut) food source, e.g. for black bears, and heavy beech understory that blocks sugar maple regeneration.',
    ],
    test: [
      multi('Which help control beech bark disease?', ['Don’t move firewood', 'Keep beech with no signs of scale', 'Prune beech in spring', 'Plant more beech in infested stands'], [0, 1], 'Don’t move firewood; retain resistant (scale-free) beech.'),
      tf('Losing beech to BBD is a big loss of food for black bears.', true, 'Beech is a valuable mast tree; bears rely heavily on beechnuts.'),
    ],
  },
  {
    section: OTHER, q: 'What is emerald ash borer (EAB), and how is it rated?',
    a: [
      'An insect native to Asia. Larvae tunnel through the ash tree’s vascular system, stopping the movement of water, nutrients and sugars.',
      'Attacks healthy and stressed ash; once infested, mortality is nearly 100%. No known natural enemies here.',
      'It travels only a few km a year on its own, but spreads far in firewood, logs, lumber and wood chips. The CFIA prohibits moving ash material and firewood out of regulated areas.',
      'Major defect, UGS.',
    ],
    test: [
      mc('Emerald ash borer is native to…', ['Europe', 'Asia', 'South America', 'Ontario'], 1, 'Asia.'),
      tf('EAB only attacks stressed ash trees.', false, 'It attacks both healthy and stressed ash; mortality is nearly 100%.'),
      mc('How does EAB spread long distances?', ['On its own, about 100 km a year', 'In firewood, logs, lumber and wood chips moved by people', 'On the wind', 'Through root grafts'], 1, 'Only a few km a year on its own; far in moved wood.'),
    ],
  },
  {
    section: OTHER, q: 'What is Dutch elm disease (DED), and how is it rated?',
    a: [
      'An invasive fungus (Ophiostoma novo-ulmi) in the elm’s vascular tissue. The tree plugs its own xylem to stop it, which starves the tree.',
      'Spread by elm bark beetles (native Hylurgopinus rufipes and the European Scolytus multistriatus) and through root grafts.',
      'Symptoms from mid-June: leaves in the outer crown yellow, wilt and turn brown. Trees usually die in 1–3 years. Worst on American and rock elm.',
      'Control: remove infected trees, don’t move or burn elm firewood, sterilize pruning tools.',
      'Major defect, UGS.',
    ],
    test: [
      mc('Dutch elm disease is spread by…', ['Wind-blown spores only', 'Elm bark beetles and root grafts', 'Woodpeckers', 'Beech scale'], 1, 'Elm bark beetles carry the spores; also root grafts.'),
      mc('After infection, elms usually die within…', ['3–6 weeks', '1–3 years', '10 years', '50 years'], 1, '1–3 years.'),
      mc('Dutch elm disease is rated…', ['Minor, AGS', 'Moderate', 'Major, UGS', 'Not a defect'], 2, 'Major defect, UGS.'),
    ],
  },
  {
    section: OTHER, q: 'What is oak wilt, and how is it rated?',
    a: [
      'A fungal vascular disease spread mainly through root grafts, and by sap beetles attracted to fresh wounds.',
      'Red oak group: sudden wilting and leaf drop from the top down; trees die within 3–6 weeks. The white oak group is less affected.',
      'Control: don’t prune oaks in spring or early summer, trench around infected trees, remove infected trees and wood.',
      'Major defect, UGS.',
    ],
    test: [
      mc('Red oak group trees die within about ___ of the first wilting.', ['3–6 weeks', '1–3 years', '10 years', 'They don’t die'], 0, '3–6 weeks.'),
      mc('To avoid spreading oak wilt, don’t prune oaks in…', ['Late fall', 'Winter', 'Spring and early summer', 'Any season'], 2, 'Fresh wounds attract sap beetles that carry the fungus.'),
      tf('The white oak group is hit harder by oak wilt than the red oak group.', false, 'The red oak group is hit hardest.'),
    ],
  },
  {
    section: OTHER, q: 'What is tar spot, and how is it rated?',
    a: ['A fungus (Rhytisma spp.) that makes black spots on maple leaves: red, hard, silver and Manitoba maple.', 'It overwinters in fallen leaves, so removing leaf debris in the fall helps.', 'Minor defect, AGS.'],
    test: [
      mc('Tar spot on maple leaves is…', ['Major, UGS', 'Moderate', 'Minor, AGS', 'Not a defect'], 2, 'Minor, AGS.'),
      tf('Raking up fallen leaves in the fall helps control tar spot.', true, 'The fungus overwinters in leaf debris.'),
    ],
  },
  { section: OTHER, q: 'How are frost damage and leaf scorch rated?', a: ['Minor defects, AGS.'], test: [
      tf('Frost damage and leaf scorch are minor defects (AGS).', true, 'Minor, AGS.'),
    ] },
  {
    section: OTHER, q: 'Which other (anthropogenic and form) defects are minor / AGS?',
    a: ['Tree absorption of objects (CODIT)', 'U-shaped and V-shaped forks', 'Wind or ice damage to the crown', 'Wolf tree', 'Stilted roots are also shown in the lecture, with no rating.'],
    test: [
      multi('Select all the defects that are minor / AGS.', ['U-shaped fork', 'Wolf tree', 'Oak wilt', 'Wind or ice damage to the crown', 'Dutch elm disease', 'Tree absorption (CODIT)'], [0, 1, 3, 5], 'Oak wilt and Dutch elm disease are major / UGS.'),
    ],
  },
  {
    section: OTHER, q: 'What are the signs of insect damage on a tree?',
    a: ['Leaf discolouration', 'Branch dieback', 'Exit holes', 'Egg masses', 'Frass (wood shavings)', 'Running sap', 'More woodpecker activity', 'Noticeable insect populations'],
    test: [
      multi('Select all the signs of insect damage.', ['Frass (wood shavings)', 'Exit holes', 'Egg masses', 'Lichen on the bark', 'More woodpecker activity', 'Moss on the north side'], [0, 1, 2, 4], 'Also leaf discolouration, branch dieback, running sap and visible insects.'),
    ],
  },

  // ---- Tree marking ----
  {
    section: MARKING, q: 'What is tree marking, and why do we do it?',
    a: [
      'Choosing and painting the trees to cut or to leave in a stand, following the Ontario Tree Marking Guide.',
      'Benefits: maintains stand/forest health, is sustainable, and promotes growth.',
      'On Crown land it is the law, under the CFSA.',
    ],
    check: 'The definition (choosing and painting trees to cut or leave) isn’t spelled out in the lecture; the benefits and the CFSA are.',
    test: [
      multi('What are the benefits of tree marking?', ['Maintains stand / forest health', 'Sustainable', 'Promotes growth', 'Removes all wildlife trees'], [0, 1, 2], 'And on Crown land it is the law (CFSA).'),
      mc('On Crown land, tree marking is required by…', ['The CFSA', 'The CFIA', 'The OBM', 'The FRI'], 0, 'The Crown Forest Sustainability Act.'),
    ],
  },
  {
    section: MARKING, q: 'Who has to mark trees on Crown land?',
    a: [
      'A certified tree marker.',
      'Selection harvests must be tree marked. Shelterwood harvests must be marked too, except final removal cuts.',
      'All marked trees are removed as per the CFSA.',
    ],
    test: [
      mc('Who marks trees on Crown land?', ['Any forest worker', 'A certified tree marker', 'The landowner', 'The logging contractor'], 1, 'A certified tree marker.'),
      tf('Shelterwood final removal cuts must be tree marked.', false, 'Shelterwood harvests are marked except the final removals.'),
    ],
  },

  // ---- Cavity & mast trees ----
  {
    section: WILDLIFE, q: 'Why are wildlife trees important in tree marking?',
    a: [
      'Cavity trees give wildlife places for nesting, denning, roosting, resting/escaping, feeding and hibernating.',
      'Mast trees produce fruit or nuts: food for wildlife such as black bears, deer, squirrels, grouse and turkeys.',
      'So the best cavity and mast trees are kept (retained) when a stand is marked.',
    ],
    test: [
      multi('Wildlife use cavity trees for…', ['Nesting', 'Denning', 'Roosting', 'Hibernating', 'Photosynthesis'], [0, 1, 2, 3], 'Also resting/escaping and feeding.'),
    ],
  },
  {
    section: WILDLIFE, q: 'What is a cavity tree? What makes it C1 or C2?',
    a: [
      'Any tree at least 25 cm DBH that contains a cavity.',
      'C1 (good cavity tree): at least 25 cm DBH with a pileated woodpecker roost cavity, pileated woodpecker nest cavity, other woodpecker nest cavity, or natural nest or den cavity (the 4 top-rated cavities).',
      'C2 (fair cavity tree): at least 25 cm DBH with an escape cavity, or a feeding cavity on the bole or major branches.',
    ],
    test: [
      typed('What is the minimum DBH of a cavity tree, in cm?', ['25'], 'Any tree at least 25 cm DBH that contains a cavity.'),
      mc('A C1 cavity tree is a…', ['Good cavity tree', 'Fair cavity tree', 'Mast tree', 'Dead tree'], 0, 'C1 = good (the 4 top-rated cavities); C2 = fair.'),
    ],
  },
  {
    section: WILDLIFE, q: 'In what order of priority are cavity trees retained?',
    a: [
      '1. Pileated woodpecker roost cavity (C1)',
      '2. Pileated woodpecker nest cavity (C1)',
      '3. Other woodpecker nest cavity, or natural nest or den cavity (C1)',
      '4. Escape cavity (C2)',
      '5. Woodpecker feeding cavity (C2)',
      '6. High potential to develop cavities (C2)',
    ],
    test: [
      order('Put cavity trees in order of retention priority.', ['PWP roost cavity', 'PWP nest cavity', 'Other woodpecker nest / natural den', 'Escape cavity', 'Woodpecker feeding cavity', 'High potential to develop cavities'], 'PWP = pileated woodpecker. The first three are C1.'),
      mc('Which cavity has the highest retention priority?', ['Escape cavity', 'PWP nest cavity', 'PWP roost cavity', 'Natural den cavity'], 2, 'Pileated woodpecker roost cavity is #1.'),
    ],
  },
  {
    section: WILDLIFE, q: 'How do you recognise a pileated woodpecker ROOST cavity?',
    a: ['Living or standing dead tree, larger than 40 cm.', 'Hollow, with 2 or more excavated holes.', 'Oval entrance 7.5–10 cm wide × 10–12.5 cm tall (softball size) with smooth edges.', 'Leads into a hollow chamber.'],
    test: [
      mc('A tree over 40 cm, hollow, with 2+ oval softball-sized holes with smooth edges is a…', ['PWP roost cavity', 'Feeding cavity', 'Escape cavity', 'Other woodpecker nest'], 0, 'Pileated woodpecker roost cavity.'),
      tf('A pileated woodpecker roost cavity must be in a living tree.', false, 'Roosts can be in living or standing dead trees. Nests must be living.'),
    ],
  },
  {
    section: WILDLIFE, q: 'How do you recognise a pileated woodpecker NEST cavity?',
    a: ['Must be a living tree, larger than 40 cm.', '1 or more nest holes, not a natural hole.', 'The nest chamber is usually 75 cm deep but has a definite bottom (unlike a roost tree).'],
    test: [
      mc('How does a PWP nest differ from a PWP roost?', ['The nest chamber has a definite bottom', 'The nest has 5+ holes', 'The nest is in a dead tree', 'The nest hole is round and tiny'], 0, 'Nest chamber about 75 cm deep with a definite bottom; roosts are hollow.'),
      tf('A pileated woodpecker nest cavity must be in a living tree.', true, 'Living tree, over 40 cm, not a natural hole.'),
    ],
  },
  {
    section: WILDLIFE, q: 'How do you recognise an other-woodpecker nest cavity?',
    a: ['Must be a living tree.', 'Circular entrance (not oval), less than 10 cm across (golf ball size).', 'Smooth, clean edges; leads into a chamber, so it looks dark.'],
    test: [
      mc('An “other woodpecker” nest entrance is…', ['Oval and softball-sized', 'Circular and under 10 cm (golf ball size)', 'Rectangular with rough edges', 'At ground level'], 1, 'Circular, under 10 cm, smooth clean edges, dark inside.'),
    ],
  },
  {
    section: WILDLIFE, q: 'How do you recognise a natural nest or den cavity?',
    a: ['Formed by natural decay; must be a living tree.', 'Hollow chamber, not symmetrical, rimmed with callus tissue.', 'Active cavities often show gnawing on the callus.'],
    test: [
      mc('A cavity formed by decay, not symmetrical, rimmed with callus and showing gnawing is a…', ['Natural nest or den cavity', 'Feeding cavity', 'PWP roost', 'Escape cavity'], 0, 'Natural nest or den cavity (C1).'),
    ],
  },
  {
    section: WILDLIFE, q: 'What is an escape cavity (C2)?',
    a: ['Not ideal for nesting or denning, but gives wildlife temporary shelter.', 'E.g. a cavity at ground level, a hollow tree with a large open seam, or a cavity that faces up and collects rain.'],
    test: [
      multi('Which are examples of escape cavities?', ['A cavity at ground level', 'A hollow tree with a large open seam', 'A cavity facing up that collects rain', 'A round 5 cm hole with smooth edges'], [0, 1, 2], 'The round hole is an other-woodpecker nest.'),
    ],
  },
  {
    section: WILDLIFE, q: 'How do you recognise a woodpecker feeding cavity (C2)?',
    a: ['Made by pileated or other woodpeckers feeding; living tree.', 'Rectangular or irregular, with rough edges.', 'Doesn’t lead into a hollow chamber: you can see light-coloured wood at the back.', 'Sapsucker feeding holes are typically on He and By (also Bw, Mh, Mr).'],
    test: [
      mc('A rectangular hole with rough edges and light wood visible at the back is a…', ['Nest cavity', 'Roost cavity', 'Woodpecker feeding cavity', 'Natural den'], 2, 'Feeding cavities don’t lead into a hollow chamber.'),
      multi('Sapsucker feeding holes are typically found on…', ['Hemlock (He)', 'Yellow birch (By)', 'Jack pine (Pj)', 'Black spruce (Sb)'], [0, 1], 'He and By (also Bw, Mh, Mr).'),
    ],
  },
  {
    section: WILDLIFE, q: 'What makes a tree a “high potential to develop cavities” tree (C2)?',
    a: ['Evidence of heart rot', 'Rotten branch stubs', 'False tinder fungus', 'Large unhealed wounds', 'Greater than 25 cm DBH'],
    test: [
      multi('Select the signs of a tree with high potential to develop cavities.', ['Evidence of heart rot', 'Rotten branch stubs', 'False tinder fungus', 'Large unhealed wounds', 'White face scar'], [0, 1, 2, 3], 'Also greater than 25 cm DBH.'),
    ],
  },
  {
    section: WILDLIFE, q: 'What is a chicot, and why is it a special consideration?',
    a: ['A chicot is a snag (standing dead tree), used e.g. by chimney swifts.', 'For health and safety, it needs a tree-length reserve around it.'],
    test: [
      mc('A chicot is…', ['A snag (standing dead tree)', 'A young mast tree', 'A type of fungus', 'A woodpecker'], 0, 'A snag, used e.g. by chimney swifts.'),
      tf('For health and safety, a chicot needs a tree-length reserve around it.', true, 'Tree-length reserve for H&S.'),
    ],
  },
  {
    section: WILDLIFE, q: 'What is a mast tree?',
    a: [
      'A tree that produces fruit or nuts, providing food for wildlife.',
      'Any oak, beech, cherry, basswood, hickory, butternut or walnut at least 25 cm DBH, and any ironwood at least 10 cm DBH.',
    ],
    test: [
      typed('From what DBH (cm) does an ironwood count as a mast tree?', ['10'], 'Ironwood ≥ 10 cm; the other mast species ≥ 25 cm.'),
      tf('Sugar maple is a mast species.', false, 'Mast species: oaks, beech, cherry, hickory, basswood, walnut/butternut, ironwood.'),
    ],
  },
  {
    section: WILDLIFE, q: 'What makes a mast tree M1 or M2?',
    a: [
      'M1 (good mast tree): oak, beech, cherry, basswood, hickory, butternut or walnut, generally over 40 cm DBH, with a dominant (or codominant) crown position AND a large, well-rounded, vigorous crown.',
      'M2 (fair mast tree): the same species at least 25 cm DBH with a poor crown position and/or poor crown condition, or a young, small crown. Also any ironwood at least 10 cm DBH.',
    ],
    test: [
      mc('An M1 mast tree is generally over ___ with a dominant or codominant, vigorous crown.', ['10 cm DBH', '25 cm DBH', '40 cm DBH', '60 cm DBH'], 2, 'M1: generally over 40 cm DBH with a large, well-rounded, vigorous crown.'),
      mc('A red oak, 30 cm DBH, with a suppressed crown is…', ['M1', 'M2', 'C1', 'Not a mast tree'], 1, 'At least 25 cm but a poor crown position = M2.'),
    ],
  },
  {
    section: WILDLIFE, q: 'Rank the mast tree species in order of importance.',
    a: ['1. Red oak', '2. Other oaks (bur, white)', '3. Beech', '4. Black cherry', '5. Hickory', '6. Basswood', '7. Walnut or butternut', '8. Ironwood'],
    test: [
      order('Put the mast species in order of importance.', ['Red oak', 'Other oaks (bur, white)', 'Beech', 'Black cherry', 'Hickory', 'Basswood', 'Walnut or butternut', 'Ironwood'], 'Red oak first, ironwood last.'),
      mc('Which mast species is the most important?', ['Beech', 'Black cherry', 'Red oak', 'Basswood'], 2, 'Red oak.'),
    ],
  },
  {
    section: WILDLIFE, q: 'What makes a good mast tree?',
    a: [
      'Species, in order of importance (red oak first).',
      'Size: bigger is better. At least 25 cm DBH, ideally over 40 cm (ironwood at least 10 cm).',
      'Crown position and condition: dominant or codominant.',
      'Evidence of use: black bear claw marks, deer scrapes at the base.',
    ],
    test: [
      multi('Which are evidence that wildlife are using a mast tree?', ['Black bear claw marks', 'Deer scrapes at the base', 'Woodpecker holes', 'Lichen on the bark'], [0, 1], 'Bear claw marks and deer scrapes.'),
      mc('Mast tree crowns should ideally be…', ['Suppressed', 'Intermediate', 'Dominant or codominant', 'Dead'], 2, 'Dominant or codominant.'),
    ],
  },
];

const SORTS: SortDrill[] = [
  {
    id: 'biotic', title: 'Abiotic or biotic?', prompt: 'Living (infectious) or non-living (non-infectious)?',
    bins: ['Abiotic', 'Biotic'],
    items: [
      { label: 'Frost crack', bin: 'Abiotic' }, { label: 'Fire scar', bin: 'Abiotic' }, { label: 'Mechanical damage', bin: 'Abiotic' },
      { label: 'Broken branches', bin: 'Abiotic' }, { label: 'Artist’s conk', bin: 'Biotic' }, { label: 'Emerald ash borer', bin: 'Biotic' },
      { label: 'Deer browsing', bin: 'Biotic' }, { label: 'Dutch elm disease', bin: 'Biotic' },
    ],
  },
  {
    id: 'fungi', title: 'Which type of fungus?', prompt: 'Saprophytic, parasitic or mycorrhizal?',
    bins: ['Saprophytic', 'Parasitic', 'Mycorrhizal'],
    items: [
      { label: 'Feeds on dead trees', bin: 'Saprophytic' }, { label: 'Recycles nutrients / decomposes', bin: 'Saprophytic' },
      { label: 'Feeds on live tissue', bin: 'Parasitic' }, { label: 'Harms trees but creates cavities', bin: 'Parasitic' },
      { label: 'Attaches to roots, trades water & nutrients', bin: 'Mycorrhizal' }, { label: 'A “very good” fungus', bin: 'Mycorrhizal' },
    ],
  },
  {
    id: 'severity', title: 'Major, moderate or minor?', prompt: 'Rate each defect from the lectures.',
    bins: ['Major', 'Moderate', 'Minor'],
    items: [
      { label: 'Emerald ash borer', bin: 'Major' }, { label: 'Dutch elm disease', bin: 'Major' }, { label: 'Oak wilt', bin: 'Major' },
      { label: 'Fire scar (hardwood)', bin: 'Major' }, { label: 'Mossy top', bin: 'Moderate' }, { label: 'Black knot', bin: 'Moderate' },
      { label: 'Sunscald', bin: 'Moderate' }, { label: 'Tar spot', bin: 'Minor' }, { label: 'Leaf scorch', bin: 'Minor' },
      { label: 'Wolf tree', bin: 'Minor' }, { label: 'V-shaped fork', bin: 'Minor' },
    ],
  },
  {
    id: 'cavity', title: 'C1 or C2?', prompt: 'Good (C1) or fair (C2) cavity tree?',
    bins: ['C1', 'C2'],
    items: [
      { label: 'Pileated woodpecker roost cavity', bin: 'C1' }, { label: 'Pileated woodpecker nest cavity', bin: 'C1' },
      { label: 'Other woodpecker nest cavity', bin: 'C1' }, { label: 'Natural nest or den cavity', bin: 'C1' },
      { label: 'Escape cavity', bin: 'C2' }, { label: 'Woodpecker feeding cavity', bin: 'C2' }, { label: 'High potential to develop cavities', bin: 'C2' },
    ],
  },
  {
    id: 'mast', title: 'M1, M2 or not a mast tree?', prompt: 'Rate each tree.',
    bins: ['M1', 'M2', 'Not mast'],
    items: [
      { label: 'Red oak, 45 cm DBH, dominant, vigorous crown', bin: 'M1' },
      { label: 'Beech, 42 cm DBH, codominant, large round crown', bin: 'M1' },
      { label: 'Red oak, 30 cm DBH, suppressed crown', bin: 'M2' },
      { label: 'Basswood, 28 cm DBH, young small crown', bin: 'M2' },
      { label: 'Ironwood, 12 cm DBH', bin: 'M2' },
      { label: 'Black cherry, 18 cm DBH', bin: 'Not mast' },
      { label: 'Sugar maple, 50 cm DBH', bin: 'Not mast' },
    ],
  },
];

const RANKS: RankDrill[] = [
  {
    id: 'cavity-order', title: 'Cavity trees: order of priority', prompt: 'Highest retention priority at the top.',
    order: ['PWP roost cavity', 'PWP nest cavity', 'Other woodpecker nest / natural den', 'Escape cavity', 'Woodpecker feeding cavity', 'High potential to develop cavities'],
    explain: 'The first three are C1, the last three C2. PWP = pileated woodpecker.',
  },
  {
    id: 'mast-order', title: 'Mast species: order of importance', prompt: 'Most important at the top.',
    order: ['Red oak', 'Other oaks (bur, white)', 'Beech', 'Black cherry', 'Hickory', 'Basswood', 'Walnut or butternut', 'Ironwood'],
    explain: 'Red oak first; ironwood last (but it counts from 10 cm DBH).',
  },
];

export const FOREST_HEALTH: StudyGuide = {
  id: 'forest-health', sections: [BASICS, GRADING, OTHER, MARKING, WILDLIFE], allLabel: 'All topics',
  cards: CARDS, sorts: SORTS, ranks: RANKS,
};
