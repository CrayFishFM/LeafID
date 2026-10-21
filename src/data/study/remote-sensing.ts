/**
 * Remote Sensing midterm review, from the course's midterm review sheet (October 2026), checked against
 * the Week 1, 2, 3, 5 and 6 lectures and Ben Gwilliam's (OWA) guest presentation. `check` marks an answer that is
 * not straight from the notes, so students know to confirm it against the lecture.
 */

import { mc, multi, order, tf, typed, type RankDrill, type SortDrill, type StudyCard, type StudyGuide } from './types';

const WEEKS = ['Week 1', 'Week 2', 'Weeks 3 & 4', 'Weeks 5 & 6'];

const CARDS: StudyCard[] = [
  // ---- Week 1 ----
  {
    n: 1, section: 'Week 1', q: 'Define remote sensing in your own words.',
    a: [
      'Detecting, identifying and analysing objects or features with imaging devices or sensors from a remote position.',
      'Tools like cameras, LiDAR, drones and satellites get data about an area or forest stand without being on the ground.',
    ],
    test: [
      mc('Remote sensing is…', ['Detecting, identifying and analysing objects with sensors located away from them', 'Measuring trees with a diameter tape', 'Mapping only with GPS', 'Counting trees in a plot'], 0, 'Imaging devices / sensors at positions remote from the subject.'),
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
    test: [
      multi('Select the 5 advantages of remote sensing from the lecture.', ['Improved vantage point', 'Capability to stop action', 'Permanent recording', 'Broadened spectral sensitivity', 'Spatial resolution and geometric fidelity', 'No ground work ever needed'], [0, 1, 2, 3, 4], 'Ground work (calibration, validation) is still needed.'),
      tf('Remote sensing can record wavelengths about twice as broad as the human eye can see.', true, 'Infrared and ultraviolet.'),
    ],
  },
  {
    n: 3, section: 'Week 1', q: 'Define spatial resolution in your own words.',
    a: [
      'The number of pixels (raster cells) in an image. Resolution is often identified by the width and height of an image as well as the total number of pixels in the image.',
      'Smaller pixels = higher resolution = more detail.',
    ],
    test: [
      mc('The instructor defines spatial resolution as…', ['The number of pixels (raster cells) in an image', 'The colour depth of an image', 'The scale ratio of a photo', 'The cloud cover on a photo'], 0, 'Often identified by the image width and height and total number of pixels.'),
    ],
  },
  {
    n: 4, section: 'Week 1', q: 'What is the difference between an active and a passive sensor?',
    a: [
      'Passive sensors measure reflected sunlight: when the sun shines, they measure that energy (e.g. a camera without a flash).',
      'Active sensors have their own source of light or energy: they send out a pulse and measure what is reflected back (e.g. LiDAR, radar).',
    ],
    test: [
      mc('Which is an active sensor?', ['A camera without a flash', 'LiDAR', 'The human eye', 'Passive sonar'], 1, 'Active sensors send their own pulse and measure the return.'),
      multi('Select the PASSIVE sensors.', ['Camera without a flash', 'Passive sonar', 'Sentinel-2 multispectral', 'LiDAR', 'Imaging radar'], [0, 1, 2], 'Passive sensors measure reflected sunlight.'),
    ],
  },
  {
    n: 5, section: 'Week 1', q: 'What is photogrammetry?',
    a: [
      'The science and technology of obtaining reliable information about physical objects and the environment by recording, measuring and interpreting photographic images, patterns and other phenomena.',
      'Using photographs to make topographic maps was first considered in 1840.',
    ],
    test: [
      mc('Photogrammetry is…', ['Getting reliable information about objects and the environment by recording, measuring and interpreting photos', 'Printing photos', 'Taking photos from space only', 'Colouring maps'], 0, 'The science and technology of measuring from photos.'),
      typed('In what year was using photographs to make topographic maps first considered?', ['1840'], '1840.'),
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
    test: [
      mc('Which photo has the LARGEST scale?', ['1:20,000', '1:15,840', '1:10,000', '1:5,000'], 3, '1/5,000 is the biggest fraction. Large scale = close up, more detail.'),
      tf('A large-scale photo shows a large area with little detail.', false, 'Counterintuitive: large scale = small area, lots of detail.'),
    ],
  },
  {
    n: 7, section: 'Week 1', q: 'Name at least 5 modes or platforms used to acquire remotely sensed data.',
    a: ['Satellites', 'High-altitude aircraft', 'Low-altitude aircraft', 'Helicopters', 'Drones / unmanned air vehicles (UAVs)', 'Ground technology and observation (e.g. fire towers, hand-held LiDAR)'],
    test: [
      multi('Select the remote sensing platforms from the lecture.', ['Satellites', 'High-altitude aircraft', 'Low-altitude aircraft', 'Helicopters', 'Drones (UAVs)', 'Submarines'], [0, 1, 2, 3, 4], 'Plus ground technology and observation.'),
    ],
  },
  { n: 8, section: 'Week 1', q: 'Is a camera a sensor?', a: ['Yes. A camera is a (passive) sensor.'], test: [
      tf('A camera is a sensor.', true, 'A passive sensor.'),
    ] },
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
    test: [
      mc('Which is the longest-running satellite program?', ['SPOT', 'Landsat', 'Sentinel-2', 'RADARSAT'], 1, 'Landsat (NASA), since 1972.'),
      typed('What does SPOT stand for?', ['Satellite Pour l’Observation de la Terre', 'Satellite Pour l Observation de la Terre'], 'Satellite Pour l’Observation de la Terre (French, commercial).'),
      typed('What does NOAA stand for?', ['National Oceanic and Atmospheric Administration'], 'Weather and coastal applications.'),
      mc('Sentinel-2 imagery is free at what resolution?', ['10 m', '30 m', '1 km', '16 cm'], 0, '10 m, revisiting every 8 days.'),
      tf('Google Earth is a satellite.', false, 'It aggregates imagery from several sources.'),
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
    test: [
      mc('What scale is flown in Northern Ontario?', ['1:5,000', '1:10,000', '1:15,840', '1:20,000'], 3, 'North of the French and Mattawa Rivers: 1:20,000. South: 1:10,000.'),
      mc('Which rivers divide the 1:20,000 (north) and 1:10,000 (south) photo areas?', ['French and Mattawa', 'Ottawa and St. Lawrence', 'Albany and Moose', 'Petawawa and Madawaska'], 0, 'The French and Mattawa Rivers.'),
      typed('The old imperial photo scale (4 inches = 1 mile) is 1:____.', ['15840'], '1:15,840.'),
    ],
  },
  {
    n: 11, section: 'Week 1', q: 'What is a “photographic day”?',
    a: ['A day with 10% cloud cover or less, relatively calm, and with an acceptable sun angle.'],
    test: [
      multi('Select what makes a “photographic day”.', ['10% cloud cover or less', 'Relatively calm', 'Acceptable sun angle', 'Snow on the ground'], [0, 1, 2], '≤ 10% cloud, relatively calm, acceptable sun angle.'),
    ],
  },
  {
    n: 12, section: 'Week 1', q: 'What is a photo mosaic?',
    a: [
      'A set of images lined up and georeferenced together into one seamless, continuous view of an area.',
      'Ontario’s FRI imagery is delivered as seamless ortho mosaic tiles, each a quarter of an OBM tile (5 km × 5 km).',
    ],
    test: [
      mc('A photo mosaic is…', ['A single satellite image', 'Several images lined up and georeferenced into one seamless view', 'A false-colour image', 'A LiDAR point cloud'], 1, 'Images joined into one continuous view.'),
      typed('Ontario’s ortho mosaic tiles are how many km on each side?', ['5'], '5 km × 5 km: a quarter of an OBM tile.'),
    ],
  },
  { n: 13, section: 'Week 1', q: 'What does LiDAR stand for?', a: ['Light Detection and Ranging.'], test: [
      typed('What does LiDAR stand for?', ['Light Detection and Ranging', 'Light Detection And Ranging'], 'Light Detection and Ranging.'),
    ] },
  {
    n: 14, section: 'Week 1', q: 'Define LiDAR in your own words.',
    a: [
      'Uses pulsed laser light to measure distances to the earth.',
      'Differences in laser return times and wavelengths make a digital 3D model of the target (a point cloud of the forest structure and the ground).',
      'Used from the ground (terrestrial), the air (airborne) and vehicles (mobile).',
    ],
    test: [
      mc('LiDAR measures distance using…', ['Pulsed laser light and return times', 'Sound waves', 'Reflected sunlight', 'Radio signals from GPS'], 0, 'Return times and wavelengths build a 3D model.'),
      multi('LiDAR is used from which platforms?', ['Terrestrial (ground)', 'Airborne', 'Mobile (vehicles)', 'Underground only'], [0, 1, 2], 'Terrestrial, airborne and mobile.'),
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
    test: [
      mc('Precision is…', ['How close a measurement is to the true value', 'How much repeated measurements of the same spot vary', 'The size of a pixel', 'The scale of a map'], 1, 'Accuracy = closeness to the true value.'),
    ],
  },
  {
    section: 'Week 1', extra: true, q: 'Why are forestry photos taken “vertical”, and what does that mean?',
    a: ['The camera axis is tilted no more than 3° from vertical.', 'They look like a map, and you can see them in 3D with a stereoscope.'],
    test: [
      typed('A vertical photo’s camera axis is tilted no more than how many degrees?', ['3'], 'No more than 3° from vertical.'),
      multi('Why are forestry photos vertical?', ['They look like a map', 'They can be seen in 3D with a stereoscope', 'They show tree trunks from the side'], [0, 1], 'Map-like and stereoscopic.'),
    ],
  },
  {
    section: 'Week 1', extra: true, q: 'Which type of photo contrast is used for forest inventory in Ontario, and why?',
    a: [
      'Low contrast: tones range from light to dark grey.',
      'It gives better detail (resolution) for telling tree species apart, although it can be harder to use in the field.',
    ],
    test: [
      mc('Ontario forest inventory photos are…', ['High contrast', 'Low contrast', 'Infrared only', 'Black and white only'], 1, 'Low contrast: better detail for species ID.'),
    ],
  },
  {
    section: 'Week 1', extra: true, q: 'What are the advantages and disadvantages of imaging radar?',
    a: [
      'Advantages: works beyond the photographic spectrum; data sent by radio; some near real time; works in all weather, day or night; very fine resolution (10 × 10 cm).',
      'Disadvantages: more complex, more expensive (including processing), more training and computer knowledge needed.',
    ],
    test: [
      multi('Select the ADVANTAGES of imaging radar.', ['Works in all weather, day or night', 'Some can be viewed in near real time', 'About 10 × 10 cm resolution', 'Cheaper and simpler than photos', 'Needs less training'], [0, 1, 2], 'It is more complex, more expensive and needs more training.'),
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
    test: [
      mc('Orthorectification removes the effects of…', ['Cloud cover and haze', 'Image perspective (tilt) and relief (terrain)', 'Seasonal leaf colour', 'Low contrast'], 1, 'Tilt and relief, plus sensor optical distortion: constant scale, true positions.'),
      tf('Raw aerial or satellite imagery can be used in a GIS straight away.', false, 'Not until every pixel is in an accurate (x, y) position on the ground.'),
      multi('What does orthorectification require?', ['A sensor model', 'The sensor’s location and orientation for every image', 'An accurate terrain model', 'A cloud-free sky'], [0, 1, 2], 'Sensor model, sensor position/orientation, terrain model.'),
    ],
  },
  { n: 17, section: 'Week 2', q: 'What is the standard map projection system used in Ontario?', a: ['UTM: Universal Transverse Mercator.'], test: [
      typed('What map projection system is standard in Ontario? (Acronym or full name)', ['UTM', 'Universal Transverse Mercator'], 'UTM: Universal Transverse Mercator.'),
    ] },
  {
    n: 18, section: 'Week 2', q: 'What UTM zone is Pembroke in?',
    a: ['Zone 18.', 'The earth is split into 60 zones, each 6° of longitude wide.'],
    test: [
      typed('What UTM zone is Pembroke in?', ['18', '18T'], 'Zone 18 (78°W–72°W).'),
      typed('How many UTM zones are there?', ['60'], '60 zones, each 6° of longitude wide.'),
    ],
  },
  {
    n: 19, section: 'Week 2', q: 'What is the main reason we use map projections?',
    a: [
      'To flatten the earth onto a 2D map so locations can be measured and communicated accurately.',
      'It standardizes data so large groups of people can coordinate operations, and it is easier to use: metres instead of degrees.',
      'It is also what imagery is corrected to during orthorectification.',
    ],
    test: [
      mc('A map projection…', ['Flattens the earth’s surface onto a plane to make a 2D map', 'Adds colour to imagery', 'Measures tree heights', 'Removes cloud cover'], 0, 'A systematic transformation of latitude/longitude onto a plane.'),
    ],
  },
  { n: 20, section: 'Week 2', q: 'What units are UTM coordinates in?', a: ['Metres.'], test: [
      mc('UTM coordinates are in…', ['Degrees', 'Feet', 'Metres', 'Chains'], 2, 'Metres.'),
    ] },
  { n: 21, section: 'Week 2', q: 'Describe a Northing coordinate.', a: ['Metres measured north from the equator.'], test: [
      mc('A Northing is measured…', ['In degrees from the prime meridian', 'In metres from the equator', 'In metres from the North Pole', 'In metres from the central meridian'], 1, 'Metres north of the equator.'),
    ] },
  {
    n: 22, section: 'Week 2', q: 'Describe an Easting coordinate.',
    a: [
      'Metres measured from the central meridian of the zone.',
      'The central meridian is set to 500,000 m, so points west of it are under 500,000 and points east are over.',
    ],
    test: [
      typed('What Easting (in metres) is a zone’s central meridian set to?', ['500000'], '500,000 m.'),
      tf('A point west of the central meridian has an Easting greater than 500,000 m.', false, 'West of it is under 500,000; east of it is over.'),
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
    test: [
      multi('Select the 5 components of a GIS.', ['Hardware', 'Software', 'Applications', 'Data', 'People', 'Satellites'], [0, 1, 2, 3, 4], 'Hardware, software, applications, data, people.'),
      order('Rank the GIS components, most important first.', ['People', 'Data', 'Software', 'Applications', 'Hardware'], 'People matter most; hardware least (it changes often).'),
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
    test: [
      multi('Select the four types of (vector) spatial data.', ['Points', 'Lines', 'Polygons', 'Regions', 'Colours'], [0, 1, 2, 3], 'Points, lines, polygons and regions.'),
      mc('A region in a GIS is…', ['A super or discontiguous polygon', 'A single point', 'A raster cell', 'A UTM zone'], 0, 'E.g. adjacent harvest blocks that don’t quite touch.'),
    ],
  },
  {
    n: 25, section: 'Week 2', q: 'What is attribute data in a GIS?',
    a: [
      'Attribute (tabular) data: the descriptors of each spatial data item, stored in a table (e.g. a forest stand polygon’s species, age and height).',
      'A GIS has two main types of data: spatial (geographically referenced) and attribute.',
    ],
    test: [
      mc('Attribute data is…', ['The descriptors of each spatial item, stored in a table', 'The map projection', 'The satellite used', 'The pixel size'], 0, 'E.g. a stand polygon’s species, age and height.'),
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
    test: [
      mc('Which is a GIS POINT in the lecture’s forestry examples?', ['Seismic line', 'Mineral lick', 'Harvest block', 'Power line'], 1, 'Points: water crossings, raptor nests, mineral licks, trappers’ cabins.'),
      mc('Which is a GIS LINE?', ['Raptor nest', 'Forest stand', 'Seismic line', 'Lake'], 2, 'Lines: creeks, roads, railway and power lines, seismic lines.'),
      mc('Twin lakes joined by a tiny narrows are stored as a…', ['Point', 'Line', 'Region', 'Raster'], 2, 'A region.'),
    ],
  },
  {
    n: 27, section: 'Week 2', q: 'What does FRI stand for, and what is it?',
    a: [
      'Forest Resource Inventory.',
      'Comprehensive data on tree species and stand composition, range, age and distribution, plus forest, ecological and land-use conditions.',
      'Forest stands are polygons in a GIS, delineated by trained technicians using 3D on-screen stereoscopy, with plenty of ground plots for calibration and validation.',
    ],
    test: [
      typed('What does FRI stand for?', ['Forest Resource Inventory'], 'Forest Resource Inventory.'),
      mc('FRI forest stand polygons are delineated using…', ['3D on-screen stereoscopy', 'Satellite weather data', 'Only ground plots', 'Google Earth'], 0, 'Trained technicians, 3D stereoscopy, plus ground plots.'),
    ],
  },
  {
    n: 28, section: 'Week 2', q: 'Give at least five FRI tree species codes.',
    a: ['Pw: white pine', 'Pj: jack pine', 'Pl: largetooth aspen', 'Mh: hard (sugar) maple', 'Ms: silver maple', 'Mr: red maple'],
    test: [
      typed('What is the FRI code for white pine?', ['Pw'], 'Pw.'),
      typed('What is the FRI code for jack pine?', ['Pj'], 'Pj.'),
      mc('The FRI code Pl means…', ['Lodgepole pine', 'Largetooth aspen', 'Red pine', 'Balsam poplar'], 1, 'Pl = largetooth aspen in Ontario.'),
    ],
  },
  {
    n: 29, section: 'Week 2', q: 'Give at least two good reasons why we use FRI tree species codes.',
    a: [
      'They standardize the system, so everyone knows which tree you mean.',
      'They are quick and easy to use when collecting data.',
      'They display on maps more easily.',
    ],
    test: [
      multi('Why do we use FRI species codes?', ['They standardize the system', 'They are quick to record in the field', 'They display on maps more easily', 'They are more descriptive than names'], [0, 1, 2], 'Standard, quick and map-friendly.'),
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
    test: [
      multi('Select the uses of FRI data.', ['Forest management planning', 'Timber supply modelling', 'Road planning', 'Buffering AOCs', 'Weather forecasting'], [0, 1, 2, 3], 'Also annual work planning, tree marking and monitoring.'),
    ],
  },
  {
    n: 31, section: 'Week 2', q: 'What does OBM stand for?',
    a: [
      'Ontario Base Map: general topographic coverage (relief, drainage, buildings, roads, railways…) that FRI is built on, like another OBM layer.',
      'Projected in UTM; sheets were clipped at 10 km × 10 km. Now replaced by Foundational Geospatial Data (seamless).',
    ],
    test: [
      typed('What does OBM stand for?', ['Ontario Base Map'], 'Ontario Base Map.'),
      mc('The OBM has been replaced by…', ['Foundational Geospatial Data', 'Google Earth', 'Landsat', 'FRI'], 0, 'Foundational Geospatial Data (seamless).'),
    ],
  },
  {
    n: 32, section: 'Week 2', q: 'What is an Area of Concern (AOC)?',
    a: ['A geographic area within an area of operations, next to an identified natural resource feature, land use or value that may be affected by forest management activities.'],
    test: [
      mc('An AOC is…', ['An area next to a natural resource feature, land use or value that forest management may affect', 'A clearcut', 'A UTM zone', 'A type of fungus'], 0, 'Within an area of operations.'),
    ],
  },
  {
    n: 33, section: 'Week 2', q: 'Are non-timber values important in forest management? How are they identified?',
    a: [
      'Yes. They become a key part of the FRI, often kept in a separate (sometimes confidential) GIS layer.',
      'Identified during planning and operations by the Local Citizens Committee, First Nation communities, employees, special interest groups, other ministries, and remote sensing.',
    ],
    test: [
      multi('Who identifies non-timber values?', ['The Local Citizens Committee', 'First Nation communities', 'Employees', 'Other ministries', 'Remote sensing'], [0, 1, 2, 3, 4], 'All of them, plus special interest groups.'),
    ],
  },
  {
    n: 34, section: 'Week 2', q: 'What is an operational timing restriction, and where might it apply?',
    a: [
      'An AOC prescription that limits WHEN operations can happen (e.g. no work near a raptor nest during nesting season).',
      'AOC prescriptions can include no-harvest buffers, timing restrictions, or both.',
    ],
    test: [
      mc('An operational timing restriction limits…', ['Where roads go', 'When operations can happen', 'Which species are planted', 'Photo scale'], 1, 'E.g. no work near a nest during nesting season.'),
      multi('AOC prescriptions can include…', ['No-harvest buffers', 'Timing restrictions', 'Both together'], [0, 1, 2], 'Buffers, timing restrictions, or both.'),
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
    test: [
      mc('An azimuth is measured…', ['Counter-clockwise from true north', 'Clockwise from true north', 'Clockwise from east', 'From the equator'], 1, 'Clockwise from true north, 0–360°.'),
      typed('What azimuth is due west?', ['270'], '0° north, 90° east, 180° south, 270° west.'),
    ],
  },
  {
    n: 36, section: 'Weeks 3 & 4', q: 'On a 1:10,000 photo, how far on the ground is 5 cm on the photo?',
    a: ['5 cm × 10,000 = 50,000 cm on the ground.', '50,000 cm ÷ 100 = 500 m.'],
    test: [
      typed('On a 1:10,000 photo, 5 cm is how many metres on the ground?', ['500'], '5 × 10,000 = 50,000 cm = 500 m.'),
      typed('On a 1:20,000 map, 5 cm is how many metres on the ground?', ['1000'], '5 × 20,000 = 100,000 cm = 1,000 m (1 km).'),
    ],
  },
  {
    n: 36, section: 'Weeks 3 & 4', q: 'Two intersections are 20 cm apart on a photo and 2 km apart on the ground. What is the photo scale?',
    a: ['2 km × 1,000 = 2,000 m; × 100 = 200,000 cm on the ground.', '200,000 cm ÷ 20 cm = 10,000.', 'Scale = 1:10,000.'],
    test: [
      typed('20 cm on a photo = 2 km on the ground. The scale is 1:____.', ['10000'], '200,000 cm ÷ 20 cm = 10,000.'),
      typed('If you walk 3 km on a cruise line, how many cm is that on a 1:10,000 map?', ['30'], '300,000 cm ÷ 10,000 = 30 cm.'),
    ],
  },

  {
    section: 'Weeks 3 & 4', extra: true, q: 'What is declination, and how do you use it?',
    a: [
      'The angle between where the compass needle points (magnetic north) and true north, because the earth’s magnetic field isn’t lined up with its rotation axis.',
      'Negative = west: magnetic north is west of true north. Pembroke is about −12° (west).',
      'Set the declination on your compass so it reads true north instead of magnetic north.',
    ],
    test: [
      mc('Pembroke’s declination is about −12°. That means magnetic north is…', ['12° east of true north', '12° west of true north', 'The same as true north', '12° south'], 1, 'Negative = west.'),
      tf('Setting declination on your compass lets it read true north.', true, 'Instead of magnetic north.'),
    ],
  },
  {
    section: 'Weeks 3 & 4', extra: true, q: 'What is a vector? What is a chevron?',
    a: [
      'A vector has both a magnitude (length) and a direction: a directed line segment, like each leg of a route.',
      'A chevron is a V-shaped symbol that shows the direction of travel along a vector.',
    ],
    test: [
      mc('A vector has…', ['Only a length', 'Only a direction', 'Both a magnitude (length) and a direction', 'A colour'], 2, 'A directed line segment.'),
      mc('A chevron is…', ['A V-shaped symbol showing direction along a vector', 'A type of compass', 'A map projection', 'A UTM zone'], 0, 'Shows the direction of travel.'),
    ],
  },
  {
    section: 'Weeks 3 & 4', extra: true, q: 'How long is a chain?',
    a: ['1 chain = 20 metres (66 feet; exactly 20.12 m).'],
    test: [
      typed('1 chain is how many metres?', ['20', '20.12'], '1 chain = 20 m (66 feet; exactly 20.12 m).'),
      typed('1 chain is how many feet?', ['66'], '66 feet.'),
    ],
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
    test: [
      mc('Which forest region is Pembroke in?', ['Boreal', 'Great Lakes–St. Lawrence', 'Deciduous (Carolinian)', 'Hudson Bay Lowlands'], 1, 'Great Lakes–St. Lawrence.'),
      mc('What is the largest forest region in Ontario?', ['Boreal', 'GLSL', 'Deciduous', 'Hudson Bay Lowlands'], 0, 'Boreal, about 50%.'),
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
    test: [
      mc('Jack pine generally grows on…', ['Wet, organic bogs', 'Dry, sandy sites and ridges', 'Rich valley bottoms', 'Swamps'], 1, 'Black spruce takes the bogs.'),
      multi('Select the species that usually grow on moist / lowland sites.', ['Black spruce', 'Balsam fir', 'Black ash', 'Balsam poplar', 'Red pine', 'Red oak'], [0, 1, 2, 3], 'Red pine and red oak are dry / upland.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'What characteristics do you use to identify trees from a distance or on aerial imagery?',
    a: [
      'Crown shape, branching habits, silhouettes (shadows), colour (tone) and crown texture.',
      'Also: soil and site, common species associations, pure vs mixed stands, succession and stand history, and damage or disease.',
      'Use the FRI species codes. Species ID on small-scale photos is “more of an art than a science”.',
    ],
    test: [
      multi('Select the physical characteristics used to ID trees from the air.', ['Crown shape', 'Branching habits', 'Silhouettes (shadows)', 'Colour', 'Crown texture', 'Bark thickness'], [0, 1, 2, 3, 4], 'You can’t see bark thickness from the air.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Eastern white pine (Pw) from the air?',
    a: ['Crown shape: large “wheel-spoke”, explosion or octopus shape.', 'Branching: prominent, overlapping big branches, wind-swept.', 'Colour: light, flat green. Texture: coarse.', 'Site: dry upland.'],
    test: [
      mc('From the air: crown large “wheel-spoke”, explosion or octopus shape; light, flat green; coarse texture; site: dry upland. Which species?', ['Eastern white pine (Pw)', 'Balsam fir (Bf)', 'Eastern white cedar (Cw)', 'Yellow birch (By)'], 0, 'Eastern white pine (Pw): branching prominent, overlapping big branches, wind-swept.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Red pine (Pr) from the air?',
    a: ['Crown shape: large, circular “pom-pom”.', 'Branching: well-defined, open branches.', 'Colour: dark, flat green. Texture: small clumps.', 'Site: dry, sandy.'],
    test: [
      mc('From the air: crown large, circular “pom-pom”; dark, flat green; small clumps texture; site: dry, sandy. Which species?', ['White spruce (Sw)', 'Red pine (Pr)', 'Larch / tamarack (La)', 'American beech (Be)'], 1, 'Red pine (Pr): branching well-defined, open branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Jack pine (Pj) from the air?',
    a: ['Crown shape: small, irregular, pointed.', 'Branching: thin, open branches.', 'Colour: dark green, sometimes a red hue. Texture: smooth, fuzzy.', 'Site: dry, sandy, ridges.'],
    test: [
      mc('From the air: crown small, irregular, pointed; dark green, sometimes a red hue; smooth, fuzzy texture; site: dry, sandy, ridges. Which species?', ['Sugar maple (Mh)', 'Black spruce (Sb)', 'Jack pine (Pj)', 'Red oak (Or)'], 2, 'Jack pine (Pj): branching thin, open branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Balsam fir (Bf) from the air?',
    a: ['Crown shape: narrow, symmetrical, pointed cone.', 'Branching: dense but less prominent than white spruce.', 'Colour: shiny, dense, dark green. Texture: smooth.', 'Site: moist, low-lying.'],
    test: [
      mc('From the air: crown narrow, symmetrical, pointed cone; shiny, dense, dark green; smooth texture; site: moist, low-lying. Which species?', ['Trembling and largetooth aspen (Pt, Pl)', 'Eastern hemlock (He)', 'Red maple (Mr)', 'Balsam fir (Bf)'], 3, 'Balsam fir (Bf): branching dense but less prominent than white spruce.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise White spruce (Sw) from the air?',
    a: ['Crown shape: large cone.', 'Branching: well-defined, prominent branches.', 'Colour: dark green. Texture: coarse.', 'Site: moist lower slopes.'],
    test: [
      mc('From the air: crown large cone; dark green; coarse texture; site: moist lower slopes. Which species?', ['White spruce (Sw)', 'Eastern white cedar (Cw)', 'White birch (Bw)', 'Balsam poplar (Pb)'], 0, 'White spruce (Sw): branching well-defined, prominent branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Black spruce (Sb) from the air?',
    a: ['Crown shape: slender, pointed.', 'Branching: well-defined, prominent branches.', 'Colour: dark green. Texture: fairly smooth.', 'Site: moist lowlands, bogs.'],
    test: [
      mc('From the air: crown slender, pointed; dark green; fairly smooth texture; site: moist lowlands, bogs. Which species?', ['Larch / tamarack (La)', 'Black spruce (Sb)', 'Yellow birch (By)', 'Black ash (Ab)'], 1, 'Black spruce (Sb): branching well-defined, prominent branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Eastern hemlock (He) from the air?',
    a: ['Crown shape: oval cone with a point.', 'Branching: large individual branches.', 'Colour: shiny dark green. Texture: tight layers.', 'Site: moist, well-drained lower slopes.'],
    test: [
      mc('From the air: crown oval cone with a point; shiny dark green; tight layers texture; site: moist, well-drained lower slopes. Which species?', ['American beech (Be)', 'Sugar maple (Mh)', 'Eastern hemlock (He)', 'Black cherry (Cb)'], 2, 'Eastern hemlock (He): branching large individual branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Eastern white cedar (Cw) from the air?',
    a: ['Crown shape: small cone.', 'Branching: dense, thick branches.', 'Colour: shiny dark green. Texture: smooth.', 'Site: lowland swamps, fresh hillsides, dry ledges.'],
    test: [
      mc('From the air: crown small cone; shiny dark green; smooth texture; site: lowland swamps, fresh hillsides, dry ledges. Which species?', ['Alder and willow (AL, Wi)', 'Red maple (Mr)', 'Red oak (Or)', 'Eastern white cedar (Cw)'], 3, 'Eastern white cedar (Cw): branching dense, thick branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Larch / tamarack (La) from the air?',
    a: ['Crown shape: narrow pyramidal cone.', 'Branching: columnar branches.', 'Colour: light. Texture: coarse.', 'Site: lowland swamps, fresh hillsides, dry ledges.'],
    test: [
      mc('From the air: crown narrow pyramidal cone; light; coarse texture; site: lowland swamps, fresh hillsides, dry ledges. Which species?', ['Larch / tamarack (La)', 'White birch (Bw)', 'Trembling and largetooth aspen (Pt, Pl)', 'Eastern white pine (Pw)'], 0, 'Larch / tamarack (La): branching columnar branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Sugar maple (Mh) from the air?',
    a: ['Crown shape: large, irregular, open, billowy oval.', 'Branching: columnar branches.', 'Colour: light tone compared with associates. Texture: coarse.', 'Site: fresh, well-drained.'],
    test: [
      mc('From the air: crown large, irregular, open, billowy oval; light tone compared with associates; coarse texture; site: fresh, well-drained. Which species?', ['Yellow birch (By)', 'Sugar maple (Mh)', 'Balsam poplar (Pb)', 'Red pine (Pr)'], 1, 'Sugar maple (Mh): branching columnar branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Red maple (Mr) from the air?',
    a: ['Crown shape: medium, closed, tufted oval.', 'Branching: fine branches and twigs.', 'Colour: light tone compared with associates. Texture: smooth.', 'Site: moist to fresh, well-drained.'],
    test: [
      mc('From the air: crown medium, closed, tufted oval; light tone compared with associates; smooth texture; site: moist to fresh, well-drained. Which species?', ['Black ash (Ab)', 'American beech (Be)', 'Red maple (Mr)', 'Jack pine (Pj)'], 2, 'Red maple (Mr): branching fine branches and twigs.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise White birch (Bw) from the air?',
    a: ['Crown shape: small, irregular, open clumps showing branches.', 'Branching: fine, light-coloured branches and twigs.', 'Colour: dark tone. Texture: smooth.', 'Site: moist to fresh, well-drained.'],
    test: [
      mc('From the air: crown small, irregular, open clumps showing branches; dark tone; smooth texture; site: moist to fresh, well-drained. Which species?', ['Balsam fir (Bf)', 'Red oak (Or)', 'Black cherry (Cb)', 'White birch (Bw)'], 3, 'White birch (Bw): branching fine, light-coloured branches and twigs.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Yellow birch (By) from the air?',
    a: ['Crown shape: irregular, finely tufted.', 'Branching: compact.', 'Colour: very dark. Texture: coarse.', 'Site: moist valleys, occasionally dry.'],
    test: [
      mc('From the air: crown irregular, finely tufted; very dark; coarse texture; site: moist valleys, occasionally dry. Which species?', ['Yellow birch (By)', 'Trembling and largetooth aspen (Pt, Pl)', 'Alder and willow (AL, Wi)', 'White spruce (Sw)'], 0, 'Yellow birch (By): branching compact.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise American beech (Be) from the air?',
    a: ['Crown shape: large, irregular, open, billowy oval.', 'Branching: columnar branches.', 'Colour: dark blue-green. Texture: smooth.', 'Site: well-drained slopes and ledges.'],
    test: [
      mc('From the air: crown large, irregular, open, billowy oval; dark blue-green; smooth texture; site: well-drained slopes and ledges. Which species?', ['Balsam poplar (Pb)', 'American beech (Be)', 'Eastern white pine (Pw)', 'Black spruce (Sb)'], 1, 'American beech (Be): branching columnar branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Red oak (Or) from the air?',
    a: ['Crown shape: compact and billowy.', 'Branching: prominent branches.', 'Colour: dark. Texture: velvety smooth.', 'Site: fresh upper slopes, loamy rocky sites.'],
    test: [
      mc('From the air: crown compact and billowy; dark; velvety smooth texture; site: fresh upper slopes, loamy rocky sites. Which species?', ['Red pine (Pr)', 'Black ash (Ab)', 'Red oak (Or)', 'Eastern hemlock (He)'], 2, 'Red oak (Or): branching prominent branches.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Trembling and largetooth aspen (Pt, Pl) from the air?',
    a: ['Crown shape: rounded, open, billowy oval.', 'Branching: light-coloured branches and twigs.', 'Colour: light tone. Texture: fine.', 'Site: fresh to dry.'],
    test: [
      mc('From the air: crown rounded, open, billowy oval; light tone; fine texture; site: fresh to dry. Which species?', ['Eastern white cedar (Cw)', 'Black cherry (Cb)', 'Jack pine (Pj)', 'Trembling and largetooth aspen (Pt, Pl)'], 3, 'Trembling and largetooth aspen (Pt, Pl): branching light-coloured branches and twigs.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Balsam poplar (Pb) from the air?',
    a: ['Crown shape: narrow, tufted, with a point.', 'Branching: light-coloured branches and twigs.', 'Colour: light tone. Texture: coarse.', 'Site: deep, moist bottomland soils.'],
    test: [
      mc('From the air: crown narrow, tufted, with a point; light tone; coarse texture; site: deep, moist bottomland soils. Which species?', ['Balsam poplar (Pb)', 'Alder and willow (AL, Wi)', 'Balsam fir (Bf)', 'Larch / tamarack (La)'], 0, 'Balsam poplar (Pb): branching light-coloured branches and twigs.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Black ash (Ab) from the air?',
    a: ['Crown shape: narrow, irregular, open.', 'Branching: thick, ascending twigs.', 'Colour: light green. Texture: fuzzy.', 'Site: deep, moist bottomlands, swamps, beaver meadows.'],
    test: [
      mc('From the air: crown narrow, irregular, open; light green; fuzzy texture; site: deep, moist bottomlands, swamps, beaver meadows. Which species?', ['Eastern white pine (Pw)', 'Black ash (Ab)', 'White spruce (Sw)', 'Sugar maple (Mh)'], 1, 'Black ash (Ab): branching thick, ascending twigs.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Black cherry (Cb) from the air?',
    a: ['Crown shape: irregular, rounded.', 'Branching: thin, compact.', 'Colour: very dark. Texture: very smooth.', 'Site: deep, moist bottomlands and low slopes.'],
    test: [
      mc('From the air: crown irregular, rounded; very dark; very smooth texture; site: deep, moist bottomlands and low slopes. Which species?', ['Black spruce (Sb)', 'Red pine (Pr)', 'Black cherry (Cb)', 'Red maple (Mr)'], 2, 'Black cherry (Cb): branching thin, compact.'),
    ],
  },
  {
    section: 'Weeks 5 & 6', extra: true, q: 'How do you recognise Alder and willow (AL, Wi) from the air?',
    a: ['Crown shape: large, billowy.', 'Branching: dense, drooping.', 'Colour: light tone. Texture: fuzzy.', 'Site: deep, moist lowland soils.'],
    test: [
      mc('From the air: crown large, billowy; light tone; fuzzy texture; site: deep, moist lowland soils. Which species?', ['White birch (Bw)', 'Jack pine (Pj)', 'Eastern hemlock (He)', 'Alder and willow (AL, Wi)'], 3, 'Alder and willow (AL, Wi): branching dense, drooping.'),
    ],
  },
  {
    n: 40, section: 'Weeks 5 & 6', q: 'How does terrestrial (hand-held) LiDAR work, and what are its advantages and best uses?',
    a: [
      'LiDAR is an active sensor: it sends out laser light and times the returns to measure the 3D structure of the terrain and objects.',
      'Terrestrial LiDAR does this from the ground: stationary, backpack-mounted (e.g. a GeoSLAM unit) or low on a UAV.',
      'Advantages: cheaper than flying planes or helicopters, and much denser, more detailed point clouds.',
      'Best uses: detail under the canopy and on individual trees. Combined with aerial LiDAR and drone imagery it points toward individual tree inventories.',
    ],
    test: [
      multi('Terrestrial LiDAR can be…', ['Stationary', 'Backpack-mounted (e.g. GeoSLAM)', 'Mounted low on a UAV', 'Mounted on a satellite'], [0, 1, 2], 'Satellites aren’t terrestrial.'),
      tf('Terrestrial LiDAR gives denser, more detailed point clouds than flying.', true, 'And it is cheaper than planes or helicopters.'),
    ],
  },
];

// ---- Practice test ----


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
  id: 'remote-sensing', sections: WEEKS, allLabel: 'All weeks', cards: CARDS, sorts: SORTS, ranks: RANKS,
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
