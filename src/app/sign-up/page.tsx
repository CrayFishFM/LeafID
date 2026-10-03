import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'Create account' };

export default async function SignUpPage() {
  if (await getSession()) redirect('/progress');
  return (
    <div className="auth-wrap">
      <Suspense>
        <AuthForm mode="sign-up" />
      </Suspense>
    </div>
  );
}
