'use client';

import { useState } from 'react';
import { report } from '@/app/actions';
import { authClient } from '@/lib/auth-client';
import { REPORT_REASONS } from '@/lib/report-reasons';

type State = 'idle' | 'open' | 'sending' | 'done';

/** Small "Report photo" link that expands into a reason picker. */
export function ReportButton({ imageKey }: { imageKey: string }) {
  const [state, setState] = useState<State>('idle');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    setState('sending');
    setError(null);
    // Pages like the field guide work without a session; reporting needs one (a guest is fine).
    const { data } = await authClient.getSession();
    if (!data) {
      const res = await authClient.signIn.anonymous();
      if (res.error) {
        setError('Could not send the report. Try again.');
        return setState('open');
      }
    }
    const res = await report(imageKey, reason, note);
    if (!res.ok) {
      setError(res.error);
      return setState('open');
    }
    setMessage(res.alreadyReported ? "You've already reported this photo — thanks." : 'Thanks — an admin will take a look.');
    setState('done');
  }

  if (state === 'done') return <p className="small muted report-done" role="status">{message}</p>;

  if (state === 'idle') {
    return (
      <button type="button" className="report-link small" onClick={() => setState('open')}>
        Report photo
      </button>
    );
  }

  return (
    <form className="report-form stack" onSubmit={submit}>
      <fieldset className="stack" style={{ gap: '0.3rem', border: 0, padding: 0, margin: 0 }}>
        <legend className="small" style={{ fontWeight: 600, marginBottom: '0.3rem' }}>What&apos;s wrong with this photo?</legend>
        {Object.entries(REPORT_REASONS).map(([value, label]) => (
          <label key={value} className="row small" style={{ gap: '0.4rem', cursor: 'pointer' }}>
            <input type="radio" name={`reason-${imageKey}`} value={value} checked={reason === value} onChange={() => setReason(value)} />
            {label}
          </label>
        ))}
      </fieldset>
      <input
        className="input" style={{ minHeight: 36 }} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)}
        placeholder={reason === 'wrong_species' ? 'What do you think it is? (optional)' : 'Details (optional)'}
        aria-label="Details"
      />
      {error && <div className="error">{error}</div>}
      <div className="row" style={{ gap: '0.4rem' }}>
        <button className="btn btn-sm btn-danger" disabled={!reason || state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send report'}</button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setState('idle')}>Cancel</button>
      </div>
    </form>
  );
}
