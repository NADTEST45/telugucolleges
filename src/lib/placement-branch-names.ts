/**
 * Branch display names for placement tables. CLIENT-SAFE — no data imports.
 * Extracted from placement-data.ts so client components can label branches
 * without pulling the full placement dataset into the browser bundle.
 */
const BRANCH_NAMES: Record<string, string> = {
  CSE: "Computer Science",
  IT: "Information Technology",
  ECE: "Electronics & Comm.",
  EEE: "Electrical & Electronics",
  EIE: "Electronics & Instr.",
  MECH: "Mechanical",
  CIVIL: "Civil",
  CSSE: "CS & Systems",
  AIDS: "AI & Data Science",
  AIML: "AI & Machine Learning",
  CYS: "Cyber Security",
  CSD: "CS (Data Science)",
  ECM: "Electronics & Computer",
  CSBS: "CS & Business Systems",
  CHEM: "Chemical",
  ALL: "All Branches",
};

export function branchDisplayName(code: string): string {
  return BRANCH_NAMES[code] ?? code;
}
