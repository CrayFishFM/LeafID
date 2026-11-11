'use client';

import { useState } from 'react';
import { pick } from '@/lib/random';

const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * A problem with a typed answer. A numeric answer is checked within 0.05; a text answer (a bearing
 * like “S15°W”) is compared ignoring case, spaces and degree marks.
 */
interface Problem { text: string; answer: number | string; unit: string; steps: string[] }

const normBearing = (s: string) => s.toUpperCase().replace(/[\s°º]/g, '');

function isRight(p: Problem, value: string) {
  if (typeof p.answer === 'string') return normBearing(value) === normBearing(p.answer);
  const n = Number(value.replace(/[,\s°m]/g, ''));
  return !Number.isNaN(n) && Math.abs(n - p.answer) <= 0.05;
}

// ---- Compassing ----

const QUADRANTS = [
  { q: 'NE', toAz: (b: number) => b, rule: 'NE: azimuth = bearing', back: 'NE: bearing = azimuth' },
  { q: 'SE', toAz: (b: number) => 180 - b, rule: 'SE: azimuth = 180° − bearing', back: 'SE: bearing = 180° − azimuth' },
  { q: 'SW', toAz: (b: number) => 180 + b, rule: 'SW: azimuth = 180° + bearing', back: 'SW: bearing = azimuth − 180°' },
  { q: 'NW', toAz: (b: number) => 360 - b, rule: 'NW: azimuth = 360° − bearing', back: 'NW: bearing = 360° − azimuth' },
];

function compassProblem(): Problem {
  const kind = pick(['to-az', 'to-bearing', 'declination', 'back'] as const);
  const quad = pick(QUADRANTS);
  const b = randInt(1, 89);
  const bearing = `${quad.q[0]}${b}°${quad.q[1]}`;
  const az = quad.toAz(b);
  if (kind === 'to-az') {
    return { text: `What is the azimuth of ${bearing}?`, answer: az, unit: '°', steps: [quad.rule, `= ${az}°`] };
  }
  if (kind === 'to-bearing') {
    return {
      text: `Convert the azimuth ${az}° to a bearing (e.g. S15W).`, answer: bearing, unit: '',
      steps: [`${az}° is in the ${quad.q} quadrant`, quad.back, `Bearing = ${bearing}`],
    };
  }
  if (kind === 'declination') {
    const dec = randInt(5, 15);
    const west = Math.random() < 0.6;
    const mag = randInt(dec + 1, 359 - dec);
    const trueAz = west ? mag - dec : mag + dec;
    return {
      text: `Your compass reads a magnetic azimuth of ${mag}° with a declination of ${dec}°${west ? 'W' : 'E'}. What is the true azimuth?`,
      answer: trueAz, unit: '°',
      steps: [west ? 'West declination: subtract it' : 'East declination: add it', `${mag}° ${west ? '−' : '+'} ${dec}° = ${trueAz}°`],
    };
  }
  const back = (az + 180) % 360;
  return { text: `What is the back azimuth of ${az}°?`, answer: back, unit: '°', steps: [`${az}° ${az >= 180 ? '−' : '+'} 180° = ${back}°`] };
}

// ---- Diameters & heights ----

const SCALES = [{ name: '1/20', recip: 20, dist: 20 }, { name: '1/15', recip: 15, dist: 15 }, { name: '%', recip: 100, dist: 0 }];

function treeProblem(): Problem {
  if (Math.random() < 0.3) {
    const avg = randInt(9, 30) * 2 + 1; // odd, so the divide by 4 rule applies
    const spread = randInt(1, 3);
    const a = avg - spread, b = avg + spread;
    const dbh = (avg - 1) % 4 === 0 ? avg - 1 : avg + 1;
    return {
      text: `Your caliper readings are ${a} cm and ${b} cm. What do you tally for DBH?`, answer: dbh, unit: 'cm',
      steps: [`(${a} + ${b}) ÷ 2 = ${avg} cm`, `${avg} is between ${avg - 1} and ${avg + 1}`, `${dbh} divides by 4, so DBH = ${dbh} cm`],
    };
  }
  const s = pick(SCALES);
  const dist = s.dist || randInt(12, 30);
  const bottom = -randInt(1, s.recip === 100 ? 12 : 3);
  const top = s.recip === 100 ? randInt(40, 110) : randInt(10, 28);
  const h = round2(((top - bottom) * dist) / s.recip);
  return {
    text: `On the ${s.name} scale, ${dist} m from the tree, your top reading is ${top} and your bottom reading is ${bottom}. How tall is the tree?`,
    answer: h, unit: 'm',
    steps: [
      `(Top − Bottom) × Distance ÷ Scale reciprocal`,
      `(${top} − (${bottom})) × ${dist} ÷ ${s.recip}`,
      `${top - bottom} × ${dist} ÷ ${s.recip} = ${h} m`,
    ],
  };
}

const KINDS = {
  compass: { title: 'Bearings, azimuths & declination', blurb: 'NE = B · SE = 180 − B · SW = 180 + B · NW = 360 − B. West declination: subtract.', make: compassProblem },
  trees: { title: 'Suunto heights & calipers', blurb: 'Height = (Top − Bottom) × Distance ÷ Scale reciprocal. Calipers: average, then the divide by 4 rule.', make: treeProblem },
};

/** Endless worked problems, with the working shown after each answer. */
export function FieldDrill({ kind }: { kind: keyof typeof KINDS }) {
  const k = KINDS[kind];
  const [p, setP] = useState<Problem | null>(null);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState<boolean | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  function next() {
    setP(k.make());
    setValue('');
    setChecked(null);
  }

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!p || checked !== null || !value.trim()) return;
    const ok = isRight(p, value);
    setChecked(ok);
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
  }

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>{k.title}</h3>
        <p className="small muted" style={{ margin: 0 }}>
          {k.blurb}
          {score.total > 0 && <> · <strong>{score.right} / {score.total}</strong> right</>}
        </p>
      </div>
      {!p ? (
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={next}>Give me a problem</button>
      ) : (
        <form className="stack" onSubmit={check} style={{ gap: '0.75rem' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{p.text}</p>
          <div className="row" style={{ gap: '0.5rem' }}>
            <input className={`input ${checked === true ? 'is-correct' : checked === false ? 'is-wrong' : ''}`} style={{ maxWidth: 180 }}
              inputMode={typeof p.answer === 'number' ? 'decimal' : 'text'} value={value} onChange={(e) => setValue(e.target.value)}
              disabled={checked !== null} aria-label="Your answer" autoFocus />
            {p.unit && <span className="muted">{p.unit}</span>}
            {checked === null && <button className="btn btn-primary btn-sm" disabled={!value.trim()}>Check</button>}
          </div>
          {checked !== null && (
            <div className={`card feedback ${checked ? '' : 'is-wrong'}`}>
              <p style={{ margin: '0 0 0.35rem' }}>
                <strong>{checked ? 'Correct.' : 'Not quite.'}</strong> The answer is {p.answer}{p.unit === '°' ? '°' : p.unit ? ` ${p.unit}` : ''}.
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
