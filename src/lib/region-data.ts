import { COLLEGES, College } from "@/lib/colleges";

/**
 * Region pages aggregate the "best engineering colleges" across a group of
 * districts that form a recognised geographic region (e.g. Rayalaseema), as
 * opposed to the single-district `best-colleges/[city]` pages.
 *
 * Districts are matched against `College.district` EXACTLY as spelled in
 * colleges.ts — if a district is renamed there, update it here too.
 */
interface RegionMeta {
  /** URL slug, e.g. "rayalaseema" */
  slug: string;
  /** Display name, e.g. "Rayalaseema" */
  name: string;
  state: "Telangana" | "Andhra Pradesh";
  /** Exact `College.district` values that belong to this region. */
  districts: string[];
}

/**
 * Canonical region definitions. Add new regions here.
 *
 * Rayalaseema = the 8 current AP districts carved out of the historical four
 * Rayalaseema districts after the 2022 redistricting.
 */
export const REGIONS: RegionMeta[] = [
  {
    slug: "rayalaseema",
    name: "Rayalaseema",
    state: "Andhra Pradesh",
    districts: [
      "YSR Kadapa",
      "Tirupati",
      "Kurnool",
      "Chittoor",
      "Anantapur",
      "Nandyal",
      "Annamayya",
      "Sri Sathya Sai",
    ],
  },
];

export const REGION_META: Record<string, RegionMeta> = Object.fromEntries(
  REGIONS.map((r) => [r.slug, r])
);

export function getRegionFromSlug(slug: string): RegionMeta | null {
  return REGION_META[slug] || null;
}

/**
 * Check if a college has at least one engineering branch (CSE, ECE, EEE, MECH,
 * CIVIL). Kept identical to city-data.ts so region and district pages list the
 * same universe of colleges.
 */
function isEngineeringCollege(college: College): boolean {
  const engineeringBranches = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
  return engineeringBranches.some((branch) =>
    college.branches.includes(branch)
  );
}

/**
 * Get engineering colleges in a region, sorted by the same composite score used
 * for district pages: NIRF rank (lower is better), then CSE cutoff (lower is
 * better), then placement avg (higher is better).
 */
export function getCollegesInRegion(slug: string, colleges: College[] = COLLEGES): College[] {
  const region = getRegionFromSlug(slug);
  if (!region) return [];

  const districtSet = new Set(region.districts);

  const regionColleges = colleges.filter(
    (c) => districtSet.has(c.district) && isEngineeringCollege(c)
  );

  return regionColleges.sort((a, b) => {
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

/** All region slugs that have at least one engineering college. */
export function getAllRegionSlugs(): string[] {
  return REGIONS.filter((r) => getCollegesInRegion(r.slug).length > 0).map(
    (r) => r.slug
  );
}

/** How many engineering colleges a region currently has. */
export function getRegionCollegeCount(slug: string): number {
  return getCollegesInRegion(slug).length;
}
