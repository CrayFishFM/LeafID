import Link from 'next/link';
import { RemoteSensingGuide } from '@/components/study/RemoteSensingGuide';
import { CARDS } from '@/data/study/remote-sensing';

export const metadata = { title: 'Remote Sensing midterm review' };

export default function RemoteSensingPage() {
  const toCheck = CARDS.filter((c) => c.check).length;
  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Remote Sensing</p>
        <h1>Midterm review</h1>
        <p className="muted" style={{ margin: 0 }}>
          All {CARDS.length} review questions as flashcards, a practice test, and drills for the parts you have to work out:
          scale, cruise lines, UTM zones and GIS data types.
        </p>
        <p className="small muted" style={{ margin: '0.35rem 0 0' }}>
          {toCheck} answers are marked <span className="check-inline">Check this</span>: they were filled in from other lecture notes
          or may differ from what was taught. Confirm those against the lecture.
        </p>
      </div>
      <RemoteSensingGuide />
    </div>
  );
}
