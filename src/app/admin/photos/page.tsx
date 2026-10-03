import Link from 'next/link';
import { PhotoModeration } from '@/components/admin/PhotoModeration';
import { requireAdmin } from '@/lib/auth';
import { listSubmissions, submissionCounts, type SubmissionStatus } from '@/lib/community';

const FILTERS: { id: SubmissionStatus | 'all'; label: string }[] = [
  { id: 'pending', label: 'Awaiting votes' },
  { id: 'disputed', label: 'Disputed' },
  { id: 'verified', label: 'Verified' },
  { id: 'rejected', label: 'Removed' },
  { id: 'all', label: 'All' },
];

export default async function AdminPhotos(props: PageProps<'/admin/photos'>) {
  await requireAdmin();
  const { status: raw } = await props.searchParams;
  const status = FILTERS.find((f) => f.id === raw)?.id ?? 'pending';
  const counts = await submissionCounts();
  const subs = await listSubmissions(status);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="stack">
      <p className="small muted" style={{ margin: 0 }}>
        Approving or rejecting is final — later votes won&apos;t change it. &ldquo;Reset votes&rdquo; hands a photo back to the crowd.
      </p>
      <div className="segmented">
        {FILTERS.map((f) => (
          <Link key={f.id} href={`/admin/photos?status=${f.id}`} aria-current={status === f.id}>
            {f.label} ({f.id === 'all' ? total : counts[f.id]})
          </Link>
        ))}
      </div>
      {subs.length === 0 ? (
        <div className="card empty">Nothing here.</div>
      ) : (
        <div className="gallery">
          {subs.map((s) => <PhotoModeration key={s.id} sub={s} />)}
        </div>
      )}
    </div>
  );
}
