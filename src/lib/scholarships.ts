/**
 * Merit-based scholarship data for Deemed & Private Universities in AP & Telangana.
 * All data sourced from official university websites (2025-26 / 2026-27 academic year,
 * per each university's latest official publication). Last verified: June 2026.
 */

export interface ScholarshipSlab {
  percent: string;           // e.g. "100%", "75%", "₹10,000/yr"
  criteria: string;          // e.g. "GAT 141-200" or "JEE ≥97%"
}

export interface ScholarshipTable {
  examName: string;          // e.g. "GAT", "KLEEE", "BITSAT"
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
    maintenance: "CGPA ≥8.0 continues full scholarship; CGPA 7.5–7.99 → scholarship downgraded one slab; below 7.5 → discontinued",
    notes: [
      "GITAM is a Deemed University — there is no EAPCET convener quota counselling. Admission is only through GAT/JEE/direct application",
      "EAPCET rank is accepted purely as a scholarship eligibility criterion for direct admission students",
      "Candidates offered 60% or higher scholarship must attend a personal interview",
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
    maintenance: "CGPA ≥8.0 continues full scholarship; CGPA 7.5–7.99 → scholarship downgraded one slab; below 7.5 → discontinued",
    notes: [
      "Same scholarship structure as GITAM Vizag campus",
      "GITAM is a Deemed University — no EAPCET convener quota. EAPCET rank is used only as a scholarship criterion",
      "Candidates offered 60% or higher scholarship must attend a personal interview",
    ],
    source: "https://www.gitam.edu/fee-scholarship/student-scholarships",
    sourceLabel: "GITAM Official — Fee & Scholarships",
  },

  // ─── KL University (Vijayawada + Hyderabad) ─────────────────────────
  "KLUN": {
    collegeName: "KL University — Vijayawada",
    tables: [
      {
        examName: "KLEEE Rank",
        branchGroup: "CSE, AI & DS, Biotech",
        slabs: [
          { percent: "50%", criteria: "Rank 1–100" },
          { percent: "25%", criteria: "Rank 101–1,500" },
          { percent: "15%", criteria: "Rank 1,501–3,000" },
          { percent: "10%", criteria: "Rank 3,001–6,000" },
          { percent: "₹5,000/yr", criteria: "Rank 6,001–25,000" },
        ],
      },
      {
        examName: "KLEEE Rank",
        branchGroup: "ECE, CS & IT, IoT",
        slabs: [
          { percent: "50%", criteria: "Rank 1–500" },
          { percent: "25%", criteria: "Rank 501–2,000" },
          { percent: "15%", criteria: "Rank 2,001–4,000" },
          { percent: "10%", criteria: "Rank 4,001–15,000" },
          { percent: "₹5,000/yr", criteria: "Rank 15,001–30,000" },
        ],
      },
      {
        examName: "KLEEE Rank",
        branchGroup: "CE, ME, EEE",
        slabs: [
          { percent: "50%", criteria: "Rank 1–1,000" },
          { percent: "25%", criteria: "Rank 1,001–5,000" },
          { percent: "15%", criteria: "Rank 5,001–10,000" },
          { percent: "10%", criteria: "Rank 10,001–25,000" },
          { percent: "₹5,000/yr", criteria: "Rank 25,001–75,000" },
        ],
      },
      {
        examName: "AP/TS EAPCET Rank",
        branchGroup: "CSE, AI & DS, Biotech",
        slabs: [
          { percent: "50%", criteria: "Rank 1–1,000" },
          { percent: "25%", criteria: "Rank 1,001–5,000" },
          { percent: "15%", criteria: "Rank 5,001–10,000" },
          { percent: "10%", criteria: "Rank 10,001–15,000" },
          { percent: "₹5,000/yr", criteria: "Rank 15,001–20,000" },
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
    maintenance: "CGPA 9.0 for CSE/AI&DS/BT/ECE/CS&IT groups; CGPA 8.0 for ME/CE/EEE/IoT",
    notes: [
      "KL is a Deemed University — there is no EAPCET convener quota counselling. All admissions are through KLEEE/JEE/direct application",
      "EAPCET slabs shown are for the CSE group — other branch groups have separate bands, see official page",
      "Rank bands above are from the official 2026-27 scholarship publication",
      "Board-based scholarships also available — concession varies by branch (e.g. CBSE ≥94% gets 50% for CSE group)",
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
        examName: "KLEEE Rank",
        branchGroup: "CSE, AI & DS",
        slabs: [
          { percent: "50%", criteria: "Rank 1–100" },
          { percent: "25%", criteria: "Rank 101–1,500" },
          { percent: "15%", criteria: "Rank 1,501–3,000" },
          { percent: "10%", criteria: "Rank 3,001–6,000" },
          { percent: "₹5,000/yr", criteria: "Rank 6,001–25,000" },
        ],
      },
      {
        examName: "KLEEE Rank",
        branchGroup: "ECE, CS & IT",
        slabs: [
          { percent: "50%", criteria: "Rank 1–500" },
          { percent: "25%", criteria: "Rank 501–2,000" },
          { percent: "15%", criteria: "Rank 2,001–4,000" },
          { percent: "10%", criteria: "Rank 4,001–15,000" },
          { percent: "₹5,000/yr", criteria: "Rank 15,001–30,000" },
        ],
      },
      {
        examName: "JEE Main Percentile",
        branchGroup: "CSE, AI & DS",
        slabs: [
          { percent: "100%", criteria: "Percentile ≥97" },
          { percent: "50%", criteria: "Percentile ≥95" },
          { percent: "25%", criteria: "Percentile ≥93" },
          { percent: "15%", criteria: "Percentile ≥92" },
          { percent: "10%", criteria: "Percentile ≥90" },
        ],
      },
    ],
    maintenance: "CGPA 9.0 for CSE/AI&DS/ECE/CS&IT groups",
    notes: [
      "Hyderabad operates two campuses — Aziz Nagar and Bowrampet. Programs offered: CSE, AI&DS, ECE (CS&IT at Bowrampet only)",
      "KLEEE rank bands are the same as the Vijayawada campus (official 2026-27 publication)",
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
      "Slabs are as published for AY 2025-26 — SAHE has not yet released a 2026-27 update; confirm with admissions",
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
          { percent: "100%", criteria: "Top 500 all-India BITSAT rank + family income ≤₹20L/yr (tuition-blind, all 4 years)" },
          { percent: "10–100%", criteria: "Top 25% of admitted students (semester-wise waivers)" },
        ],
      },
      {
        examName: "Semester Merit Scholarships (CGPA-based)",
        slabs: [
          { percent: "100%", criteria: "Merit: top 2% of campus by CGPA" },
          { percent: "50%", criteria: "Merit: next 1% by CGPA" },
          { percent: "100%", criteria: "Merit-cum-Need: top 5% (with need criteria)" },
          { percent: "50%", criteria: "Merit-cum-Need: next 2%" },
          { percent: "25%", criteria: "Merit-cum-Need: next 5%" },
          { percent: "10%", criteria: "Merit-cum-Need: next 10%" },
        ],
      },
    ],
    maintenance: "CGPA 7.5 to retain 100% scholarship; semester waivers renewed each sem",
    notes: [
      "No waiver on admission fee under any scholarship scheme",
      "~25% of students receive semester-based tuition fee waivers (10–100%)",
      "Merit scholarships are awarded semester-wise on campus CGPA standing, not entrance scores",
    ],
    source: "https://admissions.bits-pilani.ac.in/FD/scholarship.html",
    sourceLabel: "BITS Pilani Official — Admissions Scholarships",
  },

  // ─── IIIT Hyderabad ─────────────────────────────────────────────────
  "IIIT": {
    collegeName: "IIIT Hyderabad",
    tables: [
      {
        examName: "Need-Based Financial Assistance",
        slabs: [
          { percent: "Financial support (up to full tuition)", criteria: "Family income <₹8L/yr — subject to availability and stipulated criteria" },
          { percent: "Partial support", criteria: "Income >₹8L — evaluated case-by-case" },
        ],
      },
    ],
    maintenance: "Good academic standing — no specific CGPA threshold published",
    notes: [
      "Admission via UGEE, JEE Main, Olympiad, Board-based (≥85%), and other routes — highly selective, no traditional merit slabs",
      "25% Diversity Pool of seats for women candidates in the top percentile (JEE channel) — this is a seat pool, not a fee waiver",
      "Financial assistance is via the alumni-funded pay-it-forward model — support level is not guaranteed",
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
        examName: "10+2 Marks (Semester 1, % of ₹1,40,000 sem fee)",
        slabs: [
          { percent: "100%", criteria: "10+2 aggregate ≥95%" },
          { percent: "80%", criteria: "10+2 aggregate 90–94.99%" },
          { percent: "60%", criteria: "10+2 aggregate 85–89.99%" },
          { percent: "40%", criteria: "10+2 aggregate 80–84.99%" },
          { percent: "20%", criteria: "10+2 aggregate 75–79.99%" },
        ],
      },
      {
        examName: "Continuation Scholarship (Semester 2 onward, by CGPA)",
        slabs: [
          { percent: "30%/sem", criteria: "CGPA ≥9.0" },
          { percent: "22%/sem", criteria: "CGPA 8.5–8.99" },
          { percent: "15%/sem", criteria: "CGPA 8.0–8.49" },
        ],
      },
    ],
    maintenance: "From Semester 2, scholarship is re-awarded each semester based on CGPA slabs above",
    notes: [
      "Base B.Tech fee: ₹1,40,000/sem (₹2,80,000/yr; ₹11.2L program + ₹20,000 admission fee)",
      "Slabs per official AY 2026-27 B.Tech admissions page",
    ],
    source: "https://www.ifheindia.org/icfaitech-school-hyderabad/icfaitech/ugprograms/btech",
    sourceLabel: "IFHE Official — B.Tech Admissions & Scholarships",
  },

  // ─── Vignan's University ────────────────────────────────────────────
  "VIGF": {
    collegeName: "Vignan's Foundation for Science, Technology & Research",
    tables: [
      {
        examName: "Branch-wise Academic Merit (Top 5% of intake)",
        slabs: [
          { percent: "50%", criteria: "Top 5% of branch intake (top fifth) — % of Category-A fee" },
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
      "The official scheme above is awarded on in-university academic performance, branch-wise — not on entrance-exam scores",
      "Vignan's is a Deemed University — there is no EAPCET convener quota counselling. Admission is through VSAT/JEE/direct application only",
      "Separate V-SAT entrance-merit scholarships exist for new admissions — current-year slab PDF available via vignan.ac.in admissions pages; contact admissions for exact criteria",
      "Merit scholarships apply to Category-A fee component only",
      "Maintenance criteria (CGPA 7.0, no backlogs) per earlier published norms — confirm with admissions",
    ],
    source: "https://www.vignan.ac.in/curscholorships.php",
    sourceLabel: "Vignan's University Official — Scholarships",
  },

  // ─── Amrita Vishwa Vidyapeetham, Amaravati ──────────────────────────
  "AMRT": {
    collegeName: "Amrita Vishwa Vidyapeetham, Amaravati",
    tables: [
      {
        examName: "AEEE / JEE Main Rank — Amaravati (CSE, AI, ECE), full fee ₹4,50,000/yr",
        slabs: [
          { percent: "Slab 1 → Pay ₹1,50,000/yr", criteria: "Top AEEE / JEE ranks (highest merit)" },
          { percent: "Slab 2 → Pay ₹2,25,000/yr", criteria: "Strong AEEE / JEE performance" },
          { percent: "Slab 3 → Pay ₹3,00,000/yr", criteria: "Good AEEE / JEE performance" },
          { percent: "Slab 4 → Pay ₹3,75,000/yr", criteria: "Moderate AEEE / JEE performance" },
          { percent: "Slab 5 → ₹4,50,000/yr (full fee)", criteria: "Regular admission (no scholarship)" },
        ],
      },
    ],
    maintenance: "Slab 1: CGPA 7.0; Slab 2: CGPA 6.5; Slab 3: CGPA 6.0 — plus no arrears and no disciplinary action",
    notes: [
      "70%+ of seats are in scholarship category",
      "Exact rank cutoffs for each slab assigned during counselling",
      "One-way slab movement: once moved to a higher-fee slab for not meeting CGPA, a student cannot return to the lower-fee slab even if CGPA recovers",
      "Separate scholarship pools for AEEE and JEE candidates",
      "One-time caution deposit of ₹10,000 applicable",
      "Slab fees per official 2026-27 B.Tech fee structure & scholarship terms",
    ],
    source: "https://aeee.amrita.edu/wp-content/uploads/2026/04/BTECH_FEE_STRUCTURE_SCHOLARSHIP_TERMS.pdf",
    sourceLabel: "Amrita Official — B.Tech Fee Structure & Scholarship Terms 2026-27",
  },

  // ─── GMR University ─────────────────────────────────────────────────
  "GMRI": {
    collegeName: "GMR University (formerly GMRIT)",
    tables: [
      {
        examName: "JEE Main / State Entrance Ranks / Class XII Performance",
        slabs: [
          { percent: "Up to 100%", criteria: "Highest merit band (JEE / state entrance rank / Class XII)" },
          { percent: "75%", criteria: "Merit band 2" },
          { percent: "50%", criteria: "Merit band 3" },
          { percent: "25%", criteria: "Merit band 4" },
        ],
      },
    ],
    maintenance: "Good academic standing",
    notes: [
      "Up to 20% of admitted students are eligible for merit concessions (official FAQ)",
      "Exact rank breakpoints for each band are not published — contact admissions",
      "Base B.Tech fee: ~₹2,50,000/yr (as a Deemed University; formerly ~₹78,000/yr when GMRIT was affiliated)",
    ],
    source: "https://gmrit.edu.in/du/faqs.php",
    sourceLabel: "GMR University Official — Deemed University FAQs",
  },

  // ─── Audisankara University ─────────────────────────────────────────
  "AUDI": {
    collegeName: "Audisankara Deemed to be University",
    tables: [
      {
        examName: "Merit & Means-Based Schemes",
        slabs: [
          { percent: "Merit-based concession", criteria: "Trust-funded merit scholarships (incl. Atal Bihari Vajpayee Scholarship)" },
          { percent: "Fee support", criteria: "10% of management seats reserved for economically backward students" },
        ],
      },
    ],
    maintenance: "Continued based on academic performance",
    notes: [
      "~80% of students receive some form of fee assistance (incl. AP government RTF fee reimbursement)",
      "Economically Backward Students Fund (EBSF) available",
      "Specific institutional slab table not publicly available — contact admissions",
      "Base B.Tech fee: ~₹61,000/yr (most affordable deemed university in AP/TS)",
    ],
    source: "https://audisankara.ac.in/amss.html",
    sourceLabel: "Audisankara Official — Merit Scholarship Schemes",
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
      "SRM AP is a Private University in AP that participates in AP EAPCET convener counselling (~35% of seats, fee ~₹1,02,000/yr set by GO). Remaining ~65% seats are filled via SRMJEEE direct admission (fee ~₹4,00,000/yr). Note: not all private universities participate in state counselling",
      "These merit scholarships apply to the direct admission (SRMJEEE) fee only — convener quota students already pay the lower GO-regulated fee",
      "EAPCET rank may also be considered for scholarship on direct admission — contact admissions for details",
      "Founder's Scholarship: top 100 SRMJEEE + CBSE/State Board district toppers",
      "SRM also offers President Scholarship, Socio-Economic, Differently Abled, Arts & Culture, and Armed Forces Scholarships",
    ],
    source: "https://srmap.edu.in/admissions/",
    sourceLabel: "SRM AP Official — Admissions & Scholarships",
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
      "VIT-AP is a Private University in AP that participates in AP EAPCET convener counselling (~35% of seats, fee ~₹70,000/yr set by GO). Remaining ~65% seats are filled via VITEEE direct admission (fee ₹1.95L–₹4.9L/yr by category). Note: not all private universities participate in state counselling",
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
      "Anurag is a Private University in Telangana that participates in TS EAPCET convener counselling (~70% Category A seats, fee ~₹1,35,000/yr set by GO). Remaining ~30% Category B seats are filled via management/Anurag CET (fee ~₹2,85,000/yr). Note: not all private universities participate in state counselling",
      "These merit scholarships apply to the direct admission fee — students joining via EAPCET convener already pay the lower GO-regulated fee",
      "However, EAPCET rank is also accepted as a scholarship criterion for direct admission students (see slabs above)",
      "Government junior college students with EAPCET rank <20,000 get 50% tuition concession (special provision)",
      "Top 1–500 admissions receive a free laptop",
      "Total 4-year scholarship value up to ₹11,40,000 for 100% waiver recipients",
    ],
    source: "https://anurag.edu.in/scholarships/",
    sourceLabel: "Anurag University Official — Scholarships",
  },

  // ─── NRI Deemed to be University (Dr. RVR NRI), Agiripalli ──────────
  "NRIA": {
    collegeName: "NRI Deemed to be University (Dr. RVR NRI Institute of Technology)",
    tables: [
      {
        examName: "Inter / CBSE % · JEE Main Percentile · AP/TS EAPCET Rank",
        branchGroup: "School of Computer Science (CSE, AIML, CSE-AIML, CSE-DS, IT) — Base fee: ₹2,00,000/yr",
        slabs: [
          { percent: "50% → Pay ₹1,00,000/yr", criteria: "Inter ≥95% · CBSE ≥95% · JEE ≥95 percentile · EAPCET Rank 1–5,000" },
          { percent: "40% → Pay ₹1,20,000/yr", criteria: "Inter 85–94.99% · CBSE 80–94.99% · JEE 80–94.99 percentile · EAPCET 5,001–15,000" },
          { percent: "30% → Pay ₹1,40,000/yr", criteria: "Inter 70–84.99% · CBSE 70–79.99% · JEE 70–79.99 percentile · EAPCET 15,001–30,000" },
          { percent: "20% → Pay ₹1,60,000/yr", criteria: "Inter 60–69.99% · CBSE 60–69.99% · JEE <70 percentile · EAPCET >30,000" },
        ],
      },
      {
        examName: "Inter / CBSE % · JEE Main · AP/TS EAPCET Rank",
        branchGroup: "ECE — Base fee: ₹1,00,000/yr",
        slabs: [
          { percent: "25% → Pay ₹75,000/yr", criteria: "Inter/CBSE/JEE ≥85 · EAPCET Rank 1–15,000" },
          { percent: "10% → Pay ₹90,000/yr", criteria: "Inter/CBSE/JEE 60–84.99 · EAPCET 15,001–30,000" },
        ],
      },
    ],
    maintenance: "Continuation criteria not published — confirm with admissions",
    notes: [
      "NRIU is a Deemed University — no EAPCET convener quota counselling. EAPCET rank is used as a scholarship/fee-category criterion for direct admission",
      "Structured as fee categories: any one qualifying criterion (Inter % OR CBSE % OR JEE percentile OR EAPCET rank) places the student in a fee category",
      "Official prospectus: merit scholarships up to 50% of tuition fee",
      "EEE, Civil, Mechanical: flat ₹55,000/yr — no scholarship categories",
      "Fee categories per official AY 2026-27 fee structure",
    ],
    source: "https://nriit.edu.in/nri-deemed-university/fee-structure/",
    sourceLabel: "NRI Deemed University Official — Fee Structure 2026-27",
  },

  // ─── GITAM Institute of Medical Sciences (GIMSR), Visakhapatnam ─────
  "GIOM": {
    collegeName: "GITAM Institute of Medical Sciences (GIMSR)",
    tables: [
      {
        examName: "NEET-UG All India Rank (MBBS, % of ₹25,37,000/yr tuition)",
        slabs: [
          { percent: "100%", criteria: "NEET AIR 1–25,000" },
          { percent: "75%", criteria: "NEET AIR 25,001–75,000" },
          { percent: "50%", criteria: "NEET AIR 75,001–1,50,000" },
          { percent: "25%", criteria: "NEET AIR 1,50,001–3,00,000" },
          { percent: "15%", criteria: "NEET AIR 3,00,001–4,50,000" },
          { percent: "10%", criteria: "NEET AIR 4,50,001–6,00,000" },
        ],
      },
    ],
    maintenance: "Scholarship continues in years 2–5 only if the student scores ≥65% aggregate marks every year",
    notes: [
      "MBBS admission is only through MCC NEET-UG counselling (deemed-university quota) — no state convener quota",
      "GIMSR is excluded from GITAM's general engineering scholarship policy — this is a separate NEET-rank-based MBBS scheme",
      "Scholarship recipients also get an additional 20% scholarship toward hostel fees (food + accommodation)",
      "Top 5% of students not admitted under the scheme (max 7 students) receive 10% scholarship in years 2–5, same 65% condition",
      "Rank slabs are restated each year against that year's NEET — slabs shown are from the 2025-26 cycle",
    ],
    source: "https://www.gitam.edu/gimsr/admissions/under-graduate",
    sourceLabel: "GITAM GIMSR Official — MBBS Admissions & Scholarships",
  },
};

/** Get scholarship info for a college by code */
export function getScholarships(code: string): ScholarshipInfo | null {
  return SCHOLARSHIPS[code] || null;
}
