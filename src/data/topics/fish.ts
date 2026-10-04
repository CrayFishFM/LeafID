import type { Topic } from './types';

export const FISH: Topic = {
  id: 'fish',
  title: 'Fish species ID',
  short: 'Fish',
  blurb: '30 Ontario fish, from the fish species ID practice quiz.',
  question: 'Which fish is this?',
  noun: 'fish',
  source: 'Fish Species ID practice quiz',
  groups: {
    trout: 'Trout & char',
    whitefish: 'Whitefish & smelt',
    perch: 'Perch family',
    sunfish: 'Sunfish & bass',
    pike: 'Pike family',
    catfish: 'Catfish',
    ancient: 'Long-bodied & ancient fish',
    bottom: 'Suckers, carp & bottom fish',
  },
  items: [
    {
      id: 'burbot', name: 'Burbot', aka: 'Ling', scientific: 'Lota lota', group: 'ancient', images: ['01.webp'],
      tips: [
        'A single barbel hangs from the middle of the chin.',
        'Long, mottled body with a long second dorsal fin and anal fin that run almost to the tail.',
        'Rounded tail; the only freshwater member of the cod family.',
      ],
      lookalikes: ['american-eel', 'sea-lamprey', 'brown-bullhead'],
    },
    {
      id: 'splake', name: 'Splake', scientific: 'Salvelinus namaycush × S. fontinalis', group: 'trout', images: ['02.webp'],
      tips: [
        'A stocked hybrid of lake trout and brook trout: the tail is only slightly forked, between the two parents.',
        'Worm-like markings on the back like a brook trout, but with pale spots like a lake trout.',
        'Lower fins often have white leading edges.',
      ],
      lookalikes: ['brook-trout', 'lake-trout'],
    },
    {
      id: 'pumpkinseed', name: 'Pumpkinseed', scientific: 'Lepomis gibbosus', group: 'sunfish', images: ['03.webp'],
      tips: [
        'Black "ear" flap with a bright orange-red spot on its tip.',
        'Wavy blue-green lines across the cheek.',
        'Deep, round body covered in orange-brown spots.',
      ],
      lookalikes: ['bluegill', 'rock-bass', 'black-crappie'],
    },
    {
      id: 'black-crappie', name: 'Black crappie', scientific: 'Pomoxis nigromaculatus', group: 'sunfish', images: ['04.webp'],
      tips: [
        'Silvery body covered in irregular black speckles, with no bars.',
        'Very deep, flattened body; the dorsal and anal fins are large and nearly the same size.',
        'Large upturned mouth with a dip in the forehead.',
      ],
      lookalikes: ['rock-bass', 'bluegill', 'pumpkinseed'],
    },
    {
      id: 'lake-sturgeon', name: 'Lake sturgeon', scientific: 'Acipenser fulvescens', group: 'ancient', images: ['05.webp'],
      tips: [
        'Rows of bony plates (scutes) instead of scales.',
        'Shark-like tail with a longer upper lobe.',
        'Pointed snout with four barbels in front of a toothless, sucker-like mouth.',
      ],
      lookalikes: ['longnose-gar', 'white-sucker'],
    },
    {
      id: 'rainbow-trout', name: 'Rainbow trout', scientific: 'Oncorhynchus mykiss', group: 'trout', images: ['06.webp'],
      tips: [
        'Pink-red band along the side.',
        'Small black spots over the back, sides and right across the tail.',
        'Silvery body with a lightly forked tail.',
      ],
      lookalikes: ['brown-trout', 'brook-trout'],
    },
    {
      id: 'white-sucker', name: 'White sucker', scientific: 'Catostomus commersonii', group: 'bottom', images: ['07.webp'],
      tips: [
        'Fleshy, downward-facing sucker mouth on the underside of the head.',
        'Round, torpedo-shaped body with no spines in the fins.',
        'Small scales that get crowded toward the head.',
      ],
      lookalikes: ['common-carp', 'lake-whitefish'],
    },
    {
      id: 'brook-trout', name: 'Brook trout', aka: 'Speckled trout', scientific: 'Salvelinus fontinalis', group: 'trout', images: ['08.webp'],
      tips: [
        'Worm-like markings (vermiculations) on a dark green back.',
        'Red spots with blue halos on the sides.',
        'Lower fins with bright white leading edges, and a square tail.',
      ],
      lookalikes: ['splake', 'brown-trout', 'lake-trout'],
    },
    {
      id: 'lake-trout', name: 'Lake trout', scientific: 'Salvelinus namaycush', group: 'trout', images: ['09.webp'],
      tips: [
        'Deeply forked tail.',
        'Pale cream spots all over a dark grey-green body; no red spots.',
        'Large head and mouth.',
      ],
      lookalikes: ['splake', 'brook-trout'],
    },
    {
      id: 'walleye', name: 'Walleye', scientific: 'Sander vitreus', group: 'perch', images: ['10.webp'],
      tips: [
        'White tip on the lower lobe of the tail.',
        'Dark blotch at the back of the spiny dorsal fin, which has no rows of spots.',
        'Large, glassy, light-reflecting eyes and sharp canine teeth.',
      ],
      lookalikes: ['sauger', 'yellow-perch'],
    },
    {
      id: 'lake-whitefish', name: 'Lake whitefish', scientific: 'Coregonus clupeaformis', group: 'whitefish', images: ['11.webp'],
      tips: [
        'Snout overhangs a small mouth that sits underneath.',
        'Small head on a silvery, slightly humped body.',
        'Adipose fin and a forked tail; no spots.',
      ],
      lookalikes: ['cisco', 'rainbow-smelt', 'white-sucker'],
    },
    {
      id: 'american-eel', name: 'American eel', scientific: 'Anguilla rostrata', group: 'ancient', images: ['12.webp'],
      tips: [
        'Snake-like body where the dorsal, tail and anal fins join into one continuous fin.',
        'Has real jaws and small pectoral fins behind the head (a lamprey has neither).',
        'Smooth, slimy skin with tiny buried scales.',
      ],
      lookalikes: ['sea-lamprey', 'burbot'],
    },
    {
      id: 'sauger', name: 'Sauger', scientific: 'Sander canadensis', group: 'perch', images: ['13.webp'],
      tips: [
        'Rows of distinct black spots on the spiny dorsal fin.',
        'Dark saddle-shaped blotches across the back and sides.',
        'No white tip on the lower tail lobe (unlike walleye).',
      ],
      lookalikes: ['walleye', 'yellow-perch'],
    },
    {
      id: 'brown-trout', name: 'Brown trout', scientific: 'Salmo trutta', group: 'trout', images: ['14.webp'],
      tips: [
        'Black and red-orange spots, often ringed with pale halos.',
        'Few or no spots on the square-ish tail.',
        'Golden-brown body.',
      ],
      lookalikes: ['rainbow-trout', 'brook-trout'],
    },
    {
      id: 'sea-lamprey', name: 'Sea lamprey', scientific: 'Petromyzon marinus', group: 'ancient', images: ['15.webp'],
      tips: [
        'No jaws: a round sucking disc lined with rings of teeth.',
        'No paired fins, and a row of seven gill openings behind the eye.',
        'An invasive parasite in the Great Lakes that leaves round scars on host fish.',
      ],
      lookalikes: ['american-eel', 'burbot'],
    },
    {
      id: 'sculpin', name: 'Sculpin', note: 'Native', scientific: 'Cottus spp.', group: 'bottom', images: ['16.webp'],
      tips: [
        'Big, wide, flattened head with large fan-like pectoral fins.',
        'Separate pelvic fins (a round goby\'s are fused into a sucker disc).',
        'Mottled brown, scaleless body that rests on the bottom.',
      ],
      lookalikes: ['round-goby', 'burbot'],
    },
    {
      id: 'smallmouth-bass', name: 'Smallmouth bass', scientific: 'Micropterus dolomieu', group: 'sunfish', images: ['17.webp'],
      tips: [
        'Bronze-brown with dark vertical bars, not a horizontal stripe.',
        'Upper jaw ends below the eye, not behind it.',
        'Spiny and soft dorsal fins are joined with only a shallow notch.',
      ],
      lookalikes: ['largemouth-bass', 'rock-bass'],
    },
    {
      id: 'common-carp', name: 'Common carp', scientific: 'Cyprinus carpio', group: 'bottom', images: ['18.webp'],
      tips: [
        'Two barbels on each side of the upper lip.',
        'Large, heavy scales and a long dorsal fin with a saw-toothed front spine.',
        'Deep, bronze-gold body.',
      ],
      lookalikes: ['white-sucker'],
    },
    {
      id: 'cisco', name: 'Lake herring', aka: 'Cisco', scientific: 'Coregonus artedi', group: 'whitefish', images: ['19.webp'],
      tips: [
        'Mouth at the front of the head, with the lower jaw as long as or longer than the upper.',
        'Slim, silvery body with an adipose fin and a forked tail.',
        'No overhanging snout (unlike lake whitefish).',
      ],
      lookalikes: ['lake-whitefish', 'rainbow-smelt'],
    },
    {
      id: 'northern-pike', name: 'Northern pike', scientific: 'Esox lucius', group: 'pike', images: ['20.webp'],
      tips: [
        'Light bean-shaped spots on a dark green body.',
        'Long, flat, duck-bill snout full of teeth.',
        'Cheek fully scaled; only the top half of the gill cover is scaled.',
      ],
      lookalikes: ['muskellunge', 'longnose-gar'],
    },
    {
      id: 'bluegill', name: 'Bluegill', scientific: 'Lepomis macrochirus', group: 'sunfish', images: ['21.webp'],
      tips: [
        'Ear flap is all black, with no red or orange spot.',
        'Dark blotch at the back of the soft dorsal fin.',
        'Small mouth; faint dark vertical bars on the sides.',
      ],
      lookalikes: ['pumpkinseed', 'rock-bass', 'black-crappie'],
    },
    {
      id: 'round-goby', name: 'Round goby', note: 'Invasive species', scientific: 'Neogobius melanostomus', group: 'bottom', images: ['22.webp'],
      tips: [
        'Pelvic fins fused into a single suction disc.',
        'Black spot at the back of the first dorsal fin.',
        'Raised, frog-like eyes on top of the head.',
      ],
      lookalikes: ['sculpin'],
    },
    {
      id: 'channel-catfish', name: 'Channel catfish', scientific: 'Ictalurus punctatus', group: 'catfish', images: ['23.webp'],
      tips: [
        'Deeply forked tail.',
        'Scattered small dark spots on a grey-silver body.',
        'Long barbels around the mouth.',
      ],
      lookalikes: ['brown-bullhead'],
    },
    {
      id: 'yellow-perch', name: 'Yellow perch', scientific: 'Perca flavescens', group: 'perch', images: ['24.webp'],
      tips: [
        'Six to eight dark vertical bars on a yellow body.',
        'Orange-tinted lower fins.',
        'Two separate dorsal fins: spiny in front, soft behind.',
      ],
      lookalikes: ['walleye', 'sauger'],
    },
    {
      id: 'rock-bass', name: 'Rock bass', scientific: 'Ambloplites rupestris', group: 'sunfish', images: ['25.webp'],
      tips: [
        'Bright red eyes.',
        'Rows of dark spots along the sides, one on each scale.',
        'Thick, deep body with a large mouth; six spines in the anal fin.',
      ],
      lookalikes: ['smallmouth-bass', 'pumpkinseed', 'black-crappie'],
    },
    {
      id: 'largemouth-bass', name: 'Largemouth bass', scientific: 'Micropterus salmoides', group: 'sunfish', images: ['26.webp'],
      tips: [
        'Dark, jagged horizontal stripe along the side.',
        'Upper jaw extends past the back of the eye.',
        'Deep notch almost separating the spiny and soft dorsal fins.',
      ],
      lookalikes: ['smallmouth-bass', 'rock-bass'],
    },
    {
      id: 'rainbow-smelt', name: 'Rainbow smelt', scientific: 'Osmerus mordax', group: 'whitefish', images: ['27.webp'],
      tips: [
        'Small, slender, silvery fish with a purple-pink sheen.',
        'Large mouth with visible teeth, reaching to the middle of the eye.',
        'Adipose fin and a forked tail.',
      ],
      lookalikes: ['cisco', 'lake-whitefish'],
    },
    {
      id: 'muskellunge', name: 'Muskellunge', scientific: 'Esox masquinongy', group: 'pike', images: ['28.webp'],
      tips: [
        'Dark bars or spots on a light body (the reverse of a pike).',
        'Pointed tail lobes.',
        'Scales only on the top half of the cheek and gill cover.',
      ],
      lookalikes: ['northern-pike'],
    },
    {
      id: 'brown-bullhead', name: 'Brown bullhead', scientific: 'Ameiurus nebulosus', group: 'catfish', images: ['29.webp'],
      tips: [
        'Square or slightly rounded tail, not forked.',
        'Dark chin barbels and a mottled brown body.',
        'Saw-toothed spine at the front of each pectoral fin.',
      ],
      lookalikes: ['channel-catfish', 'burbot'],
    },
    {
      id: 'longnose-gar', name: 'Longnose gar', scientific: 'Lepisosteus osseus', group: 'ancient', images: ['30.webp'],
      tips: [
        'Very long, narrow beak-like snout lined with needle teeth.',
        'Hard, diamond-shaped scales like armour.',
        'Long, cylindrical body with the dorsal fin set far back near the tail.',
      ],
      lookalikes: ['northern-pike', 'muskellunge', 'lake-sturgeon'],
    },
  ],
};
