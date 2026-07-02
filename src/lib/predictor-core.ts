/**
 * Predictor classification core — the SINGLE source of truth for safe /
 * moderate / reach thresholds, shared by every predictor surface (the
 * /eapcet hub via /api/predict, the web-options generator, and any tests).
 *
 * CLIENT-SAFE: no cutoff-table imports. Keep it that way — "use client"
 * files may import types/constants from here freely.
 *
 * Classification factors (lower rank = better closing rank).
 *
 * Closing ranks drift *outward* across counselling phases and from year to
 * year (more seats open up, candidates above you take other options), so the
 * "reach" window is deliberately wider than the "safe" margin — a rank a third
 * past last year's published close is still realistically allottable in a later
 * phase, and every major EAMCET/EAPCET predictor keeps those on the list rather
 * than dropping them. Bands (relative to the reference closing rank):
 *
 *  - safe:     rank is comfortably inside the close (≤ 80% of it) — should hold
 *              even if the cutoff tightens next phase.
 *  - moderate: rank is at or just inside the close (≤ 105%) — competitive but
 *              the usual outward drift makes it likely.
 *  - reach:    rank is up to 35% beyond the close — plausible only in later
 *              phases / a softer year; the "ambitious" tier.
 *  - excluded: more than 35% beyond — out of realistic range, omitted.
 */

export type Safety = "safe" | "moderate" | "reach";

export const SAFE_FACTOR = 0.8;
export const MODERATE_FACTOR = 1.05;
export const REACH_FACTOR = 1.35;

export function classify(rank: number, closing: number): Safety | null {
  if (closing <= 0) return null;
  if (rank > closing * REACH_FACTOR) return null;
  if (rank <= closing * SAFE_FACTOR) return "safe";
  if (rank <= closing * MODERATE_FACTOR) return "moderate";
  return "reach";
}

// Web-options ordering: enter your most ambitious reachable options FIRST, then
// moderate, then safe fallbacks last — the order every counselling guide
// recommends, because the engine allots your highest feasible preference and
// you want a safe option only as a backstop. Lower = listed earlier.
export const SAFETY_ORDER: Record<Safety, number> = { reach: 0, moderate: 1, safe: 2 };

/** Display labels used by the /eapcet hub UI. */
export const SAFETY_LABEL: Record<Safety, "Safe" | "Moderate" | "Reach"> = {
  safe: "Safe",
  moderate: "Moderate",
  reach: "Reach",
};

// ─── Phase-wise predictor support (TGEAPCET only — APSCHE publishes final-phase PDFs only) ───

export type PredictorPhase = "final" | "phase1" | "phase2" | "special";

export const PREDICTOR_PHASES: { key: PredictorPhase; label: string }[] = [
  { key: "final", label: "Final Phase" },
  { key: "phase1", label: "Phase 1" },
  { key: "phase2", label: "Phase 2" },
  { key: "special", label: "Special Phase" },
];

/** Slim result row returned by /api/predict — keep this in sync with the
 *  route handler. Deliberately excludes the full College object so the
 *  client bundle never needs colleges.ts. */
export interface PredictApiRow {
  id: number;
  slug: string;
  name: string;
  district: string;
  fee: number;
  cutoff: number;
  chance: "Safe" | "Moderate" | "Reach";
  isHistorical: boolean;
  dataYears: string[];
  estPct: number | null;
}
