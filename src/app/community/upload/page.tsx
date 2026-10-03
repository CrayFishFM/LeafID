import { UploadForm } from '@/components/UploadForm';
import { GuestGate } from '@/components/GuestGate';
import { getUser } from '@/lib/auth';

export default async function UploadPage() {
  if (!(await getUser())) return <GuestGate />;
  return <UploadForm />;
}
