import Link from 'next/link';
import { ActivityChart } from '@/components/admin/ActivityChart';
import { SPECIES_BY_ID } from '@/data/species';
import { globalConfusions, overview, speciesDifficulty } from '@/lib/admin';
import { requireAdmin } from '@/lib/auth';
import { mailEnabled } from '@/lib/mail';

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : '—');

export default async function AdminOverview() {
  await requireAdmin();
  const o = await overview();
  const hardest = (await speciesDifficulty()).filter((s) => s.attempts >= 5).slice(0, 8);
  const confusions = await globalConfusions();
  const needsReview = o.submissions.pending + o.submissions.disputed;

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      {!mailEnabled && (
        <div className="notice small">
          Email isn&apos;t configured, so verification and password-reset emails are only printed to the server log.{' '}
          <Link href="/admin/email">Set up email →</Link>
        </div>
      )}

      <div className="stats">
        <div className="stat"><div className="value">{o.users.total}</div><div className="label">accounts ({o.users.recent} new this week) · {o.users.guests} guests</div></div>
        <div className="stat"><div className="value">{o.answers.learners}</div><div className="label">active learners (7 days)</div></div>
        <div className="stat"><div className="value">{o.answers.total}</div><div className="label">quiz answers ({o.answers.recent} this week)</div></div>
        <div className="stat"><div className="value">{pct(o.answers.correct, o.answers.total)}</div><div className="label">overall accuracy</div></div>
        <Link href="/admin/photos?status=pending" className="stat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="value">{needsReview}</div><div className="label">photos awaiting the crowd</div>
        </Link>
        <div className="stat"><div className="value">{o.submissions.verified}</div><div className="label">verified photos · {o.votes} votes cast</div></div>
      </div>

      <section className="card"><ActivityChart data={o.activity} /></section>

      <div className="grid grid-2">
        <section className="card">
          <h2>Hardest species</h2>
          <p className="small muted">Lowest accuracy across all learners (min. 5 answers). Good candidates for better photos or tips.</p>
          {hardest.length === 0 ? (
            <p className="muted small">Not enough answers yet.</p>
          ) : (
            <div className="mastery-list">
              {hardest.map((s) => (
                <Link key={s.id} href={`/learn/${s.id}`} className="mastery-row">
                  <span className="who"><strong>{SPECIES_BY_ID[s.id].code}</strong><span>{s.attempts} answers</span></span>
                  <span className="meter"><span style={{ width: `${Math.round((s.accuracy ?? 0) * 100)}%` }} /></span>
                  <span className="small">{Math.round((s.accuracy ?? 0) * 100)}%</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Most common mix-ups</h2>
          <p className="small muted">Across all learners: the right answer, then what people picked.</p>
          {confusions.length === 0 ? (
            <p className="muted small">No mistakes recorded yet.</p>
          ) : (
            <div className="tally">
              {confusions.map((c) => (
                <div key={`${c.species}-${c.chosen}`} className="tally-row">
                  <span>
                    <span className="chip chip-code">{SPECIES_BY_ID[c.species]?.code}</span>{' '}
                    <span className="muted small">picked as</span> <span className="chip">{SPECIES_BY_ID[c.chosen]?.code}</span>
                  </span>
                  <span className="muted">× {c.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <h2>Accounts</h2>
          <div className="tally">
            <div className="tally-row"><span>Email verified</span><span>{o.users.verified} / {o.users.total}</span></div>
            <div className="tally-row"><span>Guests (no account)</span><span>{o.users.guests}</span></div>
            <div className="tally-row"><span>Admins</span><span>{o.users.admins}</span></div>
            <div className="tally-row"><span>Banned</span><span>{o.users.banned}</span></div>
          </div>
          <Link href="/admin/users" className="btn btn-sm" style={{ marginTop: '0.75rem' }}>Manage users</Link>
        </section>
        <section className="card">
          <h2>Community photos</h2>
          <div className="tally">
            <div className="tally-row"><span>Awaiting votes</span><span>{o.submissions.pending}</span></div>
            <div className="tally-row"><span>Disputed</span><span>{o.submissions.disputed}</span></div>
            <div className="tally-row"><span>Verified</span><span>{o.submissions.verified}</span></div>
            <div className="tally-row"><span>Removed</span><span>{o.submissions.rejected}</span></div>
          </div>
          <Link href="/admin/photos" className="btn btn-sm" style={{ marginTop: '0.75rem' }}>Moderate photos</Link>
        </section>
      </div>
    </div>
  );
}
