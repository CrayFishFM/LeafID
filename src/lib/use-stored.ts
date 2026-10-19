'use client';

import { useEffect, useState } from 'react';

/**
 * A preference remembered in this browser (localStorage). Starts as `fallback` so the server and
 * first render match, then picks up the saved value. Blocked storage just means it isn't remembered.
 */
export function useStoredPreference<T extends string>(key: string, fallback: T, allowed: readonly T[]): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key) as T | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore a saved preference
      if (saved && allowed.includes(saved)) setValue(saved);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read once, on mount
  }, [key]);
  const set = (v: T) => {
    setValue(v);
    try { localStorage.setItem(key, v); } catch {}
  };
  return [value, set];
}
