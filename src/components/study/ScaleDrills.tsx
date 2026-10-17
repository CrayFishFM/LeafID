'use client';

import { useState } from 'react';

const SCALES = [5000, 10000, 15840, 20000];
const fmt = (n: number, d = 0) => n.toLocaleString('en-CA', { maximumFractionDigits: d });
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
/** Within 2% (or 0.05 for small numbers), so rounding a step doesn't count as wrong. */
const close = (got: number, want: number) => Math.abs(got - want) <= Math.max(Math.abs(want) * 0.02, 0.05);
const parse = (s: string) => Number(s.replace(/[,\s]/g, '').replace(/^1:/, ''));

interface Problem { text: string; unit: string; answer: number; steps: string[] }

function makeProblem(): Problem {
  const scale = pick(SCALES);
  const kind = pick(['photo-to-ground', 'ground-to-photo', 'find-scale'] as const);
  if (kind === 'photo-to-ground') {
    const cm = Math.round(rand(1, 12) * 10) / 10;
    const ground = (cm * scale) / 100;
    return {
      text: `On a 1:${fmt(scale)} photo, a line measures ${cm} cm. How long is it on the ground?`,
      unit: 'm',
      answer: ground,
      steps: [`${cm} cm × ${fmt(scale)} = ${fmt(cm * scale)} cm on the ground`, `${fmt(cm * scale)} cm ÷ 100 = ${fmt(ground, 1)} m`],
    };
  }
  if (kind === 'ground-to-photo') {
    const m = Math.round(rand(2, 30)) * 50;
    const cm = (m * 100) / scale;
    return {
      text: `Two road intersections are ${fmt(m)} m apart on the ground. How far apart are they on a 1:${fmt(scale)} photo?`,
      unit: 'cm',
      answer: cm,
      steps: [`${fmt(m)} m × 100 = ${fmt(m * 100)} cm on the ground`, `${fmt(m * 100)} cm ÷ ${fmt(scale)} = ${fmt(cm, 2)} cm on the photo`],
    };
  }
  const s = pick([5000, 10000, 20000]);
  const cm = Math.round(rand(2, 20));
  const groundM = (cm * s) / 100;
  const ground = groundM >= 1000 ? `${fmt(groundM / 1000, 2)} km` : `${fmt(groundM)} m`;
  return {
    text: `Two points are ${cm} cm apart on a photo of unknown scale and ${ground} apart on the ground. What is the scale? (Enter the number after “1:”)`,
    unit: '',
    answer: s,
    steps: [
      ...(groundM >= 1000 ? [`${fmt(groundM / 1000, 2)} km × 1,000 = ${fmt(groundM)} m`] : []),
      `${fmt(groundM)} m × 100 = ${fmt(groundM * 100)} cm on the ground`,
      `${fmt(groundM * 100)} cm ÷ ${cm} cm = ${fmt(s)}`,
      `Scale = 1:${fmt(s)}`,
    ],
  };
}

/** Photo ↔ ground distance and finding the scale, with the working shown after each answer. */
export function ScaleDrill() {
  const [p, setP] = useState<Problem | null>(null);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState<boolean | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  function next() {
    setP(makeProblem());
    setValue('');
    setChecked(null);
  }

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!p || checked !== null || !value.trim()) return;
    const ok = close(parse(value), p.answer);
    setChecked(ok);
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
  }

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>Scale &amp; distance</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Photo distance × scale = ground distance (in the same unit). 100 cm = 1 m, 1,000 m = 1 km.
          {score.total > 0 && <> · <strong>{score.right} / {score.total}</strong> right</>}
        </p>
      </div>
      {!p ? (
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next}>Give me a problem</button>
      ) : (
        <form className="stack" onSubmit={check} style={{ gap: '0.75rem' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{p.text}</p>
          <div className="row" style={{ gap: '0.5rem' }}>
            {p.unit === '' && <span className="muted">1:</span>}
            <input className={`input ${checked === true ? 'is-correct' : checked === false ? 'is-wrong' : ''}`} style={{ maxWidth: 180 }}
              inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} disabled={checked !== null} aria-label="Your answer" autoFocus />
            {p.unit && <span className="muted">{p.unit}</span>}
            {checked === null && <button className="btn btn-primary btn-sm" disabled={!value.trim()}>Check</button>}
          </div>
          {checked !== null && (
            <div className={`card feedback ${checked ? '' : 'is-wrong'}`}>
              <p style={{ margin: '0 0 0.35rem' }}>
                <strong>{checked ? 'Correct.' : 'Not quite.'}</strong> The answer is {p.unit ? `${fmt(p.answer, 2)} ${p.unit}` : `1:${fmt(p.answer)}`}.
              </p>
              <ol className="small" style={{ margin: 0, paddingLeft: '1.2rem' }}>{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            </div>
          )}
          {checked !== null && <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next} autoFocus>Next problem</button>}
        </form>
      )}
    </div>
  );
}

// ---- Cruise lines: azimuth and ground distance ----

const BOX = 300;
/** Pixels per photo-centimetre in the drawing. */
const PX_PER_CM = 18;

interface Line { x1: number; y1: number; x2: number; y2: number; az: number; cm: number; scale: number }

function makeLine(): Line {
  const az = Math.round(rand(0, 72)) * 5 % 360;
  const cm = Math.round(rand(3, 7.5) * 10) / 10;
  const len = cm * PX_PER_CM;
  const rad = (az * Math.PI) / 180;
  // Start far enough from the edge that the line stays inside the photo.
  const x1 = BOX / 2 - (Math.sin(rad) * len) / 2 + rand(-20, 20);
  const y1 = BOX / 2 + (Math.cos(rad) * len) / 2 + rand(-20, 20);
  return { x1, y1, x2: x1 + Math.sin(rad) * len, y2: y1 - Math.cos(rad) * len, az, cm, scale: pick([10000, 15840, 20000]) };
}

/** The angle between two bearings, 0–180. */
const angleOff = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

export function CruiseLineDrill() {
  const [l, setL] = useState<Line | null>(null);
  const [az, setAz] = useState('');
  const [dist, setDist] = useState('');
  const [done, setDone] = useState(false);

  function next() {
    setL(makeLine());
    setAz('');
    setDist('');
    setDone(false);
  }

  const ground = l ? (l.cm * l.scale) / 100 : 0;
  const azOk = l && done ? angleOff(parse(az), l.az) <= 5 : null;
  const distOk = l && done ? close(parse(dist), ground) : null;
  const r = 34;

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>Cruise lines</h3>
        <p className="small muted" style={{ margin: 0 }}>
          North is the top of the photo. Estimate the azimuth from the start (●) to the end (▲) within 5°, then work out the ground distance.
        </p>
      </div>
      {!l ? (
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next}>Draw a cruise line</button>
      ) : (
        <div className="cruise">
          <svg viewBox={`0 0 ${BOX} ${BOX}`} className="cruise-photo" role="img" aria-label="Aerial photo with a cruise line">
            <defs>
              <pattern id="stand" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="7" r="5" fill="var(--primary)" opacity="0.18" />
                <circle cx="17" cy="16" r="4" fill="var(--primary)" opacity="0.14" />
              </pattern>
            </defs>
            <rect width={BOX} height={BOX} fill="var(--surface-2)" />
            <rect width={BOX} height={BOX} fill="url(#stand)" />
            <g stroke="var(--border)">{[60, 120, 180, 240].map((v) => <g key={v}><line x1={v} y1={0} x2={v} y2={BOX} /><line x1={0} y1={v} x2={BOX} y2={v} /></g>)}</g>
            <g transform="translate(272 34)" fill="var(--text)">
              <path d="M0 -20 L7 4 L0 0 L-7 4Z" />
              <text y="18" textAnchor="middle" fontSize="12" fontWeight="700">N</text>
            </g>
            {done && (
              <g stroke="var(--accent)" fill="none" strokeWidth="2">
                <line x1={l.x1} y1={l.y1} x2={l.x1} y2={l.y1 - r - 12} strokeDasharray="4 3" />
                <path d={`M${l.x1} ${l.y1 - r} A${r} ${r} 0 ${l.az > 180 ? 1 : 0} 1 ${l.x1 + Math.sin((l.az * Math.PI) / 180) * r} ${l.y1 - Math.cos((l.az * Math.PI) / 180) * r}`} />
              </g>
            )}
            <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--bad)" strokeWidth="3" strokeLinecap="round" />
            <circle cx={l.x1} cy={l.y1} r="5" fill="var(--bad)" />
            <path d="M0 -7 L6 5 L-6 5Z" fill="var(--bad)" transform={`translate(${l.x2} ${l.y2}) rotate(${l.az})`} />
          </svg>
          <form className="stack" style={{ gap: '0.75rem' }} onSubmit={(e) => { e.preventDefault(); if (az && dist) setDone(true); }}>
            <p style={{ margin: 0 }}>Scale <strong>1:{fmt(l.scale)}</strong>. The line measures <strong>{l.cm} cm</strong> on the photo.</p>
            <div className="field">
              <label htmlFor="az">Azimuth (0–360°)</label>
              <input id="az" className={`input ${azOk === true ? 'is-correct' : azOk === false ? 'is-wrong' : ''}`} inputMode="numeric" value={az} onChange={(e) => setAz(e.target.value)} disabled={done} />
            </div>
            <div className="field">
              <label htmlFor="dist">Ground distance (m)</label>
              <input id="dist" className={`input ${distOk === true ? 'is-correct' : distOk === false ? 'is-wrong' : ''}`} inputMode="decimal" value={dist} onChange={(e) => setDist(e.target.value)} disabled={done} />
            </div>
            {!done && <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={!az || !dist}>Check</button>}
            {done && (
              <div className={`card feedback ${azOk && distOk ? '' : 'is-wrong'}`}>
                <p className="small" style={{ margin: '0 0 0.35rem' }}>
                  <strong>Azimuth: {l.az}°</strong> {azOk ? '✓' : `(you said ${az}°)`}. Back azimuth: {(l.az + 180) % 360}°.
                </p>
                <p className="small" style={{ margin: 0 }}>
                  <strong>Distance: {fmt(ground, 1)} m</strong> {distOk ? '✓' : ''} — {l.cm} cm × {fmt(l.scale)} = {fmt(l.cm * l.scale)} cm ÷ 100.
                </p>
              </div>
            )}
            {done && <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next} autoFocus>Next line</button>}
          </form>
        </div>
      )}
    </div>
  );
}
