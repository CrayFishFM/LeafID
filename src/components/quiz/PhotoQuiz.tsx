'use client';

import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { SKIPPED } from '@/lib/answers';
import { useStoredPreference } from '@/lib/use-stored';
import { AnswerInput, AnswerModeToggle, useAnswerMode, type AnswerOption } from '../AnswerInput';
import { ZoomPhoto } from '../ZoomPhoto';
import { choiceClass, HintBar, missedIds, QuestionNo, resultTitle, RoundSummary } from './QuizParts';
import { useQuizKeys, type PhotoQuestion, type PhotoQuizState, type PhotoResult } from './use-quiz';

/** One possible answer, as every photo quiz describes it. */
export interface QuizChoice {
  id: string;
  name: string;
  /** Species code, e.g. "Mh" or "Pw". Quizzes with codes get the "Codes only" option. */
  code?: string;
  aka?: string;
  scientific?: string;
  /** What to look for, most telling first. Shown after answering. */
  features: string[];
  /** Where to study this one. */
  href: string;
}

const ON_OFF = ['0', '1'] as const;

/** A code worth showing on its own: some species go by name only (Elderberry). */
const codeOf = (c: QuizChoice) => (c.code && c.code !== c.name ? c.code : undefined);

/** "Pw · Eastern white pine", "Brook trout (Speckled trout)". */
export const choiceLabel = (c: QuizChoice) => {
  const name = c.aka ? `${c.name} (${c.aka})` : c.name;
  return codeOf(c) ? `${c.code} · ${name}` : name;
};

/** Everything a learner might type: the code, the name with or without its bracketed part, other names. */
function answerOption(c: QuizChoice): AnswerOption {
  const bracketed = c.name.match(/\((.*)\)/)?.[1];
  return {
    id: c.id,
    label: choiceLabel(c),
    sub: c.scientific,
    terms: [c.code ?? '', c.name, c.name.replace(/\s*\(.*\)/, ''), bracketed ?? '', c.aka ?? '', c.scientific ?? ''],
  };
}

/**
 * The photo quiz every ID quiz shares: score bar, photo, multiple-choice or typed answers, hints,
 * feedback with what to look for, and the end-of-round summary. Quizzes pass their own extras
 * (photo credit, a follow-up rating…) through the slots.
 */
export function PhotoQuiz<Q extends PhotoQuestion, R extends PhotoResult>({
  quiz, items, question, placeholder, photoAlt, photoClassName, photoBadge, photoFooter, prompt,
  contrast, score, followUp, hold = false, summaryNote, summaryLink, empty,
}: {
  quiz: PhotoQuizState<Q, R>;
  items: QuizChoice[];
  question: string;
  placeholder: string;
  photoAlt: string;
  photoClassName?: string;
  /** Shown over the photo, e.g. "Community photo". */
  photoBadge?: (q: Q) => ReactNode;
  /** Shown under the photo, e.g. the credit and a report button. */
  photoFooter?: (q: Q) => ReactNode;
  /** Shown under the question, e.g. which bird in the photo to name. */
  prompt?: (q: Q) => ReactNode;
  /** How to tell the right answer from a wrong pick. Defaults to the wrong pick's first feature. */
  contrast?: (target: QuizChoice, chosen: QuizChoice) => ReactNode;
  /** Extra scores in the score bar. */
  score?: ReactNode;
  /** A second step after the ID answer, e.g. rating a defect. */
  followUp?: ReactNode;
  /** True while the follow-up still needs an answer: holds back "Next" and the round summary. */
  hold?: boolean;
  summaryNote?: string;
  summaryLink: { href: string; label: string };
  empty: { text: string; href: string; label: string };
}) {
  const { q, result, round, pending, error, answer, next, hints, hint, maxHints } = quiz;
  const byId = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items]);
  const options = useMemo(() => items.map(answerOption), [items]);
  const hasCodes = items.some(codeOf);
  const [mode, setMode] = useAnswerMode();
  const [codesOnly, setCodesOnly] = useStoredPreference<'0' | '1'>('codesOnly', '0', ON_OFF);
  const roundDone = quiz.roundDone && !hold;

  useQuizKeys({
    onChoice: q && !result && mode === 'choice' ? (i) => answer(q.choices[i]) : undefined,
    onNext: result && !hold ? next : undefined,
    onHint: q && !result ? hint : undefined,
  });

  if (!q) {
    return (
      <div className="card empty">
        <p>{empty.text}</p>
        <Link href={empty.href} className="btn">{empty.label}</Link>
      </div>
    );
  }

  const target = result ? byId[result.item] : null;
  const chosen = result && !result.correct ? byId[result.chosen] : null;
  const targetCode = target && codeOf(target);

  return (
    <div className="stack">
      <div className="scorebar">
        <QuestionNo n={quiz.questionNo} />
        <span>Correct <strong>{quiz.correctCount}</strong></span>
        {score}
        <span style={{ marginLeft: 'auto' }} />
        <AnswerModeToggle mode={mode} onChange={setMode} />
        {hasCodes && mode === 'choice' && (
          <label className="row" style={{ gap: '0.4rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={codesOnly === '1'} onChange={(e) => setCodesOnly(e.target.checked ? '1' : '0')} />
            Codes only
          </label>
        )}
      </div>

      <div className="quiz">
        <div>
          <ZoomPhoto key={q.imageKey} className={photoClassName} src={q.imageUrl} alt={photoAlt}>
            {photoBadge?.(q)}
          </ZoomPhoto>
          {photoFooter?.(q)}
        </div>

        <div className="stack">
          <h2 style={{ margin: 0 }}>{resultTitle(result, question)}</h2>
          {prompt?.(q)}

          {mode === 'type' ? (
            <AnswerInput
              key={q.imageKey}
              options={options}
              onSubmit={answer}
              disabled={!!result || pending}
              result={result}
              placeholder={placeholder}
            />
          ) : (
            <div className="choices">
              {q.choices.map((id) => {
                const c = byId[id];
                const code = codeOf(c);
                return (
                  <button key={id} className={`choice ${choiceClass(id, result, result?.item)}`} disabled={!!result || pending} onClick={() => answer(id)}>
                    {code ? (
                      <>
                        <span className="code">{code}</span>
                        {(codesOnly !== '1' || result) && <span className="common">{c.name}</span>}
                      </>
                    ) : (
                      <>
                        <span className="name">{c.name}</span>
                        {c.aka && <span className="common">{c.aka}</span>}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!result && <HintBar hints={hints} max={maxHints} onHint={hint} onSkip={() => answer(SKIPPED)} pending={pending} />}

          {error && <div className="error">{error}</div>}

          {result && target && (
            <div className={`card feedback ${result.correct ? '' : 'is-wrong'}`}>
              <p style={{ marginBottom: '0.4rem' }}>
                {chosen ? <>You chose <strong>{chosen.name}</strong>. This is </> : 'This is '}
                <strong>{target.name}</strong>
                {target.aka && <> ({target.aka})</>}
                {targetCode && <> <span className="chip chip-code">{targetCode}</span></>}
                {target.scientific && <> · <em className="muted">{target.scientific}</em></>}
              </p>
              {chosen && (
                <p className="small">
                  <strong>How to tell them apart:</strong>{' '}
                  {contrast ? contrast(target, chosen) : <><strong>{chosen.name}</strong>: {chosen.features[0]}</>}
                </p>
              )}
              <p className="small muted" style={{ marginBottom: 0 }}>Key features of {target.name.toLowerCase()}:</p>
              <ul className="small">{target.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <div className="row">
                {!roundDone && !hold && !followUp && (
                  <button className="btn btn-primary" onClick={next} disabled={pending} autoFocus>Next question</button>
                )}
                <Link href={target.href} className="btn btn-sm">Study {targetCode ?? target.name.toLowerCase()}</Link>
              </div>
            </div>
          )}

          {followUp}

          {roundDone && (
            <RoundSummary
              right={quiz.correctCount}
              note={summaryNote}
              missed={missedIds(round, quiz.itemOf).map((id) => ({ id, href: byId[id].href, label: choiceLabel(byId[id]) }))}
              onNext={next}
              pending={pending}
              link={summaryLink}
            />
          )}
        </div>
      </div>
    </div>
  );
}
