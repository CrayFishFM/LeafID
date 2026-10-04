'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/photos', label: 'Photos' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/species', label: 'Species' },
  { href: '/admin/quizzes', label: 'Quizzes' },
  { href: '/admin/email', label: 'Email' },
];

export function AdminTabs() {
  const path = usePathname();
  return (
    <div className="segmented">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} aria-current={path === t.href}>{t.label}</Link>
      ))}
    </div>
  );
}
