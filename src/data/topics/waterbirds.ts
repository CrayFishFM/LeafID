import type { Topic } from './types';

/**
 * Ducks (and the least bittern) are one item per sex, so the photo quiz asks drake or hen too.
 * `pairs` lists the species with both sexes, for the quiz that shows a male and a female together.
 * Photos with a drake and hen side by side are the deck's originals, listed under both birds.
 */
export const WATERBIRDS: Topic = {
  id: 'waterbirds',
  title: 'Water bird ID',
  short: 'Water birds',
  blurb: '15 aquatic and shoreline birds from the water birds lecture, with the drake and hen of each duck.',
  question: 'Which bird is this?',
  noun: 'bird',
  source: 'Water Birds lecture',
  groups: {
    dabbling: 'Dabbling ducks',
    perching: 'Perching & diving ducks',
    herons: 'Herons & bitterns',
    other: 'Grebe & cormorant',
    shore: 'Crane & shorebirds',
  },
  pairs: {
    mallard: 'Mallard',
    'black-duck': 'Black duck',
    'wood-duck': 'Wood duck',
    bufflehead: 'Bufflehead',
    'common-merganser': 'Common merganser',
    'hooded-merganser': 'Hooded merganser',
    'least-bittern': 'Least bittern',
  },
  items: [
    {
      id: 'mallard-drake', name: 'Mallard drake', scientific: 'Anas platyrhynchos', group: 'dabbling', images: ['01.webp@right'],
      pair: { species: 'mallard', sex: 'male' },
      tips: [
        'Bright green head and an olive-yellow bill.',
        'Brown chest, grey body and a blue speculum (wing patch) with white borders.',
        'Large dabbling duck (up to 1.3 kg) with orange feet.',
      ],
      lookalikes: ['mallard-hen', 'common-merganser-drake', 'black-duck-drake'],
    },
    {
      id: 'mallard-hen', name: 'Mallard hen', scientific: 'Anas platyrhynchos', group: 'dabbling', images: ['01.webp@left', '03.webp@right'],
      pair: { species: 'mallard', sex: 'female' },
      tips: [
        'Mottled brown overall with an orange and black bill.',
        'Blue speculum with white borders (two distinct white lines in flight); a black duck has none or one faint line.',
        'Lighter and browner than a black duck, with orange feet.',
      ],
      lookalikes: ['black-duck-hen', 'black-duck-drake', 'mallard-drake', 'wood-duck-hen'],
    },
    {
      id: 'black-duck-drake', name: 'Black duck drake', aka: 'American black duck', scientific: 'Anas rubripes', group: 'dabbling', images: ['04.webp@right'],
      pair: { species: 'black-duck', sex: 'male' },
      tips: [
        'Greenish-yellow bill: the easy way to tell the drake from the hen.',
        'Dark black-brown body that contrasts with a lighter brown head; looks like a dark mallard hen.',
        'Iridescent purple speculum with no white borders.',
      ],
      lookalikes: ['black-duck-hen', 'mallard-hen'],
    },
    {
      id: 'black-duck-hen', name: 'Black duck hen', aka: 'American black duck', scientific: 'Anas rubripes', group: 'dabbling', images: ['04.webp@left', '06.webp', '03.webp@left'],
      pair: { species: 'black-duck', sex: 'female' },
      tips: [
        'Dull olive-green to black bill (the drake\'s is greenish-yellow).',
        'Dark black-brown body that contrasts with a lighter brown head; darker than a mallard hen.',
        'Iridescent purple speculum with no white borders (none or one faint white line in flight).',
      ],
      lookalikes: ['black-duck-drake', 'mallard-hen'],
    },
    {
      id: 'wood-duck-drake', name: 'Wood duck drake', scientific: 'Aix sponsa', group: 'perching', images: ['08.webp', '09.webp', '07.webp@top'],
      pair: { species: 'wood-duck', sex: 'male' },
      tips: [
        'Iridescent green and white crested head with red eyes and a red and white bill.',
        'Chestnut breast, golden flanks and an iridescent back.',
        'Medium-sized perching duck of wooded wetlands; nests in tree cavities and nest boxes.',
      ],
      lookalikes: ['wood-duck-hen', 'hooded-merganser-drake', 'mallard-drake'],
    },
    {
      id: 'wood-duck-hen', name: 'Wood duck hen', scientific: 'Aix sponsa', group: 'perching', images: ['10.webp', '11.webp', '07.webp@bottom'],
      pair: { species: 'wood-duck', sex: 'female' },
      tips: [
        'A drab grey-brown version of the drake, with a white teardrop around the eye.',
        'Small crest and a blue wing patch; still striking for a duck hen.',
        'Nests in natural tree cavities (it cannot make its own) or nest boxes, near or over water.',
      ],
      lookalikes: ['wood-duck-drake', 'hooded-merganser-hen', 'mallard-hen'],
    },
    {
      id: 'bufflehead-drake', name: 'Bufflehead drake', scientific: 'Bucephala albeola', group: 'perching', images: ['12.webp', '13.webp'],
      pair: { species: 'bufflehead', sex: 'male' },
      tips: [
        'Large white patch that wraps around the back of a dark head.',
        'White body with a black back; a large white patch on the upper wing in flight.',
        'One of North America\'s smallest diving ducks.',
      ],
      lookalikes: ['hooded-merganser-drake', 'bufflehead-hen', 'common-merganser-drake'],
    },
    {
      id: 'bufflehead-hen', name: 'Bufflehead hen', scientific: 'Bucephala albeola', group: 'perching', images: ['14.webp', '15.webp'],
      pair: { species: 'bufflehead', sex: 'female' },
      tips: [
        'Grey-brown overall with an oval white cheek patch.',
        'Smaller white wing patch than the drake in flight.',
        'Tiny diving duck; nests in tree cavities, especially old Northern Flicker holes.',
      ],
      lookalikes: ['bufflehead-drake', 'hooded-merganser-hen', 'wood-duck-hen'],
    },
    {
      id: 'common-merganser-drake', name: 'Common merganser drake', scientific: 'Mergus merganser', group: 'perching', images: ['16.webp'],
      pair: { species: 'common-merganser', sex: 'male' },
      tips: [
        'Gleaming white body with a dark, iridescent-green head and a black back.',
        'Red, straight, narrow bill.',
        'Long-bodied duck with thin, pointed wings; the largest merganser in Canada.',
      ],
      lookalikes: ['mallard-drake', 'common-merganser-hen', 'bufflehead-drake'],
    },
    {
      id: 'common-merganser-hen', name: 'Common merganser hen', scientific: 'Mergus merganser', group: 'perching', images: ['17.webp', '18.webp'],
      pair: { species: 'common-merganser', sex: 'female' },
      tips: [
        'Rusty-cinnamon head with a shaggy crest and a red, narrow bill.',
        'Grey body with a white chest.',
        'Often seen leading chicks, which catch all their own food (insects, then fish at about 12 days).',
      ],
      lookalikes: ['hooded-merganser-hen', 'common-merganser-drake'],
    },
    {
      id: 'hooded-merganser-drake', name: 'Hooded merganser drake', scientific: 'Lophodytes cucullatus', group: 'perching', images: ['19.webp'],
      pair: { species: 'hooded-merganser', sex: 'male' },
      tips: [
        'Fan-shaped crest: a black head with a large white patch.',
        'Black above, with a white breast and rich chestnut flanks.',
        'Small diving duck with a thin bill.',
      ],
      lookalikes: ['bufflehead-drake', 'wood-duck-drake', 'hooded-merganser-hen'],
    },
    {
      id: 'hooded-merganser-hen', name: 'Hooded merganser hen', scientific: 'Lophodytes cucullatus', group: 'perching', images: ['20.webp'],
      pair: { species: 'hooded-merganser', sex: 'female' },
      tips: [
        'Grey and brown with a warm tawny-cinnamon, fan-shaped crest.',
        'Thin bill; the crest makes the head look oversized and oblong.',
        'Small diving duck of small freshwater ponds and rivers.',
      ],
      lookalikes: ['common-merganser-hen', 'bufflehead-hen', 'wood-duck-hen'],
    },
    {
      id: 'horned-grebe', name: 'Horned grebe', note: 'Special concern', scientific: 'Podiceps auritus', group: 'other', images: ['21.webp', '22.webp'],
      tips: [
        'Long yellow tufts behind the eye on a grey-black head (breeding).',
        'Rusty-cinnamon neck and sides with a dark grey-black back.',
        'Small, compact body and a straight, narrow bill, very unlike a duck\'s; pairs "dance" in courtship.',
      ],
      lookalikes: ['bufflehead-drake', 'double-crested-cormorant', 'hooded-merganser-hen'],
    },
    {
      id: 'double-crested-cormorant', name: 'Double-crested cormorant', scientific: 'Nannopterum auritum', group: 'other', images: ['38.webp'],
      tips: [
        'Brown-black with a small patch of yellow-orange skin on the face.',
        'Thin, strongly hooked bill about as long as the head.',
        'Large waterbird with a small head on a long, kinked neck; colonies\' guano can kill island trees.',
      ],
      lookalikes: ['horned-grebe', 'great-blue-heron'],
    },
    {
      id: 'least-bittern-male', name: 'Least bittern male', note: 'Threatened', scientific: 'Ixobrychus exilis', group: 'herons', images: ['23.webp'],
      pair: { species: 'least-bittern', sex: 'male' },
      tips: [
        'Black crown and back (the female\'s are lighter brown).',
        'Large chestnut patches on the wings; bright yellow legs and beak.',
        'Smallest heron, only 30 cm long; hides in cattail marshes.',
      ],
      lookalikes: ['least-bittern-female', 'green-heron', 'american-bittern'],
    },
    {
      id: 'least-bittern-female', name: 'Least bittern female', note: 'Threatened', scientific: 'Ixobrychus exilis', group: 'herons', images: ['24.webp'],
      pair: { species: 'least-bittern', sex: 'female' },
      tips: [
        'Brown crown and back, lighter than the male\'s black.',
        'Light tan throat with whitish streaks; bright yellow legs and beak.',
        'Smallest heron, only 30 cm long, with chestnut wing patches.',
      ],
      lookalikes: ['least-bittern-male', 'american-bittern', 'green-heron'],
    },
    {
      id: 'american-bittern', name: 'American bittern', scientific: 'Botaurus lentiginosus', group: 'herons', images: ['25.webp', '26.webp', '27.webp'],
      tips: [
        'Warm brown and white, strongly streaked, especially on the neck.',
        'Points its beak straight up when alarmed, blending in with the reeds.',
        'Thick, compact heron with short legs, a thick neck and a hunched posture.',
      ],
      lookalikes: ['least-bittern-female', 'green-heron', 'great-blue-heron'],
    },
    {
      id: 'great-blue-heron', name: 'Great blue heron', scientific: 'Ardea herodias', group: 'herons', images: ['28.webp'],
      tips: [
        'Largest heron in Canada: over 1 m tall with a greyish-blue back.',
        'White crown with a black stripe from the yellow eye to slender black plumes behind the head.',
        'White breast streaked with black; nests in colonies in wooded swamps or on islands.',
      ],
      lookalikes: ['sandhill-crane', 'american-bittern', 'green-heron'],
    },
    {
      id: 'green-heron', name: 'Green heron', scientific: 'Butorides virescens', group: 'herons', images: ['29.webp', '30.webp', '31.webp'],
      tips: [
        'Chestnut neck with a white line down the front.',
        'Glossy greenish-black cap, a greenish back and grey-black wings; short yellow legs.',
        'Small heron (about 44 cm) that holds its neck tight to its body; dark, sharp-pointed bill. Uses bait to fish.',
      ],
      lookalikes: ['least-bittern-male', 'american-bittern', 'great-blue-heron'],
    },
    {
      id: 'sandhill-crane', name: 'Sandhill crane', scientific: 'Antigone canadensis', group: 'shore', images: ['32.webp', '33.webp', '34.webp'],
      tips: [
        'Red skin on the crown and a pale cheek.',
        'Slate grey, often with a rusty wash, and drooping feathers over the tail that form a "bustle".',
        'Very tall, with a long neck, long black legs and a straight bill longer than the head.',
      ],
      lookalikes: ['great-blue-heron'],
    },
    {
      id: 'killdeer', name: 'Killdeer', scientific: 'Charadrius vociferus', group: 'shore', images: ['35.webp', '36.webp'],
      tips: [
        'Two black bands across a white chest.',
        'Brownish-tan above with a black and white face; bright orange-buff rump in flight.',
        'Fakes a broken wing to lead predators from its nest; named for its "kill-deer" call.',
      ],
      lookalikes: ['piping-plover'],
    },
    {
      id: 'piping-plover', name: 'Piping plover', note: 'Endangered', scientific: 'Charadrius melodus', group: 'shore', images: ['37.webp'],
      tips: [
        'Pale sandy-grey above with a single black neck band and black crown stripe.',
        'Stubby orange bill with a black tip, and bright orange legs.',
        'Round, stocky little shorebird of dry sandy beaches (Great Lakes shores in Ontario).',
      ],
      lookalikes: ['killdeer'],
    },
  ],
};
