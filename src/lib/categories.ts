/**
 * Category / gender constants and lookup helpers shared by AP & TS cutoff data.
 *
 * CLIENT-SAFE: deliberately contains no cutoff tables, so "use client" files
 * can import category lists and types without pulling the large AP/TS data
 * files into the browser bundle. The data files (ap-cutoffs.ts) re-export
 * everything here for backwards compatibility on the server side.
 */

export type Gender = "boys" | "girls";

export type Category =
  | "OC" | "SC" | "SC_I" | "SC_II" | "SC_III" | "ST"
  | "BC_A" | "BC_B" | "BC_C" | "BC_D" | "BC_E" | "EWS";

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "OC", label: "OC (Open Category)" },
  { key: "SC", label: "SC" },
  { key: "ST", label: "ST" },
  { key: "BC_A", label: "BC-A" },
  { key: "BC_B", label: "BC-B" },
  { key: "BC_C", label: "BC-C" },
  { key: "BC_D", label: "BC-D" },
  { key: "BC_E", label: "BC-E" },
  { key: "EWS", label: "EWS" },
];

/** Telangana category list. From TG EAPCET 2025 counselling, the SC quota is
 *  split into SC-I / SC-II / SC-III subcategories (official TGCHE
 *  categorisation). Earlier years have a single combined SC pool, so
 *  SC-I/II/III lookups fall back to the combined SC rank for pre-2025 data —
 *  factually correct, since those candidates were admitted under combined SC. */
export const TS_CATEGORIES: { key: Category; label: string }[] = [
  { key: "OC", label: "OC (Open Category)" },
  { key: "SC", label: "SC (combined, till 2024)" },
  { key: "SC_I", label: "SC-I (from 2025)" },
  { key: "SC_II", label: "SC-II (from 2025)" },
  { key: "SC_III", label: "SC-III (from 2025)" },
  { key: "ST", label: "ST" },
  { key: "BC_A", label: "BC-A" },
  { key: "BC_B", label: "BC-B" },
  { key: "BC_C", label: "BC-C" },
  { key: "BC_D", label: "BC-D" },
  { key: "BC_E", label: "BC-E" },
  { key: "EWS", label: "EWS" },
];

export interface BranchCutoffs { [category: string]: number; }
export interface YearCutoffs { [branch: string]: BranchCutoffs; }
export interface CollegeCutoffs { [year: string]: YearCutoffs; }

// Get the category key for a given gender. Boys = base key, Girls = key_G
export function catKey(cat: Category, gender: Gender): string {
  return gender === "girls" ? `${cat}_G` : cat;
}

// Get rank from branch cutoffs for given category + gender, with fallback
export function getRankForGender(cutoffs: BranchCutoffs, cat: Category, gender: Gender): number {
  const key = catKey(cat, gender);
  if (cutoffs[key]) return cutoffs[key];
  // TG SC subcategories (2025+): pre-2025 data has one combined SC pool, so
  // SC-I/II/III candidates were admitted under combined SC — fall back to it.
  if (cat === "SC_I" || cat === "SC_II" || cat === "SC_III") {
    const scKey = catKey("SC", gender);
    if (cutoffs[scKey]) return cutoffs[scKey];
    if (gender !== "girls" && cutoffs["SC"]) return cutoffs["SC"];
  }
  // If girls data unavailable, return 0 (not found) — don't silently fall back
  if (gender === "girls") return 0;
  return cutoffs[cat] || 0;
}
