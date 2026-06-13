/**
 * Server-only helper that makes the indexing/quality signal aware of the
 * historical cutoff tables.
 *
 * `hasRealData(c)` (in colleges.ts) treats `cutoff.cse > 0` as one quality
 * signal. But the summary `cutoff.cse` is just the "current year" column and
 * is blank (0) for ~119 colleges whose genuine EAPCET cutoff data lives only
 * in the historical/phase tables (AP_CUTOFFS / TS_CUTOFFS). Those colleges
 * were losing a signal, and a handful (e.g. BREW, GURU, HITM, JBIT, MLID,
 * SRYS, STLW, VITS, VJIT) dropped below the 2-signal threshold and got
 * wrongly `noindex`-ed + excluded from the sitemap despite having real data.
 *
 * This module imports the (large) cutoff tables, so it must only ever be
 * imported from SERVER files (sitemap, route `generateMetadata`). Importing it
 * into colleges.ts would pull the cutoff data into the client bundle, which is
 * exactly what the original split avoided — do not do that.
 */
import { AP_CUTOFFS } from "./ap-cutoffs";
import { TS_CUTOFFS } from "./ts-cutoffs";
import { hasRealData, type College } from "./colleges";

/** Set of college codes that have at least one entry in the cutoff tables. */
export const CUTOFF_DATA_CODES: ReadonlySet<string> = new Set<string>([
  ...Object.keys(AP_CUTOFFS),
  ...Object.keys(TS_CUTOFFS),
]);

/** True when the college has real cutoff data (summary OR historical tables). */
export function hasCutoffData(c: College): boolean {
  return c.cutoff.cse > 0 || CUTOFF_DATA_CODES.has(c.code);
}

/**
 * Table-aware version of `hasRealData` for noindex / sitemap decisions.
 * Preserves the ≥2-signal rule; only the cutoff signal becomes table-aware.
 */
export function isIndexable(c: College): boolean {
  return hasRealData(c, hasCutoffData(c));
}
