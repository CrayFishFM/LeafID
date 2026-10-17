import Link from 'next/link';
import { GuestGate } from '@/components/GuestGate';
import { StudyDetail, StudySummary, type GuideOutline } from '@/components/study/StudyProgress';
import { COURSES } from '@/data/courses';
import { ECOLOGY } from '@/data/study/ecology';
import { FOREST_HEALTH } from '@/data/study/forest-health';
import { REMOTE_SENSING } from '@/data/study/remote-sensing';
import type { StudyGuide } from '@/data/study/types';
import { topicItem, type Topic } from '@/data/topics';
import { getActivity } from '@/lib/activity';
import { getUser } from '@/lib/auth';
import { getLeaf } from '@/lib/leaf';
import { getProgress, type Level } from '@/lib/progress';
import { contrastTip, suggestionsFor, type Suggestion } from '@/lib/suggestions';
import { getGradeProgress, getTopicProgress, isGraded, type TopicProgress } from '@/lib/topic-quiz';
import { listTopics } from '@/lib/topics';

export const metadata = { title: 'Progress' };

const LEVEL_CHIP: Record<Level, string> = { new: '', struggling: 'chip-bad', learning: 'chip-warn', mastered: 'chip-ok' };
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

/** Each course's midterm study guide, if it has one. */
const GUIDES: Record<string, { guide: StudyGuide; href: string }> = {
  'forest-health': { guide: FOREST_HEALTH, href: '/courses/forest-health' },
  ecology: { guide: ECOLOGY, href: '/courses/ecology' },
  'remote-sensing': { guide: REMOTE_SENSING, href: '/courses/remote-sensing' },
};

/** Only the questions go to the browser; the Progress page doesn't need the answers. */
function outline(courseId: string): GuideOutline | null {
  const g = GUIDES[courseId];
  if (!g) return null;
  const title = COURSES.find((c) => c.id === courseId)?.title ?? courseId;
  return {
    id: g.guide.id, title, href: g.href,
    sections: g.guide.sections.map((name) => ({ name, questions: g.guide.cards.filter((c) => c.section === name).map((c) => c.q) })),
  };
}

const weakestFirst = (p: TopicProgress) =>
  [...p.items].sort((a, b) => (a.attempts === 0 ? 1 : b.attempts === 0 ? -1 : a.mastery - b.mastery));

/** Suggestions for the photo quizzes outside leaf ID: weak items, mix-ups, ratings, not started. */
function topicSuggestions(topic: Topic, p: TopicProgress, grade: TopicProgress | null): Suggestion[] {
  const out: Suggestion[] = [];
  const base = `/quizzes/${topic.id}`;
  if (p.total === 0) {
    out.push({ title: `Start the ${topic.title.toLowerCase()} quiz`, body: topic.blurb, href: base, cta: 'Start practising' });
    return out;
  }
  const weak = p.items.filter((s) => s.attempts >= 2 && s.mastery < 0.5).sort((a, b) => a.mastery - b.mastery).slice(0, 3);
  if (weak.length) {
    out.push({
      title: `${topic.short}: review ${weak.map((s) => topicItem(topic, s.id)?.name).join(', ')}`,
      body: weak.map((s) => { const i = topicItem(topic, s.id)!; return `${i.name}: ${i.tips[0]}`; }).join(' · '),
      href: `${base}/study#${weak[0].id}`,
      cta: 'Open the study guide',
    });
  }
  const c = p.confusions.find((x) => x.count >= 2);
  const a = c && topicItem(topic, c.item), b = c && topicItem(topic, c.chosen);
  if (c && a && b) {
    out.push({
      title: `You've taken ${a.name.toLowerCase()} for ${b.name.toLowerCase()} ${c.count} times`,
      body: `${a.name}: ${a.tips[0]} ${b.name}: ${b.tips[0]}`,
      href: `${base}/study#${a.id}`,
      cta: 'Compare them',
    });
  }
  if (grade && grade.total >= 5 && grade.correct / grade.total < 0.7) {
    out.push({
      title: `Severity and AGS/UGS: ${pct(grade.correct, grade.total)}% right`,
      body: 'Major is always UGS, minor is always AGS, and moderate can go either way. Watch the exceptions: mossy top, black knot, fluxing seam and beech bark disease.',
      href: `${base}/grade`,
      cta: 'Practise rating',
    });
  }
  return out;
}

function SuggestionGrid({ items }: { items: Suggestion[] }) {
  if (items.length === 0) return null;
  return (
    <section className="stack">
      <h2 style={{ margin: 0 }}>How to improve</h2>
      <div className="grid grid-2">
        {items.map((s) => (
          <div key={s.title} className="card suggestion">
            <h3>{s.title}</h3>
            <p className="muted small">{s.body}</p>
            {s.href && <Link href={s.href} className="btn btn-sm">{s.cta}</Link>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats({ items }: { items: { value: React.ReactNode; label: string }[] }) {
  return (
    <div className="stats">
      {items.map((s) => <div key={s.label} className="stat"><div className="value">{s.value}</div><div className="label">{s.label}</div></div>)}
    </div>
  );
}

/** Mastery per item (weakest first) and the most common mix-ups for a photo quiz. */
function TopicDetail({ topic, p, title }: { topic: Topic; p: TopicProgress; title: string }) {
  const mastered = p.items.filter((i) => i.level === 'mastered').length;
  const base = `/quizzes/${topic.id}`;
  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <section className="card">
        <h2>{title}</h2>
        <p className="small muted">
          {p.total ? `${pct(p.correct, p.total)}% correct over ${p.total} answers · ` : ''}{mastered} of {topic.items.length} mastered
        </p>
        <div className="mastery-list">
          {weakestFirst(p).map((s) => {
            const it = topicItem(topic, s.id);
            if (!it) return null;
            return (
              <Link key={s.id} href={`${base}/study#${s.id}`} className="mastery-row" style={{ gridTemplateColumns: 'minmax(0, 11rem) 1fr auto' }}>
                <span className="who"><strong>{it.name}</strong>{it.aka && <span>{it.aka}</span>}</span>
                <span className="meter" title={`${Math.round(s.mastery * 100)}% mastery`}><span style={{ width: `${Math.round(s.mastery * 100)}%` }} /></span>
                <span className={`chip ${LEVEL_CHIP[s.level]}`}>{s.attempts ? `${s.correct}/${s.attempts}` : 'new'}</span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="card stack">
        <h2 style={{ margin: 0 }}>Most confused</h2>
        {p.confusions.length === 0 ? (
          <p className="muted small" style={{ margin: 0 }}>No mix-ups yet.</p>
        ) : (
          p.confusions.slice(0, 6).map((c) => {
            const a = topicItem(topic, c.item), b = topicItem(topic, c.chosen);
            if (!a || !b) return null;
            return (
              <div key={`${c.item}>${c.chosen}`}>
                <div className="row" style={{ gap: '0.4rem' }}>
                  <span className="chip chip-code">{a.name}</span>
                  <span className="small muted">answered as</span>
                  <span className="chip">{b.name}</span>
                  <span className="small muted">× {c.count}</span>
                </div>
                <p className="small" style={{ margin: '0.35rem 0 0' }}>{a.name}: {a.tips[0]}</p>
              </div>
            );
          })
        )}
        <div className="row">
          <Link href={base} className="btn btn-sm btn-primary">Practise</Link>
          <Link href={`${base}?scope=weak`} className="btn btn-sm">My weak spots</Link>
        </div>
      </section>
    </div>
  );
}

export default async function ProgressPage(props: PageProps<'/progress'>) {
  const user = await getUser();
  if (!user) return <GuestGate />;
  const { course: raw } = await props.searchParams;
  const tabs = [{ id: 'all', label: 'All courses' }, ...COURSES.map((c) => ({ id: c.id, label: c.title }))];
  const tab = tabs.some((t) => t.id === raw) ? (raw as string) : 'all';

  const [leaf, p, activity, topics] = await Promise.all([getLeaf(), getProgress(user.id), getActivity(user.id), listTopics()]);
  const topicStats = await Promise.all(topics.map(async (topic) => ({
    topic,
    progress: await getTopicProgress(user.id, topic),
    grade: isGraded(topic) ? await getGradeProgress(user.id, topic) : null,
  })));
  const statFor = (courseId: string) => {
    const ids = COURSES.find((c) => c.id === courseId)?.topics ?? [];
    return topicStats.filter((t) => ids.includes(t.topic.id));
  };
  const leafMastered = p.species.filter((s) => s.level === 'mastered').length;

  return (
    <div className="stack" style={{ gap: '1.75rem' }}>
      <div>
        <p className="eyebrow">Progress</p>
        <h1>{user.isAnonymous ? 'Your progress' : `${user.name}'s progress`}</h1>
      </div>

      {user.isAnonymous && (
        <div className="card suggestion row" style={{ justifyContent: 'space-between' }}>
          <div>
            <strong>You&apos;re practising as a guest.</strong>
            <p className="small muted" style={{ margin: 0 }}>
              Your progress is saved in this browser only. Create an account or sign in with Discord to keep it on every device.
            </p>
          </div>
          <div className="row">
            <Link href="/sign-up" className="btn btn-sm btn-primary">Create account</Link>
            <Link href="/sign-in" className="btn btn-sm">Sign in</Link>
          </div>
        </div>
      )}

      <nav className="segmented" aria-label="Course">
        {tabs.map((t) => (
          <Link key={t.id} href={t.id === 'all' ? '/progress' : `/progress?course=${t.id}`} aria-current={tab === t.id}>{t.label}</Link>
        ))}
      </nav>

      {tab === 'all' && (
        <>
          <Stats items={[
            { value: activity.total, label: 'questions answered, all quizzes' },
            { value: `${pct(activity.correct, activity.total)}%`, label: 'overall accuracy' },
            { value: activity.last7.total ? `${pct(activity.last7.correct, activity.last7.total)}%` : '—', label: `last 7 days (${activity.last7.total} answered)` },
            { value: activity.dayStreak, label: 'day streak' },
          ]} />

          <section className="stack">
            <h2 style={{ margin: 0 }}>By course</h2>
            <div className="grid grid-2">
              {COURSES.map((c) => {
                const guide = outline(c.id);
                const quizzes = statFor(c.id);
                return (
                  <article key={c.id} className="card stack" style={{ gap: '0.6rem' }}>
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ margin: 0 }}>{c.title}</h3>
                      <span className="small muted">{c.subject}</span>
                    </div>
                    {c.id === 'dendrology' && (
                      <div className="stack" style={{ gap: '0.35rem' }}>
                        <div className="row" style={{ gap: '0.5rem' }}>
                          <span className="meter" style={{ flex: 1, minWidth: 80 }}><span style={{ width: `${pct(leafMastered, p.species.length)}%` }} /></span>
                          <span className="small muted">{leafMastered} / {p.species.length} species mastered</span>
                        </div>
                        <span className="small muted">{p.total ? `Leaf ID: ${pct(p.correct, p.total)}% correct over ${p.total} answers` : 'Leaf ID: not started yet'}</span>
                      </div>
                    )}
                    {quizzes.map(({ topic, progress, grade }) => {
                      const mastered = progress.items.filter((i) => i.level === 'mastered').length;
                      return (
                        <div key={topic.id} className="stack" style={{ gap: '0.35rem' }}>
                          <div className="row" style={{ gap: '0.5rem' }}>
                            <span className="meter" style={{ flex: 1, minWidth: 80 }}><span style={{ width: `${pct(mastered, topic.items.length)}%` }} /></span>
                            <span className="small muted">{mastered} / {topic.items.length} {topic.noun}s mastered</span>
                          </div>
                          <span className="small muted">
                            {progress.total ? `${topic.short} ID: ${pct(progress.correct, progress.total)}% correct over ${progress.total} answers` : `${topic.short} ID: not started yet`}
                            {grade && (grade.total ? ` · Rating: ${pct(grade.correct, grade.total)}% right over ${grade.total}` : ' · Rating: not started')}
                          </span>
                        </div>
                      );
                    })}
                    {guide && <StudySummary guide={guide} />}
                    <div className="row" style={{ marginTop: 'auto' }}>
                      <Link href={`/progress?course=${c.id}`} className="btn btn-sm">Details</Link>
                      <Link href={c.links[0].href} className="btn btn-sm btn-ghost">{c.links[0].label} →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <SuggestionGrid items={[
            ...suggestionsFor(leaf, p).slice(0, 2),
            ...topicStats.flatMap((t) => topicSuggestions(t.topic, t.progress, t.grade).slice(0, 2)),
          ]} />
        </>
      )}

      {tab === 'dendrology' && (
        <>
          <Stats items={[
            { value: p.total, label: 'leaf questions answered' },
            { value: `${pct(p.correct, p.total)}%`, label: 'accuracy' },
            { value: p.last7.total ? `${pct(p.last7.correct, p.last7.total)}%` : '—', label: `last 7 days (${p.last7.total} answered)` },
            { value: <>{leafMastered}<span className="muted small"> / {p.species.length}</span></>, label: 'species mastered' },
          ]} />
          <SuggestionGrid items={suggestionsFor(leaf, p)} />
          <div className="grid grid-2">
            <section className="card">
              <h2>Mastery by species</h2>
              <div className="mastery-list">
                {[...p.species].sort((a, b) => (a.attempts === 0 ? 1 : b.attempts === 0 ? -1 : a.mastery - b.mastery)).map((s) => {
                  const sp = leaf.byId[s.id];
                  return (
                    <Link key={s.id} href={`/learn/${s.id}`} className="mastery-row">
                      <span className="who"><strong>{sp.code}</strong>{sp.code !== sp.common && <span>{sp.common}</span>}</span>
                      <span className="meter" title={`${Math.round(s.mastery * 100)}% mastery`}><span style={{ width: `${Math.round(s.mastery * 100)}%` }} /></span>
                      <span className={`chip ${LEVEL_CHIP[s.level]}`}>{s.attempts ? `${s.correct}/${s.attempts}` : 'new'}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
            <div className="stack">
              <section className="card">
                <h2>By group</h2>
                <div className="mastery-list">
                  {p.groups.map((g) => (
                    <Link key={g.id} href={`/quiz?scope=${g.id}`} className="mastery-row" style={{ gridTemplateColumns: '1fr 5rem auto' }}>
                      <span>{leaf.groups[g.id].label}</span>
                      <span className="meter"><span style={{ width: `${pct(g.correct, g.attempts)}%` }} /></span>
                      <span className="small muted">{g.attempts ? `${pct(g.correct, g.attempts)}%` : '—'}</span>
                    </Link>
                  ))}
                </div>
              </section>
              <section className="card">
                <h2>Most confused</h2>
                {p.confusions.length === 0 ? (
                  <p className="muted small">No mix-ups yet. Keep practising!</p>
                ) : (
                  <div className="stack" style={{ gap: '0.75rem' }}>
                    {p.confusions.slice(0, 5).map((c) => (
                      <div key={`${c.species}-${c.chosen}`}>
                        <div className="row" style={{ gap: '0.4rem' }}>
                          <span className="chip chip-code">{leaf.byId[c.species].code}</span>
                          <span className="small muted">answered as</span>
                          <span className="chip">{leaf.byId[c.chosen].code}</span>
                          <span className="small muted">× {c.count}</span>
                        </div>
                        <p className="small" style={{ margin: '0.35rem 0 0' }}>{contrastTip(leaf, c.species, c.chosen)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </>
      )}

      {tab !== 'all' && tab !== 'dendrology' && (
        <>
          {statFor(tab).map(({ topic, progress, grade }) => (
            <div key={topic.id} className="stack">
              <SuggestionGrid items={topicSuggestions(topic, progress, grade)} />
              <TopicDetail topic={topic} p={progress} title={`${topic.title}: identification`} />
              {grade && (
                <section className="card stack">
                  <div>
                    <h2 style={{ margin: 0 }}>Severity &amp; AGS / UGS</h2>
                    <p className="small muted" style={{ margin: 0 }}>
                      {grade.total ? `${pct(grade.correct, grade.total)}% rated right over ${grade.total} ratings (from both quiz modes)` : 'No ratings yet.'}
                    </p>
                  </div>
                  {grade.total > 0 && (
                    <div className="mastery-list">
                      {weakestFirst(grade).filter((s) => s.attempts > 0).slice(0, 8).map((s) => {
                        const it = topicItem(topic, s.id);
                        if (!it) return null;
                        return (
                          <Link key={s.id} href={`/quizzes/${topic.id}/study#${s.id}`} className="mastery-row" style={{ gridTemplateColumns: 'minmax(0, 11rem) 1fr auto' }}>
                            <span className="who"><strong>{it.name}</strong></span>
                            <span className="meter"><span style={{ width: `${Math.round(s.mastery * 100)}%` }} /></span>
                            <span className={`chip ${LEVEL_CHIP[s.level]}`}>{s.correct}/{s.attempts}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  <Link href={`/quizzes/${topic.id}/grade`} className="btn btn-sm btn-primary" style={{ alignSelf: 'flex-start' }}>Practise rating</Link>
                </section>
              )}
            </div>
          ))}
          {outline(tab) && (
            <section className="stack">
              <h2 style={{ margin: 0 }}>Midterm review</h2>
              <StudyDetail guide={outline(tab)!} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
