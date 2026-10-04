import Link from 'next/link';
import { LeafGroupsEditor, SpeciesEditor } from '@/components/admin/SpeciesEditors';
import { SPECIES_SEED } from '@/data/species';
import { requireAdmin } from '@/lib/auth';
import { getLeaf } from '@/lib/leaf';
import { libraryPhotos } from '@/lib/photos';

export const metadata = { title: 'Admin · Species' };

const when = (ts: number) => new Date(ts).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });

export default async function AdminSpecies() {
  await requireAdmin();
  const [leaf, photos] = await Promise.all([getLeaf(), libraryPhotos()]);
  const others = leaf.species.map((s) => ({ id: s.id, label: s.code === s.common ? s.common : `${s.code} · ${s.common}` }));

  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <p className="small muted" style={{ margin: 0 }}>
        Fix codes, names and ID notes for the leaf species. Changes show up in the field guide, quiz, hints and
        suggestions straight away. Photos are managed under <Link href="/admin/photos">Photos</Link> and{' '}
        <Link href="/admin/reports">Reports</Link>.
      </p>
      <LeafGroupsEditor initial={leaf.groups} />
      <h2 style={{ margin: '0.5rem 0 0' }}>{leaf.species.length} species</h2>
      {leaf.species.map((s) => (
        <SpeciesEditor
          key={s.id}
          species={s}
          photo={photos.find((p) => p.species === s.id)?.url ?? null}
          groups={leaf.groups}
          others={others.filter((o) => o.id !== s.id)}
          edited={s.updatedAt ? `Edited by ${s.updatedBy ?? 'a deleted user'} · ${when(s.updatedAt)}` : null}
          canReset={SPECIES_SEED.some((x) => x.id === s.id)}
        />
      ))}
    </div>
  );
}
