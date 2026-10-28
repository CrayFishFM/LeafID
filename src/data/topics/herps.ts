import type { Topic } from './types';

/**
 * Turtles, snakes, the skink, salamanders and frogs from the amphibians and reptiles lecture.
 * Notes are the species at risk status given in the lecture. The red-spotted newt is one item
 * with photos of both the orange eft and the green aquatic adult.
 */
export const HERPS: Topic = {
  id: 'herps',
  title: 'Reptile & amphibian ID',
  short: 'Reptiles & amphibians',
  blurb: '18 Ontario turtles, snakes, salamanders and frogs from the amphibians and reptiles lecture.',
  question: 'Which species is this?',
  noun: 'animal',
  source: 'Amphibians and Reptiles lecture',
  groups: {
    turtles: 'Turtles',
    snakes: 'Snakes',
    lizards: 'Lizard',
    salamanders: 'Salamanders & newts',
    frogs: 'Frogs',
  },
  items: [
    {
      id: 'snapping-turtle', name: 'Snapping turtle', note: 'Special concern', scientific: 'Chelydra serpentina', group: 'turtles', images: ['01.webp', '02.webp'],
      tips: [
        'Long tail (can be longer than the body) with dinosaur-like triangular crests along it.',
        'Large black, olive or brown shell, often covered in algae; a small plastron and a big head.',
        'Canada\'s largest freshwater turtle (20–36 cm, 4.5–16 kg); often nests on gravel road shoulders.',
      ],
      lookalikes: ['eastern-musk-turtle', 'spiny-softshell', 'blandings-turtle'],
    },
    {
      id: 'midland-painted-turtle', name: 'Midland painted turtle', scientific: 'Chrysemys picta marginata', group: 'turtles', images: ['03.webp', '04.webp', '05.webp'],
      tips: [
        'Yellow, orange or red markings on an olive-black shell and skin.',
        'Yellow plastron with an irregular "butterfly" mark along the midline.',
        'Broad, smooth, flat shell (12–14 cm); one of Ontario\'s most abundant turtles, often basking in groups.',
      ],
      lookalikes: ['northern-map-turtle', 'blandings-turtle', 'wood-turtle'],
    },
    {
      id: 'northern-map-turtle', name: 'Northern map turtle', note: 'Special concern', scientific: 'Graptemys geographica', group: 'turtles', images: ['06.webp', '07.webp'],
      tips: [
        'Yellow, tan or orange lines on the carapace, with dark borders, like contour lines on a map.',
        'Head and legs covered in an intricate pattern of bright yellow lines.',
        'Olive green to greyish-brown shell with a light yellow to cream plastron; lives in rivers and lakeshores.',
      ],
      lookalikes: ['midland-painted-turtle', 'wood-turtle', 'blandings-turtle'],
    },
    {
      id: 'spiny-softshell', name: 'Spiny softshell turtle', note: 'Endangered', scientific: 'Apalone spinifera', group: 'turtles', images: ['08.webp', '09.webp', '10.webp'],
      tips: [
        'Soft, leathery shell: round and flat, unlike any other Ontario turtle.',
        'Snorkel-like snout.',
        'Olive or tan shell with dark blotches and tiny spines along the front edge; up to 54 cm long.',
      ],
      lookalikes: ['snapping-turtle', 'northern-map-turtle'],
    },
    {
      id: 'eastern-musk-turtle', name: 'Eastern musk turtle', aka: 'Stinkpot', note: 'Special concern', scientific: 'Sternotherus odoratus', group: 'turtles', images: ['11.webp', '12.webp'],
      tips: [
        'Two yellow stripes on the side of the head.',
        'Small (under 13 cm) with a narrow, highly arched shell; most Ontario turtles are wide and flat.',
        'Dull black-brown body; gives off a skunk-like musky odour when disturbed.',
      ],
      lookalikes: ['snapping-turtle', 'blandings-turtle', 'midland-painted-turtle'],
    },
    {
      id: 'blandings-turtle', name: 'Blanding\'s turtle', note: 'Threatened', scientific: 'Emydoidea blandingii', group: 'turtles', images: ['13.webp', '14.webp', '15.webp', '16.webp'],
      tips: [
        'Bright yellow throat and chin: the "smiling turtle".',
        'Domed shell like an army helmet, black to brown with yellow flecks and streaks (up to 27 cm).',
        'Black-grey head and limbs and a rich yellow plastron; does not lay eggs until its teens or twenties.',
      ],
      lookalikes: ['wood-turtle', 'eastern-musk-turtle', 'midland-painted-turtle'],
    },
    {
      id: 'wood-turtle', name: 'Wood turtle', note: 'Endangered', scientific: 'Glyptemys insculpta', group: 'turtles', images: ['17.webp', '18.webp', '19.webp'],
      tips: [
        'Highly sculpted carapace: each scute is raised into an irregular pyramid.',
        'Striking orange-yellow neck, chin and front legs.',
        'Mid-sized (20–24 cm); spends more time on land and shorelines than other turtles. Hatchlings are plain grey-brown.',
      ],
      lookalikes: ['blandings-turtle', 'northern-map-turtle', 'midland-painted-turtle'],
    },
    {
      id: 'eastern-hognose', name: 'Eastern hognose snake', note: 'Threatened', scientific: 'Heterodon platirhinos', group: 'snakes', images: ['20.webp', '21.webp', '22.webp'],
      tips: [
        'Distinctive upturned nose.',
        'Thick-bodied, up to 1 m; some are colourful with black-brown blotches, others drab.',
        'When threatened it hoods like a cobra, hisses and strikes with its mouth closed, then rolls over and plays dead. Eats mainly toads.',
      ],
      lookalikes: ['massasauga', 'eastern-foxsnake'],
    },
    {
      id: 'massasauga', name: 'Massasauga rattlesnake', note: 'Threatened', scientific: 'Sistrurus catenatus', group: 'snakes', images: ['23.webp', '24.webp'],
      tips: [
        'Tail ends in a small rattle; Ontario\'s only venomous snake.',
        'Grey to dark brown with darker "butterfly" or saddle-shaped blotches down the back and alternating blotches on the sides.',
        'Stout body (usually 50–70 cm) and a triangular head.',
      ],
      lookalikes: ['eastern-hognose', 'eastern-foxsnake'],
    },
    {
      id: 'eastern-foxsnake', name: 'Eastern foxsnake', note: 'Threatened', scientific: 'Pantherophis vulpinus', group: 'snakes', images: ['25.webp', '26.webp', '27.webp'],
      tips: [
        'Shiny, rusty orange head.',
        'Golden to light brown body with dark blotches; light yellow and black belly.',
        'One of Ontario\'s largest snakes (over 1.7 m); lays eggs in rotting logs, manure or compost piles.',
      ],
      lookalikes: ['massasauga', 'eastern-hognose'],
    },
    {
      id: 'gray-ratsnake', name: 'Gray ratsnake', aka: 'Eastern ratsnake', note: 'Endangered', scientific: 'Pantherophis spiloides', group: 'snakes', images: ['28.webp', '29.webp'],
      tips: [
        'Shiny black body with a white chin and throat.',
        'White or yellowish belly with dark spots, often in a checkerboard pattern.',
        'Ontario\'s largest snake (up to 2 m); an excellent climber, often seen up in trees. Non-venomous constrictor.',
      ],
      lookalikes: ['eastern-gartersnake', 'eastern-foxsnake'],
    },
    {
      id: 'eastern-gartersnake', name: 'Eastern gartersnake', scientific: 'Thamnophis sirtalis sirtalis', group: 'snakes', images: ['30.webp', '31.webp'],
      tips: [
        'Three yellow stripes: one down the back and one along each side.',
        'Dark green to black body (colour and pattern vary a lot) with a yellowish chin and belly.',
        'Can grow to over 1 m; found almost anywhere: forests, shrublands, wetlands, fields and rocky areas.',
      ],
      lookalikes: ['gray-ratsnake', 'five-lined-skink'],
    },
    {
      id: 'five-lined-skink', name: 'Five-lined skink', aka: 'Common five-lined skink', note: 'Special concern', scientific: 'Plestiodon fasciatus', group: 'lizards', images: ['32.webp', '33.webp'],
      tips: [
        'Five cream-coloured stripes down the back; juveniles have a bright blue tail.',
        'Small (up to 8.6 cm) black or grey lizard with smooth, shiny scales; adults have orange around the jaws and chin.',
        'Ontario\'s only lizard; can drop its tail to escape a predator and grow it back.',
      ],
      lookalikes: ['eastern-gartersnake', 'red-spotted-newt'],
    },
    {
      id: 'spotted-salamander', name: 'Spotted salamander', aka: 'Yellow-spotted salamander', scientific: 'Ambystoma maculatum', group: 'salamanders', images: ['34.webp', '35.webp'],
      tips: [
        'Large yellow or orange spots on a blue-black body.',
        'Large salamander, well over 20 cm; can live over 30 years.',
        'Breeds in fish-free woodland pools; lives underground or under logs the rest of the year.',
      ],
      lookalikes: ['blue-spotted-salamander', 'red-spotted-newt'],
    },
    {
      id: 'blue-spotted-salamander', name: 'Blue-spotted salamander', scientific: 'Ambystoma laterale', group: 'salamanders', images: ['36.webp'],
      tips: [
        'Bluish-white spots on a black or grey-brown body.',
        'Up to 16 cm; can\'t be told from the Jefferson salamander (species at risk) without genetic testing.',
        'Lives on the forest floor, often in burrows; active on warm rainy nights and breeds in early spring.',
      ],
      lookalikes: ['spotted-salamander', 'red-spotted-newt'],
    },
    {
      id: 'red-spotted-newt', name: 'Red-spotted newt', aka: 'Eastern newt', scientific: 'Notophthalmus viridescens', group: 'salamanders', images: ['37.webp', '38.webp', '39.webp'],
      tips: [
        'Two rows of dark-ringed, orange-red spots.',
        'The terrestrial eft is bright orange or brownish (over 8 cm); the aquatic adult is greenish-yellow (up to 14 cm).',
        'Aquatic larva → terrestrial eft → aquatic adult. Efts are about ten times as toxic as adults: careful handling!',
      ],
      lookalikes: ['spotted-salamander', 'blue-spotted-salamander', 'five-lined-skink'],
    },
    {
      id: 'spring-peeper', name: 'Spring peeper', scientific: 'Pseudacris crucifer', group: 'frogs', images: ['40.webp'],
      tips: [
        'Darker X-shaped marking on the back.',
        'Tiny (under 3.7 cm), tan or light brown frog.',
        'Call is a loud, high-pitched "peep" repeated over and over; one of three Ontario frogs that can freeze over winter.',
      ],
      lookalikes: ['gray-treefrog'],
    },
    {
      id: 'gray-treefrog', name: 'Gray treefrog', scientific: 'Hyla versicolor', group: 'frogs', images: ['41.webp', '42.webp'],
      tips: [
        'Rough, warty skin that looks like tree bark, with a white patch under each eye.',
        'Changes colour from green to brown or grey, with large darker blotches on the back.',
        'Large suction-cup toe pads and bright yellow-orange under the thighs; up to 6 cm. Call is a short, flute-like trill.',
      ],
      lookalikes: ['spring-peeper'],
    },
  ],
};
