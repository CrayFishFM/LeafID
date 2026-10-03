import { getSession } from '@/lib/auth';
import { createSubmission, MAX_UPLOAD_BYTES } from '@/lib/community';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Please sign in first' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('photo');
  const species = form.get('species');
  const note = form.get('note');
  if (!(file instanceof File) || typeof species !== 'string') {
    return Response.json({ error: 'A photo and a species are required' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: 'Image is larger than 8 MB' }, { status: 413 });

  try {
    const approve = form.get('approve') === '1' && session.user.role === 'admin';
    const id = await createSubmission(
      session.user.id,
      species,
      Buffer.from(await file.arrayBuffer()),
      typeof note === 'string' ? note.trim() : null,
      // Only admins may skip the crowd; the role is checked here, not trusted from the form.
      approve,
    );
    return Response.json({ id, approved: approve });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
