import Link from 'next/link';
import { CruiseLineDrill, ScaleDrill } from '@/components/study/ScaleDrills';
import { StudyGuideTabs } from '@/components/study/StudyGuideTabs';
import { UtmExplorer } from '@/components/study/UtmExplorer';
import { PLACES, REMOTE_SENSING } from '@/data/study/remote-sensing';
import { CheckNotice } from '@/components/study/CheckNotice';

export const metadata = { title: 'Remote Sensing midterm review' };

export default function RemoteSensingPage() {
  const guide = REMOTE_SENSING;
  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Remote Sensing</p>
        <h1>Midterm review</h1>
        <p className="muted" style={{ margin: 0 }}>
          Every review question as flashcards, a practice test, and drills for the parts you have to work out: scale,
          cruise lines, UTM zones and GIS data types. Checked against the Week 1 lecture.
        </p>
        <CheckNotice guide={guide} />
      </div>
      <StudyGuideTabs
        guide={guide}
        extra={[
          { id: 'scale', label: 'Scale & cruise lines', content: <div className="grid grid-2" style={{ alignItems: 'start' }}><ScaleDrill /><CruiseLineDrill /></div> },
          { id: 'utm', label: 'UTM zones', content: <UtmExplorer places={PLACES} /> },
        ]}
      />
    </div>
  );
}
