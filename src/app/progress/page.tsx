import Link from 'next/link';
import { GROUPS, SPECIES_BY_ID } from '@/data/species';
import { requireUser } from '@/lib/auth';
import { getProgress, type Level } from '@/lib/progress';
import { contrastTip, suggestionsFor } from '@/lib/suggestions';

export const metadata = { title: 'Progress' };

const LEVEL_CHIP: Record<Level, string> = { new: '', struggling: 'chip-bad', learning: 'chip-warn', mastered: 'chip-ok' };
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

export default async function ProgressPage() {
  const user = await requireUser();
  const p = await getProgress(user.id);
  const suggestions = suggestionsFor(p);
  const counts = p.species.reduce<Record<Level, number>>(
    (acc, s) => ({ ...acc, [s.level]: acc[s.level] + 1 }),
    { new: 0, struggling: 0, learning: 0, mastered: 0 },
  );
  // Weakest first so the list doubles as a study order; unseen species last.
  const ordered = [...p.species].sort((a, b) =>
    a.attempts === 0 ? 1 : b.attempts === 0 ? -1 : a.mastery - b.mastery,
  );

  return (
    <div className="stack" style={{ gap: '1.75rem' }}>
      <div>
        <p className="eyebrow">Progress</p>
        <h1>{user.name}&apos;s progress</h1>
      </div>

      <div className="stats">
        <div className="stat"><div className="value">{p.total}</div><div className="label">questions answered</div></div>
        <div className="stat"><div className="value">{pct(p.correct, p.total)}%</div><div className="label">overall accuracy</div></div>
        <div className="stat">
          <div className="value">{p.last7.total ? `${pct(p.last7.correct, p.last7.total)}%` : '—'}</div>
          <div className="label">last 7 days ({p.last7.total} answered)</div>
        </div>
        <div className="stat"><div className="value">{counts.mastered}<span className="muted small"> / {p.species.length}</span></div><div className="label">species mastered</div></div>
        <div className="stat"><div className="value">{p.dayStreak}</div><div className="label">day streak</div></div>
      </div>

      {suggestions.length > 0 && (
        <section className="stack">
          <h2>How to improve</h2>
          <div className="grid grid-2">
            {suggestions.map((s) => (
              <div key={s.title} className="card suggestion">
                <h3>{s.title}</h3>
                <p className="muted small">{s.body}</p>
                {s.href && <Link href={s.href} className="btn btn-sm">{s.cta}</Link>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-2">
        <section className="card">
          <h2>Mastery by species</h2>
          <p className="small muted">
            {counts.mastered} mastered · {counts.learning} learning · {counts.struggling} struggling · {counts.new} not seen
          </p>
          <div className="mastery-list">
            {ordered.map((s) => {
              const sp = SPECIES_BY_ID[s.id];
              return (
                <Link key={s.id} href={`/learn/${s.id}`} className="mastery-row">
                  <span className="who"><strong>{sp.code}</strong>{sp.code !== sp.common && <span>{sp.common}</span>}</span>
                  <span className="meter" title={`${Math.round(s.mastery * 100)}% mastery`}>
                    <span style={{ width: `${Math.round(s.mastery * 100)}%` }} />
                  </span>
                  <span className={`chip ${LEVEL_CHIP[s.level]}`}>{s.attempts ? `${s.correct}/${s.attempts}` : 'new'}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="stack">
          <section className="card">
            <h2>By group</h2>
            <div className="mastery-list">
              {p.groups.map((g) => (
                <Link key={g.id} href={`/quiz?scope=${g.id}`} className="mastery-row" style={{ gridTemplateColumns: '1fr 5rem auto' }}>
                  <span>{GROUPS[g.id].label}</span>
                  <span className="meter"><span style={{ width: `${pct(g.correct, g.attempts)}%` }} /></span>
                  <span className="small muted">{g.attempts ? `${pct(g.correct, g.attempts)}%` : '—'}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>Most confused</h2>
            {p.confusions.length === 0 ? (
              <p className="muted small">No mix-ups yet. Keep practising!</p>
            ) : (
              <div className="stack" style={{ gap: '0.75rem' }}>
                {p.confusions.slice(0, 5).map((c) => (
                  <div key={`${c.species}-${c.chosen}`}>
                    <div className="row" style={{ gap: '0.4rem' }}>
                      <span className="chip chip-code">{SPECIES_BY_ID[c.species].code}</span>
                      <span className="small muted">answered as</span>
                      <span className="chip">{SPECIES_BY_ID[c.chosen].code}</span>
                      <span className="small muted">× {c.count}</span>
                    </div>
                    <p className="small" style={{ margin: '0.35rem 0 0' }}>{contrastTip(c.species, c.chosen)}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
