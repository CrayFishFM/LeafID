'use client';

import { useState } from 'react';
import type { TestQuestion } from '@/data/study/types';
import { saveTest } from '@/lib/study-storage';

const LENGTH = 12;

interface Asked { q: TestQuestion; order: number[] }

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const build = (bank: TestQuestion[]): Asked[] =>
  shuffle(bank).slice(0, LENGTH).map((q) => ({ q, order: shuffle(q.choices.map((_, i) => i)) }));

/** A short multiple-choice test drawn from the bank, with the reason after every answer. */
export function PracticeTest({ guideId, bank }: { guideId: string; bank: TestQuestion[] }) {
  // Built on first click so the server and browser render the same (unshuffled) page.
  const [test, setTest] = useState<Asked[] | null>(null);
  const [pos, setPos] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);

  if (!test) {
    return (
      <div className="card stack" style={{ alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0 }}>Practice test</h3>
        <p className="muted small" style={{ margin: 0 }}>{LENGTH} multiple-choice questions picked at random from {bank.length}, like the midterm.</p>
        <button className="btn btn-primary" onClick={() => { setTest(build(bank)); setPos(0); setPicks([]); }}>Start the test</button>
      </div>
    );
  }

  const done = picks[test.length - 1] !== undefined;

  function answer(ci: number) {
    if (!test) return;
    const next = [...picks];
    next[pos] = ci;
    setPicks(next);
    // Last question: keep the score for the Progress page.
    if (pos === test.length - 1) {
      saveTest(guideId, next.filter((p, i) => p === test[i].q.answer).length, test.length);
    }
  }
  const score = picks.filter((p, i) => p === test[i].q.answer).length;
  const cur = test[pos];
  const picked = picks[pos];

  return (
    <div className="stack">
      <div className="scorebar">
        <span>Question <strong>{pos + 1}</strong> / {test.length}</span>
        <span>Correct <strong>{score}</strong></span>
      </div>
      <div className="card stack">
        <h3 style={{ margin: 0 }}>{cur.q.q}</h3>
        <div className="choices">
          {cur.order.map((ci) => {
            const cls = picked === undefined ? '' : ci === cur.q.answer ? 'correct' : ci === picked ? 'wrong' : '';
            return (
              <button key={ci} className={`choice ${cls}`} disabled={picked !== undefined}
                onClick={() => answer(ci)}>
                <span className="name">{cur.q.choices[ci]}</span>
              </button>
            );
          })}
        </div>
        {picked !== undefined && (
          <div className={`card feedback ${picked === cur.q.answer ? '' : 'is-wrong'}`}>
            <p style={{ margin: 0 }}><strong>{picked === cur.q.answer ? 'Correct.' : 'Not quite.'}</strong> {cur.q.why}</p>
          </div>
        )}
        {picked !== undefined && !done && (
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setPos((p) => p + 1)} autoFocus>Next question</button>
        )}
      </div>
      {done && (
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Score: {score} / {test.length} ({Math.round((score / test.length) * 100)}%)</h3>
          {score < test.length && (
            <div>
              <p className="small muted">Review these:</p>
              <ul className="small" style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {test.filter((t, i) => picks[i] !== t.q.answer).map((t) => (
                  <li key={t.q.q}>{t.q.q} <strong>{t.q.choices[t.q.answer]}</strong></li>
                ))}
              </ul>
            </div>
          )}
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => { setTest(build(bank)); setPos(0); setPicks([]); }}>
            New test
          </button>
        </div>
      )}
    </div>
  );
}
