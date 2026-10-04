import Link from 'next/link';
import { QuizItemEditor, QuizTopicEditor } from '@/components/admin/QuizEditors';
import { TOPIC_SEED, topicImageUrl } from '@/data/topics';
import { requireAdmin } from '@/lib/auth';
import { listTopics } from '@/lib/topics';

export const metadata = { title: 'Admin · Quizzes' };

const when = (ts: number) => new Date(ts).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });

export default async function AdminQuizzes(props: PageProps<'/admin/quizzes'>) {
  await requireAdmin();
  const topics = await listTopics();
  const { topic: raw } = await props.searchParams;
  const topic = topics.find((t) => t.id === raw) ?? topics[0];
  if (!topic) return <div className="card empty">No quizzes yet. They are added when the app starts.</div>;
  const seed = TOPIC_SEED.find((t) => t.id === topic.id);

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <p className="small muted" style={{ margin: 0 }}>
        Fix names, tips, groups and look-alikes for the extra quizzes. Changes show up in practice and the study guide
        straight away. Leaf species are edited under <Link href="/admin/species">Species</Link>.
      </p>
      <div className="segmented">
        {topics.map((t) => (
          <Link key={t.id} href={`/admin/quizzes?topic=${t.id}`} aria-current={t.id === topic.id}>{t.title}</Link>
        ))}
      </div>

      <QuizTopicEditor
        key={topic.id}
        topicId={topic.id}
        initial={{
          title: topic.title, short: topic.short, blurb: topic.blurb, question: topic.question,
          noun: topic.noun, source: topic.source, groups: topic.groups,
        }}
      />

      <section className="stack" style={{ gap: '0.6rem' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>{topic.items.length} items</h2>
          <Link href={`/quizzes/${topic.id}/study`} className="small">View the study guide →</Link>
        </div>
        {topic.items.map((i) => (
          <QuizItemEditor
            key={i.id}
            topicId={topic.id}
            item={i}
            imageUrls={i.images.map((f) => topicImageUrl(topic, f))}
            groups={topic.groups}
            others={topic.items.filter((o) => o.id !== i.id).map((o) => ({ id: o.id, name: o.name }))}
            edited={i.updatedAt ? `Edited by ${i.updatedBy ?? 'a deleted user'} · ${when(i.updatedAt)}` : null}
            canReset={!!seed?.items.some((s) => s.id === i.id)}
          />
        ))}
      </section>
    </div>
  );
}
