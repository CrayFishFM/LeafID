/**
 * Wildlife midterm review (FOR7316), from the midterm review list and the lectures: Course Intro and
 * Freshwater Habitats, CFSA and SSG, Federal Law and Forestry, Aquatic AOC, Water Birds, and
 * Amphibians and Reptiles (mostly summarised from the Stand and Site Guide and the Ontario SAR pages).
 */
import { mc, multi, order, tf, typed, type RankDrill, type SortDrill, type StudyCard, type StudyGuide } from './types';

const LAW = 'Acts & guides';
const WATER = 'Freshwater habitats';
const AOC = 'Aquatic AOCs';
const BIRDS = 'Water birds';
const HERPS = 'Reptiles & amphibians';

const CARDS: StudyCard[] = [
  // ---- Acts & guides ----
  {
    section: LAW, q: 'Define and describe the CFSA.',
    a: [
      'Crown Forest Sustainability Act (1994): a comprehensive system of legislation, regulations, policies, standards and guides that ensures sustainable forestry practices.',
      'It assures that: a forest management plan (FMP) is in place; there is a comprehensive compliance program; an independent forest audit is done every 5 years; and there is public reporting on all aspects of forest management.',
      'Before any forestry can happen, an FMP must be prepared by a registered professional forester (RPF) and a Sustainable Forest Licence (SFL) must be issued.',
      'Close to 90% of Ontario forests are Crown land; 44% of that is managed forest.',
    ],
    test: [
      typed('What year was the Crown Forest Sustainability Act passed?', ['1994'], 'CFSA (1994).'),
      mc('Under the CFSA, an independent forest audit is done every…', ['1 year', '5 years', '10 years', '20 years'], 1, 'Every 5 years.'),
      multi('Which does the CFSA assure?', ['A forest management plan is in place', 'A compliance program', 'An independent audit every 5 years', 'Public reporting', 'No harvesting on Crown land'], [0, 1, 2, 3], 'FMP, compliance, 5-year audit, public reporting.'),
      mc('Before forestry starts, an FMP must be prepared by a(n)…', ['Compliance inspector', 'Registered professional forester (RPF)', 'MNRF biologist', 'Tree marker'], 1, 'An RPF prepares the FMP, and a Sustainable Forest Licence (SFL) must be issued.'),
      mc('About how much of Ontario’s forest is Crown (public) land?', ['25%', '44%', '75%', 'Close to 90%'], 3, 'Close to 90%; 44% of that Crown land is managed forest.'),
    ],
  },
  {
    section: LAW, q: 'Define and describe the SSG.',
    a: [
      'The Forest Management Guide for Conserving Biodiversity at the Stand and Site Scales (Stand and Site Guide, OMNRF 2010).',
      'A legally binding regulatory document in Ontario: forest managers MUST follow it in ALL types of forestry operations.',
      'Main objective: keep biodiversity in the stand, so the wildlife component is maintained or enhanced.',
      'It directs how to modify operations to retain decaying trees and fallen logs, protect sensitive habitats (bird nests, woodland pools) and conserve water and soil.',
      'It holds wildlife direction written by MNRF biologists: timing restrictions, AOC sizes and locations, and how to limit the impacts of roads, stream crossings, hauling and road maintenance. Foresters use it to set the AOCs in an FMP.',
    ],
    test: [
      tf('The Stand and Site Guide is only a recommendation; following it is optional.', false, 'It is legally binding: forest managers must follow it during all forestry operations.'),
      mc('The primary objective of the SSG is to…', ['Maximise timber volume', 'Keep biodiversity in the stand and maintain or enhance wildlife', 'Set stumpage rates', 'Licence forest companies'], 1, 'Keep biodiversity in the stand; maintain or enhance the wildlife component.'),
      multi('Which does the SSG give direction on?', ['Retaining decaying trees and fallen logs', 'Protecting bird nests and woodland pools', 'Conserving water and soil', 'Timing restrictions and AOC sizes', 'Lumber prices'], [0, 1, 2, 3], 'Everything except prices.'),
    ],
  },
  {
    section: LAW, q: 'Define and describe an AOC.',
    a: [
      'AOC = Area of Concern: a buffer applied around a value (water body, nest, etc.) to keep forest operations from damaging it.',
      'An AOC is either a reserve (no operations allowed) or modified (operations allowed under timing restrictions and/or site conditions, e.g. seasonal).',
      'The type of AOC depends on the management objective for the water body AND the silvicultural system.',
    ],
    test: [
      typed('What does AOC stand for?', ['area of concern', 'areas of concern'], 'Area Of Concern.'),
      mc('An AOC where no operations are allowed is a…', ['Modified AOC', 'Reserve', 'Residual forest', 'Filter strip'], 1, 'Reserve = no operations. Modified = operations under timing and/or site restrictions.'),
      mc('A “modified” AOC means…', ['No operations at all', 'Operations allowed with timing and/or site-condition restrictions', 'Clearcutting only', 'Herbicide only'], 1, 'E.g. seasonal restrictions.'),
      typed('PSW stands for Provincially Significant ____.', ['wetland', 'wetlands'], 'Provincially Significant Wetlands.'),
    ],
  },
  {
    section: LAW, q: 'Define and describe the Fisheries Act and how it pertains to forestry.',
    a: [
      'The Fisheries Act (1985) is federal law, administered by the Department of Fisheries and Oceans (DFO).',
      'Section 35(1): prohibits any “work or undertaking that results in the harmful alteration, disruption or destruction of fish habitat” (HADD).',
      'Section 36(3): “no person shall deposit or permit the deposit of a deleterious (harmful) substance of any type in water frequented by fish”.',
      'In forestry: buffers (AOCs) are left around water, logging debris and sediment are kept out of the water, fuel is kept away, and stream crossings follow timing windows.',
    ],
    test: [
      mc('The Fisheries Act is…', ['Provincial law', 'Federal law', 'A municipal bylaw', 'A forest management guide'], 1, 'Federal law (1985), administered by DFO.'),
      mc('Which section prohibits the harmful alteration, disruption or destruction of fish habitat?', ['Section 35(1)', 'Section 36(3)', 'Section 12', 'Section 4.1'], 0, '35(1) = habitat (HADD). 36(3) = deleterious substances.'),
      mc('Section 36(3) prohibits…', ['Fishing without a licence', 'Depositing a deleterious substance in water frequented by fish', 'Building roads', 'Harvesting near nests'], 1, 'Deleterious = harmful.'),
      typed('Which federal department is responsible for the Fisheries Act? (abbreviation)', ['dfo', 'department of fisheries and oceans', 'fisheries and oceans canada'], 'DFO: Department of Fisheries and Oceans.'),
    ],
  },
  {
    section: LAW, q: 'Know the different acts used for AOC and FMP planning.',
    a: [
      'Wild Animal and Plant Protection and Regulation of International and Interprovincial Trade Act (WAPPRIITA): controls trade of wild animals and plants across provincial and international borders (e.g. American ginseng).',
      'Migratory Birds Convention Act (MBCA): protects migratory birds, their eggs and nests (e.g. Kirtland’s warbler).',
      'Fisheries Act: protects fish and fish habitat (e.g. lake sturgeon).',
      'Species at Risk Act (SARA): protects listed species at risk and their critical habitat (e.g. Blanding’s turtle, wolverine, five-lined skink).',
      'Provincially: the CFSA, with the SSG giving the AOC direction.',
    ],
    check: 'The lecture lists the four acts and the example species beside them; what each act does (WAPPRIITA, MBCA) and which species goes with which act are filled in from general knowledge.',
    test: [
      multi('Which federal acts govern forest management planning?', ['Wild Animal and Plant Protection and Regulation of International and Interprovincial Trade Act', 'Migratory Birds Convention Act', 'Fisheries Act', 'Species at Risk Act', 'Highway Traffic Act'], [0, 1, 2, 3], 'The four acts from the Federal Law lecture.'),
      typed('MBCA stands for the Migratory Birds ____ Act.', ['convention'], 'Migratory Birds Convention Act.'),
    ],
  },
  {
    section: LAW, q: 'Species at Risk Act: what is it, and what are the 4 levels?',
    a: [
      'SARA was proclaimed in June 2003. It gives legal protection to wildlife species and conserves biological diversity, aims to prevent extinction and secure recovery. It protects all listed species at risk and their critical habitat, and applies to federal (Crown) lands.',
      'It establishes COSEWIC (an independent expert panel that assesses species), requires recovery strategies and action plans, creates prohibitions to protect threatened and endangered species, and creates a public registry.',
      'Endangered (END): facing imminent extirpation or extinction.',
      'Threatened (THR): likely to become endangered if nothing is done.',
      'Special Concern (SC): may become threatened or endangered because of biological characteristics and identified threats.',
      'Not at Risk (NAR): evaluated and found not at risk.',
      'Extinct = gone everywhere. Extirpated = no longer exists in a specific region. Federal status comes from COSEWIC; Ontario status from the SARO list.',
    ],
    test: [
      order('Put the SARA levels in order, most at risk first.', ['Endangered', 'Threatened', 'Special Concern', 'Not at Risk'], 'END → THR → SC → NAR.'),
      mc('A species likely to become endangered if nothing is done is…', ['Special Concern', 'Threatened', 'Endangered', 'Extirpated'], 1, 'Threatened.'),
      mc('A species facing imminent extirpation or extinction is…', ['Endangered', 'Threatened', 'Special Concern', 'Not at Risk'], 0, 'Endangered.'),
      mc('A species that no longer exists in a specific region (but lives elsewhere) is…', ['Extinct', 'Extirpated', 'Endangered', 'Not at Risk'], 1, 'Extirpated = gone from a region. Extinct = gone everywhere.'),
      typed('What year was SARA proclaimed?', ['2003'], 'June 2003.'),
      mc('The federal status of a species is set by…', ['SARO', 'COSEWIC', 'DFO', 'The SSG'], 1, 'COSEWIC (federal). SARO = Species at Risk in Ontario list (provincial).'),
    ],
  },

  // ---- Freshwater habitats ----
  {
    section: WATER, q: 'Lake temperature classifications: coldwater vs coolwater vs warmwater.',
    a: [
      'Coldwater: best adapted to / prefers water below 19°C in summer (e.g. brook trout, lake trout).',
      'Coolwater: 19–25°C in summer (e.g. northern pike, walleye).',
      'Warmwater: above 25°C in summer.',
      'In the SSG: lakes and some ponds with coldwater fish or SAR are High Potential Sensitivity (HPS); coolwater ponds are Moderate (MPS); warmwater ponds are Low (LPS).',
    ],
    test: [
      mc('Coldwater species prefer summer water temperatures…', ['Below 19°C', '19–25°C', 'Above 25°C', 'Below 10°C'], 0, 'Coldwater < 19°C, coolwater 19–25°C, warmwater > 25°C.'),
      mc('Coolwater species prefer…', ['Below 19°C', '19–25°C', 'Above 25°C', 'Above 30°C'], 1, '19–25°C.'),
      mc('Northern pike and walleye are…', ['Coldwater', 'Coolwater', 'Warmwater', 'Saltwater'], 1, 'Coolwater (MPS ponds).'),
      mc('A pond with brook trout would be rated…', ['High Potential Sensitivity', 'Moderate Potential Sensitivity', 'Low Potential Sensitivity', 'Not sensitive'], 0, 'Coldwater species = HPS.'),
      mc('A warmwater pond is…', ['HPS', 'MPS', 'LPS', 'A PSW'], 2, 'Low Potential Sensitivity.'),
    ],
  },
  {
    section: WATER, q: 'Why are coldwater species sensitive to water temperature and disturbance?',
    a: [
      'Less tolerant of high water temperature.',
      'Less tolerant of temperature fluctuations.',
      'Less tolerant of low oxygen levels.',
      'Critical spawning bed conditions: they need gravel and a high rate of gas exchange for the eggs.',
      'They spawn in autumn and the eggs and fry develop over a long time, so there is more time for problems.',
    ],
    test: [
      multi('Why are coldwater species sensitive to disturbance?', ['Less tolerant of high water temperature', 'Less tolerant of temperature fluctuations', 'Less tolerant of low oxygen', 'Need gravel spawning beds with high gas exchange', 'They spawn in spring and hatch in days'], [0, 1, 2, 3], 'They spawn in AUTUMN and eggs develop over a long time.'),
      mc('When do coldwater fish spawn?', ['Spring', 'Summer', 'Autumn', 'Winter'], 2, 'Autumn; eggs sit on the spawning beds all winter and hatch in spring.'),
      mc('Coldwater species need spawning beds of…', ['Mud', 'Sand', 'Gravel', 'Aquatic plants'], 2, 'Gravel, with a high rate of gas exchange for the eggs. Silt can smother them.'),
    ],
  },
  {
    section: WATER, q: 'Define fish habitat and riparian areas.',
    a: [
      'Fish habitat: the resources and conditions essential for the production of fish, including water quality and quantity, spawning grounds, nursery, rearing, food supply and migration areas on which fish depend, directly or indirectly, for their life processes.',
      'Riparian zone: the area where the land and the water meet; a transition zone containing elements of both upland and aquatic ecosystems.',
    ],
    test: [
      mc('The area where land and water meet is the…', ['Littoral zone', 'Riparian zone', 'Benthic zone', 'Profundal zone'], 1, 'Riparian zone: a transition between upland and aquatic ecosystems.'),
      multi('Which are part of fish habitat?', ['Spawning grounds', 'Nursery and rearing areas', 'Food supply', 'Migration areas', 'Upland hardwood ridges'], [0, 1, 2, 3], 'Spawning, nursery, rearing, food supply and migration areas.'),
    ],
  },
  {
    section: WATER, q: 'Define and describe the four lake zones.',
    a: [
      'Littoral: the shore area, from dry land (riparian zone) sloping into open water. Narrow in oligotrophic (young, steep-sided) lakes; wide in eutrophic (old, gently sloping) lakes.',
      'Limnetic: the sunlit open water surrounded by the littoral zone, down as far as sunlight penetrates. Phytoplankton, zooplankton and fish; most photosynthesis happens here.',
      'Profundal: deep water beyond sunlight penetration; colder and denser, no photosynthesis, so low oxygen.',
      'Benthic: the very bottom of the lake; decomposers and insect larvae living with the substrate, which holds the nutrients.',
    ],
    test: [
      mc('Where does most photosynthesis in a lake happen?', ['Littoral zone', 'Limnetic zone', 'Profundal zone', 'Benthic zone'], 1, 'The limnetic zone: sunlit open water with phytoplankton.'),
      mc('Which zone is beyond the reach of sunlight, cold and low in oxygen?', ['Littoral', 'Limnetic', 'Profundal', 'Riparian'], 2, 'Profundal.'),
      mc('The very bottom of the lake, inhabited mainly by decomposers and insect larvae, is the…', ['Benthic zone', 'Profundal zone', 'Limnetic zone', 'Thermocline'], 0, 'Benthic.'),
      mc('The shore area sloping from dry land into the open water is the…', ['Limnetic zone', 'Littoral zone', 'Benthic zone', 'Hypolimnion'], 1, 'Littoral.'),
      tf('Eutrophic (old) lakes have narrow littoral zones.', false, 'Eutrophic lakes have WIDE littoral zones (gentle slopes); oligotrophic (young) lakes have narrow ones (steep sides).'),
    ],
  },
  {
    section: WATER, q: 'What is thermal stratification, and what are the three layers?',
    a: [
      'Thermal stratification: the change of temperature at different depths in a lake. Cold water is denser, so it sits at the bottom.',
      '1. Epilimnion: top, warmest, least dense.',
      '2. Thermocline: middle, where temperature changes quickly.',
      '3. Hypolimnion: bottom, coldest, densest.',
    ],
    extra: true,
    test: [
      order('Put the lake layers in order from the surface down.', ['Epilimnion', 'Thermocline', 'Hypolimnion'], 'Epilimnion (warmest) → thermocline → hypolimnion (coldest).'),
      mc('The coldest, densest layer of a stratified lake is the…', ['Epilimnion', 'Thermocline', 'Hypolimnion', 'Limnetic zone'], 2, 'Hypolimnion.'),
    ],
  },
  {
    section: WATER, q: 'What is seasonal turnover?',
    a: [
      'Lake turnover is the seasonal mixing of the entire water column.',
      'In lakes deeper than about 6 m, stratified layers form in summer (warm, less dense water on top of cold, dense water), which stops the lake mixing and aerating.',
      'When the air cools, the layering weakens; once temperatures equalise through the water column, the lake mixes: bottom water rises and top water sinks.',
      'This replenishes oxygen and distributes nutrients throughout the lake.',
    ],
    test: [
      mc('Seasonal turnover is…', ['Algae dying off in fall', 'The seasonal mixing of the entire water column', 'Fish moving to deeper water', 'Ice forming on the lake'], 1, 'Mixing of the whole water column once temperatures equalise.'),
      multi('What does turnover do for the lake?', ['Replenishes oxygen', 'Distributes nutrients', 'Raises the water level', 'Stops eutrophication'], [0, 1], 'Oxygen and nutrients get mixed through the lake.'),
      tf('Turnover happens when the water temperature becomes the same throughout the water column.', true, 'Once temperatures equalise, the layers no longer resist mixing.'),
      typed('Distinct summer layers usually form in lakes deeper than about how many metres?', ['6', '6 m', '6m'], 'About 6 m.'),
    ],
  },
  {
    section: WATER, q: 'What is lake eutrophication?',
    a: [
      'Eutrophication: a lake receives TOO MANY nutrients (phosphorus and nitrogen) and sediment from its watershed and becomes more fertile and shallower.',
      'More nutrients feed algae and fish, so a more eutrophic lake sustains more living things; as it gets shallower the littoral area grows and even more plants grow.',
      'It is a natural process over hundreds to thousands of years. Humans speed it up by adding nutrients and sediment quickly: cultural eutrophication.',
      'It can be slowed by reducing inputs of nutrients (especially phosphorus) and sediment.',
    ],
    test: [
      multi('Which nutrients drive eutrophication?', ['Phosphorus', 'Nitrogen', 'Oxygen', 'Carbon dioxide'], [0, 1], 'Phosphorus and nitrogen, plus sediment.'),
      typed('Eutrophication sped up by humans is called ____ eutrophication.', ['cultural'], 'Cultural eutrophication.'),
      tf('Eutrophication is a natural process that normally takes hundreds to thousands of years.', true, 'Humans speed it up (cultural eutrophication).'),
      mc('As a lake becomes eutrophic it becomes…', ['Deeper and less fertile', 'Shallower and more fertile', 'Colder and clearer', 'Saltier'], 1, 'More fertile and shallower.'),
    ],
  },
  {
    section: WATER, q: 'SSG definitions: lakes, ponds, and the types of streams.',
    a: [
      'Lake: open water at least 8 ha and at some point > 2 m deep. Small < 100 ha, medium 100–999 ha, large ≥ 1000 ha.',
      'Pond: shallow (generally < 2 m) open water, ≤ 25% covered by emergent vegetation, ≥ 0.5 ha and < 8 ha.',
      'Permanent stream: well-defined channel, flows ≥ 90% of the year; streambed below the water table, fed mainly by groundwater.',
      'Intermittent stream: well-defined channel, flows only in wet seasons (30–90% of the year); in the driest summer it may be a trickle or only in the streambed.',
      'Ephemeral stream: no well-defined channel; flows only during and after large precipitation events.',
    ],
    test: [
      mc('A lake must be at least…', ['0.5 ha', '8 ha', '25 ha', '100 ha'], 1, 'At least 8 ha, and > 2 m deep at some point.'),
      mc('A pond is…', ['≥ 8 ha', '≥ 0.5 ha and < 8 ha', '< 500 m²', '100–999 ha'], 1, 'Ponds are ≥ 0.5 ha and < 8 ha, generally < 2 m deep.'),
      mc('A stream that flows 30–90% of the year in a well-defined channel is…', ['Permanent', 'Intermittent', 'Ephemeral', 'A seep'], 1, 'Intermittent: flows in wet seasons.'),
      mc('What is the main difference between a permanent and intermittent stream?', ['Only permanent streams have a channel', 'Permanent flows ≥ 90% of the year (groundwater-fed); intermittent flows only in wet seasons (30–90%)', 'Intermittent streams are always bigger', 'Permanent streams have no fish'], 1, 'Both have well-defined channels; the difference is how much of the year they flow.'),
      mc('A stream with no well-defined channel that flows only during and after big rain events is…', ['Permanent', 'Intermittent', 'Ephemeral', 'A woodland pool'], 2, 'Ephemeral.'),
      mc('A medium lake is…', ['8–99 ha', '100–999 ha', '≥ 1000 ha', '< 8 ha'], 1, 'Small < 100 ha, medium 100–999 ha, large ≥ 1000 ha.'),
    ],
  },

  // ---- Aquatic AOCs ----
  {
    section: AOC, q: 'Know the 3 potential harmful effects of forest operations on fish habitat.',
    a: [
      '1. Erosion & sedimentation: trees buffer the water and filter eroded soil. Silt can cover gravel spawning beds and can kill fish directly by damaging gills.',
      '2. Logging debris: branches and tops in the water impede flow, cause barriers, and decompose, using up dissolved oxygen.',
      '3. Temperature & cover: without trees along the water there is less shade, which affects fish cover and raises water temperature.',
    ],
    test: [
      multi('Which are the 3 potential harmful effects of forest operations on fish habitat?', ['Erosion & sedimentation', 'Logging debris', 'Temperature & cover', 'Noise from equipment', 'Overfishing'], [0, 1, 2], 'Erosion & sedimentation, logging debris, temperature & cover.'),
      mc('Logging debris in the water is harmful mainly because it…', ['Adds sediment', 'Blocks flow and uses up dissolved oxygen as it decomposes', 'Raises the pH', 'Warms the water'], 1, 'Impedes flow, makes barriers, and consumes oxygen as it rots.'),
      mc('Silt from erosion harms fish by…', ['Adding oxygen', 'Covering gravel spawning beds and damaging gills', 'Cooling the water', 'Feeding algae only'], 1, 'It smothers spawning beds and can kill fish directly.'),
      mc('Removing shoreline trees mostly affects…', ['Water temperature and fish cover', 'Lake pH', 'Turnover timing', 'Ice thickness'], 0, 'Less shade = warmer water and less cover.'),
    ],
  },
  {
    section: AOC, q: 'What are the riparian guidelines?',
    a: [
      'a) No felling trees into water bodies and no debris deposited; a tree that falls in is left there (do not pull it out).',
      'b) No logging debris left on the banks.',
      'c) Equipment must not cause banks to slump.',
      'd) Equipment must not travel in streams; minimise stream crossings (crossings must be in the AWS or FMP, or a revision approved by MNRF).',
      'e) Minimise road construction in riparian areas.',
      'f) Leave a 3 m filter strip of undisturbed forest floor or vegetation on the banks.',
      'g) No refuelling, lubricating or storing fuel or oil in riparian areas.',
    ],
    extra: true,
    test: [
      tf('If a tree is accidentally felled into a water body, it should be pulled out right away.', false, 'Leave it where it falls.'),
      typed('How wide is the undisturbed filter strip left on the banks of water bodies (m)?', ['3', '3 m', '3m'], 'A 3 m filter strip.'),
      tf('Equipment can be refuelled in the riparian area as long as it is quick.', false, 'No refuelling, lubrication or fuel storage in riparian areas.'),
    ],
  },
  {
    section: AOC, q: 'Be able to identify the different parts of a riparian zone / aquatic AOC (diagram).',
    a: [
      '1. The standing or flowing water.',
      '2. The water (emergent) vegetation along the shore. The AOC is measured from the edge of vegetation that can stop sediment: ≥ 25% canopy of trees, tall (≥ 1 m) woody shrubs like alder or willow, or low (< 1 m) woody evergreen shrubs like Labrador tea or leatherleaf.',
      '3. The inner 3 m: no disturbance; no excessive damage to saplings (< 10 cm DBH) and shrubs.',
      '4. The inner 15 m: no ruts or significant exposed mineral soil.',
      '5. The rest of the AOC (width depends on slope; e.g. 30 m, wider on steep slopes) kept as residual forest (≈ 50% canopy closure of mature forest). Slope > 30%: no clearcutting in the AOC, only selection or shelterwood.',
    ],
    check: 'The diagram is only a picture in the lecture (numbered 1–5: water, water vegetation, then the zones out to residual forest). Zones 3–5 here are matched to the restrictions on the next slides; confirm against the diagram.',
    test: [
      mc('An aquatic AOC is measured from…', ['The middle of the stream', 'The high-water mark only', 'The edge of vegetation able to stop sediment movement', 'The nearest road'], 2, 'From the edge of vegetation communities capable of being an effective sediment barrier.'),
      mc('Within the inner 15 m of an aquatic AOC, what is not permitted?', ['Any harvesting', 'Ruts or significant exposed mineral soil', 'Walking', 'Tree marking'], 1, 'No ruts or significant exposed mineral soil in the inner 15 m.'),
      mc('If the slope in the AOC is greater than 30%…', ['Clearcutting is allowed', 'No clearcutting; selection and shelterwood allowed if residual forest is kept', 'No harvest at all', 'Only herbicide'], 1, '> 30% slope: no clearcutting.'),
      mc('As a rule of thumb, residual forest is…', ['10% canopy closure', '25% canopy closure', '50% canopy closure of mature forest', '100% canopy closure'], 2, '≈ 50% canopy closure of mature forest.'),
      typed('Saplings are trees under how many cm DBH?', ['10', '10 cm', '10cm'], 'Sapling-sized trees are < 10 cm DBH.'),
    ],
  },
  {
    section: AOC, q: 'Know the aquatic areas that need to be protected in forestry.',
    a: [
      'Lakes and ponds (standing water).',
      'Rivers and streams (flowing water: permanent and intermittent).',
      'Wetlands (PSWs get special AOCs from biologists; others have 3 m restrictions).',
      'Woodland pools (temporary open water ≥ 500 m², < 0.5 ha, not connected to a stream): 3 m from the high-water mark.',
      'Seepages / seeps (groundwater discharge on lower slopes; green up early, rare plants like American ginseng).',
      'Moose aquatic feeding areas (MAFAs).',
      'Beaver habitat (beaver ponds).',
    ],
    test: [
      multi('Which aquatic areas need protecting in forestry?', ['Lakes', 'Rivers and streams', 'Wetlands', 'Woodland pools', 'Seepages', 'MAFAs', 'Beaver habitat', 'Gravel pits'], [0, 1, 2, 3, 4, 5, 6], 'Lakes, rivers, streams, wetlands, woodland pools, seepages, MAFAs, beaver habitat.'),
      typed('What does MAFA stand for?', ['moose aquatic feeding area', 'moose aquatic feeding areas'], 'Moose Aquatic Feeding Area.'),
    ],
  },
  {
    section: AOC, q: 'Wetlands, woodland pools and seeps: what are they and how are they protected?',
    a: [
      'Wetlands: seasonally or permanently flooded by shallow water (or water table near the surface), forming hydric soils with water-tolerant plants. They affect water quality, protect shorelines, control floods and are fish spawning/nursery sites.',
      'For wetlands that are not PSWs or connected to other water: no machine travel in the frost-free period within 3 m of open water / non-woody vegetation; no excessive damage to saplings and shrubs within 3 m; no felling into or within 3 m in the frost-free period; no ruts, exposed mineral soil or disrupted hydrology.',
      'Woodland pools: small isolated wetlands that flood and dry; ≥ 500 m² (about 25 m across) and < 0.5 ha. No fish, so they are key breeding sites for wood frogs and yellow-spotted salamanders. Same 3 m rules from the high-water mark.',
      'Seeps: small areas of groundwater discharge on lower slopes or in gullies; green up early in spring, used by wildlife, habitat for rare plants like American ginseng.',
      'Ribbon 3 m off woodland pools and seeps, mark a waypoint and show it on the final map.',
    ],
    test: [
      mc('Woodland pools are important because…', ['They hold trout', 'They have no fish, so they are breeding sites for frogs and salamanders', 'They never dry up', 'Moose feed there'], 1, 'E.g. wood frog and yellow-spotted salamander.'),
      mc('The minimum size of a woodland pool in the SSG is…', ['50 m²', '500 m²', '0.5 ha', '8 ha'], 1, '≥ 500 m² (about 25 m across) and < 0.5 ha.'),
      typed('No machine travel within how many metres of the high-water mark of a woodland pool in the frost-free period?', ['3', '3 m', '3m'], '3 m.'),
      mc('Which rare plant is associated with seeps?', ['Black ash', 'American ginseng', 'Butternut', 'Purple loosestrife'], 1, 'American ginseng.'),
    ],
  },
  {
    section: AOC, q: 'MAFAs and beaver habitat: what are they and how are they managed?',
    a: [
      'MAFAs: in early summer moose feed on submerged and floating aquatic plants rich in sodium, in shallow lakes, slow rivers, shallow bays and beaver ponds. Identified in the FMP by biologists; there is NO additional AOC for MAFAs.',
      'Keep residual shoreline forest preferentially next to higher-class MAFAs (class 4 > 3 > 2), larger MAFAs (> 8 ha best), accessible MAFAs, where it screens roads, connects to other cover, or keeps cover close to the plants.',
      'Beaver: a keystone species; their ponds create habitat (ducks, herons, bitterns) and raise species richness.',
      'Beaver AOC (clearcut): clearcut as much shoreline to the water as practical, ideally ≥ 200 m long and within 50 m of water, targeting shorelines with > 10% aspen; remove conifer regeneration (especially balsam fir); no herbicide within 50 m. Selection/shelterwood: openings > 0.1 ha (ideally > 0.2 ha) within 50 m of the pond.',
    ],
    test: [
      tf('MAFAs get their own extra AOC.', false, 'There is no additional AOC for MAFAs; residual shoreline forest is kept preferentially next to them.'),
      mc('Why do moose feed in aquatic areas in early summer?', ['To cool off only', 'Aquatic plants are rich in sodium', 'To escape wolves', 'To find mates'], 1, 'Submerged and floating plants are rich in sodium.'),
      tf('Around beaver ponds, cutting shoreline aspen to the water’s edge can benefit beavers.', true, 'Beaver AOCs aim to regenerate intolerant hardwoods like aspen near the water.'),
      mc('Beavers are considered a…', ['Invasive species', 'Keystone species', 'Species at risk', 'Coldwater species'], 1, 'Keystone: they create habitat that raises species richness.'),
      typed('No herbicide within how many metres of a beaver pond?', ['50', '50 m', '50m'], '50 m.'),
    ],
  },
  {
    section: AOC, q: 'Water crossings: timing restrictions.',
    a: [
      'Coldwater (HPS) streams: cross in summer; avoid installing crossings Sept 15 – April 30 (fall spawning, eggs on beds all winter, hatch in spring).',
      'Coolwater (MPS) streams: cross any time but spring; avoid April 1 – June 30 (spring spawning, eggs hatch a few weeks later).',
      'Crossing type (bridge, culvert, ford) is chosen with a watershed calculator. Fish passage and water flow must not be blocked; no explosives; machinery serviced ≥ 30 m from the water.',
    ],
    extra: true,
    test: [
      mc('For a coldwater stream, avoid installing crossings between…', ['April 1 – June 30', 'Sept 15 – April 30', 'July 1 – Aug 31', 'Never'], 1, 'Coldwater fish spawn in fall and eggs stay on the beds all winter.'),
      mc('For a coolwater stream, avoid installing crossings between…', ['April 1 – June 30', 'Sept 15 – April 30', 'Nov 1 – Mar 31', 'July 15 – Sept 15'], 0, 'Coolwater fish spawn in spring.'),
      typed('Machinery must be stored, washed, refuelled and serviced at least how many metres from the watercourse?', ['30', '30 m', '30m'], '30 m.'),
    ],
  },

  // ---- Water birds ----
  {
    section: BIRDS, q: 'Define and describe the types of ducks: dabbler, diving, and perching (cavity nesters).',
    a: [
      'Dabbling ducks: feed by dipping their heads with their butts in the air; smaller feet with legs farther forward; fly straight up off the water; shallow water around wetland edges. E.g. mallard, American black duck.',
      'Diving ducks: feed by submerging completely; large feet on short legs far back on the body; run across the water to take off; prefer deeper water (middle of large wetlands, lakes, rivers).',
      'Perching ducks: live in wet woodlands, nest in tree holes (cavity nesters) and perch on branches with long-clawed toes. E.g. wood duck, bufflehead, common merganser, hooded merganser (all perching, diving ducks).',
      'Drake = male (usually brightly coloured); hen = female (usually drab). The bright wing patch is the speculum.',
    ],
    test: [
      mc('A duck that feeds with its butt in the air and flies straight up off the water is a…', ['Diving duck', 'Dabbling duck', 'Perching duck', 'Grebe'], 1, 'Dabbler.'),
      mc('A duck with large feet set far back, which runs across the water to take off, is a…', ['Dabbling duck', 'Diving duck', 'Heron', 'Shorebird'], 1, 'Diving duck.'),
      mc('Perching ducks nest…', ['On the ground in grass', 'In tree cavities', 'On floating mats', 'On sandy beaches'], 1, 'In tree holes; they perch with long-clawed toes.'),
      multi('Which ducks from the lecture are cavity nesters?', ['Wood duck', 'Bufflehead', 'Common merganser', 'Hooded merganser', 'Mallard', 'American black duck'], [0, 1, 2, 3], 'Mallard and black duck are dabblers.'),
      typed('The brightly coloured patch on a duck’s wing is the ____.', ['speculum'], 'Speculum.'),
      mc('A male duck is called a…', ['Hen', 'Drake', 'Gander', 'Cob'], 1, 'Drake. Female = hen (or duck).'),
      tf('Wood ducks can make their own nest cavities.', false, 'They cannot; they use natural cavities and take readily to nest boxes.'),
    ],
  },
  {
    section: BIRDS, q: 'Be able to identify/name the shoreline and aquatic bird SAR species.',
    a: [
      'Horned grebe: Special Concern. Small duck-like waterbird; in breeding plumage a black head with golden “horns” behind the eye and a reddish neck. Threat: loss of wetlands.',
      'Least bittern: Threatened. Smallest heron (≈ 30 cm); brown and beige with chestnut wing patches, black crown and back on males. Threat: wetland destruction; doesn’t tolerate disturbance.',
      'Piping plover: Endangered. Small sand-coloured shorebird, orange bill with a black tip, orange legs, black breast band. Threat: human disturbance on beaches, groomed beaches, predators, storms.',
      'Also in the lecture (not SAR): mallard, black duck, wood duck, bufflehead, common and hooded merganser, American bittern, great blue heron, green heron, sandhill crane, killdeer, double-crested cormorant.',
    ],
    test: [
      mc('What is the Ontario status of the piping plover?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 2, 'Endangered.'),
      mc('What is the status of the least bittern?', ['Special Concern', 'Threatened', 'Endangered', 'Extirpated'], 1, 'Threatened.'),
      mc('What is the status of the horned grebe?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 0, 'Special Concern.'),
      mc('A small sand-coloured shorebird with orange legs, an orange black-tipped bill and a black breast band is the…', ['Killdeer', 'Piping plover', 'Least bittern', 'Horned grebe'], 1, 'Piping plover (Endangered).'),
      mc('The smallest member of the heron family is the…', ['Green heron', 'American bittern', 'Least bittern', 'Great blue heron'], 2, 'Least bittern, about 30 cm (Threatened).'),
      multi('Which water birds from the lecture are species at risk?', ['Horned grebe', 'Least bittern', 'Piping plover', 'Killdeer', 'Great blue heron', 'Double-crested cormorant'], [0, 1, 2], 'Horned grebe (SC), least bittern (THR), piping plover (END).'),
    ],
  },

  // ---- Reptiles & amphibians ----
  {
    section: HERPS, q: 'Reptiles vs amphibians: know the difference.',
    a: [
      'Reptiles: snakes, lizards and turtles. Dry, scaly skin; typically lay soft-shelled eggs on land.',
      'Amphibians: frogs, toads and salamanders. An aquatic, gill-breathing larval stage followed (typically) by a terrestrial, lung-breathing adult stage.',
      'Herpetology: the branch of zoology that studies reptiles and amphibians.',
    ],
    test: [
      multi('Which are reptiles?', ['Snakes', 'Lizards', 'Turtles', 'Frogs', 'Toads', 'Salamanders'], [0, 1, 2], 'Reptiles: snakes, lizards, turtles. Amphibians: frogs, toads, salamanders.'),
      mc('Which describes amphibians?', ['Dry scaly skin, eggs on land', 'Aquatic gill-breathing larva, then (typically) land lung-breathing adult', 'Feathers and hollow bones', 'Always live in salt water'], 1, 'Amphibians have a gill-breathing larval stage.'),
      mc('Salamanders are…', ['Reptiles', 'Amphibians', 'Lizards', 'Fish'], 1, 'Amphibians, even though they look like lizards.'),
      typed('The study of reptiles and amphibians is called ____.', ['herpetology'], 'Herpetology.'),
    ],
  },
  {
    section: HERPS, q: 'Brumation vs hibernation vs hibernacula/hibernaculum.',
    a: [
      'Hibernation: a winter dormancy with a lowered body temperature and slowed metabolism.',
      'Brumation: means the same as hibernation, but refers to cold-blooded animals (reptiles and amphibians).',
      'Hibernaculum (singular) / hibernacula (plural): an underground retreat used by reptiles and amphibians to hibernate, below the frost line so they don’t freeze.',
    ],
    test: [
      mc('Brumation is…', ['Summer dormancy in mammals', 'Hibernation in cold-blooded animals', 'An underground den', 'Spring breeding migration'], 1, 'Synonymous with hibernation, for cold-blooded animals.'),
      mc('A hibernaculum is…', ['A type of turtle', 'An underground retreat below the frost line used to hibernate', 'The process of hibernating', 'A frog’s antifreeze'], 1, 'Hibernacula is the plural.'),
      typed('What is the singular of hibernacula?', ['hibernaculum'], 'Hibernaculum.'),
    ],
  },
  {
    section: HERPS, q: 'How do turtles, snakes and frogs hibernate?',
    a: [
      'Turtles: bury in deep mud at the bottom of ponds and lakes, below the frost line, from October to March–April. Cold slows their metabolism. They get oxygen from the water through blood-vessel-rich tissues: cloacal respiration (the butt) and buccopharyngeal respiration (the throat).',
      'Snakes: in underground dens, caves and burrows (hibernacula), usually with southern exposure and near the water table. Fall (Sept – early Nov) to spring (April – early May). They often bundle together; technically they don’t hibernate since they stay semi-active. Five-lined skinks burrow similarly, using rotten wood.',
      'Frogs: most hibernate in the water like turtles. Wood frogs, chorus frogs and spring peepers hibernate in leaf litter and can freeze: glucose and glycogen act as antifreeze, the heart and breathing stop, and up to 70% of the body freezes. Toads burrow on land about 50 cm deep, below the frost line.',
      'Salamanders: terrestrial ones use rodent burrows, rock cracks, log piles; aquatic ones stay active all winter.',
    ],
    test: [
      mc('Where do turtles hibernate?', ['In leaf litter', 'In deep mud at the bottom of ponds and lakes', 'In rock crevices on land', 'In tree cavities'], 1, 'Below the frost line in the mud.'),
      mc('Breathing through the cloaca is called…', ['Buccopharyngeal respiration', 'Cloacal respiration', 'Brumation', 'Gill breathing'], 1, 'Cloacal = butt; buccopharyngeal = throat.'),
      multi('Which Ontario frogs can freeze solid over winter?', ['Wood frog', 'Spring peeper', 'Chorus frog', 'Bullfrog', 'Green frog'], [0, 1, 2], 'These three produce antifreeze from glucose and glycogen.'),
      mc('Toads hibernate…', ['In pond mud', 'In burrows on land about 50 cm deep', 'In leaf litter on the surface', 'In snake dens'], 1, 'Below the frost line.'),
      mc('Snake hibernacula usually have…', ['Northern exposure', 'Southern exposure, near the water table', 'No access to water', 'Standing water inside'], 1, 'Southern exposure and close to the water table.'),
      tf('Technically, snakes don’t truly hibernate because they stay semi-active.', true, 'They remain semi-active in a low conscious state.'),
      typed('Up to what percent of a wood frog’s body can freeze?', ['70', '70%'], 'Up to 70%.'),
    ],
  },
  {
    section: HERPS, q: 'Be able to identify/name the reptile SAR species.',
    a: [
      'Turtles: snapping turtle (Special Concern), northern map turtle (Special Concern), spiny softshell (Endangered; soft leathery shell, snorkel snout), Blanding’s turtle (Threatened; bright yellow chin and throat), wood turtle (Endangered).',
      'Snakes: eastern hognose snake (Threatened), massasauga rattlesnake (Threatened; Ontario’s only venomous snake), eastern foxsnake (Threatened), eastern (gray) ratsnake (Endangered).',
      'Lizard: five-lined skink, Ontario’s only lizard (Special Concern on the slide; the notes say Endangered).',
      'Not SAR in the lecture: midland painted turtle, eastern gartersnake, spotted salamander, blue-spotted salamander, red-spotted newt, spring peeper, gray treefrog.',
    ],
    check: 'Five-lined skink: the slide title says Special Concern but the slide notes say Endangered (Ontario lists the Carolinian population as Endangered and the Southern Shield population as Special Concern). Blanding’s yellow chin and massasauga as the only venomous snake are from general knowledge.',
    test: [
      mc('What is the status of the Blanding’s turtle?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 1, 'Threatened.'),
      mc('What is the status of the snapping turtle?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 0, 'Special Concern.'),
      mc('What is the status of the spiny softshell?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 2, 'Endangered.'),
      mc('What is the status of the wood turtle?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 2, 'Endangered.'),
      mc('What is the status of the northern map turtle?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 0, 'Special Concern.'),
      mc('What is the status of the eastern (gray) ratsnake?', ['Special Concern', 'Threatened', 'Endangered', 'Not at Risk'], 2, 'Endangered.'),
      multi('Which snakes are Threatened?', ['Eastern hognose snake', 'Massasauga rattlesnake', 'Eastern foxsnake', 'Eastern (gray) ratsnake', 'Eastern gartersnake'], [0, 1, 2], 'The ratsnake is Endangered; the gartersnake is not at risk.'),
      mc('Ontario’s only lizard is the…', ['Red-spotted newt', 'Five-lined skink', 'Blue-spotted salamander', 'Spotted salamander'], 1, 'Five-lined skink. Salamanders and newts are amphibians.'),
      mc('Which turtle has a soft, leathery shell and a snorkel-like snout?', ['Snapping turtle', 'Spiny softshell', 'Wood turtle', 'Midland painted turtle'], 1, 'Spiny softshell (Endangered).'),
      multi('Which species from the lecture are NOT species at risk?', ['Midland painted turtle', 'Eastern gartersnake', 'Spring peeper', 'Blanding’s turtle', 'Eastern foxsnake'], [0, 1, 2], 'Blanding’s and the foxsnake are both Threatened.'),
    ],
  },
];

const SORTS: SortDrill[] = [
  {
    id: 'herp-class', title: 'Reptile or amphibian?', prompt: 'Sort each animal from the lecture.',
    bins: ['Reptile', 'Amphibian'],
    items: [
      { label: 'Blanding’s turtle', bin: 'Reptile' }, { label: 'Five-lined skink', bin: 'Reptile' }, { label: 'Massasauga rattlesnake', bin: 'Reptile' },
      { label: 'Eastern gartersnake', bin: 'Reptile' }, { label: 'Spiny softshell', bin: 'Reptile' }, { label: 'Spring peeper', bin: 'Amphibian' },
      { label: 'Red-spotted newt', bin: 'Amphibian' }, { label: 'Spotted salamander', bin: 'Amphibian' }, { label: 'Gray treefrog', bin: 'Amphibian' },
      { label: 'Toad', bin: 'Amphibian' },
    ],
  },
  {
    id: 'sar-status', title: 'SAR status', prompt: 'Sort each species by its status in the lectures.',
    bins: ['Endangered', 'Threatened', 'Special Concern', 'Not at risk'],
    items: [
      { label: 'Piping plover', bin: 'Endangered' }, { label: 'Spiny softshell', bin: 'Endangered' }, { label: 'Wood turtle', bin: 'Endangered' },
      { label: 'Eastern (gray) ratsnake', bin: 'Endangered' }, { label: 'Least bittern', bin: 'Threatened' }, { label: 'Blanding’s turtle', bin: 'Threatened' },
      { label: 'Eastern hognose snake', bin: 'Threatened' }, { label: 'Massasauga rattlesnake', bin: 'Threatened' }, { label: 'Eastern foxsnake', bin: 'Threatened' },
      { label: 'Horned grebe', bin: 'Special Concern' }, { label: 'Snapping turtle', bin: 'Special Concern' }, { label: 'Northern map turtle', bin: 'Special Concern' },
      { label: 'Midland painted turtle', bin: 'Not at risk' }, { label: 'Killdeer', bin: 'Not at risk' }, { label: 'Eastern gartersnake', bin: 'Not at risk' },
    ],
  },
  {
    id: 'ducks', title: 'Dabbler, diver or perching?', prompt: 'Sort each trait or duck.',
    bins: ['Dabbler', 'Diver', 'Perching'],
    items: [
      { label: 'Butt in the air to feed', bin: 'Dabbler' }, { label: 'Flies straight up off the water', bin: 'Dabbler' },
      { label: 'Shallow water at wetland edges', bin: 'Dabbler' }, { label: 'Mallard', bin: 'Dabbler' }, { label: 'American black duck', bin: 'Dabbler' },
      { label: 'Submerges completely to feed', bin: 'Diver' }, { label: 'Runs across the water to take off', bin: 'Diver' },
      { label: 'Large feet set far back', bin: 'Diver' }, { label: 'Nests in tree holes', bin: 'Perching' },
      { label: 'Long-clawed toes for branches', bin: 'Perching' }, { label: 'Wood duck', bin: 'Perching' }, { label: 'Hooded merganser', bin: 'Perching' },
    ],
  },
  {
    id: 'temp', title: 'Coldwater, coolwater or warmwater?', prompt: 'Sort each description.',
    bins: ['Coldwater', 'Coolwater', 'Warmwater'],
    items: [
      { label: '< 19°C in summer', bin: 'Coldwater' }, { label: 'Brook trout', bin: 'Coldwater' }, { label: 'High Potential Sensitivity', bin: 'Coldwater' },
      { label: 'Spawn in autumn', bin: 'Coldwater' }, { label: '19–25°C in summer', bin: 'Coolwater' }, { label: 'Northern pike, walleye', bin: 'Coolwater' },
      { label: 'Moderate Potential Sensitivity', bin: 'Coolwater' }, { label: 'Spawn in spring', bin: 'Coolwater' },
      { label: '> 25°C in summer', bin: 'Warmwater' }, { label: 'Low Potential Sensitivity', bin: 'Warmwater' },
    ],
  },
  {
    id: 'zones', title: 'Which lake zone?', prompt: 'Match each description to its zone.',
    bins: ['Littoral', 'Limnetic', 'Profundal', 'Benthic'],
    items: [
      { label: 'Shore area sloping into open water', bin: 'Littoral' }, { label: 'Wide in eutrophic lakes', bin: 'Littoral' },
      { label: 'Sunlit open water', bin: 'Limnetic' }, { label: 'Most photosynthesis', bin: 'Limnetic' }, { label: 'Phytoplankton and zooplankton', bin: 'Limnetic' },
      { label: 'Beyond sunlight, low oxygen', bin: 'Profundal' }, { label: 'Colder and denser, no photosynthesis', bin: 'Profundal' },
      { label: 'Very bottom of the lake', bin: 'Benthic' }, { label: 'Decomposers and insect larvae', bin: 'Benthic' },
    ],
  },
  {
    id: 'acts', title: 'Which act or guide?', prompt: 'Match each to the act or guide it describes.',
    bins: ['CFSA', 'SSG', 'Fisheries Act', 'SARA'],
    items: [
      { label: 'Passed in 1994', bin: 'CFSA' }, { label: 'Independent forest audit every 5 years', bin: 'CFSA' }, { label: 'Requires an FMP', bin: 'CFSA' },
      { label: 'Legally binding guide for all forestry operations', bin: 'SSG' }, { label: 'Sets AOC sizes and timing restrictions', bin: 'SSG' },
      { label: 'Section 35(1): no HADD of fish habitat', bin: 'Fisheries Act' }, { label: 'No deleterious substances in fish water', bin: 'Fisheries Act' },
      { label: 'Federal law from 1985', bin: 'Fisheries Act' }, { label: 'Proclaimed in 2003', bin: 'SARA' }, { label: 'Establishes COSEWIC', bin: 'SARA' },
      { label: 'Protects critical habitat', bin: 'SARA' },
    ],
  },
  {
    id: 'streams', title: 'Which water feature?', prompt: 'Match each SSG definition.',
    bins: ['Permanent stream', 'Intermittent stream', 'Ephemeral stream', 'Woodland pool'],
    items: [
      { label: 'Flows ≥ 90% of the year', bin: 'Permanent stream' }, { label: 'Fed mainly by groundwater', bin: 'Permanent stream' },
      { label: 'Flows 30–90% of the year', bin: 'Intermittent stream' }, { label: 'A trickle in the driest summer', bin: 'Intermittent stream' },
      { label: 'No well-defined channel', bin: 'Ephemeral stream' }, { label: 'Flows only after big rain events', bin: 'Ephemeral stream' },
      { label: 'Floods and dries; no fish', bin: 'Woodland pool' }, { label: '≥ 500 m² but < 0.5 ha', bin: 'Woodland pool' },
    ],
  },
];

const RANKS: RankDrill[] = [
  {
    id: 'sara-order', title: 'SARA levels', prompt: 'Most at risk at the top.',
    order: ['Endangered', 'Threatened', 'Special Concern', 'Not at Risk'],
    explain: 'END: imminent extirpation or extinction. THR: likely to become endangered. SC: may become threatened or endangered. NAR: not at risk.',
  },
  {
    id: 'layers', title: 'Lake layers', prompt: 'Surface at the top.',
    order: ['Epilimnion', 'Thermocline', 'Hypolimnion'],
    explain: 'Warmest and least dense on top; coldest and densest on the bottom.',
  },
  {
    id: 'lake-size', title: 'Standing water by size', prompt: 'Largest at the top.',
    order: ['Large lake (≥ 1000 ha)', 'Medium lake (100–999 ha)', 'Small lake (8–99 ha)', 'Pond (0.5 to < 8 ha)', 'Woodland pool (≥ 500 m², < 0.5 ha)'],
    explain: 'Lakes are at least 8 ha; ponds 0.5–8 ha; woodland pools are smaller than ponds.',
  },
];

export const WILDLIFE: StudyGuide = {
  id: 'wildlife', sections: [LAW, WATER, AOC, BIRDS, HERPS], allLabel: 'All topics',
  cards: CARDS, sorts: SORTS, ranks: RANKS,
};
