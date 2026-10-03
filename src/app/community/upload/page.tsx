import { UploadForm } from '@/components/UploadForm';
import { requireUser } from '@/lib/auth';

export default async function UploadPage() {
  await requireUser();
  return <UploadForm />;
}
