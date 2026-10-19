'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getTopicHint, getTopicQuestion, submitGrade, submitTopicAnswer } from '@/app/quizzes/actions';
import type { TopicItem } from '@/data/topics';
import type { Severity, Stock } from '@/data/topics/types';
import type { GradeCase, TopicQuestion } from '@/lib/topic-quiz';
import { SKIPPED, TOPIC_MAX_HINTS as MAX_HINTS } from '@/lib/answers';
import { AnswerInput, AnswerModeToggle, useAnswerMode, type AnswerOption } from './AnswerInput';
import { GradePicker, type GradeOutcome } from './GradePicker';
import { choiceClass, HintBar, missedIds, QuestionNo, resultTitle, RoundSummary } from './quiz/QuizParts';
import { useHints, useQuizKeys, useQuizRound } from './quiz/use-quiz';
import { ZoomPhoto } from './ZoomPhoto';

/** An item as sent to the browser: no photo list or ratings, so answers can't be read from the page. */
export type ClientItem = Omit<TopicItem, 'images' | 'ratings'>;

interface Result { correct: boolean; item: string; chosen: string; grade: GradeCase | null }

const itemOf = (r: Result) => r.item;

export function TopicQuiz({ topicId, question, scope, items, initial }: {
  topicId: string;
  question: string;
  scope: string;
  items: ClientItem[];
  initial: TopicQuestion | null;
}) {
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const [mode, setMode] = useAnswerMode();
  const options = useMemo<AnswerOption[]>(
    () =>
      items.map((i) => ({
        id: i.id,
        label: i.aka ? `${i.name} (${i.aka})` : i.name,
        sub: i.scientific,
        terms: [i.name, i.aka ?? '', i.scientific ?? ''],
      })),
    [items],
  );
  // Graded topics: severity + AGS/UGS asked after each ID answer.
  const [grade, setGrade] = useState<GradeOutcome | null>(null);
  const [gradedRight, setGradedRight] = useState(0);
  const quiz = useQuizRound<TopicQuestion, string, Result>({
    initial,
    submit: async (q, chosen) => ({ ...(await submitTopicAnswer(topicId, q.imageKey, chosen, hints.length)), chosen }),
    load: (recent) => getTopicQuestion(topicId, scope, recent),
    itemOf,
    onNext: (newRound) => {
      reset();
      setGrade(null);
      if (newRound) setGradedRight(0);
    },
  });
  const { q, result, round, pending, error, answer, next } = quiz;
  const { hints, hint, reset } = useHints(MAX_HINTS, (level) => getTopicHint(topicId, q!.imageKey, level), quiz);

  const awaitingGrade = !!result?.grade && !grade;
  const roundDone = quiz.roundDone && !awaitingGrade;

  function rate(severity: Severity, stock: Stock) {
    if (!q || !result?.grade || grade || pending) return;
    const index = result.grade.index;
    quiz.start(async () => {
      try {
        const g = await submitGrade(topicId, q.imageKey, index, severity, stock);
        setGrade(g);
        if (g.severityOk && g.stockOk) setGradedRight((n) => n + 1);
      } catch {
        quiz.setError('Could not save your rating. Check your connection and try again.');
      }
    });
  }

  useQuizKeys({
    onChoice: q && !result && mode === 'choice' ? (i) => answer(q.choices[i]) : undefined,
    onNext: result && !awaitingGrade ? next : undefined,
    onHint: q && !result ? hint : undefined,
  });

  if (!q) {
    return (
      <div className="card empty">
        <p>No photos for this selection yet.</p>
        <Link href={`/quizzes/${topicId}`} className="btn">Practise everything</Link>
      </div>
    );
  }

  const target = result ? byId[result.item] : null;
  const chosen = result && !result.correct ? byId[result.chosen] : null;
  const graded = round.filter((r) => r.grade).length;

  return (
    <div className="stack">
      <div className="scorebar">
        <QuestionNo n={quiz.questionNo} />
        <span>Correct <strong>{quiz.correctCount}</strong></span>
        {graded > 0 && <span>Rated right <strong>{gradedRight}</strong></span>}
        <span style={{ marginLeft: 'auto' }} />
        <AnswerModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="quiz">
        <ZoomPhoto key={q.imageKey} className="photo photo-contain" src={q.imageUrl} alt="Photo to identify" />

        <div className="stack">
          <h2 style={{ margin: 0 }}>{resultTitle(result, question)}</h2>
          {q.focus && <p style={{ margin: 0 }}>Name <strong>{q.focus}</strong> in the photo.</p>}

          {mode === 'type' ? (
            <AnswerInput
              key={q.imageKey}
              options={options}
              onSubmit={answer}
              disabled={!!result || pending}
              result={result}
              placeholder="Start typing a name…"
            />
          ) : (
          <div className="choices">
            {q.choices.map((id) => (
              <button key={id} className={`choice ${choiceClass(id, result, result?.item)}`} disabled={!!result || pending} onClick={() => answer(id)}>
                <span className="name">{byId[id].name}</span>
                {byId[id].aka && <span className="common">{byId[id].aka}</span>}
              </button>
            ))}
          </div>
          )}

          {!result && <HintBar hints={hints} max={MAX_HINTS} onHint={hint} onSkip={() => answer(SKIPPED)} pending={pending} />}

          {error && <div className="error">{error}</div>}

          {result && target && (
            <div className={`card feedback ${result.correct ? '' : 'is-wrong'}`}>
              <p style={{ marginBottom: '0.4rem' }}>
                {chosen ? <>You chose <strong>{chosen.name}</strong>. This is </> : 'This is '}
                <strong>{target.name}</strong>
                {target.aka && <> ({target.aka})</>}
                {target.scientific && <> · <em className="muted">{target.scientific}</em></>}
              </p>
              <p className="small muted" style={{ marginBottom: 0 }}>How to recognise {target.name.toLowerCase()}:</p>
              <ul className="small">{target.tips.map((t) => <li key={t}>{t}</li>)}</ul>
              {chosen && (
                <p className="small"><strong>{chosen.name}</strong> instead: {chosen.tips[0]}</p>
              )}
              {!roundDone && !result.grade && (
                <button className="btn btn-primary" onClick={next} disabled={pending} autoFocus>Next question</button>
              )}
            </div>
          )}

          {result?.grade && target && (
            <div className="card stack">
              <div>
                <h3 style={{ margin: 0 }}>Now rate this {target.name.toLowerCase()}</h3>
                <p className="small muted" style={{ margin: 0 }}>Is it a minor, moderate or major defect, and is the tree AGS or UGS?</p>
              </div>
              <GradePicker key={q.imageKey} when={result.grade.when} onSubmit={rate} outcome={grade} pending={pending} />
              {grade && !roundDone && <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next} disabled={pending} autoFocus>Next question</button>}
            </div>
          )}

          {roundDone && (
            <RoundSummary
              right={quiz.correctCount}
              note={graded > 0 ? `Severity and AGS/UGS rated right: ${gradedRight} / ${graded}` : undefined}
              missed={missedIds(round, itemOf).map((id) => ({ id, href: `/quizzes/${topicId}/study#${id}`, label: byId[id].name }))}
              onNext={next}
              pending={pending}
              link={{ href: `/quizzes/${topicId}/study`, label: 'Study guide' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
