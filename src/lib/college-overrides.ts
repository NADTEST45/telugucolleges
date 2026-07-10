import type { College } from "./colleges";

export interface CollegeOverride {
  college_code: string;
  field_name: string;
  value: string;
}

/** Apply only approved, whitelisted values; invalid persisted rows fail closed. */
export function applyCollegeOverrides(college: College, overrides: CollegeOverride[]): College {
  const result = { ...college, placements: { ...college.placements } };
  const finiteInRange = (value: string, max: number): number | null => {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 && number <= max ? number : null;
  };

  for (const override of overrides) {
    const value = override.value;
    switch (override.field_name) {
      case "fee":
      case "goFee": {
        const number = finiteInRange(value, 10_000_000);
        if (number !== null) result[override.field_name] = number;
        break;
      }
      case "naac":
        if (/^(A\+\+|A\+|A|B\+\+|B\+|B|C|-)$/.test(value)) result.naac = value;
        break;
      case "nba":
        if (value === "true" || value === "false") result.nba = value === "true";
        break;
      case "year": {
        const number = Number(value);
        if (Number.isInteger(number) && number >= 1800 && number <= new Date().getFullYear()) {
          result.year = number;
        }
        break;
      }
      case "affiliation":
        if (value.trim().length >= 2 && value.length <= 120) result.affiliation = value.trim();
        break;
      case "placements.avg":
      case "placements.highest": {
        const number = finiteInRange(value, 500);
        if (number !== null) {
          const key = override.field_name === "placements.avg" ? "avg" : "highest";
          result.placements[key] = number;
        }
        break;
      }
      case "placements.companies": {
        const number = finiteInRange(value, 10_000);
        if (number !== null && Number.isInteger(number)) result.placements.companies = number;
        break;
      }
    }
  }
  return result;
}
