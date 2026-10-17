import Link from 'next/link';
import { CheckNotice } from '@/components/study/CheckNotice';
import { DefectLineup } from '@/components/study/DefectLineup';
import { StudyGuideTabs } from '@/components/study/StudyGuideTabs';
import { ALL_DEFECTS, FOREST_HEALTH } from '@/data/study/forest-health';

export const metadata = { title: 'Forest Health midterm review' };

export default function ForestHealthPage() {
  const guide = FOREST_HEALTH;
  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Forest Health</p>
        <h1>Midterm review</h1>
        <p className="muted" style={{ margin: 0 }}>
          Pathology and fungi, AGS / UGS and defect severity, the other hardwood defects, tree marking, and cavity and mast
          trees. For identifying defects from photos, use the{' '}
          <Link href="/quizzes/defects">defect quiz</Link> and its <Link href="/quizzes/defects/study">study guide</Link>.
        </p>
        <CheckNotice guide={guide} />
      </div>
      <StudyGuideTabs
        guide={guide}
        extra={[{ id: 'lineup', label: 'Major to minor', content: <DefectLineup defects={ALL_DEFECTS} /> }]}
      />
    </div>
  );
}
