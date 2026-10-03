'use client';
/* eslint-disable @next/next/no-img-element -- quiz photos come from mixed sources */

import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { getHint, getQuestion, submitAnswer } from '@/app/actions';
import { SPECIES_BY_ID } from '@/data/species';
import type { Question } from '@/lib/quiz';
import { contrastTip } from '@/lib/suggestions';
import { ReportButton } from './ReportButton';

const ROUND = 10;
const MAX_HINTS = 3;

interface Result { correct: boolean; species: string; chosen: string }

export function Quiz({ scope, initial }: { scope: string; initial: Question | null }) {
  const [q, setQ] = useState<Question | null>(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [round, setRound] = useState<Result[]>([]);
  const [codesOnly, setCodesOnly] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore a saved preference
      setCodesOnly(localStorage.getItem('codesOnly') === '1');
    } catch {}
  }, []);

  const roundDone = round.length >= ROUND && result !== null;

  const answer = useCallback(
    (chosen: string) => {
      if (!q || result || pending) return;
      start(async () => {
        try {
          const r = await submitAnswer(q.imageKey, chosen, hints.length);
          const res = { ...r, chosen };
          setResult(res);
          setRound((xs) => [...xs, res]);
          setRecent((xs) => [r.species, ...xs].slice(0, 3));
        } catch {
          setError('Could not save your answer. Check your connection and try again.');
        }
      });
    },
    [q, result, pending, hints.length],
  );

  const next = useCallback(() => {
    start(async () => {
      try {
        const nq = await getQuestion(scope, recent);
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
  }, [scope, recent, roundDone]);

  function hint() {
    if (!q || result || hints.length >= MAX_HINTS) return;
    const level = hints.length;
    start(async () => {
      try {
        const h = await getHint(q.imageKey, level);
        // Ignore a late response if another hint landed first.
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
        <p>No photos available for this selection yet.</p>
        <Link href="/quiz" className="btn">Practise all species</Link>
      </div>
    );
  }

  const correctCount = round.filter((r) => r.correct).length;
  const target = result ? SPECIES_BY_ID[result.species] : null;
  const chosenSp = result && !result.correct ? SPECIES_BY_ID[result.chosen] : null;

  return (
    <div className="stack">
      <div className="scorebar">
        <span>Question <strong>{Math.min(round.length + (result ? 0 : 1), ROUND)}</strong> / {ROUND}</span>
        <span>Correct <strong>{correctCount}</strong></span>
        <label className="row" style={{ marginLeft: 'auto', gap: '0.4rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={codesOnly}
            onChange={(e) => {
              setCodesOnly(e.target.checked);
              try { localStorage.setItem('codesOnly', e.target.checked ? '1' : '0'); } catch {}
            }}
          />
          Codes only
        </label>
      </div>

      <div className="quiz">
        <div>
          <div className="photo">
            <img key={q.imageKey} src={q.imageUrl} alt="Leaf to identify" />
            {q.community && <span className="chip photo-tag">Community photo</span>}
          </div>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {q.credit ? <p className="credit">Photo: {q.credit}</p> : <span />}
            {/* Keyed so a new question starts with a fresh, closed report form. */}
            <ReportButton key={q.imageKey} imageKey={q.imageKey} />
          </div>
        </div>

        <div className="stack">
          <h2 style={{ margin: 0 }}>{result ? (result.correct ? 'Correct!' : 'Not quite') : 'Which tree is this?'}</h2>

          <div className="choices">
            {q.choices.map((id) => {
              const s = SPECIES_BY_ID[id];
              const cls = result ? (id === result.species ? 'correct' : id === result.chosen ? 'wrong' : '') : '';
              return (
                <button key={id} className={`choice ${cls}`} disabled={!!result || pending} onClick={() => answer(id)}>
                  <span className="code">{s.code}</span>
                  {(!codesOnly || result) && s.code !== s.common && <span className="common">{s.common}</span>}
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
                {chosenSp ? <>You chose <strong>{chosenSp.common}</strong>. This is </> : 'This is '}
                <strong>{target.common}</strong> <span className="chip chip-code">{target.code}</span>
              </p>
              {chosenSp && (
                <p className="small"><strong>How to tell them apart:</strong> {contrastTip(target.id, chosenSp.id)}</p>
              )}
              <p className="small muted" style={{ marginBottom: 0 }}>Key features of {target.common.toLowerCase()}:</p>
              <ul className="small">{target.keyFeatures.map((f) => <li key={f}>{f}</li>)}</ul>
              <div className="row">
                {!roundDone && <button className="btn btn-primary" onClick={next} disabled={pending} autoFocus>Next question</button>}
                <Link href={`/learn/${target.id}`} className="btn btn-sm">Study {target.code}</Link>
              </div>
            </div>
          )}

          {roundDone && (
            <div className="card stack">
              <h3 style={{ margin: 0 }}>Round complete: {correctCount} / {ROUND}</h3>
              {round.some((r) => !r.correct) ? (
                <div>
                  <p className="small muted">Worth reviewing:</p>
                  <div className="row">
                    {[...new Set(round.filter((r) => !r.correct).map((r) => r.species))].map((id) => (
                      <Link key={id} href={`/learn/${id}`} className="chip">{SPECIES_BY_ID[id].code} · {SPECIES_BY_ID[id].common}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="muted">A perfect round — nice work.</p>
              )}
              <div className="row">
                <button className="btn btn-primary" onClick={next} disabled={pending}>Next round</button>
                <Link href="/progress" className="btn">View progress</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
