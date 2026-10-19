import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ZoomPhoto } from '@/components/ZoomPhoto';
import type { Rating, Severity } from '@/data/topics/types';
import { itemLabel, topicImageUrl, topicItem } from '@/data/topics';
import { getUser } from '@/lib/auth';
import { LEVEL_CHIP } from '@/lib/levels';
import { ratingLabel, SEVERITIES, SEVERITY_LABEL, SEVERITY_RULE } from '@/lib/grading';
import { getTopicProgress, hasPairs, isGraded } from '@/lib/topic-quiz';
import { getTopic } from '@/lib/topics';

const SEVERITY_CHIP: Record<Severity, string> = { minor: 'chip-ok', moderate: 'chip-warn', major: 'chip-bad' };

/** "Major · UGS", or each case when the rating depends on a condition. */
const ratingText = (rs: Rating[]) =>
  rs.length === 1 && !rs[0].when ? ratingLabel(rs[0]) : rs.map((r) => (r.when ? `${r.when}: ${ratingLabel(r)}` : ratingLabel(r))).join(' · ');

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
        <p className="eyebrow"><Link href="/courses">Courses</Link> · Study guide</p>
        <h1>{topic.title}</h1>
        <p className="muted">What to look for in each {topic.noun}. When you&apos;re ready, test yourself.</p>
        <div className="row">
          <Link href={`/quizzes/${topic.id}`} className="btn btn-primary">Practise {topic.short.toLowerCase()}</Link>
          {isGraded(topic) && <Link href={`/quizzes/${topic.id}/grade`} className="btn">Practise severity &amp; AGS/UGS</Link>}
          {hasPairs(topic) && <Link href={`/quizzes/${topic.id}/pairs`} className="btn">Practise male &amp; female together</Link>}
        </div>
      </div>

      {isGraded(topic) && (
        <section id="grading" className="card stack study-card">
          <div>
            <h2 style={{ margin: 0 }}>Grading {topic.noun}s: severity and AGS / UGS</h2>
            <p className="small muted" style={{ margin: 0 }}>From the Forest Health course and the Ontario Tree Marking Guide (p. 66). Many trees have more than one {topic.noun}.</p>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th scope="col">Class</th><th scope="col">Meaning</th></tr></thead>
              <tbody>
                <tr><td><strong>AGS</strong> — Acceptable Growing Stock</td><td>Form and appearance suggest it can reasonably be expected to maintain and/or improve its quality, and contribute vigorous, high-quality stems to future crops (likely to keep growing for another ~20 years).</td></tr>
                <tr><td><strong>UGS</strong> — Unacceptable Growing Stock</td><td>High risk: expected to decline during the next cutting cycle (likely to die in the next 20–25 years), so it can be harvested. May also be of poor form or low quality that can&apos;t be expected to improve.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-3">
            {SEVERITIES.slice().reverse().map((sev) => (
              <div key={sev} className="stack" style={{ gap: '0.4rem' }}>
                <div className="row" style={{ gap: '0.4rem' }}>
                  <span className={`chip ${SEVERITY_CHIP[sev]}`}>{SEVERITY_LABEL[sev]}</span>
                  <strong className="small">{sev === 'major' ? 'Always UGS' : sev === 'minor' ? 'Always AGS' : 'Either way'}</strong>
                </div>
                <p className="small muted" style={{ margin: 0 }}>{SEVERITY_RULE[sev]}</p>
                <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
                  {topic.items.filter((i) => i.ratings?.some((r) => r.severity === sev)).map((i) => {
                    const r = i.ratings!.find((x) => x.severity === sev)!;
                    return <li key={i.id}><a href={`#${i.id}`}>{i.name}</a>{r.when && <span className="muted"> ({r.when.toLowerCase()})</span>}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

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
                      {i.ratings?.length === 1 && !i.ratings[0].when && (
                        <span className={`chip ${SEVERITY_CHIP[i.ratings[0].severity]}`}>{ratingLabel(i.ratings[0])}</span>
                      )}
                      {st && <span className={`chip ${LEVEL_CHIP[st.level]}`}>{st.attempts ? `${st.correct}/${st.attempts}` : 'new'}</span>}
                    </div>
                  </div>
                  <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
                    {i.tips.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  {i.ratings && (i.ratings.length > 1 || i.ratings[0].when || i.ratings.some((r) => r.note)) && (
                    <p className="small" style={{ margin: 0 }}>
                      <strong>Rating:</strong> {ratingText(i.ratings)}
                      {[...new Set(i.ratings.map((r) => r.note).filter(Boolean))].map((n) => <span key={n} className="muted"> {n}</span>)}
                    </p>
                  )}
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
