/**
 * Data layer for the "TG EAPCET 2026 Cutoff" SEO landing pages
 * (/eapcet/tg-cutoff-2026 and /eapcet/tg-cutoff-2026/[branch]).
 *
 * Pre-built BEFORE TG EAPCET 2026 counselling (registration June 19–28,
 * web options June 25–July 1, Phase-1 allotment by ~July 10, 2026) so pages
 * are indexed when search volume peaks. Tables show official TSCHE last-rank
 * data (2025-26, 2024-25 & 2023-24 final phase, plus 2023 Phase-1 OC for reference) —
 * clearly labelled as such, never a prediction.
 *
 * Mirrors ap-cutoff-2026.ts. One structural difference: TS_CUTOFFS branch
 * keys are UPPERCASE codes (CSE, CIV, MEC, …) while URL slugs stay lowercase,
 * so each branch carries an explicit `code` alongside its `slug`.
 *
 * Sentinel values 156852 (final-phase 2023) / 156840 (Phase-1 2023) in the
 * source data mean the branch "closed at last rank" — seats were still
 * available when counselling ended. They are real official values and are
 * rendered as-is (they naturally sort to the bottom); pages footnote them.
 */
import { COLLEGES, type College } from "./colleges";
import { TS_CUTOFFS } from "./ts-cutoffs";
import { TS_CUTOFFS_2023_PHASE1 } from "./ts-cutoffs-phases";

export interface TSCutoffBranch {
  slug: string;       // URL segment (mirrors the AP cutoff-2026 slugs)
  code: string;       // UPPERCASE TS_CUTOFFS branch key
  label: string;      // display name
  keyword: string;    // search-intent phrasing for titles/descriptions
}

/** Branches with meaningful TSCHE last-rank coverage. Every `code` is a
 *  verified key in TS_CUTOFFS (counts checked against the raw data). */
export const TS_CUTOFF_BRANCHES: TSCutoffBranch[] = [
  { slug: "cse", code: "CSE", label: "CSE (Computer Science)", keyword: "CSE" },
  { slug: "ece", code: "ECE", label: "ECE (Electronics & Communication)", keyword: "ECE" },
  { slug: "eee", code: "EEE", label: "EEE (Electrical & Electronics)", keyword: "EEE" },
  { slug: "civil", code: "CIV", label: "Civil Engineering", keyword: "Civil" },
  { slug: "mech", code: "MEC", label: "Mechanical Engineering", keyword: "Mechanical" },
  { slug: "ai_ml", code: "CSM", label: "CSE (AI & Machine Learning)", keyword: "CSE AI & ML" },
  { slug: "cse_ds", code: "CSD", label: "CSE (Data Science)", keyword: "CSE Data Science" },
  { slug: "it", code: "INF", label: "Information Technology", keyword: "IT" },
  { slug: "csc", code: "CSC", label: "CSE (Cyber Security)", keyword: "Cyber Security" },
  { slug: "ai_ds", code: "AID", label: "AI & Data Science", keyword: "AI & DS" },
];

export function getTSCutoffBranch(slug: string): TSCutoffBranch | undefined {
  return TS_CUTOFF_BRANCHES.find(b => b.slug === slug);
}

/** Official "closed at last rank" sentinels in the TSCHE 2023 statements. */
export const TS_LAST_RANK_SENTINELS = new Set([156852, 156840]);

export function isLastRankSentinel(rank: number): boolean {
  return TS_LAST_RANK_SENTINELS.has(rank);
}

export interface TSCutoffRow {
  college: College;
  oc2025: number;        // 2025-26 final-phase boys OC rank (0 = no data)
  oc2024: number;        // 2024-25 final-phase OC closing rank (0 = no data)
  oc2023: number;        // 2023-24 final-phase OC closing rank
  sc2024: number;        // 2024-25 final-phase SC closing rank
  ews2024: number;       // 2024-25 final-phase EWS closing rank
  ocPhase1_2023: number; // official TSCHE 2023 Phase-1 OC last rank (reference)
}

/** All Telangana colleges with official last-rank data for this branch,
 *  sorted by latest-year OC closing rank (tightest first). Sentinel values
 *  (156852/156840 = closed at last rank) naturally sink to the bottom. */
export function getTSCutoffRows(branchSlug: string, colleges: College[] = COLLEGES): TSCutoffRow[] {
  const branch = getTSCutoffBranch(branchSlug);
  if (!branch) return [];
  const code = branch.code;
  return colleges
    .filter(c => c.state === "Telangana")
    .map(c => {
      const y2025 = TS_CUTOFFS[c.code]?.["2025"]?.[code];
      const y2024 = TS_CUTOFFS[c.code]?.["2024"]?.[code];
      const y2023 = TS_CUTOFFS[c.code]?.["2023"]?.[code];
      const phase1 = TS_CUTOFFS_2023_PHASE1[c.code]?.["2023"]?.[code];
      return {
        college: c,
        oc2025: y2025?.OC || 0,
        oc2024: y2024?.OC || 0,
        oc2023: y2023?.OC || 0,
        sc2024: y2024?.SC || 0,
        ews2024: y2024?.EWS || 0,
        ocPhase1_2023: phase1?.OC || 0,
      };
    })
    .filter(r => r.oc2025 > 0 || r.oc2024 > 0 || r.oc2023 > 0)
    .sort((a, b) => (a.oc2025 || a.oc2024 || a.oc2023) - (b.oc2025 || b.oc2024 || b.oc2023));
}
