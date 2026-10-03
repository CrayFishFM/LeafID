'use client';

import { useState, useTransition } from 'react';
import { sendTestEmail } from '@/app/admin/actions';

export function SendTestEmail({ disabled }: { disabled: boolean }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="stack" style={{ gap: '0.5rem' }}>
      <button
        className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={disabled || pending}
        onClick={() => start(async () => {
          const r = await sendTestEmail();
          setMsg(r.ok ? { ok: true, text: r.message ?? 'Sent' } : { ok: false, text: r.error });
        })}
      >
        {pending ? 'Sending…' : 'Send me a test email'}
      </button>
      {msg && <div className={msg.ok ? 'notice small' : 'error'}>{msg.text}</div>}
    </div>
  );
}
