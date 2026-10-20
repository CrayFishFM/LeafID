'use client';

import { useRef, useState, type ReactNode } from 'react';
import { SHADE_TABLE } from '@/data/study/ecology';

const SYSTEM: Record<string, string> = {
  'Very intolerant': 'Clearcut', Intolerant: 'Clearcut', Intermediate: 'Shelterwood', Tolerant: 'Selection', 'Very tolerant': 'Selection',
};

const TOTAL_CHARS = SHADE_TABLE.reduce((n, r) => n + r.species.join('').length, 0);

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** The box header shared by the view and the typing test. */
function ShadeHead({ level, sun, extra }: { level: string; sun: string; extra: ReactNode }) {
  return (
    <div className="shade-head">
      <strong>{level}</strong>
      <span className="small muted">{sun}</span>
      {extra}
    </div>
  );
}

/** One class's box: its species show faintly and you type over them, one at a time. */
function TypeBox({ level, sun, species, onKeys, onDone }: {
  level: string; sun: string; species: string[];
  onKeys: (typed: number, wrong: number) => void; onDone: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const complete = idx === species.length;

  function onType(value: string) {
    const target = species[idx];
    const v = value.slice(0, target.length);
    if (v.length > typed.length) {
      // Count each new wrong letter once, as it's typed.
      const added = v.slice(typed.length);
      onKeys(added.length, [...added].filter((ch, i) => !same(ch, target[typed.length + i])).length);
    }
    // A species only moves on once it's typed right (case doesn't matter).
    if (v.length === target.length && same(v, target)) {
      setIdx(idx + 1);
      setTyped('');
      if (idx + 1 === species.length) onDone();
      return;
    }
    setTyped(v);
  }

  return (
    <div className={`shade-col type-box${complete ? ' is-complete' : ''}`}>
      <ShadeHead level={level} sun={sun} extra={<span className={`chip ${complete ? 'chip-ok' : ''}`}>{idx} / {species.length}</span>} />
      <ul className="small">
        {species.map((sp, si) => (
          <li key={sp} className={si < idx ? 'is-done' : si === idx ? 'is-active' : ''}>
            {si < idx ? sp : [...sp].map((ch, i) => {
              const t = si === idx ? typed[i] : undefined;
              const cls = t === undefined ? 'is-todo' : same(t, ch) ? 'is-ok' : 'is-bad';
              return <span key={i} className={`${cls}${si === idx && i === typed.length ? ' is-caret' : ''}`}>{ch}</span>;
            })}
          </li>
        ))}
      </ul>
      {!complete && (
        <input className="type-input" value={typed} onChange={(e) => onType(e.target.value)}
          aria-label={`Type the ${level.toLowerCase()} species: ${species[idx]}`} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
      )}
    </div>
  );
}

/** A typing test over the table, in the same boxes: click a box and type its species over the faint text. */
function TypingTest() {
  const [hide, setHide] = useState(false);
  const [round, setRound] = useState(0);
  const [keys, setKeys] = useState(0);
  const [errors, setErrors] = useState(0);
  const [boxesDone, setBoxesDone] = useState(0);
  const started = useRef<number | null>(null);
  const [minutes, setMinutes] = useState(0);
  const done = boxesDone === SHADE_TABLE.length;

  function onKeys(typed: number, wrong: number) {
    started.current ??= Date.now();
    setKeys((k) => k + typed);
    setErrors((e) => e + wrong);
  }

  function onDone() {
    setBoxesDone((n) => {
      if (n + 1 === SHADE_TABLE.length && started.current !== null) setMinutes((Date.now() - started.current) / 60000);
      return n + 1;
    });
  }

  function restart() {
    setRound((r) => r + 1);
    setKeys(0);
    setErrors(0);
    setBoxesDone(0);
    setMinutes(0);
    started.current = null;
  }

  const wpm = minutes > 0 ? Math.round(TOTAL_CHARS / 5 / minutes) : 0;
  const accuracy = keys > 0 ? Math.round(((keys - errors) / keys) * 100) : 100;

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <label className="row small" style={{ gap: '0.4rem' }}>
          <input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} />
          Hide the faint answer (type from memory)
        </label>
        <span className="small muted">{boxesDone} / {SHADE_TABLE.length} classes · {errors} mistake{errors === 1 ? '' : 's'}</span>
      </div>
      <div className={`shade-table type-test${hide ? ' is-hidden' : ''}`}>
        {SHADE_TABLE.map((r) => (
          <TypeBox key={`${r.level}-${round}`} level={r.level} sun={r.sun} species={r.species} onKeys={onKeys} onDone={onDone} />
        ))}
      </div>
      <div className="row">
        {done ? (
          <>
            <strong>{wpm} WPM · {accuracy}% accuracy</strong>
            <button className="btn btn-primary btn-sm" onClick={restart}>Go again</button>
          </>
        ) : (
          <>
            <span className="small muted">Click a box and type its species. Fix any red letters to move to the next one.</span>
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
              <ShadeHead level={r.level} sun={r.sun} extra={<span className="chip">{SYSTEM[r.level]}</span>} />
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
