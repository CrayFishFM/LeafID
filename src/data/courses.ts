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
    subject: 'Hardwood defects',
    blurb: 'Name the defect from a photo, then rate it: minor, moderate or major, and AGS or UGS.',
    topics: ['defects'],
    links: [
      { label: 'Identify & rate', href: '/quizzes/defects' },
      { label: 'Rate only', href: '/quizzes/defects/grade' },
      { label: 'Study guide', href: '/quizzes/defects/study' },
    ],
  },
  {
    id: 'wildlife',
    title: 'Wildlife',
    subject: 'Ontario fish',
    blurb: 'Ontario fish species from the fish ID practice quiz, with what to look for in each.',
    topics: ['fish'],
    links: [
      { label: 'Practise fish ID', href: '/quizzes/fish' },
      { label: 'Study guide', href: '/quizzes/fish/study' },
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
