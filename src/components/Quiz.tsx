'use client';

import { useMemo } from 'react';
import { getHint, getQuestion, submitAnswer } from '@/app/actions';
import type { Question } from '@/lib/quiz';
import { contrastTip } from '@/lib/suggestions';
import { LEAF_MAX_HINTS } from '@/lib/answers';
import { PhotoQuiz, type QuizChoice } from './quiz/PhotoQuiz';
import { usePhotoQuiz, type PhotoResult } from './quiz/use-quiz';
import { ReportButton } from './ReportButton';
import { useLeaf } from './LeafProvider';

export function Quiz({ scope, initial }: { scope: string; initial: Question | null }) {
  const leaf = useLeaf();
  const items = useMemo<QuizChoice[]>(
    () => leaf.species.map((s) => ({
      id: s.id, code: s.code, name: s.common, scientific: s.scientific, features: s.keyFeatures, href: `/learn/${s.id}`,
    })),
    [leaf.species],
  );
  const quiz = usePhotoQuiz<Question, PhotoResult>({
    initial,
    submit: async (q, chosen, hints) => {
      const r = await submitAnswer(q.imageKey, chosen, hints);
      return { correct: r.correct, item: r.species };
    },
    load: (recent) => getQuestion(scope, recent),
    hint: (q, level) => getHint(q.imageKey, level),
    maxHints: LEAF_MAX_HINTS,
  });

  return (
    <PhotoQuiz
      quiz={quiz}
      items={items}
      question="Which tree is this?"
      placeholder="Type a code or tree name…"
      photoAlt="Leaf to identify"
      photoBadge={(q) => q.community && <span className="chip photo-tag">Community photo</span>}
      photoFooter={(q) => (
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {q.credit ? <p className="credit">Photo: {q.credit}</p> : <span />}
          {/* Keyed so a new question starts with a fresh, closed report form. */}
          <ReportButton key={q.imageKey} imageKey={q.imageKey} />
        </div>
      )}
      contrast={(target, chosen) => contrastTip(leaf, target.id, chosen.id)}
      summaryLink={{ href: '/progress', label: 'View progress' }}
      empty={{ text: 'No photos available for this selection yet.', href: '/quiz', label: 'Practise all species' }}
    />
  );
}
