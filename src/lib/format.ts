/** Whole-number percentage, 0 when there is nothing to divide by. */
export const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
