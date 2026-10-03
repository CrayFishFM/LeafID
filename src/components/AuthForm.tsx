'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/progress';
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email'));
    const password = String(f.get('password'));
    const res =
      mode === 'sign-up'
        ? await authClient.signUp.email({ email, password, name: String(f.get('name')).trim(), callbackURL: next })
        : await authClient.signIn.email({ email, password, callbackURL: next });
    setBusy(false);
    if (res.error) {
      // Unverified sign-ins trigger a fresh verification email (sendOnSignIn).
      if (res.error.code === 'EMAIL_NOT_VERIFIED') setSentTo(email);
      else setError(res.error.message ?? 'Something went wrong');
      return;
    }
    // With email verification on, sign-up returns no session until the link is clicked.
    if (mode === 'sign-up' && !res.data?.token) {
      setSentTo(email);
      return;
    }
    router.push(next);
    router.refresh();
  }

  if (sentTo) {
    return (
      <div className="card stack">
        <h1>Check your email</h1>
        <p className="muted">
          We sent a confirmation link to <strong>{sentTo}</strong>. Click it to activate your account — you&apos;ll be
          signed in automatically. The link expires in an hour.
        </p>
        <p className="small muted" style={{ margin: 0 }}>
          Nothing arrived? Check your spam folder, or <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSentTo(null)}>try again</button>
        </p>
      </div>
    );
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h1>{mode === 'sign-up' ? 'Create your account' : 'Welcome back'}</h1>
      <p className="muted">
        {mode === 'sign-up'
          ? 'Your account keeps your progress and lets you upload and verify photos.'
          : 'Sign in to keep practising where you left off.'}
      </p>
      {params.get('reset') && <div className="notice">Password updated — sign in with your new password.</div>}
      {mode === 'sign-up' && (
        <div className="field">
          <label htmlFor="name">Display name</label>
          <input id="name" name="name" className="input" required maxLength={40} autoComplete="nickname" />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password" name="password" type="password" className="input" required minLength={8}
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
        />
        {mode === 'sign-up' ? (
          <span className="small muted">At least 8 characters.</span>
        ) : (
          <Link href="/forgot-password" className="small">Forgot your password?</Link>
        )}
      </div>
      {error && <div className="error" role="alert">{error}</div>}
      <button className="btn btn-primary" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
      </button>
      <p className="small muted" style={{ margin: 0 }}>
        {mode === 'sign-up' ? (
          <>Already have an account? <Link href="/sign-in">Sign in</Link></>
        ) : (
          <>New here? <Link href="/sign-up">Create an account</Link></>
        )}
      </p>
    </form>
  );
}
