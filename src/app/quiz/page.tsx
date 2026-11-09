import Link from 'next/link';
import { Quiz } from '@/components/Quiz';
import { GuestGate } from '@/components/GuestGate';
import { ScopeTabs, scopeTitle } from '@/components/quiz/ScopeTabs';
import { getUser } from '@/lib/auth';
import { isScope, nextQuestion } from '@/lib/quiz';
import { getLeaf } from '@/lib/leaf';

export const metadata = { title: 'Practice' };

export default async function QuizPage(props: PageProps<'/quiz'>) {
  const leaf = await getLeaf();
  const user = await getUser();
  if (!user) return <GuestGate />;
  const { scope: raw } = await props.searchParams;
  const scope = isScope(leaf, raw) ? raw : 'all';
  const initial = await nextQuestion(user.id, scope);
  const groups = Object.fromEntries(Object.entries(leaf.groups).map(([id, g]) => [id, g.label]));

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow">Tree ID · Practice · <Link href="/learn">Field guide</Link></p>
        <h1>{scopeTitle(scope, groups, 'All species')}</h1>
        <p className="muted small" style={{ margin: 0 }}>
          Broadleaf trees by their leaves. <Link href="/quizzes/conifers">Conifers are in their own quiz →</Link>
        </p>
      </div>
      <ScopeTabs base="/quiz" scope={scope} groups={groups} allLabel="All species" />
      <Quiz key={scope} scope={scope} initial={initial} />
    </div>
  );
}
