/** Dataset-level provenance used by validation and public freshness labels. */
export const COLLEGE_DATA_PROVENANCE = {
  verifiedAt: "2026-07-10",
  sources: {
    cutoffs: "Official APSCHE/TGCHE last-rank statements",
    fees: "APHERMC/TAFRC orders and official university fee pages",
    accreditation: "NAAC/NBA official listings",
    rankings: "NIRF official rankings",
  },
} as const;

export interface FieldEvidence {
  sourceUrl: string;
  verifiedAt: string;
  note?: string;
}
