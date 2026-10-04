import Link from 'next/link';
import { Quiz } from '@/components/Quiz';
import { GuestGate } from '@/components/GuestGate';
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

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow">Practice</p>
        <h1>{scope === 'all' ? 'All species' : scope === 'weak' ? 'My weak spots' : leaf.groups[scope].label}</h1>
      </div>
      <div className="segmented">
        <Link href="/quiz?scope=all" aria-current={scope === 'all'}>All species</Link>
        <Link href="/quiz?scope=weak" aria-current={scope === 'weak'}>My weak spots</Link>
        {Object.keys(leaf.groups).map((g) => (
          <Link key={g} href={`/quiz?scope=${g}`} aria-current={scope === g}>{leaf.groups[g].label}</Link>
        ))}
      </div>
      <Quiz key={scope} scope={scope} initial={initial} />
    </div>
  );
}
