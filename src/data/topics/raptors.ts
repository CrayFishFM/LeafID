import type { Topic } from './types';

/**
 * Two photos per bird, named <slide><letter>.jpg in public/quizzes/raptors/ after the slide they came from.
 * The deck only names each bird (in the slide notes), so the tips are standard field marks.
 */
const imgs = (slide: number) => ['a', 'b'].map((l) => `${String(slide).padStart(2, '0')}${l}.jpg`);

export const RAPTORS: Topic = {
  id: 'raptors',
  title: 'Forest raptor ID',
  short: 'Raptors',
  blurb: '14 hawks, eagles, falcons and other raptors from the forest raptor ID practice slides, perched and in flight.',
  question: 'Which raptor is this?',
  noun: 'raptor',
  source: 'Forest Raptors ID Practice Slides',
  groups: {
    accipiters: 'Accipiters (forest hawks)',
    buteos: 'Buteos (soaring hawks)',
    falcons: 'Falcons',
    large: 'Eagles, osprey & vulture',
    harrier: 'Harrier',
  },
  items: [
    // ---- Accipiters: short rounded wings, long tail, flap-flap-glide ----
    {
      id: 'sharp-shinned-hawk', name: 'Sharp-shinned hawk', scientific: 'Accipiter striatus', group: 'accipiters',
      images: imgs(6),
      tips: [
        'Smallest accipiter (jay-sized): square-tipped, notched tail and a small head that barely sticks out past the wings in flight.',
        'Adult blue-grey back with orange-barred breast; short rounded wings and a long tail.',
        'Rapid flap-flap-glide flight; hunts small songbirds (often at feeders).',
      ],
      lookalikes: ['coopers-hawk', 'merlin', 'american-kestrel'],
    },
    {
      id: 'coopers-hawk', name: 'Cooper\'s hawk', scientific: 'Accipiter cooperii', group: 'accipiters',
      images: imgs(2),
      tips: [
        'Crow-sized accipiter with a rounded tail tip (white band at the end) and a large head that sticks out past the wings: a "flying cross".',
        'Adult blue-grey back, orange-barred breast and a dark cap contrasting with a paler nape.',
        'Short rounded wings, long tail; flap-flap-glide flight through the forest.',
      ],
      lookalikes: ['sharp-shinned-hawk', 'northern-goshawk', 'red-shouldered-hawk'],
    },
    {
      id: 'northern-goshawk', name: 'Northern goshawk', scientific: 'Accipiter gentilis', group: 'accipiters',
      images: imgs(9),
      tips: [
        'Largest accipiter: adults blue-grey above, finely grey-barred below (not orange).',
        'Bold white eyebrow (supercilium) over a red eye and a dark cap.',
        'Broader wings and heavier build than Cooper\'s; fierce defender of its nest in mature forest.',
      ],
      lookalikes: ['coopers-hawk', 'peregrine-falcon', 'red-shouldered-hawk'],
    },

    // ---- Buteos: broad wings, short fanned tail, soaring ----
    {
      id: 'red-tailed-hawk', name: 'Red-tailed hawk', scientific: 'Buteo jamaicensis', group: 'buteos',
      images: imgs(11),
      tips: [
        'Brick-red (rusty-orange) tail on adults.',
        'Dark "belly band" of streaks across a pale belly; dark patagial bar on the leading edge of the underwing.',
        'Large, bulky buteo; often perched on roadside poles and trees over open fields.',
      ],
      lookalikes: ['red-shouldered-hawk', 'broad-winged-hawk', 'golden-eagle'],
    },
    {
      id: 'red-shouldered-hawk', name: 'Red-shouldered hawk', scientific: 'Buteo lineatus', group: 'buteos',
      images: imgs(14),
      tips: [
        'Warm reddish-orange barred breast and reddish "shoulders" (wing coverts).',
        'Black tail with narrow white bands; checkered black-and-white flight feathers.',
        'Pale crescent "windows" near the wingtips in flight. Nests in wet, mature hardwood forest.',
      ],
      lookalikes: ['broad-winged-hawk', 'red-tailed-hawk', 'coopers-hawk'],
    },
    {
      id: 'broad-winged-hawk', name: 'Broad-winged hawk', scientific: 'Buteo platypterus', group: 'buteos',
      images: imgs(4),
      tips: [
        'Small, chunky buteo with a short tail crossed by bold black and white bands (about equal width).',
        'Pale underwings with a dark border along the trailing edge and wingtips.',
        'Brown-barred breast; migrates in huge flocks ("kettles") in September.',
      ],
      lookalikes: ['red-shouldered-hawk', 'red-tailed-hawk', 'coopers-hawk'],
    },

    // ---- Falcons: pointed wings, fast flight, dark facial marks ----
    {
      id: 'american-kestrel', name: 'American kestrel', scientific: 'Falco sparverius', group: 'falcons',
      images: imgs(10),
      tips: [
        'Smallest falcon: rusty-orange back and tail, two black "sideburns" on a white face.',
        'Males have blue-grey wings; females have rusty, barred wings.',
        'Pointed wings; hovers over fields and perches on wires. Nests in cavities.',
      ],
      lookalikes: ['merlin', 'sharp-shinned-hawk'],
    },
    {
      id: 'merlin', name: 'Merlin', scientific: 'Falco columbarius', group: 'falcons',
      images: imgs(13),
      tips: [
        'Small, stocky, dark falcon with heavy brown streaking below and a faint single moustache mark.',
        'Dark tail with narrow pale bands; pointed wings.',
        'Fast, powerful, direct flight (no hovering); chases small birds.',
      ],
      lookalikes: ['american-kestrel', 'peregrine-falcon', 'sharp-shinned-hawk'],
    },
    {
      id: 'peregrine-falcon', name: 'Peregrine falcon', scientific: 'Falco peregrinus', group: 'falcons',
      images: imgs(7),
      tips: [
        'Thick black "helmet" and moustache on the face; yellow eye-ring and cere.',
        'Blue-grey above, pale and finely barred below; long, pointed wings.',
        'Large falcon and the fastest bird (stoops at 300+ km/h). Species at risk recovering after DDT; nests on cliffs and buildings.',
      ],
      lookalikes: ['merlin', 'northern-goshawk'],
    },

    // ---- Eagles, osprey & vulture ----
    {
      id: 'bald-eagle', name: 'Bald eagle', scientific: 'Haliaeetus leucocephalus', group: 'large',
      images: imgs(3),
      tips: [
        'Adult: white head and tail, dark brown body, large yellow bill.',
        'Huge, flat, plank-like wings in flight. Immatures are mottled brown and white (adult plumage at 4–5 years).',
        'Near large lakes and rivers; eats mostly fish. Species at risk recovering after DDT.',
      ],
      lookalikes: ['golden-eagle', 'osprey', 'turkey-vulture'],
    },
    {
      id: 'golden-eagle', name: 'Golden eagle', scientific: 'Aquila chrysaetos', group: 'large',
      images: imgs(15),
      tips: [
        'Dark brown all over with a golden-buff nape (back of head and neck).',
        'Legs feathered all the way to the toes (a bald eagle\'s are bare).',
        'Smaller bill than a bald eagle; holds wings in a slight V. Rare in Ontario.',
      ],
      lookalikes: ['bald-eagle', 'turkey-vulture', 'red-tailed-hawk'],
    },
    {
      id: 'osprey', name: 'Osprey', scientific: 'Pandion haliaetus', group: 'large',
      images: imgs(12),
      tips: [
        'White below and dark brown above, with a dark stripe through the eye.',
        'Long, narrow wings bent at the wrist (an "M" shape) with dark wrist patches.',
        'Fish hawk: dives feet-first for fish and nests on platforms and poles near water.',
      ],
      lookalikes: ['bald-eagle', 'northern-harrier'],
    },
    {
      id: 'turkey-vulture', name: 'Turkey vulture', scientific: 'Cathartes aura', group: 'large',
      images: imgs(5),
      tips: [
        'Small, bare red head (adult) on a dark brown-black body.',
        'Two-toned underwings: black lining, silvery-grey flight feathers.',
        'Soars with wings in a strong V (dihedral), rocking and tilting; scavenger that finds carrion by smell.',
      ],
      lookalikes: ['bald-eagle', 'golden-eagle'],
    },

    // ---- Harrier ----
    {
      id: 'northern-harrier', name: 'Northern harrier', scientific: 'Circus hudsonius', group: 'harrier',
      images: imgs(8),
      tips: [
        'White rump patch at the base of the tail (key ID feature).',
        'Owl-like facial disc; long wings and long tail. Males grey ("grey ghost"), females brown.',
        'Flies low over marshes and fields with wings held in a V, hunting by sound.',
      ],
      lookalikes: ['coopers-hawk', 'osprey', 'red-shouldered-hawk'],
    },
  ],
};
