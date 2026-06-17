/**
 * Reservation-aware EAPCET/EAMCET college predictor + web-options generator.
 *
 * SERVER-ONLY: imports cutoff-utils, which pulls in the large AP/TS cutoff
 * tables. Only import this from server components / route handlers — never
 * from a "use client" file (that would ship the cutoff tables to the browser,
 * violating the bundle rule in CLAUDE.md).
 *
 * Given a candidate's rank + category + gender + state + chosen branches, we
 * resolve each college/branch closing rank for THAT category+gender (weighted
 * across the available years via getHistoricalCutoff) and classify the chance
 * as safe / moderate / reach. The full list, ordered best-college-first,
 * doubles as a suggested web-options preference order.
 */
import { COLLEGES, type College } from "@/lib/colleges";
import { getHistoricalCutoff } from "@/lib/cutoff-utils";
import type { Category, Gender } from "@/lib/ap-cutoffs";
import {
  BRANCH_OPTIONS,
  STATE_OPTIONS,
  type BranchOption,
  type StateOption,
} from "@/lib/rank-band-data";

export type Safety = "safe" | "moderate" | "reach";

export interface PredictMatch {
  college: College;
  branch: BranchOption;
  /** Reference closing rank for the chosen category + gender (weighted avg). */
  closingRank: number;
  /** Which data years backed the closing rank (for transparency). */
  dataYears: string[];
  safety: Safety;
}

export interface PredictInput {
  rank: number;
  state: StateOption;
  category: Category;
  gender: Gender;
  branches: BranchOption[];
}

/**
 * Classification factors (lower rank = better):
 *  - safe:     candidate rank is at least 15% better than last closing rank
 *  - moderate: candidate rank is at or just within the closing rank
 *  - reach:    candidate rank is up to 15% beyond — plausible in later phases
 *  - excluded: more than 15% beyond the closing rank
 */
const SAFE_FACTOR = 0.85;
const REACH_FACTOR = 1.15;
const MAX_RESULTS = 120;

export function classify(rank: number, closing: number): Safety | null {
  if (closing <= 0) return null;
  if (rank > closing * REACH_FACTOR) return null;
  if (rank <= closing * SAFE_FACTOR) return "safe";
  if (rank <= closing) return "moderate";
  return "reach";
}

export function predict(input: PredictInput): PredictMatch[] {
  const { rank, state, category, gender, branches } = input;
  const out: PredictMatch[] = [];

  for (const c of COLLEGES) {
    if (c.state !== state.full) continue;
    for (const b of branches) {
      const res = getHistoricalCutoff(
        c.code,
        [b.tsCode, b.apCode],
        category,
        gender,
        state.full,
      );
      const safety = classify(rank, res.avg);
      if (!safety) continue;
      out.push({
        college: c,
        branch: b,
        closingRank: res.avg,
        dataYears: res.dataYears,
        safety,
      });
    }
  }

  // Best (most competitive = lowest closing rank) first. This ordering is the
  // suggested web-options preference order: list your strongest reachable
  // options at the top of your counselling preference list.
  out.sort((a, b) => a.closingRank - b.closingRank);
  return out.slice(0, MAX_RESULTS);
}

export interface SafetyCounts {
  safe: number;
  moderate: number;
  reach: number;
  total: number;
}

export function countBySafety(matches: PredictMatch[]): SafetyCounts {
  const c: SafetyCounts = { safe: 0, moderate: 0, reach: 0, total: matches.length };
  for (const m of matches) c[m.safety]++;
  return c;
}

/* ── searchParams parsing helpers (keep the page lean) ─────────────────── */

const VALID_CATEGORIES: Category[] = [
  "OC", "SC", "SC_I", "SC_II", "SC_III", "ST",
  "BC_A", "BC_B", "BC_C", "BC_D", "BC_E", "EWS",
];

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseState(v: string | string[] | undefined): StateOption {
  const slug = first(v);
  return STATE_OPTIONS.find(s => s.slug === slug) ?? STATE_OPTIONS[0];
}

export function parseCategory(v: string | string[] | undefined): Category {
  const c = first(v) as Category | undefined;
  return c && VALID_CATEGORIES.includes(c) ? c : "OC";
}

export function parseGender(v: string | string[] | undefined): Gender {
  return first(v) === "girls" ? "girls" : "boys";
}

export function parseRank(v: string | string[] | undefined): number | null {
  const n = parseInt(first(v) ?? "", 10);
  return Number.isFinite(n) && n > 0 && n <= 1_000_000 ? n : null;
}

export function parseBranches(v: string | string[] | undefined): BranchOption[] {
  const slugs = (Array.isArray(v) ? v : v ? [v] : []).flatMap(s => s.split(","));
  const picked = BRANCH_OPTIONS.filter(b => slugs.includes(b.slug));
  return picked.length ? picked : [BRANCH_OPTIONS[0]]; // default: CSE
}
