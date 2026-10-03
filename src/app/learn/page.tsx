/* eslint-disable @next/next/no-img-element -- static leaf photos are pre-sized */
import Link from 'next/link';
import { GROUPS, SPECIES, type GroupId } from '@/data/species';
import { libraryPhotos } from '@/lib/photos';

export const metadata = { title: 'Field guide' };

const STEPS = [
  { k: '1. Arrangement', v: 'Opposite (in pairs) or alternate (staggered) along the twig? "MAD Horse" — Maple, Ash, Dogwood, Horse-chestnut, plus elderberry — are opposite.' },
  { k: '2. Simple or compound', v: 'One blade per stalk, or many leaflets? Find the bud: it sits at the base of a whole leaf, never a leaflet.' },
  { k: '3. Lobes', v: 'Palmate lobes (maples), pinnate lobes (oaks) or none? Pointed vs. rounded lobes splits red and white oaks.' },
  { k: '4. Margin & shape', v: 'Smooth, single- or double-toothed? Heart-shaped, round, triangular? Is the base even or lopsided?' },
];

export default async function LearnPage(props: PageProps<'/learn'>) {
  const { group } = await props.searchParams;
  const active = typeof group === 'string' && group in GROUPS ? (group as GroupId) : null;
  const list = active ? SPECIES.filter((s) => s.group === active) : SPECIES;

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow">Field guide</p>
        <h1>{active ? GROUPS[active].label : 'All species'}</h1>
        <p className="muted">{active ? GROUPS[active].blurb : 'Tap a species to study its features and look-alikes.'}</p>
      </div>

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
        {(Object.keys(GROUPS) as GroupId[]).map((g) => (
          <Link key={g} href={`/learn?group=${g}`} aria-current={active === g}>{GROUPS[g].label}</Link>
        ))}
      </div>

      <div className="grid grid-cards">
        {list.map((s) => {
          const photo = libraryPhotos(s.id)[0];
          return (
            <Link key={s.id} href={`/learn/${s.id}`} className="species-card">
              <div className="photo">{photo && <img src={photo.url} alt={`${s.common} leaf`} loading="lazy" />}</div>
              <div className="body">
                <span><span className="chip chip-code">{s.code}</span></span>
                <span className="name">{s.common}</span>
                <span className="sci">{s.scientific}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {active && (
        <Link href={`/quiz?scope=${active}`} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          Practise {GROUPS[active].label.toLowerCase()}
        </Link>
      )}
    </div>
  );
}
