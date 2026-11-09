'use client';

import { useMemo, useState } from 'react';
import { getTopicHint, getTopicQuestion, submitGrade, submitTopicAnswer } from '@/app/quizzes/actions';
import type { TopicItem } from '@/data/topics';
import type { Severity, Stock } from '@/data/topics/types';
import type { GradeCase, TopicQuestion } from '@/lib/topic-quiz';
import { TOPIC_MAX_HINTS } from '@/lib/answers';
import { GradePicker, type GradeOutcome } from './GradePicker';
import { PhotoQuiz, type QuizChoice } from './quiz/PhotoQuiz';
import { usePhotoQuiz, type PhotoResult } from './quiz/use-quiz';

/** An item as sent to the browser: no photo list or ratings, so answers can't be read from the page. */
export type ClientItem = Omit<TopicItem, 'images' | 'ratings'>;

interface Result extends PhotoResult { grade: GradeCase | null }

export function TopicQuiz({ topicId, question, scope, items, initial }: {
  topicId: string;
  question: string;
  scope: string;
  items: ClientItem[];
  initial: TopicQuestion | null;
}) {
  const study = `/quizzes/${topicId}/study`;
  const choices = useMemo<QuizChoice[]>(
    () => items.map((i) => ({
      id: i.id, code: i.code, name: i.name, aka: i.aka, scientific: i.scientific, features: i.tips, href: `${study}#${i.id}`,
    })),
    [items, study],
  );
  // Graded topics: severity + AGS/UGS asked after each ID answer.
  const [grade, setGrade] = useState<GradeOutcome | null>(null);
  const [gradedRight, setGradedRight] = useState(0);
  const quiz = usePhotoQuiz<TopicQuestion, Result>({
    initial,
    submit: (q, chosen, hints) => submitTopicAnswer(topicId, q.imageKey, chosen, hints),
    load: (recent) => getTopicQuestion(topicId, scope, recent),
    hint: (q, level) => getTopicHint(topicId, q.imageKey, level),
    maxHints: TOPIC_MAX_HINTS,
    onNext: (newRound) => {
      setGrade(null);
      if (newRound) setGradedRight(0);
    },
  });
  const { q, result, round, pending } = quiz;
  const awaitingGrade = !!result?.grade && !grade;
  const graded = round.filter((r) => r.grade).length;
  const target = result && items.find((i) => i.id === result.item);

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

  return (
    <PhotoQuiz
      quiz={quiz}
      items={choices}
      question={question}
      placeholder="Start typing a name…"
      photoAlt="Photo to identify"
      photoClassName="photo photo-contain"
      prompt={(q) => q.focus && <p style={{ margin: 0 }}>Name <strong>{q.focus}</strong> in the photo.</p>}
      score={graded > 0 && <span>Rated right <strong>{gradedRight}</strong></span>}
      hold={awaitingGrade}
      followUp={q && result?.grade && target && (
        <div className="card stack">
          <div>
            <h3 style={{ margin: 0 }}>Now rate this {target.name.toLowerCase()}</h3>
            <p className="small muted" style={{ margin: 0 }}>Is it a minor, moderate or major defect, and is the tree AGS or UGS?</p>
          </div>
          <GradePicker key={q.imageKey} when={result.grade.when} onSubmit={rate} outcome={grade} pending={pending} />
          {grade && !quiz.roundDone && (
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={quiz.next} disabled={pending} autoFocus>Next question</button>
          )}
        </div>
      )}
      summaryNote={graded > 0 ? `Severity and AGS/UGS rated right: ${gradedRight} / ${graded}` : undefined}
      summaryLink={{ href: study, label: 'Study guide' }}
      empty={{ text: 'No photos for this selection yet.', href: `/quizzes/${topicId}`, label: 'Practise everything' }}
    />
  );
}
