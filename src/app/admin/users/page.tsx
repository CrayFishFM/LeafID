import Link from 'next/link';
import { UserActions } from '@/components/admin/UserActions';
import { listUsers, USERS_PER_PAGE } from '@/lib/admin';
import { requireAdmin } from '@/lib/auth';

const date = (v: string | number | Date) => new Date(v).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

export default async function AdminUsers(props: PageProps<'/admin/users'>) {
  const admin = await requireAdmin();
  const sp = await props.searchParams;
  const q = typeof sp.q === 'string' ? sp.q : '';
  const page = Math.max(1, Number(sp.page) || 1);
  const { total, users } = await listUsers(q, page);
  const pages = Math.max(1, Math.ceil(total / USERS_PER_PAGE));
  const link = (p: number) => `/admin/users?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`;

  return (
    <div className="stack">
      <form className="row" action="/admin/users">
        <input name="q" defaultValue={q} className="input" placeholder="Search name or email" style={{ maxWidth: 320 }} />
        <button className="btn">Search</button>
        <span className="small muted">{total} user{total === 1 ? '' : 's'}</span>
      </form>

      <div className="table-wrap card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr><th>User</th><th>Joined</th><th>Quiz</th><th>Community</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.name}</strong>
                  <div className="small muted">{u.email}</div>
                </td>
                <td className="small">{date(u.createdAt)}</td>
                <td className="small">
                  {u.attempts} answers
                  <div className="muted">{u.attempts ? `${Math.round((u.correct / u.attempts) * 100)}% correct` : '—'}</div>
                  {u.lastActive && <div className="muted">last {date(u.lastActive)}</div>}
                </td>
                <td className="small">{u.uploads} uploads<div className="muted">{u.votes} votes</div></td>
                <td>
                  <div className="row" style={{ gap: '0.3rem' }}>
                    {u.role === 'admin' && <span className="chip chip-code">admin</span>}
                    {u.banned ? <span className="chip chip-bad" title={u.banReason ?? undefined}>banned</span> : null}
                    {u.emailVerified ? <span className="chip chip-ok">verified</span> : <span className="chip chip-warn">unverified</span>}
                  </div>
                  {u.banned && u.banReason && <div className="small muted">{u.banReason}</div>}
                </td>
                <td>
                  <UserActions id={u.id} name={u.name} role={u.role} banned={u.banned} isSelf={u.id === admin.id} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="empty">No users match “{q}”.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="row">
          {page > 1 && <Link href={link(page - 1)} className="btn btn-sm">← Previous</Link>}
          <span className="small muted">Page {page} of {pages}</span>
          {page < pages && <Link href={link(page + 1)} className="btn btn-sm">Next →</Link>}
        </div>
      )}
    </div>
  );
}
