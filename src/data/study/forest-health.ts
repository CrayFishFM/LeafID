/**
 * Forest Health midterm review (FOR7322), from the midterm review list and the lectures: Intro to
 * Forest Health, Hardwood Defect Indicators, Other Hardwood Defects, and Wildlife Cavity and Mast
 * Trees (all summarised from the Ontario Tree Marking Guide).
 */
import { DEFECTS } from '@/data/topics/defects';
import type { Severity, Stock } from '@/data/topics/types';
import type { RankDrill, SortDrill, StudyCard, StudyGuide, TestQuestion } from './types';

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
  },
  {
    section: BASICS, q: 'What is the difference between abiotic and biotic conditions?',
    a: [
      'Abiotic = non-living (non-infectious). E.g. seams, cracks, mechanical damage, fire scars, broken branches. Mainly caused by weather (ice, snow, heat), fire and equipment/machinery. Found on the main stem, crown or roots.',
      'Biotic = living (infectious). E.g. insects, animals (squirrels, deer, forest techs…) and fungi. Caused by living things using or eating the tree. Found on leaves/needles, inside the stem or branches, or in the roots.',
    ],
  },
  {
    section: BASICS, q: 'What are the parts of a fungus?',
    a: [
      'Fruitbody (fruiting body): the mushroom or conk you see, which releases spores.',
      'Spores: tiny “seeds” that spread the fungus.',
      'Hyphae: thread-like strands that feed and grow in the wood or soil. A mass of hyphae is the mycelium.',
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
  },
  {
    section: BASICS, q: 'What are the 3 types of fungi?',
    a: [
      'Saprophytic: feed on dead plant tissue (dead trees or dead parts of trees). They recycle nutrients and decompose material.',
      'Parasitic: feed on live tissue. They harm trees but also create cavities. Most important for this course.',
      'Mycorrhizal (symbiotic): help trees grow. The mycelium attaches to tree roots and exchanges water and nutrients. A “very good” fungus.',
    ],
  },
  {
    section: BASICS, q: 'Do lichen, algae and moss harm trees?',
    a: [
      'No. They live on the bark without harming the tree, so no control is needed.',
      'Lichen is a fungus and an alga living together (symbiosis). Moss doesn’t only grow on the north side: algae and moss grow on any moist, shady site.',
    ],
  },
  { section: BASICS, q: 'What does CFSA stand for?', a: ['Crown Forest Sustainability Act.'] },

  // ---- AGS, UGS & defects ----
  {
    section: GRADING, q: 'Define AGS.',
    a: [
      'Acceptable Growing Stock.',
      'Its form and appearance suggest it can reasonably be expected to maintain and/or improve its quality.',
      'Expected to contribute significantly to future crops as vigorous, high-quality stems (likely to keep growing for another ~20 years).',
    ],
  },
  {
    section: GRADING, q: 'Define UGS.',
    a: [
      'Unacceptable Growing Stock.',
      'High risk: expected to decline during the next cutting cycle (likely to die in the next 20–25 years), so it can be harvested.',
      'May also be of poor form and/or low quality and can’t reasonably be expected to improve.',
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
  },
  { section: GRADING, q: 'Name the major defects (always UGS).', a: names('major') },
  { section: GRADING, q: 'Name the moderate defects.', a: names('moderate') },
  { section: GRADING, q: 'Name the minor defects (always AGS).', a: names('minor') },
  {
    section: GRADING, q: 'Classify from major to minor: sugar maple borer, burl and spine tooth fungus.',
    a: ['Spine tooth fungus: major (UGS).', 'Sugar maple borer: moderate.', 'Burl: minor (AGS).'],
  },
  {
    section: GRADING, q: 'When is a dark face scar major, and when is it moderate?',
    a: ['Larger than 900 cm²: major (UGS).', 'Smaller than 900 cm²: moderate.', '900 cm² is 30 cm × 30 cm, a little bigger than a sheet of paper.'],
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
  },
  {
    section: GRADING, extra: true, q: 'What are the crown position classes?',
    a: ['D = Dominant', 'C = Codominant', 'I = Intermediate', 'S = Suppressed', 'Crown position, size and quality (plus bark characteristics) indicate a tree’s potential vigour.'],
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
  },
  {
    section: OTHER, q: 'What are the 3 phases of beech bark disease?',
    a: [
      'Advancing front: the scale insect arrives and multiplies; little change yet, but the stand becomes open to the fungus.',
      'Killing front: high scale densities and severe fungus attack; large beech reach 50–85% mortality within 10 years.',
      'Aftermath forest: stands that survived the first wave. Root suckers from attacked trees choke out maple and birch regeneration and get infected in turn.',
    ],
  },
  {
    section: OTHER, q: 'How does BBD spread, and how is it controlled?',
    a: [
      'Scale insects spread by wind, animals and people moving beech wood with bark on. Fungal spores spread by wind and rain splash.',
      'Don’t move firewood. Keep resistant beech (no signs of scale) when managing forests.',
      'Impacts: lower beech wood quality, a lost mast (beechnut) food source, e.g. for black bears, and heavy beech understory that blocks sugar maple regeneration.',
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
  },
  {
    section: OTHER, q: 'What is oak wilt, and how is it rated?',
    a: [
      'A fungal vascular disease spread mainly through root grafts, and by sap beetles attracted to fresh wounds.',
      'Red oak group: sudden wilting and leaf drop from the top down; trees die within 3–6 weeks. The white oak group is less affected.',
      'Control: don’t prune oaks in spring or early summer, trench around infected trees, remove infected trees and wood.',
      'Major defect, UGS.',
    ],
  },
  {
    section: OTHER, q: 'What is tar spot, and how is it rated?',
    a: ['A fungus (Rhytisma spp.) that makes black spots on maple leaves: red, hard, silver and Manitoba maple.', 'It overwinters in fallen leaves, so removing leaf debris in the fall helps.', 'Minor defect, AGS.'],
  },
  { section: OTHER, q: 'How are frost damage and leaf scorch rated?', a: ['Minor defects, AGS.'] },
  {
    section: OTHER, q: 'Which other (anthropogenic and form) defects are minor / AGS?',
    a: ['Tree absorption of objects (CODIT)', 'U-shaped and V-shaped forks', 'Wind or ice damage to the crown', 'Wolf tree', 'Stilted roots are also shown in the lecture, with no rating.'],
  },
  {
    section: OTHER, q: 'What are the signs of insect damage on a tree?',
    a: ['Leaf discolouration', 'Branch dieback', 'Exit holes', 'Egg masses', 'Frass (wood shavings)', 'Running sap', 'More woodpecker activity', 'Noticeable insect populations'],
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
  },
  {
    section: MARKING, q: 'Who has to mark trees on Crown land?',
    a: [
      'A certified tree marker.',
      'Selection harvests must be tree marked. Shelterwood harvests must be marked too, except final removal cuts.',
      'All marked trees are removed as per the CFSA.',
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
  },
  {
    section: WILDLIFE, q: 'What is a cavity tree? What makes it C1 or C2?',
    a: [
      'Any tree at least 25 cm DBH that contains a cavity.',
      'C1 (good cavity tree): at least 25 cm DBH with a pileated woodpecker roost cavity, pileated woodpecker nest cavity, other woodpecker nest cavity, or natural nest or den cavity (the 4 top-rated cavities).',
      'C2 (fair cavity tree): at least 25 cm DBH with an escape cavity, or a feeding cavity on the bole or major branches.',
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
  },
  {
    section: WILDLIFE, q: 'How do you recognise a pileated woodpecker ROOST cavity?',
    a: ['Living or standing dead tree, larger than 40 cm.', 'Hollow, with 2 or more excavated holes.', 'Oval entrance 7.5–10 cm wide × 10–12.5 cm tall (softball size) with smooth edges.', 'Leads into a hollow chamber.'],
  },
  {
    section: WILDLIFE, q: 'How do you recognise a pileated woodpecker NEST cavity?',
    a: ['Must be a living tree, larger than 40 cm.', '1 or more nest holes, not a natural hole.', 'The nest chamber is usually 75 cm deep but has a definite bottom (unlike a roost tree).'],
  },
  {
    section: WILDLIFE, q: 'How do you recognise an other-woodpecker nest cavity?',
    a: ['Must be a living tree.', 'Circular entrance (not oval), less than 10 cm across (golf ball size).', 'Smooth, clean edges; leads into a chamber, so it looks dark.'],
  },
  {
    section: WILDLIFE, q: 'How do you recognise a natural nest or den cavity?',
    a: ['Formed by natural decay; must be a living tree.', 'Hollow chamber, not symmetrical, rimmed with callus tissue.', 'Active cavities often show gnawing on the callus.'],
  },
  {
    section: WILDLIFE, q: 'What is an escape cavity (C2)?',
    a: ['Not ideal for nesting or denning, but gives wildlife temporary shelter.', 'E.g. a cavity at ground level, a hollow tree with a large open seam, or a cavity that faces up and collects rain.'],
  },
  {
    section: WILDLIFE, q: 'How do you recognise a woodpecker feeding cavity (C2)?',
    a: ['Made by pileated or other woodpeckers feeding; living tree.', 'Rectangular or irregular, with rough edges.', 'Doesn’t lead into a hollow chamber: you can see light-coloured wood at the back.', 'Sapsucker feeding holes are typically on He and By (also Bw, Mh, Mr).'],
  },
  {
    section: WILDLIFE, q: 'What makes a tree a “high potential to develop cavities” tree (C2)?',
    a: ['Evidence of heart rot', 'Rotten branch stubs', 'False tinder fungus', 'Large unhealed wounds', 'Greater than 25 cm DBH'],
  },
  {
    section: WILDLIFE, q: 'What is a chicot, and why is it a special consideration?',
    a: ['A chicot is a snag (standing dead tree), used e.g. by chimney swifts.', 'For health and safety, it needs a tree-length reserve around it.'],
  },
  {
    section: WILDLIFE, q: 'What is a mast tree?',
    a: [
      'A tree that produces fruit or nuts, providing food for wildlife.',
      'Any oak, beech, cherry, basswood, hickory, butternut or walnut at least 25 cm DBH, and any ironwood at least 10 cm DBH.',
    ],
  },
  {
    section: WILDLIFE, q: 'What makes a mast tree M1 or M2?',
    a: [
      'M1 (good mast tree): oak, beech, cherry, basswood, hickory, butternut or walnut, generally over 40 cm DBH, with a dominant (or codominant) crown position AND a large, well-rounded, vigorous crown.',
      'M2 (fair mast tree): the same species at least 25 cm DBH with a poor crown position and/or poor crown condition, or a young, small crown. Also any ironwood at least 10 cm DBH.',
    ],
  },
  {
    section: WILDLIFE, q: 'Rank the mast tree species in order of importance.',
    a: ['1. Red oak', '2. Other oaks (bur, white)', '3. Beech', '4. Black cherry', '5. Hickory', '6. Basswood', '7. Walnut or butternut', '8. Ironwood'],
  },
  {
    section: WILDLIFE, q: 'What makes a good mast tree?',
    a: [
      'Species, in order of importance (red oak first).',
      'Size: bigger is better. At least 25 cm DBH, ideally over 40 cm (ironwood at least 10 cm).',
      'Crown position and condition: dominant or codominant.',
      'Evidence of use: black bear claw marks, deer scrapes at the base.',
    ],
  },
];

const TEST: TestQuestion[] = [
  { q: 'Forest pathology is the study of…', choices: ['Forest insects', 'Tree disease', 'Forest soils', 'Tree growth'], answer: 1, why: 'Pathology = tree disease. Entomology = forest insects.' },
  { q: 'Which of these is an abiotic condition?', choices: ['Fungi', 'Insects', 'Frost crack', 'Deer browsing'], answer: 2, why: 'Abiotic = non-living, e.g. seams, cracks, fire scars, mechanical damage.' },
  { q: 'Which type of fungus feeds on live tissue?', choices: ['Saprophytic', 'Parasitic', 'Mycorrhizal', 'Lichen'], answer: 1, why: 'Parasitic fungi feed on live tissue; saprophytic feed on dead tissue.' },
  { q: 'Which type of fungus helps trees grow?', choices: ['Saprophytic', 'Parasitic', 'Mycorrhizal', 'Spine tooth'], answer: 2, why: 'Mycorrhizal (symbiotic) fungi attach to roots and exchange water and nutrients.' },
  { q: 'The thread-like strands of a fungus are called…', choices: ['Spores', 'Hyphae', 'Conks', 'Gills'], answer: 1, why: 'Hyphae; a mass of hyphae is the mycelium.' },
  { q: 'Do lichens kill trees?', choices: ['Yes, slowly', 'Only on birch', 'No, they are harmless', 'Only in shade'], answer: 2, why: 'Lichen, algae and moss live on the bark without harming the tree.' },
  { q: 'A major defect means the tree is…', choices: ['Always AGS', 'Always UGS', 'AGS or UGS', 'Not rated'], answer: 1, why: 'Major = always UGS. Minor = always AGS. Moderate can go either way.' },
  { q: 'Order from major to minor: burl, spine tooth fungus, sugar maple borer.', choices: ['Burl, sugar maple borer, spine tooth', 'Spine tooth, sugar maple borer, burl', 'Sugar maple borer, spine tooth, burl', 'Spine tooth, burl, sugar maple borer'], answer: 1, why: 'Spine tooth = major, sugar maple borer = moderate, burl = minor.' },
  { q: 'A dark face scar of 1,200 cm² is…', choices: ['Minor', 'Moderate', 'Major', 'Not a defect'], answer: 2, why: 'Over 900 cm² (30 × 30 cm) = major; under 900 cm² = moderate.' },
  { q: 'Mossy top is a ___ defect.', choices: ['Minor, always AGS', 'Moderate, always UGS', 'Major, always UGS', 'Moderate, either way'], answer: 1, why: 'The lecture lists it as moderate, but always UGS.' },
  { q: 'Black knot becomes UGS when it affects more than…', choices: ['10% of the crown', '25% of the crown', '50% of the crown', 'Any of the crown'], answer: 2, why: 'Black knot (mainly on cherry) is UGS over 50% of the crown.' },
  { q: 'A beech with beech scale insects only (no fungus) is…', choices: ['UGS', 'Not UGS', 'A cavity tree', 'Always cut'], answer: 1, why: 'Beech bark disease is only UGS once the fungus is there, not for scale alone.' },
  { q: 'Which is a MINOR defect?', choices: ['Lean > 10°', 'Sunscald', 'Epicormic branching', 'Black bark'], answer: 2, why: 'Epicormic branching, burl, crook, sweep and white face scar are minor.' },
  { q: 'Which is a MODERATE defect?', choices: ['Artist’s conk', 'Spiral seam', 'Crook', 'Butt flare'], answer: 1, why: 'Seams (spiral, frost crack, fluxing) are moderate.' },
  { q: 'Tar spot on maple is…', choices: ['Major, UGS', 'Moderate', 'Minor, AGS', 'Not a defect'], answer: 2, why: 'Tar spot, frost damage and leaf scorch are minor / AGS.' },
  { q: 'Dutch elm disease is spread mainly by…', choices: ['Wind-blown spores only', 'Elm bark beetles and root grafts', 'Woodpeckers', 'Sap beetles in fall'], answer: 1, why: 'Elm bark beetles carry the spores; it also spreads through root grafts.' },
  { q: 'Oak wilt kills red oak group trees within about…', choices: ['3–6 weeks', '1–3 years', '10 years', 'It doesn’t kill them'], answer: 0, why: 'Red oak group trees defoliate and die within 3–6 weeks of wilting.' },
  { q: 'When should you avoid pruning oaks, because of oak wilt?', choices: ['Late fall', 'Winter', 'Spring and early summer', 'Never prune oaks'], answer: 2, why: 'Fresh wounds in spring/early summer attract sap beetles that spread the fungus.' },
  { q: 'Emerald ash borer is native to…', choices: ['Europe', 'Asia', 'South America', 'Ontario'], answer: 1, why: 'EAB is native to Asia; mortality of infested ash is nearly 100%.' },
  { q: 'About how many infected beech die within 10 years of beech bark disease?', choices: ['5–10%', '20–30%', '50–85%', '100%'], answer: 2, why: '50–85% within 10 years.' },
  { q: 'Which cavity has the highest retention priority?', choices: ['Escape cavity', 'Pileated woodpecker nest cavity', 'Pileated woodpecker roost cavity', 'Natural den cavity'], answer: 2, why: 'PWP roost cavity is #1, then PWP nest, then other woodpecker nest / natural den.' },
  { q: 'An escape cavity is rated…', choices: ['C1', 'C2', 'M1', 'M2'], answer: 1, why: 'Escape, feeding and high-potential cavities are C2.' },
  { q: 'A cavity tree must be at least…', choices: ['10 cm DBH', '25 cm DBH', '40 cm DBH', '50 cm DBH'], answer: 1, why: 'Any tree at least 25 cm DBH with a cavity.' },
  { q: 'A round entrance hole under 10 cm (golf ball size) with smooth edges, dark inside, on a living tree is a…', choices: ['PWP roost cavity', 'Other woodpecker nest cavity', 'Feeding cavity', 'Escape cavity'], answer: 1, why: 'Other woodpecker nests are circular and under 10 cm; pileated holes are oval.' },
  { q: 'A rectangular hole with rough edges and light wood visible at the back is a…', choices: ['Nest cavity', 'Roost cavity', 'Woodpecker feeding cavity', 'Natural den'], answer: 2, why: 'Feeding cavities don’t lead into a hollow chamber.' },
  { q: 'Which mast species is the most important?', choices: ['Beech', 'Black cherry', 'Red oak', 'Basswood'], answer: 2, why: 'Red oak, then other oaks, beech, black cherry, hickory, basswood, walnut/butternut, ironwood.' },
  { q: 'An M1 mast tree is generally over ___ with a dominant or codominant, vigorous crown.', choices: ['10 cm DBH', '25 cm DBH', '40 cm DBH', '60 cm DBH'], answer: 2, why: 'M1: generally over 40 cm DBH. M2: at least 25 cm with a poorer crown.' },
  { q: 'Ironwood counts as a mast tree from…', choices: ['5 cm DBH', '10 cm DBH', '25 cm DBH', 'It never does'], answer: 1, why: 'Ironwood at least 10 cm DBH (an M2).' },
  { q: 'Evidence that a mast tree is being used includes…', choices: ['Woodpecker holes', 'Black bear claw marks', 'Lichen', 'Epicormic branches'], answer: 1, why: 'Bear claw marks and deer scrapes at the base.' },
  { q: 'On Crown land, tree marking is required by…', choices: ['The CFSA', 'The CFIA', 'The OBM', 'The FRI'], answer: 0, why: 'The Crown Forest Sustainability Act.' },
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
  cards: CARDS, test: TEST, sorts: SORTS, ranks: RANKS,
};
