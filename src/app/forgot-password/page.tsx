import { ForgotPasswordForm } from '@/components/PasswordForms';

export const metadata = { title: 'Forgot password' };

export default function ForgotPasswordPage() {
  return (
    <div className="auth-wrap">
      <ForgotPasswordForm />
    </div>
  );
}
