import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuestGate } from '@/components/GuestGate';
import { TopicQuiz } from '@/components/TopicQuiz';
import { getUser } from '@/lib/auth';
import { getTopic } from '@/lib/topics';
import { clientItem } from '@/data/topics';
import { hasPairs, isGraded, isTopicScope, nextTopicQuestion } from '@/lib/topic-quiz';

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
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Practice</p>
        <h1>{topic.title}</h1>
        <p className="muted small" style={{ margin: 0 }}>
          From the {topic.source}. <Link href={`${base}/study`}>Open the study guide →</Link>
        </p>
        {isGraded(topic) && (
          <p className="small" style={{ margin: '0.35rem 0 0' }}>
            After each answer you also rate the {topic.noun}: minor, moderate or major, and AGS or UGS.{' '}
            <Link href={`${base}/grade`}>Practise rating only →</Link>
          </p>
        )}
        {hasPairs(topic) && (
          <p className="small" style={{ margin: '0.35rem 0 0' }}>
            Each photo is one {topic.noun}: name the species and whether it&apos;s the male or the female.{' '}
            <Link href={`${base}/pairs`}>Practise with the male &amp; female together →</Link>
          </p>
        )}
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
        items={topic.items.map(clientItem)}
        initial={initial}
      />
    </div>
  );
}
