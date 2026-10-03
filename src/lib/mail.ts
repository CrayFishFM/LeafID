import { AccountApi, Configuration, SendApi, type V1SendRequest } from '@hostinger/mail-sdk';

const token = process.env.HOSTINGER_MAIL_TOKEN;
const fromName = process.env.MAIL_FROM_NAME ?? 'LeafID';

/** True when Hostinger Mail is configured; without it emails are only logged (dev). */
export const mailEnabled = !!token;

const config = token ? new Configuration({ accessToken: token }) : null;
let mailboxId: Promise<string> | null = null;

/** Use HOSTINGER_MAILBOX_ID if set, otherwise the first mailbox the token can manage. */
function resolveMailbox(): Promise<string> {
  if (process.env.HOSTINGER_MAILBOX_ID) return Promise.resolve(process.env.HOSTINGER_MAILBOX_ID);
  mailboxId ??= new AccountApi(config!).getCurrentAccount().then((res) => {
    const box = res.data.data.mailboxes[0];
    if (!box) throw new Error('Hostinger Mail token has no mailboxes');
    return box.resourceId;
  });
  // Don't cache a failed lookup.
  mailboxId.catch(() => (mailboxId = null));
  return mailboxId;
}

/** One-line description of a mail failure. Never log the raw Axios error: it contains the bearer token. */
export function describeMailError(err: unknown): string {
  const e = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
  if (e.response) return `Hostinger Mail API ${e.response.status}: ${e.response.data?.message ?? 'request failed'}`;
  return e.message ?? String(err);
}

export interface Email {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: Email) {
  if (!config) {
    if (process.env.NODE_ENV === 'production') throw new Error('Email is not configured (HOSTINGER_MAIL_TOKEN)');
    console.log(`\n[mail:dev] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }
  // The generated SDK types mark every field required; the API only needs these.
  const body = { to: [to], displayName: fromName, subject, text, html } as V1SendRequest;
  await new SendApi(config).sendEmail(await resolveMailbox(), body);
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Simple, email-client-safe layout with one call-to-action button. */
function layout(heading: string, intro: string, cta: { label: string; url: string }, outro: string) {
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5ef;font-family:Arial,sans-serif;color:#1b261d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:14px;padding:28px">
<tr><td style="font-size:20px;font-weight:bold;color:#2d6a3a;padding-bottom:12px">🍃 LeafID</td></tr>
<tr><td style="font-size:18px;font-weight:bold;padding-bottom:8px">${escape(heading)}</td></tr>
<tr><td style="font-size:15px;line-height:1.5;padding-bottom:20px">${escape(intro)}</td></tr>
<tr><td style="padding-bottom:20px"><a href="${escape(cta.url)}" style="display:inline-block;background:#2d6a3a;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">${escape(cta.label)}</a></td></tr>
<tr><td style="font-size:13px;line-height:1.5;color:#5a685c">${escape(outro)}<br><br>Or paste this link into your browser:<br><span style="word-break:break-all">${escape(cta.url)}</span></td></tr>
</table></td></tr></table></body></html>`;
  const text = `${heading}\n\n${intro}\n\n${cta.label}: ${cta.url}\n\n${outro}`;
  return { html, text };
}

export function verificationEmail(name: string, url: string) {
  return {
    subject: 'Confirm your LeafID email',
    ...layout(
      `Welcome, ${name}!`,
      'Confirm your email address to finish setting up your LeafID account.',
      { label: 'Confirm email', url },
      "This link expires in 1 hour. If you didn't create an account, you can ignore this email.",
    ),
  };
}

export function resetPasswordEmail(name: string, url: string) {
  return {
    subject: 'Reset your LeafID password',
    ...layout(
      `Hi ${name},`,
      'Someone asked to reset the password for your LeafID account. Click below to choose a new one.',
      { label: 'Reset password', url },
      "This link expires in 1 hour. If you didn't ask for this, you can ignore this email — your password won't change.",
    ),
  };
}

export function changeEmailConfirmationEmail(name: string, newEmail: string, url: string) {
  return {
    subject: 'Approve your LeafID email change',
    ...layout(
      `Hi ${name},`,
      `Someone asked to change the email on your LeafID account to ${newEmail}. If that was you, approve it below — we'll then send a link to the new address to finish.`,
      { label: 'Approve change', url },
      "If you didn't ask for this, ignore this email and your address stays the same. Consider changing your password.",
    ),
  };
}

export function deleteAccountEmail(name: string, url: string) {
  return {
    subject: 'Confirm deleting your LeafID account',
    ...layout(
      `Hi ${name},`,
      'You asked to delete your LeafID account. This permanently removes your progress, uploads and votes.',
      { label: 'Delete my account', url },
      "This link expires in 24 hours. If you didn't ask for this, ignore this email — nothing will be deleted.",
    ),
  };
}

export function testEmail(appUrl: string) {
  return {
    subject: 'LeafID test email',
    ...layout(
      'Email is working',
      'This is a test email sent from the LeafID admin dashboard through Hostinger Mail.',
      { label: 'Open LeafID', url: appUrl },
      'No action is needed.',
    ),
  };
}
