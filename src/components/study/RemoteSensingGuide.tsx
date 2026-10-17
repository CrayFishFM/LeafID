'use client';

import { useEffect, useState } from 'react';
import { CARDS, GIS_COMPONENTS, PLACES, SORTS, TEST, WEEKS } from '@/data/study/remote-sensing';
import { Flashcards } from './Flashcards';
import { PracticeTest } from './PracticeTest';
import { CruiseLineDrill, ScaleDrill } from './ScaleDrills';
import { SortDrills } from './SortDrills';
import { UtmExplorer } from './UtmExplorer';

const TABS = [
  { id: 'cards', label: 'Flashcards' },
  { id: 'test', label: 'Practice test' },
  { id: 'scale', label: 'Scale & cruise lines' },
  { id: 'utm', label: 'UTM zones' },
  { id: 'sort', label: 'Sort it' },
] as const;
type Tab = (typeof TABS)[number]['id'];

export function RemoteSensingGuide() {
  const [tab, setTab] = useState<Tab>('cards');

  // The tab lives in the URL hash, so a link (or reload) opens the same one.
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (TABS.some((t) => t.id === h)) setTab(h as Tab);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  function open(t: Tab) {
    setTab(t);
    history.replaceState(null, '', `#${t}`);
  }

  return (
    <div className="stack">
      <div className="segmented" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} aria-current={tab === t.id} onClick={() => open(t.id)}>{t.label}</button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'cards' && <Flashcards cards={CARDS} weeks={WEEKS} />}
        {tab === 'test' && <PracticeTest bank={TEST} />}
        {tab === 'scale' && <div className="grid grid-2" style={{ alignItems: 'start' }}><ScaleDrill /><CruiseLineDrill /></div>}
        {tab === 'utm' && <UtmExplorer places={PLACES} />}
        {tab === 'sort' && <SortDrills drills={SORTS} gisComponents={GIS_COMPONENTS} />}
      </div>
    </div>
  );
}
