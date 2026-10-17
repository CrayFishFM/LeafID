'use client';

import { useState } from 'react';
import type { Place } from '@/data/study/remote-sensing';

/** UTM zone for a longitude: 60 zones of 6°, zone 1 starting at 180°W. */
const zoneOf = (lon: number) => Math.floor((lon + 180) / 6) + 1;
const centralMeridian = (zone: number) => zone * 6 - 183;

/** WGS84 latitude/longitude to UTM easting/northing (northern hemisphere), Snyder's series. */
function toUtm(lat: number, lon: number) {
  const a = 6378137, f = 1 / 298.257223563, k0 = 0.9996;
  const e2 = f * (2 - f), ep2 = e2 / (1 - e2);
  const zone = zoneOf(lon);
  const phi = (lat * Math.PI) / 180;
  const dLam = ((lon - centralMeridian(zone)) * Math.PI) / 180;
  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const T = Math.tan(phi) ** 2;
  const C = ep2 * Math.cos(phi) ** 2;
  const A = Math.cos(phi) * dLam;
  const M = a * ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * phi
    - ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * phi)
    + ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi)
    - ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi));
  const easting = k0 * N * (A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T ** 2 + 72 * C - 58 * ep2) * A ** 5) / 120) + 500000;
  const northing = k0 * (M + N * Math.tan(phi) * (A ** 2 / 2 + ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24
    + ((61 - 58 * T + T ** 2 + 600 * C - 330 * ep2) * A ** 6) / 720));
  return { zone, easting, northing };
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-CA');

// The map strip: Ontario runs from about 95°W to 74°W, zones 15 to 18.
const W = 640, H = 220, LON0 = -96, LON1 = -72, LAT0 = 41.5, LAT1 = 52;
const x = (lon: number) => ((lon - LON0) / (LON1 - LON0)) * W;
const y = (lat: number) => H - ((lat - LAT0) / (LAT1 - LAT0)) * H;

export function UtmExplorer({ places }: { places: Place[] }) {
  const [sel, setSel] = useState(places.find((p) => p.name === 'Pembroke') ?? places[0]);
  const [quiz, setQuiz] = useState<{ place: Place; guess: number | null } | null>(null);
  const utm = toUtm(sel.lat, sel.lon);
  const cm = centralMeridian(utm.zone);

  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: 0 }}>UTM zones in Ontario</h3>
        <p className="small muted" style={{ margin: 0 }}>
          60 zones, each 6° of longitude wide. Coordinates are in metres: Easting from the zone&apos;s central meridian
          (set to 500,000 m), Northing from the equator. Tap a town.
        </p>
      </div>
      <div className="table-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="utm-map" role="img" aria-label="UTM zones 15 to 18 across Ontario">
          {[15, 16, 17, 18].map((z) => {
            const west = centralMeridian(z) - 3;
            return (
              <g key={z}>
                <rect x={x(west)} y={0} width={x(west + 6) - x(west)} height={H}
                  fill={z === utm.zone ? 'color-mix(in srgb, var(--primary) 18%, transparent)' : z % 2 ? 'var(--surface-2)' : 'var(--surface)'} />
                <line x1={x(west + 3)} y1={0} x2={x(west + 3)} y2={H} stroke="var(--border)" strokeDasharray="4 4" />
                <text x={x(west + 3)} y={18} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">Zone {z}</text>
                <text x={x(west + 3)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">{Math.abs(west + 3)}°W</text>
                <text x={x(west) + 3} y={H - 24} fontSize="10" fill="var(--muted)">{Math.abs(west)}°W</text>
              </g>
            );
          })}
          {places.map((p) => (
            <g key={p.name} className="utm-place" onClick={() => setSel(p)} role="button" tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(p)} aria-label={p.name}>
              <circle cx={x(p.lon)} cy={y(p.lat)} r={p === sel ? 7 : 5} fill={p === sel ? 'var(--accent)' : 'var(--text)'} />
              <text x={x(p.lon) + 9} y={y(p.lat) + 4} fontSize="12" fontWeight={p === sel ? 700 : 500} fill="var(--text)">{p.name}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="trait-grid">
        <div className="trait"><div className="k">{sel.name}</div><div className="v">{sel.lat.toFixed(2)}°N, {Math.abs(sel.lon).toFixed(2)}°W</div></div>
        <div className="trait"><div className="k">Zone</div><div className="v">{utm.zone} <span className="small muted">(⌊({sel.lon.toFixed(2)} + 180) ÷ 6⌋ + 1)</span></div></div>
        <div className="trait"><div className="k">Central meridian</div><div className="v">{Math.abs(cm)}°W = 500,000 m E</div></div>
        <div className="trait"><div className="k">Easting</div><div className="v">≈ {fmt(utm.easting)} m E</div><div className="small muted">{utm.easting < 500000 ? 'West' : 'East'} of the central meridian</div></div>
        <div className="trait"><div className="k">Northing</div><div className="v">≈ {fmt(utm.northing)} m N</div><div className="small muted">from the equator</div></div>
      </div>

      <div className="stack" style={{ gap: '0.5rem' }}>
        {!quiz ? (
          <button className="btn btn-sm" style={{ alignSelf: 'flex-start' }}
            onClick={() => setQuiz({ place: places[Math.floor(Math.random() * places.length)], guess: null })}>
            Quiz me on zones
          </button>
        ) : (
          <>
            <p style={{ margin: 0 }}>Which zone is <strong>{quiz.place.name}</strong> in? <span className="muted small">({Math.abs(quiz.place.lon).toFixed(1)}°W)</span></p>
            <div className="row" style={{ gap: '0.5rem' }}>
              {[15, 16, 17, 18].map((z) => {
                const right = zoneOf(quiz.place.lon);
                const cls = quiz.guess === null ? '' : z === right ? 'chip-ok' : z === quiz.guess ? 'chip-bad' : '';
                return (
                  <button key={z} className={`btn btn-sm ${cls}`} disabled={quiz.guess !== null}
                    onClick={() => { setQuiz({ ...quiz, guess: z }); setSel(quiz.place); }}>
                    {z}
                  </button>
                );
              })}
              {quiz.guess !== null && (
                <button className="btn btn-sm btn-primary"
                  onClick={() => setQuiz({ place: places.filter((p) => p !== quiz.place)[Math.floor(Math.random() * (places.length - 1))], guess: null })}>
                  Next town
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
