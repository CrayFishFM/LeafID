'use client';

import { useEffect, useState } from 'react';
import { AutoIcon, MoonIcon, SunIcon } from './icons';

type Theme = 'system' | 'light' | 'dark';
const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const LABEL: Record<Theme, string> = { system: 'Theme: match device', light: 'Theme: light', dark: 'Theme: dark' };

/** Runs before paint (inlined in <head>) so the saved theme never flashes. */
export const themeInitScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the pre-paint script
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  function cycle() {
    const next = NEXT[theme];
    setTheme(next);
    try {
      if (next === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', next);
    } catch {}
    if (next === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
  }

  const Icon = theme === 'light' ? SunIcon : theme === 'dark' ? MoonIcon : AutoIcon;
  return (
    <button type="button" className="btn btn-ghost icon-btn" onClick={cycle} aria-label={LABEL[theme]} title={LABEL[theme]}>
      <Icon />
    </button>
  );
}
