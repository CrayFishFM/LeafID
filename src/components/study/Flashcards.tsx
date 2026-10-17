'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StudyCard } from '@/data/study/remote-sensing';

const STORE = 'study:remote-sensing:known';

function loadKnown(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE) ?? '[]') as number[]);
  } catch {
    return new Set();
  }
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Answer({ card }: { card: StudyCard }) {
  return (
    <>
      {card.a.length === 1 ? <p style={{ margin: 0 }}>{card.a[0]}</p> : (
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>{card.a.map((x) => <li key={x}>{x}</li>)}</ul>
      )}
      {card.opinion && <p className="small muted" style={{ margin: '0.5rem 0 0' }}>Opinion question: any answer with two good reasons works.</p>}
      {card.check && <p className="check-note small"><strong>Check this:</strong> {card.check}</p>}
    </>
  );
}

/** Flip cards for every review question; the ones you know are remembered in this browser. */
export function Flashcards({ cards, weeks }: { cards: StudyCard[]; weeks: string[] }) {
  const [week, setWeek] = useState('all');
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [onlyLearning, setOnlyLearning] = useState(false);
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved progress after hydration
    setKnown(loadKnown());
  }, []);

  const deck = useMemo(
    () => order.filter((i) => (week === 'all' || cards[i].week === week) && (!onlyLearning || !known.has(i))),
    // `known` is left out on purpose: marking a card shouldn't pull it out from under you mid-deck.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, week, onlyLearning, cards],
  );
  const idx = deck[Math.min(pos, deck.length - 1)];
  const card = idx === undefined ? null : cards[idx];

  function mark(isKnown: boolean) {
    if (idx === undefined) return;
    const next = new Set(known);
    if (isKnown) next.add(idx); else next.delete(idx);
    setKnown(next);
    try { localStorage.setItem(STORE, JSON.stringify([...next])); } catch { /* storage blocked: keep it for this visit */ }
    go(1);
  }

  function go(d: number) {
    setFlipped(false);
    setPos((p) => (deck.length ? (p + d + deck.length) % deck.length : 0));
  }

  function reset(fn: () => void) {
    fn();
    setPos(0);
    setFlipped(false);
  }

  // Space flips, arrows move, 1 / 2 mark.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (view !== 'cards' || e.metaKey || e.ctrlKey || e.target instanceof HTMLInputElement) return;
      if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return;
      if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); }
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (flipped && e.key === '1') mark(false);
      else if (flipped && e.key === '2') mark(true);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const inWeek = cards.map((c, i) => ({ c, i })).filter(({ c }) => week === 'all' || c.week === week);
  const knownCount = inWeek.filter(({ i }) => known.has(i)).length;

  return (
    <div className="stack">
      <div className="segmented">
        <button aria-current={week === 'all'} onClick={() => reset(() => setWeek('all'))}>All weeks</button>
        {weeks.map((w) => <button key={w} aria-current={week === w} onClick={() => reset(() => setWeek(w))}>{w}</button>)}
      </div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: '0.5rem' }}>
          <div className="meter" style={{ width: 120 }}><span style={{ width: `${inWeek.length ? (knownCount / inWeek.length) * 100 : 0}%` }} /></div>
          <span className="small muted">{knownCount} / {inWeek.length} known</span>
        </div>
        <div className="segmented segmented-sm">
          <button aria-current={view === 'cards'} onClick={() => setView('cards')}>Cards</button>
          <button aria-current={view === 'list'} onClick={() => setView('list')}>Study sheet</button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="stack" style={{ gap: '0.75rem' }}>
          {inWeek.map(({ c, i }) => (
            <article key={i} className="card stack" style={{ gap: '0.5rem' }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0 }}><span className="muted">Q{c.n}.</span> {c.q}</h3>
                {known.has(i) && <span className="chip chip-ok">Known</span>}
              </div>
              <Answer card={c} />
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="row" style={{ gap: '0.5rem' }}>
            <button className="btn btn-sm" onClick={() => reset(() => setOrder(shuffle(cards.map((_, i) => i))))}>Shuffle</button>
            <button className="btn btn-sm" onClick={() => reset(() => setOrder(cards.map((_, i) => i)))}>In order</button>
            <label className="row small" style={{ gap: '0.35rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={onlyLearning} onChange={(e) => reset(() => setOnlyLearning(e.target.checked))} />
              Only cards I&apos;m still learning
            </label>
          </div>
          {card ? (
            <>
              {/* Tapping the card flips it too; the buttons below (and Space) do the same from the keyboard. */}
              <div className={`card flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((f) => !f)} aria-live="polite">
                <span className="small muted">{card.week} · Q{card.n} · {Math.min(pos, deck.length - 1) + 1} of {deck.length}</span>
                <span className="flashcard-q">{card.q}</span>
                {flipped ? <div className="flashcard-a"><Answer card={card} /></div> : <span className="small muted">Tap or press Space to show the answer</span>}
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <button className="btn btn-sm btn-ghost" onClick={() => go(-1)}>← Back</button>
                {flipped ? (
                  <div className="row" style={{ gap: '0.5rem' }}>
                    <button className="btn btn-sm" onClick={() => mark(false)}>Still learning</button>
                    <button className="btn btn-sm btn-primary" onClick={() => mark(true)}>Got it</button>
                  </div>
                ) : (
                  <button className="btn btn-sm btn-primary" onClick={() => setFlipped(true)}>Show answer</button>
                )}
                <button className="btn btn-sm btn-ghost" onClick={() => go(1)}>Skip →</button>
              </div>
            </>
          ) : (
            <div className="card empty">
              <p>You know every card here.</p>
              <button className="btn" onClick={() => reset(() => setOnlyLearning(false))}>Show all cards</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
