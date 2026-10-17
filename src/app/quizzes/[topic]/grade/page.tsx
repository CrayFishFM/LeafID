import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GradeQuiz } from '@/components/GradeQuiz';
import { GuestGate } from '@/components/GuestGate';
import { clientItem } from '@/data/topics';
import { getUser } from '@/lib/auth';
import { isGraded, nextGradeQuestion } from '@/lib/topic-quiz';
import { getTopic } from '@/lib/topics';

export async function generateMetadata(props: PageProps<'/quizzes/[topic]/grade'>) {
  const topic = await getTopic((await props.params).topic);
  return { title: topic ? `${topic.title}: severity & AGS/UGS` : 'Quiz' };
}

export default async function TopicGradePage(props: PageProps<'/quizzes/[topic]/grade'>) {
  const topic = await getTopic((await props.params).topic);
  if (!topic || !isGraded(topic)) notFound();
  const user = await getUser();
  if (!user) return <GuestGate />;
  const initial = await nextGradeQuestion(user.id, topic);
  const base = `/quizzes/${topic.id}`;

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Severity &amp; AGS/UGS</p>
        <h1>Rate the {topic.noun}</h1>
        <p className="muted small" style={{ margin: 0 }}>
          Each {topic.noun} is named for you. Say how serious it is and whether the tree is acceptable (AGS) or
          unacceptable (UGS) growing stock. <Link href={`${base}/study#grading`}>Review the rules →</Link>
        </p>
      </div>
      <div className="segmented">
        <Link href={base}>Identify &amp; rate</Link>
        <Link href={`${base}/grade`} aria-current>Rate only</Link>
      </div>
      <GradeQuiz topicId={topic.id} items={topic.items.map(clientItem)} initial={initial} />
    </div>
  );
}
