/* eslint-disable @next/next/no-img-element -- static quiz photos are pre-sized */
import Link from 'next/link';
import { topicImageUrl } from '@/data/topics';
import { getUser } from '@/lib/auth';
import { libraryPhotos } from '@/lib/photos';
import { topicTotals } from '@/lib/topic-quiz';
import { listTopics } from '@/lib/topics';
import { getLeaf } from '@/lib/leaf';

export const metadata = { title: 'Quizzes' };

export default async function QuizzesPage() {
  const leaf = await getLeaf();
  const user = await getUser();
  const [totals, leafPhotos, topics] = await Promise.all([user ? topicTotals(user.id) : {}, libraryPhotos(), listTopics()]);
  const leafCover = leafPhotos.find((p) => p.species === 'Mh') ?? leafPhotos[0];

  const cards = [
    {
      id: 'leaves',
      title: 'Leaf ID',
      blurb: `${leaf.species.length} Ontario trees by their leaves, with community photos.`,
      cover: leafCover?.url,
      practice: '/quiz',
      study: '/learn',
      stats: null as { total: number; correct: number } | null,
    },
    ...topics.map((t) => ({
      id: t.id,
      title: t.title,
      blurb: t.blurb,
      cover: t.items[0]?.images[0] ? topicImageUrl(t, t.items[0].images[0]) : undefined,
      practice: `/quizzes/${t.id}`,
      study: `/quizzes/${t.id}/study`,
      stats: (totals as Record<string, { total: number; correct: number }>)[t.id] ?? null,
    })),
  ];

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow">Quizzes</p>
        <h1>Pick a topic</h1>
        <p className="muted">Each quiz adapts to you: things you miss come back more often until they stick.</p>
      </div>
      <div className="grid grid-2">
        {cards.map((c) => (
          <article key={c.id} className="card stack topic-card">
            <div className="photo photo-contain">{c.cover && <img src={c.cover} alt="" loading="lazy" />}</div>
            <div>
              <h2 style={{ margin: 0 }}>{c.title}</h2>
              <p className="small muted" style={{ margin: '0.25rem 0 0' }}>{c.blurb}</p>
              {c.stats && (
                <p className="small" style={{ margin: '0.35rem 0 0' }}>
                  You&apos;ve answered {c.stats.total} · {Math.round((c.stats.correct / c.stats.total) * 100)}% correct
                </p>
              )}
            </div>
            <div className="row">
              <Link href={c.practice} className="btn btn-primary">Practise</Link>
              <Link href={c.study} className="btn">Study guide</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
