'use client';

import { useState } from 'react';
import type { Rating, Severity, Stock } from '@/data/topics/types';
import { ratingLabel, SEVERITIES, SEVERITY_LABEL, SEVERITY_RULE, STOCK_LABEL, STOCKS } from '@/lib/grading';

export interface GradeOutcome { rating: Rating; severityOk: boolean; stockOk: boolean }

/** Asks for a defect's severity and AGS/UGS class, then shows which parts were right. */
export function GradePicker({ when, onSubmit, outcome, pending }: {
  when?: string;
  onSubmit: (severity: Severity, stock: Stock) => void;
  outcome: GradeOutcome | null;
  pending: boolean;
}) {
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [stock, setStock] = useState<Stock | null>(null);
  const done = outcome !== null;

  const cls = <T extends string>(value: T, chosen: T | null, right: T | undefined) =>
    done ? (value === right ? 'correct' : value === chosen ? 'wrong' : '') : value === chosen ? 'selected' : '';

  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      {when && <div className="hint"><strong>Condition:</strong> {when}</div>}
      <fieldset className="grade-set">
        <legend>Severity</legend>
        <div className="grade-options">
          {SEVERITIES.map((s) => (
            <button key={s} type="button" className={`choice ${cls(s, severity, outcome?.rating.severity)}`}
              disabled={done || pending} aria-pressed={severity === s} onClick={() => setSeverity(s)}>
              <span className="name">{SEVERITY_LABEL[s]}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="grade-set">
        <legend>Growing stock</legend>
        <div className="grade-options">
          {STOCKS.map((s) => (
            <button key={s} type="button" className={`choice ${cls(s, stock, outcome?.rating.stock)}`}
              disabled={done || pending} aria-pressed={stock === s} onClick={() => setStock(s)}>
              <span className="name">{STOCK_LABEL[s]}</span>
              <span className="common">{s === 'AGS' ? 'Acceptable' : s === 'UGS' ? 'Unacceptable' : 'Depends'}</span>
            </button>
          ))}
        </div>
      </fieldset>
      {!done && (
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={!severity || !stock || pending}
          onClick={() => severity && stock && onSubmit(severity, stock)}>
          Check rating
        </button>
      )}
      {outcome && (
        <div className={`card feedback ${outcome.severityOk && outcome.stockOk ? '' : 'is-wrong'}`}>
          <p style={{ marginBottom: '0.4rem' }}>
            {outcome.severityOk && outcome.stockOk ? 'Rated right: ' : 'The rating is '}
            <strong>{ratingLabel(outcome.rating)}</strong>
            {outcome.rating.when && <span className="muted"> ({outcome.rating.when.toLowerCase()})</span>}
          </p>
          <p className="small" style={{ margin: 0 }}>{SEVERITY_RULE[outcome.rating.severity]}</p>
          {outcome.rating.note && <p className="small" style={{ margin: '0.4rem 0 0' }}><strong>Note:</strong> {outcome.rating.note}</p>}
        </div>
      )}
    </div>
  );
}
