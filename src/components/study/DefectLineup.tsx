'use client';

import { useState } from 'react';
import type { Severity } from '@/data/topics/types';
import { SEVERITY_LABEL } from '@/lib/grading';

const ORDER: Severity[] = ['major', 'moderate', 'minor'];
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Defect = { name: string; severity: Severity };

/** One major, one moderate and one minor defect, shuffled. */
const deal = (all: Defect[]) => shuffle(ORDER.map((sev) => pick(all.filter((d) => d.severity === sev))));

/** "Classify a group of defects from major to minor", like the midterm example. */
export function DefectLineup({ defects }: { defects: Defect[] }) {
  // Dealt on first click so the server and browser render the same page.
  const [group, setGroup] = useState<Defect[] | null>(null);
  const [picked, setPicked] = useState<Defect[]>([]);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const done = group !== null && picked.length === group.length;
  const ok = done && picked.every((d, i) => d.severity === ORDER[i]);

  function choose(d: Defect) {
    if (!group || picked.includes(d)) return;
    const next = [...picked, d];
    setPicked(next);
    if (next.length === group.length) {
      const right = next.every((x, i) => x.severity === ORDER[i]);
      setScore((s) => ({ right: s.right + (right ? 1 : 0), total: s.total + 1 }));
    }
  }

  function again() {
    setGroup(deal(defects));
    setPicked([]);
  }

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>Major to minor</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Tap the three defects in order: the major one first, then moderate, then minor.
          {score.total > 0 && <> · <strong>{score.right} / {score.total}</strong> right</>}
        </p>
      </div>
      {!group ? (
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={again}>Deal three defects</button>
      ) : (
        <>
          <div className="choices" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))' }}>
            {group.map((d) => {
              const at = picked.indexOf(d);
              const cls = !done ? (at >= 0 ? 'selected' : '') : d.severity === ORDER[at] ? 'correct' : 'wrong';
              return (
                <button key={d.name} className={`choice ${cls}`} disabled={done || at >= 0} onClick={() => choose(d)}>
                  <span className="name">{d.name}</span>
                  {at >= 0 && <span className="common">#{at + 1}{done && ` · ${SEVERITY_LABEL[d.severity]}`}</span>}
                </button>
              );
            })}
          </div>
          {done && (
            <div className={`card feedback ${ok ? '' : 'is-wrong'}`}>
              <p style={{ margin: 0 }}>
                <strong>{ok ? 'Correct.' : 'Not quite.'}</strong>{' '}
                {ORDER.map((sev) => `${group.find((d) => d.severity === sev)!.name} (${SEVERITY_LABEL[sev].toLowerCase()})`).join(' → ')}
              </p>
            </div>
          )}
          <div className="row">
            {done ? <button className="btn btn-primary" onClick={again} autoFocus>Next three</button>
              : picked.length > 0 && <button className="btn btn-sm btn-ghost" onClick={() => setPicked([])}>Start over</button>}
          </div>
        </>
      )}
    </div>
  );
}
