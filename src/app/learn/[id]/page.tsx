/* eslint-disable @next/next/no-img-element -- static leaf photos are pre-sized */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotoCredit } from '@/components/PhotoCredit';
import { ReportButton } from '@/components/ReportButton';
import { getSession } from '@/lib/auth';
import { communityPhotos, libraryPhotos } from '@/lib/photos';
import { getProgress } from '@/lib/progress';
import { getLeaf } from '@/lib/leaf';

export async function generateMetadata(props: PageProps<'/learn/[id]'>) {
  const leaf = await getLeaf();
  const { id } = await props.params;
  const s = leaf.byId[id];
  return { title: s ? s.common : 'Species' };
}

export default async function SpeciesPage(props: PageProps<'/learn/[id]'>) {
  const leaf = await getLeaf();
  const { id } = await props.params;
  const s = leaf.byId[id];
  if (!s) notFound();

  const session = await getSession();
  const stat = session ? (await getProgress(session.user.id)).species.find((x) => x.id === id) : null;
  const [photos, community] = await Promise.all([libraryPhotos(id), communityPhotos(id)]);

  return (
    <div className="stack" style={{ gap: '1.75rem' }}>
      <div>
        <Link href={`/learn?group=${s.group}`} className="small">← {leaf.groups[s.group].label}</Link>
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <span className="chip chip-code">{s.code}</span>
          {stat && stat.attempts > 0 && (
            <span className={`chip ${stat.level === 'mastered' ? 'chip-ok' : stat.level === 'struggling' ? 'chip-bad' : 'chip-warn'}`}>
              {stat.level} · {stat.correct}/{stat.attempts} correct
            </span>
          )}
        </div>
        <h1 style={{ marginTop: '0.5rem' }}>{s.common}</h1>
        <p className="muted" style={{ fontStyle: 'italic' }}>{s.scientific}</p>
      </div>

      <div className="trait-grid">
        <div className="trait"><div className="k">Arrangement</div><div className="v">{s.arrangement}</div></div>
        <div className="trait"><div className="k">Leaf type</div><div className="v">{s.leafType}</div></div>
        <div className="trait"><div className="k">Shape</div><div className="v">{s.shape}</div></div>
        <div className="trait"><div className="k">Margin</div><div className="v">{s.margin}</div></div>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <h2>Key leaf features</h2>
          <ul className="feature-list">{s.keyFeatures.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>
        <section className="card">
          <h2>Confirm it in the field</h2>
          <ul className="feature-list">{s.fieldClues.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>
      </div>

      <section className="stack">
        <h2>Don&apos;t confuse it with…</h2>
        <div className="grid grid-2">
          {s.lookalikes.map((l) => {
            const other = leaf.byId[l.id];
            return (
              <Link key={l.id} href={`/learn/${l.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="row" style={{ marginBottom: '0.4rem' }}>
                  <span className="chip chip-code">{other.code}</span>
                  <strong>{other.common}</strong>
                </div>
                <p className="muted small" style={{ margin: 0 }}>{l.tip}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="stack">
        <h2>Photos</h2>
        <div className="gallery">
          {photos.map((p) => (
            <figure key={p.key} style={{ margin: 0 }}>
              <div className="photo"><img src={p.url} alt={`${s.common} leaf`} loading="lazy" /></div>
              {p.credit && <PhotoCredit credit={p.credit} />}
              <ReportButton imageKey={p.key} />
            </figure>
          ))}
          {community.map((p) => (
            <figure key={p.key} style={{ margin: 0 }}>
              <div className="photo">
                <img src={p.url} alt={`${s.common} leaf (community photo)`} loading="lazy" />
                <span className="chip photo-tag">Community verified</span>
              </div>
              <ReportButton imageKey={p.key} />
            </figure>
          ))}
        </div>
      </section>

      <div className="row">
        <Link href={`/quiz?scope=${s.group}`} className="btn btn-primary">Practise {leaf.groups[s.group].label.toLowerCase()}</Link>
        <Link href="/learn" className="btn">All species</Link>
      </div>
    </div>
  );
}
