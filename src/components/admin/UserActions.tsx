'use client';

import { useState, useTransition } from 'react';
import { banUser, deleteUser, setUserRole, unbanUser } from '@/app/admin/actions';

type Mode = 'idle' | 'ban' | 'delete';

export function UserActions({ id, name, role, banned, isSelf, isGuest }: { id: string; name: string; role: string | null; banned: boolean; isSelf: boolean; isGuest: boolean }) {
  const [mode, setMode] = useState<Mode>('idle');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function act(fn: () => Promise<{ ok: true; message?: string } | { ok: false; error: string }>) {
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Done' } : { ok: false, text: r.error });
      if (r.ok) setMode('idle');
    });
  }

  if (isSelf) return <span className="small muted">This is you</span>;

  return (
    <div className="stack" style={{ gap: '0.4rem' }}>
      {mode === 'idle' && (
        <div className="row" style={{ gap: '0.35rem' }}>
          {!isGuest && (
            <button className="btn btn-sm" disabled={pending} onClick={() => act(() => setUserRole(id, role === 'admin' ? 'user' : 'admin'))}>
              {role === 'admin' ? 'Remove admin' : 'Make admin'}
            </button>
          )}
          {banned ? (
            <button className="btn btn-sm" disabled={pending} onClick={() => act(() => unbanUser(id))}>Unban</button>
          ) : (
            <button className="btn btn-sm" disabled={pending} onClick={() => setMode('ban')}>Ban</button>
          )}
          <button className="btn btn-sm btn-danger" disabled={pending} onClick={() => setMode('delete')}>Delete</button>
        </div>
      )}
      {mode === 'ban' && (
        <form
          className="row" style={{ gap: '0.35rem' }}
          onSubmit={(e) => { e.preventDefault(); act(() => banUser(id, reason)); }}
        >
          <input className="input" style={{ minHeight: 36, maxWidth: 220 }} placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button className="btn btn-sm btn-danger" disabled={pending}>Ban {name}</button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setMode('idle')}>Cancel</button>
        </form>
      )}
      {mode === 'delete' && (
        <div className="row" style={{ gap: '0.35rem' }}>
          <span className="small">Delete {name}, their progress and uploads? This can&apos;t be undone.</span>
          <button className="btn btn-sm btn-danger" disabled={pending} onClick={() => act(() => deleteUser(id))}>Yes, delete</button>
          <button className="btn btn-sm btn-ghost" onClick={() => setMode('idle')}>Cancel</button>
        </div>
      )}
      {msg && <span className={`small ${msg.ok ? 'muted' : 'error'}`}>{msg.text}</span>}
    </div>
  );
}
