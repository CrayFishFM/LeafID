'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/** Any page that throws lands here instead of crashing; the site header and nav stay usable. */
export default function PageError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card stack" style={{ maxWidth: 560 }}>
      <h1 style={{ margin: 0 }}>Something went wrong</h1>
      <p className="muted" style={{ margin: 0 }}>This page hit a problem loading. Trying again usually fixes it.</p>
      <div className="row">
        <button className="btn btn-primary" onClick={() => retry()}>Try again</button>
        <Link href="/" className="btn">Home</Link>
      </div>
    </div>
  );
}
