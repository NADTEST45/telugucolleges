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
  VSVT: {
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

  /* ── GMR University (GMRIT), Rajam, AP ─── 3-year data ────────────── */
  GMRI: {
    source: "AICTE-MD",
    sourceUrl: "https://gmrit.edu.in/PDFs/about_us/mandatory_disclosure.pdf",
    years: [
      {
        year: "2024-25",
        totalPlaced: 662,
        branches: {
          CIVIL:{ placed: 97,  intake: 120, avgPackage: 3.46, maxPackage: 5.50, minPackage: 2.40 },
          CSE:  { placed: 137, intake: 240, avgPackage: 4.56, maxPackage: 22.0, minPackage: 3.50 },
          ECE:  { placed: 106, intake: 180, avgPackage: 4.11 },
          EEE:  { placed: 103, intake: 120, avgPackage: 3.90, maxPackage: 7.0,  minPackage: 2.40 },
          IT:   { placed: 79,  intake: 120, avgPackage: 4.20, maxPackage: 8.0,  minPackage: 2.50 },
          MECH: { placed: 140, intake: 120, avgPackage: 4.32, maxPackage: 7.0,  minPackage: 2.40 },
        },
      },
      {
        year: "2023-24",
        totalPlaced: 563,
        branches: {
          CIVIL:{ placed: 79,  intake: 120, avgPackage: 4.17, maxPackage: 7.0,  minPackage: 2.40 },
          CSE:  { placed: 108, intake: 240, avgPackage: 5.46, maxPackage: 9.0,  minPackage: 2.40 },
          ECE:  { placed: 74,  intake: 180, avgPackage: 3.83 },
          EEE:  { placed: 77,  intake: 120, avgPackage: 4.34, maxPackage: 7.0,  minPackage: 2.40 },
          IT:   { placed: 48,  intake: 120, avgPackage: 5.49, maxPackage: 40.0, minPackage: 2.40 },
          MECH: { placed: 125, intake: 120, avgPackage: 4.20, maxPackage: 7.0,  minPackage: 2.40 },
        },
      },
      {
        year: "2022-23",
        totalPlaced: 544,
        branches: {
          CIVIL:{ placed: 68,  intake: 120, avgPackage: 4.00, maxPackage: 7.0,  minPackage: 2.40 },
          CSE:  { placed: 144, intake: 180, avgPackage: 5.02, maxPackage: 11.0, minPackage: 2.64 },
          ECE:  { placed: 131, intake: 180, avgPackage: 4.63 },
          EEE:  { placed: 75,  intake: 120, avgPackage: 4.28, maxPackage: 7.0,  minPackage: 2.16 },
          IT:   { placed: 79,  intake: 120, avgPackage: 4.00, maxPackage: 7.0,  minPackage: 2.40 },
          MECH: { placed: 101, intake: 180, avgPackage: 4.28, maxPackage: 7.0,  minPackage: 2.04 },
        },
      },
    ],
  },

  /* ── Raghu Engineering College, Visakhapatnam ─────────────────────── */
  RAGU: {
    source: "AICTE-MD",
    sourceUrl: "https://www.raghuenggcollege.com/wp-content/uploads/2024/03/Mandatory-Disclosure-REC-Modified-1.pdf",
    years: [
      {
        year: "2023-24",
        totalPlaced: 640,
        branches: {
          CIVIL:{ placed: 8,   intake: 60,  avgPackage: 3.5,  maxPackage: 4.1,  minPackage: 2.0 },
          EEE:  { placed: 80,  intake: 60,  avgPackage: 3.86, maxPackage: 7.0,  minPackage: 3.5 },
          MECH: { placed: 136, intake: 180, avgPackage: 3.07, maxPackage: 7.0,  minPackage: 1.5 },
          ECE:  { placed: 208, intake: 240, avgPackage: 4.7,  maxPackage: 16.0, minPackage: 3.2 },
          CSE:  { placed: 208, intake: 180, avgPackage: 5.7,  maxPackage: 44.0, minPackage: 3.25 },
        },
      },
    ],
  },

  /* ── MITS Madanapalle, Chittoor, AP ── 3-year overall data ──────────── */
  MITS: {
    source: "AICTE-MD",
    sourceUrl: "https://mits.ac.in/mandatory-disclosures",
    years: [
      {
        year: "2023-24",
        totalPlaced: 1113,
        branches: {
          ALL: { placed: 1113, intake: 1854, avgPackage: 4.01, maxPackage: 29.5 },
        },
      },
      {
        year: "2024-25",
        totalPlaced: 786,
        branches: {
          ALL: { placed: 786, intake: 1268, avgPackage: 3.9, maxPackage: 13.0 },
        },
      },
    ],
  },

  /* ── Sreenidhi Institute of Science & Technology, Hyderabad ────────── */
  SNIS: {
    source: "AICTE-MD",
    sourceUrl: "https://drive.sreenidhi.edu.in/snist/civil/SNIST%20AicteMandatory%202025-26.pdf",
    years: [
      {
        year: "2024-25",
        branches: {
          ECM:  { placed: 64, intake: 120, avgPackage: 5.3 },
        },
        totalPlaced: 64,
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
  CSD: "CS (Data Science)",
  ECM: "Electronics & Computer",
  CSBS: "CS & Business Systems",
  CHEM: "Chemical",
  ALL: "All Branches",
};

export function branchDisplayName(code: string): string {
  return BRANCH_NAMES[code] ?? code;
}
