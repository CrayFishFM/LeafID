import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  DeleteAccountSection,
  EmailSection,
  LinkedAccountsSection,
  PasswordSection,
  ProfileSection,
  SessionsSection,
} from '@/components/account/AccountSections';
import { auth, discordEnabled, getSession } from '@/lib/auth';
import { mailEnabled } from '@/lib/mail';

export const metadata = { title: 'Account' };

const BANNERS: Record<string, { ok: boolean; text: string }> = {
  linked: { ok: true, text: 'Discord is now linked — you can sign in with it.' },
  email: { ok: true, text: 'Your email address has been updated.' },
  link: { ok: false, text: "Discord linking didn't complete. That Discord account may already belong to another LeafID account." },
};

/** "Chrome on Windows" from a user-agent string; good enough to recognise your own devices. */
function describeDevice(ua: string | null | undefined) {
  if (!ua) return 'Unknown device';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox'
    : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows'
    : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'unknown OS';
  return `${browser} on ${os}`;
}

const when = (d: Date | string) =>
  new Date(d).toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export default async function AccountPage(props: PageProps<'/account'>) {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/account');
  const { user } = session;
  const sp = await props.searchParams;
  const banner = sp.linked ? BANNERS.linked : sp.email ? BANNERS.email : sp.error === 'link' ? BANNERS.link : null;

  if (user.isAnonymous) {
    return (
      <div className="stack" style={{ maxWidth: 640 }}>
        <div>
          <p className="eyebrow">Account</p>
          <h1>You&apos;re using LeafID as a guest</h1>
        </div>
        <div className="card stack">
          <p className="muted" style={{ margin: 0 }}>
            Your progress, uploads and votes are saved in this browser only. Create an account
            {discordEnabled ? ' or sign in with Discord' : ''} to keep them on every device — everything you&apos;ve
            done so far moves over automatically.
          </p>
          <div className="row">
            <Link href="/sign-up?next=/account" className="btn btn-primary">Create account</Link>
            <Link href="/sign-in?next=/account" className="btn">Sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  const h = await headers();
  const [accounts, sessions] = await Promise.all([
    auth.api.listUserAccounts({ headers: h }),
    auth.api.listSessions({ headers: h }),
  ]);
  const linked = accounts.map((a) => ({ id: a.id, providerId: a.providerId }));
  const hasPassword = linked.some((a) => a.providerId === 'credential');
  const sessionRows = sessions
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((s) => ({
      token: s.token,
      device: describeDevice(s.userAgent),
      lastActive: when(s.updatedAt),
      current: s.token === session.session.token,
    }));

  return (
    <div className="stack" style={{ gap: '1.25rem', maxWidth: 760 }}>
      <div>
        <p className="eyebrow">Account</p>
        <h1>Your account</h1>
        <p className="muted" style={{ margin: 0 }}>Member since {new Date(user.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      {banner && <div className={banner.ok ? 'notice' : 'error'}>{banner.text}</div>}

      <section className="card stack">
        <h2 style={{ margin: 0 }}>Profile</h2>
        <ProfileSection name={user.name} />
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>Email</h2>
        <EmailSection email={user.email} verified={user.emailVerified} mailEnabled={mailEnabled} />
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>Sign-in methods</h2>
        <LinkedAccountsSection accounts={linked} discordEnabled={discordEnabled} />
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>{hasPassword ? 'Change password' : 'Set a password'}</h2>
        <PasswordSection hasPassword={hasPassword} />
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>Devices</h2>
        <SessionsSection sessions={sessionRows} />
      </section>

      <section className="card stack" style={{ borderColor: 'color-mix(in srgb, var(--bad) 35%, var(--border))' }}>
        <h2 style={{ margin: 0 }}>Delete account</h2>
        <DeleteAccountSection hasPassword={hasPassword} mailEnabled={mailEnabled} />
      </section>
    </div>
  );
}
