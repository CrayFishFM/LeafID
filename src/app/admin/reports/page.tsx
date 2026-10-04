import Link from 'next/link';
import { HiddenImageCard, ReportedImageCard } from '@/components/admin/ReportedImageCard';
import { requireAdmin } from '@/lib/auth';
import { getLeaf } from '@/lib/leaf';
import { hiddenLibraryImages, openReports, speciesName } from '@/lib/reports';

// Formatted on the server so the client renders the same text (no hydration mismatch).
const when = (ts: number) => new Date(ts).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });

export default async function AdminReports() {
  await requireAdmin();
  const [reported, hidden, leaf] = await Promise.all([openReports(), hiddenLibraryImages(), getLeaf()]);

  return (
    <div className="stack" style={{ gap: '2rem' }}>
      <section className="stack">
        <p className="small muted" style={{ margin: 0 }}>
          <strong>Pull down</strong> removes a photo from the quiz, field guide and community. Built-in photos can be
          restored below; community uploads are marked removed (find them under{' '}
          <Link href="/admin/photos?status=rejected">Photos → Removed</Link>). <strong>Dismiss</strong> keeps the photo up.
        </p>
        {reported.length === 0 ? (
          <div className="card empty">No open reports.</div>
        ) : (
          <div className="gallery">
            {reported.map((r) => (
              <ReportedImageCard
                key={r.key}
                item={{
                  imageKey: r.key,
                  url: r.url,
                  speciesName: speciesName(leaf, r.species),
                  community: r.community,
                  count: r.count,
                  reports: r.reports.map((x) => ({ reason: x.reason, note: x.note, reporter: x.reporter, when: when(x.createdAt) })),
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="stack">
        <h2 style={{ margin: 0 }}>Pulled-down built-in photos</h2>
        {hidden.length === 0 ? (
          <p className="small muted" style={{ margin: 0 }}>None.</p>
        ) : (
          <div className="gallery">
            {hidden.map((h) => (
              <HiddenImageCard key={h.key} imageKey={h.key} url={h.url} speciesName={speciesName(leaf, h.species)} hiddenBy={h.hiddenBy} when={when(h.hiddenAt)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
