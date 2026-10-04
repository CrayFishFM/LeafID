/** Helpers for admin-editable content stored in the database. */

export function parseJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/** Trim and collapse whitespace, then check the length. Returns null for an empty optional field. */
export function cleanText(v: unknown, label: string, max: number, required = true): string | null {
  const s = typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '';
  if (!s) {
    if (required) throw new Error(`${label} can't be empty`);
    return null;
  }
  if (s.length > max) throw new Error(`${label} must be ${max} characters or fewer`);
  return s;
}

/** A list of lines (tips, features…): blanks dropped, each line checked. */
export function cleanLines(v: unknown, label: string, { min = 1, max = 8, maxLength = 300 } = {}): string[] {
  const lines = (Array.isArray(v) ? v : [])
    .map((t, n) => cleanText(t, `${label} ${n + 1}`, maxLength, false))
    .filter((t): t is string => !!t);
  if (lines.length < min) throw new Error(min === 1 ? `Add at least one ${label.toLowerCase()}` : `Add at least ${min} ${label.toLowerCase()}s`);
  if (lines.length > max) throw new Error(`Use ${max} ${label.toLowerCase()}s or fewer`);
  return lines;
}
