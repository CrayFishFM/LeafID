import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/PasswordForms';

export const metadata = { title: 'Reset password' };

export default function ResetPasswordPage() {
  return (
    <div className="auth-wrap">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
