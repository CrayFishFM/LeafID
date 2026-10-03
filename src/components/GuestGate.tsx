'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

const startGuest = () => authClient.signIn.anonymous();
// One guest sign-in per page load, even if the effect runs twice (React dev mode) or several gates mount.
let starting: ReturnType<typeof startGuest> | null = null;

/**
 * Shown when a visitor without a session opens a page that needs a user.
 * Creates a guest account in the browser (not during server render, so link
 * prefetches and crawlers don't create guests), then re-renders the page.
 */
export function GuestGate() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    starting ??= startGuest();
    starting.then((res) => {
      if (res.error) {
        starting = null;
        setFailed(true);
      } else router.refresh();
    });
  }, [router]);

  return (
    <div className="card empty stack" style={{ alignItems: 'center' }}>
      {failed ? (
        <>
          <p>We couldn&apos;t start a guest session. Check your connection and try again.</p>
          <button className="btn btn-primary" onClick={() => location.reload()}>Try again</button>
        </>
      ) : (
        <p>Getting things ready…</p>
      )}
      <p className="small muted" style={{ margin: 0 }}>
        Have an account? <Link href="/sign-in">Sign in</Link> to pick up where you left off.
      </p>
    </div>
  );
}
