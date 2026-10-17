import type { Rating, Severity, Stock } from '@/data/topics/types';

// Severity and AGS/UGS wording, shared by the quiz (browser) and the study guide (server).

export const SEVERITIES: Severity[] = ['minor', 'moderate', 'major'];
export const STOCKS: Stock[] = ['AGS', 'UGS', 'either'];

export const SEVERITY_LABEL: Record<Severity, string> = { minor: 'Minor', moderate: 'Moderate', major: 'Major' };
export const STOCK_LABEL: Record<Stock, string> = { AGS: 'AGS', UGS: 'UGS', either: 'Either way' };

/** The rule behind each severity, from the Forest Health defect table. */
export const SEVERITY_RULE: Record<Severity, string> = {
  major: 'Major defects are always UGS: the tree will lose quality and is not expected to survive the next 20–25 years.',
  moderate: 'Moderate defects reduce quality potential and the tree will degrade slowly. They can go either way: AGS or UGS.',
  minor: 'Minor defects are always AGS: the tree will maintain its quality over the cutting cycle.',
};

export const ratingLabel = (r: Rating) => `${SEVERITY_LABEL[r.severity]} · ${r.stock === 'either' ? 'AGS or UGS' : r.stock}`;
