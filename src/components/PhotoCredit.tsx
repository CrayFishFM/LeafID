import type { Credit } from '@/lib/photos';

export function PhotoCredit({ credit }: { credit: Credit }) {
  return (
    <p className="credit">
      <a href={credit.source} target="_blank" rel="noreferrer">{credit.artist}</a>
      {' · '}
      {credit.licenseUrl ? (
        <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>
      ) : (
        credit.license
      )}
      {' · Wikimedia Commons'}
    </p>
  );
}
