/** Shared engineering branch codes used for category filtering (Q2) */
export const ENGINEERING_BRANCHES = [
  "CSE", "ECE", "EEE", "MECH", "CIVIL", "IT",
  "AI&ML", "DS", "CYS", "AERO", "ChE", "AI&DS",
] as const;

export const PHARMACY_BRANCHES = ["B.Pharm", "Pharm.D", "M.Pharm", "Pharma"] as const;

export function isEngineeringCollege(branches: string[]): boolean {
  return branches.some(b => (ENGINEERING_BRANCHES as readonly string[]).includes(b));
}

export function isPharmacyCollege(branches: string[]): boolean {
  return branches.some(b => (PHARMACY_BRANCHES as readonly string[]).includes(b));
}

export function isMedicalCollege(branches: string[]): boolean {
  return branches.includes("MBBS");
}
