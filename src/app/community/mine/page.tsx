/* eslint-disable @next/next/no-img-element -- user-uploaded photos */
import Link from 'next/link';
import { DeleteSubmissionButton } from '@/components/DeleteSubmissionButton';
import { StatusChip } from '@/components/StatusChip';
import { speciesLabel } from '@/data/species';
import { requireUser } from '@/lib/auth';
import { MIN_VOTES, userSubmissions } from '@/lib/community';

export default async function MyUploadsPage(props: PageProps<'/community/mine'>) {
  const user = await requireUser();
  const { uploaded } = await props.searchParams;
  const subs = userSubmissions(user.id);

  return (
    <div className="stack">
      {uploaded && <div className="notice">Thanks! Your photo is now in the review queue for other users.</div>}
      {subs.length === 0 ? (
        <div className="card empty">
          <p>You haven&apos;t uploaded any photos yet.</p>
          <Link href="/community/upload" className="btn btn-primary">Upload your first photo</Link>
        </div>
      ) : (
        <div className="gallery">
          {subs.map((s) => (
            <article key={s.id} className="card stack" style={{ padding: '0.75rem', gap: '0.5rem' }}>
              <div className="photo"><img src={`/api/photos/${s.id}`} alt="Your leaf upload" loading="lazy" /></div>
              <div className="row" style={{ gap: '0.4rem' }}>
                <StatusChip status={s.status} />
                <span className="small muted">{s.votes} vote{s.votes === 1 ? '' : 's'}</span>
              </div>
              <p className="small" style={{ margin: 0 }}>You said <strong>{speciesLabel(s.claimed)}</strong></p>
              {s.status === 'verified' && s.consensus !== s.claimed && (
                <p className="small" style={{ margin: 0 }}>Crowd says <strong>{speciesLabel(s.consensus!)}</strong></p>
              )}
              {s.status === 'pending' && (
                <p className="small muted" style={{ margin: 0 }}>Needs at least {Math.max(0, MIN_VOTES - s.votes)} more vote(s).</p>
              )}
              {s.tally.length > 0 && (
                <div className="tally small">
                  {s.tally.map((t) => (
                    <div key={t.species} className="tally-row"><span>{speciesLabel(t.species)}</span><span className="muted">{t.count}</span></div>
                  ))}
                </div>
              )}
              {s.status !== 'verified' && <DeleteSubmissionButton id={s.id} />}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
