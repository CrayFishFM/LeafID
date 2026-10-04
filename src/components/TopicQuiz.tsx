'use client';
/* eslint-disable @next/next/no-img-element -- quiz photos are pre-sized */

import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { getTopicHint, getTopicQuestion, submitTopicAnswer } from '@/app/quizzes/actions';
import type { TopicItem } from '@/data/topics';
import type { TopicQuestion } from '@/lib/topic-quiz';

const ROUND = 10;
const MAX_HINTS = 2;

/** An item as sent to the browser: no photo list, so the answer can't be read from the page. */
export type ClientItem = Omit<TopicItem, 'images'>;

interface Result { correct: boolean; item: string; chosen: string }

export function TopicQuiz({ topicId, question, scope, items, initial }: {
  topicId: string;
  question: string;
  scope: string;
  items: ClientItem[];
  initial: TopicQuestion | null;
}) {
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const [q, setQ] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [round, setRound] = useState<Result[]>([]);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const roundDone = round.length >= ROUND && result !== null;

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
        if (roundDone) setRound([]);
        setQ(nq);
        setResult(null);
        setHints([]);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        setError('Could not load the next question.');
      }
    });
  }, [topicId, scope, recent, roundDone]);

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
      if (!result && q && /^[1-4]$/.test(e.key)) answer(q.choices[Number(e.key) - 1]);
      else if (result && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); next(); }
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
      </div>

      <div className="quiz">
        <div className="photo photo-contain">
          <img key={q.imageKey} src={q.imageUrl} alt="Photo to identify" />
        </div>

        <div className="stack">
          <h2 style={{ margin: 0 }}>{result ? (result.correct ? 'Correct!' : 'Not quite') : question}</h2>

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

          {!result && (
            <div className="stack" style={{ gap: '0.5rem' }}>
              {hints.map((h) => <div key={h} className="hint">{h}</div>)}
              {hints.length < MAX_HINTS && (
                <button className="btn btn-sm" style={{ alignSelf: 'flex-start' }} onClick={hint} disabled={pending}>
                  {hints.length === 0 ? 'Give me a hint' : 'Another hint'}
                </button>
              )}
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
              {!roundDone && <button className="btn btn-primary" onClick={next} disabled={pending} autoFocus>Next question</button>}
            </div>
          )}

          {roundDone && (
            <div className="card stack">
              <h3 style={{ margin: 0 }}>Round complete: {correctCount} / {ROUND}</h3>
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
