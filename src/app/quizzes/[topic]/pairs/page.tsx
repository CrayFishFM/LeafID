import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuestGate } from '@/components/GuestGate';
import { PairQuiz } from '@/components/PairQuiz';
import { getUser } from '@/lib/auth';
import { clientPairs, hasPairs, nextPairQuestion } from '@/lib/topic-quiz';
import { getTopic } from '@/lib/topics';

export async function generateMetadata(props: PageProps<'/quizzes/[topic]/pairs'>) {
  const topic = await getTopic((await props.params).topic);
  return { title: topic ? `${topic.title}: male & female` : 'Quiz' };
}

export default async function TopicPairsPage(props: PageProps<'/quizzes/[topic]/pairs'>) {
  const topic = await getTopic((await props.params).topic);
  if (!topic || !hasPairs(topic)) notFound();
  const user = await getUser();
  if (!user) return <GuestGate />;
  const initial = await nextPairQuestion(user.id, topic);
  const base = `/quizzes/${topic.id}`;

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Male &amp; female</p>
        <h1>{topic.title}: male &amp; female</h1>
        <p className="muted small" style={{ margin: 0 }}>
          The male and female of one species, shown together. Name the species.{' '}
          <Link href={`${base}/study`}>Open the study guide →</Link>
        </p>
      </div>
      <div className="segmented">
        <Link href={base}>One bird at a time</Link>
        <Link href={`${base}/pairs`} aria-current>Male &amp; female together</Link>
      </div>
      <PairQuiz topicId={topic.id} species={clientPairs(topic)} initial={initial} />
    </div>
  );
}
