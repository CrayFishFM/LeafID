/** How bad a defect is for the tree's future (Forest Health). */
export type Severity = 'minor' | 'moderate' | 'major';
/** Growing stock class: AGS (acceptable) or UGS (unacceptable); moderate defects can go either way. */
export type Stock = 'AGS' | 'UGS' | 'either';
export type Sex = 'male' | 'female';

export interface Rating {
  /** A condition that changes the rating, e.g. "Larger than 900 cm²". Shown with the question. */
  when?: string;
  severity: Severity;
  stock: Stock;
  /** Shown after answering, e.g. an exception worth remembering. */
  note?: string;
}

export interface TopicItem {
  /** Stable id, used in the database. Never change one once people have practised it. */
  id: string;
  name: string;
  /** Other accepted names, shown under the main one. */
  aka?: string;
  /** A short tag shown beside the name, e.g. "Invasive species". */
  note?: string;
  scientific?: string;
  group: string;
  /** What to look for, most telling first. The first tip is also the last hint. */
  tips: string[];
  /** Items people most often mix this one up with; they show up as wrong choices. */
  lookalikes: string[];
  /**
   * Photos, as files in public/quizzes/<topic>/. Each one comes from a slide of the original deck.
   * A photo showing two birds is listed under both, with the side that is this one: "01.webp@left"
   * (left, right, top or bottom). The question then asks about that bird.
   */
  images: string[];
  /**
   * For an item that is one sex of a species (Mallard drake / Mallard hen): the species, from the
   * topic's `pairs`, for the quiz that shows the male and female together. Lives in code only.
   */
  pair?: { species: string; sex: Sex };
  /**
   * Severity and AGS/UGS, for topics that grade items (defects). One entry per case; a question
   * picks one. Lives in code only (not the database), so it is not admin-editable.
   */
  ratings?: Rating[];
  /** Set once an admin has edited the item. */
  updatedAt?: number | null;
  updatedBy?: string | null;
}

export interface Topic {
  id: string;
  title: string;
  /** Short label for tabs and buttons. */
  short: string;
  blurb: string;
  question: string;
  /** Singular noun for one item, e.g. "fish" or "defect". */
  noun: string;
  groups: Record<string, string>;
  items: TopicItem[];
  /** Species photographed as both sexes, id → name ("mallard" → "Mallard"). Lives in code only. */
  pairs?: Record<string, string>;
  source: string;
  updatedAt?: number | null;
  updatedBy?: string | null;
}
