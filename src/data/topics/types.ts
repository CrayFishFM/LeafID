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
  /** Photos, as files in public/quizzes/<topic>/. Each one comes from a slide of the original deck. */
  images: string[];
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
  source: string;
  updatedAt?: number | null;
  updatedBy?: string | null;
}
