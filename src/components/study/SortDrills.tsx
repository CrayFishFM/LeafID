'use client';

import { useState } from 'react';
import type { RankDrill, SortDrill } from '@/data/study/types';
import { shuffle } from '@/lib/random';
import { DragList } from './DragList';

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
                {checked && placed[i] !== it.bin && <span className="sort-answer"> Answer: {it.bin}</span>}
              </span>
              <span className="bin-group" style={{ gridTemplateColumns: `repeat(${drill.bins.length}, 1fr)` }}>
                {drill.bins.map((b) => (
                  <button key={b} type="button" aria-pressed={placed[i] === b} disabled={checked}
                    className={checked && b === it.bin ? 'is-answer' : ''} onClick={() => setPlaced((p) => ({ ...p, [i]: b }))}>{b}</button>
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

/** Put items in the right order by dragging (or with up / down buttons). */
function Ranker({ drill }: { drill: RankDrill }) {
  const answer = drill.order;
  const [list, setList] = useState(() => scramble(answer));
  const [checked, setChecked] = useState(false);

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>{drill.title}</h3>
        <p className="small muted" style={{ margin: 0 }}>{drill.prompt}</p>
      </div>
      <DragList items={list} onChange={setList} disabled={checked} label={(c) => c}
        render={(c, i) => <>{i + 1}. {c}{checked && answer[i] !== c && <span className="small"> (should be #{answer.indexOf(c) + 1})</span>}</>}
        rowClass={(c, i) => (!checked ? '' : answer[i] === c ? 'is-right' : 'is-wrong')} />
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
    <div className="sort-grid">
      {drills.map((d) => <Sorter key={d.id} drill={d} />)}
      {ranks.map((r) => <Ranker key={r.id} drill={r} />)}
    </div>
  );
}
