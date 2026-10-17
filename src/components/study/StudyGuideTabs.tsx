'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { StudyGuide } from '@/data/study/types';
import { Flashcards } from './Flashcards';
import { PracticeTest } from './PracticeTest';
import { SortDrills } from './SortDrills';

export interface ExtraTab { id: string; label: string; content: ReactNode }

/** Flashcards, practice test, course-specific drills, then sorting drills, one tab at a time. */
export function StudyGuideTabs({ guide, extra = [] }: { guide: StudyGuide; extra?: ExtraTab[] }) {
  const tabs = [
    { id: 'cards', label: 'Flashcards' },
    { id: 'test', label: 'Practice test' },
    ...extra.map(({ id, label }) => ({ id, label })),
    ...(guide.sorts.length || guide.ranks.length ? [{ id: 'sort', label: 'Sort it' }] : []),
  ];
  const ids = tabs.map((t) => t.id).join(' ');
  const [tab, setTab] = useState('cards');

  // The tab lives in the URL hash, so a link (or reload) opens the same one.
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (ids.split(' ').includes(h)) setTab(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [ids]);

  function open(t: string) {
    setTab(t);
    history.replaceState(null, '', `#${t}`);
  }

  return (
    <div className="stack">
      <div className="segmented" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} aria-current={tab === t.id} onClick={() => open(t.id)}>{t.label}</button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'cards' && <Flashcards guideId={guide.id} cards={guide.cards} sections={guide.sections} allLabel={guide.allLabel} />}
        {tab === 'test' && <PracticeTest guideId={guide.id} bank={guide.test} />}
        {extra.map((x) => tab === x.id && <div key={x.id}>{x.content}</div>)}
        {tab === 'sort' && <SortDrills drills={guide.sorts} ranks={guide.ranks} />}
      </div>
    </div>
  );
}
