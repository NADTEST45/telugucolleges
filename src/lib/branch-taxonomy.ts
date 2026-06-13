/**
 * Canonical engineering-branch taxonomy for the EAPCET predictor.
 *
 * WHY THIS EXISTS
 * ----------------
 * The three cutoff data sources spell the same branch with different codes:
 *   - colleges.ts  static cutoffs → lowercase core codes  (cse, ece, eee, mech, civil)
 *   - AP_CUTOFFS   (APSCHE data)  → lowercase codes        (mech, civil, it, cse_aiml, cse_ds …)
 *   - TS_CUTOFFS   (TGCHE data)   → 3-letter UPPERCASE     (MEC, CIV, INF, CSM,      CSD …)
 *
 * Because the predictor used a single code per dropdown entry, a branch selected
 * with a TS code (e.g. "CSM") could not match AP data keyed as "cse_aiml", and
 * vice-versa — and the dropdown showed near-duplicate options ("CSE (AI & ML)"
 * AND "CSE (AI/ML)") that were really the same branch on different states.
 *
 * Each canonical branch below has ONE competitor-standard display label and the
 * full set of equivalent state codes. The predictor shows the label once and the
 * lookup tries every code, so AP and TS data are both reachable from one choice.
 * Labels follow the "CSE (Specialisation)" convention used by Careers360,
 * Collegedunia, Sakshi Education and CollegeDekho.
 */

export interface CanonicalBranch {
  /** Stable id used in state + shareable URLs (kept = primary AP/lowercase code). */
  id: string;
  /** Competitor-standard display label. */
  label: string;
  /** All equivalent codes across colleges.ts / AP_CUTOFFS / TS_CUTOFFS. */
  codes: string[];
}

/** Ordered most-popular-first, the way competitor predictors list branches. */
export const CANONICAL_BRANCHES: CanonicalBranch[] = [
  // ── Core branches ─────────────────────────────────────────────
  { id: "cse",      label: "CSE",        codes: ["cse", "CSE"] },
  { id: "ece",      label: "ECE",        codes: ["ece", "ECE"] },
  { id: "eee",      label: "EEE",        codes: ["eee", "EEE"] },
  { id: "mech",     label: "Mechanical", codes: ["mech", "MEC"] },
  { id: "civil",    label: "Civil",      codes: ["civil", "CIV"] },
  { id: "it",       label: "IT",         codes: ["it", "INF"] },

  // ── CSE specialisations ───────────────────────────────────────
  { id: "cse_aiml", label: "CSE (AI & ML)",            codes: ["cse_aiml", "CSM"] },
  { id: "cse_ds",   label: "CSE (Data Science)",       codes: ["cse_ds", "CSD"] },
  { id: "cse_ai",   label: "CSE (AI)",                 codes: ["cai", "cia", "CSA"] },
  { id: "cse_cys",  label: "CSE (Cyber Security)",     codes: ["csc", "ccc", "CSC"] },
  { id: "cse_iot",  label: "CSE (IoT)",                codes: ["cse_iot", "cit", "iot", "CSO"] },
  { id: "cse_is",   label: "CSE (Information Security)",codes: ["csi", "CSI"] },
  { id: "cse_bc",   label: "CSE (Blockchain)",         codes: ["cba", "cseb", "CSB"] },
  { id: "cse_net",  label: "CSE (Networks)",           codes: ["csn", "CSN"] },
  { id: "cse_gm",   label: "CSE (Gaming Technology)",  codes: ["csg", "CSG"] },
  { id: "cse_bs",   label: "CSE (Business Systems)",   codes: ["cse_bs"] },
  { id: "cse_rb",   label: "CSE (Robotics)",           codes: ["cser"] },
  { id: "cse_ss",   label: "CSE (Smart Systems)",      codes: ["css"] },
  { id: "cic",      label: "CSE (IoT & Cyber Security incl. Blockchain)", codes: ["cic", "CIC", "CSW"] },
  { id: "cs",       label: "Computer Science",         codes: ["cs", "cos"] },

  // ── Standalone AI branches ────────────────────────────────────
  { id: "ai_ml",    label: "AI & ML",                  codes: ["ai_ml", "AIM"] },
  { id: "ai_ds",    label: "AI & DS",                  codes: ["ai_ds", "AID"] },
  { id: "ai",       label: "Artificial Intelligence",  codes: ["ai", "AI"] },

  // ── ECE / electronics variants ────────────────────────────────
  { id: "ece_ai",   label: "ECE (AI)",                       codes: ["eca"] },
  { id: "ece_iot",  label: "ECE (IoT)",                      codes: ["ECI"] },
  { id: "ece_comm", label: "ECE & Communication",            codes: ["ECM"] },
  { id: "etm",      label: "Electronics & Telematics",       codes: ["ETM"] },
  { id: "eie",      label: "Electronics & Instrumentation",  codes: ["eie", "eii", "EIE"] },
  { id: "cme",      label: "Computer & Communication Engg.", codes: ["CME"] },
  { id: "power",    label: "Power Electronics",              codes: ["pee"] },

  // ── Mechanical / allied ───────────────────────────────────────
  { id: "mechatronics", label: "Mechatronics",          codes: ["mms", "MCT", "MMS"] },
  { id: "robotics",     label: "Robotics",              codes: ["rbt", "mrb"] },
  { id: "cad",          label: "Mechanical (CAD/CAM)",  codes: ["cad"] },
  { id: "auto",         label: "Automobile",            codes: ["auto", "AUT", "ANE"] },
  { id: "aero",         label: "Aerospace",             codes: ["ase"] },

  // ── Other engineering ─────────────────────────────────────────
  { id: "chemical",  label: "Chemical",                  codes: ["chemical", "CHE"] },
  { id: "mining",    label: "Mining",                    codes: ["mining", "MIN"] },
  { id: "mmt",       label: "Mining & Mineral Technology",codes: ["MMT"] },
  { id: "met",       label: "Metallurgy",                codes: ["met", "MET"] },
  { id: "petroleum", label: "Petroleum",                 codes: ["petroleum"] },
  { id: "naval",     label: "Naval Architecture",        codes: ["naval"] },
  { id: "agr",       label: "Agricultural Engineering",  codes: ["agr", "AGR", "DRG"] },
  { id: "biotech",   label: "Biotechnology",             codes: ["biotech", "BIO"] },
  { id: "bme",       label: "Biomedical",                codes: ["BME"] },
  { id: "env",       label: "Environmental",             codes: ["evt", "EVL"] },
  { id: "textile",   label: "Textile Technology",        codes: ["TEX"] },
  { id: "food",      label: "Food Technology",           codes: ["FDT"] },
  { id: "geo",       label: "Geo Informatics",           codes: ["geoinformatics", "GEO"] },
  { id: "ist",       label: "Information Science & Tech.",codes: ["ist"] },
  { id: "pharma",    label: "Pharma (Pharm-D)",          codes: ["PHE"] },
];

/** code (any case) → canonical id, for resolving legacy shareable links. */
const CODE_TO_ID: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const b of CANONICAL_BRANCHES) {
    for (const c of b.codes) map[c.toLowerCase()] = b.id;
  }
  return map;
})();

const BRANCH_BY_ID: Record<string, CanonicalBranch> = Object.fromEntries(
  CANONICAL_BRANCHES.map(b => [b.id, b])
);

/** All equivalent data codes for a canonical branch id (or [id] if unknown). */
export function codesForBranch(id: string): string[] {
  return BRANCH_BY_ID[id]?.codes ?? [id];
}

/** Competitor-standard display label for a canonical branch id. */
export function branchLabel(id: string): string {
  return BRANCH_BY_ID[id]?.label ?? id.toUpperCase();
}

/** Resolve any raw code (legacy URL param) to its canonical id, or undefined. */
export function canonicalIdForCode(code: string): string | undefined {
  return BRANCH_BY_ID[code] ? code : CODE_TO_ID[code.toLowerCase()];
}
