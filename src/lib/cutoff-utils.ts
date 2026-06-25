import { AP_CUTOFFS, AP_CUTOFF_YEARS, getRankForGender, type Category, type Gender, type CollegeCutoffs } from "./ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "./ts-cutoffs";
import {
  TS_CUTOFFS_2025_PHASE1,
  TS_CUTOFFS_2025_PHASE2,
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
/** Expand a branch (single code or list of equivalent codes) into all the
 *  case variants we may encounter across AP (lowercase) and TS (uppercase) data. */
function branchVariantsOf(branch: string | string[]): string[] {
  const list = Array.isArray(branch) ? branch : [branch];
  return [...new Set(list.flatMap(b => [b, b.toUpperCase(), b.toLowerCase()]))];
}

export function getHistoricalCutoff(
  code: string,
  branch: string | string[],
  cat: Category,
  gen: Gender,
  collegeState?: string
): HistoricalCutoffResult {
  const cutoffSource = collegeState === "Telangana" ? TS_CUTOFFS[code] : AP_CUTOFFS[code];
  if (!cutoffSource) return { avg: 0, years: [], dataYears: [] };

  const ranks: number[] = [];
  const dataYears: string[] = [];
  const yearsToCheck = collegeState === "Telangana" ? TS_CUTOFF_YEARS : AP_CUTOFF_YEARS;
  const branchVariants = branchVariantsOf(branch);

  for (const year of yearsToCheck) {
    const yearData = cutoffSource[year];
    if (!yearData) continue;
    const matchedBranch = branchVariants.find(v => yearData[v]);
    if (!matchedBranch) continue;
    const val = getRankForGender(yearData[matchedBranch], cat, gen);
    if (val && val > 0) {
      ranks.push(val);
      dataYears.push(year);
    }
  }

  if (ranks.length === 0) return { avg: 0, years: [], dataYears: [] };
  return { avg: weightedCutoff(ranks), years: ranks, dataYears };
}

/** Recency-weighted closing-rank estimate (ranks are newest-first).
 *  1 yr → that year; 2 yrs → 70/30; 3+ yrs → 50/30/20 over the latest three.
 *  Using a third year (when available) hardens the estimate against a single
 *  anomalous phase instead of discarding it as the old 70/30 blend did. */
export function weightedCutoff(ranks: number[]): number {
  if (ranks.length === 1) return ranks[0];
  if (ranks.length === 2) return Math.round(ranks[0] * 0.7 + ranks[1] * 0.3);
  return Math.round(ranks[0] * 0.5 + ranks[1] * 0.3 + ranks[2] * 0.2);
}

/**
 * Rough seat-allotment probability estimate for a single college+branch+
 * category+gender, given the candidate rank and the set of historical closing
 * ranks (the `years` array from a HistoricalCutoffResult — one closing rank per
 * available year/phase, any order).
 *
 * THIS IS AN ESTIMATE, NOT A GUARANTEE. It is derived purely from how the
 * candidate's rank sits relative to past closing ranks; it cannot know this
 * year's seat matrix, reservation shifts, or option-order effects. We therefore:
 *   - require at least MIN_POINTS historical closes, else return null (show no %)
 *   - cap the output to [LOW_FLOOR, HIGH_CAP] so we never claim certainty
 *
 * Model (lower rank = better):
 *   - Let beaten = fraction of historical closes whose rank >= candidate rank
 *     (i.e. the candidate would have made it in those years).
 *   - Anchor probability on `beaten`, then nudge by how far inside/outside the
 *     historical spread the rank sits (margin), so being far clear of every
 *     close trends toward HIGH_CAP and being well past the worst close trends
 *     toward LOW_FLOOR.
 *
 * Returns an integer percentage, or null when there isn't enough data.
 */
const PROB_MIN_POINTS = 2;
const PROB_LOW_FLOOR = 8;
const PROB_HIGH_CAP = 92;

export function estimateAllotmentChance(
  rank: number,
  historicalCloses: number[]
): number | null {
  const closes = historicalCloses.filter(v => Number.isFinite(v) && v > 0);
  if (rank <= 0 || closes.length < PROB_MIN_POINTS) return null;

  const min = Math.min(...closes);
  const max = Math.max(...closes);

  // Fraction of years the candidate's rank would have been within the close.
  const beaten = closes.filter(c => c >= rank).length / closes.length;

  // Position of rank within [min, max] spread (0 = at best close, 1 = at worst).
  // Clamped; used to smooth the step function that `beaten` alone would give.
  let pos: number;
  if (max === min) {
    pos = rank <= min ? 0 : 1;
  } else {
    pos = (rank - min) / (max - min);
  }
  pos = Math.max(0, Math.min(1, pos));

  // Base from `beaten` (0..1 → floor..cap), then blend the within-spread
  // position so closely-bunched closes still produce a sensible gradient.
  const base = PROB_LOW_FLOOR + beaten * (PROB_HIGH_CAP - PROB_LOW_FLOOR);
  const spreadAdj = (1 - pos) * (PROB_HIGH_CAP - PROB_LOW_FLOOR);
  let pct = 0.65 * base + 0.35 * (PROB_LOW_FLOOR + spreadAdj);

  // Hard tails: clearly better than every close → near cap; clearly worse than
  // the worst close (with a small buffer) → near floor.
  if (rank <= min) pct = Math.max(pct, PROB_HIGH_CAP - 4);
  if (rank > max * 1.1) pct = Math.min(pct, PROB_LOW_FLOOR + 6);

  return Math.round(Math.max(PROB_LOW_FLOOR, Math.min(PROB_HIGH_CAP, pct)));
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
    { src: TS_CUTOFFS_2025_PHASE1, year: "2025", label: "2025 P1" },
    { src: TS_CUTOFFS_2023_PHASE1, year: "2023", label: "2023 P1" },
    { src: TS_CUTOFFS_2022_PHASE1, year: "2022", label: "2022 P1" },
  ],
  phase2: [
    { src: TS_CUTOFFS_2025_PHASE2, year: "2025", label: "2025 P2" },
    { src: TS_CUTOFFS_2023_PHASE2, year: "2023", label: "2023 P2" },
  ],
  special: [{ src: TS_CUTOFFS_2023_SPECIAL, year: "2023", label: "2023 SP" }],
};

/** Phase-aware historical cutoff for Telangana colleges.
 *  "final" delegates to the standard weighted lookup (TS_CUTOFFS is final-phase data).
 *  Other phases use official TSCHE phase-wise Last Rank Statements; colleges/branches
 *  without data for the chosen phase return avg 0 (caller should exclude — no silent fallback). */
export function getTSPhaseHistoricalCutoff(
  code: string,
  branch: string | string[],
  cat: Category,
  gen: Gender,
  phase: PredictorPhase
): HistoricalCutoffResult {
  if (phase === "final") return getHistoricalCutoff(code, branch, cat, gen, "Telangana");

  const ranks: number[] = [];
  const dataYears: string[] = [];
  const branchVariants = branchVariantsOf(branch);

  for (const { src, year, label } of TS_PHASE_SOURCES[phase]) {
    const yearData = src[code]?.[year];
    if (!yearData) continue;
    const matchedBranch = branchVariants.find(v => yearData[v]);
    if (!matchedBranch) continue;
    const val = getRankForGender(yearData[matchedBranch], cat, gen);
    if (val && val > 0) {
      ranks.push(val);
      dataYears.push(label);
    }
  }

  if (ranks.length === 0) return { avg: 0, years: [], dataYears: [] };
  return { avg: weightedCutoff(ranks), years: ranks, dataYears };
}
