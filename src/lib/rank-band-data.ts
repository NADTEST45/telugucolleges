import { COLLEGES, type College } from "@/lib/colleges";
import { TS_CUTOFFS } from "@/lib/ts-cutoffs";
import { AP_CUTOFFS } from "@/lib/ap-cutoffs";

/* ──────────────────────────────────────────────────────────────────────────
 * Rank-band landing pages — net-new SEO surfaces at /eapcet/rank/[slug].
 *
 * Why these pages exist:
 * Counselling-season search is dominated by queries like "15000 rank ts
 * eamcet colleges", "best colleges for 30000 rank ap eamcet" and
 * "what colleges I can get with 50000 rank in eamcet". Our /eapcet
 * predictor is interactive — useful once a user lands, but Googlebot
 * doesn't fill in forms, so the predictor itself doesn't rank for
 * these long-tail queries.
 *
 * These per-band pages are the static, indexable answer for those
 * queries: one URL per (rank-band × branch × state) combination, each
 * pre-listing the top colleges where that rank is realistic for the
 * convenor-quota (general / OC) closing cutoff.
 *
 * Bands × branches × states = 10 × 10 × 2 = 200 pages.
 * ────────────────────────────────────────────────────────────────────── */

export const RANK_BANDS = [
  1000, 2500, 5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000,
] as const;

export type RankBandSlug = string;

export interface BranchOption {
  /** URL slug — e.g. "cse" */
  slug: string;
  /** Display label */
  label: string;
  /** Branch code in TS_CUTOFFS (uppercase) */
  tsCode: string;
  /** Branch code in AP_CUTOFFS (lowercase) */
  apCode: string;
}

// NOTE: branch slugs MUST be a single lowercase token ([a-z]+) — parseRankBandSlug's
// regex cannot parse hyphens/underscores in the branch segment. tsCode/apCode pairings
// below were verified against TS_CUTOFFS / AP_CUTOFFS keys (same program on both sides;
// e.g. CSE-AI&ML = TS "CSM" + AP "cse_aiml", NOT the standalone "AI & ML" = TS "AIM").
export const BRANCH_OPTIONS: BranchOption[] = [
  { slug: "cse",   label: "CSE",                  tsCode: "CSE",  apCode: "cse" },
  { slug: "ece",   label: "ECE",                  tsCode: "ECE",  apCode: "ece" },
  { slug: "eee",   label: "EEE",                  tsCode: "EEE",  apCode: "eee" },
  { slug: "mech",  label: "Mechanical",           tsCode: "MEC",  apCode: "mech" },
  { slug: "civil", label: "Civil",                tsCode: "CIV",  apCode: "civil" },
  { slug: "it",    label: "IT",                   tsCode: "INF",  apCode: "it" },
  { slug: "csm",   label: "CSE (AI & ML)",        tsCode: "CSM",  apCode: "cse_aiml" },
  { slug: "csd",   label: "CSE (Data Science)",   tsCode: "CSD",  apCode: "cse_ds" },
  { slug: "aid",   label: "AI & Data Science",    tsCode: "AID",  apCode: "ai_ds" },
  { slug: "csc",   label: "CSE (Cyber Security)", tsCode: "CSC",  apCode: "csc" },
];

export interface StateOption {
  /** URL slug — e.g. "telangana" */
  slug: string;
  /** "Telangana" or "Andhra Pradesh" — matches College.state */
  full: "Telangana" | "Andhra Pradesh";
  /** Short display label */
  short: "TS" | "AP";
  /** Exam name */
  exam: "TG EAPCET" | "AP EAPCET";
  /** Most-recent cutoff year string used for closing-rank lookup */
  refYear: "2024" | "2023";
}

export const STATE_OPTIONS: StateOption[] = [
  {
    slug: "telangana",
    full: "Telangana",
    short: "TS",
    exam: "TG EAPCET",
    refYear: "2024",
  },
  {
    slug: "andhra-pradesh",
    full: "Andhra Pradesh",
    short: "AP",
    exam: "AP EAPCET",
    refYear: "2023",
  },
];

/**
 * Parse a rank-band slug. Format: `<rank>-<branch>-<state>`
 * Examples:
 *   "15000-cse-telangana"
 *   "30000-ece-andhra-pradesh"
 *   "5000-civil-telangana"
 *
 * Returns null if the slug is malformed or any component is unknown,
 * which the page will translate into a real 404 via notFound().
 */
export interface ParsedRankBand {
  rank: number;
  branch: BranchOption;
  state: StateOption;
}

export function parseRankBandSlug(slug: string): ParsedRankBand | null {
  // Match: digits, hyphen, branch slug, hyphen, state slug
  const m = slug.match(/^(\d+)-([a-z]+)-([a-z-]+)$/);
  if (!m) return null;
  const rank = parseInt(m[1], 10);
  if (!Number.isFinite(rank) || rank <= 0 || rank > 1_000_000) return null;
  const branch = BRANCH_OPTIONS.find(b => b.slug === m[2]);
  if (!branch) return null;
  const state = STATE_OPTIONS.find(s => s.slug === m[3]);
  if (!state) return null;
  // Only enumerate exact bands in generateStaticParams; anything else
  // can still be routed via dynamicParams=true on the page if desired.
  return { rank, branch, state };
}

/** Build a slug from components. Inverse of parseRankBandSlug. */
export function buildRankBandSlug(rank: number, branch: BranchOption, state: StateOption): string {
  return `${rank}-${branch.slug}-${state.slug}`;
}

/**
 * Enumerate every (rank × branch × state) combination as a slug.
 * Used by generateStaticParams() and sitemap.ts.
 */
export function getAllRankBandSlugs(): string[] {
  const out: string[] = [];
  for (const r of RANK_BANDS) {
    for (const b of BRANCH_OPTIONS) {
      for (const s of STATE_OPTIONS) {
        out.push(buildRankBandSlug(r, b, s));
      }
    }
  }
  return out;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Data-resolution helpers.
 *
 * Closing-rank lookups use the OC (Open Category) boys cutoff because
 * that's the most-searched variant and the most defensible default for
 * a public landing page; the predictor handles per-category personalisation.
 * ────────────────────────────────────────────────────────────────────── */

/**
 * Look up the OC boys closing rank for a college × branch × state in the
 * most recent published year, falling back to the prior year if needed.
 * Returns 0 when no data exists, so callers can treat 0 as "no signal".
 */
export function getOcClosingRank(
  collegeCode: string,
  branch: BranchOption,
  state: StateOption,
): number {
  if (state.full === "Telangana") {
    const college = TS_CUTOFFS[collegeCode];
    if (!college) return 0;
    const branchKey = branch.tsCode;
    const yearData = college[state.refYear] || college["2023"];
    const branchData = yearData?.[branchKey];
    return branchData?.OC || 0;
  } else {
    const college = AP_CUTOFFS[collegeCode];
    if (!college) return 0;
    const branchKey = branch.apCode;
    const yearData = college[state.refYear] || college["2022"];
    const branchData = yearData?.[branchKey];
    return branchData?.OC || 0;
  }
}

export interface RankBandMatch {
  college: College;
  closingRank: number;
}

/**
 * Find colleges where OC closing rank ≥ targetRank (i.e. the user's
 * rank is at or better than what the college admitted last year, so
 * admission is realistic). Sort ascending by closing rank — best
 * (most competitive) colleges first — and cap at 40.
 *
 * Why ascending: the user wants to see the *best* college they could
 * realistically get, not the worst. Showing the toughest (lowest
 * closing-rank, meaning hardest to crack) college first is what they
 * want at the top; we're trying to maximise their college choice
 * within their reach.
 */
export function getCollegesForBand(parsed: ParsedRankBand): RankBandMatch[] {
  const { rank, branch, state } = parsed;
  const matches: RankBandMatch[] = [];
  for (const c of COLLEGES) {
    if (c.state !== state.full) continue;
    const closing = getOcClosingRank(c.code, branch, state);
    if (closing <= 0) continue;
    if (closing < rank) continue; // college is out of reach
    matches.push({ college: c, closingRank: closing });
  }
  matches.sort((a, b) => a.closingRank - b.closingRank);
  return matches.slice(0, 40);
}
