'use client';
/* eslint-disable @next/next/no-img-element -- library photos */

import { useState, useTransition } from 'react';
import { resetSpeciesText, saveLeafGroups, saveSpecies } from '@/app/admin/actions';
import { KEY_QUESTIONS, type KeyQuestion, type KeyTraits, type TraitId } from '@/data/leaf-key';
import type { LeafGroup, Lookalike, Species } from '@/lib/leaf-shared';

type Msg = { ok: boolean; text: string } | null;

function Status({ msg }: { msg: Msg }) {
  return msg && <span className={`small ${msg.ok ? 'muted' : 'error'}`}>{msg.text}</span>;
}

export function LeafGroupsEditor({ initial }: { initial: Record<string, LeafGroup> }) {
  const [groups, setGroups] = useState(initial);
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, start] = useTransition();
  const set = (id: string, k: keyof LeafGroup, v: string) => setGroups({ ...groups, [id]: { ...groups[id], [k]: v } });

  function save(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveLeafGroups(groups);
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Saved' } : { ok: false, text: r.error });
    });
  }

  return (
    <details className="card">
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Groups ({Object.keys(groups).length})</summary>
      <form onSubmit={save} className="stack" style={{ marginTop: '1rem' }}>
        {Object.keys(groups).map((id) => (
          <div key={id} className="grid grid-2" style={{ gap: '0.5rem' }}>
            <input className="input" aria-label={`Name of group ${id}`} value={groups[id].label} onChange={(e) => set(id, 'label', e.target.value)} required maxLength={80} />
            <input className="input" aria-label={`Description of group ${id}`} value={groups[id].blurb} onChange={(e) => set(id, 'blurb', e.target.value)} required maxLength={300} />
          </div>
        ))}
        <div className="row">
          <button className="btn btn-primary btn-sm" disabled={pending}>{pending ? 'Saving…' : 'Save groups'}</button>
          <Status msg={msg} />
        </div>
      </form>
    </details>
  );
}

interface Fields {
  code: string; common: string; scientific: string; group: string; arrangement: string; leafType: string;
  shape: string; margin: string; keyFeatures: string; fieldClues: string; lookalikes: Lookalike[]; keyTraits: KeyTraits;
}

const toFields = (s: Species): Fields => ({
  code: s.code, common: s.common, scientific: s.scientific, group: s.group, arrangement: s.arrangement, leafType: s.leafType,
  shape: s.shape, margin: s.margin, keyFeatures: s.keyFeatures.join('\n'), fieldClues: s.fieldClues.join('\n'),
  lookalikes: s.lookalikes, keyTraits: s.keyTraits,
});

const TRAIT_QUESTIONS = KEY_QUESTIONS.filter((q): q is KeyQuestion & { id: TraitId } => q.id !== 'arrangement' && q.id !== 'leafType');

/** Tick boxes for the leaf key's answers. Flags questions the key will ask about this species but that have no answer. */
function KeyTraitsPicker({ f, onChange }: { f: Fields; onChange: (traits: KeyTraits) => void }) {
  const values = (id: KeyQuestion['id']) => (id === 'arrangement' ? [f.arrangement] : id === 'leafType' ? [f.leafType] : f.keyTraits[id] ?? []);
  const toggle = (id: TraitId, value: string) => {
    const now = values(id);
    onChange({ ...f.keyTraits, [id]: now.includes(value) ? now.filter((v) => v !== value) : [...now, value] });
  };
  return (
    <fieldset className="field lookalike-picker">
      <legend>Leaf key <span className="muted small">(tick every answer that fits; tick more than one when it varies)</span></legend>
      <div className="stack" style={{ gap: '0.6rem' }}>
        {TRAIT_QUESTIONS.map((q) => {
          const applies = !q.requires || values(q.requires.id).includes(q.requires.value);
          const missing = applies && values(q.id).length === 0;
          return (
            <div key={q.id} className="key-trait-row" style={{ opacity: applies ? 1 : 0.55 }}>
              <span className="small">
                <strong>{q.short}</strong>
                {missing && <> <span className="chip chip-warn">needs an answer</span></>}
                {!applies && <span className="muted"> · not asked for this species</span>}
              </span>
              <div className="row" style={{ gap: '0.35rem' }}>
                {q.options.map((o) => (
                  <label key={o.value} className="chip key-trait-opt" title={o.hint}>
                    <input type="checkbox" checked={values(q.id).includes(o.value)} onChange={() => toggle(q.id, o.value)} />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SpeciesEditor({ species, photo, groups, others, edited, canReset }: {
  species: Species;
  photo: string | null;
  groups: Record<string, LeafGroup>;
  others: { id: string; label: string }[];
  edited: string | null;
  canReset: boolean;
}) {
  const [f, setF] = useState(() => toFields(species));
  const [editedNote, setEditedNote] = useState(edited);
  const [msg, setMsg] = useState<Msg>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, start] = useTransition();
  type TextKey = Exclude<keyof Fields, 'lookalikes' | 'keyTraits'>;
  const set = (k: TextKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const id = (k: string) => `${species.id}-${k}`;
  const setLookalike = (n: number, patch: Partial<Lookalike>) =>
    setF({ ...f, lookalikes: f.lookalikes.map((l, i) => (i === n ? { ...l, ...patch } : l)) });
  const unused = others.filter((o) => !f.lookalikes.some((l) => l.id === o.id));

  function save(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveSpecies(species.id, {
        ...f,
        keyFeatures: f.keyFeatures.split('\n'),
        fieldClues: f.fieldClues.split('\n'),
        lookalikes: f.lookalikes.filter((l) => l.id),
      });
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Saved' } : { ok: false, text: r.error });
      if (r.ok) setEditedNote('Edited by you just now');
    });
  }

  function reset() {
    start(async () => {
      const r = await resetSpeciesText(species.id);
      setConfirmReset(false);
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Reset' } : { ok: false, text: r.error });
      if (r.ok && r.species) {
        setF(toFields(r.species));
        setEditedNote(null);
      }
    });
  }

  const input = (k: TextKey, label: string, max: number, hint?: string) => (
    <div className="field">
      <label htmlFor={id(k)}>{label}{hint && <> <span className="muted">({hint})</span></>}</label>
      <input id={id(k)} className="input" value={f[k]} onChange={set(k)} required maxLength={max} />
    </div>
  );

  return (
    <details className="card quiz-item-editor">
      <summary>
        {photo && <img src={photo} alt="" loading="lazy" />}
        <span className="stack" style={{ gap: '0.1rem' }}>
          <strong>{f.code} · {f.common}</strong>
          <span className="small muted">{groups[f.group]?.label}{editedNote && ` · ${editedNote}`}</span>
        </span>
      </summary>
      <form onSubmit={save} className="stack" style={{ marginTop: '1rem' }}>
        <div className="grid grid-2">
          {input('code', 'Code', 16, 'shown on quiz buttons')}
          {input('common', 'Common name', 80)}
          {input('scientific', 'Scientific name', 120)}
          <div className="field">
            <label htmlFor={id('group')}>Group</label>
            <select id={id('group')} className="input" value={f.group} onChange={set('group')}>
              {Object.entries(groups).map(([g, v]) => <option key={g} value={g}>{v.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor={id('arrangement')}>Arrangement</label>
            <select id={id('arrangement')} className="input" value={f.arrangement} onChange={set('arrangement')}>
              <option value="opposite">Opposite</option>
              <option value="alternate">Alternate</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={id('leafType')}>Leaf type</label>
            <select id={id('leafType')} className="input" value={f.leafType} onChange={set('leafType')}>
              <option value="simple">Simple</option>
              <option value="compound">Compound</option>
            </select>
          </div>
          {input('shape', 'Shape', 200)}
          {input('margin', 'Margin', 200)}
        </div>
        <div className="field">
          <label htmlFor={id('keyFeatures')}>Key features <span className="muted">(one per line, most useful first; the first is used as a hint)</span></label>
          <textarea id={id('keyFeatures')} className="input" rows={3} value={f.keyFeatures} onChange={set('keyFeatures')} required />
        </div>
        <div className="field">
          <label htmlFor={id('fieldClues')}>Field clues <span className="muted">(bark, buds, habitat… one per line, optional)</span></label>
          <textarea id={id('fieldClues')} className="input" rows={3} value={f.fieldClues} onChange={set('fieldClues')} />
        </div>
        <fieldset className="field lookalike-picker">
          <legend>Look-alikes <span className="muted small">(used as wrong choices and to explain mistakes)</span></legend>
          <div className="stack" style={{ gap: '0.6rem' }}>
            {f.lookalikes.map((l, n) => (
              <div key={n} className="stack" style={{ gap: '0.35rem' }}>
                <div className="row" style={{ gap: '0.5rem' }}>
                  <select
                    className="input"
                    style={{ flex: 1, minWidth: 0 }}
                    aria-label="Look-alike species"
                    value={l.id}
                    onChange={(e) => setLookalike(n, { id: e.target.value })}
                  >
                    {others.filter((o) => o.id === l.id || unused.includes(o)).map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => setF({ ...f, lookalikes: f.lookalikes.filter((_, i) => i !== n) })}>Remove</button>
                </div>
                <textarea
                  className="input"
                  rows={2}
                  aria-label="How to tell them apart"
                  placeholder="How to tell them apart"
                  value={l.tip}
                  onChange={(e) => setLookalike(n, { tip: e.target.value })}
                  required
                  maxLength={400}
                />
              </div>
            ))}
            {unused.length > 0 && f.lookalikes.length < 6 && (
              <button type="button" className="btn btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setF({ ...f, lookalikes: [...f.lookalikes, { id: unused[0].id, tip: '' }] })}>
                Add look-alike
              </button>
            )}
          </div>
        </fieldset>
        <KeyTraitsPicker f={f} onChange={(keyTraits) => setF({ ...f, keyTraits })} />
        <div className="row">
          <button className="btn btn-primary btn-sm" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
          {canReset && (confirmReset ? (
            <>
              <button type="button" className="btn btn-sm btn-danger" disabled={pending} onClick={reset}>Confirm: undo all edits</button>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
            </>
          ) : (
            <button type="button" className="btn btn-sm btn-ghost" disabled={pending} onClick={() => setConfirmReset(true)}>Reset to original</button>
          ))}
          <Status msg={msg} />
        </div>
      </form>
    </details>
  );
}
