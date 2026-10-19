/**
 * The courses the site is organised by. Each links to its quizzes and study material; a
 * quiz topic (src/data/topics) belongs to the course that lists it in `topics`.
 */
export interface CourseLink {
  label: string;
  href: string;
}

export interface Course {
  id: string;
  title: string;
  /** What the course's material on this site covers. */
  subject: string;
  blurb: string;
  /** Quiz topic ids from src/data/topics. */
  topics?: string[];
  /** The main thing to do, then the rest. */
  links: CourseLink[];
  /** A library leaf photo key for the card, for courses without quiz photos. */
  photo?: string;
}

export const COURSES: Course[] = [
  {
    id: 'dendrology',
    title: 'Dendrology',
    subject: 'Tree ID by leaf',
    blurb: 'The Ontario tree ID list: leaf features, look-alikes and an adaptive photo quiz, plus a key for a leaf in hand.',
    links: [
      { label: 'Practise leaf ID', href: '/quiz' },
      { label: 'Field guide', href: '/learn' },
      { label: 'Leaf key', href: '/learn/key' },
    ],
  },
  {
    id: 'forest-health',
    title: 'Forest Health',
    subject: 'Midterm review & hardwood defects',
    blurb: 'Name the defect from a photo and rate it (minor, moderate or major; AGS or UGS), plus a midterm review: fungi, other defects, tree marking, cavity and mast trees.',
    topics: ['defects'],
    links: [
      { label: 'Midterm review', href: '/courses/forest-health' },
      { label: 'Identify & rate defects', href: '/quizzes/defects' },
      { label: 'Rate only', href: '/quizzes/defects/grade' },
      { label: 'Defect guide', href: '/quizzes/defects/study' },
    ],
  },
  {
    id: 'ecology',
    title: 'Ecology',
    subject: 'Midterm review',
    blurb: 'Forest regions, shade tolerance and silviculture, tree physiology, reproduction and succession: flashcards, a practice test and drills.',
    links: [{ label: 'Open the study guide', href: '/courses/ecology' }],
    photo: 'lib:Pt/1.jpg',
  },
  {
    id: 'wildlife',
    title: 'Wildlife',
    subject: 'Ontario fish & water birds',
    blurb: 'Ontario fish from the fish ID practice quiz, and the water birds lecture: ducks as drake and hen, herons, cranes and shorebirds.',
    topics: ['fish', 'waterbirds'],
    links: [
      { label: 'Practise fish ID', href: '/quizzes/fish' },
      { label: 'Fish study guide', href: '/quizzes/fish/study' },
      { label: 'Practise water bird ID', href: '/quizzes/waterbirds' },
      { label: 'Male & female ducks', href: '/quizzes/waterbirds/pairs' },
      { label: 'Water bird study guide', href: '/quizzes/waterbirds/study' },
    ],
  },
  {
    id: 'remote-sensing',
    title: 'Remote Sensing',
    subject: 'Midterm review',
    blurb: 'Every midterm review question as flashcards, plus scale problems, UTM zones, GIS sorting and a practice test.',
    links: [{ label: 'Open the study guide', href: '/courses/remote-sensing' }],
  },
];
