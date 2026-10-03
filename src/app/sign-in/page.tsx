import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'Sign in' };

export default async function SignInPage() {
  if (await getSession()) redirect('/progress');
  return (
    <div className="auth-wrap">
      <Suspense>
        <AuthForm mode="sign-in" />
      </Suspense>
    </div>
  );
}
