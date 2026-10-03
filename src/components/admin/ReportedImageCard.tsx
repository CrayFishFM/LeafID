'use client';
/* eslint-disable @next/next/no-img-element -- library and user-uploaded photos */

import { useState, useTransition } from 'react';
import { dismissReported, pullDownReported, restoreHidden } from '@/app/admin/actions';
import { REPORT_REASONS, type ReportReason } from '@/lib/report-reasons';

type Result = { ok: true; message?: string } | { ok: false; error: string };

function useAction() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  const act = (fn: () => Promise<Result>) =>
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Done' } : { ok: false, text: r.error });
      if (r.ok) setDone(true);
    });
  return { msg, done, pending, act };
}

export interface ReportedCardData {
  imageKey: string;
  url: string;
  speciesName: string;
  community: boolean;
  count: number;
  reports: { reason: ReportReason; note: string | null; reporter: string; when: string }[];
}

export function ReportedImageCard({ item }: { item: ReportedCardData }) {
  const { msg, done, pending, act } = useAction();
  const [confirm, setConfirm] = useState(false);

  return (
    <article className="card stack" style={{ padding: '0.75rem', gap: '0.5rem', opacity: done ? 0.6 : 1 }}>
      <a href={item.url} target="_blank" rel="noreferrer" className="photo">
        <img src={item.url} alt={`Reported photo of ${item.speciesName}`} loading="lazy" />
      </a>
      <div className="row" style={{ gap: '0.35rem' }}>
        <span className="chip chip-bad">{item.count} report{item.count === 1 ? '' : 's'}</span>
        <span className="chip">{item.community ? 'Community upload' : 'Built-in photo'}</span>
      </div>
      <div className="small">Labelled as <strong>{item.speciesName}</strong></div>
      <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
        {item.reports.map((r, i) => (
          <li key={i}>
            <strong>{REPORT_REASONS[r.reason]}</strong>
            {r.note && <> — “{r.note}”</>}
            <div className="muted">{r.reporter} · {r.when}</div>
          </li>
        ))}
      </ul>
      {!done && (
        <div className="row" style={{ gap: '0.35rem', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
          {confirm ? (
            <>
              <button className="btn btn-sm btn-danger" disabled={pending} onClick={() => act(() => pullDownReported(item.imageKey))}>Confirm pull down</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirm(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-sm btn-danger" disabled={pending} onClick={() => setConfirm(true)}>Pull down</button>
              <button className="btn btn-sm" disabled={pending} onClick={() => act(() => dismissReported(item.imageKey))}>Dismiss</button>
            </>
          )}
        </div>
      )}
      {msg && <span className={`small ${msg.ok ? 'muted' : 'error'}`}>{msg.text}</span>}
    </article>
  );
}

export function HiddenImageCard({ imageKey, url, speciesName, hiddenBy, when }: { imageKey: string; url: string; speciesName: string; hiddenBy: string; when: string }) {
  const { msg, done, pending, act } = useAction();
  return (
    <article className="card stack" style={{ padding: '0.75rem', gap: '0.5rem', opacity: done ? 0.6 : 1 }}>
      <div className="photo"><img src={url} alt={`Hidden photo of ${speciesName}`} loading="lazy" /></div>
      <div className="small"><strong>{speciesName}</strong><div className="muted">Pulled down by {hiddenBy} · {when}</div></div>
      {!done && (
        <button className="btn btn-sm" style={{ alignSelf: 'flex-start' }} disabled={pending} onClick={() => act(() => restoreHidden(imageKey))}>
          Restore
        </button>
      )}
      {msg && <span className={`small ${msg.ok ? 'muted' : 'error'}`}>{msg.text}</span>}
    </article>
  );
}
