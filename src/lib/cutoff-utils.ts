import { AP_CUTOFFS, AP_CUTOFF_YEARS, catKey, type Category, type Gender, type CollegeCutoffs } from "./ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "./ts-cutoffs";
import {
  TS_CUTOFFS_2023_PHASE1,
  TS_CUTOFFS_2023_PHASE2,
  TS_CUTOFFS_2023_SPECIAL,
  TS_CUTOFFS_2022_PHASE1,
} from "./ts-cutoffs-phases";

export interface HistoricalCutoffResult {
  avg: number;
  years: number[];
  dataYears: string[];
}

/** Historical cutoff lookup — weighted average (70% latest year, 30% older).
 *  Shared between EAPCET predictor and CollegeDetail (Q3). */
export function getHistoricalCutoff(
  code: string,
  branch: string,
  cat: Category,
  gen: Gender,
  collegeState?: string
): HistoricalCutoffResult {
  const cutoffSource = collegeState === "Telangana" ? TS_CUTOFFS[code] : AP_CUTOFFS[code];
  if (!cutoffSource) return { avg: 0, years: [], dataYears: [] };

  const ranks: number[] = [];
  const dataYears: string[] = [];
  const key = catKey(cat, gen);
  const fallbackKey = cat; // boys key as fallback
  const yearsToCheck = collegeState === "Telangana" ? TS_CUTOFF_YEARS : AP_CUTOFF_YEARS;
  const branchVariants = [branch, branch.toUpperCase(), branch.toLowerCase()];

  for (const year of yearsToCheck) {
    const yearData = cutoffSource[year];
    if (!yearData) continue;
    const matchedBranch = branchVariants.find(v => yearData[v]);
    if (!matchedBranch) continue;
    const val = yearData[matchedBranch][key] || (gen === "girls" ? 0 : yearData[matchedBranch][fallbackKey]);
    if (val && val > 0) {
      ranks.push(val);
      dataYears.push(year);
    }
  }

  if (ranks.length === 0) return { avg: 0, years: [], dataYears: [] };

  // Weighted average: 70% most recent, 30% older (yearsToCheck is newest-first)
  if (ranks.length === 1) return { avg: ranks[0], years: ranks, dataYears };
  const weighted = Math.round(ranks[0] * 0.7 + ranks[1] * 0.3);
  return { avg: weighted, years: ranks, dataYears };
}

// ─── Phase-wise predictor support (TGEAPCET only — APSCHE publishes final-phase PDFs only) ───

export type PredictorPhase = "final" | "phase1" | "phase2" | "special";

export const PREDICTOR_PHASES: { key: PredictorPhase; label: string }[] = [
  { key: "final", label: "Final Phase" },
  { key: "phase1", label: "Phase 1" },
  { key: "phase2", label: "Phase 2" },
  { key: "special", label: "Special Phase" },
];

/** Phase-specific data sources, newest-first. "final" uses TS_CUTOFFS (handled separately). */
const TS_PHASE_SOURCES: Record<
  Exclude<PredictorPhase, "final">,
  { src: Record<string, CollegeCutoffs>; year: string; label: string }[]
> = {
  phase1: [
    { src: TS_CUTOFFS_2023_PHASE1, year: "2023", label: "2023 P1" },
    { src: TS_CUTOFFS_2022_PHASE1, year: "2022", label: "2022 P1" },
  ],
  phase2: [{ src: TS_CUTOFFS_2023_PHASE2, year: "2023", label: "2023 P2" }],
  special: [{ src: TS_CUTOFFS_2023_SPECIAL, year: "2023", label: "2023 SP" }],
};

/** Phase-aware historical cutoff for Telangana colleges.
 *  "final" delegates to the standard weighted lookup (TS_CUTOFFS is final-phase data).
 *  Other phases use official TSCHE phase-wise Last Rank Statements; colleges/branches
 *  without data for the chosen phase return avg 0 (caller should exclude — no silent fallback). */
export function getTSPhaseHistoricalCutoff(
  code: string,
  branch: string,
  cat: Category,
  gen: Gender,
  phase: PredictorPhase
): HistoricalCutoffResult {
  if (phase === "final") return getHistoricalCutoff(code, branch, cat, gen, "Telangana");

  const ranks: number[] = [];
  const dataYears: string[] = [];
  const key = catKey(cat, gen);
  const branchVariants = [branch, branch.toUpperCase(), branch.toLowerCase()];

  for (const { src, year, label } of TS_PHASE_SOURCES[phase]) {
    const yearData = src[code]?.[year];
    if (!yearData) continue;
    const matchedBranch = branchVariants.find(v => yearData[v]);
    if (!matchedBranch) continue;
    const val = yearData[matchedBranch][key] || (gen === "girls" ? 0 : yearData[matchedBranch][cat]);
    if (val && val > 0) {
      ranks.push(val);
      dataYears.push(label);
    }
  }

  if (ranks.length === 0) return { avg: 0, years: [], dataYears: [] };
  if (ranks.length === 1) return { avg: ranks[0], years: ranks, dataYears };
  const weighted = Math.round(ranks[0] * 0.7 + ranks[1] * 0.3);
  return { avg: weighted, years: ranks, dataYears };
}
