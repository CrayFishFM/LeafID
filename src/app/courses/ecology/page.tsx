import Link from 'next/link';
import { CheckNotice } from '@/components/study/CheckNotice';
import { ShadeTable } from '@/components/study/ShadeTable';
import { StudyGuideTabs } from '@/components/study/StudyGuideTabs';
import { TreeCrossSection } from '@/components/study/TreeCrossSection';
import { ECOLOGY } from '@/data/study/ecology';

export const metadata = { title: 'Ecology midterm review' };

export default function EcologyPage() {
  const guide = ECOLOGY;
  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Ecology</p>
        <h1>Midterm review</h1>
        <p className="muted" style={{ margin: 0 }}>
          Forest regions, shade tolerance and silvicultural systems, tree physiology and growth rings, reproduction, and
          succession, with a Great Lakes–St. Lawrence focus. The instructor says to read all the notes in the lecture
          PowerPoints too.
        </p>
        <CheckNotice guide={guide} />
      </div>
      <StudyGuideTabs
        guide={guide}
        extra={[
          { id: 'trunk', label: 'Trunk cross-section', content: <TreeCrossSection /> },
          { id: 'shade', label: 'Shade tolerance table', content: <ShadeTable /> },
        ]}
      />
    </div>
  );
}
