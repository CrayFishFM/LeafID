import type { StudyGuide } from '@/data/study/types';

/** Says how many answers are flagged "Check this", if any. */
export function CheckNotice({ guide }: { guide: StudyGuide }) {
  const n = guide.cards.filter((c) => c.check).length;
  if (n === 0) return null;
  return (
    <p className="small muted" style={{ margin: '0.35rem 0 0' }}>
      {n} {n === 1 ? 'answer is' : 'answers are'} marked <span className="check-inline">Check this</span>: filled in from other
      notes or not spelled out in the lecture. Confirm those against the lecture.
    </p>
  );
}
