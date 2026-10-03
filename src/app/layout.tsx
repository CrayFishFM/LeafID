import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Link from 'next/link';
import { LeafIcon } from '@/components/icons';
import { BottomNav, TopNav } from '@/components/Nav';
import { SignOutButton } from '@/components/SignOutButton';
import { themeInitScript, ThemeToggle } from '@/components/ThemeToggle';
import { getSession } from '@/lib/auth';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: { default: 'LeafID — Ontario tree leaf identification', template: '%s · LeafID' },
  description: 'Learn to identify Ontario tree species by their leaves, with adaptive practice and crowd-verified photos.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5ef' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1410' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand">
              <LeafIcon /> LeafID
            </Link>
            <TopNav />
            <div className="topbar-right">
              <ThemeToggle />
              {session?.user.role === 'admin' && (
                <Link href="/admin" className="btn btn-sm admin-link">Admin</Link>
              )}
              {session ? (
                <SignOutButton />
              ) : (
                <Link href="/sign-in" className="btn btn-sm btn-primary">Sign in</Link>
              )}
            </div>
          </div>
        </header>
        <main className="container">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
