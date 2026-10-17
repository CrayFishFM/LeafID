'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { getGradeQuestion, submitGrade } from '@/app/quizzes/actions';
import type { Severity, Stock } from '@/data/topics/types';
import type { GradeQuestion } from '@/lib/topic-quiz';
import { GradePicker, type GradeOutcome } from './GradePicker';
import type { ClientItem } from './TopicQuiz';
import { ZoomPhoto } from './ZoomPhoto';

const ROUND = 10;

/** Grading only: the defect is named, you give its severity and AGS/UGS class. */
export function GradeQuiz({ topicId, items, initial }: { topicId: string; items: ClientItem[]; initial: GradeQuestion | null }) {
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const [q, setQ] = useState(initial);
  const [outcome, setOutcome] = useState<GradeOutcome | null>(null);
  const [round, setRound] = useState<{ item: string; ok: boolean }[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const roundDone = round.length >= ROUND && outcome !== null;

  function rate(severity: Severity, stock: Stock) {
    if (!q || outcome || pending) return;
    start(async () => {
      try {
        const g = await submitGrade(topicId, q.imageKey, q.grade.index, severity, stock);
        setOutcome(g);
        setRound((xs) => [...xs, { item: q.item, ok: g.severityOk && g.stockOk }]);
        setRecent((xs) => [q.item, ...xs].slice(0, 3));
      } catch {
        setError('Could not save your rating. Check your connection and try again.');
      }
    });
  }

  function next() {
    start(async () => {
      try {
        const nq = await getGradeQuestion(topicId, recent);
        if (roundDone) setRound([]);
        setQ(nq);
        setOutcome(null);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        setError('Could not load the next question.');
      }
    });
  }

  // Enter / Space for the next question once rated.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!outcome || e.metaKey || e.ctrlKey) return;
      if (e.target instanceof Element && e.target.closest('.zoom-btn, dialog[open], button')) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!q) return <div className="card empty"><p>Nothing to grade in this quiz yet.</p></div>;

  const item = byId[q.item];
  const right = round.filter((r) => r.ok).length;

  return (
    <div className="stack">
      <div className="scorebar">
        <span>Question <strong>{Math.min(round.length + (outcome ? 0 : 1), ROUND)}</strong> / {ROUND}</span>
        <span>Rated right <strong>{right}</strong></span>
      </div>
      <div className="quiz">
        <ZoomPhoto key={q.imageKey} className="photo photo-contain" src={q.imageUrl} alt={item?.name ?? 'Defect'} />
        <div className="stack">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Rate this defect</p>
            <h2 style={{ margin: 0 }}>{item?.name}</h2>
            {item?.aka && <p className="small muted" style={{ margin: 0 }}>{item.aka}</p>}
          </div>
          <GradePicker key={q.imageKey} when={q.grade.when} onSubmit={rate} outcome={outcome} pending={pending} />
          {error && <div className="error">{error}</div>}
          {outcome && !roundDone && (
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next} disabled={pending} autoFocus>Next defect</button>
          )}
          {roundDone && (
            <div className="card stack">
              <h3 style={{ margin: 0 }}>Round complete: {right} / {ROUND}</h3>
              {round.some((r) => !r.ok) ? (
                <div>
                  <p className="small muted">Worth reviewing:</p>
                  <div className="row">
                    {[...new Set(round.filter((r) => !r.ok).map((r) => r.item))].map((id) => (
                      <Link key={id} href={`/quizzes/${topicId}/study#${id}`} className="chip">{byId[id]?.name}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="muted">A perfect round — nice work.</p>
              )}
              <div className="row">
                <button className="btn btn-primary" onClick={next} disabled={pending}>Next round</button>
                <Link href={`/quizzes/${topicId}/study#grading`} className="btn">Grading rules</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
