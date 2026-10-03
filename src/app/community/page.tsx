/* eslint-disable @next/next/no-img-element -- user-uploaded photos */
import Link from 'next/link';
import { ReviewCard } from '@/components/ReviewCard';
import { SPECIES_BY_ID } from '@/data/species';
import { requireUser } from '@/lib/auth';
import { recentlyVerified, reviewQueue } from '@/lib/community';

export default async function CommunityPage() {
  const user = await requireUser();
  const queue = reviewQueue(user.id);
  const verified = recentlyVerified();

  return (
    <div className="stack" style={{ gap: '2rem' }}>
      <section className="stack">
        <h2>Needs your ID</h2>
        {queue.length === 0 ? (
          <div className="card empty">
            <p>You&apos;re all caught up — no photos are waiting for your vote.</p>
            <Link href="/community/upload" className="btn btn-primary">Upload a photo</Link>
          </div>
        ) : (
          <div className="gallery">
            {queue.map((s) => <ReviewCard key={s.id} submission={s} />)}
          </div>
        )}
      </section>

      {verified.length > 0 && (
        <section className="stack">
          <h2>Recently verified</h2>
          <div className="grid grid-cards">
            {verified.map((s) => {
              const sp = SPECIES_BY_ID[s.consensus!];
              return (
                <Link key={s.id} href={`/learn/${sp.id}`} className="species-card">
                  <div className="photo"><img src={`/api/photos/${s.id}`} alt={`${sp.common} leaf`} loading="lazy" /></div>
                  <div className="body">
                    <span><span className="chip chip-code">{sp.code}</span></span>
                    <span className="name">{sp.common}</span>
                    <span className="sci">by {s.uploader} · {s.votes} votes</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
