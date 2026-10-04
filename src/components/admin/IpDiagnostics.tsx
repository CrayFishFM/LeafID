import { headers } from 'next/headers';
import { IP_ADDRESS_HEADERS, TRUSTED_PROXIES } from '@/lib/auth';

// Headers proxies commonly use to pass on the visitor's IP.
const CANDIDATES = ['x-forwarded-for', 'x-real-ip', 'forwarded', 'cf-connecting-ip', 'true-client-ip', 'x-client-ip', 'x-cluster-client-ip'];

/**
 * Shows which IP headers this request arrived with, so an admin can set
 * IP_ADDRESS_HEADERS / TRUSTED_PROXIES for Better Auth's rate limiting.
 */
export async function IpDiagnostics() {
  const h = await headers();
  const seen = CANDIDATES.map((name) => ({ name, value: h.get(name) })).filter((x) => x.value);
  const usable = IP_ADDRESS_HEADERS.some((name) => {
    const v = h.get(name);
    return v && (TRUSTED_PROXIES.length > 0 || !v.includes(','));
  });

  return (
    <details className="card">
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
        Client IP detection {usable ? <span className="chip chip-ok">working</span> : <span className="chip chip-warn">not detected</span>}
      </summary>
      <div className="stack small" style={{ marginTop: '0.75rem', gap: '0.6rem' }}>
        <p style={{ margin: 0 }} className="muted">
          Sign-in rate limiting needs each visitor&apos;s IP. Behind a host&apos;s proxy it arrives in a header. Reading:{' '}
          <code>{IP_ADDRESS_HEADERS.join(', ')}</code>
          {TRUSTED_PROXIES.length > 0 && <>, skipping proxies <code>{TRUSTED_PROXIES.join(', ')}</code></>}.
        </p>
        <div className="tally">
          {seen.length === 0 ? (
            <div className="tally-row"><span>No forwarding headers on this request</span></div>
          ) : (
            seen.map((x) => (
              <div key={x.name} className="tally-row">
                <code>{x.name}</code>
                <code style={{ wordBreak: 'break-all', textAlign: 'right' }}>{x.value}</code>
              </div>
            ))
          )}
        </div>
        {!usable && (
          <p style={{ margin: 0 }}>
            To fix: if <code>x-real-ip</code> (or another single-address header) shows your own IP above, set{' '}
            <code>IP_ADDRESS_HEADERS=x-real-ip</code> in the environment. If only <code>x-forwarded-for</code> is there with
            several addresses, the right-hand ones are your host&apos;s proxies: set <code>TRUSTED_PROXIES</code> to those
            addresses (comma-separated). Then redeploy.
          </p>
        )}
      </div>
    </details>
  );
}
