import { GROUPS, SPECIES, type GroupId } from '@/data/species';

export function SpeciesSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className="input" {...props}>
      <option value="">Choose a species…</option>
      {(Object.keys(GROUPS) as GroupId[]).map((g) => (
        <optgroup key={g} label={GROUPS[g].label}>
          {SPECIES.filter((s) => s.group === g).map((s) => (
            <option key={s.id} value={s.id}>
              {s.code === s.common ? s.common : `${s.code} — ${s.common}`}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
