'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartIcon, GridIcon, HomeIcon, LeafIcon, UsersIcon } from './icons';

const LINKS = [
  // The brand links home on wide screens, so Home is only in the phone tab bar.
  { href: '/', label: 'Home', Icon: HomeIcon, mobileOnly: true, also: [] },
  { href: '/courses', label: 'Courses', Icon: GridIcon, also: ['/quizzes'] },
  { href: '/learn', label: 'Tree ID', Icon: LeafIcon, also: ['/quiz'] },
  { href: '/progress', label: 'Progress', Icon: ChartIcon, also: [] },
  { href: '/community', label: 'Community', Icon: UsersIcon, also: [] },
];

function useActive() {
  const path = usePathname();
  const on = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));
  return (l: (typeof LINKS)[number]) => (on(l.href) || l.also.some(on) ? 'page' : undefined);
}

export function TopNav() {
  const active = useActive();
  return (
    <nav className="topnav" aria-label="Main">
      {LINKS.filter((l) => !l.mobileOnly).map((l) => (
        <Link key={l.href} href={l.href} aria-current={active(l)}>{l.label}</Link>
      ))}
    </nav>
  );
}

export function BottomNav() {
  const active = useActive();
  return (
    <nav className="bottomnav" aria-label="Main">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={active(l)}>
          <l.Icon />
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
