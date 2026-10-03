'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth, requireAdmin } from '@/lib/auth';
import { adminDeleteSubmission, deleteUserContent, getSubmission, moderate } from '@/lib/community';
import { describeMailError, mailEnabled, sendEmail, testEmail } from '@/lib/mail';
import { dismissReports, pullDownImage, restoreLibraryImage } from '@/lib/reports';

type Result = { ok: true; message?: string } | { ok: false; error: string };

/** `path: null` skips revalidation, for actions whose card updates itself in place. */
async function run(fn: () => Promise<string | void>, path: string | null): Promise<Result> {
  try {
    const message = await fn();
    if (path) revalidatePath(path);
    return { ok: true, message: message ?? undefined };
  } catch (e) {
    return { ok: false, error: (e as { body?: { message?: string } }).body?.message ?? (e as Error).message };
  }
}

/** Admins can't lock themselves out by demoting, banning or deleting their own account. */
async function otherUser(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) throw new Error("You can't do that to your own account");
  return admin;
}

export async function setUserRole(userId: string, role: 'admin' | 'user') {
  return run(async () => {
    await otherUser(userId);
    await auth.api.setRole({ body: { userId, role }, headers: await headers() });
    return role === 'admin' ? 'User is now an admin' : 'Admin rights removed';
  }, '/admin/users');
}

export async function banUser(userId: string, reason: string) {
  return run(async () => {
    await otherUser(userId);
    await auth.api.banUser({ body: { userId, banReason: reason.trim() || undefined }, headers: await headers() });
    return 'User banned and signed out';
  }, '/admin/users');
}

export async function unbanUser(userId: string) {
  return run(async () => {
    await requireAdmin();
    await auth.api.unbanUser({ body: { userId }, headers: await headers() });
    return 'User unbanned';
  }, '/admin/users');
}

export async function deleteUser(userId: string) {
  return run(async () => {
    await otherUser(userId);
    // Account first: if Better Auth refuses, nothing of theirs has been touched.
    await auth.api.removeUser({ body: { userId }, headers: await headers() });
    await deleteUserContent(userId);
    return 'User and all their data deleted';
  }, '/admin/users');
}

export async function moderatePhoto(id: string, action: 'approve' | 'reject' | 'reopen', species?: string) {
  // Not revalidated: the photo would vanish from the filtered list before the admin sees the result.
  const result = await run(async () => {
    await requireAdmin();
    await moderate(id, action, species);
    return { approve: 'Photo approved', reject: 'Photo removed from the community', reopen: 'Votes cleared — back in the review queue' }[action];
  }, null);
  return { ...result, sub: result.ok ? await getSubmission(id, null) : null };
}

export async function deletePhoto(id: string) {
  return run(async () => {
    await requireAdmin();
    await adminDeleteSubmission(id);
    return 'Photo deleted';
  }, '/admin/photos');
}

export async function sendTestEmail() {
  return run(async () => {
    const admin = await requireAdmin();
    if (!mailEnabled) throw new Error('Set HOSTINGER_MAIL_TOKEN in .env.local first');
    try {
      await sendEmail({ to: admin.email, ...testEmail(process.env.BETTER_AUTH_URL ?? 'http://localhost:3000') });
    } catch (err) {
      throw new Error(describeMailError(err));
    }
    return `Test email sent to ${admin.email}`;
  }, '/admin/email');
}

export async function pullDownReported(imageKey: string) {
  return run(async () => {
    const admin = await requireAdmin();
    await pullDownImage(imageKey, admin.id);
    return 'Photo pulled down — it no longer appears anywhere in the app';
  }, '/admin/reports');
}

export async function dismissReported(imageKey: string) {
  return run(async () => {
    const admin = await requireAdmin();
    await dismissReports(imageKey, admin.id);
    return 'Reports dismissed — the photo stays up';
  }, '/admin/reports');
}

export async function restoreHidden(imageKey: string) {
  return run(async () => {
    await requireAdmin();
    await restoreLibraryImage(imageKey);
    return 'Photo restored';
  }, '/admin/reports');
}
