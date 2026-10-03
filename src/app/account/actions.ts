'use server';

import { headers } from 'next/headers';
import { auth, requireUser } from '@/lib/auth';

/** For accounts without a password yet (e.g. Discord-only). setPassword is server-only in Better Auth. */
export async function setPassword(newPassword: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireUser();
  if (user.isAnonymous) return { ok: false, error: 'Create an account first' };
  try {
    await auth.api.setPassword({ body: { newPassword }, headers: await headers() });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as { body?: { message?: string } }).body?.message ?? (e as Error).message };
  }
}
