/**
 * Study guide progress lives in the browser (localStorage), not the database: which flashcards
 * you know, and your practice test scores. Every read and write tolerates blocked storage.
 */

export interface TestResult { score: number; total: number; at: number }

const knownKey = (guideId: string) => `study:${guideId}:known-cards`;
const testsKey = (guideId: string) => `study:${guideId}:tests`;

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked: keep it for this visit */ }
}

/** Questions of the flashcards marked "Got it". */
export const loadKnown = (guideId: string) => new Set(read<string[]>(knownKey(guideId), []));
export const saveKnown = (guideId: string, known: Set<string>) => write(knownKey(guideId), [...known]);

/** Practice test results, newest last. */
export const loadTests = (guideId: string) => read<TestResult[]>(testsKey(guideId), []);
export function saveTest(guideId: string, score: number, total: number) {
  write(testsKey(guideId), [...loadTests(guideId), { score, total, at: Date.now() }].slice(-20));
}
