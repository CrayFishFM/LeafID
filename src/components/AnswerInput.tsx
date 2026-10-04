'use client';

import { useEffect, useId, useMemo, useState } from 'react';

export interface AnswerOption {
  id: string;
  /** Shown in the suggestion list and filled into the box when picked. */
  label: string;
  /** Smaller text under the label (e.g. a scientific name). */
  sub?: string;
  /** Everything a learner might type for this answer: codes, names, other names. */
  terms: string[];
}

export type AnswerMode = 'choice' | 'type';

const KEY = 'answerMode';

/** Multiple choice or typed answers, remembered in this browser. */
export function useAnswerMode(): [AnswerMode, (m: AnswerMode) => void] {
  const [mode, setMode] = useState<AnswerMode>('choice');
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore a saved preference
      if (localStorage.getItem(KEY) === 'type') setMode('type');
    } catch {}
  }, []);
  const set = (m: AnswerMode) => {
    setMode(m);
    try { localStorage.setItem(KEY, m); } catch {}
  };
  return [mode, set];
}

export function AnswerModeToggle({ mode, onChange }: { mode: AnswerMode; onChange: (m: AnswerMode) => void }) {
  return (
    <div className="segmented segmented-sm" role="group" aria-label="Answer mode">
      <button type="button" aria-current={mode === 'choice'} onClick={() => onChange('choice')}>Multiple choice</button>
      <button type="button" aria-current={mode === 'type'} onClick={() => onChange('type')}>Type the answer</button>
    </div>
  );
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** 0 = exact, 1 = starts with, 2 = a word starts with, -1 = no match. */
function score(o: AnswerOption, q: string): number {
  let best = -1;
  for (const t of o.terms.map(norm)) {
    if (!t) continue;
    const s = t === q ? 0 : t.startsWith(q) ? 1 : t.split(' ').some((w) => w.startsWith(q)) ? 2 : -1;
    if (s !== -1 && (best === -1 || s < best)) best = s;
  }
  return best;
}

const MAX_SUGGESTIONS = 6;

/**
 * Free-text answer with autocomplete. Suggestions appear once the learner starts typing;
 * the answer must resolve to one of the options before it can be checked.
 */
export function AnswerInput({ options, onSubmit, disabled, result, placeholder }: {
  options: AnswerOption[];
  onSubmit: (id: string) => void;
  disabled?: boolean;
  /** After answering: the right answer and what was picked, to colour the box. */
  result?: { correct: boolean } | null;
  placeholder?: string;
}) {
  const listId = useId();
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<AnswerOption | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = norm(text);
  const suggestions = useMemo(() => {
    if (!q) return [];
    return options
      .map((o) => ({ o, s: score(o, q) }))
      .filter((x) => x.s !== -1)
      .sort((a, b) => a.s - b.s || a.o.label.localeCompare(b.o.label))
      .slice(0, MAX_SUGGESTIONS)
      .map((x) => x.o);
  }, [options, q]);

  function choose(o: AnswerOption) {
    setPicked(o);
    setText(o.label);
    setOpen(false);
    setError(null);
  }

  /** What the box currently means: a picked suggestion, or text that names exactly one option. */
  function resolve(): AnswerOption | null {
    if (picked && picked.label === text) return picked;
    const exact = options.filter((o) => score(o, q) === 0);
    if (exact.length === 1) return exact[0];
    return suggestions.length === 1 ? suggestions[0] : null;
  }

  function submit() {
    if (disabled) return;
    const o = resolve();
    if (!o) {
      setError(q ? 'Pick one of the suggestions.' : 'Type your answer first.');
      setOpen(true);
      return;
    }
    choose(o);
    onSubmit(o.id);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const showing = open && suggestions.length > 0;
    if (e.key === 'ArrowDown' && showing) {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp' && showing) {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // First Enter fills in the highlighted suggestion; the next one checks it.
      if (showing && suggestions[active] && suggestions[active] !== picked) choose(suggestions[active]);
      else submit();
    } else if (e.key === 'Tab' && showing && suggestions[active] && suggestions[active] !== picked) {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const state = result ? (result.correct ? 'is-correct' : 'is-wrong') : '';

  return (
    <form
      className="answer-input stack"
      style={{ gap: '0.5rem' }}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="answer-box">
        <input
          className={`input ${state}`}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && suggestions[active] ? `${listId}-${active}` : undefined}
          aria-label="Your answer"
          placeholder={placeholder ?? 'Start typing…'}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          value={text}
          disabled={disabled}
          onChange={(e) => {
            setText(e.target.value);
            setPicked(null);
            setActive(0);
            setOpen(true);
            setError(null);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          // Delay so a click on a suggestion lands before the list closes.
          onBlur={() => setTimeout(() => setOpen(false), 120)}
        />
        {open && !disabled && suggestions.length > 0 && (
          <ul className="answer-suggestions" id={listId} role="listbox">
            {suggestions.map((o, i) => (
              <li
                key={o.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(o);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span>{o.label}</span>
                {o.sub && <span className="small muted">{o.sub}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {!result && (
        <div className="row" style={{ gap: '0.5rem' }}>
          <button className="btn btn-primary" disabled={disabled || !text.trim()}>Check answer</button>
          <span className="small muted">Enter picks a suggestion, Enter again checks it.</span>
        </div>
      )}
      {error && <div className="small error">{error}</div>}
    </form>
  );
}
