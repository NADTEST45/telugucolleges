/** Dataset-level provenance used by validation and public freshness labels. */
export const COLLEGE_DATA_PROVENANCE = {
  auditDate: "5 September 2026",
  coverage: "Partial; see docs/FACT-CHECK-2026-09-05.md",
  sources: {
    cutoffs: "TGCHE official statements; AP historical records include secondary-source imports",
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
