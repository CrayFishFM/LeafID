'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { getHint, getQuestion, submitAnswer } from '@/app/actions';
import type { Question } from '@/lib/quiz';
import { contrastTip } from '@/lib/suggestions';
import { LEAF_MAX_HINTS as MAX_HINTS, SKIPPED } from '@/lib/answers';
import { useStoredPreference } from '@/lib/use-stored';
import { AnswerInput, AnswerModeToggle, useAnswerMode, type AnswerOption } from './AnswerInput';
import { choiceClass, HintBar, missedIds, QuestionNo, resultTitle, RoundSummary } from './quiz/QuizParts';
import { useHints, useQuizKeys, useQuizRound } from './quiz/use-quiz';
import { ReportButton } from './ReportButton';
import { useLeaf } from './LeafProvider';
import { ZoomPhoto } from './ZoomPhoto';

const ON_OFF = ['0', '1'] as const;

interface Result { correct: boolean; species: string; chosen: string }

const itemOf = (r: Result) => r.species;

export function Quiz({ scope, initial }: { scope: string; initial: Question | null }) {
  const leaf = useLeaf();
  const [codesOnly, setCodesOnly] = useStoredPreference<'0' | '1'>('codesOnly', '0', ON_OFF);
  const [mode, setMode] = useAnswerMode();
  // Typed answers accept the code, common name (with or without the bracketed part) or scientific name.
  const options = useMemo<AnswerOption[]>(
    () =>
      leaf.species.map((s) => ({
        id: s.id,
        label: s.code === s.common ? s.common : `${s.code} · ${s.common}`,
        sub: s.scientific,
        // e.g. "Sugar maple (hard maple)" also matches "sugar maple" and "hard maple".
        terms: [s.code, s.common, s.common.replace(/\s*\(.*\)/, ''), ...(s.common.match(/\((.*)\)/)?.slice(1) ?? []), s.scientific],
      })),
    [leaf.species],
  );
  const quiz = useQuizRound<Question, string, Result>({
    initial,
    submit: async (q, chosen) => ({ ...(await submitAnswer(q.imageKey, chosen, hints.length)), chosen }),
    load: (recent) => getQuestion(scope, recent),
    itemOf,
    onNext: () => reset(),
  });
  const { q, result, round, pending, error, answer, next, roundDone } = quiz;
  const { hints, hint, reset } = useHints(MAX_HINTS, (level) => getHint(q!.imageKey, level), quiz);

  useQuizKeys({
    onChoice: q && !result && mode === 'choice' ? (i) => answer(q.choices[i]) : undefined,
    onNext: result ? next : undefined,
    onHint: q && !result ? hint : undefined,
  });

  if (!q) {
    return (
      <div className="card empty">
        <p>No photos available for this selection yet.</p>
        <Link href="/quiz" className="btn">Practise all species</Link>
      </div>
    );
  }

  const target = result ? leaf.byId[result.species] : null;
  const chosenSp = result && !result.correct ? leaf.byId[result.chosen] : null;

  return (
    <div className="stack">
      <div className="scorebar">
        <QuestionNo n={quiz.questionNo} />
        <span>Correct <strong>{quiz.correctCount}</strong></span>
        <span style={{ marginLeft: 'auto' }} />
        <AnswerModeToggle mode={mode} onChange={setMode} />
        {mode === 'choice' && (
        <label className="row" style={{ gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={codesOnly === '1'} onChange={(e) => setCodesOnly(e.target.checked ? '1' : '0')} />
          Codes only
        </label>
        )}
      </div>

      <div className="quiz">
        <div>
          <ZoomPhoto key={q.imageKey} src={q.imageUrl} alt="Leaf to identify">
            {q.community && <span className="chip photo-tag">Community photo</span>}
          </ZoomPhoto>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {q.credit ? <p className="credit">Photo: {q.credit}</p> : <span />}
            {/* Keyed so a new question starts with a fresh, closed report form. */}
            <ReportButton key={q.imageKey} imageKey={q.imageKey} />
          </div>
        </div>

        <div className="stack">
          <h2 style={{ margin: 0 }}>{resultTitle(result, 'Which tree is this?')}</h2>

          {mode === 'type' ? (
            <AnswerInput
              key={q.imageKey}
              options={options}
              onSubmit={answer}
              disabled={!!result || pending}
              result={result}
              placeholder="Type a code or tree name…"
            />
          ) : (
          <div className="choices">
            {q.choices.map((id) => {
              const s = leaf.byId[id];
              return (
                <button key={id} className={`choice ${choiceClass(id, result, result?.species)}`} disabled={!!result || pending} onClick={() => answer(id)}>
                  <span className="code">{s.code}</span>
                  {(codesOnly !== '1' || result) && s.code !== s.common && <span className="common">{s.common}</span>}
                </button>
              );
            })}
          </div>
          )}

          {!result && <HintBar hints={hints} max={MAX_HINTS} onHint={hint} onSkip={() => answer(SKIPPED)} pending={pending} />}

          {error && <div className="error">{error}</div>}

          {result && target && (
            <div className={`card feedback ${result.correct ? '' : 'is-wrong'}`}>
              <p style={{ marginBottom: '0.4rem' }}>
                {chosenSp ? <>You chose <strong>{chosenSp.common}</strong>. This is </> : 'This is '}
                <strong>{target.common}</strong> <span className="chip chip-code">{target.code}</span>
              </p>
              {chosenSp && (
                <p className="small"><strong>How to tell them apart:</strong> {contrastTip(leaf, target.id, chosenSp.id)}</p>
              )}
              <p className="small muted" style={{ marginBottom: 0 }}>Key features of {target.common.toLowerCase()}:</p>
              <ul className="small">{target.keyFeatures.map((f) => <li key={f}>{f}</li>)}</ul>
              <div className="row">
                {!roundDone && <button className="btn btn-primary" onClick={next} disabled={pending} autoFocus>Next question</button>}
                <Link href={`/learn/${target.id}`} className="btn btn-sm">Study {target.code}</Link>
              </div>
            </div>
          )}

          {roundDone && (
            <RoundSummary
              right={quiz.correctCount}
              missed={missedIds(round, itemOf).map((id) => ({ id, href: `/learn/${id}`, label: `${leaf.byId[id].code} · ${leaf.byId[id].common}` }))}
              onNext={next}
              pending={pending}
              link={{ href: '/progress', label: 'View progress' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
