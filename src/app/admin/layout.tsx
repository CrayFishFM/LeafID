import { AdminTabs } from '@/components/admin/AdminTabs';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Admin' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Each page and action also checks; this keeps non-admins from seeing the shell.
  await requireAdmin();
  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow">Admin</p>
        <h1>Dashboard</h1>
      </div>
      <AdminTabs />
      {children}
    </div>
  );
}
