import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { admin, anonymous } from 'better-auth/plugins';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { pool } from './db';
import { deleteUserContent } from './community';
import { mergeGuestInto } from './guests';
import {
  changeEmailConfirmationEmail,
  deleteAccountEmail,
  describeMailError,
  mailEnabled,
  resetPasswordEmail,
  sendEmail,
  verificationEmail,
} from './mail';

/** Comma-separated emails that are made admins automatically (on sign-up and on server start). */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/** Discord login is offered only when both credentials are set. */
export const discordEnabled = !!(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET);

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
  ...(discordEnabled && {
    socialProviders: {
      discord: { clientId: process.env.DISCORD_CLIENT_ID!, clientSecret: process.env.DISCORD_CLIENT_SECRET! },
    },
  }),
  user: {
    changeEmail: {
      enabled: true,
      // Unverified addresses (e.g. when email isn't configured) change straight away.
      updateEmailWithoutVerification: true,
      // Verified addresses: the old inbox must approve first, then the new one is verified.
      ...(mailEnabled && {
        sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
          deliver({ to: user.email, ...changeEmailConfirmationEmail(user.name, newEmail, url) });
        },
      }),
    },
    deleteUser: {
      enabled: true,
      // With email, deletion is confirmed by a link; otherwise the password / a fresh sign-in is enough.
      ...(mailEnabled && {
        sendDeleteAccountVerification: async ({ user, url }) => {
          deliver({ to: user.email, ...deleteAccountEmail(user.name, url) });
        },
      }),
      afterDelete: async (user) => {
        await deleteUserContent(user.id);
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      // Lets a signed-in user link a Discord account whose email differs from their LeafID email.
      // Only applies to explicit linking from the account page, which needs both logins.
      allowDifferentEmails: true,
    },
  },
  session: {
    // 30 days, rolling: guests can't log back in, so their session is their account.
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
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
  plugins: [
    admin(),
    // Visitors without an account get a guest user, so every feature works the same.
    anonymous({
      generateName: () => 'Guest',
      // Signing in or up (email or Discord) moves the guest's progress to the real account.
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await mergeGuestInto(anonymousUser.user.id, newUser.user.id);
      },
    }),
    nextCookies(),
  ],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** The current user, guest or not; null when there's no session yet. */
export async function getUser() {
  return (await getSession())?.user ?? null;
}

/** For actions that need a user; every visitor has one once the guest session is set up. */
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
