import { getSession } from '@/lib/auth';
import { MAX_UPLOAD_BYTES } from '@/lib/community';
import { getLeaf } from '@/lib/leaf';
import { identifyLeaf, IdentifyError } from '@/lib/plantnet';

// Pl@ntNet's free plan has a small daily quota shared by the whole site, so cap each user.
const PER_HOUR = 20;
const recent = new Map<string, number[]>();

function allow(userId: string): boolean {
  const cutoff = Date.now() - 3_600_000;
  const times = (recent.get(userId) ?? []).filter((t) => t > cutoff);
  if (times.length >= PER_HOUR) return false;
  times.push(Date.now());
  recent.set(userId, times);
  return true;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Please sign in first' }, { status: 401 });
  if (!allow(session.user.id)) {
    return Response.json({ error: 'Too many identifications — try again in a bit' }, { status: 429 });
  }

  const file = (await req.formData()).get('photo');
  if (!(file instanceof File)) return Response.json({ error: 'A photo is required' }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: 'Image is larger than 8 MB' }, { status: 413 });

  try {
    const { species } = await getLeaf();
    return Response.json(await identifyLeaf(file, species));
  } catch (e) {
    const status = e instanceof IdentifyError ? e.status : 500;
    if (status === 500) console.error('identify failed', e);
    return Response.json({ error: status === 500 ? 'Identification failed' : (e as Error).message }, { status });
  }
}
