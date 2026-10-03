import { CommunityTabs } from '@/components/CommunityTabs';
import { verificationRule } from '@/lib/community';

export const metadata = { title: 'Community' };

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow">Community</p>
        <h1>Crowd-verified leaf photos</h1>
        <p className="muted">
          Upload your own leaf photos and help identify everyone else&apos;s. A photo is verified {verificationRule()}. Verified photos join
          everyone&apos;s practice questions.
        </p>
      </div>
      <CommunityTabs />
      {children}
    </div>
  );
}
