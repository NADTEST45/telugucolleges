/**
 * Data layer for the "AP EAPCET 2026 Cutoff" SEO landing pages
 * (/eapcet/ap-cutoff-2026 and /eapcet/ap-cutoff-2026/[branch]).
 *
 * Pre-built BEFORE the AP EAPCET 2026 result spike (results expected
 * June 22–23, 2026) so pages are indexed when search volume peaks.
 * Tables show official APSCHE last-rank data (2024-25, 2023-24 & 2022-23) as
 * the reference for expected 2026 cutoffs — clearly labelled as such.
 */
import { COLLEGES, type College } from "./colleges";
import { AP_CUTOFFS } from "./ap-cutoffs";

export interface CutoffBranch {
  slug: string;       // URL segment + AP_CUTOFFS branch key
  label: string;      // display name
  keyword: string;    // search-intent phrasing for titles/descriptions
}

/** Branches with meaningful APSCHE last-rank coverage (≥18 colleges). */
export const AP_CUTOFF_BRANCHES: CutoffBranch[] = [
  { slug: "cse", label: "CSE (Computer Science)", keyword: "CSE" },
  { slug: "ece", label: "ECE (Electronics & Communication)", keyword: "ECE" },
  { slug: "eee", label: "EEE (Electrical & Electronics)", keyword: "EEE" },
  { slug: "civil", label: "Civil Engineering", keyword: "Civil" },
  { slug: "mech", label: "Mechanical Engineering", keyword: "Mechanical" },
  { slug: "cse_ds", label: "CSE (Data Science)", keyword: "CSE Data Science" },
  { slug: "it", label: "Information Technology", keyword: "IT" },
  { slug: "ai_ml", label: "AI & Machine Learning", keyword: "AI & ML" },
  { slug: "ai_ds", label: "AI & Data Science", keyword: "AI & DS" },
  { slug: "csc", label: "CSE (Cyber Security)", keyword: "Cyber Security" },
];

export function getCutoffBranch(slug: string): CutoffBranch | undefined {
  return AP_CUTOFF_BRANCHES.find(b => b.slug === slug);
}

export interface CutoffRow {
  college: College;
  oc2024: number; // 2024-25 counselling OC closing rank (latest official; 0 = no data)
  oc2023: number; // 2023-24 counselling OC closing rank
  oc2022: number; // 2022-23 counselling OC closing rank
  sc2024: number;
  ews2024: number;
}

/** All AP colleges with official last-rank data for this branch, sorted by
 *  latest-year OC closing rank (tightest first). */
export function getCutoffRows(branchSlug: string): CutoffRow[] {
  return COLLEGES
    .filter(c => c.state === "Andhra Pradesh")
    .map(c => {
      const y2024 = AP_CUTOFFS[c.code]?.["2024"]?.[branchSlug];
      const y2023 = AP_CUTOFFS[c.code]?.["2023"]?.[branchSlug];
      const y2022 = AP_CUTOFFS[c.code]?.["2022"]?.[branchSlug];
      return {
        college: c,
        oc2024: y2024?.OC || 0,
        oc2023: y2023?.OC || 0,
        oc2022: y2022?.OC || 0,
        sc2024: y2024?.SC || 0,
        ews2024: y2024?.EWS || 0,
      };
    })
    .filter(r => r.oc2024 > 0 || r.oc2023 > 0 || r.oc2022 > 0)
    .sort((a, b) => (a.oc2024 || a.oc2023 || a.oc2022) - (b.oc2024 || b.oc2023 || b.oc2022));
}
