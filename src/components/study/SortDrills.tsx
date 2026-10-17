'use client';

import { useState } from 'react';
import type { RankDrill, SortDrill } from '@/data/study/types';

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Put each item in a bin, then check them all at once. */
function Sorter({ drill }: { drill: SortDrill }) {
  // Alphabetical to start (the data is grouped by answer); same on the server and in the browser.
  const [order, setOrder] = useState(() =>
    drill.items.map((_, i) => i).sort((a, b) => drill.items[a].label.localeCompare(drill.items[b].label)));
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const right = drill.items.filter((it, i) => placed[i] === it.bin).length;

  function again() {
    setOrder(shuffle(drill.items.map((_, i) => i)));
    setPlaced({});
    setChecked(false);
  }

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>{drill.title}</h3>
        <p className="small muted" style={{ margin: 0 }}>{drill.prompt}</p>
      </div>
      <ul className="sort-list">
        {order.map((i) => {
          const it = drill.items[i];
          const state = !checked ? '' : placed[i] === it.bin ? 'is-right' : 'is-wrong';
          return (
            <li key={it.label} className={state}>
              <span className="sort-label">
                {it.label}
                {checked && placed[i] !== it.bin && <span className="small"> → {it.bin}</span>}
              </span>
              <span className="segmented segmented-sm">
                {drill.bins.map((b) => (
                  <button key={b} aria-current={placed[i] === b} disabled={checked} onClick={() => setPlaced((p) => ({ ...p, [i]: b }))}>{b}</button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="row">
        {!checked ? (
          <button className="btn btn-primary btn-sm" disabled={Object.keys(placed).length < drill.items.length} onClick={() => setChecked(true)}>
            Check ({Object.keys(placed).length} / {drill.items.length} sorted)
          </button>
        ) : (
          <>
            <strong>{right} / {drill.items.length} right</strong>
            <button className="btn btn-sm" onClick={again}>Try again</button>
          </>
        )}
      </div>
    </div>
  );
}

/** A fixed scramble (so the server and browser render the same): alphabetical, or reversed if that is the answer. */
function scramble(order: string[]) {
  const a = [...order].sort((x, y) => x.localeCompare(y));
  return a.every((x, i) => x === order[i]) ? [...order].reverse() : a;
}

/** Put items in the right order with up / down buttons. */
function Ranker({ drill }: { drill: RankDrill }) {
  const answer = drill.order;
  const [list, setList] = useState(() => scramble(answer));
  const [checked, setChecked] = useState(false);

  const move = (i: number, d: number) => setList((xs) => {
    const a = [...xs];
    [a[i], a[i + d]] = [a[i + d], a[i]];
    return a;
  });

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>{drill.title}</h3>
        <p className="small muted" style={{ margin: 0 }}>{drill.prompt}</p>
      </div>
      <ol className="sort-list rank-list">
        {list.map((c, i) => (
          <li key={c} className={!checked ? '' : answer[i] === c ? 'is-right' : 'is-wrong'}>
            <span className="sort-label">{i + 1}. {c}{checked && answer[i] !== c && <span className="small"> (should be #{answer.indexOf(c) + 1})</span>}</span>
            <span className="row" style={{ gap: '0.25rem' }}>
              <button className="btn btn-sm icon-btn" aria-label={`Move ${c} up`} disabled={checked || i === 0} onClick={() => move(i, -1)}>↑</button>
              <button className="btn btn-sm icon-btn" aria-label={`Move ${c} down`} disabled={checked || i === list.length - 1} onClick={() => move(i, 1)}>↓</button>
            </span>
          </li>
        ))}
      </ol>
      <div className="row">
        {!checked ? (
          <button className="btn btn-primary btn-sm" onClick={() => setChecked(true)}>Check order</button>
        ) : (
          <>
            <span className="small">{drill.explain}</span>
            <button className="btn btn-sm" onClick={() => { setList(shuffle(answer)); setChecked(false); }}>Try again</button>
          </>
        )}
      </div>
    </div>
  );
}

export function SortDrills({ drills, ranks }: { drills: SortDrill[]; ranks: RankDrill[] }) {
  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      {drills.map((d) => <Sorter key={d.id} drill={d} />)}
      {ranks.map((r) => <Ranker key={r.id} drill={r} />)}
    </div>
  );
}
