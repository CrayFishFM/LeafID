import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ZoomPhoto } from '@/components/ZoomPhoto';
import { itemLabel, topicImageUrl, topicItem } from '@/data/topics';
import { getUser } from '@/lib/auth';
import type { Level } from '@/lib/progress';
import { getTopicProgress } from '@/lib/topic-quiz';
import { getTopic } from '@/lib/topics';

const LEVEL_CHIP: Record<Level, string> = { new: '', struggling: 'chip-bad', learning: 'chip-warn', mastered: 'chip-ok' };

export async function generateMetadata(props: PageProps<'/quizzes/[topic]/study'>) {
  const topic = await getTopic((await props.params).topic);
  return { title: topic ? `${topic.title} study guide` : 'Study guide' };
}

export default async function TopicStudyPage(props: PageProps<'/quizzes/[topic]/study'>) {
  const topic = await getTopic((await props.params).topic);
  if (!topic) notFound();
  const user = await getUser();
  const progress = user ? await getTopicProgress(user.id, topic) : null;
  const stats = new Map(progress?.items.map((s) => [s.id, s]));
  const mixups = progress?.confusions.slice(0, 5) ?? [];

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow"><Link href="/quizzes">Quizzes</Link> · Study guide</p>
        <h1>{topic.title}</h1>
        <p className="muted">What to look for in each {topic.noun}. When you&apos;re ready, test yourself.</p>
        <Link href={`/quizzes/${topic.id}`} className="btn btn-primary">Practise {topic.short.toLowerCase()}</Link>
      </div>

      {mixups.length > 0 && (
        <section className="card stack">
          <h2 style={{ margin: 0 }}>Your most common mix-ups</h2>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {mixups.map((c) => {
              const a = topicItem(topic, c.item), b = topicItem(topic, c.chosen);
              if (!a || !b) return null;
              return (
                <li key={`${c.item}>${c.chosen}`}>
                  <a href={`#${a.id}`}>{a.name}</a> taken for <a href={`#${b.id}`}>{b.name}</a> ({c.count}×)
                </li>
              );
            })}
          </ul>
          <Link href={`/quizzes/${topic.id}?scope=weak`} className="btn btn-sm" style={{ alignSelf: 'flex-start' }}>Practise my weak spots</Link>
        </section>
      )}

      {Object.entries(topic.groups).map(([gid, label]) => (
        <section key={gid} className="stack">
          <h2 style={{ margin: 0 }}>{label}</h2>
          <div className="grid grid-2">
            {topic.items.filter((i) => i.group === gid).map((i) => {
              const st = stats.get(i.id);
              return (
                <article key={i.id} id={i.id} className="card stack study-card">
                  {i.images.map((f) => (
                    <ZoomPhoto key={f} className="photo photo-contain" src={topicImageUrl(topic, f)} alt={itemLabel(i)} loading="lazy" />
                  ))}
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{i.name}</h3>
                      {(i.aka || i.scientific) && (
                        <div className="small muted">
                          {i.aka}{i.aka && i.scientific && ' · '}{i.scientific && <em>{i.scientific}</em>}
                        </div>
                      )}
                    </div>
                    <div className="row" style={{ gap: '0.35rem' }}>
                      {i.note && <span className="chip">{i.note}</span>}
                      {st && <span className={`chip ${LEVEL_CHIP[st.level]}`}>{st.attempts ? `${st.correct}/${st.attempts}` : 'new'}</span>}
                    </div>
                  </div>
                  <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
                    {i.tips.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  {i.lookalikes.length > 0 && (
                    <p className="small muted" style={{ margin: 0 }}>
                      Don&apos;t confuse with:{' '}
                      {i.lookalikes.map((id, n) => {
                        const l = topicItem(topic, id);
                        return l && <span key={id}>{n > 0 && ', '}<a href={`#${id}`}>{l.name}</a></span>;
                      })}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
