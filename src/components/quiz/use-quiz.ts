'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';

/*
 * The question → answer → next flow every photo quiz shares (leaf ID, topic ID, male & female,
 * rating defects): a round of ROUND questions, recently asked items kept out of the next pick,
 * and the same error messages.
 */

export const ROUND = 10;

/** What every answer result needs: whether it was right, and which item the question was about. */
export interface Answered { correct: boolean }

export function useQuizRound<Q, A, R extends Answered>({ initial, submit, load, itemOf, onNext }: {
  initial: Q | null;
  /** Saves an answer on the server and returns the result. */
  submit: (q: Q, answer: A) => Promise<R>;
  /** Loads the next question, avoiding the recently asked items. */
  load: (recent: string[]) => Promise<Q | null>;
  /** The item a result was about, so it isn't asked again straight away. */
  itemOf: (r: R) => string;
  /** Clears a quiz's own per-question state (hints, a follow-up rating…). */
  onNext?: (newRound: boolean) => void;
}) {
  const [q, setQ] = useState(initial);
  const [result, setResult] = useState<R | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [round, setRound] = useState<R[]>([]);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const roundDone = round.length >= ROUND && result !== null;

  const answer = useCallback(
    (a: A) => {
      if (!q || result || pending) return;
      start(async () => {
        try {
          const r = await submit(q, a);
          setResult(r);
          setRound((xs) => [...xs, r]);
          setRecent((xs) => [itemOf(r), ...xs].slice(0, 3));
        } catch {
          setError('Could not save your answer. Check your connection and try again.');
        }
      });
    },
    [q, result, pending, submit, itemOf],
  );

  const next = useCallback(() => {
    start(async () => {
      try {
        const nq = await load(recent);
        if (roundDone) setRound([]);
        onNext?.(roundDone);
        setQ(nq);
        setResult(null);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        setError('Could not load the next question.');
      }
    });
  }, [load, recent, roundDone, onNext]);

  return {
    q, result, round, pending, start, error, setError, answer, next, roundDone,
    correctCount: round.filter((r) => r.correct).length,
    /** 1-based number of the question on screen. */
    questionNo: Math.min(round.length + (result ? 0 : 1), ROUND),
  };
}

/** Hints fetched one at a time, up to `max`. */
export function useHints(max: number, fetch: (level: number) => Promise<string | null>, quiz: { start: (fn: () => Promise<void>) => void; setError: (e: string) => void }) {
  const [hints, setHints] = useState<string[]>([]);
  const hint = () => {
    if (hints.length >= max) return;
    const level = hints.length;
    quiz.start(async () => {
      try {
        const h = await fetch(level);
        // Ignore a late response if another hint landed first.
        if (h) setHints((xs) => (xs.length === level ? [...xs, h] : xs));
      } catch {
        quiz.setError('Could not load a hint. Try again.');
      }
    });
  };
  return { hints, hint, reset: () => setHints([]) };
}

/**
 * Keyboard shortcuts: 1–4 pick a choice, Enter / Space go on, H asks for a hint. Pass only the
 * actions that apply right now. Keys typed in a text box, or on the photo and its enlarged view,
 * are left alone; `ignore` adds more places to leave alone.
 */
export function useQuizKeys({ onChoice, onNext, onHint, ignore }: {
  onChoice?: (index: number) => void;
  onNext?: () => void;
  onHint?: () => void;
  ignore?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      if (e.target instanceof Element && e.target.closest(`.zoom-btn, dialog[open]${ignore ? `, ${ignore}` : ''}`)) return;
      if (onChoice && /^[1-4]$/.test(e.key)) onChoice(Number(e.key) - 1);
      else if (onNext && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onNext(); }
      else if (onHint && e.key.toLowerCase() === 'h') onHint();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
}
