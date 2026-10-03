import type { SubmissionStatus } from '@/lib/community';

const LABEL: Record<SubmissionStatus, [string, string]> = {
  pending: ['Awaiting votes', 'chip-warn'],
  verified: ['Verified', 'chip-ok'],
  disputed: ['Disputed', 'chip-bad'],
};

export function StatusChip({ status }: { status: SubmissionStatus }) {
  const [label, cls] = LABEL[status];
  return <span className={`chip ${cls}`}>{label}</span>;
}
