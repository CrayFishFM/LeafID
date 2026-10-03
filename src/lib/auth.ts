import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from './db';

export const auth = betterAuth({
  database: db,
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  // Must be last so cookies set inside server actions reach the browser.
  plugins: [nextCookies()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For pages and actions that need a signed-in user. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  return session.user;
}
