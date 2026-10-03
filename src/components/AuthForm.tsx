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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email'));
    const password = String(f.get('password'));
    const res =
      mode === 'sign-up'
        ? await authClient.signUp.email({ email, password, name: String(f.get('name')).trim() })
        : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (res.error) {
      setError(res.error.message ?? 'Something went wrong');
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h1>{mode === 'sign-up' ? 'Create your account' : 'Welcome back'}</h1>
      <p className="muted">
        {mode === 'sign-up'
          ? 'Your account keeps your progress and lets you upload and verify photos.'
          : 'Sign in to keep practising where you left off.'}
      </p>
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
        {mode === 'sign-up' && <span className="small muted">At least 8 characters.</span>}
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
