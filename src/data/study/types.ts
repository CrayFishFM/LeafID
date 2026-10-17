/**
 * A course study guide: flashcards for every review question, a multiple-choice practice test,
 * and sorting / ordering drills. Course-specific drills (scale, UTM…) are added by the page.
 */

export interface StudyCard {
  /** Question number on the review sheet, if it has one. */
  n?: number;
  /** Which section (week or topic) the card belongs to; one of the guide's `sections`. */
  section: string;
  q: string;
  a: string[];
  /** Shown as "Check this": filled in from other notes or not spelled out in the lecture. */
  check?: string;
  /** A personal-opinion question: the answer is an example, not the answer. */
  opinion?: boolean;
  /** Not a question on the review sheet but covered in the lecture. */
  extra?: boolean;
}

export interface TestQuestion {
  q: string;
  choices: string[];
  /** Index into choices. */
  answer: number;
  why: string;
}

export interface SortDrill {
  id: string;
  title: string;
  prompt: string;
  bins: string[];
  items: { label: string; bin: string }[];
}

/** Put items in order; `order` is the right answer, first / most important at the top. */
export interface RankDrill {
  id: string;
  title: string;
  prompt: string;
  order: string[];
  /** Shown after checking. */
  explain: string;
}

export interface StudyGuide {
  id: string;
  sections: string[];
  /** "All weeks", "All topics"… */
  allLabel: string;
  cards: StudyCard[];
  test: TestQuestion[];
  sorts: SortDrill[];
  ranks: RankDrill[];
}
