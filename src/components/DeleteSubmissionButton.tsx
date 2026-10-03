'use client';

import { useState, useTransition } from 'react';
import { removeSubmission } from '@/app/actions';

export function DeleteSubmissionButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  if (!confirming) {
    return <button className="btn btn-sm btn-ghost" onClick={() => setConfirming(true)}>Delete</button>;
  }
  return (
    <span className="row" style={{ gap: '0.4rem' }}>
      <button className="btn btn-sm" disabled={pending} onClick={() => start(() => removeSubmission(id))}>
        {pending ? 'Deleting…' : 'Confirm delete'}
      </button>
      <button className="btn btn-sm btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
    </span>
  );
}
