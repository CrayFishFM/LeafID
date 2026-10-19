'use client';

import { getPairQuestion, submitPairAnswer } from '@/app/quizzes/actions';
import type { PairQuestion } from '@/lib/topic-quiz';
import { SKIPPED } from '@/lib/answers';
import { choiceClass, HintBar, missedIds, QuestionNo, resultTitle, RoundSummary } from './quiz/QuizParts';
import { useQuizKeys, useQuizRound } from './quiz/use-quiz';
import { ZoomPhoto } from './ZoomPhoto';

/** A species as sent to the browser: its name and what to look for in each sex. `anchor` is the male's entry in the study guide. */
export interface ClientPair { id: string; name: string; anchor: string; male: string[]; female: string[] }

interface Result { correct: boolean; item: string; chosen: string }

const itemOf = (r: Result) => r.item;

/** The male and female of one species are shown together; name the species. */
export function PairQuiz({ topicId, species, initial }: { topicId: string; species: ClientPair[]; initial: PairQuestion | null }) {
  const byId = Object.fromEntries(species.map((s) => [s.id, s]));
  const quiz = useQuizRound<PairQuestion, string, Result>({
    initial,
    submit: async (q, chosen) => ({ ...(await submitPairAnswer(topicId, q.imageKey, chosen)), chosen }),
    load: (recent) => getPairQuestion(topicId, recent),
    itemOf,
  });
  const { q, result, round, pending, error, answer, next, roundDone } = quiz;

  useQuizKeys({
    onChoice: q && !result ? (i) => answer(q.choices[i]) : undefined,
    onNext: result ? next : undefined,
  });

  if (!q) return <div className="card empty"><p>No male and female photos in this quiz yet.</p></div>;

  const target = result ? byId[result.item] : null;
  const chosen = result && !result.correct ? byId[result.chosen] : null;

  return (
    <div className="stack">
      <div className="scorebar">
        <QuestionNo n={quiz.questionNo} />
        <span>Correct <strong>{quiz.correctCount}</strong></span>
      </div>

      <div className="quiz">
        <div className={`pair-photos${q.photos.length > 1 ? ' is-split' : ''}`}>
          {q.photos.map((p) => (
            <figure key={p.url}>
              <ZoomPhoto className="photo photo-contain" src={p.url} alt={p.label} />
              <figcaption>{p.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="stack">
          <h2 style={{ margin: 0 }}>{resultTitle(result, 'Which species is this pair?')}</h2>

          <div className="choices">
            {q.choices.map((id) => (
              <button key={id} className={`choice ${choiceClass(id, result, result?.item)}`} disabled={!!result || pending} onClick={() => answer(id)}>
                <span className="name">{byId[id]?.name}</span>
              </button>
            ))}
          </div>

          {!result && <HintBar onSkip={() => answer(SKIPPED)} pending={pending} />}

          {error && <div className="error">{error}</div>}

          {result && target && (
            <div className={`card feedback ${result.correct ? '' : 'is-wrong'}`}>
              <p style={{ marginBottom: '0.4rem' }}>
                {chosen ? <>You chose <strong>{chosen.name}</strong>. These are </> : 'These are '}
                <strong>{target.name.toLowerCase()}s</strong>.
              </p>
              <p className="small muted" style={{ marginBottom: 0 }}>Male:</p>
              <ul className="small">{target.male.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="small muted" style={{ marginBottom: 0 }}>Female:</p>
              <ul className="small">{target.female.map((t) => <li key={t}>{t}</li>)}</ul>
              {chosen && <p className="small"><strong>{chosen.name}</strong> instead. Male: {chosen.male[0]} Female: {chosen.female[0]}</p>}
              {!roundDone && <button className="btn btn-primary" onClick={next} disabled={pending} autoFocus>Next pair</button>}
            </div>
          )}

          {roundDone && (
            <RoundSummary
              right={quiz.correctCount}
              missed={missedIds(round, itemOf).map((id) => ({ id, href: `/quizzes/${topicId}/study#${byId[id]?.anchor}`, label: byId[id]?.name }))}
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
