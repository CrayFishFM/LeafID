/* eslint-disable @next/next/no-img-element -- static photos are pre-sized */
import Link from 'next/link';
import { CourseCard } from '@/components/CourseCard';
import { discordEnabled, getSession } from '@/lib/auth';
import { verificationRule } from '@/lib/community';
import { courseCards } from '@/lib/courses';
import { getLeaf } from '@/lib/leaf';
import { libraryPhotos } from '@/lib/photos';
import { getProgress } from '@/lib/progress';
import { suggestionsFor } from '@/lib/suggestions';

// One photo per course: a red oak in fall, an artist's conk and a pumpkinseed.
const HERO = [
  { key: 'lib:Or/7.jpg', label: 'Tree ID' },
  { src: '/quizzes/defects/31.webp', label: 'Defects', className: 'hero-defect' },
  { src: '/quizzes/fish/03.webp', label: 'Fish', className: 'hero-fish' },
];

const STEPS = [
  { title: 'Pick a course', body: 'Dendrology, Forest Health, Wildlife or Remote Sensing. Each one is built from the course material.' },
  { title: 'Study the guide', body: 'Field guides, defect tables, flashcards and worked examples — the things you need to know for the test.' },
  { title: 'Practise until it sticks', body: 'Quizzes put what you miss in front of you more often, and every answer explains why.' },
  { title: 'See what to work on', body: 'Progress shows your accuracy, your most common mix-ups and what to study next.' },
];

export default async function Home(props: PageProps<'/'>) {
  const { deleted } = await props.searchParams;
  const session = await getSession();
  const [leaf, photos, courses, progress] = await Promise.all([
    getLeaf(),
    libraryPhotos(),
    courseCards(session?.user.id),
    session ? getProgress(session.user.id) : null,
  ]);
  const tip = progress && progress.total > 0 ? suggestionsFor(leaf, progress)[0] : null;
  const hero = HERO.map((h) => ({ ...h, src: h.key ? photos.find((p) => p.key === h.key)?.url : h.src })).filter((h) => h.src);

  return (
    <div className="stack" style={{ gap: '2.5rem' }}>
      {deleted && <div className="notice">Your account and all its data have been deleted.</div>}
      <section className="hero">
        <div className="stack">
          <p className="eyebrow">Study tools for forestry students</p>
          <h1>Your field kit for forestry school.</h1>
          <p className="lead">
            Tree ID, hardwood defects and AGS/UGS grading, fish ID and remote sensing review, all in one place. The
            quizzes adapt to what you get wrong and explain every answer.
          </p>
          <div className="row">
            <Link href="/courses" className="btn btn-primary">Browse courses</Link>
            {session ? (
              <Link href="/progress" className="btn">See my progress</Link>
            ) : (
              <Link href="/quiz" className="btn">Start with tree ID — no account needed</Link>
            )}
          </div>
        </div>
        <div className="hero-photos" aria-hidden>
          {hero.map((h) => (
            <figure className="hero-tile" key={h.label}>
              <div className={`photo ${h.className ?? ''}`}><img src={h.src} alt="" /></div>
              <figcaption>{h.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {session && tip && (
        <section className="card suggestion">
          <p className="eyebrow">{session.user.isAnonymous ? 'Tree ID: your next step' : `Tree ID: your next step, ${session.user.name}`}</p>
          <h3>{tip.title}</h3>
          <p className="muted">{tip.body}</p>
          {tip.href && <Link href={tip.href} className="btn btn-sm">{tip.cta}</Link>}
        </section>
      )}

      <section className="stack">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p className="eyebrow">Courses</p>
            <h2 style={{ margin: 0 }}>What&apos;s in the kit</h2>
          </div>
          <Link href="/courses" className="btn btn-sm btn-ghost">All courses →</Link>
        </div>
        <div className="grid grid-2">
          {courses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      <section className="stack">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>From the lecture notes to knowing it cold</h2>
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
          <strong>Community photos:</strong> anyone can <Link href="/community">upload a leaf photo</Link> with their best
          guess. Other people identify it without seeing that guess. The photo is verified {verificationRule()}, then joins
          everyone&apos;s tree ID questions.
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
              <tr><th scope="row">Study guides &amp; quizzes</th><td>Everything</td><td>Everything</td></tr>
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
            {!session && <Link href="/courses" className="btn btn-ghost">Or just start studying →</Link>}
          </div>
        )}
      </section>
    </div>
  );
}
