import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { pool } from './db';
import { describeMailError, mailEnabled, resetPasswordEmail, sendEmail, verificationEmail } from './mail';

/** Comma-separated emails that are made admins automatically (on sign-up and on server start). */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Not awaited so response time doesn't reveal whether an account exists.
function deliver(email: Parameters<typeof sendEmail>[0]) {
  sendEmail(email).catch((err) => console.error(`[mail] failed to send "${email.subject}" to ${email.to}: ${describeMailError(err)}`));
}

export const auth = betterAuth({
  database: pool,
  // instrumentation.ts migrates the schema on startup; the built-in check runs before that and only adds noise.
  advanced: { database: { validateSchema: false } },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Only enforce verification when email can actually be delivered.
    requireEmailVerification: mailEnabled,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      deliver({ to: user.email, ...resetPasswordEmail(user.name, url) });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      deliver({ to: user.email, ...verificationEmail(user.name, url) });
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) =>
          ADMIN_EMAILS.includes(user.email.toLowerCase()) ? { data: { ...user, role: 'admin' } } : undefined,
      },
    },
  },
  // nextCookies must be last so cookies set inside server actions reach the browser.
  plugins: [admin(), nextCookies()],
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

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/');
  return user;
}
