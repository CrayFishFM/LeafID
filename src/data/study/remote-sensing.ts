/**
 * Remote Sensing midterm review, from the course's midterm review sheet (October 2026), checked against
 * the Week 1, 2, 3, 5 and 6 lectures and Ben Gwilliam's (OWA) guest presentation. `check` marks an answer that is
 * not straight from the notes, so students know to confirm it against the lecture.
 */

import type { RankDrill, SortDrill, StudyCard, StudyGuide, TestQuestion } from './types';

const WEEKS = ['Week 1', 'Week 2', 'Weeks 3 & 4', 'Weeks 5 & 6'];

const CARDS: StudyCard[] = [
  // ---- Week 1 ----
  {
    n: 1, section: 'Week 1', q: 'Define remote sensing in your own words.',
    a: [
      'Detecting, identifying and analysing objects or features with imaging devices or sensors from a remote position.',
      'Tools like cameras, LiDAR, drones and satellites get data about an area or forest stand without being on the ground.',
    ],
  },
  {
    n: 2, section: 'Week 1', q: 'What are the 5 main advantages of remotely sensed images/data over on-the-ground observations?',
    a: [
      'Improved vantage point: a bird’s-eye view, the “big picture”.',
      'Capability to stop action: view dynamic conditions like forest fires, floods and animal migrations.',
      'Permanent recording: can be used later, compared with others, and used to see changes over time.',
      'Broadened spectral sensitivity: records wavelengths about twice as broad as the human eye (infrared and ultraviolet).',
      'Increased spatial resolution and geometric fidelity: with proper ground reference data, accurate measurements of position, distance, direction, area, heights, volumes and slopes. Essential to GIS.',
    ],
  },
  {
    n: 3, section: 'Week 1', q: 'Define spatial resolution in your own words.',
    a: [
      'The number of pixels (raster cells) in an image. Resolution is often identified by the width and height of an image as well as the total number of pixels in the image.',
      'Smaller pixels = higher resolution = more detail.',
    ],
  },
  {
    n: 4, section: 'Week 1', q: 'What is the difference between an active and a passive sensor?',
    a: [
      'Passive sensors measure reflected sunlight: when the sun shines, they measure that energy (e.g. a camera without a flash).',
      'Active sensors have their own source of light or energy: they send out a pulse and measure what is reflected back (e.g. LiDAR, radar).',
    ],
  },
  {
    n: 5, section: 'Week 1', q: 'What is photogrammetry?',
    a: [
      'The science and technology of obtaining reliable information about physical objects and the environment by recording, measuring and interpreting photographic images, patterns and other phenomena.',
      'Using photographs to make topographic maps was first considered in 1840.',
    ],
  },
  {
    n: 6, section: 'Week 1', q: 'What makes a photo or map small, medium or large scale?',
    a: [
      'The scale ratio. It is “flipped” from what you might expect:',
      'Large scale (e.g. 1:5,000) = close up. Everything looks large, small area, lots of detail.',
      'Small scale (e.g. 1:250,000) = far away. Everything looks small, large area, little detail.',
      'Read the ratio as a fraction: 1/5,000 is bigger than 1/250,000, so 1:5,000 is the larger scale.',
    ],
  },
  {
    n: 7, section: 'Week 1', q: 'Name at least 5 modes or platforms used to acquire remotely sensed data.',
    a: ['Satellites', 'High-altitude aircraft', 'Low-altitude aircraft', 'Helicopters', 'Drones / unmanned air vehicles (UAVs)', 'Ground technology and observation (e.g. fire towers, hand-held LiDAR)'],
  },
  { n: 8, section: 'Week 1', q: 'Is a camera a sensor?', a: ['Yes. A camera is a (passive) sensor.'] },
  {
    n: 9, section: 'Week 1', q: 'What are the main satellite platforms used in remote sensing, and what do their abbreviations stand for?',
    a: [
      'Landsat: NASA, the longest-running program (since 1972).',
      'SPOT: Satellite Pour l’Observation de la Terre. French, commercial.',
      'Sentinel-2: multispectral. Revisits the same spot every 8 days; free imagery at 10 m resolution.',
      'NOAA: National Oceanic and Atmospheric Administration. Weather and coastal applications.',
      'RADARSAT: Canadian radar technology, used for terrain mapping.',
      'Google Earth: not a satellite. It aggregates imagery from several sources (it sold its satellites to Planet Inc.).',
    ],
  },
  {
    n: 10, section: 'Week 1', q: 'What scales of imagery are flown in Ontario, and where?',
    a: [
      '1:20,000 in Northern Ontario: north of the French and Mattawa Rivers.',
      '1:10,000 in Southern Ontario: south of the French and Mattawa Rivers.',
      'Both are flown with the ADS40 digital camera.',
      '1:15,840 (4 inches = 1 mile) is the older imperial scale, still used in some places but not for much longer.',
    ],
  },
  {
    n: 11, section: 'Week 1', q: 'What is a “photographic day”?',
    a: ['A day with 10% cloud cover or less, relatively calm, and with an acceptable sun angle.'],
  },
  {
    n: 12, section: 'Week 1', q: 'What is a photo mosaic?',
    a: [
      'A set of images lined up and georeferenced together into one seamless, continuous view of an area.',
      'Ontario’s FRI imagery is delivered as seamless ortho mosaic tiles, each a quarter of an OBM tile (5 km × 5 km).',
    ],
  },
  { n: 13, section: 'Week 1', q: 'What does LiDAR stand for?', a: ['Light Detection and Ranging.'] },
  {
    n: 14, section: 'Week 1', q: 'Define LiDAR in your own words.',
    a: [
      'Uses pulsed laser light to measure distances to the earth.',
      'Differences in laser return times and wavelengths make a digital 3D model of the target (a point cloud of the forest structure and the ground).',
      'Used from the ground (terrestrial), the air (airborne) and vehicles (mobile).',
    ],
  },
  {
    n: 15, section: 'Week 1', q: 'Is Google Earth Pro a useful tool for people working in forestry? Give at least two reasons.',
    a: [
      'Example answer: No. The software is outdated and has been passed by more powerful free software.',
      'It doesn’t have the tools a professional forester needs today.',
    ],
    opinion: true,
  },

  {
    section: 'Week 1', extra: true, q: 'What is the difference between accuracy and precision?',
    a: [
      'Accuracy: how far a measurement is from the location’s true value.',
      'Precision: how much the measurements vary when the same location is measured again and again with the same device.',
    ],
  },
  {
    section: 'Week 1', extra: true, q: 'Why are forestry photos taken “vertical”, and what does that mean?',
    a: ['The camera axis is tilted no more than 3° from vertical.', 'They look like a map, and you can see them in 3D with a stereoscope.'],
  },
  {
    section: 'Week 1', extra: true, q: 'Which type of photo contrast is used for forest inventory in Ontario, and why?',
    a: [
      'Low contrast: tones range from light to dark grey.',
      'It gives better detail (resolution) for telling tree species apart, although it can be harder to use in the field.',
    ],
  },
  {
    section: 'Week 1', extra: true, q: 'What are the advantages and disadvantages of imaging radar?',
    a: [
      'Advantages: works beyond the photographic spectrum; data sent by radio; some near real time; works in all weather, day or night; very fine resolution (10 × 10 cm).',
      'Disadvantages: more complex, more expensive (including processing), more training and computer knowledge needed.',
    ],
  },

  // ---- Week 2 ----
  {
    n: 16, section: 'Week 2', q: 'Give at least two key reasons why we orthorectify remotely sensed images.',
    a: [
      'To remove the effects of image perspective (tilt) and relief (terrain), plus optical distortion from the sensor, so features are shown in their true positions at a constant (uniform) scale.',
      'So it can be used in a GIS: raw imagery can’t be used until every pixel is in an accurate (x, y) position on the ground. The orthorectified image follows a map projection and can be accurately overlaid with other data layers (and used to digitize them).',
      'Orthorectification needs a sensor model, the sensor’s location and orientation for every image, and an accurate terrain model.',
    ],
  },
  { n: 17, section: 'Week 2', q: 'What is the standard map projection system used in Ontario?', a: ['UTM: Universal Transverse Mercator.'] },
  {
    n: 18, section: 'Week 2', q: 'What UTM zone is Pembroke in?',
    a: ['Zone 18.', 'The earth is split into 60 zones, each 6° of longitude wide.'],
  },
  {
    n: 19, section: 'Week 2', q: 'What is the main reason we use map projections?',
    a: [
      'To flatten the earth onto a 2D map so locations can be measured and communicated accurately.',
      'It standardizes data so large groups of people can coordinate operations, and it is easier to use: metres instead of degrees.',
      'It is also what imagery is corrected to during orthorectification.',
    ],
  },
  { n: 20, section: 'Week 2', q: 'What units are UTM coordinates in?', a: ['Metres.'] },
  { n: 21, section: 'Week 2', q: 'Describe a Northing coordinate.', a: ['Metres measured north from the equator.'] },
  {
    n: 22, section: 'Week 2', q: 'Describe an Easting coordinate.',
    a: [
      'Metres measured from the central meridian of the zone.',
      'The central meridian is set to 500,000 m, so points west of it are under 500,000 and points east are over.',
    ],
  },
  {
    n: 23, section: 'Week 2', q: 'What are the instructor’s 5 key components of a functional GIS?',
    a: [
      'People: the most important, they have to be trained to use it.',
      'Data: next most important, without it the GIS is useless.',
      'Software',
      'Applications',
      'Hardware: least important, it changes often.',
    ],
  },
  {
    n: 24, section: 'Week 2', q: 'Name the four types of spatial data found in a GIS.',
    a: [
      'Points',
      'Lines (arcs or vectors)',
      'Polygons',
      'Regions: “super” or discontiguous polygons, e.g. harvest blocks that are adjacent but not quite touching.',
      'This is vector data. Spatial data can also be raster (a grid of pixels, as in imagery), which is being used more in forestry now.',
    ],
  },
  {
    n: 25, section: 'Week 2', q: 'What is attribute data in a GIS?',
    a: [
      'Attribute (tabular) data: the descriptors of each spatial data item, stored in a table (e.g. a forest stand polygon’s species, age and height).',
      'A GIS has two main types of data: spatial (geographically referenced) and attribute.',
    ],
  },
  {
    n: 26, section: 'Week 2', q: 'Give forestry examples of GIS points, lines, polygons and regions.',
    a: [
      'Points: water crossings (culverts and bridges), raptor nests, mineral licks, trappers’ cabins.',
      'Lines: creeks and streams, roads (primary, secondary, tertiary), railway and power lines, seismic lines.',
      'Polygons: forest stands (FRI), lakes and rivers, harvest blocks, tree plant areas, protected areas (AOCs).',
      'Regions: harvest blocks adjacent but not quite touching; twin lakes with a very small narrows between; near-identical stands that don’t quite touch.',
    ],
  },
  {
    n: 27, section: 'Week 2', q: 'What does FRI stand for, and what is it?',
    a: [
      'Forest Resource Inventory.',
      'Comprehensive data on tree species and stand composition, range, age and distribution, plus forest, ecological and land-use conditions.',
      'Forest stands are polygons in a GIS, delineated by trained technicians using 3D on-screen stereoscopy, with plenty of ground plots for calibration and validation.',
    ],
  },
  {
    n: 28, section: 'Week 2', q: 'Give at least five FRI tree species codes.',
    a: ['Pw: white pine', 'Pj: jack pine', 'Pl: largetooth aspen', 'Mh: hard (sugar) maple', 'Ms: silver maple', 'Mr: red maple'],
  },
  {
    n: 29, section: 'Week 2', q: 'Give at least two good reasons why we use FRI tree species codes.',
    a: [
      'They standardize the system, so everyone knows which tree you mean.',
      'They are quick and easy to use when collecting data.',
      'They display on maps more easily.',
    ],
  },
  {
    n: 30, section: 'Week 2', q: 'Name at least three important uses of FRI data.',
    a: [
      'Forest management planning (the big picture).',
      'Growth and yield analysis / timber supply modelling, e.g. calculating volume available for harvest.',
      'Spatial modelling: harvest sequencing, road network optimization, habitat supply.',
      'Road planning, building and maintenance; road and block layout.',
      'Protecting AOCs, areas of natural and scientific interest and species at risk through buffering.',
      'Annual work planning, day-to-day operations, tree marking, monitoring.',
    ],
  },
  {
    n: 31, section: 'Week 2', q: 'What does OBM stand for?',
    a: [
      'Ontario Base Map: general topographic coverage (relief, drainage, buildings, roads, railways…) that FRI is built on, like another OBM layer.',
      'Projected in UTM; sheets were clipped at 10 km × 10 km. Now replaced by Foundational Geospatial Data (seamless).',
    ],
  },
  {
    n: 32, section: 'Week 2', q: 'What is an Area of Concern (AOC)?',
    a: ['A geographic area within an area of operations, next to an identified natural resource feature, land use or value that may be affected by forest management activities.'],
  },
  {
    n: 33, section: 'Week 2', q: 'Are non-timber values important in forest management? How are they identified?',
    a: [
      'Yes. They become a key part of the FRI, often kept in a separate (sometimes confidential) GIS layer.',
      'Identified during planning and operations by the Local Citizens Committee, First Nation communities, employees, special interest groups, other ministries, and remote sensing.',
    ],
  },
  {
    n: 34, section: 'Week 2', q: 'What is an operational timing restriction, and where might it apply?',
    a: [
      'An AOC prescription that limits WHEN operations can happen (e.g. no work near a raptor nest during nesting season).',
      'AOC prescriptions can include no-harvest buffers, timing restrictions, or both.',
    ],
  },

  // ---- Weeks 3 & 4 ----
  {
    n: 35, section: 'Weeks 3 & 4', q: 'How do you find the azimuth and ground distance of a cruise line drawn on a photo?',
    a: [
      'An azimuth is an angle measured clockwise from true north, 0° to 360°: 0° north, 90° east, 180° south, 270° west.',
      'Put the compass or protractor on the start of the line with north at the top of the photo and read clockwise to the line.',
      'Ground distance: measure the line in cm on the photo, multiply by the scale number, then convert cm to m (÷ 100).',
    ],
  },
  {
    n: 36, section: 'Weeks 3 & 4', q: 'On a 1:10,000 photo, how far on the ground is 5 cm on the photo?',
    a: ['5 cm × 10,000 = 50,000 cm on the ground.', '50,000 cm ÷ 100 = 500 m.'],
  },
  {
    n: 36, section: 'Weeks 3 & 4', q: 'Two intersections are 20 cm apart on a photo and 2 km apart on the ground. What is the photo scale?',
    a: ['2 km × 1,000 = 2,000 m; × 100 = 200,000 cm on the ground.', '200,000 cm ÷ 20 cm = 10,000.', 'Scale = 1:10,000.'],
  },

  {
    section: 'Weeks 3 & 4', extra: true, q: 'What is declination, and how do you use it?',
    a: [
      'The angle between where the compass needle points (magnetic north) and true north, because the earth’s magnetic field isn’t lined up with its rotation axis.',
      'Negative = west: magnetic north is west of true north. Pembroke is about −12° (west).',
      'Set the declination on your compass so it reads true north instead of magnetic north.',
    ],
  },
  {
    section: 'Weeks 3 & 4', extra: true, q: 'What is a vector? What is a chevron?',
    a: [
      'A vector has both a magnitude (length) and a direction: a directed line segment, like each leg of a route.',
      'A chevron is a V-shaped symbol that shows the direction of travel along a vector.',
    ],
  },
  {
    section: 'Weeks 3 & 4', extra: true, q: 'How long is a chain?',
    a: ['1 chain = 66 feet = 20.12 metres.'],
  },

  // ---- Weeks 5 & 6 ----
  {
    n: 37, section: 'Weeks 5 & 6', q: 'What are the main forest regions of Ontario, and which region is Pembroke in?',
    a: [
      'Boreal: about 50% of Ontario.',
      'Hudson Bay Lowlands: about 26%.',
      'Great Lakes–St. Lawrence: about 20%. Pembroke is here.',
      'Deciduous (Carolinian): about 3%.',
    ],
  },
  {
    n: 37, section: 'Weeks 5 & 6', q: 'Where do the common commercial species usually occur (site)?',
    a: [
      'Jack pine: dry, sandy sites and ridges. Red pine: dry, sandy. White pine: dry upland.',
      'Black spruce: moist lowlands and bogs, often with white spruce, which sits on moist lower slopes.',
      'Balsam fir: moist, low-lying. Hemlock: moist, well-drained lower slopes. Cedar and larch: lowland swamps, fresh hillsides, dry ledges.',
      'Sugar maple: fresh, well-drained. Red oak: fresh upper slopes, loamy rocky sites. Yellow birch: moist valleys.',
      'Balsam poplar, black ash, black cherry, alder and willow: deep, moist bottomland soils.',
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'What characteristics do you use to identify trees from a distance or on aerial imagery?',
    a: [
      'Crown shape, branching habits, silhouettes (shadows), colour (tone) and crown texture.',
      'Also: soil and site, common species associations, pure vs mixed stands, succession and stand history, and damage or disease.',
      'Use the FRI species codes. Species ID on small-scale photos is “more of an art than a science”.',
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Eastern white pine (Pw) from the air?',
    a: ['Crown shape: large “wheel-spoke”, explosion or octopus shape.', 'Branching: prominent, overlapping big branches, wind-swept.', 'Colour: light, flat green. Texture: coarse.', 'Site: dry upland.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Red pine (Pr) from the air?',
    a: ['Crown shape: large, circular “pom-pom”.', 'Branching: well-defined, open branches.', 'Colour: dark, flat green. Texture: small clumps.', 'Site: dry, sandy.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Jack pine (Pj) from the air?',
    a: ['Crown shape: small, irregular, pointed.', 'Branching: thin, open branches.', 'Colour: dark green, sometimes a red hue. Texture: smooth, fuzzy.', 'Site: dry, sandy, ridges.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Balsam fir (Bf) from the air?',
    a: ['Crown shape: narrow, symmetrical, pointed cone.', 'Branching: dense but less prominent than white spruce.', 'Colour: shiny, dense, dark green. Texture: smooth.', 'Site: moist, low-lying.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise White spruce (Sw) from the air?',
    a: ['Crown shape: large cone.', 'Branching: well-defined, prominent branches.', 'Colour: dark green. Texture: coarse.', 'Site: moist lower slopes.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Black spruce (Sb) from the air?',
    a: ['Crown shape: slender, pointed.', 'Branching: well-defined, prominent branches.', 'Colour: dark green. Texture: fairly smooth.', 'Site: moist lowlands, bogs.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Eastern hemlock (He) from the air?',
    a: ['Crown shape: oval cone with a point.', 'Branching: large individual branches.', 'Colour: shiny dark green. Texture: tight layers.', 'Site: moist, well-drained lower slopes.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Eastern white cedar (Cw) from the air?',
    a: ['Crown shape: small cone.', 'Branching: dense, thick branches.', 'Colour: shiny dark green. Texture: smooth.', 'Site: lowland swamps, fresh hillsides, dry ledges.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Larch / tamarack (La) from the air?',
    a: ['Crown shape: narrow pyramidal cone.', 'Branching: columnar branches.', 'Colour: light. Texture: coarse.', 'Site: lowland swamps, fresh hillsides, dry ledges.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Sugar maple (Mh) from the air?',
    a: ['Crown shape: large, irregular, open, billowy oval.', 'Branching: columnar branches.', 'Colour: light tone compared with associates. Texture: coarse.', 'Site: fresh, well-drained.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Red maple (Mr) from the air?',
    a: ['Crown shape: medium, closed, tufted oval.', 'Branching: fine branches and twigs.', 'Colour: light tone compared with associates. Texture: smooth.', 'Site: moist to fresh, well-drained.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise White birch (Bw) from the air?',
    a: ['Crown shape: small, irregular, open clumps showing branches.', 'Branching: fine, light-coloured branches and twigs.', 'Colour: dark tone. Texture: smooth.', 'Site: moist to fresh, well-drained.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Yellow birch (By) from the air?',
    a: ['Crown shape: irregular, finely tufted.', 'Branching: compact.', 'Colour: very dark. Texture: coarse.', 'Site: moist valleys, occasionally dry.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise American beech (Be) from the air?',
    a: ['Crown shape: large, irregular, open, billowy oval.', 'Branching: columnar branches.', 'Colour: dark blue-green. Texture: smooth.', 'Site: well-drained slopes and ledges.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Red oak (Or) from the air?',
    a: ['Crown shape: compact and billowy.', 'Branching: prominent branches.', 'Colour: dark. Texture: velvety smooth.', 'Site: fresh upper slopes, loamy rocky sites.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Trembling and largetooth aspen (Pt, Pl) from the air?',
    a: ['Crown shape: rounded, open, billowy oval.', 'Branching: light-coloured branches and twigs.', 'Colour: light tone. Texture: fine.', 'Site: fresh to dry.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Balsam poplar (Pb) from the air?',
    a: ['Crown shape: narrow, tufted, with a point.', 'Branching: light-coloured branches and twigs.', 'Colour: light tone. Texture: coarse.', 'Site: deep, moist bottomland soils.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Black ash (Ab) from the air?',
    a: ['Crown shape: narrow, irregular, open.', 'Branching: thick, ascending twigs.', 'Colour: light green. Texture: fuzzy.', 'Site: deep, moist bottomlands, swamps, beaver meadows.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Black cherry (Cb) from the air?',
    a: ['Crown shape: irregular, rounded.', 'Branching: thin, compact.', 'Colour: very dark. Texture: very smooth.', 'Site: deep, moist bottomlands and low slopes.'],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Alder and willow (AL, Wi) from the air?',
    a: ['Crown shape: large, billowy.', 'Branching: dense, drooping.', 'Colour: light tone. Texture: fuzzy.', 'Site: deep, moist lowland soils.'],
  },
  {
    n: 40, section: 'Weeks 5 & 6', q: 'How does terrestrial (hand-held) LiDAR work, and what are its advantages and best uses?',
    a: [
      'LiDAR is an active sensor: it sends out laser light and times the returns to measure the 3D structure of the terrain and objects.',
      'Terrestrial LiDAR does this from the ground: stationary, backpack-mounted (e.g. a GeoSLAM unit) or low on a UAV.',
      'Advantages: cheaper than flying planes or helicopters, and much denser, more detailed point clouds.',
      'Best uses: detail under the canopy and on individual trees. Combined with aerial LiDAR and drone imagery it points toward individual tree inventories.',
    ],
  },
];

// ---- Practice test ----


const TEST: TestQuestion[] = [
  { q: 'An azimuth is measured…', choices: ['Counter-clockwise from true north', 'Clockwise from true north', 'Clockwise from magnetic east', 'From the equator'], answer: 1, why: 'Clockwise from true north, 0–360°: 90° = east, 180° = south, 270° = west.' },
  { q: 'Pembroke’s declination is about −12°. That means magnetic north is…', choices: ['12° east of true north', '12° west of true north', 'The same as true north', '12° south'], answer: 1, why: 'Negative declination = west.' },
  { q: 'One chain is…', choices: ['10 m', '20.12 m (66 ft)', '33 ft', '100 m'], answer: 1, why: '1 chain = 66 feet = 20.12 metres.' },
  { q: 'Harvest blocks that are adjacent but not quite touching are stored in a GIS as a…', choices: ['Point', 'Line', 'Region', 'Raster'], answer: 2, why: 'A region is a “super” or discontiguous polygon.' },
  { q: 'Which is a GIS POINT feature in the lecture’s forestry examples?', choices: ['Seismic line', 'Mineral lick', 'Harvest block', 'Power line'], answer: 1, why: 'Points: water crossings, raptor nests, mineral licks, trappers’ cabins.' },
  { q: 'Which conifer has a large circular “pom-pom” crown from the air?', choices: ['White pine', 'Red pine', 'Jack pine', 'Black spruce'], answer: 1, why: 'Red pine: pom-pom crown, dark flat green, dry sandy sites. White pine is the “wheel-spoke” / octopus.' },
  { q: 'A slender, pointed conifer crown in a bog is most likely…', choices: ['Black spruce', 'White pine', 'Red oak', 'Sugar maple'], answer: 0, why: 'Black spruce: slender pointed crown, moist lowlands and bogs.' },
  { q: 'Balsam fir’s crown is…', choices: ['A wheel-spoke shape', 'Narrow, symmetrical and pointed', 'A billowy oval', 'A pom-pom'], answer: 1, why: 'Narrow conical, symmetrical pointed crown; shiny dark green; moist low-lying sites.' },
  { q: 'Which of these is an active sensor?', choices: ['A camera without a flash', 'LiDAR', 'The human eye', 'Passive sonar'], answer: 1, why: 'LiDAR sends out its own light pulses and measures what comes back.' },
  { q: 'Which photo has the largest scale?', choices: ['1:20,000', '1:15,840', '1:10,000', '1:5,000'], answer: 3, why: '1/5,000 is the biggest fraction. Large scale = close up, more detail.' },
  { q: 'What does LiDAR stand for?', choices: ['Light Detection and Ranging', 'Laser Imaging Data and Radar', 'Light Imaging, Distance and Return', 'Low-altitude Imaging Data Relay'], answer: 0, why: 'Light Detection and Ranging.' },
  { q: 'Which is the longest-running satellite program?', choices: ['SPOT', 'Landsat', 'Sentinel-2', 'RADARSAT'], answer: 1, why: 'Landsat (NASA), running since 1972.' },
  { q: 'What scale of imagery is flown in northern Ontario?', choices: ['1:5,000', '1:10,000', '1:15,840', '1:20,000'], answer: 3, why: 'North of the French and Mattawa Rivers: 1:20,000. South: 1:10,000.' },
  { q: 'A “photographic day” has cloud cover of…', choices: ['10% or less', '25% or less', '50% or less', 'No limit, as long as it is sunny'], answer: 0, why: '10% cloud cover or less, relatively calm, with an acceptable sun angle.' },
  { q: 'What is the standard map projection in Ontario?', choices: ['Lambert Conformal Conic', 'UTM', 'Web Mercator', 'Latitude / longitude'], answer: 1, why: 'Universal Transverse Mercator.' },
  { q: 'Which UTM zone is Pembroke in?', choices: ['15', '16', '17', '18'], answer: 3, why: 'Pembroke is at about 77°W, inside zone 18 (78°W–72°W).' },
  { q: 'How wide is each UTM zone?', choices: ['3° of longitude', '6° of longitude', '10° of longitude', '6° of latitude'], answer: 1, why: '60 zones × 6° = 360°.' },
  { q: 'The central meridian of every UTM zone has an Easting of…', choices: ['0 m', '100,000 m', '500,000 m', '1,000,000 m'], answer: 2, why: 'It is set to 500,000 m so every Easting in the zone is positive.' },
  { q: 'A Northing is measured…', choices: ['In degrees from the prime meridian', 'In metres from the equator', 'In metres from the North Pole', 'In metres from the central meridian'], answer: 1, why: 'Northing = metres north of the equator.' },
  { q: 'According to the instructor, which GIS component is the most important?', choices: ['Hardware', 'Software', 'Data', 'People'], answer: 3, why: 'People, then data. Hardware matters least because it changes often.' },
  { q: 'A road in a GIS is best stored as a…', choices: ['Point', 'Line', 'Polygon', 'Attribute'], answer: 1, why: 'Roads and boundary limits are lines.' },
  { q: 'An Area of Concern (AOC) is best stored as a…', choices: ['Point', 'Line', 'Polygon', 'Raster band'], answer: 2, why: 'AOCs and harvest areas cover an area, so they are polygons.' },
  { q: 'What does FRI stand for?', choices: ['Forest Resource Inventory', 'Forest Region Index', 'Field Record of Inventory', 'Forest Reserve Information'], answer: 0, why: 'Forest Resource Inventory.' },
  { q: 'What does OBM stand for?', choices: ['Ontario Boundary Map', 'Ontario Base Map', 'Operational Block Map', 'Official Base Mapping'], answer: 1, why: 'Ontario Base Map.' },
  { q: 'What does SPOT stand for?', choices: ['Satellite Pour l’Observation de la Terre', 'Spectral Positioning of Terrain', 'Satellite Photography of Terrain', 'Space Platform for Observation and Tracking'], answer: 0, why: 'It is a French satellite: Satellite Pour l’Observation de la Terre.' },
  { q: 'Which FRI code is jack pine?', choices: ['Pw', 'Pr', 'Pj', 'Pl'], answer: 2, why: 'Pj = jack pine. Pw = white pine, Pr = red pine, Pl = largetooth aspen.' },
  { q: 'Which forest region is Pembroke in?', choices: ['Boreal', 'Great Lakes–St. Lawrence', 'Deciduous (Carolinian)', 'Hudson Bay Lowlands'], answer: 1, why: 'Great Lakes–St. Lawrence.' },
  { q: 'Jack pine generally grows on…', choices: ['Wet, organic bogs', 'Dry, sandy sites', 'Rich, moist valley bottoms', 'Rocky shorelines only'], answer: 1, why: 'Jack pine: dry, sandy sites. Black spruce takes the bogs.' },
  { q: 'On a 1:10,000 photo, 5 cm is how far on the ground?', choices: ['50 m', '500 m', '5 km', '50 km'], answer: 1, why: '5 × 10,000 = 50,000 cm = 500 m.' },
  { q: 'Why do we orthorectify imagery?', choices: ['To add colour to black-and-white photos', 'To georeference it and remove distortion', 'To compress the file size', 'To increase cloud cover'], answer: 1, why: 'It removes tilt and terrain (relief) distortion so every pixel is in its true (x, y) position at a constant scale, ready for GIS.' },
  { q: 'Orthorectification removes the effects of…', choices: ['Cloud cover and haze', 'Image perspective (tilt) and relief (terrain)', 'Seasonal leaf colour', 'Low contrast'], answer: 1, why: 'Tilt and relief (plus sensor optical distortion), giving a planimetric image at a constant scale.' },
  { q: 'What is a photo mosaic?', choices: ['A single satellite image', 'Several images lined up and georeferenced into one view', 'A false-colour image', 'A LiDAR point cloud'], answer: 1, why: 'Images joined and georeferenced into one continuous view.' },
  { q: 'Is a camera a sensor?', choices: ['Yes', 'No', 'Only digital cameras', 'Only with a flash'], answer: 0, why: 'Yes: a passive sensor.' },
  { q: 'A big advantage of terrestrial (hand-held) LiDAR over airborne LiDAR is…', choices: ['It covers more area per day', 'It is cheaper and gives much denser point clouds', 'It works through cloud from space', 'It needs no software'], answer: 1, why: 'Cheaper than flying, with much more detailed point clouds.' },
];

// ---- Sorting drills ----


const SORTS: SortDrill[] = [
  {
    id: 'sensors', title: 'Active or passive?', prompt: 'Does the sensor send out its own energy, or record energy that is already there?',
    bins: ['Active', 'Passive'],
    items: [
      { label: 'LiDAR', bin: 'Active' },
      { label: 'Radar (RADARSAT)', bin: 'Active' },
      { label: 'Sonar', bin: 'Active' },
      { label: 'Camera without a flash', bin: 'Passive' },
      { label: 'Passive sonar', bin: 'Passive' },
      { label: 'Multispectral satellite (Sentinel-2)', bin: 'Passive' },
      { label: 'Imaging radar (SLAR)', bin: 'Active' },
    ],
  },
  {
    id: 'gis', title: 'Point, line, polygon or region?', prompt: 'How would you store each of these in a GIS? (Examples from the Week 2 lecture.)',
    bins: ['Point', 'Line', 'Polygon', 'Region'],
    items: [
      { label: 'Raptor nest', bin: 'Point' },
      { label: 'Culvert (water crossing)', bin: 'Point' },
      { label: 'Mineral lick', bin: 'Point' },
      { label: 'Road', bin: 'Line' },
      { label: 'Creek', bin: 'Line' },
      { label: 'Seismic line', bin: 'Line' },
      { label: 'Forest stand (FRI)', bin: 'Polygon' },
      { label: 'Harvest block', bin: 'Polygon' },
      { label: 'Area of Concern (AOC)', bin: 'Polygon' },
      { label: 'Twin lakes joined by a tiny narrows', bin: 'Region' },
      { label: 'Adjacent harvest blocks not quite touching', bin: 'Region' },
    ],
  },
  {
    id: 'site', title: 'Dry upland or moist lowland?', prompt: 'Where does each species usually grow? (Week 5 tree ID lecture.)',
    bins: ['Dry / upland', 'Moist / lowland'],
    items: [
      { label: 'White pine', bin: 'Dry / upland' }, { label: 'Red pine', bin: 'Dry / upland' }, { label: 'Jack pine', bin: 'Dry / upland' },
      { label: 'Red oak', bin: 'Dry / upland' }, { label: 'Aspen', bin: 'Dry / upland' },
      { label: 'Black spruce', bin: 'Moist / lowland' }, { label: 'Balsam fir', bin: 'Moist / lowland' }, { label: 'Black ash', bin: 'Moist / lowland' },
      { label: 'Balsam poplar', bin: 'Moist / lowland' }, { label: 'Alder and willow', bin: 'Moist / lowland' },
    ],
  },
  {
    id: 'scale', title: 'Large or small scale?', prompt: 'Compared with 1:20,000, is each photo larger or smaller scale?',
    bins: ['Larger scale', 'Smaller scale'],
    items: [
      { label: '1:5,000', bin: 'Larger scale' },
      { label: '1:10,000', bin: 'Larger scale' },
      { label: '1:15,840', bin: 'Larger scale' },
      { label: '1:50,000', bin: 'Smaller scale' },
      { label: '1:250,000', bin: 'Smaller scale' },
      { label: '1:1,000,000', bin: 'Smaller scale' },
    ],
  },
];

const RANKS: RankDrill[] = [
  {
    id: 'gis', title: 'Rank the 5 GIS components', prompt: 'Most important at the top, as the instructor ranks them.',
    order: ['People', 'Data', 'Software', 'Applications', 'Hardware'],
    explain: 'People matter most (they must be trained), then data. Hardware matters least: it changes often.',
  },
];

export const REMOTE_SENSING: StudyGuide = {
  id: 'remote-sensing', sections: WEEKS, allLabel: 'All weeks', cards: CARDS, test: TEST, sorts: SORTS, ranks: RANKS,
};

// ---- UTM ----

export interface Place { name: string; lat: number; lon: number }

export const PLACES: Place[] = [
  { name: 'Kenora', lat: 49.77, lon: -94.49 },
  { name: 'Thunder Bay', lat: 48.38, lon: -89.25 },
  { name: 'Timmins', lat: 48.48, lon: -81.33 },
  { name: 'Sudbury', lat: 46.49, lon: -80.99 },
  { name: 'Toronto', lat: 43.65, lon: -79.38 },
  { name: 'Pembroke', lat: 45.82, lon: -77.11 },
  { name: 'Ottawa', lat: 45.42, lon: -75.7 },
];
