/**
 * Forest Environment midterm review, from the instructor's Mid Term Review slides, checked against the
 * lectures: Pacing and Chaining, Introduction to Compassing, Bearings Azimuths and Declination, UTM and OBM,
 * Forest Resource Inventory and Compass Offsets, Diameters Heights and Slope, Forestry Tools, Tree Aging and
 * Prisming. `check` marks an answer that is not straight from the slides.
 */

import { mc, multi, order, tf, typed, type RankDrill, type SortDrill, type StudyCard, type StudyGuide } from './types';

const CHAIN = 'Pacing & chaining';
const MAPS = 'Maps & FRI';
const COMPASS = 'Compassing';
const TREES = 'Diameters & heights';
const TOOLS = 'Forestry tools';
const AGING = 'Tree aging';
const PRISMS = 'Prisms';

/** The tools on the review slide. */
const TOOL_USES: [string, string][] = [
  ['Sandvik / brush axe', 'Clearing brush.'],
  ['Bark gauge', 'Determining the thickness of bark.'],
  ['Haga', 'A hypsometer for measuring tree heights.'],
  ['Froe', 'Splitting wood (riving). It advances a split; it isn’t used to start one in wood over 6″.'],
  ['Fire back pack', 'A backpack water pump for putting out fires.'],
  ['Ekman sediment sampler', 'Sampling the sediment on the bottom of lakes and streams.'],
  ['Tree felling wedges', 'Driven into the back cut to direct a tree’s fall and keep the saw from binding.'],
  ['Adze', 'Smoothing planks: like an axe with an arched blade at right angles to the handle.'],
  ['Logger’s block', 'A rope / wire pulley.'],
  ['Skidding tongs', 'Pulling a log behind a horse.'],
];

const CARDS: StudyCard[] = [
  // ---- Pacing & chaining ----
  {
    section: CHAIN, q: 'What is a chain?',
    a: [
      'Chaining is the accurate measuring of the horizontal distance between two points with an instrument, most often a chain of metal, nylon, cord or hemp.',
      '1 chain = 20 m (≈66 ft). Some chains are 30 m (≈100 ft). We use the 20 m chain.',
      '20 m is also the minimum reserve distance for areas of concern (streams, lakes, nests).',
    ],
    test: [
      typed('How many metres is 1 chain?', ['20'], '1 chain = 20 m (≈66 ft).'),
      typed('How many feet is 1 chain?', ['66'], '66 ft = 20.1168 m, so 20 m is used.'),
      mc('Chaining measures the…', ['Horizontal distance between two points', 'Slope distance between two points', 'Height of a tree', 'Basal area of a stand'], 0, 'Always horizontal: that is why you break chain on slopes.'),
    ],
  },
  {
    section: CHAIN, q: 'What is a Gunter’s chain?',
    a: [
      'The imperial chain: 66 ft long, divided into 100 links of 7.92 inches each.',
      '12 chains and 82 links is recorded as 12.82 chains.',
    ],
    test: [
      typed('How many links are in a Gunter’s chain?', ['100'], '100 links of 7.92 inches.'),
      mc('12 chains and 82 links is recorded as…', ['12.82 chains', '12 ch 82', '1282 links', '12.41 chains'], 0, 'Links are hundredths of a chain.'),
    ],
  },
  {
    section: CHAIN, q: 'What do the head chain and rear chain people do?',
    a: [
      'Head chain: ties the “zero” end to their pack or belt, compasses, moves ahead, marks each chain (boot scuff, stick, flagging, pin) and tallies chains with the slash method.',
      'Rear chain (cruiser): stays at the marker and yells “CHAIN” and its number (e.g. “chain 42”) when the end reaches them.',
      'A good head chain paces the chain length so they can anticipate the end.',
    ],
    test: [
      mc('Who does the compassing while chaining?', ['Head chain', 'Rear chain', 'Both', 'Neither'], 0, 'The head chain compasses, marks and tallies.'),
      mc('Who yells “CHAIN”?', ['Head chain', 'Rear chain / cruiser', 'The crew lead at camp', 'Nobody'], 1, 'The rear chain yells when the end of the chain reaches them.'),
    ],
  },
  {
    section: CHAIN, q: 'How do you chain on steep slopes?',
    a: [
      'Break chain: use only short sections of the chain to hold a level (horizontal) line, stepping down like a staircase.',
      'With experience, let the chain “trailer” past the marker to make up for slope. The steeper the slope, the more you trail: 1 to 3 m.',
    ],
    test: [
      tf('On a steep slope you break chain to keep the line horizontal.', true, 'Short level sections, like a staircase.'),
      mc('How far past the marker can you “trailer” the chain on a slope?', ['1–3 m', '5–10 m', '10–20 m', 'Never'], 0, 'Steeper slope = more trail, 1 to 3 m.'),
    ],
  },
  {
    section: CHAIN, q: 'What causes errors in chaining?',
    check: 'Pulled together from the chaining slides; the review only lists “errors in chaining”.',
    a: [
      'Not keeping the chain horizontal on slopes (not breaking chain).',
      'A sagging chain that isn’t pulled taut.',
      'Drifting off line when changing direction: use a bumper / pivot tree, bush, pin or person.',
      'A stretched, knotted or kinked chain: re-measure before every use and coil it properly.',
      'Miscounting chains on the tally.',
    ],
    test: [
      multi('Select the causes of chaining error.', ['Chain not horizontal on a slope', 'Sagging chain', 'Drifting when changing direction', 'Stretched or kinked chain', 'Using a 20 m chain'], [0, 1, 2, 3], 'The 20 m chain is the standard.'),
      tf('A chain rope should be re-measured before every use.', true, 'Check for stretch, knots and kinks.'),
    ],
  },
  {
    section: CHAIN, q: 'When do you measure to the centre of a tree?',
    a: ['When pacing tree to tree.', 'When measuring tree to tree.', 'When chaining from a tree to anything.', 'When determining tree heights.'],
    test: [
      multi('You measure to the centre of the tree when…', ['Pacing tree to tree', 'Measuring tree to tree', 'Chaining from a tree to anything', 'Determining tree heights', 'Taking DBH'], [0, 1, 2, 3], 'DBH is taken around the bole, not to its centre.'),
    ],
  },
  {
    section: CHAIN, q: 'What are the tally methods A, B and C used for?',
    a: [
      'A (slash): chaining.',
      'B: scaling logs or lumber.',
      'C (dot tally): timber cruising / inventory. Rows and columns are both added and the grand totals must match.',
      'Use pencil (HB, 2H, 4H). Don’t erase: strike out lettering or number errors, circle tally errors. Sheets can be used in a court of law.',
    ],
    test: [
      mc('Which tally method is used for chaining?', ['A', 'B', 'C', 'None'], 0, 'A: slash tally for chaining.'),
      mc('Which tally method is used for timber cruising?', ['A', 'B', 'C', 'None'], 2, 'C: dot tally.'),
      mc('How do you fix a tally error?', ['Circle it', 'Erase it', 'Use white-out', 'Start a new sheet'], 0, 'Circle tally errors; strike out lettering errors. Never erase.'),
    ],
  },
  {
    section: CHAIN, q: 'What is a pace, and how is your pacing factor determined?',
    check: 'The slides don’t spell out how to find a pacing factor; this is the usual method from the field exercise.',
    a: [
      'A pace is the average length of two natural steps: count each time the same foot touches the ground.',
      'Pace a known measured distance (e.g. a chained 20 m) several times and average the count. That is your paces per chain.',
      'Most technicians get 12 to 14 paces per chain.',
      'Always record paced distances in chains, feet or metres (e.g. 12.25 paces = 1 chain = 66 ft = 20 m).',
    ],
    test: [
      mc('A pace is…', ['Two natural steps (same foot touches down)', 'One step', 'One metre', 'One chain'], 0, 'Count each time the same foot hits the ground.'),
      mc('Most technicians get how many paces per chain?', ['6–8', '12–14', '20–22', '30'], 1, '12 to 14 paces per chain.'),
      typed('Your pacing factor is 13 paces per chain. You walk 65 paces. How many chains is that?', ['5'], '65 ÷ 13 = 5 chains (100 m).'),
    ],
  },
  {
    section: CHAIN, q: 'How does pacing change on slopes and rough ground?',
    a: [
      'Your steps get shorter going up hills, on uneven or dense terrain, and with different footwear, so you take more paces per chain.',
      'Compensate for it, and check your pace often against a measured distance.',
    ],
    test: [
      tf('Going uphill you take more paces per chain.', true, 'Shorter steps, so compensate.'),
    ],
  },
  {
    section: CHAIN, q: 'What is the difference between an open and a closed traverse?',
    a: [
      'Open (line / travel / survey / cruise): the ending point is a different location than the starting point.',
      'Closed (loop): the finishing point is the same as the beginning point.',
    ],
    test: [
      mc('A traverse that ends where it started is…', ['Closed', 'Open', 'Offset', 'Broken'], 0, 'A closed traverse is a loop.'),
    ],
  },
  {
    section: CHAIN, extra: true, q: 'How wide are cruise / survey strips, and why know your 8 and 16 ft pace?',
    a: [
      'Cruise / survey widths are 5 m or 10 m on each side of the chained centre line.',
      '8 ft is a piece of pulp (and the minimum merchantable length); 16 ft is a sawlog. Useful for scaling and harvest inspections.',
    ],
    test: [
      mc('Cruise widths are how far on each side of the centre line?', ['5 or 10 m', '1 or 2 m', '20 or 30 m', '50 m'], 0, '5 m or 10 m.'),
    ],
  },

  // ---- Maps & FRI ----
  {
    section: MAPS, q: 'What are the three norths?',
    a: [
      'True North: along a meridian toward the geographic North Pole.',
      'Grid North: the north–south grid lines on a map (UTM).',
      'Magnetic North: where the compass needle points.',
    ],
    test: [
      multi('Select the three norths.', ['True North', 'Grid North', 'Magnetic North', 'Polar North'], [0, 1, 2], 'True, Grid and Magnetic.'),
      mc('The north–south lines on a map use…', ['Grid North', 'True North', 'Magnetic North', 'Compass North'], 0, 'Grid North.'),
    ],
  },
  {
    section: MAPS, q: 'How do you convert a map scale (representative fraction)?',
    a: [
      'The scale means 1 unit on the map = that many of the same unit on the ground.',
      '1:20,000 → 1 cm = 20,000 cm = 200 m on the ground.',
      '1:50,000 → 1 cm = 50,000 cm; ÷ 2.54 = 19,685 inches on the ground.',
      'You can also use the bar (conversion) scale printed on the map.',
    ],
    test: [
      typed('At 1:20,000, 1 cm on the map is how many metres on the ground?', ['200'], '20,000 cm ÷ 100 = 200 m.'),
      typed('At 1:50,000, 1 cm on the map is how many inches on the ground? (round to the nearest inch)', ['19685'], '50,000 cm ÷ 2.54 = 19,685 inches.'),
      typed('At 1:10,000, 1 cm on the map is how many metres on the ground?', ['100'], '10,000 cm ÷ 100 = 100 m.'),
    ],
  },
  {
    section: MAPS, extra: true, q: 'What is UTM, and how do you read it?',
    a: [
      'Universal Transverse Mercator: keeps angles, direction and shapes accurate, so it is the projection most used in forestry.',
      '60 zones, each 6° of longitude wide, numbered east from 180° (the International Date Line).',
      'Rows are lettered C to X (no I or O), 8° high. Pembroke is in 18T.',
      'Read Easting then Northing: “In from the West, then up the Stairs.” The central meridian is 500,000 mE.',
    ],
    test: [
      typed('How many UTM zones are there?', ['60'], '60 zones, 6° wide.'),
      typed('How many degrees of longitude wide is a UTM zone?', ['6'], '6°.'),
      mc('Which UTM grid zone is Pembroke in?', ['18T', '17T', '16U', '31N'], 0, '18T.'),
      mc('UTM coordinates are read…', ['Easting, then Northing', 'Northing, then Easting', 'Either way', 'Latitude, then longitude'], 0, '“In from the West, then up the Stairs.”'),
    ],
  },
  {
    section: MAPS, extra: true, q: 'What are Ontario Base Maps (OBM)?',
    a: [
      'Maps made by the MNR (1977–2000) with topographic features: relief, hydrography, vegetation, roads.',
      '1:10,000 in Southern Ontario, 1:20,000 in Northern Ontario.',
      'Labelled with Scale, Zone, Easting, Northing.',
    ],
    test: [
      mc('OBMs in Northern Ontario are at what scale?', ['1:20,000', '1:10,000', '1:50,000', '1:5,000'], 0, 'Southern Ontario is 1:10,000.'),
    ],
  },
  {
    section: MAPS, extra: true, q: 'What is an FRI, and how is stand composition written?',
    a: [
      'Forest Resource Inventory: the systematic collection of data on forest resources in an area. The basis for sustainable forest management.',
      'Made by photo interpreters who delineate stands, water, infrastructure and unforested areas.',
      'Stand composition lists species in 10% increments and must add to 100% (e.g. Po3 Pw2 Bw2 Ms1 Or1 Mh1).',
    ],
    test: [
      tf('FRI stand composition must add to 100%.', true, 'In 10% increments.'),
      mc('In “Po3 Pw2 Bw2…”, poplar makes up…', ['30%', '3%', '3 trees', '3 ha'], 0, 'The 0 is dropped to save space.'),
    ],
  },
  {
    section: MAPS, extra: true, q: 'What is a compass offset?',
    a: [
      'Going around an obstacle you can’t safely cross (boulder, ledge, wetland, cliff) at 90° and coming back so you keep your direction of travel.',
      'Offset due to drift: if the map shows you have drifted off line, compass 90° left or right back to the proper line. Record the offset distance if needed.',
    ],
    test: [
      mc('To get around an obstacle while compassing you turn…', ['90°', '45°', '180°', '360°'], 0, 'Offset at 90°, then return to the line.'),
    ],
  },

  // ---- Compassing ----
  {
    section: COMPASS, q: 'What are the units in compassing?',
    a: [
      'A compass is 360°. Each degree = 60 minutes (′), each minute = 60 seconds (″).',
      'It is a base-60 system (like time), not base 10.',
      '90° = 89°60′ = 89°59′60″.',
      'A compass can’t read minutes or seconds; they appear on maps for precision.',
    ],
    test: [
      typed('How many minutes are in a degree?', ['60'], 'Base 60.'),
      typed('How many seconds are in a degree?', ['3600'], '60 × 60 = 3,600.'),
      tf('Compass units are a base-10 system.', false, 'Base 60, like time.'),
      mc('170°45′ − 64°21′ =', ['106°24′', '106°66′', '105°24′', '106°34′'], 0, '45′ − 21′ = 24′; 170° − 64° = 106°.'),
    ],
  },
  {
    section: COMPASS, q: 'What is an azimuth? What is a bearing?',
    a: [
      'Azimuth: a horizontal angle measured clockwise from north. Ranges from 0 to 360°.',
      'Bearing: an angle measured from north or south toward east or west. Never more than 90° (e.g. S22°W).',
      'There are 16 standard compass bearings (N, NNE, NE, ENE, E…).',
    ],
    test: [
      mc('An azimuth is measured…', ['Clockwise from north, 0–360°', 'From north or south, 0–90°', 'Counter-clockwise from east', 'From magnetic south'], 0, 'Clockwise from north.'),
      tf('A bearing can be more than 90°.', false, 'Never more than 90°.'),
      typed('How many standard compass bearings are there?', ['16'], 'N, NNE, NE, ENE, E…'),
    ],
  },
  {
    section: COMPASS, q: 'How do you convert between bearings and azimuths?',
    a: [
      'NE quadrant: Azimuth = Bearing.',
      'SE quadrant: Azimuth = 180° − Bearing.',
      'SW quadrant: Azimuth = 180° + Bearing.',
      'NW quadrant: Azimuth = 360° − Bearing.',
      'E.g. S15°W → 180° + 15° = 195°. 290° → 360° − 290° = N70°W.',
    ],
    test: [
      typed('What is the azimuth of S15°W?', ['195'], 'SW: 180° + 15° = 195°.'),
      mc('What is the bearing of an azimuth of 315°?', ['N45°W', 'S45°W', 'N45°E', 'S45°E'], 0, 'NW: 360° − 315° = 45°.'),
      mc('What is the bearing of an azimuth of 290°?', ['N70°W', 'S70°W', 'N20°W', 'S20°E'], 0, 'NW: 360° − 290° = 70°.'),
      mc('What is the azimuth of SSE?', ['157°30′', '22°30′', '202°30′', '135°'], 0, 'SSE = S22°30′E. SE: 180° − 22°30′ = 157°30′.'),
      mc('Convert the azimuth 250°19′30″ to a bearing.', ['S70°19′30″W', 'N70°19′30″W', 'S19°40′30″W', 'S70°19′30″E'], 0, 'SW: 250°19′30″ − 180° = 70°19′30″.'),
      typed('What is the azimuth of N40°E?', ['40'], 'NE: azimuth = bearing.'),
    ],
  },
  {
    section: COMPASS, q: 'What is magnetic declination?',
    a: [
      'The angle between True North and Magnetic North. It depends on your location.',
      'Variation is the annual change in magnetic north.',
      'With a west declination, True = Magnetic − declination: 170° magnetic with 13°W declination = 157° true.',
      'With an east declination, add it.',
      'Find yours from your latitude and longitude with the NRCan declination calculator.',
    ],
    check: 'The east-declination rule isn’t on the slides; it is the opposite of the west example.',
    test: [
      mc('Declination is the angle between…', ['True North and Magnetic North', 'Grid North and True North', 'North and South', 'Two cruise lines'], 0, 'TN and MN.'),
      typed('Magnetic azimuth 170°, declination 13°W. What is the true azimuth?', ['157'], '170° − 13° = 157°.'),
      tf('Declination is the same everywhere.', false, 'It depends on location.'),
    ],
  },
  {
    section: COMPASS, q: 'What is a back azimuth, and how do you work around a closed traverse?',
    a: [
      'Back azimuth = azimuth ± 180°. E.g. 350°45′ − 180° = 170°45′.',
      'Next line’s azimuth = back azimuth − the interior angle at that point. E.g. 170°45′ − 64°21′ = 106°24′.',
      'Remember base 60 when subtracting.',
    ],
    test: [
      typed('What is the back azimuth of 70°?', ['250'], '70° + 180° = 250°.'),
      mc('What is the back azimuth of 350°45′?', ['170°45′', '190°45′', '9°15′', '180°45′'], 0, '350°45′ − 180° = 170°45′.'),
    ],
  },
  {
    section: COMPASS, q: 'What is proper compassing technique?',
    check: 'The review lists landmarking and checking azimuth; the rest is standard technique.',
    a: [
      'Hold the compass level and steady at your waist, away from metal.',
      'Set your azimuth and line up the needle.',
      'Landmark: pick an object on your line and walk to it, then pick the next one.',
      'Check your azimuth often, and offset around obstacles.',
    ],
    test: [
      multi('Select good compassing technique.', ['Hold the compass level', 'Landmark ahead on your line', 'Check your azimuth often', 'Keep it near your truck for accuracy'], [0, 1, 2], 'Keep it away from metal.'),
    ],
  },

  // ---- Diameters & heights ----
  {
    section: TREES, q: 'What is DBH?',
    a: [
      'Diameter at Breast Height: taken 1.3 m vertical from the ground (point of germination), perpendicular to the bole.',
      'If there is a defect at 1.3 m, measure at the closest non-deformed spot. Going up is better: it is more conservative.',
    ],
    test: [
      typed('DBH is taken at what height (m)?', ['1.3'], '1.3 m from the point of germination.'),
      mc('If there is a swelling at 1.3 m, you measure…', ['Just above it', 'Right on it', 'At the stump', 'Skip the tree'], 0, 'Up is more conservative.'),
    ],
  },
  {
    section: TREES, q: 'What is a dendrometer? Calipers vs. D-tapes?',
    a: [
      'Dendrometer: an instrument that measures the height and diameter of trees.',
      'Calipers: even numbers only. Take two readings perpendicular to each other and average.',
      'D-tape: gives even and odd numbers to 1 or 2 decimal places. Keep it level and kink-free, and hug the tree.',
    ],
    test: [
      mc('A dendrometer measures…', ['Height and diameter of trees', 'Bark thickness', 'Water clarity', 'Slope'], 0, 'Height and diameter.'),
      tf('Calipers can tally odd numbers.', false, 'Calipers tally even numbers only; D-tapes give odd and even.'),
    ],
  },
  {
    section: TREES, q: 'What is the “divide by 4” rule?',
    a: [
      'Average your two caliper readings to the closest whole number.',
      'If it falls between two even numbers, use the one divisible by 4.',
      '31 cm and 35 cm → (31 + 35) ÷ 2 = 33 → 32 cm DBH.',
    ],
    test: [
      typed('Caliper readings are 31 cm and 35 cm. What is the DBH?', ['32'], 'Average 33, between 32 and 34; 32 divides by 4.'),
      typed('Caliper readings are 29 cm and 31 cm. What is the DBH?', ['30'], 'Average 30, already even.'),
      typed('Caliper readings are 40 cm and 42 cm. What is the DBH?', ['40'], 'Average 41, between 40 and 42; 40 divides by 4.'),
    ],
  },
  {
    section: TREES, q: 'Where do you take DBH on different trees?',
    check: 'The DBH location slides are diagrams only; these are the standard rules.',
    a: [
      'On a slope: 1.3 m from the uphill side.',
      'Leaning tree: 1.3 m along the stem on the underside of the lean, perpendicular to the bole.',
      'Fork below 1.3 m: treat it as two trees. Fork above: one tree.',
      'Swelling or defect at 1.3 m: measure just above it.',
    ],
    test: [
      mc('On a slope, DBH is measured from the…', ['Uphill side', 'Downhill side', 'Either side', 'Average of both'], 0, 'Uphill side.'),
      tf('A tree that forks below 1.3 m is measured as two trees.', true, 'Each stem gets its own DBH.'),
    ],
  },
  {
    section: TREES, q: 'What are the scales on a Suunto, and what is the height formula?',
    a: [
      'Suunto hypsometer scales: 1/20, 1/15 and % (1/100).',
      'Height = (Top reading − Bottom reading) × Horizontal distance ÷ Scale reciprocal.',
      'Pick the distance closest to your estimate of the tree’s height. The % scale works from any distance.',
      'Top 70, bottom −8, 20 m, % scale → (70 − (−8)) × 20 ÷ 100 = 15.6 m.',
    ],
    test: [
      multi('Select the Suunto scales.', ['1/20', '1/15', '%', '1/10', '1/50'], [0, 1, 2], '20, 15 and percent.'),
      typed('Top reading 70, bottom −8, 20 m away, % scale. How tall is the tree (m)?', ['15.6'], '(70 + 8) × 20 ÷ 100 = 15.6 m.'),
      typed('Top reading 82, bottom −10, 23 m away, % scale. How tall is the tree (m)?', ['21.16'], '92 × 23 ÷ 100 = 21.16 m.'),
      typed('On the 1/20 scale at 20 m, top 18, bottom −2. How tall is the tree (m)?', ['20'], 'At the scale distance, height = top − bottom = 20 m.'),
    ],
  },
  {
    section: TREES, q: 'Where do you take heights from?',
    a: [
      'Measure perpendicular to the tree’s lean.',
      'About a tree height away, at the scale distance (15 or 20 m) from the centre of the tree.',
      'Small trees: go half the distance (7.5 or 10 m), then halve the height. Very tall trees: double the distance (30 or 40 m), then double it.',
      'If the base is above you (both readings positive): Top − Bottom (e.g. 25 − 3 = 22 m).',
      'Hardwoods: project through the crown. Shooting the near side of the crown overestimates height.',
    ],
    test: [
      mc('You measure a leaning tree’s height from…', ['Perpendicular to the lean', 'Under the lean', 'Behind the lean', 'Anywhere'], 0, 'Perpendicular to the lean.'),
      mc('For a small tree on the 15 scale, you stand…', ['7.5 m away and halve the height', '30 m away and double it', '15 m away', '1.3 m away'], 0, 'Half the distance, half the answer.'),
      typed('The tree base is above you: top 25, bottom 3, at the scale distance. Height (m)?', ['22'], 'Both positive: 25 − 3 = 22 m.'),
      tf('Shooting only the near side of a hardwood crown overestimates height.', true, 'Project through the crown.'),
    ],
  },
  {
    section: TREES, q: 'What is a clinometer?',
    a: [
      'An incline / slope measuring tool. Use only the % scale of a hypsometer.',
      '% slope = + rise or − fall: always state the sign.',
      'Used to plan the location of roads and trails.',
    ],
    test: [
      mc('A clinometer reading for slope uses which scale?', ['%', '1/20', '1/15', 'Degrees only'], 0, 'Percent only, with + or −.'),
    ],
  },
  {
    section: TREES, extra: true, q: 'What are total, bole, merchantable and stump height?',
    a: [
      'Total: ground to the tip of the tree.',
      'Bole: ground to the crown point (first crown-forming branch).',
      'Merchantable: ground to the last usable portion.',
      'Stump: ground to the base of the stem when it is cut.',
      'Crown length: centre of the crown to the tip.',
    ],
    test: [
      mc('Ground to the first crown-forming branch is…', ['Bole height', 'Total height', 'Merchantable height', 'Stump height'], 0, 'Bole height ends at the crown point.'),
    ],
  },

  // ---- Tools ----
  ...TOOL_USES.map(([tool, use], i): StudyCard => ({
    section: TOOLS, q: `What is a ${tool} used for?`, a: [use],
    // Three other tools' uses as the wrong answers.
    test: [mc(`A ${tool} is used for…`, [use, ...[1, 2, 3].map((k) => TOOL_USES[(i + k * 3) % TOOL_USES.length][1])], 0, use)],
  })),
  {
    section: TOOLS, extra: true, q: 'What are a cant hook, peavey and increment hammer for?',
    a: ['Cant hook: roll / move a log on land.', 'Peavey: roll / move a log in water.', 'Increment hammer: determining recent growth.'],
    test: [
      mc('Which tool rolls a log in water?', ['Peavey', 'Cant hook', 'Hookeroon', 'Adze'], 0, 'Cant hook is on land.'),
    ],
  },

  // ---- Tree aging ----
  {
    section: AGING, q: 'Why age a tree?',
    a: [
      'Find the average age of a stand.',
      'See how quickly trees are growing.',
      'Show site quality: the average height of the dominant species at a given age.',
      'Predict the future monetary value at harvest.',
      'Predict the land’s productivity for trees and wildlife.',
    ],
    test: [
      multi('Select reasons to age a tree.', ['Average stand age', 'Growth rate', 'Site quality', 'Future value at harvest', 'Count the basal area'], [0, 1, 2, 3], 'Basal area comes from a prism.'),
      typed('Aging trees is called…', ['Dendrochronology'], 'Dendrochronology.'),
    ],
  },
  {
    section: AGING, q: 'What are the methods of aging a tree?',
    a: ['Felling the tree and counting stump rings.', 'Using an increment borer.', 'Counting branch whorls: only for a few species (Pw, Pr) when regenerating.'],
    test: [
      multi('Select the methods of aging.', ['Felling the tree', 'Increment borer', 'Counting whorls', 'Wedge prism'], [0, 1, 2], 'Prisms measure basal area.'),
    ],
  },
  {
    section: AGING, q: 'How do you use an increment borer, and where?',
    a: [
      'Parts: threaded bit, turning handle, core barrel, extractor spoon.',
      'Oil or wax the barrel to cut friction.',
      'Twist clockwise at stump height (24 cm, most common) or breast height (1.3 m).',
      'Keep it perpendicular to the bole and aim for the pith.',
      'Insert the extractor, turn one full turn counter-clockwise to break the core, and don’t force it.',
      'Count the rings: early wood + late wood = 1 annual ring (1 year).',
    ],
    test: [
      typed('The most common boring height is stump height. How many cm is that?', ['24'], '24 cm, or breast height (1.3 m).'),
      order('Put the increment borer steps in order.', ['Assemble the borer', 'Twist the barrel in clockwise', 'Insert the extractor spoon', 'One full turn counter-clockwise', 'Pull out the core', 'Count the rings'], 'Assemble, twist in, extractor, counter-twist, extract, age.'),
      mc('One annual ring is…', ['Early wood + late wood', 'Early wood only', 'Late wood only', 'Two dark bands'], 0, 'Early + late wood = 1 year.'),
    ],
  },
  {
    section: AGING, q: 'What is the pith, and what happens if you miss it?',
    a: [
      'The pith is the centre of the tree, the first year of growth.',
      'Through the pith: accurate age.',
      'Close to the pith: slightly inaccurate; estimate the years to the pith.',
      'Far from the pith: greatly inaccurate; bore again.',
      'Missing rings makes the tree read younger than it is.',
    ],
    test: [
      tf('Missing the pith makes a tree read younger.', true, 'You miss the innermost rings.'),
      mc('A core far from the pith should be…', ['Bored again', 'Used as is', 'Doubled', 'Halved'], 0, 'Greatly inaccurate: retry.'),
    ],
  },
  {
    section: AGING, q: 'What problems can you have with boring?',
    a: [
      'Missing the pith.', 'Hitting a branch stub or a scar.', 'Rotten or hollow heartwood.', 'A double pith.', 'Borer malfunctions or broken parts.',
      'Don’t bore in winter (frozen trees), avoid very hard hardwoods (Ew, Iw), and don’t bore dead trees: the borer may not come back out.',
    ],
    test: [
      multi('Select problems with boring.', ['Rotten heartwood', 'Hitting a branch stub', 'Double pith', 'Missing the pith', 'Too many rings'], [0, 1, 2, 3], 'From the Complications slide.'),
      tf('You should bore dead trees in the winter.', false, 'Frozen and dead trees can trap the borer.'),
    ],
  },

  // ---- Prisms ----
  {
    section: PRISMS, q: 'What are prisms, and what do they do?',
    a: [
      'Wedge prisms measure the basal area of trees from a centre point.',
      'The data is used to work out volumes, silvicultural treatments and future planning.',
    ],
    test: [
      mc('A wedge prism measures…', ['Basal area', 'Tree height', 'Tree age', 'Slope'], 0, 'Basal area from plot centre.'),
    ],
  },
  {
    section: PRISMS, q: 'What is basal area?',
    a: [
      'The cross-sectional area of a tree or group of trees at breast height (1.3 m).',
      'Measured in m²/ha (imperial ft²/acre).',
      'Shows site occupancy: how much “tree” is in the plot.',
    ],
    test: [
      mc('Basal area is measured in…', ['m²/ha', 'm³/ha', 'trees/ha', 'cm'], 0, 'm²/ha, or ft²/acre.'),
    ],
  },
  {
    section: PRISMS, q: 'How do you do a basal area plot, and why is it called variable radius?',
    a: [
      'Face north, hold the prism over plot centre, and sweep, calling each tree IN, OUT or BORDERLINE.',
      'BA (m²/ha) = (IN trees + every other borderline) × BAF.',
      'Variable radius: the distance a tree can be IN changes with its size. Small close trees can be OUT; big far trees can still be IN.',
    ],
    test: [
      mc('You start a prism sweep facing…', ['North', 'South', 'The biggest tree', 'Uphill'], 0, 'Face north.'),
      typed('You count 9 IN trees with a BAF 2 prism. What is the BA (m²/ha)?', ['18'], '9 × 2 = 18 m²/ha.'),
      typed('7 IN trees and 2 borderline trees, BAF 3. What is the BA (m²/ha)?', ['24'], 'Count every other borderline: (7 + 1) × 3 = 24 m²/ha.'),
    ],
  },
  {
    section: PRISMS, q: 'How do you tell IN, OUT and BORDERLINE trees?',
    a: [
      'IN: the displaced image through the prism still touches the tree above and below.',
      'OUT: the displaced image is disconnected from the tree.',
      'BORDERLINE: the edge of the image lines up exactly. Count every second one IN; the first is IN.',
    ],
    test: [
      mc('The displaced image is completely separate from the tree. The tree is…', ['OUT', 'IN', 'BORDERLINE', 'Double counted'], 0, 'Disconnected = OUT.'),
      tf('The first borderline tree in a stand is counted IN.', true, 'Then every second one.'),
    ],
  },
  {
    section: PRISMS, q: 'What is the BAF?',
    a: [
      'Basal Area Factor: set by the angle of light refraction the prism makes.',
      'It is marked on the prism case or etched on the prism (BAF 2, 3, 4).',
      'Limiting distance charts give the furthest a tree can be from centre and still be IN, from its DBH.',
    ],
    test: [
      mc('The BAF is determined by…', ['The prism’s angle of refraction', 'The tree’s DBH', 'The plot size', 'The stand age'], 0, 'Refraction angle.'),
    ],
  },
  {
    section: PRISMS, q: 'How do you hold a prism properly?',
    a: [
      'Perpendicular to the face of the tree in both the horizontal and vertical planes.',
      'Tilt it back and forth to find the least displacement.',
      'Keep the prism (not your eye) over plot centre. The same rules as DBH apply (leans, point of germination).',
    ],
    test: [
      tf('The prism should be held perpendicular to the tree in both planes.', true, 'Tilt to find the least displacement.'),
    ],
  },
  {
    section: PRISMS, q: 'What are the common errors with prisms?',
    a: [
      'Prism not over plot centre.', 'Hidden trees.', 'Missing a large tree in the distance.', 'Prism not aligned vertically or horizontally.',
      'Guessing at borderline trees.', 'Not finishing a full sweep.', 'Double counting.', 'Viewing the tree above DBH.', 'Counting dead trees.',
    ],
    test: [
      multi('Select the common prism errors.', ['Prism not over plot centre', 'Hidden trees', 'Double counting', 'Counting dead trees', 'Facing north to start'], [0, 1, 2, 3], 'Facing north is correct.'),
    ],
  },
];

const SORTS: SortDrill[] = [
  {
    id: 'quadrant', title: 'Which quadrant?', prompt: 'Sort each azimuth into its quadrant.',
    bins: ['NE', 'SE', 'SW', 'NW'],
    items: [
      { label: '40°', bin: 'NE' }, { label: '89°', bin: 'NE' },
      { label: '100°', bin: 'SE' }, { label: '170°', bin: 'SE' },
      { label: '195°', bin: 'SW' }, { label: '250°', bin: 'SW' },
      { label: '290°', bin: 'NW' }, { label: '315°', bin: 'NW' },
    ],
  },
  {
    id: 'prism', title: 'IN, OUT or BORDERLINE?', prompt: 'What does the displaced image through the prism look like?',
    bins: ['IN', 'OUT', 'BORDERLINE'],
    items: [
      { label: 'Image overlaps the tree', bin: 'IN' },
      { label: 'Image still touches the tree above and below', bin: 'IN' },
      { label: 'Image is disconnected from the tree', bin: 'OUT' },
      { label: 'Image has a gap between it and the tree', bin: 'OUT' },
      { label: 'Image edge lines up exactly with the tree edge', bin: 'BORDERLINE' },
    ],
  },
  {
    id: 'tally', title: 'Which tally method?', prompt: 'Which tally method is used for each job?',
    bins: ['A (slash)', 'B', 'C (dot)'],
    items: [
      { label: 'Chaining', bin: 'A (slash)' },
      { label: 'Scaling logs', bin: 'B' },
      { label: 'Scaling lumber', bin: 'B' },
      { label: 'Timber cruising', bin: 'C (dot)' },
      { label: 'Inventory plots', bin: 'C (dot)' },
    ],
  },
  {
    id: 'tools', title: 'What does it measure?', prompt: 'Sort each tool by what it is used for.',
    bins: ['Diameter', 'Height / slope', 'Age / growth', 'Basal area', 'Distance'],
    items: [
      { label: 'Calipers', bin: 'Diameter' }, { label: 'D-tape', bin: 'Diameter' },
      { label: 'Suunto', bin: 'Height / slope' }, { label: 'Haga', bin: 'Height / slope' }, { label: 'Abney level', bin: 'Height / slope' }, { label: 'Clinometer', bin: 'Height / slope' },
      { label: 'Increment borer', bin: 'Age / growth' }, { label: 'Increment hammer', bin: 'Age / growth' },
      { label: 'Wedge prism', bin: 'Basal area' },
      { label: 'Chain rope', bin: 'Distance' }, { label: 'Hip chain', bin: 'Distance' },
    ],
  },
];

const RANKS: RankDrill[] = [
  {
    id: 'prism-plot', title: 'Basal area plot steps', prompt: 'Put the steps of a basal area plot in order.',
    order: ['Face north', 'Hold the prism over plot centre', 'Sweep and call each tree IN, OUT or BORDERLINE', 'Add up the IN trees (every other borderline)', 'Multiply by the BAF'],
    explain: 'BA (m²/ha) = IN trees × BAF.',
  },
  {
    id: 'pith', title: 'Core accuracy', prompt: 'Most accurate age at the top.',
    order: ['Core through the pith', 'Core close to the pith', 'Core far from the pith'],
    explain: 'Close to the pith: estimate the missing years. Far: bore again.',
  },
];

export const FOREST_ENVIRONMENT: StudyGuide = {
  id: 'forest-environment', sections: [CHAIN, MAPS, COMPASS, TREES, TOOLS, AGING, PRISMS], allLabel: 'All topics',
  cards: CARDS, sorts: SORTS, ranks: RANKS,
};
