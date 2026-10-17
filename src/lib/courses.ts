import { COURSES, type Course } from '@/data/courses';
import { topicImageUrl } from '@/data/topics';
import { libraryPhotos } from './photos';
import { getProgress } from './progress';
import { topicTotals } from './topic-quiz';
import { listTopics } from './topics';

export interface CourseCardData extends Course {
  /** A photo for the card; courses without quiz photos get a drawing instead. */
  cover?: string;
  stats: { total: number; correct: number } | null;
}

/** Courses with a cover photo and, for a signed-in user, how much they have practised. */
export async function courseCards(userId?: string): Promise<CourseCardData[]> {
  const [topics, photos, totals, leaf] = await Promise.all([
    listTopics(),
    libraryPhotos(),
    userId ? topicTotals(userId) : Promise.resolve({} as Awaited<ReturnType<typeof topicTotals>>),
    userId ? getProgress(userId) : Promise.resolve(null),
  ]);
  const leafCover = photos.find((p) => p.species === 'Mh') ?? photos[0];
  const known = new Set(COURSES.flatMap((c) => c.topics ?? []));
  // A quiz topic no course lists still gets a card, so nothing goes missing.
  const extra: Course[] = topics.filter((t) => !known.has(t.id)).map((t) => ({
    id: t.id, title: t.title, subject: t.short, blurb: t.blurb, topics: [t.id],
    links: [{ label: 'Practise', href: `/quizzes/${t.id}` }, { label: 'Study guide', href: `/quizzes/${t.id}/study` }],
  }));

  return [...COURSES, ...extra].map((c) => {
    if (c.id === 'dendrology') {
      return { ...c, cover: leafCover?.url, stats: leaf?.total ? { total: leaf.total, correct: leaf.correct } : null };
    }
    if (c.photo) return { ...c, cover: photos.find((p) => p.key === c.photo)?.url, stats: null };
    const topic = topics.find((t) => c.topics?.includes(t.id));
    const first = topic?.items.find((i) => i.images.length > 0);
    const stats = (c.topics ?? []).reduce<{ total: number; correct: number } | null>((acc, id) => {
      const s = totals[id];
      return s ? { total: (acc?.total ?? 0) + s.total, correct: (acc?.correct ?? 0) + s.correct } : acc;
    }, null);
    return { ...c, cover: topic && first ? topicImageUrl(topic, first.images[0]) : undefined, stats };
  });
}
