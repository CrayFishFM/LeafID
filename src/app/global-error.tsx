'use client';

/** Last resort when the root layout itself fails; it renders without the site's styles. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem 1rem', maxWidth: 560, margin: '0 auto' }}>
        <title>Forester&apos;s Field Kit</title>
        <h1>Something went wrong</h1>
        <p>Forester&apos;s Field Kit couldn&apos;t load. Trying again usually fixes it.</p>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  );
}
