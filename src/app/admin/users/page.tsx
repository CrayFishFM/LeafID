import Link from 'next/link';
import { UserActions } from '@/components/admin/UserActions';
import { listUsers, USERS_PER_PAGE, type UserFilter } from '@/lib/admin';
import { requireAdmin } from '@/lib/auth';

const date = (v: string | number | Date) => new Date(v).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

/** What happens to a guest next, for the admin list. */
function guestFate(u: { sessionExpires: Date | null; uploads: number; votes: number }) {
  if (u.sessionExpires) return `Session ends ${date(u.sessionExpires)}`;
  return u.uploads || u.votes ? 'Session ended · kept (uploaded or voted)' : 'Session ended · removed at the next cleanup';
}

export default async function AdminUsers(props: PageProps<'/admin/users'>) {
  const admin = await requireAdmin();
  const sp = await props.searchParams;
  const q = typeof sp.q === 'string' ? sp.q : '';
  const page = Math.max(1, Number(sp.page) || 1);
  // ?guests=1 is the old "Include guests" checkbox.
  const type: UserFilter = sp.type === 'guests' || sp.type === 'all' ? sp.type : sp.guests === '1' ? 'all' : 'accounts';
  const { total, users } = await listUsers(q, page, type);
  const pages = Math.max(1, Math.ceil(total / USERS_PER_PAGE));
  const link = (p: number, t: UserFilter = type) =>
    `/admin/users?${new URLSearchParams({ ...(q && { q }), ...(t !== 'accounts' && { type: t }), ...(p > 1 && { page: String(p) }) })}`;

  return (
    <div className="stack">
      <div className="segmented">
        <Link href={link(1, 'accounts')} aria-current={type === 'accounts'}>Accounts</Link>
        <Link href={link(1, 'guests')} aria-current={type === 'guests'}>Guests</Link>
        <Link href={link(1, 'all')} aria-current={type === 'all'}>Everyone</Link>
      </div>
      {type === 'guests' && (
        <p className="small muted" style={{ margin: 0 }}>
          Guests have no email or password. Each one lasts until their session ends (30 days after their last visit);
          then the daily cleanup deletes guests who never uploaded or voted. Signing up moves a guest&apos;s data to the new
          account.
        </p>
      )}
      <form className="row" action="/admin/users">
        {type !== 'accounts' && <input type="hidden" name="type" value={type} />}
        <input name="q" defaultValue={q} className="input" placeholder="Search name or email" style={{ maxWidth: 320 }} />
        <button className="btn">Search</button>
        <span className="small muted">{total} {type === 'guests' ? (total === 1 ? 'guest' : 'guests') : total === 1 ? 'user' : 'users'}</span>
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
                  {/* Guest emails are random placeholders; don't show them. */}
                  <div className="small muted">{u.isAnonymous ? 'No account (guest)' : u.email}</div>
                  {u.isAnonymous && <div className="small muted">{guestFate(u)}</div>}
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
                    {u.isAnonymous ? (
                      <span className="chip">guest</span>
                    ) : u.emailVerified ? (
                      <span className="chip chip-ok">verified</span>
                    ) : (
                      <span className="chip chip-warn">unverified</span>
                    )}
                  </div>
                  {u.banned && u.banReason && <div className="small muted">{u.banReason}</div>}
                </td>
                <td>
                  <UserActions id={u.id} name={u.name} role={u.role} banned={u.banned} isSelf={u.id === admin.id} isGuest={u.isAnonymous} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="empty">{q ? <>No users match “{q}”.</> : type === 'guests' ? 'No guests right now.' : 'No users.'}</td></tr>
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
