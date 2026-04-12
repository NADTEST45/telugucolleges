/**
 * Merit-based scholarship data for Deemed Universities in AP & Telangana.
 * All data sourced from official university websites (2025-26 academic year).
 */

export interface ScholarshipSlab {
  percent: string;           // e.g. "100%", "75%", "₹10,000/yr"
  criteria: string;          // e.g. "GAT 141-200" or "JEE ≥97%"
}

export interface ScholarshipTable {
  examName: string;          // e.g. "GAT", "KLUEEE", "BITSAT"
  branchGroup?: string;      // e.g. "CSE, AI&DS, Biotech" — omit if same for all
  slabs: ScholarshipSlab[];
}

export interface ScholarshipInfo {
  collegeName: string;
  tables: ScholarshipTable[];
  maintenance: string;       // CGPA/continuation requirement
  notes?: string[];          // additional info
  source: string;            // official URL
  sourceLabel: string;       // display name for source
}

export const SCHOLARSHIPS: Record<string, ScholarshipInfo> = {

  // ─── GITAM (Vizag + Hyderabad) ───────────────────────────────────────
  "GITM": {
    collegeName: "GITAM University — Visakhapatnam",
    tables: [
      {
        examName: "GAT (GITAM Admission Test)",
        slabs: [
          { percent: "100%", criteria: "Score 141–200" },
          { percent: "75%", criteria: "Score 131–140" },
          { percent: "60%", criteria: "Score 121–130" },
          { percent: "40%", criteria: "Score 111–120" },
          { percent: "25%", criteria: "Score 101–110" },
          { percent: "15%", criteria: "Score 86–100" },
        ],
      },
      {
        examName: "JEE Main",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥97" },
          { percent: "75%", criteria: "Percentile 94–96.99" },
          { percent: "60%", criteria: "Percentile 92–93.99" },
          { percent: "40%", criteria: "Percentile 90–91.99" },
          { percent: "25%", criteria: "Percentile 88–89.99" },
          { percent: "15%", criteria: "Percentile 85–87.99" },
        ],
      },
      {
        examName: "AP/TS EAPCET Rank",
        slabs: [
          { percent: "100%", criteria: "Rank 1–100" },
          { percent: "75%", criteria: "Rank 101–250" },
          { percent: "60%", criteria: "Rank 251–1,000" },
          { percent: "40%", criteria: "Rank 1,001–2,500" },
          { percent: "25%", criteria: "Rank 2,501–5,000" },
          { percent: "15%", criteria: "Rank 5,001–25,000" },
        ],
      },
      {
        examName: "SAT Score",
        slabs: [
          { percent: "100%", criteria: "1501–1600" },
          { percent: "75%", criteria: "1451–1500" },
          { percent: "60%", criteria: "1401–1450" },
          { percent: "40%", criteria: "1351–1400" },
          { percent: "25%", criteria: "1301–1350" },
          { percent: "15%", criteria: "1201–1300" },
        ],
      },
    ],
    maintenance: "CGPA 8.0 required each year to continue scholarship",
    notes: [
      "GITAM is a Deemed University — there is no EAPCET convener quota counselling. Admission is only through GAT/JEE/direct application",
      "EAPCET rank is accepted purely as a scholarship eligibility criterion for direct admission students",
      "Candidates offered 60% or higher must attend a personal interview",
      "Scholarships apply to tuition fee only",
      "Need-based and sports scholarships also available",
      "Use the GITAM Scholarship Calculator at gitam.edu for personalised estimates",
    ],
    source: "https://www.gitam.edu/fee-scholarship/student-scholarships",
    sourceLabel: "GITAM Official — Fee & Scholarships",
  },

  "GITH": {
    collegeName: "GITAM University — Hyderabad",
    tables: [
      {
        examName: "GAT (GITAM Admission Test)",
        slabs: [
          { percent: "100%", criteria: "Score 141–200" },
          { percent: "75%", criteria: "Score 131–140" },
          { percent: "60%", criteria: "Score 121–130" },
          { percent: "40%", criteria: "Score 111–120" },
          { percent: "25%", criteria: "Score 101–110" },
          { percent: "15%", criteria: "Score 86–100" },
        ],
      },
      {
        examName: "JEE Main",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥97" },
          { percent: "75%", criteria: "Percentile 94–96.99" },
          { percent: "60%", criteria: "Percentile 92–93.99" },
          { percent: "40%", criteria: "Percentile 90–91.99" },
          { percent: "25%", criteria: "Percentile 88–89.99" },
          { percent: "15%", criteria: "Percentile 85–87.99" },
        ],
      },
      {
        examName: "AP/TS EAPCET Rank",
        slabs: [
          { percent: "100%", criteria: "Rank 1–100" },
          { percent: "75%", criteria: "Rank 101–250" },
          { percent: "60%", criteria: "Rank 251–1,000" },
          { percent: "40%", criteria: "Rank 1,001–2,500" },
          { percent: "25%", criteria: "Rank 2,501–5,000" },
          { percent: "15%", criteria: "Rank 5,001–25,000" },
        ],
      },
      {
        examName: "SAT Score",
        slabs: [
          { percent: "100%", criteria: "1501–1600" },
          { percent: "75%", criteria: "1451–1500" },
          { percent: "60%", criteria: "1401–1450" },
          { percent: "40%", criteria: "1351–1400" },
          { percent: "25%", criteria: "1301–1350" },
          { percent: "15%", criteria: "1201–1300" },
        ],
      },
    ],
    maintenance: "CGPA 8.0 required each year to continue scholarship",
    notes: [
      "Same scholarship structure as GITAM Vizag campus",
      "GITAM is a Deemed University — no EAPCET convener quota. EAPCET rank is used only as a scholarship criterion",
      "Candidates offered 60% or higher must attend a personal interview",
    ],
    source: "https://www.gitam.edu/fee-scholarship/student-scholarships",
    sourceLabel: "GITAM Official — Fee & Scholarships",
  },

  // ─── KL University (Vijayawada + Hyderabad) ─────────────────────────
  "KLUN": {
    collegeName: "KL University — Vijayawada",
    tables: [
      {
        examName: "KLUEEE Rank",
        branchGroup: "CSE, AI & DS, Biotech",
        slabs: [
          { percent: "50%", criteria: "Rank 1–50" },
          { percent: "25%", criteria: "Rank 51–1,000" },
          { percent: "15%", criteria: "Rank 1,001–2,000" },
          { percent: "10%", criteria: "Rank 2,001–5,000" },
          { percent: "₹10,000/yr", criteria: "Rank 5,001–20,000" },
        ],
      },
      {
        examName: "KLUEEE Rank",
        branchGroup: "ECE, CS & IT, IoT",
        slabs: [
          { percent: "50%", criteria: "Rank 1–500" },
          { percent: "25%", criteria: "Rank 501–1,500" },
          { percent: "15%", criteria: "Rank 1,501–3,500" },
          { percent: "10%", criteria: "Rank 3,501–7,500" },
          { percent: "₹10,000/yr", criteria: "Rank 7,501–15,000" },
        ],
      },
      {
        examName: "KLUEEE Rank",
        branchGroup: "CE, ME, EEE",
        slabs: [
          { percent: "50%", criteria: "Rank 1–1,000" },
          { percent: "25%", criteria: "Rank 1,001–4,000" },
          { percent: "15%", criteria: "Rank 4,001–8,000" },
          { percent: "10%", criteria: "Rank 8,001–15,000" },
          { percent: "₹10,000/yr", criteria: "Rank 15,001–25,000" },
        ],
      },
      {
        examName: "JEE Main Percentile",
        branchGroup: "CSE, AI & DS, Biotech",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥97" },
          { percent: "50%", criteria: "Percentile ≥95" },
          { percent: "25%", criteria: "Percentile ≥93" },
          { percent: "15%", criteria: "Percentile ≥92" },
          { percent: "10%", criteria: "Percentile ≥90" },
        ],
      },
      {
        examName: "JEE Main Percentile",
        branchGroup: "ECE, CS & IT, IoT",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥96" },
          { percent: "50%", criteria: "Percentile ≥94" },
          { percent: "25%", criteria: "Percentile ≥92" },
          { percent: "15%", criteria: "Percentile ≥90" },
          { percent: "10%", criteria: "Percentile ≥85" },
        ],
      },
      {
        examName: "JEE Main Percentile",
        branchGroup: "CE, ME, EEE",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥95" },
          { percent: "50%", criteria: "Percentile ≥92" },
          { percent: "25%", criteria: "Percentile ≥90" },
          { percent: "15%", criteria: "Percentile ≥85" },
          { percent: "10%", criteria: "Percentile ≥80" },
        ],
      },
    ],
    maintenance: "CGPA 9.0 for CSE/AI&DS/Biotech group; CGPA 8.0 for other branches",
    notes: [
      "KL is a Deemed University — there is no EAPCET convener quota counselling. All admissions are through KLUEEE/JEE/direct application",
      "AP/TS EAPCET rank is also accepted as a scholarship eligibility criterion (similar to KLUEEE rank slabs) — contact admissions for exact EAPCET slab mapping",
      "Board-based scholarships also available — TS/AP State Board ≥96% gets 50% concession; CBSE ≥9.2 CGPA",
      "SC/ST/PH: ₹10,000/yr concession; OBC: ₹5,000/yr concession",
      "Scholarship is on tuition fee only, applied semester-wise",
      "Concession continues from 2nd semester onward only if student maintains required CGPA",
    ],
    source: "https://www.kluniversity.in/sships3.aspx",
    sourceLabel: "KL University Official — Fee Structure & Scholarships",
  },

  "KLHD": {
    collegeName: "KL University — Hyderabad",
    tables: [
      {
        examName: "KLUEEE Rank",
        branchGroup: "CSE, AI & DS, Biotech",
        slabs: [
          { percent: "50%", criteria: "Rank 1–50" },
          { percent: "25%", criteria: "Rank 51–1,000" },
          { percent: "15%", criteria: "Rank 1,001–2,000" },
          { percent: "10%", criteria: "Rank 2,001–5,000" },
          { percent: "₹10,000/yr", criteria: "Rank 5,001–20,000" },
        ],
      },
      {
        examName: "KLUEEE Rank",
        branchGroup: "ECE, CS & IT, IoT",
        slabs: [
          { percent: "50%", criteria: "Rank 1–500" },
          { percent: "25%", criteria: "Rank 501–1,500" },
          { percent: "15%", criteria: "Rank 1,501–3,500" },
          { percent: "10%", criteria: "Rank 3,501–7,500" },
          { percent: "₹10,000/yr", criteria: "Rank 7,501–15,000" },
        ],
      },
      {
        examName: "KLUEEE Rank",
        branchGroup: "CE, ME, EEE",
        slabs: [
          { percent: "50%", criteria: "Rank 1–1,000" },
          { percent: "25%", criteria: "Rank 1,001–4,000" },
          { percent: "15%", criteria: "Rank 4,001–8,000" },
          { percent: "10%", criteria: "Rank 8,001–15,000" },
          { percent: "₹10,000/yr", criteria: "Rank 15,001–25,000" },
        ],
      },
      {
        examName: "JEE Main Percentile",
        branchGroup: "CSE, AI & DS, Biotech",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥97" },
          { percent: "50%", criteria: "Percentile ≥95" },
          { percent: "25%", criteria: "Percentile ≥93" },
          { percent: "15%", criteria: "Percentile ≥92" },
          { percent: "10%", criteria: "Percentile ≥90" },
        ],
      },
    ],
    maintenance: "CGPA 9.0 for CSE group; CGPA 8.0 for other branches",
    notes: [
      "Same scholarship structure as KL Vijayawada campus",
      "KL is a Deemed University — no EAPCET convener quota. EAPCET rank is accepted as a scholarship criterion",
      "Board-based scholarships also available",
    ],
    source: "https://www.kluniversity.in/sships3.aspx",
    sourceLabel: "KL University Official — Fee Structure & Scholarships",
  },

  // ─── VR Siddhartha (SAHE) ───────────────────────────────────────────
  "VRSE": {
    collegeName: "Siddhartha Academy of Higher Education (VR Siddhartha)",
    tables: [
      {
        examName: "AP EAPCET Rank",
        branchGroup: "CSE, AI&DS, CSE (AI&ML) — Fee: ₹2,50,000/yr",
        slabs: [
          { percent: "100%", criteria: "Rank 1–500" },
          { percent: "70%", criteria: "Rank 501–2,000" },
          { percent: "60%", criteria: "Rank 2,001–4,000" },
          { percent: "40%", criteria: "Rank 4,001–10,000" },
          { percent: "25%", criteria: "Rank 10,001–20,000" },
        ],
      },
      {
        examName: "JEE Main Percentile",
        branchGroup: "CSE, AI&DS, CSE (AI&ML)",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥97" },
          { percent: "70%", criteria: "Percentile 95–96.99" },
          { percent: "60%", criteria: "Percentile 93–94.99" },
          { percent: "40%", criteria: "Percentile 90–92.99" },
          { percent: "25%", criteria: "Percentile 85–89.99" },
        ],
      },
      {
        examName: "AP EAPCET Rank",
        branchGroup: "ECE — Fee: ₹1,65,000/yr",
        slabs: [
          { percent: "75%", criteria: "Rank <3,000" },
          { percent: "50%", criteria: "Rank 3,000–10,000" },
          { percent: "25%", criteria: "Rank 10,001–20,000" },
          { percent: "10%", criteria: "Rank 20,001–40,000" },
        ],
      },
      {
        examName: "AP EAPCET Rank",
        branchGroup: "CE, EEE, EIE, ME — Fee: ₹90,000/yr",
        slabs: [
          { percent: "50%", criteria: "Rank ≤10,000" },
          { percent: "25%", criteria: "Rank 10,001–50,000" },
          { percent: "10%", criteria: "Rank 50,001–1,00,000" },
        ],
      },
    ],
    maintenance: "CGPA 7.5, 75% attendance, no backlogs",
    notes: [
      "SAHE is a Deemed University — no EAPCET convener quota counselling. AP EAPCET rank is used purely as a scholarship criterion for direct admission",
      "Scholarships limited to 30% of intake per branch (first-come, first-served)",
      "SEEE (own exam) ranks also accepted",
      "IT branch: same slabs as CSE at ₹2,25,000/yr",
    ],
    source: "https://www.vrsiddhartha.ac.in/scholorships2025-26/",
    sourceLabel: "SAHE Official — Scholarships 2025-26",
  },

  // ─── BITS Pilani Hyderabad ──────────────────────────────────────────
  "BITS": {
    collegeName: "BITS Pilani, Hyderabad Campus",
    tables: [
      {
        examName: "BITSAT Rank",
        slabs: [
          { percent: "100%", criteria: "Top 500 rank + family income ≤₹20L/yr" },
          { percent: "10–100%", criteria: "Top 25% of admitted students (semester-wise)" },
        ],
      },
      {
        examName: "Board Toppers",
        slabs: [
          { percent: "100% (1st sem)", criteria: "1st position in 12th board" },
          { percent: "75% (1st sem)", criteria: "2nd position in 12th board" },
          { percent: "50% (1st sem)", criteria: "3rd position in 12th board" },
          { percent: "20% (1st sem)", criteria: "≥90% aggregate in 12th" },
        ],
      },
    ],
    maintenance: "CGPA 7.5 to retain 100% scholarship; semester waivers renewed each sem",
    notes: [
      "No waiver on admission fee under any scholarship scheme",
      "25% of students receive semester-based tuition fee waivers (10–100%)",
      "Merit-cum-Need scholarships evaluated separately",
    ],
    source: "https://admissions.bits-pilani.ac.in/FD/scholarship.html",
    sourceLabel: "BITS Pilani Official — Admissions Scholarships",
  },

  // ─── IIIT Hyderabad ─────────────────────────────────────────────────
  "IIIT": {
    collegeName: "IIIT Hyderabad",
    tables: [
      {
        examName: "Diversity & Need-Based",
        slabs: [
          { percent: "25% tuition waiver", criteria: "All women students" },
          { percent: "100% tuition waiver", criteria: "Family income <₹8L/yr (from 2nd semester)" },
          { percent: "Partial tuition waiver", criteria: "Income >₹8L — evaluated case-by-case" },
        ],
      },
    ],
    maintenance: "Good academic standing — no specific CGPA threshold published",
    notes: [
      "Admission is via UGEE (own exam) — highly selective, no traditional merit slabs",
      "Alumni-funded pay-it-forward scholarship model",
      "SBI education loan up to ₹40L without collateral available",
    ],
    source: "https://ugadmissions.iiit.ac.in/financial-assistance/",
    sourceLabel: "IIIT Hyderabad Official — Financial Assistance",
  },

  // ─── ICFAI / IFHE Hyderabad ─────────────────────────────────────────
  "ICFA": {
    collegeName: "ICFAI Foundation for Higher Education (IFHE)",
    tables: [
      {
        examName: "10+2 Marks / Entrance Exam",
        slabs: [
          { percent: "25–100%", criteria: "Based on 10+2 performance (exact slab cutoffs vary yearly)" },
          { percent: "Up to 10%", criteria: "From 2nd year onward based on semester CGPA" },
        ],
      },
    ],
    maintenance: "Continued based on academic performance each semester",
    notes: [
      "Scholarship slabs are finalized during admission counselling each year",
      "Base B.Tech fee: ~₹2,50,000/yr",
      "Contact admissions for current year's exact slab breakpoints",
    ],
    source: "https://www.ifheindia.org/",
    sourceLabel: "IFHE Official Website",
  },

  // ─── Vignan's University ────────────────────────────────────────────
  "VIGF": {
    collegeName: "Vignan's Foundation for Science, Technology & Research",
    tables: [
      {
        examName: "VSAT / JEE / EAMCET Performance",
        slabs: [
          { percent: "50%", criteria: "Top 5% of branch intake (top fifth)" },
          { percent: "30%", criteria: "Top 5% of branch intake (next two-fifths)" },
          { percent: "20%", criteria: "Top 5% of branch intake (remaining two-fifths)" },
        ],
      },
      {
        examName: "Need-Based",
        slabs: [
          { percent: "50–100%", criteria: "Based on family income documentation" },
        ],
      },
    ],
    maintenance: "CGPA 7.0, no backlogs",
    notes: [
      "Vignan's is a Deemed University — there is no EAPCET convener quota counselling. Admission is through VSAT/JEE/direct application only",
      "AP/TS EAPCET rank is accepted as a scholarship eligibility criterion — students apply directly and cite EAPCET rank for fee concession",
      "Merit scholarships apply to Category-A fee component only",
      "VSAT (Vignan's own exam) is the primary admission and scholarship route",
      "25% of total seats reserved for scholarships: 5% at 75%, 10% at 50%, 10% at 25% concession",
      "Students with 90% intermediate aggregate get 50% scholarship; 80% aggregate gets 25%",
    ],
    source: "https://www.vignan.ac.in/curscholorships.php",
    sourceLabel: "Vignan's University Official — Scholarships",
  },

  // ─── Amrita Vishwa Vidyapeetham, Amaravati ──────────────────────────
  "AMRT": {
    collegeName: "Amrita Vishwa Vidyapeetham, Amaravati",
    tables: [
      {
        examName: "AEEE / JEE Main Rank — Base fee: ₹5,00,000/yr",
        slabs: [
          { percent: "~80% off → Pay ~₹1,00,000/yr", criteria: "Top AEEE / JEE ranks (Slab 1 — highest merit)" },
          { percent: "~60% off → Pay ~₹2,00,000/yr", criteria: "Strong AEEE / JEE performance (Slab 2)" },
          { percent: "~30% off → Pay ~₹3,50,000/yr", criteria: "Above-average AEEE / JEE performance (Slab 3)" },
          { percent: "No concession → ₹5,00,000/yr", criteria: "Regular admission (no scholarship)" },
        ],
      },
    ],
    maintenance: "Slab 1: CGPA 8.0; Slab 2: CGPA 7.5 each year",
    notes: [
      "70%+ of seats are in scholarship category",
      "Exact rank cutoffs for each slab assigned during counselling",
      "Separate scholarship pools for AEEE and JEE candidates",
      "One-time caution deposit of ₹10,000 applicable",
    ],
    source: "https://www.amrita.edu/admissions/engineering/",
    sourceLabel: "Amrita Official — B.Tech Admissions",
  },

  // ─── GMR University ─────────────────────────────────────────────────
  "GMRI": {
    collegeName: "GMR University (formerly GMRIT)",
    tables: [
      {
        examName: "AP EAPCET Rank",
        slabs: [
          { percent: "100% tuition + hostel", criteria: "EAPCET Rank <5,000" },
          { percent: "₹10,000 merit award", criteria: "High CGPA during studies" },
        ],
      },
    ],
    maintenance: "Good academic standing",
    notes: [
      "Detailed slab breakpoints not published — contact admissions",
      "Base B.Tech fee: ~₹78,000/yr (affordable among deemed universities)",
    ],
    source: "https://www.gmru.edu.in/admissions/",
    sourceLabel: "GMR University Official — Admissions",
  },

  // ─── Audisankara University ─────────────────────────────────────────
  "AUDI": {
    collegeName: "Audisankara Deemed to be University",
    tables: [
      {
        examName: "National / State Exam Scores",
        slabs: [
          { percent: "Merit-based concession", criteria: "Based on JEE / EAPCET / 10+2 marks" },
        ],
      },
    ],
    maintenance: "Continued based on academic performance",
    notes: [
      "~80% of students receive some form of fee assistance",
      "Central Sector and Merit-cum-Means government schemes applicable",
      "Specific institutional slab table not publicly available — contact admissions",
      "Base B.Tech fee: ~₹61,000/yr (most affordable deemed university in AP/TS)",
    ],
    source: "https://www.audisankarauni.ac.in/",
    sourceLabel: "Audisankara University Official Website",
  },

  // ─── MITS Madanapalle ──────────────────────────────────────────────
  "MITS": {
    collegeName: "Madanapalle Institute of Technology & Science (MITS)",
    tables: [
      {
        examName: "MITSUCET (Own Entrance Exam)",
        slabs: [
          { percent: "100%", criteria: "Rank 1" },
          { percent: "75%", criteria: "Rank 2–5" },
          { percent: "50%", criteria: "Rank 6–10" },
          { percent: "25%", criteria: "Rank 10–20" },
        ],
      },
      {
        examName: "10+2 / CBSE / ICSE / State CET / JEE",
        branchGroup: "ECE, Bioinformatics — Base fee: ₹99,000/sem (₹1,98,000/yr)",
        slabs: [
          { percent: "19% off → Pay ₹80,000/sem", criteria: "10+2 ≥90% · CBSE/ICSE ≥9 CGPA · State CET ≤10,000 · JEE ≤30,000" },
          { percent: "14% off → Pay ₹85,000/sem", criteria: "10+2 85–89.99% · CBSE/ICSE ≥8 · CET 10,001–15,000 · JEE 30,001–50,000" },
          { percent: "9% off → Pay ₹90,000/sem", criteria: "10+2 80–84.99% · CBSE/ICSE ≥7 · CET 15,001–25,000 · JEE 50,001–70,000" },
          { percent: "4% off → Pay ₹95,000/sem", criteria: "10+2 70–79.99% · CBSE/ICSE ≥6 · CET 25,001–40,000 · JEE 70,001–90,000" },
          { percent: "No concession → ₹99,000/sem", criteria: "Other eligible candidates" },
        ],
      },
      {
        examName: "10+2 / CBSE / ICSE / State CET / JEE",
        branchGroup: "Civil, Mechanical, EEE — Base fee: ₹65,000/sem (₹1,30,000/yr)",
        slabs: [
          { percent: "23% off → Pay ₹50,000/sem", criteria: "10+2 85–100% · CBSE/ICSE ≥8 · State CET ≤10,000 · JEE ≤50,000" },
          { percent: "15% off → Pay ₹55,000/sem", criteria: "10+2 75–84.99% · CBSE/ICSE ≥7 · CET ≤30,000 · JEE 50,001–80,000" },
          { percent: "8% off → Pay ₹60,000/sem", criteria: "10+2 65–74.99% · CBSE/ICSE ≥6 · CET ≤50,000 · JEE 80,001–1,20,000" },
          { percent: "No concession → ₹65,000/sem", criteria: "Other eligible candidates" },
        ],
      },
      {
        examName: "10+2 / CBSE / ICSE / State CET / JEE",
        branchGroup: "CSE, CSE (AI&DS), CSE (AI&ML), CSE (Cyber Security) — Base fee: ₹1,25,000/sem (₹2,50,000/yr)",
        slabs: [
          { percent: "21% off → Pay ₹99,000/sem", criteria: "10+2 95–100% · CBSE/ICSE ≥9 · State CET ≤10,000 · JEE ≤30,000" },
          { percent: "14% off → Pay ₹1,07,500/sem", criteria: "10+2 90–94.99% · CBSE/ICSE ≥8 · CET 10,001–15,000 · JEE 30,001–50,000" },
          { percent: "10% off → Pay ₹1,12,500/sem", criteria: "10+2 85–89.99% · CBSE/ICSE ≥7 · CET 15,001–25,000 · JEE 50,001–70,000" },
          { percent: "6% off → Pay ₹1,17,500/sem", criteria: "10+2 75–84.99% · CBSE/ICSE ≥6 · CET 25,001–40,000 · JEE 70,001–90,000" },
          { percent: "No concession → ₹1,25,000/sem", criteria: "Other eligible candidates" },
        ],
      },
    ],
    maintenance: "Continued based on academic performance",
    notes: [
      "Fee shown is per semester — multiply by 2 for annual fee",
      "Any one qualifying criteria is sufficient (10+2 OR CBSE/ICSE CGPA OR State CET rank OR JEE rank)",
      "M.Tech VLSI with GATE qualification: ₹0 fee/sem (9+ CGPA, PGECET <100)",
      "M.Tech Civil (8+ CGPA, PGECET <300): ₹10,000/sem; M.Tech Automation (7+ CGPA, PGECET <500): ₹20,000/sem",
      "MBA (75–100% qualifying, ICET <500, CAT/MAT ≥75 percentile): ₹50,000/sem vs base ₹60,000",
      "MCA (75–100% qualifying, ICET <500): ₹50,000/sem vs base ₹60,000",
      "AY 2026-27 fee structure",
    ],
    source: "https://www.mits.ac.in/",
    sourceLabel: "MITS Official — Fee Structure AY 2026-27",
  },

  // ─── SRM University AP — Amaravati ──────────────────────────────────
  "SRMA": {
    collegeName: "SRM University AP — Amaravati",
    tables: [
      {
        examName: "SRMJEEE Rank",
        slabs: [
          { percent: "100%", criteria: "Rank 1–100 (Founder's Scholarship)" },
          { percent: "100%", criteria: "Rank 101–500" },
          { percent: "75%", criteria: "Rank 501–1,000" },
          { percent: "50%", criteria: "Rank 1,001–2,000" },
          { percent: "25%", criteria: "Rank 2,001–3,000" },
        ],
      },
      {
        examName: "Board Toppers / JEE Main",
        slabs: [
          { percent: "100%", criteria: "CBSE/State Board district topper" },
          { percent: "50%", criteria: "90%+ in Higher Secondary with family income ≤ ₹4.5L/yr (Merit-cum-Means)" },
        ],
      },
    ],
    maintenance: "CGPA 9.0, 75% attendance, clean disciplinary record — renewed annually",
    notes: [
      "SRM AP is a Private University with two admission routes: (1) EAPCET convener quota (~70% seats, fee ~₹1,02,000/yr set by GO) and (2) Direct admission via SRMJEEE (~30% seats, fee ~₹4,00,000/yr)",
      "These merit scholarships apply to the direct admission (SRMJEEE) fee only — convener quota students already pay the lower GO-regulated fee",
      "EAPCET rank may also be considered for scholarship on direct admission — contact admissions for details",
      "Founder's Scholarship: top 100 SRMJEEE + CBSE/State Board district toppers",
      "SRM also offers President Scholarship, Socio-Economic, Differently Abled, Arts & Culture, and Armed Forces Scholarships",
    ],
    source: "https://www.srmist.edu.in/policies/scholarship-policy/",
    sourceLabel: "SRMIST Official — Scholarship Policy",
  },

  // ─── VIT-AP University — Amaravati ──────────────────────────────────
  "VTAP": {
    collegeName: "VIT-AP University — Amaravati",
    tables: [
      {
        examName: "VITEEE Rank (Fee Category System)",
        slabs: [
          { percent: "75%", criteria: "Rank 1–50 (Category 1 — ₹1,95,000/yr)" },
          { percent: "50%", criteria: "Rank 51–100" },
          { percent: "25%", criteria: "Rank 101–1,000" },
          { percent: "Cat 1", criteria: "Top ranks — ₹1,95,000/yr" },
          { percent: "Cat 2", criteria: "₹3,04,000/yr" },
          { percent: "Cat 3", criteria: "₹4,02,000/yr" },
          { percent: "Cat 4", criteria: "₹4,45,000/yr" },
          { percent: "Cat 5", criteria: "₹4,90,000/yr" },
        ],
      },
      {
        examName: "Board Toppers",
        slabs: [
          { percent: "100%", criteria: "GV Merit — National board topper (all 4 years)" },
          { percent: "50%", criteria: "Tmt. Rajeswari Ammal — District topper (+ extra 25% for girls = 75% total)" },
        ],
      },
    ],
    maintenance: "Good academic standing — scholarship fixed for full 4-year duration, no annual hikes",
    notes: [
      "VIT-AP is a Private University with two admission routes: (1) EAPCET convener quota (limited seats, fee ~₹70,000/yr set by GO) and (2) Direct admission via VITEEE (majority of seats, fee ₹1.95L–₹4.9L/yr by category)",
      "These merit scholarships and fee categories apply to VITEEE direct admission only — convener quota students already pay the lower GO-regulated fee",
      "VIT-AP uses a category system (Cat 1–5) based on VITEEE rank — lower category = lower fee",
      "Category assignment is based on VITEEE performance; exact rank cutoffs vary each year",
      "Fee is fixed for all 4 years at the time of admission — no annual increase",
      "Concession applies to tuition only; hostel, caution deposit (₹3,000 refundable) are extra",
    ],
    source: "https://vitap.ac.in/fees-and-scholarships",
    sourceLabel: "VIT-AP Official — Fees & Scholarships",
  },

  // ─── Anurag University — Hyderabad ──────────────────────────────────
  "CVSR": {
    collegeName: "Anurag University — Hyderabad",
    tables: [
      {
        examName: "TS EAPCET / AP EAPCET Rank",
        slabs: [
          { percent: "100%", criteria: "Rank 1–2,000" },
          { percent: "50%", criteria: "Rank 2,001–10,000" },
          { percent: "25%", criteria: "Rank 10,001–15,000" },
          { percent: "10%", criteria: "Rank 15,001–25,000" },
        ],
      },
      {
        examName: "JEE Main Rank",
        slabs: [
          { percent: "100%", criteria: "Rank 1–25,000" },
          { percent: "50%", criteria: "Rank 25,001–50,000" },
          { percent: "25%", criteria: "Rank 50,001–75,000" },
          { percent: "10%", criteria: "Rank 75,001–1,00,000" },
        ],
      },
      {
        examName: "Anurag CET (Own Entrance)",
        slabs: [
          { percent: "100%", criteria: "Rank 1–10" },
          { percent: "50%", criteria: "Rank 11–25" },
          { percent: "25%", criteria: "Rank 26–100" },
        ],
      },
    ],
    maintenance: "CGPA 8.0, 75% attendance, no backlogs — renewed annually",
    notes: [
      "Anurag is a Private University with two admission routes: (1) TS EAPCET convener quota (~75% seats, fee ~₹1,35,000/yr set by GO) and (2) Direct admission via university/Anurag CET (~25% seats, fee ~₹2,85,000/yr)",
      "These merit scholarships apply to the direct admission fee — students joining via EAPCET convener already pay the lower GO-regulated fee",
      "However, EAPCET rank is also accepted as a scholarship criterion for direct admission students (see slabs above)",
      "Government junior college students with EAPCET rank <20,000 get 50% tuition concession (special provision)",
      "Top 1–500 admissions receive a free laptop",
      "Total 4-year scholarship value up to ₹11,40,000 for 100% waiver recipients",
    ],
    source: "https://anurag.edu.in/scholarships/",
    sourceLabel: "Anurag University Official — Scholarships",
  },
};

/** Get scholarship info for a college by code */
export function getScholarships(code: string): ScholarshipInfo | null {
  return SCHOLARSHIPS[code] || null;
}
