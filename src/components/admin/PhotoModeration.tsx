'use client';
/* eslint-disable @next/next/no-img-element -- user-uploaded photos */

import { useState, useTransition } from 'react';
import { deletePhoto, moderatePhoto } from '@/app/admin/actions';
import type { Submission } from '@/lib/community';
import { SpeciesSelect } from '../SpeciesSelect';
import { StatusChip } from '../StatusChip';
import { useLeaf } from '../LeafProvider';
import { speciesLabel } from '@/lib/leaf-shared';

export function PhotoModeration({ sub: initial }: { sub: Submission }) {
  const leaf = useLeaf();
  const [sub, setSub] = useState(initial);
  // Default the approve choice to the crowd's leader, else the uploader's claim.
  const [species, setSpecies] = useState(sub.consensus ?? sub.tally[0]?.species ?? sub.claimed);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  type Res = ({ ok: true; message?: string } | { ok: false; error: string }) & { sub?: Submission | null };
  function act(fn: () => Promise<Res>) {
    start(async () => {
      const r = await fn();
      if (r.sub) setSub(r.sub);
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Done' } : { ok: false, text: r.error });
    });
  }

  return (
    <article className="card stack" style={{ padding: '0.75rem', gap: '0.5rem' }}>
      <a href={`/api/photos/${sub.id}`} target="_blank" rel="noreferrer" className="photo">
        <img src={`/api/photos/${sub.id}`} alt="Community upload" loading="lazy" />
      </a>
      <div className="row" style={{ gap: '0.35rem' }}>
        <StatusChip status={sub.status} />
        {sub.moderated && <span className="chip">admin decision</span>}
        <span className="small muted">{sub.votes} vote{sub.votes === 1 ? '' : 's'}</span>
      </div>
      <div className="small">
        <strong>{sub.uploader}</strong> <span className="muted">{sub.uploaderEmail}</span>
        {/* Server and browser format dates differently (time zone, ICU); the browser's wins. */}
        <time className="muted" dateTime={new Date(sub.createdAt).toISOString()} suppressHydrationWarning style={{ display: 'block' }}>
          {new Date(sub.createdAt).toLocaleString('en-CA')}
        </time>
        {sub.note && <div>“{sub.note}”</div>}
      </div>
      <div className="small">
        Uploader said <strong>{speciesLabel(leaf, sub.claimed)}</strong>
        {sub.consensus && sub.consensus !== sub.claimed && <> · now <strong>{speciesLabel(leaf, sub.consensus)}</strong></>}
      </div>
      {sub.tally.length > 0 && (
        <div className="tally small">
          {sub.tally.map((t) => (
            <div key={t.species} className="tally-row"><span>{speciesLabel(leaf, t.species)}</span><span className="muted">{t.count}</span></div>
          ))}
        </div>
      )}

      <div className="stack" style={{ gap: '0.4rem', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
        <SpeciesSelect value={species} onChange={(e) => setSpecies(e.target.value)} aria-label="Species to approve as" />
        <div className="row" style={{ gap: '0.35rem' }}>
          <button className="btn btn-sm btn-primary" disabled={pending || !species} onClick={() => act(() => moderatePhoto(sub.id, 'approve', species))}>Approve</button>
          {sub.status !== 'rejected' && (
            <button className="btn btn-sm" disabled={pending} onClick={() => act(() => moderatePhoto(sub.id, 'reject'))}>Reject</button>
          )}
          <button className="btn btn-sm" disabled={pending} onClick={() => act(() => moderatePhoto(sub.id, 'reopen'))} title="Clear votes and send back to the crowd">Reset votes</button>
          {confirmDelete ? (
            <>
              <button className="btn btn-sm btn-danger" disabled={pending} onClick={() => act(() => deletePhoto(sub.id))}>Confirm delete</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(true)}>Delete</button>
          )}
        </div>
        {msg && <span className={`small ${msg.ok ? 'muted' : 'error'}`}>{msg.text}</span>}
      </div>
    </article>
  );
}
