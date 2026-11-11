import Link from 'next/link';
import { CheckNotice } from '@/components/study/CheckNotice';
import { FieldDrill } from '@/components/study/FieldDrills';
import { StudyGuideTabs } from '@/components/study/StudyGuideTabs';
import { FOREST_ENVIRONMENT } from '@/data/study/forest-environment';

export const metadata = { title: 'Forest Environment midterm review' };

export default function ForestEnvironmentPage() {
  const guide = FOREST_ENVIRONMENT;
  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Forest Environment</p>
        <h1>Midterm review</h1>
        <p className="muted" style={{ margin: 0 }}>
          Pacing and chaining, maps and UTM, compassing, diameters and heights, forestry tools, tree aging and prisms, with
          drills for the maths. The instructor says the review isn’t everything: anything in the PowerPoints or the field can be on
          the midterm.
        </p>
        <CheckNotice guide={guide} />
      </div>
      <StudyGuideTabs
        guide={guide}
        extra={[
          { id: 'compass', label: 'Compass math', content: <FieldDrill kind="compass" /> },
          { id: 'heights', label: 'Heights & DBH math', content: <FieldDrill kind="trees" /> },
        ]}
      />
    </div>
  );
}
