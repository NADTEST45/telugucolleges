/**
 * Merges static COLLEGES data with dynamic overrides from Supabase.
 * Used at build time to apply approved edits.
 */
import "server-only";
import { cache } from "react";
import { COLLEGES, type College } from "./colleges";
import { applyCollegeOverrides, type CollegeOverride } from "./college-overrides";

/**
 * Get all colleges with approved overrides applied.
 * For now reads from env/fetch; in production would query Supabase at build time.
 */
async function loadCollegesMerged(): Promise<College[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      // No Supabase configured — return static data
      return COLLEGES;
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/college_overrides?select=college_code,field_name,value`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      next: { revalidate: 60, tags: ["college-overrides"] },
    });

    if (!res.ok) return COLLEGES;

    const overrides: CollegeOverride[] = await res.json();

    if (!overrides || overrides.length === 0) return COLLEGES;

    // Group overrides by college_code
    const byCode = new Map<string, CollegeOverride[]>();
    for (const ov of overrides) {
      if (!byCode.has(ov.college_code)) byCode.set(ov.college_code, []);
      byCode.get(ov.college_code)!.push(ov);
    }

    // Apply overrides
    return COLLEGES.map(c => {
      const collegeOverrides = byCode.get(c.code);
      return collegeOverrides ? applyCollegeOverrides(c, collegeOverrides) : c;
    });
  } catch (err) {
    // Failed to fetch overrides — returning static data
    return COLLEGES;
  }
}

/** Request-deduped canonical public college repository. */
export const getCollegesMerged = cache(loadCollegesMerged);

/**
 * Look up a single college by slug, with approved overrides applied.
 * Server-side only (uses service key). Cached for 60s via ISR.
 */
export async function getCollegeBySlugMerged(slug: string): Promise<College | undefined> {
  const merged = await getCollegesMerged();
  return merged.find(c => c.slug === slug);
}
