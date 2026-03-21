import { COLLEGES, College } from "@/lib/colleges";

/**
 * Convert a district name to a URL-friendly slug
 * e.g., "Hyderabad" → "hyderabad", "East Godavari" → "east-godavari"
 */
export function getCitySlug(district: string): string {
  return district
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Convert a slug back to a district name
 * e.g., "hyderabad" → "Hyderabad", "east-godavari" → "East Godavari"
 */
export function getCityFromSlug(slug: string): string | null {
  return CITY_META[slug]?.district || null;
}

/**
 * Check if a college has at least one engineering branch (CSE, ECE, EEE, MECH, CIVIL)
 */
function isEngineeringCollege(college: College): boolean {
  const engineeringBranches = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
  return engineeringBranches.some((branch) =>
    college.branches.includes(branch)
  );
}

/**
 * Get colleges in a city, sorted by a composite score
 * Score: NIRF rank (lower is better), then CSE cutoff (lower is better), then placement avg (higher is better)
 */
export function getCollegesInCity(slug: string): College[] {
  const district = getCityFromSlug(slug);
  if (!district) return [];

  const citiesColleges = COLLEGES.filter(
    (c) => c.district === district && isEngineeringCollege(c)
  );

  return citiesColleges.sort((a, b) => {
    // Primary: NIRF rank (lower is better, 0 means no rank)
    const nirfA = a.nirf > 0 ? a.nirf : Infinity;
    const nirfB = b.nirf > 0 ? b.nirf : Infinity;
    if (nirfA !== nirfB) return nirfA - nirfB;

    // Secondary: CSE cutoff (lower is better, 0 means no data)
    const cutoffA = a.cutoff.cse > 0 ? a.cutoff.cse : Infinity;
    const cutoffB = b.cutoff.cse > 0 ? b.cutoff.cse : Infinity;
    if (cutoffA !== cutoffB) return cutoffA - cutoffB;

    // Tertiary: Placement avg (higher is better)
    return (b.placements.avg || 0) - (a.placements.avg || 0);
  });
}

/**
 * Get all city slugs that have at least 3 engineering colleges
 */
export function getAllCitySlugs(): string[] {
  const uniqueDistricts = new Set(COLLEGES.map((c) => c.district));
  const districts = Array.from(uniqueDistricts) as string[];

  return districts
    .filter((district) => {
      const engineeringColleges = COLLEGES.filter(
        (c) => c.district === district && isEngineeringCollege(c)
      );
      return engineeringColleges.length >= 3;
    })
    .map((district) => getCitySlug(district))
    .sort();
}

/**
 * City metadata: friendly names, state info, and college counts
 */
interface CityMeta {
  district: string;
  state: "Telangana" | "Andhra Pradesh";
  slug: string;
  collegeCount: number;
}

function buildCityMeta(): Record<string, CityMeta> {
  const meta: Record<string, CityMeta> = {};
  const uniqueDistricts = new Set(COLLEGES.map((c) => c.district));
  const districts = Array.from(uniqueDistricts) as string[];

  for (const district of districts) {
    const engineeringColleges = COLLEGES.filter(
      (c) => c.district === district && isEngineeringCollege(c)
    );

    if (engineeringColleges.length >= 3) {
      const slug = getCitySlug(district);
      const state = engineeringColleges[0].state;
      meta[slug] = {
        district,
        state,
        slug,
        collegeCount: engineeringColleges.length,
      };
    }
  }

  return meta;
}

export const CITY_META = buildCityMeta();

/**
 * Get all cities grouped by state
 */
export function getCitiesByState(): {
  state: "Telangana" | "Andhra Pradesh";
  cities: CityMeta[];
}[] {
  const byState = new Map<
    "Telangana" | "Andhra Pradesh",
    CityMeta[]
  >();

  for (const meta of Object.values(CITY_META)) {
    if (!byState.has(meta.state)) {
      byState.set(meta.state, []);
    }
    byState.get(meta.state)!.push(meta);
  }

  return [
    {
      state: "Telangana",
      cities: (byState.get("Telangana") || []).sort((a, b) =>
        a.district.localeCompare(b.district)
      ),
    },
    {
      state: "Andhra Pradesh",
      cities: (byState.get("Andhra Pradesh") || []).sort((a, b) =>
        a.district.localeCompare(b.district)
      ),
    },
  ];
}
