'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadKnown, loadTests, type TestResult } from '@/lib/study-storage';

/** What the Progress page needs about a study guide: the questions per section, no answers. */
export interface GuideOutline {
  id: string;
  title: string;
  href: string;
  sections: { name: string; questions: string[] }[];
}

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

/** Read after hydration: the server has no access to the browser's storage. */
function useStudy(guideId: string) {
  const [state, setState] = useState<{ known: Set<string>; tests: TestResult[] } | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved progress after hydration
    setState({ known: loadKnown(guideId), tests: loadTests(guideId) });
  }, [guideId]);
  return state;
}

function testLine(tests: TestResult[]) {
  if (tests.length === 0) return 'No practice tests yet';
  const last = tests[tests.length - 1];
  const best = tests.reduce((b, t) => (t.score / t.total > b.score / b.total ? t : b));
  return `Practice tests: last ${last.score}/${last.total}, best ${best.score}/${best.total} (${tests.length} taken)`;
}

/** One line of progress for a course card on the overview. */
export function StudySummary({ guide }: { guide: GuideOutline }) {
  const s = useStudy(guide.id);
  const all = guide.sections.flatMap((x) => x.questions);
  const known = s ? all.filter((q) => s.known.has(q)).length : 0;
  return (
    <div className="stack" style={{ gap: '0.35rem' }}>
      <div className="row" style={{ gap: '0.5rem' }}>
        <span className="meter" style={{ flex: 1, minWidth: 80 }}><span style={{ width: `${pct(known, all.length)}%` }} /></span>
        <span className="small muted">{s ? `${known} / ${all.length} flashcards known` : '…'}</span>
      </div>
      <span className="small muted">{s ? testLine(s.tests) : ' '}</span>
    </div>
  );
}

/** Flashcards known per section and practice test history for one guide. */
export function StudyDetail({ guide }: { guide: GuideOutline }) {
  const s = useStudy(guide.id);
  const all = guide.sections.flatMap((x) => x.questions);
  const known = s ? all.filter((q) => s.known.has(q)).length : 0;
  const weakest = s
    ? [...guide.sections].map((x) => ({ ...x, known: x.questions.filter((q) => s.known.has(q)).length }))
        .sort((a, b) => a.known / a.questions.length - b.known / b.questions.length)[0]
    : null;

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <section className="card stack">
        <div>
          <h2 style={{ margin: 0 }}>Flashcards</h2>
          <p className="small muted" style={{ margin: 0 }}>{s ? `${known} of ${all.length} marked “Got it”` : 'Loading…'}</p>
        </div>
        <div className="mastery-list">
          {guide.sections.map((x) => {
            const k = s ? x.questions.filter((q) => s.known.has(q)).length : 0;
            return (
              <div key={x.name} className="mastery-row" style={{ gridTemplateColumns: 'minmax(0, 1fr) 5rem auto' }}>
                <span>{x.name}</span>
                <span className="meter"><span style={{ width: `${pct(k, x.questions.length)}%` }} /></span>
                <span className="small muted">{k}/{x.questions.length}</span>
              </div>
            );
          })}
        </div>
        <Link href={`${guide.href}#cards`} className="btn btn-sm" style={{ alignSelf: 'flex-start' }}>Study the flashcards</Link>
      </section>
      <section className="card stack">
        <div>
          <h2 style={{ margin: 0 }}>Practice tests</h2>
          <p className="small muted" style={{ margin: 0 }}>{s ? testLine(s.tests) : 'Loading…'}</p>
        </div>
        {s && s.tests.length > 0 && (
          <div className="chart-plot" style={{ height: 120 }} aria-label="Recent practice test scores">
            {s.tests.slice(-12).map((t) => (
              <div key={t.at} className="chart-col" tabIndex={0}>
                <span className="chart-bar" style={{ height: `${Math.max(pct(t.score, t.total), 3)}%` }} />
                <span className="chart-tip">{t.score}/{t.total} · {new Date(t.at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
        {weakest && known < all.length && (
          <p className="small" style={{ margin: 0 }}>
            Least covered: <strong>{weakest.name}</strong> ({weakest.known}/{weakest.questions.length} known).
          </p>
        )}
        <Link href={`${guide.href}#test`} className="btn btn-sm btn-primary" style={{ alignSelf: 'flex-start' }}>Take a practice test</Link>
        <p className="small muted" style={{ margin: 0 }}>Study guide progress is saved in this browser only.</p>
      </section>
    </div>
  );
}
