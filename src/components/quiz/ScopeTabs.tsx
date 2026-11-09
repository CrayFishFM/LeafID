import Link from 'next/link';

/** "Everything", "My weak spots" and one tab per group: the scopes every photo quiz offers. */
export function ScopeTabs({ base, scope, groups, allLabel }: {
  base: string;
  scope: string;
  /** Group id → label. */
  groups: Record<string, string>;
  allLabel: string;
}) {
  const tabs: [string, string][] = [['all', allLabel], ['weak', 'My weak spots'], ...Object.entries(groups)];
  return (
    <div className="segmented">
      {tabs.map(([id, label]) => (
        <Link key={id} href={`${base}?scope=${id}`} aria-current={scope === id}>{label}</Link>
      ))}
    </div>
  );
}

/** The heading for a scope: the group's name, or the "all" / weak-spots label. */
export const scopeTitle = (scope: string, groups: Record<string, string>, allLabel: string) =>
  scope === 'all' ? allLabel : scope === 'weak' ? 'My weak spots' : groups[scope];
