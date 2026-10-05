import Link from 'next/link';
import { LeafKey } from '@/components/LeafKey';
import { libraryPhotos } from '@/lib/photos';

export const metadata = { title: 'Leaf key' };

export default async function LeafKeyPage() {
  const photos: Record<string, string> = {};
  for (const p of await libraryPhotos()) photos[p.species] ??= p.url;

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <Link href="/learn" className="small">← Field guide</Link>
        <p className="eyebrow" style={{ marginTop: '0.5rem' }}>Leaf key</p>
        <h1>Identify a leaf step by step</h1>
        <p className="muted">Answer one question at a time about the leaf in front of you. Each answer narrows down the species — tap &ldquo;Not sure&rdquo; to skip any you can&apos;t tell.</p>
      </div>
      <LeafKey photos={photos} />
    </div>
  );
}
