import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuestGate } from '@/components/GuestGate';
import { TopicQuiz } from '@/components/TopicQuiz';
import { getUser } from '@/lib/auth';
import { getTopic } from '@/lib/topics';
import type { TopicItem } from '@/data/topics';
import { isTopicScope, nextTopicQuestion } from '@/lib/topic-quiz';

/** Drop the photo list so the answer to each photo is not sent to the browser. */
const toClientItem = (i: TopicItem) => ({ id: i.id, name: i.name, aka: i.aka, note: i.note, scientific: i.scientific, group: i.group, tips: i.tips, lookalikes: i.lookalikes });

export async function generateMetadata(props: PageProps<'/quizzes/[topic]'>) {
  const topic = await getTopic((await props.params).topic);
  return { title: topic ? `${topic.title} practice` : 'Quiz' };
}

export default async function TopicPracticePage(props: PageProps<'/quizzes/[topic]'>) {
  const topic = await getTopic((await props.params).topic);
  if (!topic) notFound();
  const user = await getUser();
  if (!user) return <GuestGate />;

  const { scope: raw } = await props.searchParams;
  const scope = isTopicScope(topic, raw) ? raw : 'all';
  const initial = await nextTopicQuestion(user.id, topic, scope);
  const base = `/quizzes/${topic.id}`;

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow"><Link href="/quizzes">Quizzes</Link> · Practice</p>
        <h1>{topic.title}</h1>
        <p className="muted small" style={{ margin: 0 }}>
          From the {topic.source}. <Link href={`${base}/study`}>Open the study guide →</Link>
        </p>
      </div>
      <div className="segmented">
        <Link href={`${base}?scope=all`} aria-current={scope === 'all'}>Everything</Link>
        <Link href={`${base}?scope=weak`} aria-current={scope === 'weak'}>My weak spots</Link>
        {Object.entries(topic.groups).map(([id, label]) => (
          <Link key={id} href={`${base}?scope=${id}`} aria-current={scope === id}>{label}</Link>
        ))}
      </div>
      <TopicQuiz
        key={scope}
        topicId={topic.id}
        question={topic.question}
        scope={scope}
        items={topic.items.map(toClientItem)}
        initial={initial}
      />
    </div>
  );
}
