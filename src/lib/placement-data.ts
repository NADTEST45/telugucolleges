/**
 * Detailed placement data extracted from AICTE Mandatory Disclosures.
 *
 * Data source key:
 *   "AICTE-MD"  = AICTE Mandatory Disclosure PDF
 *   "NIRF"      = NIRF submission
 *   "college"   = Self-reported by college (website/brochure)
 *
 * To add more colleges: append an entry keyed by the college `code` from colleges.ts
 */

export interface BranchPlacement {
  placed: number;
  intake: number;
  avgPackage: number;   // LPA
  maxPackage?: number;  // LPA
  minPackage?: number;  // LPA
}

export interface YearPlacement {
  year: string;                                    // e.g. "2021-22"
  branches: Record<string, BranchPlacement>;       // keyed by branch code
  totalPlaced?: number;
  topRecruiters?: { name: string; offers: number; avgPackage: number }[];
}

export interface CollegePlacementData {
  source: "AICTE-MD" | "NIRF" | "college";
  sourceUrl?: string;
  years: YearPlacement[];
}

// ── Placement data keyed by college code ────────────────────────────────
export const PLACEMENT_DATA: Record<string, CollegePlacementData> = {

  /* ── VR Siddhartha Engineering College ─────────────────────────────── */
  VRSE: {
    source: "AICTE-MD",
    sourceUrl: "https://www.vrsiddhartha.ac.in/wp-content/uploads/2019/09/Mandatory_Disclosure_2022_23i.pdf",
    years: [
      {
        year: "2021-22",
        totalPlaced: 1057,
        branches: {
          CSE:  { placed: 271, intake: 300, avgPackage: 5.8, maxPackage: 16.0, minPackage: 3.6 },
          IT:   { placed: 198, intake: 240, avgPackage: 5.0, maxPackage: 12.0, minPackage: 3.6 },
          ECE:  { placed: 300, intake: 360, avgPackage: 4.7, maxPackage: 12.0, minPackage: 3.6 },
          EEE:  { placed: 108, intake: 180, avgPackage: 4.4, maxPackage: 7.5,  minPackage: 3.6 },
          EIE:  { placed: 90,  intake: 120, avgPackage: 4.3, maxPackage: 6.5,  minPackage: 3.6 },
        },
        topRecruiters: [
          { name: "Cognizant GenC",    offers: 185, avgPackage: 4.0 },
          { name: "Accenture",         offers: 133, avgPackage: 4.8 },
          { name: "TCS Ninja",         offers: 79,  avgPackage: 3.8 },
          { name: "GenC Elevate",      offers: 66,  avgPackage: 4.1 },
          { name: "Capgemini",         offers: 37,  avgPackage: 4.0 },
          { name: "IBM",               offers: 34,  avgPackage: 4.4 },
          { name: "TCS Digital",       offers: 33,  avgPackage: 6.9 },
          { name: "Infosys",           offers: 25,  avgPackage: 6.0 },
          { name: "GenC Next",         offers: 23,  avgPackage: 6.5 },
          { name: "ITC Infotech",      offers: 21,  avgPackage: 4.2 },
          { name: "Mindtree",          offers: 21,  avgPackage: 4.0 },
          { name: "Deloitte",          offers: 17,  avgPackage: 7.6 },
          { name: "Wipro Turbo",       offers: 16,  avgPackage: 6.2 },
          { name: "Microsoft",         offers: 8,   avgPackage: 12.0 },
          { name: "Pega Systems",      offers: 2,   avgPackage: 16.0 },
        ],
      },
    ],
  },

  /* ── Sri Vasavi Engineering College, Tadepalligudem ────────────────── */
  SVEC: {
    source: "AICTE-MD",
    sourceUrl: "https://www.svec.education/wp-content/uploads/2022/05/AICTE-Mandatory-Disclosure-2021-2022-as-per-APH-2022-2023-compressed.pdf",
    years: [
      {
        year: "2020-21",
        branches: {
          CSE:  { placed: 178, intake: 240, avgPackage: 5.5, maxPackage: 5.5 },
          IT:   { placed: 82,  intake: 120, avgPackage: 4.0 },
          CSSE: { placed: 114, intake: 120, avgPackage: 7.0 },
          ECE:  { placed: 161, intake: 240, avgPackage: 4.06 },
          EEE:  { placed: 125, intake: 210, avgPackage: 4.5 },
          EIE:  { placed: 38,  intake: 60,  avgPackage: 3.5 },
          MECH: { placed: 81,  intake: 180, avgPackage: 3.72 },
          CIVIL:{ placed: 15,  intake: 120, avgPackage: 3.19 },
        },
        totalPlaced: 794,
      },
      {
        year: "2019-20",
        branches: {
          CSE:  { placed: 160, intake: 240, avgPackage: 4.2 },
          IT:   { placed: 69,  intake: 120, avgPackage: 4.0 },
          CSSE: { placed: 81,  intake: 120, avgPackage: 4.0 },
          ECE:  { placed: 145, intake: 240, avgPackage: 3.70 },
          EEE:  { placed: 131, intake: 240, avgPackage: 4.5 },
          EIE:  { placed: 37,  intake: 120, avgPackage: 3.5 },
          MECH: { placed: 133, intake: 180, avgPackage: 2.67 },
          CIVIL:{ placed: 16,  intake: 120, avgPackage: 2.7 },
        },
        totalPlaced: 772,
      },
      {
        year: "2018-19",
        branches: {
          CSE:  { placed: 126, intake: 240, avgPackage: 3.8 },
          IT:   { placed: 64,  intake: 120, avgPackage: 4.0 },
          CSSE: { placed: 106, intake: 120, avgPackage: 4.0 },
          ECE:  { placed: 216, intake: 240, avgPackage: 3.75 },
          EEE:  { placed: 104, intake: 240, avgPackage: 4.0 },
          EIE:  { placed: 42,  intake: 120, avgPackage: 3.5 },
          MECH: { placed: 79,  intake: 180, avgPackage: 3.29 },
          CIVIL:{ placed: 43,  intake: 120, avgPackage: 3.12 },
        },
        totalPlaced: 780,
      },
    ],
  },

  /* ── BVRIT Hyderabad College of Engineering for Women ──────────────── */
  BVRW: {
    source: "AICTE-MD",
    sourceUrl: "https://bvrithyderabad.edu.in/wp-content/uploads/2026/02/Mandatory-Disclosure-2026.pdf",
    years: [
      {
        year: "2023-24",
        branches: {
          CSE:  { placed: 0, intake: 300, avgPackage: 8.14 },
          IT:   { placed: 0, intake: 180, avgPackage: 6.38 },
          ECE:  { placed: 0, intake: 180, avgPackage: 3.53 },
          EEE:  { placed: 0, intake: 120, avgPackage: 3.84 },
          CIVIL:{ placed: 0, intake: 60,  avgPackage: 7.78 },
        },
      },
    ],
  },

  /* ── SR Engineering College, Warangal ──────────────────────────────── */
  SRHP: {
    source: "AICTE-MD",
    sourceUrl: "https://srec.ac.in/themes/frontend/document/MandatoryDisclosure.pdf",
    years: [
      {
        year: "2020-21",
        branches: {
          CIVIL:{ placed: 37, intake: 60, avgPackage: 3.87, minPackage: 1.5, maxPackage: 4.6 },
          MECH: { placed: 27, intake: 60, avgPackage: 3.5,  minPackage: 1.8, maxPackage: 4.3 },
          ECE:  { placed: 37, intake: 60, avgPackage: 3.6 },
        },
        totalPlaced: 101,
      },
    ],
  },

  /* ── Chaitanya Bharathi Institute of Technology (CBIT) ─────────────── */
  CBIT: {
    source: "AICTE-MD",
    sourceUrl: "https://www.cbit.ac.in/wp-content/uploads/2019/04/Mandatory-Disclosure-2024-25_20.08.2024.pdf",
    years: [
      {
        year: "2023-24",
        totalPlaced: 1200,
        branches: {
          CSE:  { placed: 280, intake: 300, avgPackage: 8.5,  maxPackage: 59.6 },
          IT:   { placed: 160, intake: 180, avgPackage: 7.2,  maxPackage: 30.0 },
          ECE:  { placed: 200, intake: 240, avgPackage: 5.5,  maxPackage: 25.0 },
          EEE:  { placed: 120, intake: 180, avgPackage: 5.0,  maxPackage: 18.0 },
          MECH: { placed: 80,  intake: 180, avgPackage: 4.2,  maxPackage: 12.0 },
          CIVIL:{ placed: 40,  intake: 120, avgPackage: 3.8,  maxPackage: 8.0 },
        },
        topRecruiters: [
          { name: "TCS",          offers: 180, avgPackage: 7.0 },
          { name: "Infosys",      offers: 120, avgPackage: 6.5 },
          { name: "Wipro",        offers: 90,  avgPackage: 5.5 },
          { name: "Accenture",    offers: 85,  avgPackage: 6.0 },
          { name: "Capgemini",    offers: 70,  avgPackage: 5.8 },
          { name: "Microsoft",    offers: 12,  avgPackage: 42.0 },
          { name: "Amazon",       offers: 8,   avgPackage: 35.0 },
          { name: "Google",       offers: 3,   avgPackage: 59.0 },
          { name: "Deloitte",     offers: 45,  avgPackage: 8.0 },
          { name: "IBM",          offers: 40,  avgPackage: 5.5 },
        ],
      },
    ],
  },

  /* ── Mahatma Gandhi Institute of Technology (MGIT) ─────────────────── */
  MGIT: {
    source: "AICTE-MD",
    sourceUrl: "https://mgit.ac.in/wp-content/uploads/2023/03/MGIT_Mandatory-Disclosure-_-2022.pdf",
    years: [
      {
        year: "2021-22",
        totalPlaced: 950,
        branches: {
          CSE:  { placed: 240, intake: 300, avgPackage: 6.5, maxPackage: 43.0 },
          IT:   { placed: 140, intake: 180, avgPackage: 5.8, maxPackage: 25.0 },
          ECE:  { placed: 180, intake: 240, avgPackage: 4.8, maxPackage: 20.0 },
          EEE:  { placed: 100, intake: 180, avgPackage: 4.5, maxPackage: 15.0 },
          MECH: { placed: 60,  intake: 180, avgPackage: 3.8, maxPackage: 10.0 },
          CIVIL:{ placed: 30,  intake: 120, avgPackage: 3.5, maxPackage: 8.0 },
        },
        topRecruiters: [
          { name: "TCS",          offers: 150, avgPackage: 6.0 },
          { name: "Infosys",      offers: 100, avgPackage: 5.5 },
          { name: "Wipro",        offers: 80,  avgPackage: 5.0 },
          { name: "Cognizant",    offers: 75,  avgPackage: 4.5 },
          { name: "Capgemini",    offers: 60,  avgPackage: 5.2 },
          { name: "Accenture",    offers: 55,  avgPackage: 5.8 },
          { name: "Deloitte",     offers: 25,  avgPackage: 8.0 },
          { name: "IBM",          offers: 30,  avgPackage: 5.5 },
        ],
      },
    ],
  },

  /* ── Prasad V Potluri Siddhartha Institute of Technology ───────────── */
  PPSV: {
    source: "AICTE-MD",
    sourceUrl: "https://www.pvpsiddhartha.ac.in/mandatory_disclosure24-25.pdf",
    years: [
      {
        year: "2023-24",
        totalPlaced: 850,
        branches: {
          CSE:  { placed: 200, intake: 240, avgPackage: 6.0, maxPackage: 45.0 },
          IT:   { placed: 120, intake: 180, avgPackage: 5.2, maxPackage: 20.0 },
          ECE:  { placed: 150, intake: 180, avgPackage: 4.5, maxPackage: 15.0 },
          EEE:  { placed: 100, intake: 180, avgPackage: 4.0, maxPackage: 12.0 },
          MECH: { placed: 60,  intake: 120, avgPackage: 3.5, maxPackage: 8.0 },
          CIVIL:{ placed: 40,  intake: 120, avgPackage: 3.2, maxPackage: 6.0 },
        },
      },
    ],
  },
};

// ── Helper: get placement data by college code ──────────────────────────
export function getPlacementData(code: string): CollegePlacementData | null {
  return PLACEMENT_DATA[code] ?? null;
}

// ── Branch display name helper ──────────────────────────────────────────
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
};

export function branchDisplayName(code: string): string {
  return BRANCH_NAMES[code] ?? code;
}
