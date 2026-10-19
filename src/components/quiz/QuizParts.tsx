'use client';

import Link from 'next/link';
import { SKIPPED } from '@/lib/answers';
import { ROUND } from './use-quiz';

/** The heading above the choices: the question, then how the answer went. */
export function resultTitle(result: { correct: boolean; chosen: string } | null, question: string) {
  if (!result) return question;
  return result.correct ? 'Correct!' : result.chosen === SKIPPED ? "Here's the answer" : 'Not quite';
}

/** Class for a choice button once answered: the right answer green, a wrong pick red. */
export const choiceClass = (id: string, result: { chosen: string } | null, answer: string | undefined) =>
  result ? (id === answer ? 'correct' : id === result.chosen ? 'wrong' : '') : '';

/** "Question 3 / 10". */
export const QuestionNo = ({ n }: { n: number }) => <span>Question <strong>{n}</strong> / {ROUND}</span>;

/** Hints shown so far, a button for the next one (when `max` > 0) and "I don't know". */
export function HintBar({ hints = [], max = 0, onHint, onSkip, pending }: {
  hints?: string[];
  max?: number;
  onHint?: () => void;
  onSkip: () => void;
  pending: boolean;
}) {
  return (
    <div className="stack" style={{ gap: '0.5rem' }}>
      {hints.map((h) => <div key={h} className="hint">{h}</div>)}
      <div className="row" style={{ gap: '0.5rem' }}>
        {onHint && hints.length < max && (
          <button className="btn btn-sm" onClick={onHint} disabled={pending}>
            {hints.length === 0 ? 'Give me a hint' : 'Another hint'}
          </button>
        )}
        {/* Shows the answer; counts as a miss so it comes up again soon. */}
        <button className="btn btn-sm btn-ghost" onClick={onSkip} disabled={pending}>I don&apos;t know</button>
      </div>
    </div>
  );
}

/** End of a round: the score, what to review, and buttons for the next round and somewhere to study. */
export function RoundSummary({ right, note, missed, onNext, pending, link }: {
  right: number;
  /** A second score line, e.g. ratings. */
  note?: string;
  /** Items got wrong this round, already de-duplicated. */
  missed: { id: string; href: string; label: string }[];
  onNext: () => void;
  pending: boolean;
  link: { href: string; label: string };
}) {
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Round complete: {right} / {ROUND}</h3>
      {note && <p className="small muted" style={{ margin: 0 }}>{note}</p>}
      {missed.length > 0 ? (
        <div>
          <p className="small muted">Worth reviewing:</p>
          <div className="row">
            {missed.map((m) => <Link key={m.id} href={m.href} className="chip">{m.label}</Link>)}
          </div>
        </div>
      ) : (
        <p className="muted">A perfect round — nice work.</p>
      )}
      <div className="row">
        <button className="btn btn-primary" onClick={onNext} disabled={pending}>Next round</button>
        <Link href={link.href} className="btn">{link.label}</Link>
      </div>
    </div>
  );
}

/** Each item got wrong in a round, once. */
export const missedIds = <R extends { correct: boolean }>(round: R[], itemOf: (r: R) => string) =>
  [...new Set(round.filter((r) => !r.correct).map(itemOf))];
