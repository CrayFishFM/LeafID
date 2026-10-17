/* eslint-disable @next/next/no-img-element -- static quiz photos are pre-sized */
import Link from 'next/link';
import type { CourseCardData } from '@/lib/courses';

/** A plane flying cruise lines over a UTM grid of forest stands, for courses without photos. */
function AerialArt() {
  return (
    <svg viewBox="0 0 320 180" className="course-art" aria-hidden>
      <rect width="320" height="180" fill="var(--surface-2)" />
      <path d="M0 120 C60 95 90 140 150 118 S250 70 320 92 V180 H0Z" fill="color-mix(in srgb, var(--primary) 22%, transparent)" />
      <path d="M0 60 C50 40 110 75 170 52 S270 20 320 34 V0 H0Z" fill="color-mix(in srgb, var(--primary) 14%, transparent)" />
      <g stroke="var(--border)" strokeWidth="1">
        {[40, 80, 120, 160, 200, 240, 280].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="180" />)}
        {[45, 90, 135].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} />)}
      </g>
      <g fill="var(--primary)" opacity="0.55">
        {[[52, 128], [70, 140], [96, 126], [210, 104], [232, 118], [258, 100], [120, 50], [140, 60], [36, 40]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="7" />
        ))}
      </g>
      <path d="M20 160 L300 20" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6" />
      <path d="M200 70 l18 -9 -4 -4 16 -2 6 -10 4 2 -2 10 14 6 -2 4 -16 -2 -10 10 -4 -2 4 -8z" fill="var(--text)" />
      <path d="M222 66 L196 132 L262 112Z" fill="color-mix(in srgb, var(--accent) 22%, transparent)" />
    </svg>
  );
}

export function CourseCard({ course }: { course: CourseCardData }) {
  const [main, ...rest] = course.links;
  return (
    <article className="card stack course-card">
      <Link href={main.href} className="photo photo-contain" tabIndex={-1} aria-hidden>
        {course.cover ? <img src={course.cover} alt="" loading="lazy" /> : <AerialArt />}
      </Link>
      <div>
        <p className="eyebrow" style={{ margin: 0 }}>{course.title}</p>
        <h2 style={{ margin: 0 }}>{course.subject}</h2>
        <p className="small muted" style={{ margin: '0.25rem 0 0' }}>{course.blurb}</p>
        {course.stats && (
          <p className="small" style={{ margin: '0.35rem 0 0' }}>
            You&apos;ve answered {course.stats.total} · {Math.round((course.stats.correct / course.stats.total) * 100)}% correct
          </p>
        )}
      </div>
      <div className="row" style={{ marginTop: 'auto' }}>
        <Link href={main.href} className="btn btn-primary">{main.label}</Link>
        {rest.map((l) => <Link key={l.href} href={l.href} className="btn btn-sm">{l.label}</Link>)}
      </div>
    </article>
  );
}
