/* eslint-disable @next/next/no-img-element -- static leaf photos are pre-sized */
import Link from 'next/link';
import { SPECIES } from '@/data/species';
import { discordEnabled, getSession } from '@/lib/auth';
import { AGREEMENT, MIN_VOTES } from '@/lib/community';
import { libraryPhotos } from '@/lib/photos';
import { getProgress } from '@/lib/progress';
import { suggestionsFor } from '@/lib/suggestions';

// Hand-picked for colour: a green sugar maple, a red oak in fall and a golden aspen.
const HERO = ['lib:Mh/8.jpg', 'lib:Or/7.jpg', 'lib:Pt/1.jpg'];

const STEPS = [
  { title: 'Study the field guide', body: 'Every species has its key leaf features, field clues and look-alikes. Start with a group, like the maples or oaks.' },
  { title: 'Answer photo questions', body: 'Pick the tree from four options. Stuck? Up to three hints narrow it down, from leaf arrangement to the most telling feature.' },
  { title: 'Learn from every answer', body: "Right or wrong, you see why — and if you mixed two trees up, exactly how to tell them apart next time." },
  { title: 'Let it adapt', body: 'Trees you miss come back more often, wrong options are drawn from your own past mix-ups, and Progress tells you what to study next.' },
];

export default async function Home(props: PageProps<'/'>) {
  const { deleted } = await props.searchParams;
  const session = await getSession();
  const heroPhotos = libraryPhotos().filter((p) => HERO.includes(p.key));
  const progress = session ? await getProgress(session.user.id) : null;
  const tip = progress ? suggestionsFor(progress)[0] : null;

  return (
    <div className="stack" style={{ gap: '2.5rem' }}>
      {deleted && <div className="notice">Your account and all its data have been deleted.</div>}
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
                <Link href="/quiz" className="btn btn-primary">Start practising — no account needed</Link>
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
          <p className="eyebrow">{session.user.isAnonymous ? 'Your next step' : `Your next step, ${session.user.name}`}</p>
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

      <section className="stack">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>From first leaf to knowing them all</h2>
        </div>
        <ol className="steps">
          {STEPS.map((step) => (
            <li key={step.title} className="card">
              <h3>{step.title}</h3>
              <p className="muted small" style={{ margin: 0 }}>{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="small muted" style={{ margin: 0 }}>
          <strong>Community photos:</strong> anyone can upload a leaf photo with their best guess. Other people identify it
          without seeing that guess; once at least {MIN_VOTES} have voted and {Math.round(AGREEMENT * 100)}% of all IDs
          agree, the photo is verified and joins everyone&apos;s practice questions.
        </p>
      </section>

      <section className="stack">
        <div>
          <p className="eyebrow">Guest or account?</p>
          <h2>No account needed — but an account keeps it</h2>
          <p className="muted" style={{ margin: 0 }}>
            You can use everything straight away. An account just makes your progress permanent and lets you use it
            anywhere.
          </p>
        </div>
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table className="table compare">
            <thead>
              <tr><th scope="col"><span className="sr-only">Feature</span></th><th scope="col">As a guest</th><th scope="col">With an account</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Field guide &amp; practice</th><td>Everything</td><td>Everything</td></tr>
              <tr><th scope="row">Progress &amp; suggestions</th><td>Saved in this browser only</td><td>Saved to your account, on every device</td></tr>
              <tr><th scope="row">Upload &amp; vote on photos</th><td>Yes, shown as &ldquo;Guest&rdquo;</td><td>Yes, shown with your name</td></tr>
              <tr>
                <th scope="row">How long it lasts</th>
                <td>30 days after your last visit — clearing your browser data ends it sooner</td>
                <td>Until you delete it</td>
              </tr>
              <tr>
                <th scope="row">Signing in</th>
                <td>Nothing to sign in to</td>
                <td>Email and password{discordEnabled ? ', or Discord' : ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          Started as a guest? When you create an account or sign in, everything you&apos;ve done so far — progress,
          uploads and votes — moves over automatically.
        </p>
        {session && !session.user.isAnonymous ? (
          <p className="small" style={{ margin: 0 }}>You&apos;re signed in as <strong>{session.user.name}</strong> — your progress is saved to your account.</p>
        ) : (
          <div className="row">
            <Link href="/sign-up" className="btn btn-primary">Create a free account</Link>
            <Link href="/sign-in" className="btn">Sign in</Link>
            {!session && <Link href="/quiz" className="btn btn-ghost">Or just start practising →</Link>}
          </div>
        )}
      </section>
    </div>
  );
}
