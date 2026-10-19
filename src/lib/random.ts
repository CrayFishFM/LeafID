/** Random helpers shared by the quizzes and study drills. Safe on the server and in the browser. */

export const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/** A shuffled copy (Fisher–Yates). */
export function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One item, with the chance of each in proportion to its weight. */
export function weightedPick<T>(items: { item: T; w: number }[]): T {
  let r = Math.random() * items.reduce((a, x) => a + x.w, 0);
  for (const x of items) if ((r -= x.w) <= 0) return x.item;
  return items[items.length - 1].item;
}
