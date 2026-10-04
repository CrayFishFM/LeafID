'use client';
/* eslint-disable @next/next/no-img-element -- user-uploaded photos */

import { useState, useTransition } from 'react';
import { vote } from '@/app/actions';
import type { Submission } from '@/lib/community';
import { ReportButton } from './ReportButton';
import { SpeciesSelect } from './SpeciesSelect';
import { StatusChip } from './StatusChip';
import { useLeaf } from './LeafProvider';
import { speciesLabel } from '@/lib/leaf-shared';

/** Blind review: the voter commits to an ID before seeing the uploader's claim or the tally. */
export function ReviewCard({ submission }: { submission: Submission }) {
  const leaf = useLeaf();
  const [sub, setSub] = useState(submission);
  const [choice, setChoice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const voted = sub.myVote !== null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!choice) return;
    start(async () => {
      try {
        setSub(await vote(sub.id, choice));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <article className="card stack" style={{ padding: '0.75rem' }}>
      <div className="photo">
        <img src={`/api/photos/${sub.id}`} alt="Community leaf photo to identify" loading="lazy" />
      </div>
      <div className="small muted">
        Uploaded by {sub.uploader}
        {sub.note && <> · “{sub.note}”</>}
      </div>
      <ReportButton imageKey={`sub:${sub.id}`} />

      {!voted ? (
        <form onSubmit={submit} className="stack" style={{ gap: '0.5rem' }}>
          <label className="small" htmlFor={`v-${sub.id}`}><strong>What species is this?</strong></label>
          <SpeciesSelect id={`v-${sub.id}`} value={choice} onChange={(e) => setChoice(e.target.value)} required />
          <button className="btn btn-primary btn-sm" disabled={!choice || pending}>{pending ? 'Saving…' : 'Submit my ID'}</button>
        </form>
      ) : (
        <div className="stack" style={{ gap: '0.5rem' }}>
          <div className="row" style={{ gap: '0.4rem' }}>
            <StatusChip status={sub.status} />
            {sub.myVote === sub.claimed ? (
              <span className="chip chip-ok">You agreed with the uploader</span>
            ) : (
              <span className="chip chip-warn">You disagreed with the uploader</span>
            )}
          </div>
          <p className="small" style={{ margin: 0 }}>
            Uploader said <strong>{speciesLabel(leaf, sub.claimed)}</strong>
            {sub.myVote !== sub.claimed && <>; you said <strong>{speciesLabel(leaf, sub.myVote!)}</strong></>}.
          </p>
          <div className="tally">
            {sub.tally.map((t) => (
              <div key={t.species} className="tally-row">
                <span>{leaf.byId[t.species]?.common ?? t.species}</span>
                <span className="muted">{t.count} vote{t.count === 1 ? '' : 's'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </article>
  );
}
