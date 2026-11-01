import Link from 'next/link';
import { CheckNotice } from '@/components/study/CheckNotice';
import { StudyGuideTabs } from '@/components/study/StudyGuideTabs';
import { WILDLIFE } from '@/data/study/wildlife';

export const metadata = { title: 'Wildlife midterm review' };

export default function WildlifePage() {
  const guide = WILDLIFE;
  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Wildlife</p>
        <h1>Midterm review</h1>
        <p className="muted" style={{ margin: 0 }}>
          The CFSA, SSG, AOCs and federal acts, lakes and streams, aquatic AOCs, duck types and water bird SAR, and
          reptiles and amphibians. For identifying species from photos, use the{' '}
          <Link href="/quizzes/waterbirds">water bird</Link> and <Link href="/quizzes/herps">reptile & amphibian</Link> quizzes.
        </p>
        <CheckNotice guide={guide} />
      </div>
      <StudyGuideTabs guide={guide} />
    </div>
  );
}
