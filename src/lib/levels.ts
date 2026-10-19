/** How well a learner knows one species or quiz item. Safe on the server and in the browser. */
export type Level = 'new' | 'struggling' | 'learning' | 'mastered';

/** Weight of the newest answer in the running mastery score. */
export const ALPHA = 0.35;

export function levelFor(attempts: number, mastery: number): Level {
  if (attempts === 0) return 'new';
  if (mastery >= 0.8 && attempts >= 4) return 'mastered';
  if (mastery >= 0.5) return 'learning';
  return 'struggling';
}

/** Chip colour class for each level. */
export const LEVEL_CHIP: Record<Level, string> = { new: '', struggling: 'chip-bad', learning: 'chip-warn', mastered: 'chip-ok' };
