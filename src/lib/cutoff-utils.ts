import { AP_CUTOFFS, AP_CUTOFF_YEARS, catKey, type Category, type Gender } from "./ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "./ts-cutoffs";

export interface HistoricalCutoffResult {
  avg: number;
  years: number[];
  dataYears: string[];
}

/** Historical cutoff lookup — weighted average (70% latest year, 30% older).
 *  Shared between EAPCET predictor and CollegeDetail (Q3). */
export function getHistoricalCutoff(
  code: string,
  branch: string,
  cat: Category,
  gen: Gender,
  collegeState?: string
): HistoricalCutoffResult {
  const cutoffSource = collegeState === "Telangana" ? TS_CUTOFFS[code] : AP_CUTOFFS[code];
  if (!cutoffSource) return { avg: 0, years: [], dataYears: [] };

  const ranks: number[] = [];
  const dataYears: string[] = [];
  const key = catKey(cat, gen);
  const fallbackKey = cat; // boys key as fallback
  const yearsToCheck = collegeState === "Telangana" ? TS_CUTOFF_YEARS : AP_CUTOFF_YEARS;
  const branchVariants = [branch, branch.toUpperCase(), branch.toLowerCase()];

  for (const year of yearsToCheck) {
    const yearData = cutoffSource[year];
    if (!yearData) continue;
    const matchedBranch = branchVariants.find(v => yearData[v]);
    if (!matchedBranch) continue;
    const val = yearData[matchedBranch][key] || (gen === "girls" ? 0 : yearData[matchedBranch][fallbackKey]);
    if (val && val > 0) {
      ranks.push(val);
      dataYears.push(year);
    }
  }

  if (ranks.length === 0) return { avg: 0, years: [], dataYears: [] };

  // Weighted average: 70% most recent, 30% older (yearsToCheck is newest-first)
  if (ranks.length === 1) return { avg: ranks[0], years: ranks, dataYears };
  const weighted = Math.round(ranks[0] * 0.7 + ranks[1] * 0.3);
  return { avg: weighted, years: ranks, dataYears };
}
