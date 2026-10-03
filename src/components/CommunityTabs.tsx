'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/community', label: 'Review photos' },
  { href: '/community/upload', label: 'Upload' },
  { href: '/community/mine', label: 'My uploads' },
];

export function CommunityTabs() {
  const path = usePathname();
  return (
    <div className="segmented">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} aria-current={path === t.href}>{t.label}</Link>
      ))}
    </div>
  );
}
