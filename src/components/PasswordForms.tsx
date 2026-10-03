'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const email = String(new FormData(e.currentTarget).get('email'));
    const res = await authClient.requestPasswordReset({ email, redirectTo: '/reset-password' });
    setBusy(false);
    if (res.error) setError(res.error.message ?? 'Something went wrong');
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="card stack">
        <h1>Check your email</h1>
        <p className="muted">If an account exists for that address, we&apos;ve sent a link to reset your password. It expires in an hour.</p>
        <Link href="/sign-in">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h1>Forgot your password?</h1>
      <p className="muted">Enter your email and we&apos;ll send you a link to choose a new one.</p>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" required autoComplete="email" />
      </div>
      {error && <div className="error" role="alert">{error}</div>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
      <Link href="/sign-in" className="small">Back to sign in</Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token || params.get('error')) {
    return (
      <div className="card stack">
        <h1>Link expired</h1>
        <p className="muted">This reset link is invalid or has expired. Request a new one.</p>
        <Link href="/forgot-password" className="btn btn-primary">Request a new link</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get('password'));
    if (password !== String(f.get('confirm'))) {
      setError("The passwords don't match");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await authClient.resetPassword({ newPassword: password, token: token! });
    setBusy(false);
    if (res.error) setError(res.error.message ?? 'Something went wrong');
    else router.push('/sign-in?reset=1');
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h1>Choose a new password</h1>
      <div className="field">
        <label htmlFor="password">New password</label>
        <input id="password" name="password" type="password" className="input" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="field">
        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" className="input" required minLength={8} autoComplete="new-password" />
      </div>
      {error && <div className="error" role="alert">{error}</div>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Set new password'}</button>
    </form>
  );
}
