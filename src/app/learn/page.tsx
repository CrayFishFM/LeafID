import Link from 'next/link';
import { ZoomPhoto } from '@/components/ZoomPhoto';
import { getSession } from '@/lib/auth';
import { libraryPhotos } from '@/lib/photos';
import { getProgress, type Level } from '@/lib/progress';
import { getLeaf } from '@/lib/leaf';

export const metadata = { title: 'Field guide' };

const LEVEL_CHIP: Record<Level, string> = { new: '', struggling: 'chip-bad', learning: 'chip-warn', mastered: 'chip-ok' };

const STEPS = [
  { k: '1. Arrangement', v: 'Opposite (in pairs) or alternate (staggered) along the twig? "MAD Horse" — Maple, Ash, Dogwood, Horse-chestnut, plus elderberry — are opposite.' },
  { k: '2. Simple or compound', v: 'One blade per stalk, or many leaflets? Find the bud: it sits at the base of a whole leaf, never a leaflet.' },
  { k: '3. Lobes', v: 'Palmate lobes (maples), pinnate lobes (oaks) or none? Pointed vs. rounded lobes splits red and white oaks.' },
  { k: '4. Margin & shape', v: 'Smooth, single- or double-toothed? Heart-shaped, round, triangular? Is the base even or lopsided?' },
];

export default async function LearnPage(props: PageProps<'/learn'>) {
  const leaf = await getLeaf();
  const { group } = await props.searchParams;
  const active = typeof group === 'string' && group in leaf.groups ? (group as string) : null;
  const groups = active ? [active] : Object.keys(leaf.groups);
  const shown = new Set(leaf.species.filter((s) => groups.includes(s.group)).map((s) => s.id));
  const [photos, session] = await Promise.all([libraryPhotos(), getSession()]);
  const progress = session ? await getProgress(session.user.id) : null;
  const stats = new Map(progress?.species.map((s) => [s.id, s]));
  const mixups = (progress?.confusions ?? []).filter((c) => shown.has(c.species)).slice(0, 5);
  const ref = (id: string) => (shown.has(id) ? `#${id}` : `/learn/${id}`);

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow">Field guide</p>
        <h1>{active ? leaf.groups[active].label : 'All species'}</h1>
        <p className="muted">{active ? leaf.groups[active].blurb : 'What to look for in each leaf. Tap a name for the full profile and more photos.'}</p>
      </div>

      <Link href="/learn/key" className="card row" style={{ justifyContent: 'space-between', textDecoration: 'none', color: 'inherit' }}>
        <div>
          <strong>Got a leaf in hand? Use the leaf key</strong>
          <div className="small muted">Answer a few questions about what you see and narrow it down to the species.</div>
        </div>
        <span className="btn btn-primary btn-sm">Start the key →</span>
      </Link>

      <details className="card">
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>How to identify any leaf in four questions</summary>
        <div className="trait-grid" style={{ marginTop: '1rem' }}>
          {STEPS.map((s) => (
            <div className="trait" key={s.k}>
              <div className="k">{s.k}</div>
              <div className="small">{s.v}</div>
            </div>
          ))}
        </div>
      </details>

      <div className="segmented" role="tablist">
        <Link href="/learn" aria-current={!active}>All</Link>
        {Object.keys(leaf.groups).map((g) => (
          <Link key={g} href={`/learn?group=${g}`} aria-current={active === g}>{leaf.groups[g].label}</Link>
        ))}
      </div>

      {mixups.length > 0 && (
        <section className="card stack">
          <h2 style={{ margin: 0 }}>Your most common mix-ups</h2>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {mixups.map((c) => {
              const a = leaf.byId[c.species], b = leaf.byId[c.chosen];
              if (!a || !b) return null;
              return (
                <li key={`${c.species}>${c.chosen}`}>
                  <a href={ref(a.id)}>{a.common}</a> taken for <a href={ref(b.id)}>{b.common}</a> ({c.count}×)
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {groups.map((gid) => (
        <section key={gid} className="stack">
          {!active && <h2 style={{ margin: 0 }}>{leaf.groups[gid].label}</h2>}
          <div className="grid grid-2">
            {leaf.species.filter((s) => s.group === gid).map((s) => {
              const photo = photos.find((p) => p.species === s.id);
              const st = stats.get(s.id);
              return (
                <article key={s.id} id={s.id} className="card stack study-card">
                  {photo && <ZoomPhoto src={photo.url} alt={`${s.common} leaf`} loading="lazy" />}
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <h3 style={{ margin: 0 }}><Link href={`/learn/${s.id}`}>{s.common}</Link></h3>
                      <div className="small muted"><em>{s.scientific}</em></div>
                    </div>
                    <div className="row" style={{ gap: '0.35rem' }}>
                      <span className="chip chip-code">{s.code}</span>
                      {st && st.attempts > 0 && <span className={`chip ${LEVEL_CHIP[st.level]}`}>{st.correct}/{st.attempts}</span>}
                    </div>
                  </div>
                  <div className="row" style={{ gap: '0.35rem' }}>
                    <span className="chip">{s.arrangement}</span>
                    <span className="chip">{s.leafType}</span>
                  </div>
                  <div className="small">
                    <div><strong>Shape:</strong> {s.shape}</div>
                    <div><strong>Margin:</strong> {s.margin}</div>
                  </div>
                  <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
                    {s.keyFeatures.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  {s.lookalikes.length > 0 && (
                    <p className="small muted" style={{ margin: 0 }}>
                      Don&apos;t confuse with:{' '}
                      {s.lookalikes.map((l, n) => {
                        const other = leaf.byId[l.id];
                        return other && <span key={l.id}>{n > 0 && ', '}<a href={ref(l.id)}>{other.common}</a></span>;
                      })}
                    </p>
                  )}
                  <Link href={`/learn/${s.id}`} className="small" style={{ marginTop: 'auto' }}>Full profile →</Link>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {active && (
        <Link href={`/quiz?scope=${active}`} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          Practise {leaf.groups[active].label.toLowerCase()}
        </Link>
      )}
    </div>
  );
}
