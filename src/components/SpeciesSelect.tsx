'use client';

import { useLeaf } from './LeafProvider';

export function SpeciesSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const leaf = useLeaf();
  return (
    <select className="input" {...props}>
      <option value="">Choose a species…</option>
      {Object.keys(leaf.groups).map((g) => (
        <optgroup key={g} label={leaf.groups[g].label}>
          {leaf.species.filter((s) => s.group === g).map((s) => (
            <option key={s.id} value={s.id}>
              {s.code === s.common ? s.common : `${s.code} — ${s.common}`}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
