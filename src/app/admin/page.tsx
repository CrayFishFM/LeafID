import Link from 'next/link';
import { ActivityChart } from '@/components/admin/ActivityChart';
import { IpDiagnostics } from '@/components/admin/IpDiagnostics';
import { globalConfusions, overview, speciesDifficulty } from '@/lib/admin';
import { requireAdmin } from '@/lib/auth';
import { mailEnabled } from '@/lib/mail';
import { openReportCount } from '@/lib/reports';
import { guestStats } from '@/lib/guests';
import { getLeaf } from '@/lib/leaf';

// Formatted on the server so the client renders the same text.
const when = (ts: number) => new Date(ts).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : '—');

export default async function AdminOverview() {
  const leaf = await getLeaf();
  await requireAdmin();
  const o = await overview();
  const hardest = (await speciesDifficulty()).filter((s) => s.attempts >= 5).slice(0, 8);
  const confusions = await globalConfusions();
  const needsReview = o.submissions.pending + o.submissions.disputed;
  const reports = await openReportCount();
  const g = await guestStats();

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
        <Link href="/admin/reports" className="stat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="value">{reports}</div><div className="label">reported photos to review</div>
        </Link>
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
                  <span className="who"><strong>{leaf.byId[s.id].code}</strong><span>{s.attempts} answers</span></span>
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
                    <span className="chip chip-code">{leaf.byId[c.species]?.code}</span>{' '}
                    <span className="muted small">picked as</span> <span className="chip">{leaf.byId[c.chosen]?.code}</span>
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

      <section className="card stack" style={{ gap: '0.75rem' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Guests</h2>
          <Link href="/admin/users?type=guests" className="btn btn-sm">View guests</Link>
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          Visitors who use the site without an account. Each guest lasts as long as their browser session (30 days after
          their last visit). When it ends, a guest who never uploaded or voted is deleted by the daily cleanup; guests who
          contributed are kept so community photos keep their history.
        </p>
        <div className="stats">
          <div className="stat"><div className="value">{g.total}</div><div className="label">guests ({g.newThisWeek} new this week)</div></div>
          <div className="stat"><div className="value">{g.activeThisWeek}</div><div className="label">answered questions this week</div></div>
          <div className="stat"><div className="value">{pct(g.answers.guests, g.answers.everyone)}</div><div className="label">of this week&apos;s answers came from guests</div></div>
          <div className="stat"><div className="value">{g.conversions.thisWeek}</div><div className="label">made an account this week ({g.conversions.total} total)</div></div>
        </div>
        <div className="grid grid-2">
          <div className="tally">
            <div className="tally-row"><span>Can still come back (session active)</span><span>{g.live}</span></div>
            <div className="tally-row"><span>Session ends in the next 7 days</span><span>{g.expiringSoon}</span></div>
            <div className="tally-row"><span>Kept after their session (uploaded or voted)</span><span>{g.contributors}</span></div>
            <div className="tally-row"><span>Removed at the next cleanup</span><span>{g.removable}</span></div>
          </div>
          <div className="tally">
            <div className="tally-row"><span>Photos uploaded by guests</span><span>{g.uploads}</span></div>
            <div className="tally-row"><span>Votes cast by guests</span><span>{g.votes}</span></div>
            <div className="tally-row"><span>Answers moved to new accounts</span><span>{g.conversions.answersMoved}</span></div>
            <div className="tally-row">
              <span>Last cleanup</span>
              <span>{g.lastCleanup ? `${when(g.lastCleanup.at)} · removed ${g.lastCleanup.removed}` : 'not run since this server started'}</span>
            </div>
          </div>
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          &ldquo;Made an account&rdquo; counts guests who signed up or signed in since this was added; their progress, uploads and
          votes moved to the account.
        </p>
      </section>

      <IpDiagnostics />
    </div>
  );
}
