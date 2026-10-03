import { UploadForm } from '@/components/UploadForm';
import { GuestGate } from '@/components/GuestGate';
import { getUser } from '@/lib/auth';

export default async function UploadPage() {
  const user = await getUser();
  if (!user) return <GuestGate />;
  return <UploadForm isAdmin={user.role === 'admin'} />;
}
