import { COLLEGES, College } from '@/lib/colleges';
import { CUTOFF_TABLE_CODES } from '@/lib/cutoff-table-codes';

/**
 * Represents a comparison pair of colleges
 */
export interface ComparisonPair {
  college1: College;
  college2: College;
  slug: string;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Quality scoring & tiering
 *
 * Many COLLEGES rows have placeholder data (cutoff.cse=0, placements.avg=0,
 * naac="-", nirf=0). We can't generate a useful comparison page from rows
 * with no data, so the tiered generator below first computes a quality
 * score and only emits pairs from rows that actually have measurable
 * signal in at least two of the four dimensions (cutoff / placements /
 * NAAC / NIRF).
 * ────────────────────────────────────────────────────────────────────── */

const NAAC_BONUS: Record<string, number> = {
  "A++": 25,
  "A+": 18,
  "A": 12,
  "B++": 6,
  "B+": 4,
  "B": 2,
};

function naacBonus(grade: string): number {
  return NAAC_BONUS[grade?.trim()] ?? 0;
}

/**
 * Higher = better. Combines:
 *  - Cutoff inverse (lower CSE rank → higher score)
 *  - Placements average (LPA)
 *  - NIRF inverse (lower NIRF rank → higher score; missing = 0)
 *  - NAAC grade bonus
 *  - NBA bonus
 *
 * Scale is roughly comparable across tiers; deemed unis often have higher
 * placement avg but worse state cutoff ranks (because they don't admit
 * via EAPCET), so we don't penalize a missing cutoff — we just don't add
 * the cutoff component.
 */
export function qualityScore(c: College): number {
  let score = 0;
  if (c.cutoff.cse > 0) score += Math.min(40, 100000 / c.cutoff.cse);
  score += Math.min(40, c.placements.avg * 2.5); // 16 LPA → +40
  if (c.nirf > 0) score += Math.min(20, 400 / c.nirf); // NIRF 20 → +20, NIRF 200 → +2
  score += naacBonus(c.naac);
  if (c.nba) score += 5;
  return score;
}

/**
 * Table-aware cutoff signal. `cutoff.cse === 0` is common even for colleges
 * with real data — their ranks live only in the historical/phase tables.
 * This module is imported by a client page (/compare), so we can't import
 * cutoff-presence.ts (it would pull the multi-MB tables into the client
 * bundle); we use the generated, codes-only CUTOFF_TABLE_CODES instead.
 */
function hasCutoffSignal(c: College): boolean {
  return c.cutoff.cse > 0 || CUTOFF_TABLE_CODES.has(c.code);
}

/** Has at least *some* real data (not a placeholder row). */
function hasSignal(c: College): boolean {
  let dims = 0;
  if (hasCutoffSignal(c)) dims++;
  if (c.placements.avg > 0) dims++;
  if (c.nirf > 0) dims++;
  if (c.naac && c.naac !== "-" && c.naac !== "") dims++;
  return dims >= 2;
}

type Tier = "government" | "deemed" | "private";

function tierOf(c: College): Tier {
  if (c.type === "Government") return "government";
  if (c.type === "Deemed University" || c.type === "Private University") return "deemed";
  return "private";
}

/* ──────────────────────────────────────────────────────────────────────────
 * Pair generators
 * ────────────────────────────────────────────────────────────────────── */

function pairSlug(c1: College, c2: College): string {
  return `${c1.code.toLowerCase()}-vs-${c2.code.toLowerCase()}`;
}

function makePair(c1: College, c2: College): ComparisonPair {
  return { college1: c1, college2: c2, slug: pairSlug(c1, c2) };
}

/**
 * Same-district pairs (the original generator). Top 5 colleges per
 * district by CSE cutoff, then all combinations within. Captures
 * "CBIT vs MGIT (both Hyderabad)"-type queries.
 */
function generateDistrictPairs(): ComparisonPair[] {
  const byDistrict: Record<string, College[]> = {};
  COLLEGES.forEach(c => {
    (byDistrict[c.district] ||= []).push(c);
  });

  const pairs: ComparisonPair[] = [];
  for (const district of Object.keys(byDistrict).sort()) {
    const valid = byDistrict[district].filter(
      c => c.cutoff.cse > 0 && c.placements.avg > 0,
    );
    if (valid.length < 2) continue;
    const top = valid
      .sort((a, b) => a.cutoff.cse - b.cutoff.cse)
      .slice(0, 5);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        pairs.push(makePair(top[i], top[j]));
      }
    }
  }
  return pairs;
}

/**
 * Tier-based pairs — top N per tier, all in-tier combinations.
 * This is the SEO-targeted set: "GITAM vs SRM AP", "VNR VJIET vs CBIT",
 * "VIT-AP vs KL University". These pairs cross districts (and even
 * states) but compare apples-to-apples within a tier of institutions.
 */
function generateTierPairs(): ComparisonPair[] {
  const byTier: Record<Tier, College[]> = {
    government: [],
    deemed: [],
    private: [],
  };
  for (const c of COLLEGES) {
    if (!hasSignal(c)) continue;
    byTier[tierOf(c)].push(c);
  }

  const TOP: Record<Tier, number> = {
    government: 15,
    deemed: 18,
    private: 20,
  };

  const pairs: ComparisonPair[] = [];
  for (const tier of ["government", "deemed", "private"] as Tier[]) {
    const sorted = byTier[tier]
      .sort((a, b) => qualityScore(b) - qualityScore(a))
      .slice(0, TOP[tier]);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        pairs.push(makePair(sorted[i], sorted[j]));
      }
    }
  }
  return pairs;
}

/**
 * Cross-tier marquee pairs — high-search-volume comparisons that cross
 * tier boundaries (e.g., "BITS Hyderabad vs CBIT", "GITAM vs Anurag
 * University"). Top 6 from each tier, paired across tier boundaries.
 */
function generateCrossTierPairs(): ComparisonPair[] {
  const byTier: Record<Tier, College[]> = {
    government: [],
    deemed: [],
    private: [],
  };
  for (const c of COLLEGES) {
    if (!hasSignal(c)) continue;
    byTier[tierOf(c)].push(c);
  }

  const N = 6;
  const tops: Record<Tier, College[]> = {
    government: byTier.government.sort((a, b) => qualityScore(b) - qualityScore(a)).slice(0, N),
    deemed: byTier.deemed.sort((a, b) => qualityScore(b) - qualityScore(a)).slice(0, N),
    private: byTier.private.sort((a, b) => qualityScore(b) - qualityScore(a)).slice(0, N),
  };

  const pairs: ComparisonPair[] = [];
  const tierCombos: [Tier, Tier][] = [
    ["government", "deemed"],
    ["government", "private"],
    ["deemed", "private"],
  ];
  for (const [t1, t2] of tierCombos) {
    for (const c1 of tops[t1]) {
      for (const c2 of tops[t2]) {
        pairs.push(makePair(c1, c2));
      }
    }
  }
  return pairs;
}

/**
 * Build the final ALL_PAIRS list — district + in-tier + cross-tier,
 * deduped on canonical slug. Order: cross-tier marquee first (highest
 * search-intent), then in-tier, then same-district fallback.
 */
function generateAllPairs(): ComparisonPair[] {
  const seen = new Set<string>();
  const out: ComparisonPair[] = [];

  const push = (p: ComparisonPair) => {
    // Canonical slug ignores order (cbit-vs-vasv ≡ vasv-vs-cbit)
    const codes = [p.college1.code, p.college2.code].sort();
    if (codes[0] === codes[1]) return; // no self-pairs
    const canon = codes.join("|");
    if (seen.has(canon)) return;
    seen.add(canon);
    out.push(p);
  };

  for (const p of generateCrossTierPairs()) push(p);
  for (const p of generateTierPairs()) push(p);
  for (const p of generateDistrictPairs()) push(p);

  // Generous cap — sitemap can comfortably handle this many static pages.
  return out.slice(0, 2500);
}

// Cache the generated pairs
const ALL_PAIRS = generateAllPairs();

/**
 * Get a comparison pair by slug (e.g., "cbit-vs-vasv").
 * First checks the pre-generated ALL_PAIRS list, then falls back to parsing
 * the slug as "{code1}-vs-{code2}" and looking up both codes in COLLEGES.
 * This lets us resolve arbitrary cross-links (e.g. the "Compare vs X" button
 * on the college detail page) without pre-generating every possible pair.
 * Returns null only if the slug is malformed or one/both codes don't exist.
 */
export function getComparisonPair(slug: string, colleges: College[] = COLLEGES): ComparisonPair | null {
  // Fallback: parse slug as "{code1}-vs-{code2}" (codes are lowercase in URLs,
  // but COLLEGES stores them uppercase — normalize for comparison).
  const match = slug.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  const [, rawCode1, rawCode2] = match;
  if (rawCode1 === rawCode2) return null; // no self-comparisons
  const code1 = rawCode1.toUpperCase();
  const code2 = rawCode2.toUpperCase();
  const college1 = colleges.find(c => c.code === code1);
  const college2 = colleges.find(c => c.code === code2);
  if (!college1 || !college2) return null;
  return { college1, college2, slug };
}

/**
 * Get all valid comparison pair slugs
 * Used for static generation in Next.js
 */
export function getAllPairSlugs(): string[] {
  return ALL_PAIRS.map(pair => pair.slug);
}

/**
 * Get the total number of comparison pairs available
 */
export function getTotalPairs(): number {
  return ALL_PAIRS.length;
}

/**
 * Get the most "marquee" pairs first — cross-tier and in-tier top-N pairs
 * are emitted before district fallback pairs by generateAllPairs ordering.
 * Useful for /compare landing pages that want to surface high-intent links.
 */
export function getFeaturedPairs(limit: number = 60): ComparisonPair[] {
  return ALL_PAIRS.slice(0, limit);
}
