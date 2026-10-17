'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { getTopicHint, getTopicQuestion, submitGrade, submitTopicAnswer } from '@/app/quizzes/actions';
import type { TopicItem } from '@/data/topics';
import type { Severity, Stock } from '@/data/topics/types';
import type { GradeCase, TopicQuestion } from '@/lib/topic-quiz';
import { SKIPPED } from '@/lib/answers';
import { AnswerInput, AnswerModeToggle, useAnswerMode, type AnswerOption } from './AnswerInput';
import { GradePicker, type GradeOutcome } from './GradePicker';
import { ZoomPhoto } from './ZoomPhoto';

const ROUND = 10;
const MAX_HINTS = 2;

/** An item as sent to the browser: no photo list or ratings, so answers can't be read from the page. */
export type ClientItem = Omit<TopicItem, 'images' | 'ratings'>;

interface Result { correct: boolean; item: string; chosen: string; grade: GradeCase | null }

export function TopicQuiz({ topicId, question, scope, items, initial }: {
  topicId: string;
  question: string;
  scope: string;
  items: ClientItem[];
  initial: TopicQuestion | null;
}) {
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const [mode, setMode] = useAnswerMode();
  const options = useMemo<AnswerOption[]>(
    () =>
      items.map((i) => ({
        id: i.id,
        label: i.aka ? `${i.name} (${i.aka})` : i.name,
        sub: i.scientific,
        terms: [i.name, i.aka ?? '', i.scientific ?? ''],
      })),
    [items],
  );
  const [q, setQ] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [round, setRound] = useState<Result[]>([]);
  // Graded topics: severity + AGS/UGS asked after each ID answer.
  const [grade, setGrade] = useState<GradeOutcome | null>(null);
  const [gradedRight, setGradedRight] = useState(0);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const awaitingGrade = !!result?.grade && !grade;
  const roundDone = round.length >= ROUND && result !== null && !awaitingGrade;

  const answer = useCallback(
    (chosen: string) => {
      if (!q || result || pending) return;
      start(async () => {
        try {
          const r = await submitTopicAnswer(topicId, q.imageKey, chosen, hints.length);
          const res = { ...r, chosen };
          setResult(res);
          setRound((xs) => [...xs, res]);
          setRecent((xs) => [r.item, ...xs].slice(0, 3));
        } catch {
          setError('Could not save your answer. Check your connection and try again.');
        }
      });
    },
    [q, result, pending, hints.length, topicId],
  );

  const next = useCallback(() => {
    start(async () => {
      try {
        const nq = await getTopicQuestion(topicId, scope, recent);
        if (roundDone) { setRound([]); setGradedRight(0); }
        setQ(nq);
        setResult(null);
        setGrade(null);
        setHints([]);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        setError('Could not load the next question.');
      }
    });
  }, [topicId, scope, recent, roundDone]);

  function rate(severity: Severity, stock: Stock) {
    if (!q || !result?.grade || grade || pending) return;
    const index = result.grade.index;
    start(async () => {
      try {
        const g = await submitGrade(topicId, q.imageKey, index, severity, stock);
        setGrade(g);
        if (g.severityOk && g.stockOk) setGradedRight((n) => n + 1);
      } catch {
        setError('Could not save your rating. Check your connection and try again.');
      }
    });
  }

  function hint() {
    if (!q || result || hints.length >= MAX_HINTS) return;
    const level = hints.length;
    start(async () => {
      try {
        const h = await getTopicHint(topicId, q.imageKey, level);
        if (h) setHints((xs) => (xs.length === level ? [...xs, h] : xs));
      } catch {
        setError('Could not load a hint. Try again.');
      }
    });
  }

  // Keyboard: 1–4 to answer, Enter / Space for next, H for a hint.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      // Keys on the photo (or its enlarged view) belong to the photo.
      if (e.target instanceof Element && e.target.closest('.zoom-btn, dialog[open]')) return;
      if (!result && q && mode === 'choice' && /^[1-4]$/.test(e.key)) answer(q.choices[Number(e.key) - 1]);
      else if (result && !awaitingGrade && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); next(); }
      else if (!result && e.key.toLowerCase() === 'h') hint();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!q) {
    return (
      <div className="card empty">
        <p>No photos for this selection yet.</p>
        <Link href={`/quizzes/${topicId}`} className="btn">Practise everything</Link>
      </div>
    );
  }

  const correctCount = round.filter((r) => r.correct).length;
  const target = result ? byId[result.item] : null;
  const chosen = result && !result.correct ? byId[result.chosen] : null;

  return (
    <div className="stack">
      <div className="scorebar">
        <span>Question <strong>{Math.min(round.length + (result ? 0 : 1), ROUND)}</strong> / {ROUND}</span>
        <span>Correct <strong>{correctCount}</strong></span>
        {round.some((r) => r.grade) && <span>Rated right <strong>{gradedRight}</strong></span>}
        <span style={{ marginLeft: 'auto' }} />
        <AnswerModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="quiz">
        <ZoomPhoto key={q.imageKey} className="photo photo-contain" src={q.imageUrl} alt="Photo to identify" />

        <div className="stack">
          <h2 style={{ margin: 0 }}>{result ? (result.correct ? 'Correct!' : result.chosen === SKIPPED ? "Here's the answer" : 'Not quite') : question}</h2>

          {mode === 'type' ? (
            <AnswerInput
              key={q.imageKey}
              options={options}
              onSubmit={answer}
              disabled={!!result || pending}
              result={result}
              placeholder="Start typing a name…"
            />
          ) : (
          <div className="choices">
            {q.choices.map((id) => {
              const it = byId[id];
              const cls = result ? (id === result.item ? 'correct' : id === result.chosen ? 'wrong' : '') : '';
              return (
                <button key={id} className={`choice ${cls}`} disabled={!!result || pending} onClick={() => answer(id)}>
                  <span className="name">{it.name}</span>
                  {it.aka && <span className="common">{it.aka}</span>}
                </button>
              );
            })}
          </div>
          )}

          {!result && (
            <div className="stack" style={{ gap: '0.5rem' }}>
              {hints.map((h) => <div key={h} className="hint">{h}</div>)}
              <div className="row" style={{ gap: '0.5rem' }}>
                {hints.length < MAX_HINTS && (
                  <button className="btn btn-sm" onClick={hint} disabled={pending}>
                    {hints.length === 0 ? 'Give me a hint' : 'Another hint'}
                  </button>
                )}
                {/* Shows the answer; counts as a miss so it comes up again soon. */}
                <button className="btn btn-sm btn-ghost" onClick={() => answer(SKIPPED)} disabled={pending}>I don&apos;t know</button>
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {result && target && (
            <div className={`card feedback ${result.correct ? '' : 'is-wrong'}`}>
              <p style={{ marginBottom: '0.4rem' }}>
                {chosen ? <>You chose <strong>{chosen.name}</strong>. This is </> : 'This is '}
                <strong>{target.name}</strong>
                {target.aka && <> ({target.aka})</>}
                {target.scientific && <> · <em className="muted">{target.scientific}</em></>}
              </p>
              <p className="small muted" style={{ marginBottom: 0 }}>How to recognise {target.name.toLowerCase()}:</p>
              <ul className="small">{target.tips.map((t) => <li key={t}>{t}</li>)}</ul>
              {chosen && (
                <p className="small"><strong>{chosen.name}</strong> instead: {chosen.tips[0]}</p>
              )}
              {!roundDone && !awaitingGrade && !result.grade && (
                <button className="btn btn-primary" onClick={next} disabled={pending} autoFocus>Next question</button>
              )}
            </div>
          )}

          {result?.grade && target && (
            <div className="card stack">
              <div>
                <h3 style={{ margin: 0 }}>Now rate this {target.name.toLowerCase()}</h3>
                <p className="small muted" style={{ margin: 0 }}>Is it a minor, moderate or major defect, and is the tree AGS or UGS?</p>
              </div>
              <GradePicker key={q.imageKey} when={result.grade.when} onSubmit={rate} outcome={grade} pending={pending} />
              {grade && !roundDone && <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next} disabled={pending} autoFocus>Next question</button>}
            </div>
          )}

          {roundDone && (
            <div className="card stack">
              <h3 style={{ margin: 0 }}>Round complete: {correctCount} / {ROUND}</h3>
              {round.some((r) => r.grade) && <p className="small muted" style={{ margin: 0 }}>Severity and AGS/UGS rated right: {gradedRight} / {round.filter((r) => r.grade).length}</p>}
              {round.some((r) => !r.correct) ? (
                <div>
                  <p className="small muted">Worth reviewing:</p>
                  <div className="row">
                    {[...new Set(round.filter((r) => !r.correct).map((r) => r.item))].map((id) => (
                      <Link key={id} href={`/quizzes/${topicId}/study#${id}`} className="chip">{byId[id].name}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="muted">A perfect round — nice work.</p>
              )}
              <div className="row">
                <button className="btn btn-primary" onClick={next} disabled={pending}>Next round</button>
                <Link href={`/quizzes/${topicId}/study`} className="btn">Study guide</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
