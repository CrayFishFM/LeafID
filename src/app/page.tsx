/* eslint-disable @next/next/no-img-element -- static leaf photos are pre-sized */
import Link from 'next/link';
import { SPECIES } from '@/data/species';
import { getSession } from '@/lib/auth';
import { libraryPhotos } from '@/lib/photos';
import { getProgress } from '@/lib/progress';
import { suggestionsFor } from '@/lib/suggestions';

// Hand-picked for colour: a green sugar maple, a red oak in fall and a golden aspen.
const HERO = ['lib:Mh/8.jpg', 'lib:Or/7.jpg', 'lib:Pt/1.jpg'];

export default async function Home() {
  const session = await getSession();
  const heroPhotos = libraryPhotos().filter((p) => HERO.includes(p.key));
  const progress = session ? getProgress(session.user.id) : null;
  const tip = progress ? suggestionsFor(progress)[0] : null;

  return (
    <div className="stack" style={{ gap: '2.5rem' }}>
      <section className="hero">
        <div className="stack">
          <p className="eyebrow">Ontario tree identification</p>
          <h1>Learn to know a tree by its leaf.</h1>
          <p className="lead">
            Practise the {SPECIES.length} species on the Ontario tree ID list — from Mh to Pd. LeafID adapts to what you
            get wrong, explains the difference every time, and shows you exactly what to study next.
          </p>
          <div className="row">
            {session ? (
              <>
                <Link href="/quiz" className="btn btn-primary">Continue practising</Link>
                <Link href="/progress" className="btn">See my progress</Link>
              </>
            ) : (
              <>
                <Link href="/sign-up" className="btn btn-primary">Get started — it&apos;s free</Link>
                <Link href="/learn" className="btn">Browse the field guide</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-photos" aria-hidden>
          {heroPhotos.map((p) => (
            <div className="photo" key={p.key}>
              <img src={p.url} alt="" />
            </div>
          ))}
        </div>
      </section>

      {session && tip && (
        <section className="card suggestion">
          <p className="eyebrow">Your next step, {session.user.name}</p>
          <h3>{tip.title}</h3>
          <p className="muted">{tip.body}</p>
          {tip.href && <Link href={tip.href} className="btn btn-sm">{tip.cta}</Link>}
        </section>
      )}

      <section className="grid grid-4">
        <div className="card">
          <h3>Study</h3>
          <p className="muted">
            A field guide for every species: key features, field clues, and how to tell it from its look-alikes.
          </p>
          <Link href="/learn">Open the field guide →</Link>
        </div>
        <div className="card">
          <h3>Practise</h3>
          <p className="muted">
            Photo questions that focus on the species you struggle with. Use hints when you&apos;re stuck and read why
            after every answer.
          </p>
          <Link href="/quiz">Start a practice round →</Link>
        </div>
        <div className="card">
          <h3>Track</h3>
          <p className="muted">
            See mastery per species, the pairs you mix up most, and personalised suggestions for what to work on.
          </p>
          <Link href="/progress">View progress →</Link>
        </div>
        <div className="card">
          <h3>Contribute</h3>
          <p className="muted">
            Upload your own leaf photos. When enough people agree on the ID, the photo joins everyone&apos;s practice set.
          </p>
          <Link href="/community">Visit the community →</Link>
        </div>
      </section>
    </div>
  );
}
