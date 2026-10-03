'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setPassword } from '@/app/account/actions';
import { authClient } from '@/lib/auth-client';

type Msg = { ok: boolean; text: string } | null;
type AuthResult = { error?: { message?: string; code?: string } | null };

/** Runs a Better Auth client call and turns its result into a status message. */
function useRunner() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  async function run(fn: () => Promise<AuthResult>, success: string, refresh = true) {
    setBusy(true);
    setMsg(null);
    const res = await fn();
    setBusy(false);
    if (res.error) {
      setMsg({ ok: false, text: res.error.message ?? 'Something went wrong' });
      return false;
    }
    setMsg({ ok: true, text: success });
    if (refresh) router.refresh();
    return true;
  }
  return { busy, msg, setMsg, run };
}

function Status({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return <div className={msg.ok ? 'notice small' : 'error'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</div>;
}

export function ProfileSection({ name }: { name: string }) {
  const [value, setValue] = useState(name);
  const { busy, msg, run } = useRunner();
  return (
    <form
      className="stack" style={{ gap: '0.6rem' }}
      onSubmit={(e) => { e.preventDefault(); run(() => authClient.updateUser({ name: value.trim() }), 'Name updated'); }}
    >
      <div className="field">
        <label htmlFor="name">Display name</label>
        <input id="name" className="input" value={value} onChange={(e) => setValue(e.target.value)} required maxLength={40} autoComplete="nickname" />
        <span className="small muted">Shown on your uploads and progress page.</span>
      </div>
      <Status msg={msg} />
      <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} disabled={busy || !value.trim() || value.trim() === name}>
        Save name
      </button>
    </form>
  );
}

export function EmailSection({ email, verified, mailEnabled }: { email: string; verified: boolean; mailEnabled: boolean }) {
  const [newEmail, setNewEmail] = useState('');
  const { busy, msg, run } = useRunner();
  // Verified addresses need approval from the old inbox first (see auth.ts changeEmail).
  const needsApproval = mailEnabled && verified;

  return (
    <div className="stack" style={{ gap: '0.6rem' }}>
      <div className="row" style={{ gap: '0.5rem' }}>
        <strong>{email}</strong>
        {verified ? <span className="chip chip-ok">verified</span> : <span className="chip chip-warn">not verified</span>}
      </div>
      {!verified && mailEnabled && (
        <button
          className="btn btn-sm" style={{ alignSelf: 'flex-start' }} disabled={busy}
          onClick={() => run(() => authClient.sendVerificationEmail({ email, callbackURL: '/account' }), `Verification email sent to ${email}`, false)}
        >
          Resend verification email
        </button>
      )}
      <form
        className="stack" style={{ gap: '0.6rem' }}
        onSubmit={async (e) => {
          e.preventDefault();
          const ok = await run(
            () => authClient.changeEmail({ newEmail: newEmail.trim(), callbackURL: '/account?email=changed' }),
            needsApproval
              ? `Check ${email} — approve the change there, then confirm the link sent to ${newEmail.trim()}.`
              : 'Email updated',
          );
          if (ok) setNewEmail('');
        }}
      >
        <div className="field">
          <label htmlFor="new-email">Change email</label>
          <input id="new-email" type="email" className="input" placeholder="new@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required autoComplete="email" />
        </div>
        <Status msg={msg} />
        <button className="btn btn-sm" style={{ alignSelf: 'flex-start' }} disabled={busy || !newEmail.trim()}>Change email</button>
      </form>
    </div>
  );
}

export function PasswordSection({ hasPassword }: { hasPassword: boolean }) {
  const router = useRouter();
  const { busy, msg, setMsg, run } = useRunner();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm) return setMsg({ ok: false, text: "The new passwords don't match" });
    const ok = hasPassword
      ? await run(
          () => authClient.changePassword({ currentPassword: form.current, newPassword: form.next, revokeOtherSessions: true }),
          'Password changed. Other devices have been signed out.',
        )
      : await run(async () => {
          const r = await setPassword(form.next);
          return r.ok ? {} : { error: { message: r.error } };
        }, 'Password set — you can now sign in with your email and password.');
    if (ok) {
      setForm({ current: '', next: '', confirm: '' });
      router.refresh();
    }
  }

  return (
    <form className="stack" style={{ gap: '0.6rem' }} onSubmit={onSubmit}>
      {!hasPassword && (
        <p className="small muted" style={{ margin: 0 }}>
          You sign in with Discord. Set a password to also sign in with your email.
        </p>
      )}
      {hasPassword && (
        <div className="field">
          <label htmlFor="current-password">Current password</label>
          <input id="current-password" type="password" className="input" value={form.current} onChange={set('current')} required autoComplete="current-password" />
        </div>
      )}
      <div className="field">
        <label htmlFor="new-password">New password</label>
        <input id="new-password" type="password" className="input" value={form.next} onChange={set('next')} required minLength={8} autoComplete="new-password" />
      </div>
      <div className="field">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input id="confirm-password" type="password" className="input" value={form.confirm} onChange={set('confirm')} required minLength={8} autoComplete="new-password" />
      </div>
      <Status msg={msg} />
      <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} disabled={busy}>
        {hasPassword ? 'Change password' : 'Set password'}
      </button>
    </form>
  );
}

export interface LinkedAccount {
  /** Better Auth's account row id (what unlinkAccount expects). */
  id: string;
  providerId: string;
}

export function LinkedAccountsSection({ accounts, discordEnabled }: { accounts: LinkedAccount[]; discordEnabled: boolean }) {
  const { busy, msg, setMsg, run } = useRunner();
  const discord = accounts.find((a) => a.providerId === 'discord');
  const hasPassword = accounts.some((a) => a.providerId === 'credential');
  // Better Auth refuses to remove the last way to sign in; mirror that in the UI.
  const onlyMethod = accounts.length <= 1;

  async function link() {
    setMsg(null);
    const res = await authClient.linkSocial({ provider: 'discord', callbackURL: '/account?linked=discord', errorCallbackURL: '/account?error=link' });
    if (res.error) setMsg({ ok: false, text: res.error.message ?? 'Could not start Discord linking' });
  }

  return (
    <div className="stack" style={{ gap: '0.6rem' }}>
      <div className="tally">
        <div className="tally-row">
          <span>Email &amp; password</span>
          <span className={hasPassword ? 'small' : 'small muted'}>{hasPassword ? 'Set up' : 'Not set — add a password below'}</span>
        </div>
        <div className="tally-row" style={{ alignItems: 'center' }}>
          <span>Discord</span>
          {discord ? (
            <button
              className="btn btn-sm btn-danger" disabled={busy || onlyMethod}
              title={onlyMethod ? 'Set a password first — this is your only way to sign in' : undefined}
              onClick={() => run(() => authClient.unlinkAccount({ accountId: discord.id }), 'Discord unlinked')}
            >
              Unlink
            </button>
          ) : discordEnabled ? (
            <button className="btn btn-sm btn-discord" disabled={busy} onClick={link}>Link Discord</button>
          ) : (
            <span className="small muted">Not available</span>
          )}
        </div>
      </div>
      {discord && onlyMethod && <p className="small muted" style={{ margin: 0 }}>Discord is your only sign-in method, so it can&apos;t be unlinked until you set a password.</p>}
      <Status msg={msg} />
    </div>
  );
}

export interface SessionRow {
  token: string;
  device: string;
  lastActive: string;
  current: boolean;
}

export function SessionsSection({ sessions }: { sessions: SessionRow[] }) {
  const router = useRouter();
  const { busy, msg, run } = useRunner();
  const others = sessions.filter((s) => !s.current).length;
  return (
    <div className="stack" style={{ gap: '0.6rem' }}>
      <div className="tally">
        {sessions.map((s) => (
          <div key={s.token} className="tally-row" style={{ alignItems: 'center' }}>
            <span>
              {s.device} {s.current && <span className="chip chip-ok">this device</span>}
              <div className="small muted">Last active {s.lastActive}</div>
            </span>
            {!s.current && (
              <button className="btn btn-sm btn-ghost" disabled={busy} onClick={() => run(() => authClient.revokeSession({ token: s.token }), 'Signed out that device')}>
                Sign out
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="row">
        {others > 0 && (
          <button className="btn btn-sm" disabled={busy} onClick={() => run(() => authClient.revokeOtherSessions(), 'Signed out of all other devices')}>
            Sign out of other devices
          </button>
        )}
        <button
          className="btn btn-sm" disabled={busy}
          onClick={async () => { await authClient.signOut(); router.push('/'); router.refresh(); }}
        >
          Sign out
        </button>
      </div>
      <Status msg={msg} />
    </div>
  );
}

export function DeleteAccountSection({ hasPassword, mailEnabled }: { hasPassword: boolean; mailEnabled: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function onDelete(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await authClient.deleteUser({ ...(hasPassword && { password }), callbackURL: '/?deleted=1' });
    setBusy(false);
    if (res.error) {
      const expired = res.error.code === 'SESSION_EXPIRED' || /fresh|expired/i.test(res.error.message ?? '');
      return setMsg({ ok: false, text: expired ? 'For safety, sign out and sign back in, then try again.' : res.error.message ?? 'Could not delete account' });
    }
    if (mailEnabled) {
      setMsg({ ok: true, text: 'Check your email and click the link to confirm. Nothing is deleted until you do.' });
    } else {
      router.push('/?deleted=1');
      router.refresh();
    }
  }

  if (!open) {
    return (
      <div className="stack" style={{ gap: '0.6rem' }}>
        <p className="small muted" style={{ margin: 0 }}>Permanently delete your account, progress, uploads and votes.</p>
        <button className="btn btn-sm btn-danger" style={{ alignSelf: 'flex-start' }} onClick={() => setOpen(true)}>Delete account…</button>
      </div>
    );
  }

  return (
    <form className="stack" style={{ gap: '0.6rem' }} onSubmit={onDelete}>
      <p className="small" style={{ margin: 0 }}>
        This permanently deletes your account and everything you&apos;ve done on LeafID. It can&apos;t be undone.
        {mailEnabled && ' We’ll email you a link to confirm.'}
      </p>
      {hasPassword && (
        <div className="field">
          <label htmlFor="delete-password">Your password</label>
          <input id="delete-password" type="password" className="input" value={password} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password" />
        </div>
      )}
      <div className="field">
        <label htmlFor="delete-confirm">Type DELETE to confirm</label>
        <input id="delete-confirm" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
      </div>
      <Status msg={msg} />
      <div className="row">
        <button className="btn btn-sm btn-danger" disabled={busy || confirm !== 'DELETE'}>{busy ? 'Deleting…' : 'Delete my account'}</button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
