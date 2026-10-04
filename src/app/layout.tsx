import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Link from 'next/link';
import { GitHubIcon, LeafIcon } from '@/components/icons';
import { BottomNav, TopNav } from '@/components/Nav';
import { themeInitScript, ThemeToggle } from '@/components/ThemeToggle';
import { LeafProvider } from '@/components/LeafProvider';
import { getSession } from '@/lib/auth';
import { getLeaf } from '@/lib/leaf';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: { default: 'LeafID — Ontario tree leaf identification', template: '%s · LeafID' },
  description: 'Learn to identify Ontario tree species by their leaves, with adaptive practice and crowd-verified photos.',
};

const REPO_URL = 'https://github.com/CrayFishFM/LeafID';

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
  const [session, leaf] = await Promise.all([getSession(), getLeaf()]);
  // Who last edited a species is admin-only; leave it out of what every page sends.
  const species = leaf.species.map((s) => ({ ...s, updatedAt: undefined, updatedBy: undefined }));
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
              {/* Guests can't sign back in to a guest account, so they get "Sign in" (to save progress) instead of "Sign out". */}
              {session && !session.user.isAnonymous ? (
                // Sign out lives on the account page.
                <Link href="/account" className="btn btn-sm account-link" title="Your account">{session.user.name}</Link>
              ) : (
                <Link href="/sign-in" className="btn btn-sm btn-primary">Sign in</Link>
              )}
            </div>
          </div>
        </header>
        <main className="container">
          <LeafProvider species={species} groups={leaf.groups}>{children}</LeafProvider>
          <footer className="site-footer">
            <span>LeafID is free and open source.</span>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="github-link">
              <GitHubIcon width={18} height={18} /> View the code on GitHub
            </a>
          </footer>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
