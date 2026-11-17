/** Stored as the chosen answer when the learner pressed "I don't know". Counts as a miss, not a mix-up. */
export const SKIPPED = '?';

/** How many hints a question can give: leaf ID, and the extra quizzes (fish, defects, water birds…). */
export const LEAF_MAX_HINTS = 3;
export const TOPIC_MAX_HINTS = 2;

/** A hint: text, or text with pictures (e.g. a side-by-side comparison from the slides). */
export type Hint = string | { text: string; images: { src: string; alt: string }[] };
export const hintText = (h: Hint) => (typeof h === 'string' ? h : h.text);
