'use client';
/* eslint-disable @next/next/no-img-element -- static quiz photos */

import { useState, useTransition } from 'react';
import { resetQuizItem, saveQuizItem, saveQuizTopic } from '@/app/admin/actions';
import type { TopicItem } from '@/data/topics';

type Msg = { ok: boolean; text: string } | null;

function Status({ msg }: { msg: Msg }) {
  return msg && <span className={`small ${msg.ok ? 'muted' : 'error'}`}>{msg.text}</span>;
}

export interface TopicFields {
  title: string; short: string; blurb: string; question: string; noun: string; source: string;
  groups: Record<string, string>;
}

export function QuizTopicEditor({ topicId, initial }: { topicId: string; initial: TopicFields }) {
  const [f, setF] = useState(initial);
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, start] = useTransition();
  const set = (k: keyof Omit<TopicFields, 'groups'>) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  function save(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveQuizTopic(topicId, f);
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Saved' } : { ok: false, text: r.error });
    });
  }

  const fields: [keyof Omit<TopicFields, 'groups'>, string][] = [
    ['title', 'Title'], ['short', 'Short name'], ['question', 'Question'], ['noun', 'One item is a…'], ['source', 'Source'], ['blurb', 'Description'],
  ];
  return (
    <form onSubmit={save} className="card stack">
      <h2 style={{ margin: 0 }}>Quiz details</h2>
      <div className="grid grid-2">
        {fields.map(([k, label]) => (
          <div className="field" key={k}>
            <label htmlFor={`t-${k}`}>{label}</label>
            <input id={`t-${k}`} className="input" value={f[k]} onChange={set(k)} required />
          </div>
        ))}
      </div>
      <div className="stack" style={{ gap: '0.5rem' }}>
        <strong className="small">Group names</strong>
        <div className="grid grid-2">
          {Object.keys(f.groups).map((g) => (
            <input
              key={g}
              className="input"
              aria-label={`Name of group ${g}`}
              value={f.groups[g]}
              onChange={(e) => setF({ ...f, groups: { ...f.groups, [g]: e.target.value } })}
              required
            />
          ))}
        </div>
      </div>
      <div className="row">
        <button className="btn btn-primary btn-sm" disabled={pending}>{pending ? 'Saving…' : 'Save details'}</button>
        <Status msg={msg} />
      </div>
    </form>
  );
}

interface ItemFields { name: string; aka: string; note: string; scientific: string; group: string; tips: string; lookalikes: string[] }

const toFields = (i: TopicItem): ItemFields => ({
  name: i.name, aka: i.aka ?? '', note: i.note ?? '', scientific: i.scientific ?? '', group: i.group,
  tips: i.tips.join('\n'), lookalikes: i.lookalikes,
});

export function QuizItemEditor({ topicId, item, imageUrls, groups, others, edited, canReset }: {
  topicId: string;
  item: TopicItem;
  imageUrls: string[];
  groups: Record<string, string>;
  others: { id: string; name: string }[];
  edited: string | null;
  canReset: boolean;
}) {
  const [f, setF] = useState(() => toFields(item));
  const [editedNote, setEditedNote] = useState(edited);
  const [msg, setMsg] = useState<Msg>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, start] = useTransition();
  const set = (k: 'name' | 'aka' | 'note' | 'scientific' | 'group' | 'tips') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const id = (k: string) => `${item.id}-${k}`;

  function save(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveQuizItem(topicId, item.id, { ...f, tips: f.tips.split('\n') });
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Saved' } : { ok: false, text: r.error });
      if (r.ok) setEditedNote('Edited by you just now');
    });
  }

  function reset() {
    start(async () => {
      const r = await resetQuizItem(topicId, item.id);
      setConfirmReset(false);
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Reset' } : { ok: false, text: r.error });
      if (r.ok && r.item) {
        setF(toFields(r.item));
        setEditedNote(null);
      }
    });
  }

  return (
    <details className="card quiz-item-editor">
      <summary>
        {imageUrls[0] && <img src={imageUrls[0]} alt="" loading="lazy" />}
        <span className="stack" style={{ gap: '0.1rem' }}>
          <strong>{f.name || item.name}</strong>
          <span className="small muted">{groups[f.group]}{editedNote && ` · ${editedNote}`}</span>
        </span>
      </summary>
      <form onSubmit={save} className="stack" style={{ marginTop: '1rem' }}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          {imageUrls.map((u) => (
            <a key={u} href={u} target="_blank" rel="noreferrer" className="quiz-item-photo"><img src={u} alt={item.name} loading="lazy" /></a>
          ))}
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor={id('name')}>Name (the correct answer)</label>
            <input id={id('name')} className="input" value={f.name} onChange={set('name')} required maxLength={80} />
          </div>
          <div className="field">
            <label htmlFor={id('aka')}>Other name <span className="muted">(optional)</span></label>
            <input id={id('aka')} className="input" value={f.aka} onChange={set('aka')} maxLength={80} />
          </div>
          <div className="field">
            <label htmlFor={id('scientific')}>Scientific name <span className="muted">(optional)</span></label>
            <input id={id('scientific')} className="input" value={f.scientific} onChange={set('scientific')} maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor={id('note')}>Tag <span className="muted">(optional, e.g. Invasive species)</span></label>
            <input id={id('note')} className="input" value={f.note} onChange={set('note')} maxLength={80} />
          </div>
          <div className="field">
            <label htmlFor={id('group')}>Group</label>
            <select id={id('group')} className="input" value={f.group} onChange={set('group')}>
              {Object.entries(groups).map(([g, label]) => <option key={g} value={g}>{label}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor={id('tips')}>What to look for <span className="muted">(one tip per line, most telling first; the first is used as a hint)</span></label>
          <textarea id={id('tips')} className="input" rows={4} value={f.tips} onChange={set('tips')} required />
        </div>
        <fieldset className="field lookalike-picker">
          <legend>Look-alikes <span className="muted small">(shown as wrong choices and in &ldquo;Don&apos;t confuse with&rdquo;)</span></legend>
          <div className="lookalike-grid">
            {others.map((o) => (
              <label key={o.id} className="small">
                <input
                  type="checkbox"
                  checked={f.lookalikes.includes(o.id)}
                  onChange={(e) => setF({ ...f, lookalikes: e.target.checked ? [...f.lookalikes, o.id] : f.lookalikes.filter((x) => x !== o.id) })}
                />{' '}
                {o.name}
              </label>
            ))}
          </div>
        </fieldset>
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
