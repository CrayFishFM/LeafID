// Shared by the report button (browser) and the server, so it must not import the database.
export const REPORT_REASONS = {
  wrong_species: 'Wrong tree — misidentified',
  not_leaf: "Not a leaf, or the leaf can't be seen",
  poor_quality: 'Blurry or poor quality',
  inappropriate: 'Inappropriate or offensive',
  other: 'Something else',
} as const;

export type ReportReason = keyof typeof REPORT_REASONS;

export const isReportReason = (v: unknown): v is ReportReason => typeof v === 'string' && v in REPORT_REASONS;
