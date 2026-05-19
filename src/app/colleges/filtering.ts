import { COLLEGES, type College } from "@/lib/colleges";
import {
  isEngineeringCollege,
  isPharmacyCollege,
  isMedicalCollege,
} from "@/lib/branch-constants";

/**
 * URL search-param contract for /colleges.
 * Kept as a single shape so the server filter and the client filter bar
 * stay in sync. All values are strings (or empty) — never null/undefined.
 *
 * Note: `q` is the search query (was `search` in the old client page).
 */
export interface CollegesFilters {
  q: string;
  state: string;
  district: string;
  affiliation: string;
  maxFee: string;
  naac: string;
  category: string;
  section: string;
  sort: string;
}

export const DEFAULT_FILTERS: CollegesFilters = {
  q: "",
  state: "",
  district: "",
  affiliation: "",
  maxFee: "",
  naac: "",
  category: "",
  section: "",
  sort: "name",
};

const VALID_CATEGORIES = new Set(["engineering", "pharmacy", "medical"]);
const VALID_SORTS = new Set(["name", "fee_low", "fee_high", "placements", "cutoff", "nirf"]);
const VALID_NAAC = new Set(["rated", "A+", "A"]);
const VALID_STATES = new Set(["Telangana", "Andhra Pradesh"]);
const VALID_SECTIONS = new Set([
  "Government",
  "Private",
  "Deemed University",
  "Private University",
]);

/** Coerce a `searchParams` record (string | string[] | undefined) into a single string. */
function first(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

/**
 * Parse + validate a `searchParams` record into the filter shape.
 * Unknown values are silently dropped (defends against bookmark/share
 * URLs from older versions of the app).
 */
export function parseFilters(
  raw: Record<string, string | string[] | undefined> | undefined,
): CollegesFilters {
  const r = raw ?? {};
  const category = first(r.category);
  const sort = first(r.sort);
  const naac = first(r.naac);
  const state = first(r.state);
  const section = first(r.section);
  return {
    q: first(r.q).slice(0, 100),
    state: VALID_STATES.has(state) ? state : "",
    district: first(r.district).slice(0, 100),
    affiliation: first(r.affiliation).slice(0, 100),
    maxFee: first(r.maxFee),
    naac: VALID_NAAC.has(naac) ? naac : "",
    category: VALID_CATEGORIES.has(category) ? category : "",
    section: VALID_SECTIONS.has(section) ? section : "",
    sort: VALID_SORTS.has(sort) ? sort : "name",
  };
}

/** Pure filter + sort. Identical semantics to the previous client-side logic. */
export function filterAndSort(filters: CollegesFilters): College[] {
  const q = filters.q.toLowerCase();
  const maxFee = filters.maxFee ? parseInt(filters.maxFee, 10) : 0;

  const list = COLLEGES.filter(c => {
    if (q) {
      const inName = c.name.toLowerCase().includes(q);
      const inDistrict = c.district.toLowerCase().includes(q);
      const inCode = c.code.toLowerCase().includes(q);
      if (!inName && !inDistrict && !inCode) return false;
    }
    if (filters.state && c.state !== filters.state) return false;
    if (filters.district && c.district !== filters.district) return false;
    if (filters.affiliation && c.affiliation !== filters.affiliation) return false;
    if (filters.section && c.type !== filters.section) return false;
    if (maxFee && c.fee > maxFee) return false;
    if (filters.naac === "rated" && (!c.naac || c.naac === "-")) return false;
    if (filters.naac === "A+" && c.naac !== "A+" && c.naac !== "A++") return false;
    if (filters.naac === "A" && c.naac !== "A" && c.naac !== "A+" && c.naac !== "A++") return false;
    if (filters.category === "engineering" && !isEngineeringCollege(c.branches)) return false;
    if (filters.category === "pharmacy" && !isPharmacyCollege(c.branches)) return false;
    if (filters.category === "medical" && !isMedicalCollege(c.branches)) return false;
    return true;
  });

  switch (filters.sort) {
    case "fee_low":
      list.sort((a, b) => a.fee - b.fee);
      break;
    case "fee_high":
      list.sort((a, b) => b.fee - a.fee);
      break;
    case "placements":
      list.sort((a, b) => b.placements.avg - a.placements.avg);
      break;
    case "cutoff":
      list.sort((a, b) => {
        if (!a.cutoff.cse && !b.cutoff.cse) return 0;
        if (!a.cutoff.cse) return 1;
        if (!b.cutoff.cse) return -1;
        return a.cutoff.cse - b.cutoff.cse;
      });
      break;
    case "nirf":
      list.sort((a, b) => {
        if (a.nirf === 0 && b.nirf === 0) return 0;
        if (a.nirf === 0) return 1;
        if (b.nirf === 0) return -1;
        return a.nirf - b.nirf;
      });
      break;
    case "name":
    default:
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return list;
}

/** Per-section count for the currently-selected state filter (or all states). */
export function sectionCounts(stateFilter: string): Record<string, number> {
  const subset = stateFilter ? COLLEGES.filter(c => c.state === stateFilter) : COLLEGES;
  const m: Record<string, number> = {};
  for (const c of subset) m[c.type] = (m[c.type] || 0) + 1;
  return m;
}

/** Districts available for the currently-selected state (or all). */
export function districtsForState(stateFilter: string): string[] {
  const cs = stateFilter ? COLLEGES.filter(c => c.state === stateFilter) : COLLEGES;
  return [...new Set(cs.map(c => c.district))].sort();
}

/** All affiliations across the dataset — stable list for the dropdown. */
export const ALL_AFFILIATIONS: string[] = [
  ...new Set(COLLEGES.map(c => c.affiliation)),
].sort();

export const TOTAL_AP = COLLEGES.filter(c => c.state === "Andhra Pradesh").length;
export const TOTAL_TS = COLLEGES.filter(c => c.state === "Telangana").length;
export const TOTAL_ALL = COLLEGES.length;
