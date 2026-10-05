'use client';
/* eslint-disable @next/next/no-img-element -- same pre-sized library photos as the field guide */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { KEY_QUESTIONS, keyValues, type KeyQuestion, type QuestionId } from '@/data/leaf-key';
import type { Species } from '@/data/species';
import { KeyDiagram } from './KeyDiagram';
import { useLeaf } from './LeafProvider';

type Step = { q: QuestionId; answer: string | null };

const QUESTION = Object.fromEntries(KEY_QUESTIONS.map((q) => [q.id, q])) as Record<QuestionId, KeyQuestion>;

function matches(s: Species, steps: Step[]) {
  return steps.every((st) => st.answer === null || !!keyValues(s, st.q)?.includes(st.answer));
}

function count(list: Species[], q: QuestionId, value: string) {
  return list.filter((s) => keyValues(s, q)?.includes(value)).length;
}

/** The first unasked question that applies to every remaining species and actually narrows them down. */
function nextQuestion(list: Species[], steps: Step[]): KeyQuestion | null {
  if (list.length < 2) return null;
  const asked = new Set(steps.map((s) => s.q));
  return KEY_QUESTIONS.find((q) => {
    if (asked.has(q.id)) return false;
    if (q.requires && !list.every((s) => keyValues(s, q.requires!.id)?.includes(q.requires!.value))) return false;
    if (!list.every((s) => keyValues(s, q.id))) return false;
    return q.options.some((o) => { const n = count(list, q.id, o.value); return n > 0 && n < list.length; });
  }) ?? null;
}

/** Walks the learner through the leaf one feature at a time and shows the species that still fit. */
export function LeafKey({ photos }: { photos: Record<string, string> }) {
  const leaf = useLeaf();
  const [steps, setSteps] = useState<Step[]>([]);

  const candidates = useMemo(() => leaf.species.filter((s) => matches(s, steps)), [leaf.species, steps]);
  const next = nextQuestion(candidates, steps);
  const ids = new Set(candidates.map((s) => s.id));
  const pairs = new Set<string>();
  const tips = next ? [] : candidates.flatMap((s) => s.lookalikes.flatMap((l) => {
    const pair = [s.id, l.id].sort().join('|');
    if (!ids.has(l.id) || pairs.has(pair)) return [];
    pairs.add(pair);
    return [{ a: s, b: leaf.byId[l.id], tip: l.tip }];
  }));

  const answer = (q: QuestionId, value: string | null) => setSteps((prev) => [...prev, { q, answer: value }]);
  // Going back to a step drops it and everything after, since later questions depended on it.
  const backTo = (i: number) => setSteps((prev) => prev.slice(0, i));

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      {steps.length > 0 && (
        <ol className="key-trail">
          {steps.map((st, i) => {
            const q = QUESTION[st.q];
            const opt = q.options.find((o) => o.value === st.answer);
            return (
              <li key={st.q}>
                <span className="small muted">{q.title}</span>
                <span className="row" style={{ gap: '0.5rem' }}>
                  <strong>{opt ? opt.label : 'Not sure'}</strong>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => backTo(i)}>Change</button>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {next ? (
        <section className="card stack key-question" aria-live="polite">
          <div>
            <p className="eyebrow">Step {steps.length + 1}</p>
            <h2 style={{ margin: 0 }}>{next.title}</h2>
            <p className="small muted" style={{ margin: '0.35rem 0 0' }}>{next.help}</p>
          </div>
          <div className="key-options">
            {next.options.map((o) => {
              const n = count(candidates, next.id, o.value);
              return (
                <button key={o.value} type="button" className="key-option" disabled={n === 0} onClick={() => answer(next.id, o.value)}>
                  <KeyDiagram q={next.id} value={o.value} />
                  <span className="stack" style={{ gap: '0.25rem', flex: 1, minWidth: 0 }}>
                    <span className="row" style={{ justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span className="name">{o.label}</span>
                      <span className="chip">{n}</span>
                    </span>
                    <span className="small muted">{o.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="row">
            <button type="button" className="btn btn-sm" onClick={() => answer(next.id, null)}>Not sure — skip</button>
            {steps.length > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSteps([])}>Start over</button>}
          </div>
        </section>
      ) : (
        <section className="card stack feedback" aria-live="polite">
          <h2 style={{ margin: 0 }}>
            {candidates.length === 1 ? `It's ${candidates[0].common}` : candidates.length === 0 ? 'No species match' : `${candidates.length} species fit — compare them up close`}
          </h2>
          {candidates.length === 1 && (
            <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
              {candidates[0].keyFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          {candidates.length === 0 && <p className="small muted" style={{ margin: 0 }}>Try changing one of your answers above.</p>}
          {tips.length > 0 && (
            <div className="stack" style={{ gap: '0.5rem' }}>
              <strong className="small">How to tell these apart</strong>
              <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {tips.map((t) => <li key={`${t.a.id}-${t.b.id}`}><strong>{t.a.common} vs. {t.b.common}:</strong> {t.tip}</li>)}
              </ul>
            </div>
          )}
          <div className="row">
            {candidates.length === 1 && <Link href={`/learn/${candidates[0].id}`} className="btn btn-primary btn-sm">Full profile</Link>}
            <button type="button" className="btn btn-sm" onClick={() => setSteps([])}>Start over</button>
          </div>
        </section>
      )}

      {candidates.length > 0 && (
        <section className="stack">
          <h2 style={{ margin: 0 }}>{next ? `Still possible (${candidates.length})` : candidates.length === 1 ? 'Your match' : 'Possible matches'}</h2>
          <div className="grid grid-cards">
            {candidates.map((s) => (
              <Link key={s.id} href={`/learn/${s.id}`} className="species-card">
                <div className="photo">{photos[s.id] && <img src={photos[s.id]} alt={`${s.common} leaf`} loading="lazy" />}</div>
                <div className="body">
                  <span className="chip chip-code" style={{ alignSelf: 'flex-start' }}>{s.code}</span>
                  <span className="name">{s.common}</span>
                  <span className="sci">{s.scientific}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
