import { submissionImage } from '@/lib/community';

export async function GET(_req: Request, ctx: RouteContext<'/api/photos/[id]'>) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response('Not found', { status: 404 });
  const image = await submissionImage(id);
  if (!image) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.mime,
      // A submission's photo never changes, so browsers can keep it.
      'Cache-Control': 'public, max-age=86400, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
