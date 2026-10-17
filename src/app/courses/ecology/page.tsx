import Link from 'next/link';
import { CheckNotice } from '@/components/study/CheckNotice';
import { StudyGuideTabs } from '@/components/study/StudyGuideTabs';
import { TreeCrossSection } from '@/components/study/TreeCrossSection';
import { ECOLOGY, SHADE_TABLE } from '@/data/study/ecology';

export const metadata = { title: 'Ecology midterm review' };

const SYSTEM: Record<string, string> = {
  'Very intolerant': 'Clearcut', Intolerant: 'Clearcut', Intermediate: 'Shelterwood', Tolerant: 'Selection', 'Very tolerant': 'Selection',
};

function ShadeTable() {
  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>Shade tolerance by species</h3>
        <p className="small muted" style={{ margin: 0 }}>From the lecture. The silvicultural system follows from the tolerance.</p>
      </div>
      <div className="shade-table">
        {SHADE_TABLE.map((r) => (
          <div key={r.level} className="shade-col">
            <div className="shade-head">
              <strong>{r.level}</strong>
              <span className="small muted">{r.sun}</span>
              <span className="chip">{SYSTEM[r.level]}</span>
            </div>
            <ul className="small">{r.species.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

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
