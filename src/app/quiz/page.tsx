import Link from 'next/link';
import { Quiz } from '@/components/Quiz';
import { GROUPS, type GroupId } from '@/data/species';
import { requireUser } from '@/lib/auth';
import { isScope, nextQuestion } from '@/lib/quiz';

export const metadata = { title: 'Practice' };

export default async function QuizPage(props: PageProps<'/quiz'>) {
  const user = await requireUser();
  const { scope: raw } = await props.searchParams;
  const scope = isScope(raw) ? raw : 'all';
  const initial = await nextQuestion(user.id, scope);

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow">Practice</p>
        <h1>{scope === 'all' ? 'All species' : scope === 'weak' ? 'My weak spots' : GROUPS[scope].label}</h1>
      </div>
      <div className="segmented">
        <Link href="/quiz?scope=all" aria-current={scope === 'all'}>All species</Link>
        <Link href="/quiz?scope=weak" aria-current={scope === 'weak'}>My weak spots</Link>
        {(Object.keys(GROUPS) as GroupId[]).map((g) => (
          <Link key={g} href={`/quiz?scope=${g}`} aria-current={scope === g}>{GROUPS[g].label}</Link>
        ))}
      </div>
      <Quiz key={scope} scope={scope} initial={initial} />
    </div>
  );
}
