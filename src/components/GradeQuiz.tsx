'use client';

import { getGradeQuestion, submitGrade } from '@/app/quizzes/actions';
import type { Severity, Stock } from '@/data/topics/types';
import type { GradeQuestion, GradeResult } from '@/lib/topic-quiz';
import { GradePicker } from './GradePicker';
import { missedIds, QuestionNo, RoundSummary } from './quiz/QuizParts';
import { useQuizKeys, useQuizRound } from './quiz/use-quiz';
import type { ClientItem } from './TopicQuiz';
import { ZoomPhoto } from './ZoomPhoto';

interface Result extends GradeResult { correct: boolean; item: string }

const itemOf = (r: Result) => r.item;

/** Grading only: the defect is named, you give its severity and AGS/UGS class. */
export function GradeQuiz({ topicId, items, initial }: { topicId: string; items: ClientItem[]; initial: GradeQuestion | null }) {
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const quiz = useQuizRound<GradeQuestion, { severity: Severity; stock: Stock }, Result>({
    initial,
    submit: async (q, { severity, stock }) => {
      const g = await submitGrade(topicId, q.imageKey, q.grade.index, severity, stock);
      return { ...g, correct: g.severityOk && g.stockOk, item: q.item };
    },
    load: (recent) => getGradeQuestion(topicId, recent),
    itemOf,
  });
  const { q, result, round, pending, error, answer, next, roundDone } = quiz;

  // Enter / Space for the next question once rated; the rating buttons keep their own keys.
  useQuizKeys({ onNext: result ? next : undefined, ignore: 'button' });

  if (!q) return <div className="card empty"><p>Nothing to grade in this quiz yet.</p></div>;

  const item = byId[q.item];

  return (
    <div className="stack">
      <div className="scorebar">
        <QuestionNo n={quiz.questionNo} />
        <span>Rated right <strong>{quiz.correctCount}</strong></span>
      </div>
      <div className="quiz">
        <ZoomPhoto key={q.imageKey} className="photo photo-contain" src={q.imageUrl} alt={item?.name ?? 'Defect'} />
        <div className="stack">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Rate this defect</p>
            <h2 style={{ margin: 0 }}>{item?.name}</h2>
            {item?.aka && <p className="small muted" style={{ margin: 0 }}>{item.aka}</p>}
          </div>
          <GradePicker key={q.imageKey} when={q.grade.when} onSubmit={(severity, stock) => answer({ severity, stock })} outcome={result} pending={pending} />
          {error && <div className="error">{error}</div>}
          {result && !roundDone && (
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next} disabled={pending} autoFocus>Next defect</button>
          )}
          {roundDone && (
            <RoundSummary
              right={quiz.correctCount}
              missed={missedIds(round, itemOf).map((id) => ({ id, href: `/quizzes/${topicId}/study#${id}`, label: byId[id]?.name }))}
              onNext={next}
              pending={pending}
              link={{ href: `/quizzes/${topicId}/study#grading`, label: 'Grading rules' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
