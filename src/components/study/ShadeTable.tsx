'use client';

import { useRef, useState } from 'react';
import { SHADE_TABLE } from '@/data/study/ecology';

const SYSTEM: Record<string, string> = {
  'Very intolerant': 'Clearcut', Intolerant: 'Clearcut', Intermediate: 'Shelterwood', Tolerant: 'Selection', 'Very tolerant': 'Selection',
};

/** One line to type per class: "Tolerant: White cedar, Red maple, …". */
const LINES = SHADE_TABLE.map((r) => `${r.level}: ${r.species.join(', ')}`);
const TOTAL_CHARS = LINES.reduce((n, l) => n + l.length, 0);

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** A typing test over the table: the answer shows faintly and you type over it, one class per line. */
function TypingTest() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState('');
  const [errors, setErrors] = useState(0);
  const [keys, setKeys] = useState(0);
  const [started, setStarted] = useState<number | null>(null);
  const [finished, setFinished] = useState<number | null>(null);
  const [hide, setHide] = useState(false);
  const done = finished !== null;

  function onType(value: string) {
    if (done) return;
    const target = LINES[line];
    const v = value.slice(0, target.length);
    if (v.length > typed.length) {
      // Count each new wrong character once, as it's typed.
      const added = v.slice(typed.length);
      setKeys((k) => k + added.length);
      setErrors((e) => e + [...added].filter((ch, i) => !same(ch, target[typed.length + i])).length);
      if (started === null) setStarted(Date.now());
    }
    // A line only moves on once it's typed right (case doesn't matter).
    if (v.length === target.length && same(v, target)) {
      if (line === LINES.length - 1) {
        setFinished(Date.now());
        setTyped(v);
      } else {
        setLine(line + 1);
        setTyped('');
      }
      return;
    }
    setTyped(v);
  }

  function restart() {
    setLine(0);
    setTyped('');
    setErrors(0);
    setKeys(0);
    setStarted(null);
    setFinished(null);
    inputRef.current?.focus();
  }

  const minutes = started !== null && finished !== null ? (finished - started) / 60000 : 0;
  const wpm = minutes > 0 ? Math.round(TOTAL_CHARS / 5 / minutes) : 0;
  const accuracy = keys > 0 ? Math.round(((keys - errors) / keys) * 100) : 100;

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <label className="row small" style={{ gap: '0.4rem' }}>
          <input type="checkbox" checked={hide} onChange={(e) => { setHide(e.target.checked); inputRef.current?.focus(); }} />
          Hide the faint answer (type from memory)
        </label>
        <span className="small muted">{done ? 'Done' : `Line ${line + 1} of ${LINES.length}`} · {errors} mistake{errors === 1 ? '' : 's'}</span>
      </div>

      <div className={`type-test${hide ? ' is-hidden' : ''}`} onClick={() => inputRef.current?.focus()}>
        {LINES.map((target, li) => {
          const text = li < line || done ? target : li === line ? typed : '';
          return (
            <p key={li} className={`type-line${li === line && !done ? ' is-active' : ''}${li < line || done ? ' is-done' : ''}`}>
              {[...target].map((ch, i) => {
                const t = text[i];
                const cls = t === undefined ? 'is-todo' : same(t, ch) ? 'is-ok' : 'is-bad';
                const caret = li === line && !done && i === typed.length;
                return <span key={i} className={`${cls}${caret ? ' is-caret' : ''}`}>{ch}</span>;
              })}
            </p>
          );
        })}
        <input ref={inputRef} className="type-input" value={typed} onChange={(e) => onType(e.target.value)} disabled={done}
          aria-label={`Type: ${LINES[line]}`} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
      </div>

      <div className="row">
        {done ? (
          <>
            <strong>{wpm} WPM · {accuracy}% accuracy</strong>
            <button className="btn btn-primary btn-sm" onClick={restart}>Go again</button>
          </>
        ) : (
          <>
            <span className="small muted">Click the text and start typing. Fix any red letters to move to the next line.</span>
            <button className="btn btn-sm" onClick={restart}>Restart</button>
          </>
        )}
      </div>
    </div>
  );
}

/** The lecture's shade tolerance table, to read or to type out as a typing test. */
export function ShadeTable() {
  const [mode, setMode] = useState<'view' | 'type'>('view');

  return (
    <div className="card stack">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0 }}>Shade tolerance by species</h3>
          <p className="small muted" style={{ margin: 0 }}>
            {mode === 'view'
              ? 'From the lecture. The silvicultural system follows from the tolerance.'
              : 'Type over the faint text to drill the table into memory.'}
          </p>
        </div>
        <div className="segmented" role="tablist">
          <button role="tab" aria-selected={mode === 'view'} aria-current={mode === 'view'} onClick={() => setMode('view')}>View</button>
          <button role="tab" aria-selected={mode === 'type'} aria-current={mode === 'type'} onClick={() => setMode('type')}>Typing test</button>
        </div>
      </div>

      {mode === 'view' ? (
        <div className="shade-table">
          {SHADE_TABLE.map((r) => (
            <div key={r.level} className="shade-col">
              <div className="shade-head">
                <strong>{r.level}</strong>
                <span className="small muted">{r.sun}</span>
                <span className="chip">{SYSTEM[r.level]}</span>
              </div>
              <ul className="small">{r.species.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          ))}
        </div>
      ) : (
        <TypingTest />
      )}
    </div>
  );
}
