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
  /** Practice test questions on this card. Every card needs at least one (except opinion cards). */
  test?: TestQuestion[];
}

/**
 * A practice test question:
 * - mc: pick one; `answer` is an index into `choices`.
 * - tf: true or false.
 * - multi: select all that apply; `answers` are indexes into `choices`.
 * - type: type the answer; matched ignoring case, spaces and punctuation. A numeric answer
 *   matches any typed number with the same value ("900 cm²" for 900, "1:10,000" for 10000).
 * - order: put `order` (the right order) back in order.
 */
export type TestQuestion =
  | { kind: 'mc'; q: string; choices: string[]; answer: number; why: string }
  | { kind: 'tf'; q: string; answer: boolean; why: string }
  | { kind: 'multi'; q: string; choices: string[]; answers: number[]; why: string }
  | { kind: 'type'; q: string; accept: string[]; why: string }
  | { kind: 'order'; q: string; order: string[]; why: string };

export const mc = (q: string, choices: string[], answer: number, why: string): TestQuestion => ({ kind: 'mc', q, choices, answer, why });
export const tf = (q: string, answer: boolean, why: string): TestQuestion => ({ kind: 'tf', q, answer, why });
export const multi = (q: string, choices: string[], answers: number[], why: string): TestQuestion =>
  ({ kind: 'multi', q, choices, answers, why });
export const typed = (q: string, accept: string[], why: string): TestQuestion => ({ kind: 'type', q, accept, why });
export const order = (q: string, items: string[], why: string): TestQuestion => ({ kind: 'order', q, order: items, why });

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
  /** Flashcards, each with its practice test questions. */
  cards: StudyCard[];
  sorts: SortDrill[];
  ranks: RankDrill[];
}
