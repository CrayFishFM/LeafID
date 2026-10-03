import fs from 'node:fs/promises';
import { submissionFile } from '@/lib/community';

export async function GET(_req: Request, ctx: RouteContext<'/api/photos/[id]'>) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response('Not found', { status: 404 });
  const found = await submissionFile(id);
  if (!found) return new Response('Not found', { status: 404 });
  try {
    const body = await fs.readFile(found.file);
    return new Response(body, {
      headers: {
        'Content-Type': found.mime,
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
