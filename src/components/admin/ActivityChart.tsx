import type { DayActivity } from '@/lib/admin';

const label = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });

/** Answers per day, last 14 days. Single series, so the title names it — no legend. */
export function ActivityChart({ data }: { data: DayActivity[] }) {
  const max = Math.max(1, ...data.map((d) => d.answers));
  const total = data.reduce((n, d) => n + d.answers, 0);
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <figcaption className="row" style={{ justifyContent: 'space-between' }}>
        <strong>Quiz answers per day</strong>
        <span className="small muted">{total} in the last 14 days</span>
      </figcaption>
      <div className="chart-plot" role="img" aria-label={`Bar chart of quiz answers per day, peak ${max}`}>
        <span className="chart-max small muted">{max}</span>
        {data.map((d) => (
          <div key={d.day} className="chart-col" tabIndex={0}>
            <span className={`chart-bar${d.answers ? '' : ' is-zero'}`} style={{ height: `max(3px, ${(d.answers / max) * 100}%)` }} />
            <span className="chart-tip" role="tooltip">
              <strong>{label(d.day)}</strong>
              <br />
              {d.answers} answer{d.answers === 1 ? '' : 's'} · {d.signups} sign-up{d.signups === 1 ? '' : 's'}
            </span>
          </div>
        ))}
      </div>
      <div className="chart-axis small muted">
        <span>{label(data[0].day)}</span>
        <span>{label(data[data.length - 1].day)}</span>
      </div>
      <details className="small" style={{ marginTop: '0.5rem' }}>
        <summary style={{ cursor: 'pointer' }}>Show as table</summary>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Day</th><th>Answers</th><th>Sign-ups</th></tr></thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day}><td>{label(d.day)}</td><td>{d.answers}</td><td>{d.signups}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
