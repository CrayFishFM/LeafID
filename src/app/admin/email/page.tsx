import { SendTestEmail } from '@/components/admin/SendTestEmail';
import { requireAdmin } from '@/lib/auth';
import { mailEnabled } from '@/lib/mail';

export default async function AdminEmail() {
  await requireAdmin();
  const rows = [
    ['HOSTINGER_MAIL_TOKEN', mailEnabled ? 'Set' : 'Not set'],
    ['HOSTINGER_MAILBOX_ID', process.env.HOSTINGER_MAILBOX_ID ? 'Set' : 'Not set — first mailbox on the token is used'],
    ['MAIL_FROM_NAME', process.env.MAIL_FROM_NAME ?? 'LeafID (default)'],
    ['BETTER_AUTH_URL (used in email links)', process.env.BETTER_AUTH_URL ?? 'Not set'],
  ];
  return (
    <div className="grid grid-2">
      <section className="card stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Hostinger Mail</h2>
          {mailEnabled ? <span className="chip chip-ok">Connected</span> : <span className="chip chip-warn">Not configured</span>}
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          Sends account verification and password-reset emails.{' '}
          {mailEnabled
            ? 'New accounts must confirm their email before signing in.'
            : 'Until it is configured, emails are printed to the server log and email verification is not required.'}
        </p>
        <div className="tally small">
          {rows.map(([k, v]) => (
            <div key={k} className="tally-row"><code>{k}</code><span className="muted">{v}</span></div>
          ))}
        </div>
        <SendTestEmail disabled={!mailEnabled} />
      </section>
      <section className="card stack">
        <h2 style={{ margin: 0 }}>Setup</h2>
        <ol className="small" style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>In Hostinger&apos;s email panel, create a Mail API token for the mailbox you want to send from (e.g. no-reply@yourdomain).</li>
          <li>Add it to <code>.env.local</code> as <code>HOSTINGER_MAIL_TOKEN=…</code></li>
          <li>Set <code>BETTER_AUTH_URL</code> to the site&apos;s public URL so links in emails work.</li>
          <li>Restart the server, then send a test email from this page.</li>
        </ol>
      </section>
    </div>
  );
}
