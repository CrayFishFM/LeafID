import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { discordEnabled, getSession } from '@/lib/auth';

export const metadata = { title: 'Sign in' };

export default async function SignInPage() {
  const user = (await getSession())?.user;
  // Guests come here to upgrade, so only real accounts are sent away.
  if (user && !user.isAnonymous) redirect('/progress');
  return (
    <div className="auth-wrap">
      <Suspense>
        <AuthForm mode="sign-in" discord={discordEnabled} guest={!!user?.isAnonymous} />
      </Suspense>
    </div>
  );
}
