// Branch-wise data for landing pages
// Aggregates colleges, cutoffs, and fees per branch

import { COLLEGES, fmtFee, type College } from "./colleges";
import { AP_CUTOFFS, type Category } from "./ap-cutoffs";
import { TS_CUTOFFS } from "./ts-cutoffs";

export interface BranchInfo {
  code: string;
  slug: string;
  name: string;
  shortName: string;
  category: "core" | "cse-family" | "emerging" | "interdisciplinary" | "pharma" | "medical" | "agriculture" | "other";
  description: string;
}

// Canonical branch definitions — all branches across engineering, medical, pharmacy, agriculture
export const BRANCHES: BranchInfo[] = [
  // ─── Engineering: CSE & IT ───
  { code: "CSE", slug: "cse", name: "Computer Science & Engineering", shortName: "CSE", category: "cse-family", description: "The most sought-after branch covering programming, algorithms, databases, operating systems, AI, and software engineering." },
  { code: "CSM", slug: "cse-ai-ml", name: "CSE (Artificial Intelligence & Machine Learning)", shortName: "CSE (AI&ML)", category: "cse-family", description: "CSE specialisation focused on machine learning, deep learning, neural networks, and AI applications." },
  { code: "CSD", slug: "cse-data-science", name: "CSE (Data Science)", shortName: "CSE (DS)", category: "cse-family", description: "CSE specialisation covering big data analytics, statistical modelling, data engineering, and visualisation." },
  { code: "CSO", slug: "cse-iot", name: "CSE (Internet of Things)", shortName: "CSE (IoT)", category: "cse-family", description: "CSE specialisation in embedded systems, sensor networks, IoT protocols, and smart device programming." },
  { code: "CSC", slug: "cse-cyber-security", name: "CSE (Cyber Security)", shortName: "CSE (CYS)", category: "cse-family", description: "CSE specialisation in network security, cryptography, ethical hacking, and digital forensics." },
  { code: "CSI", slug: "cse-info-security", name: "CSE (Information Security)", shortName: "CSE (IS)", category: "cse-family", description: "Information assurance, secure software development, and security architecture." },
  { code: "CSW", slug: "cse-iot-cyber-blockchain", name: "CSE (IoT & Cyber Security with Blockchain)", shortName: "CSE (IoT+BC)", category: "cse-family", description: "Interdisciplinary CSE specialisation merging IoT, cybersecurity, and blockchain technologies." },
  { code: "INF", slug: "it", name: "Information Technology", shortName: "IT", category: "cse-family", description: "Focuses on information systems, networking, web technologies, and IT infrastructure management." },
  { code: "AID", slug: "ai-ds", name: "Artificial Intelligence & Data Science", shortName: "AI&DS", category: "cse-family", description: "Standalone programme combining AI foundations with data science and analytics." },
  { code: "AIM", slug: "ai-ml", name: "Artificial Intelligence & Machine Learning", shortName: "AI&ML", category: "cse-family", description: "Standalone programme focused on AI, ML algorithms, NLP, computer vision, and intelligent systems." },

  // ─── Engineering: Core ───
  { code: "ECE", slug: "ece", name: "Electronics & Communication Engineering", shortName: "ECE", category: "core", description: "Covers VLSI design, signal processing, embedded systems, wireless communications, and semiconductor devices." },
  { code: "EEE", slug: "eee", name: "Electrical & Electronics Engineering", shortName: "EEE", category: "core", description: "Power systems, electrical machines, control systems, power electronics, and renewable energy." },
  { code: "MEC", slug: "mechanical", name: "Mechanical Engineering", shortName: "MECH", category: "core", description: "Design, manufacturing, thermodynamics, fluid mechanics, and industrial automation." },
  { code: "CIV", slug: "civil", name: "Civil Engineering", shortName: "CIVIL", category: "core", description: "Structural engineering, construction management, transportation, geotechnical, and environmental engineering." },

  // ─── Engineering: Interdisciplinary & Emerging ───
  { code: "BME", slug: "biomedical", name: "Biomedical Engineering", shortName: "BME", category: "interdisciplinary", description: "Medical devices, biomechanics, bioinformatics, and healthcare technology." },
  { code: "CHE", slug: "chemical", name: "Chemical Engineering", shortName: "ChE", category: "interdisciplinary", description: "Process engineering, petrochemicals, pharmaceuticals, and material science." },
  { code: "MIN", slug: "mining", name: "Mining Engineering", shortName: "Mining", category: "interdisciplinary", description: "Mineral extraction, mine planning, rock mechanics, and environmental reclamation." },
  { code: "MET", slug: "metallurgy", name: "Metallurgical Engineering", shortName: "Metallurgy", category: "interdisciplinary", description: "Extractive and physical metallurgy, materials characterisation, and corrosion science." },
  { code: "AERO", slug: "aerospace", name: "Aerospace Engineering", shortName: "AERO", category: "interdisciplinary", description: "Aerodynamics, propulsion, aircraft structures, and space systems." },
  { code: "MMS", slug: "mechatronics", name: "Mechatronics Engineering", shortName: "Mechatronics", category: "interdisciplinary", description: "Integration of mechanical, electrical, and computer engineering for automated and smart systems." },
  { code: "TEX", slug: "textile", name: "Textile Engineering", shortName: "Textile", category: "interdisciplinary", description: "Fibre science, fabric manufacturing, dyeing, finishing, and textile machinery." },
  { code: "PLG", slug: "plastics", name: "Plastics Engineering", shortName: "Plastics", category: "interdisciplinary", description: "Polymer processing, mould design, and plastic product manufacturing." },
  { code: "MTE", slug: "materials", name: "Materials Science & Engineering", shortName: "Materials", category: "interdisciplinary", description: "Advanced materials, nanomaterials, composites, and materials characterisation." },
  { code: "BSE", slug: "bio-sciences", name: "Bio Sciences & Engineering", shortName: "Bio Sci", category: "interdisciplinary", description: "Biological sciences applied to engineering — biosensors, bioinformatics, and bioprocess engineering." },

  // ─── Medical ───
  { code: "MBBS", slug: "mbbs", name: "MBBS (Bachelor of Medicine & Surgery)", shortName: "MBBS", category: "medical", description: "Five-and-a-half year undergraduate medical degree including one year of internship. The primary pathway to becoming a doctor in India." },

  // ─── Pharmacy ───
  { code: "PHB", slug: "b-pharm", name: "B.Pharmacy", shortName: "B.Pharm", category: "pharma", description: "Four-year undergraduate programme in pharmaceutical sciences, drug formulation, pharmacology, and clinical pharmacy practice." },
  { code: "MPH", slug: "m-pharm", name: "M.Pharmacy", shortName: "M.Pharm", category: "pharma", description: "Two-year postgraduate programme with specialisations in pharmaceutics, pharmacology, pharmaceutical chemistry, and pharmaceutical analysis." },
  { code: "PDB", slug: "pharm-d", name: "Pharm.D", shortName: "Pharm.D", category: "pharma", description: "Six-year doctorate in pharmacy covering advanced clinical practice, patient care, and drug therapy management." },

  // ─── Agriculture ───
  { code: "AGR", slug: "agriculture", name: "Agricultural Engineering", shortName: "Agri", category: "agriculture", description: "Farm machinery, irrigation engineering, food processing, and soil & water conservation." },
  { code: "FDT", slug: "food-technology", name: "Food Technology", shortName: "Food Tech", category: "agriculture", description: "Food processing, preservation, quality control, and food safety management." },
  { code: "DTD", slug: "dairy-technology", name: "Dairy Technology", shortName: "Dairy Tech", category: "agriculture", description: "Dairy processing, milk products manufacturing, and dairy plant management." },
];

// Map all known code variants to canonical codes
const CODE_ALIASES: Record<string, string> = {
  // TS codes (uppercase)
  CSE: "CSE", CSM: "CSM", CSD: "CSD", CSO: "CSO", CSC: "CSC", CSI: "CSI", CSW: "CSW",
  INF: "INF", AID: "AID", AIM: "AIM",
  ECE: "ECE", EEE: "EEE", MEC: "MEC", CIV: "CIV",
  BME: "BME", CHE: "CHE", MIN: "MIN", MET: "MET",
  PHB: "PHB", PDB: "PDB", AERO: "AERO", MMS: "MMS", TEX: "TEX", PLG: "PLG", MTE: "MTE", BSE: "BSE",
  AGR: "AGR", FDT: "FDT", DTD: "DTD",
  // AP codes (lowercase)
  cse: "CSE", cse_aiml: "CSM", cse_ds: "CSD", cse_iot: "CSO", csc: "CSC",
  it: "INF", inf: "INF", ai_ds: "AID", ai_ml: "AIM",
  ece: "ECE", eee: "EEE", mech: "MEC", civil: "CIV",
  bme: "BME", chemical: "CHE", mining: "MIN", met: "MET",
  bpharm: "PHB", phb: "PHB", pdb: "PDB",
  agr: "AGR", fdt: "FDT", dtd: "DTD",
  auto: "MEC", ase: "AERO", petroleum: "CHE",
  // College branches array aliases
  MECH: "MEC", CIVIL: "CIV", IT: "INF",
  "AI&ML": "AIM", "AI&DS": "AID", DS: "CSD", CYS: "CSC", IoT: "CSO",
  "B.Pharm": "PHB", "M.Pharm": "MPH", "Pharm.D": "PDB", Pharma: "PHB",
  MBBS: "MBBS", DRG: "AGR", CLD: "CSE", Mining: "MIN", ChE: "CHE",
  // AP cutoff keys
  cai: "CSM", cba: "CSC", ccc: "CSC", cia: "CSM", cit: "CSO",
  cseb: "CSC", cser: "CSE", csg: "CSE", csn: "CSE", css: "CSE",
  eca: "ECE", biotech: "BME",
};

function canonicalCode(raw: string): string | null {
  if (BRANCHES.find(b => b.code === raw)) return raw;
  return CODE_ALIASES[raw] || null;
}

export interface CollegeForBranch {
  college: College;
  cutoffOC: number; // OC boys cutoff (latest year available)
  hasCutoff: boolean;
}

export function getCollegesForBranch(branchCode: string): CollegeForBranch[] {
  const results: CollegeForBranch[] = [];
  const seen = new Set<string>();

  for (const col of COLLEGES) {
    // Check if college offers this branch via branches array
    const hasBranch = col.branches.some(b => canonicalCode(b) === branchCode);
    // Also check cutoff data
    let cutoffOC = 0;

    // Check TS cutoffs
    const tsData = TS_CUTOFFS[col.code];
    if (tsData) {
      for (const year of ["2024", "2023"]) {
        if (tsData[year]) {
          for (const [br, cats] of Object.entries(tsData[year])) {
            if (canonicalCode(br) === branchCode && cats.OC && cats.OC > 0) {
              cutoffOC = cats.OC;
              break;
            }
          }
        }
        if (cutoffOC > 0) break;
      }
    }

    // Check AP cutoffs
    if (cutoffOC === 0) {
      const apData = AP_CUTOFFS[col.code];
      if (apData) {
        for (const year of ["2023", "2022"]) {
          if (apData[year]) {
            for (const [br, cats] of Object.entries(apData[year])) {
              if (canonicalCode(br) === branchCode && cats.OC && cats.OC > 0) {
                cutoffOC = cats.OC;
                break;
              }
            }
          }
          if (cutoffOC > 0) break;
        }
      }
    }

    // Also check static cutoff field
    if (cutoffOC === 0 && col.cutoff) {
      const staticKey = branchCode === "MEC" ? "mech" : branchCode === "CIV" ? "civil" : branchCode === "INF" ? "it" : branchCode.toLowerCase();
      if (col.cutoff[staticKey] && col.cutoff[staticKey] > 0) {
        cutoffOC = col.cutoff[staticKey];
      }
    }

    if (hasBranch || cutoffOC > 0) {
      if (!seen.has(col.code)) {
        seen.add(col.code);
        results.push({ college: col, cutoffOC, hasCutoff: cutoffOC > 0 });
      }
    }
  }

  // Sort by fee (low to high) — most students filter by affordability
  return results.sort((a, b) => a.college.fee - b.college.fee);
}

export function getBranchBySlug(slug: string): BranchInfo | undefined {
  return BRANCHES.find(b => b.slug === slug);
}

export function getAllBranchSlugs(): string[] {
  return BRANCHES.map(b => b.slug);
}
