/**
 * Remote Sensing midterm review, from the course's midterm review sheet (October 2026) with gaps
 * filled from the Week 1, FRI and Forest Regions lecture notes. `check` marks an answer that is
 * not straight from the notes, so students know to confirm it against the lecture.
 */

export interface StudyCard {
  /** Question number on the review sheet. */
  n: number;
  week: string;
  q: string;
  a: string[];
  /** Shown as "Check this": the answer was filled in or the notes may differ from the lecture. */
  check?: string;
  /** A personal-opinion question: the answer is an example, not the answer. */
  opinion?: boolean;
}

export const WEEKS = ['Week 1', 'Week 2', 'Weeks 3 & 4', 'Weeks 5 & 6'];

export const CARDS: StudyCard[] = [
  // ---- Week 1 ----
  {
    n: 1, week: 'Week 1', q: 'Define remote sensing in your own words.',
    a: [
      'Detecting, identifying and analysing objects or features with imaging devices or sensors from a remote position.',
      'Tools like cameras, LiDAR, drones and satellites get data about an area or forest stand without being on the ground.',
    ],
  },
  {
    n: 2, week: 'Week 1', q: 'What are the 5 main advantages of remotely sensed images/data over on-the-ground observations?',
    a: [
      'Improved vantage point: you get the “big picture”.',
      'Ability to stop action: see the progress or destructive path of events (fire, flooding, insects).',
      'Permanent recording: the image is stored and can be used again in the future.',
      'Spectral sensitivity: records wavelengths the human eye can’t see.',
      'Spatial resolution and geometric fidelity: accurate measurements of position, distance, direction, area, height, volume and slope. Important to GIS.',
    ],
  },
  {
    n: 3, week: 'Week 1', q: 'Define spatial resolution in your own words.',
    a: [
      'The number of pixels (raster cells) in an image. Resolution is often identified by the width and height of an image as well as the total number of pixels in the image.',
      'Smaller pixels = higher resolution = more detail.',
    ],
  },
  {
    n: 4, week: 'Week 1', q: 'What is the difference between an active and a passive sensor?',
    a: [
      'Active sensors send out their own energy and measure what comes back (radar, LiDAR, sonar).',
      'Passive sensors only record energy that is already there, like reflected sunlight (a camera without a flash, passive sonar).',
    ],
  },
  { n: 5, week: 'Week 1', q: 'What is photogrammetry?', a: ['The science of making maps and measurements from photographs.'] },
  {
    n: 6, week: 'Week 1', q: 'What makes a photo or map small, medium or large scale?',
    a: [
      'The scale ratio. It is “flipped” from what you might expect:',
      'Large scale (e.g. 1:5,000) = close up. Everything looks large, small area, lots of detail.',
      'Small scale (e.g. 1:250,000) = far away. Everything looks small, large area, little detail.',
      'Read the ratio as a fraction: 1/5,000 is bigger than 1/250,000, so 1:5,000 is the larger scale.',
    ],
  },
  {
    n: 7, week: 'Week 1', q: 'Name at least 5 modes or platforms used to acquire remotely sensed data.',
    a: ['Drones', 'Planes (high and low altitude)', 'Helicopters', 'Satellites', 'Fire towers', 'On foot (e.g. hand-held LiDAR)'],
  },
  { n: 8, week: 'Week 1', q: 'Is a camera a sensor?', a: ['Yes. A camera is a (passive) sensor.'] },
  {
    n: 9, week: 'Week 1', q: 'What are the main satellite platforms used in remote sensing, and what do their abbreviations stand for?',
    a: [
      'SPOT: Satellite Pour l’Observation de la Terre.',
      'Sentinel-2: multispectral imagery.',
      'NOAA: National Oceanic and Atmospheric Administration.',
      'RADARSAT: Canada’s radar satellite, used for terrain mapping.',
      'Google Earth: not a satellite, it aggregates imagery from many sources.',
    ],
    check: 'Landsat is the other big one in most remote sensing courses but it is not in the notes. Check whether it was covered.',
  },
  {
    n: 10, week: 'Week 1', q: 'What scales of imagery are flown in Ontario, and where?',
    a: ['South: 1:10,000.', 'North: 1:20,000.', '1:15,840 is the old imperial photo scale (4 inches = 1 mile).'],
  },
  {
    n: 11, week: 'Week 1', q: 'What is a “photographic day”?',
    a: ['A day with 10% cloud cover or less and a good sun angle: a clear, nice day for flying imagery.'],
  },
  {
    n: 12, week: 'Week 1', q: 'What is a photo mosaic?',
    a: ['A set of images lined up and georeferenced together to make one continuous, panoramic view of an area.'],
  },
  { n: 13, week: 'Week 1', q: 'What does LiDAR stand for?', a: ['Light Detection and Ranging.'] },
  {
    n: 14, week: 'Week 1', q: 'Define LiDAR in your own words.',
    a: [
      'A system that sends out pulses of light (laser) and times how long each takes to come back.',
      'The return time gives a distance; millions of returns build a 3D point cloud.',
    ],
  },
  {
    n: 15, week: 'Week 1', q: 'Is Google Earth Pro a useful tool for people working in forestry? Give at least two reasons.',
    a: [
      'Example answer: No. The software is outdated and has been passed by more powerful free software.',
      'It doesn’t have the tools a professional forester needs today.',
    ],
    opinion: true,
  },

  // ---- Week 2 ----
  {
    n: 16, week: 'Week 2', q: 'Give at least two key reasons why we orthorectify remotely sensed images.',
    a: [
      'So the image can be georeferenced: it follows a map projection and every pixel gets real coordinates GIS can use.',
      'To remove distortion and make the scale uniform, e.g. from the curvature of the earth.',
    ],
    check: 'The review answer trails off after the curvature of the earth. Terrain relief and camera tilt are the usual other distortions; check the lecture.',
  },
  { n: 17, week: 'Week 2', q: 'What is the standard map projection system used in Ontario?', a: ['UTM: Universal Transverse Mercator.'] },
  {
    n: 18, week: 'Week 2', q: 'What UTM zone is Pembroke in?',
    a: ['Zone 18.', 'The earth is split into 60 zones, each 6° of longitude wide.'],
  },
  {
    n: 19, week: 'Week 2', q: 'What is the main reason we use map projections?',
    a: [
      'To flatten the earth onto a 2D map so locations can be measured and communicated accurately.',
      'It standardizes data so large groups of people can coordinate operations, and it is easier to use: metres instead of degrees.',
      'It is also what imagery is corrected to during orthorectification.',
    ],
  },
  { n: 20, week: 'Week 2', q: 'What units are UTM coordinates in?', a: ['Metres.'] },
  { n: 21, week: 'Week 2', q: 'Describe a Northing coordinate.', a: ['Metres measured north from the equator.'] },
  {
    n: 22, week: 'Week 2', q: 'Describe an Easting coordinate.',
    a: [
      'Metres measured from the central meridian of the zone.',
      'The central meridian is set to 500,000 m, so points west of it are under 500,000 and points east are over.',
    ],
  },
  {
    n: 23, week: 'Week 2', q: 'What are the instructor’s 5 key components of a functional GIS?',
    a: [
      'People: the most important, they have to be trained to use it.',
      'Data: next most important, without it the GIS is useless.',
      'Software',
      'Applications',
      'Hardware: least important, it changes often.',
    ],
  },
  {
    n: 24, week: 'Week 2', q: 'Name the four types of spatial data found in a GIS.',
    a: ['Points', 'Lines', 'Regions', 'Polygons'],
  },
  {
    n: 25, week: 'Week 2', q: 'What is attribute data in a GIS?',
    a: ['The information about each point, line, region or polygon, stored in its attribute table (e.g. a stand’s species, age and height).'],
  },
  {
    n: 26, week: 'Week 2', q: 'Give two forestry examples each of GIS points, lines and polygons.',
    a: ['Points: trees of concern, nests.', 'Lines: roads, boundary limits.', 'Polygons: harvest areas, Areas of Concern (AOCs).'],
  },
  { n: 27, week: 'Week 2', q: 'What does FRI stand for?', a: ['Forest Resource Inventory.'] },
  {
    n: 28, week: 'Week 2', q: 'Give at least five FRI tree species codes.',
    a: ['Pw: white pine', 'Pj: jack pine', 'Pl: largetooth aspen', 'Mh: hard (sugar) maple', 'Ms: silver maple', 'Mr: red maple'],
  },
  {
    n: 29, week: 'Week 2', q: 'Give at least two good reasons why we use FRI tree species codes.',
    a: [
      'They standardize the system, so everyone knows which tree you mean.',
      'They are quick and easy to use when collecting data.',
      'They display on maps more easily.',
    ],
  },
  {
    n: 30, week: 'Week 2', q: 'Name at least three important uses of FRI data.',
    a: ['Forest management plans.', 'Working out how merchantable stands are.', 'Knowing which trees are in which area.'],
  },
  { n: 31, week: 'Week 2', q: 'What does OBM stand for?', a: ['Ontario Base Map.'] },
  {
    n: 32, week: 'Week 2', q: 'What is an Area of Concern (AOC)?',
    a: ['An area that needs protecting because of a value there (e.g. a nest, a stream, a cultural site), so operations are changed or restricted.'],
  },
  { n: 33, week: 'Week 2', q: 'Are non-timber values important in forest management?', a: ['Yes.'] },
  {
    n: 34, week: 'Week 2', q: 'What is an operational timing restriction, and where might it apply?',
    a: ['A restriction on when work can happen (time of year or season), e.g. no harvesting during nesting season, to protect species, roads and stands.'],
  },

  // ---- Weeks 3 & 4 ----
  {
    n: 35, week: 'Weeks 3 & 4', q: 'How do you find the azimuth and ground distance of a cruise line drawn on a photo?',
    a: [
      'Azimuth: put the protractor’s centre on the start of the line, 0° on north (top of the photo), and read clockwise to the line: 0–360°.',
      'Ground distance: measure the line in cm on the photo, multiply by the scale number, then convert cm to m (÷ 100).',
    ],
    check: 'This one was blank on the review sheet. Try the “Cruise lines” drill on this page.',
  },
  {
    n: 36, week: 'Weeks 3 & 4', q: 'On a 1:10,000 photo, how far on the ground is 5 cm on the photo?',
    a: ['5 cm × 10,000 = 50,000 cm on the ground.', '50,000 cm ÷ 100 = 500 m.'],
  },
  {
    n: 36, week: 'Weeks 3 & 4', q: 'Two intersections are 20 cm apart on a photo and 2 km apart on the ground. What is the photo scale?',
    a: ['2 km × 1,000 = 2,000 m; × 100 = 200,000 cm on the ground.', '200,000 cm ÷ 20 cm = 10,000.', 'Scale = 1:10,000.'],
  },

  // ---- Weeks 5 & 6 ----
  {
    n: 37, week: 'Weeks 5 & 6', q: 'What are the main forest regions of Ontario, and which one is Pembroke in?',
    a: [
      'Boreal: about 50% of Ontario.',
      'Hudson Bay Lowlands: about 26%.',
      'Great Lakes–St. Lawrence: about 20%. Pembroke is here.',
      'Deciduous (Carolinian): about 3%.',
    ],
    check: 'The review answer lists three; Hudson Bay Lowlands is added from the Forest Regions notes in Ecology.',
  },
  {
    n: 37, week: 'Weeks 5 & 6', q: 'Where do jack pine and black spruce usually occur?',
    a: ['Jack pine: dry, sandy sites.', 'Black spruce: often with white spruce, but black spruce sits lower, in wetlands and bogs.'],
  },
  {
    n: 40, week: 'Weeks 5 & 6', q: 'How does terrestrial (hand-held) LiDAR work, and what are its advantages and best uses?',
    a: [
      'A scanner on the ground sends out laser pulses and times their return to build a 3D point cloud of the stand around it.',
      'Cheaper than flying planes or helicopters.',
      'Much denser, more detailed point clouds.',
      'Best for detail on individual trees in a plot: diameter, height, stem form and volume.',
    ],
    check: 'The “how it works” and “best uses” parts are filled in; the notes only list the two advantages.',
  },
];

// ---- Practice test ----

export interface TestQuestion {
  q: string;
  choices: string[];
  /** Index into choices. */
  answer: number;
  why: string;
}

export const TEST: TestQuestion[] = [
  { q: 'Which of these is an active sensor?', choices: ['A camera without a flash', 'LiDAR', 'The human eye', 'Passive sonar'], answer: 1, why: 'LiDAR sends out its own light pulses and measures what comes back.' },
  { q: 'Which photo has the largest scale?', choices: ['1:20,000', '1:15,840', '1:10,000', '1:5,000'], answer: 3, why: '1/5,000 is the biggest fraction. Large scale = close up, more detail.' },
  { q: 'What does LiDAR stand for?', choices: ['Light Detection and Ranging', 'Laser Imaging Data and Radar', 'Light Imaging, Distance and Return', 'Low-altitude Imaging Data Relay'], answer: 0, why: 'Light Detection and Ranging.' },
  { q: 'What scale of imagery is flown in northern Ontario?', choices: ['1:5,000', '1:10,000', '1:15,840', '1:20,000'], answer: 3, why: 'North: 1:20,000. South: 1:10,000.' },
  { q: 'A “photographic day” has cloud cover of…', choices: ['10% or less', '25% or less', '50% or less', 'No limit, as long as it is sunny'], answer: 0, why: '10% cloud cover or less, with a good sun angle.' },
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
  { q: 'Why do we orthorectify imagery?', choices: ['To add colour to black-and-white photos', 'To georeference it and remove distortion', 'To compress the file size', 'To increase cloud cover'], answer: 1, why: 'So it follows a map projection (pixels get coordinates) and distortion is removed.' },
  { q: 'What is a photo mosaic?', choices: ['A single satellite image', 'Several images lined up and georeferenced into one view', 'A false-colour image', 'A LiDAR point cloud'], answer: 1, why: 'Images joined and georeferenced into one continuous view.' },
  { q: 'Is a camera a sensor?', choices: ['Yes', 'No', 'Only digital cameras', 'Only with a flash'], answer: 0, why: 'Yes: a passive sensor.' },
  { q: 'A big advantage of terrestrial (hand-held) LiDAR over airborne LiDAR is…', choices: ['It covers more area per day', 'It is cheaper and gives much denser point clouds', 'It works through cloud from space', 'It needs no software'], answer: 1, why: 'Cheaper than flying, with much more detailed point clouds.' },
];

// ---- Sorting drills ----

export interface SortDrill {
  id: string;
  title: string;
  prompt: string;
  bins: string[];
  items: { label: string; bin: string }[];
}

export const SORTS: SortDrill[] = [
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
    ],
  },
  {
    id: 'gis', title: 'Point, line or polygon?', prompt: 'How would you store each of these in a GIS?',
    bins: ['Point', 'Line', 'Polygon'],
    items: [
      { label: 'Raptor nest', bin: 'Point' },
      { label: 'Tree of concern', bin: 'Point' },
      { label: 'Road', bin: 'Line' },
      { label: 'Harvest boundary limit', bin: 'Line' },
      { label: 'Stream', bin: 'Line' },
      { label: 'Harvest area', bin: 'Polygon' },
      { label: 'Area of Concern (AOC)', bin: 'Polygon' },
      { label: 'Lake', bin: 'Polygon' },
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

/** The instructor's order of importance for the 5 GIS components. */
export const GIS_COMPONENTS = ['People', 'Data', 'Software', 'Applications', 'Hardware'];

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
