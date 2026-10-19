'use client';

import { useState } from 'react';
import type { StudyCard, TestQuestion } from '@/data/study/types';
import { saveTest } from '@/lib/study-storage';
import { shuffle } from '@/lib/random';

const LENGTHS = [10, 20];

interface Asked {
  q: TestQuestion;
  card: StudyCard;
  /** Display order of choices (mc, multi) or the starting order of items (order). */
  order: number[];
}

/** A shuffled order that isn't already the answer. */
function scrambled(n: number) {
  const idx = Array.from({ length: n }, (_, i) => i);
  if (n < 2) return idx;
  let s = shuffle(idx);
  while (s.every((v, i) => v === i)) s = shuffle(idx);
  return s;
}

/**
 * Round 1 asks one question from each card, taking cards from each section in turn so every
 * topic shows up early; later rounds use the cards' other questions until the test is full.
 */
function build(cards: StudyCard[], length: number): Asked[] {
  const pool = cards.filter((c) => c.test?.length).map((card) => ({ card, qs: shuffle(card.test!) }));
  const sections = [...new Set(pool.map((p) => p.card.section))];
  const rounds = Math.max(0, ...pool.map((p) => p.qs.length));
  const out: Asked[] = [];
  for (let round = 0; round < rounds && out.length < length; round++) {
    const lanes = shuffle(sections).map((sec) => shuffle(pool.filter((p) => p.card.section === sec && p.qs[round])));
    while (out.length < length && lanes.some((l) => l.length)) {
      for (const lane of lanes) {
        const p = lane.shift();
        if (!p || out.length >= length) continue;
        const q = p.qs[round];
        const order = q.kind === 'mc' || q.kind === 'multi' ? shuffle(q.choices.map((_, k) => k)) : q.kind === 'order' ? scrambled(q.order.length) : [];
        out.push({ q, card: p.card, order });
      }
    }
  }
  return out;
}

// ---- Typed answers ----

const norm = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '').replace(/[^a-z0-9.]/g, '').replace(/\.+$/, '');

function typedOk(input: string, accept: string[]) {
  return accept.some((a) => {
    const n = a.replace(/,/g, '');
    if (/^-?\d+(\.\d+)?$/.test(n)) {
      // Numbers: "1:10,000", "900 cm²" and "20.12 m" all count as the number.
      const m = input.replace(/^\s*1\s*:/, '').replace(/,/g, '').match(/-?\d+(\.\d+)?/);
      return m !== null && Math.abs(Number(m[0]) - Number(n)) < 1e-9;
    }
    return norm(input) === norm(a);
  });
}

/** The right answer, as text for the feedback and review. */
function answerText(q: TestQuestion) {
  switch (q.kind) {
    case 'mc': return q.choices[q.answer];
    case 'tf': return q.answer ? 'True' : 'False';
    case 'multi': return q.answers.map((i) => q.choices[i]).join(', ');
    case 'type': return q.accept[0];
    case 'order': return q.order.join(' → ');
  }
}

const KIND_HINT: Record<TestQuestion['kind'], string> = {
  mc: 'Pick one', tf: 'True or false', multi: 'Select all that apply', type: 'Type your answer', order: 'Put these in order',
};

function Question({ asked, onDone }: { asked: Asked; onDone: (correct: boolean) => void }) {
  const { q } = asked;
  const [picked, setPicked] = useState<number | boolean | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [text, setText] = useState('');
  const [list, setList] = useState(asked.order);
  const [result, setResult] = useState<boolean | null>(null);
  const done = result !== null;

  function finish(ok: boolean) {
    setResult(ok);
    onDone(ok);
  }

  const move = (i: number, d: number) => setList((xs) => { const a = [...xs]; [a[i], a[i + d]] = [a[i + d], a[i]]; return a; });

  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <div>
        <p className="eyebrow" style={{ margin: 0 }}>{KIND_HINT[q.kind]}</p>
        <h3 style={{ margin: 0 }}>{q.q}</h3>
      </div>

      {q.kind === 'mc' && (
        <div className="choices">
          {asked.order.map((ci) => {
            const cls = !done ? '' : ci === q.answer ? 'correct' : ci === picked ? 'wrong' : '';
            return (
              <button key={ci} className={`choice ${cls}`} disabled={done} onClick={() => { setPicked(ci); finish(ci === q.answer); }}>
                <span className="name">{q.choices[ci]}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.kind === 'tf' && (
        <div className="choices">
          {[true, false].map((v) => {
            const cls = !done ? '' : v === q.answer ? 'correct' : v === picked ? 'wrong' : '';
            return (
              <button key={String(v)} className={`choice ${cls}`} disabled={done} onClick={() => { setPicked(v); finish(v === q.answer); }}>
                <span className="name">{v ? 'True' : 'False'}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.kind === 'multi' && (
        <>
          <div className="choices">
            {asked.order.map((ci) => {
              const on = selected.includes(ci);
              const right = q.answers.includes(ci);
              const cls = !done ? (on ? 'selected' : '') : right ? 'correct' : on ? 'wrong' : '';
              return (
                <button key={ci} className={`choice ${cls}`} disabled={done} aria-pressed={on}
                  onClick={() => setSelected((s) => (on ? s.filter((x) => x !== ci) : [...s, ci]))}>
                  <span className="name">{on ? '☑ ' : '☐ '}{q.choices[ci]}</span>
                </button>
              );
            })}
          </div>
          {!done && (
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={selected.length === 0}
              onClick={() => finish(selected.length === q.answers.length && q.answers.every((a) => selected.includes(a)))}>
              Check
            </button>
          )}
        </>
      )}

      {q.kind === 'type' && (
        <form className="row" style={{ gap: '0.5rem' }} onSubmit={(e) => { e.preventDefault(); if (!done && text.trim()) finish(typedOk(text, q.accept)); }}>
          <input className={`input ${done ? (result ? 'is-correct' : 'is-wrong') : ''}`} style={{ maxWidth: 420, flex: 1 }} value={text}
            onChange={(e) => setText(e.target.value)} disabled={done} aria-label="Your answer" autoFocus autoComplete="off" />
          {!done && <button className="btn btn-primary" disabled={!text.trim()}>Check</button>}
        </form>
      )}

      {q.kind === 'order' && (
        <>
          <ol className="sort-list rank-list">
            {list.map((ii, pos) => (
              <li key={ii} className={!done ? '' : ii === pos ? 'is-right' : 'is-wrong'}>
                <span className="sort-label">{pos + 1}. {q.order[ii]}</span>
                <span className="rank-arrows">
                  <button className="btn btn-sm icon-btn" aria-label={`Move ${q.order[ii]} up`} disabled={done || pos === 0} onClick={() => move(pos, -1)}>↑</button>
                  <button className="btn btn-sm icon-btn" aria-label={`Move ${q.order[ii]} down`} disabled={done || pos === list.length - 1} onClick={() => move(pos, 1)}>↓</button>
                </span>
              </li>
            ))}
          </ol>
          {!done && (
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => finish(list.every((ii, pos) => ii === pos))}>
              Check order
            </button>
          )}
        </>
      )}

      {done && (
        <div className={`card feedback ${result ? '' : 'is-wrong'}`}>
          <p style={{ margin: 0 }}>
            <strong>{result ? 'Correct.' : 'Not quite.'}</strong>
            {!result && <> Answer: <strong>{answerText(q)}</strong>.</>} {q.why}
          </p>
        </div>
      )}
    </div>
  );
}

/** A practice test drawn from the flashcards' questions, mixing question types, with the reason after each. */
export function PracticeTest({ guideId, cards, sections, allLabel }: {
  guideId: string; cards: StudyCard[]; sections: string[]; allLabel: string;
}) {
  const [section, setSection] = useState('all');
  // Built on click so the server and browser render the same (unshuffled) page.
  const [test, setTest] = useState<Asked[] | null>(null);
  const [pos, setPos] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const inSection = cards.filter((c) => section === 'all' || c.section === section);
  const total = inSection.reduce((n, c) => n + (c.test?.length ?? 0), 0);

  function start(length: number) {
    setTest(build(inSection, length));
    setPos(0);
    setResults([]);
  }

  if (!test) {
    return (
      <div className="card stack">
        <div>
          <h3 style={{ margin: 0 }}>Practice test</h3>
          <p className="muted small" style={{ margin: 0 }}>
            Multiple choice, true/false, select-all, typed answers and put-in-order questions. Every flashcard has questions, and
            a test asks about different cards across all the topics you pick.
          </p>
        </div>
        <div className="segmented">
          <button aria-current={section === 'all'} onClick={() => setSection('all')}>{allLabel}</button>
          {sections.map((s) => <button key={s} aria-current={section === s} onClick={() => setSection(s)}>{s}</button>)}
        </div>
        <div className="row">
          {LENGTHS.filter((n) => n < total).map((n) => (
            <button key={n} className="btn btn-primary" onClick={() => start(n)}>{n} questions</button>
          ))}
          <button className="btn" onClick={() => start(total)}>Everything ({total} questions)</button>
        </div>
      </div>
    );
  }

  const done = results.length === test.length;
  const score = results.filter(Boolean).length;
  const cur = test[pos];

  function answered(ok: boolean) {
    const next = [...results];
    next[pos] = ok;
    setResults(next);
    // Last question: keep the score for the Progress page.
    if (next.length === test!.length && next.every((r) => r !== undefined)) saveTest(guideId, next.filter(Boolean).length, next.length);
  }

  return (
    <div className="stack">
      <div className="scorebar">
        <span>Question <strong>{pos + 1}</strong> / {test.length}</span>
        <span>Correct <strong>{score}</strong></span>
        <span className="small">{cur.card.section}</span>
        <button className="btn btn-sm btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setTest(null)}>Quit</button>
      </div>
      <div className="card">
        <Question key={pos} asked={cur} onDone={answered} />
        {results[pos] !== undefined && pos < test.length - 1 && (
          <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => setPos((p) => p + 1)} autoFocus>Next question</button>
        )}
      </div>
      {done && (
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Score: {score} / {test.length} ({Math.round((score / test.length) * 100)}%)</h3>
          {score < test.length && (
            <div>
              <p className="small muted">Review these:</p>
              <ul className="small" style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {test.filter((_, i) => !results[i]).map((t) => (
                  <li key={t.q.q}>
                    {t.q.q} <strong>{answerText(t.q)}</strong> <span className="muted">({t.card.section})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="row">
            <button className="btn btn-primary" onClick={() => start(test.length)}>New test, same length</button>
            <button className="btn" onClick={() => setTest(null)}>Change topic or length</button>
          </div>
        </div>
      )}
    </div>
  );
}
