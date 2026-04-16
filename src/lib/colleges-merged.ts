/**
 * Merges static COLLEGES data with dynamic overrides from Supabase.
 * Used at build time to apply approved edits.
 */
import { COLLEGES, type College } from "./colleges";

interface Override {
  college_code: string;
  field_name: string;
  value: string;
}

/**
 * Apply overrides to a single college record.
 */
function applyOverrides(college: College, overrides: Override[]): College {
  const result = { ...college, placements: { ...college.placements } };

  for (const ov of overrides) {
    const val = ov.value;
    switch (ov.field_name) {
      case "fee": {
        const n = Number(val);
        if (!isNaN(n) && n >= 0) result.fee = n;
        break;
      }
      case "goFee": {
        const n = Number(val);
        if (!isNaN(n) && n >= 0) result.goFee = n;
        break;
      }
      case "naac":
        result.naac = val;
        break;
      case "nba":
        result.nba = val === "true";
        break;
      case "year": {
        const n = Number(val);
        if (!isNaN(n) && n > 1900) result.year = n;
        break;
      }
      case "affiliation":
        result.affiliation = val;
        break;
      case "placements.avg": {
        const n = Number(val);
        if (!isNaN(n) && n >= 0) result.placements.avg = n;
        break;
      }
      case "placements.highest": {
        const n = Number(val);
        if (!isNaN(n) && n >= 0) result.placements.highest = n;
        break;
      }
      case "placements.companies": {
        const n = Number(val);
        if (!isNaN(n) && n >= 0) result.placements.companies = n;
        break;
      }
    }
  }

  return result;
}

/**
 * Get all colleges with approved overrides applied.
 * For now reads from env/fetch; in production would query Supabase at build time.
 */
export async function getCollegesMerged(): Promise<College[]> {
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
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!res.ok) return COLLEGES;

    const overrides: Override[] = await res.json();

    if (!overrides || overrides.length === 0) return COLLEGES;

    // Group overrides by college_code
    const byCode = new Map<string, Override[]>();
    for (const ov of overrides) {
      if (!byCode.has(ov.college_code)) byCode.set(ov.college_code, []);
      byCode.get(ov.college_code)!.push(ov);
    }

    // Apply overrides
    return COLLEGES.map(c => {
      const collegeOverrides = byCode.get(c.code);
      return collegeOverrides ? applyOverrides(c, collegeOverrides) : c;
    });
  } catch (err) {
    // Failed to fetch overrides — returning static data
    return COLLEGES;
  }
}
