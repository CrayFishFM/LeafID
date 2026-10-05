import { UploadForm } from '@/components/UploadForm';
import { GuestGate } from '@/components/GuestGate';
import { getUser } from '@/lib/auth';
import { plantnetEnabled } from '@/lib/plantnet';

export default async function UploadPage() {
  const user = await getUser();
  if (!user) return <GuestGate />;
  return <UploadForm isAdmin={user.role === 'admin'} canIdentify={plantnetEnabled} />;
}
