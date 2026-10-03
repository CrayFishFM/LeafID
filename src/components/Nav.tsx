'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookIcon, ChartIcon, TargetIcon, UsersIcon } from './icons';

const LINKS = [
  { href: '/learn', label: 'Learn', Icon: BookIcon },
  { href: '/quiz', label: 'Practice', Icon: TargetIcon },
  { href: '/progress', label: 'Progress', Icon: ChartIcon },
  { href: '/community', label: 'Community', Icon: UsersIcon },
];

function useActive() {
  const path = usePathname();
  return (href: string) => (path === href || path.startsWith(href + '/') ? 'page' : undefined);
}

export function TopNav() {
  const active = useActive();
  return (
    <nav className="topnav" aria-label="Main">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={active(l.href)}>{l.label}</Link>
      ))}
    </nav>
  );
}

export function BottomNav() {
  const active = useActive();
  return (
    <nav className="bottomnav" aria-label="Main">
      {LINKS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} aria-current={active(href)}>
          <Icon />
          {label}
        </Link>
      ))}
    </nav>
  );
}
