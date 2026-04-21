import { COLLEGES, College } from '@/lib/colleges';

/**
 * Represents a comparison pair of colleges
 */
export interface ComparisonPair {
  college1: College;
  college2: College;
  slug: string;
}

/**
 * Generate popular comparison pairs by grouping colleges in the same district
 * that both have CSE cutoff data and placement data, then creating pairs from
 * the top colleges (sorted by cutoff rank ascending — lower is better).
 */
function generateAllPairs(): ComparisonPair[] {
  // Group colleges by district
  const byDistrict: Record<string, College[]> = {};

  COLLEGES.forEach(college => {
    if (!byDistrict[college.district]) {
      byDistrict[college.district] = [];
    }
    byDistrict[college.district].push(college);
  });

  const pairs: ComparisonPair[] = [];

  // Generate pairs for each district
  Object.keys(byDistrict)
    .sort()
    .forEach(district => {
      const collegesInDistrict = byDistrict[district];

      // Filter colleges with valid CSE cutoff and placement data
      const validColleges = collegesInDistrict.filter(
        c => c.cutoff.cse > 0 && c.placements.avg > 0
      );

      if (validColleges.length >= 2) {
        // Sort by CSE cutoff rank (ascending = better rank, lower number)
        const sorted = validColleges.sort((a, b) => a.cutoff.cse - b.cutoff.cse);

        // Take top 5 colleges per district to limit pair explosion
        const top = sorted.slice(0, 5);

        // Create all pairs from the top colleges
        for (let i = 0; i < top.length; i++) {
          for (let j = i + 1; j < top.length; j++) {
            const c1 = top[i];
            const c2 = top[j];
            const slug = `${c1.code.toLowerCase()}-vs-${c2.code.toLowerCase()}`;

            pairs.push({
              college1: c1,
              college2: c2,
              slug,
            });
          }
        }
      }
    });

  // Limit to ~1000 pairs maximum
  return pairs.slice(0, 1000);
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
export function getComparisonPair(slug: string): ComparisonPair | null {
  const preGenerated = ALL_PAIRS.find(pair => pair.slug === slug);
  if (preGenerated) return preGenerated;

  // Fallback: parse slug as "{code1}-vs-{code2}" (codes are lowercase in URLs,
  // but COLLEGES stores them uppercase — normalize for comparison).
  const match = slug.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  const [, rawCode1, rawCode2] = match;
  if (rawCode1 === rawCode2) return null; // no self-comparisons
  const code1 = rawCode1.toUpperCase();
  const code2 = rawCode2.toUpperCase();
  const college1 = COLLEGES.find(c => c.code === code1);
  const college2 = COLLEGES.find(c => c.code === code2);
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
