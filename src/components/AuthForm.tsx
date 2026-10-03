'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function AuthForm({ mode, discord, guest }: { mode: 'sign-in' | 'sign-up'; discord: boolean; guest: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/progress';
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function withDiscord() {
    setError(null);
    setBusy(true);
    // Redirects to Discord; a guest session is merged into the account on the way back.
    const res = await authClient.signIn.social({ provider: 'discord', callbackURL: next, errorCallbackURL: `/${mode}?error=discord` });
    if (res.error) {
      setBusy(false);
      setError(res.error.message ?? 'Could not start Discord sign-in');
    }
  }

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
      {params.get('error') === 'discord' && (
        <div className="error" role="alert">Discord sign-in didn&apos;t complete. Try again, or use email instead.</div>
      )}
      {guest && (
        <div className="notice small">
          You&apos;re using LeafID as a guest. Everything you&apos;ve done so far — progress, uploads and votes — moves to
          your account when you {mode === 'sign-up' ? 'create it' : 'sign in'}.
        </div>
      )}
      {discord && (
        <>
          <button type="button" className="btn btn-discord" onClick={withDiscord} disabled={busy}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="currentColor">
              <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.3 18.3 0 0 0-5.6 0L8.6 3a19.7 19.7 0 0 0-4.9 1.4C.6 9 -.3 13.6.1 18.1A19.9 19.9 0 0 0 6.2 21l1.3-2.1a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12 0l.5.4c-.6.4-1.3.7-2 1l1.3 2.1a19.8 19.8 0 0 0 6.1-3c.5-5.2-.9-9.8-3.6-13.7ZM8.5 15.4c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm7 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
            </svg>
            Continue with Discord
          </button>
          <div className="divider small muted">or use email</div>
        </>
      )}
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
