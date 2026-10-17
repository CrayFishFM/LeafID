'use client';

import { useState } from 'react';

interface Layer { id: string; name: string; r: number; fill: string; about: string }

// Outside in; each is drawn as a disc on top of the bigger ones, so a tap lands on the layer you see.
const LAYERS: Layer[] = [
  { id: 'outer', name: 'Outer bark', r: 150, fill: '#5b3a24', about: 'Dead tissue; the first line of defence. Limits water loss, deters insects and fungi, protects from fire. Splits into fissures as the tree grows.' },
  { id: 'inner', name: 'Inner bark (phloem)', r: 138, fill: '#a0663a', about: 'The second line of defence, with the cork cambium and the active phloem, which carries food from the leaves to the roots and growing areas.' },
  { id: 'cambium', name: 'Vascular cambium', r: 128, fill: '#7fb069', about: 'A thin layer of dividing cells: makes new xylem toward the inside and new phloem toward the outside, adding one growth ring a year.' },
  { id: 'sapwood', name: 'Sapwood (xylem)', r: 123, fill: '#f2d39b', about: 'The outer, younger rings of wood. Carries water and minerals from the roots to the leaves, and stores food.' },
  { id: 'heartwood', name: 'Heartwood', r: 75, fill: '#c98f4f', about: 'Older, darker central rings. Gives support but no longer stores or moves anything. Inner sapwood turns into heartwood as new sapwood forms.' },
  { id: 'pith', name: 'Pith', r: 9, fill: '#6b4226', about: 'The very centre of the stem, with storage tissue, surrounded by xylem.' },
];
const RAYS = { id: 'rays', name: 'Rays', about: 'Lines of cells running from the centre outward (across the rings). They store nutrients and move them sideways. Very broad in oak.' };
const RING = { id: 'ring', name: 'Growth ring', about: 'One year of growth: light, low-density earlywood (spring) then dense, dark latewood (summer).' };
const ALL = [...LAYERS, RAYS, RING];

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export function TreeCrossSection() {
  const [sel, setSel] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<{ target: string; tapped: string | null } | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  function tap(id: string) {
    if (quiz && !quiz.tapped) {
      setQuiz({ ...quiz, tapped: id });
      setScore((s) => ({ right: s.right + (id === quiz.target ? 1 : 0), total: s.total + 1 }));
    }
    setSel(id);
  }

  const shown = ALL.find((l) => l.id === (quiz && !quiz.tapped ? null : sel));
  const target = quiz && ALL.find((l) => l.id === quiz.target);
  const rings = [88, 98, 108, 116, 30, 45, 60];

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>Trunk cross-section</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Tap a layer to see what it does, or quiz yourself.
          {score.total > 0 && <> · <strong>{score.right} / {score.total}</strong> right</>}
        </p>
      </div>
      <div className="cruise">
        <svg viewBox="-160 -160 320 320" className="cross-section" role="img" aria-label="Cross-section of a tree trunk">
          {LAYERS.map((l) => (
            <circle key={l.id} r={l.r} fill={l.fill} stroke={sel === l.id && !(quiz && !quiz.tapped) ? 'var(--accent)' : 'none'} strokeWidth="3"
              onClick={() => tap(l.id)} style={{ cursor: 'pointer' }} />
          ))}
          <g fill="none" stroke="#8a5a2b" strokeOpacity="0.55" onClick={() => tap('ring')} style={{ cursor: 'pointer' }}>
            {rings.map((r) => <circle key={r} r={r} strokeWidth="2.5" />)}
          </g>
          <g stroke="#8a5a2b" strokeOpacity="0.45" strokeWidth="3" onClick={() => tap('rays')} style={{ cursor: 'pointer' }}>
            {[0, 40, 85, 130, 170, 215, 260, 305].map((a) => (
              <line key={a} x1={Math.cos((a * Math.PI) / 180) * 14} y1={Math.sin((a * Math.PI) / 180) * 14}
                x2={Math.cos((a * Math.PI) / 180) * 120} y2={Math.sin((a * Math.PI) / 180) * 120} />
            ))}
          </g>
        </svg>
        <div className="stack" style={{ gap: '0.75rem' }}>
          {quiz && !quiz.tapped && target && <div className="hint">Tap the <strong>{target.name.toLowerCase()}</strong>.</div>}
          {quiz?.tapped && target && (
            <div className={`card feedback ${quiz.tapped === quiz.target ? '' : 'is-wrong'}`}>
              <p className="small" style={{ margin: 0 }}>
                {quiz.tapped === quiz.target ? <strong>Correct.</strong> : <>That was the <strong>{ALL.find((l) => l.id === quiz.tapped)?.name.toLowerCase()}</strong>. </>}
                {quiz.tapped !== quiz.target && <>Look for the {target.name.toLowerCase()} in the list below.</>}
              </p>
            </div>
          )}
          {shown && (
            <div className="trait">
              <div className="k">{shown.name}</div>
              <div className="small">{shown.about}</div>
            </div>
          )}
          <div className="row" style={{ gap: '0.4rem' }}>
            {ALL.map((l) => (
              <button key={l.id} className={`btn btn-sm ${quiz?.tapped && l.id === quiz.target ? 'chip-ok' : ''}`} disabled={!!quiz && !quiz.tapped}
                onClick={() => setSel(l.id)}>{l.name}</button>
            ))}
          </div>
          <div className="row">
            {(!quiz || quiz.tapped) && (
              <button className="btn btn-primary btn-sm" onClick={() => { setQuiz({ target: pick(ALL.filter((l) => l.id !== quiz?.target)).id, tapped: null }); setSel(null); }}>
                {quiz ? 'Next layer' : 'Quiz me'}
              </button>
            )}
            {quiz && <button className="btn btn-sm btn-ghost" onClick={() => { setQuiz(null); setSel(null); }}>Stop quiz</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
