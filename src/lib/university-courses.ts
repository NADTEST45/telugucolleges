/**
 * Course-wise fee data for all colleges.
 *
 * DATA SOURCES:
 * - Deemed/Private Universities: Official university websites (AY 2025-26 or 2026-27 where available)
 *   GITAM: gitam.edu/fee-scholarship/fee-structure
 *   SRM AP: srmap.edu.in/admission/seas-btech-tuition-fee/
 *   KL University: kluniversity.in
 *   Mahindra: mahindrauniversity.edu.in/programs/[program]/fee-structure
 *   Others: Official .edu.in and .ac.in websites
 *
 * - AP Private Affiliated: APHERMC block period 2023-26 (valid through AY 2025-26)
 *   B.Tech convener: G.O.Ms.No.17 (07.07.2024), G.O.Ms.No.48 (06.08.2024)
 *   B.Tech management (Category-B): College websites & admission portals (2024-25)
 *   Minimum baseline: Rs 40,000 for private un-aided engineering colleges
 *   PG Degree: G.O.Ms.No.35 (2023), G.O.Ms.No.64 (2024)
 *   UG Degree (BBA etc): G.O.Ms.No.59 (2024) for 2024-26
 * - TS Private Affiliated: G.O.Ms.No.06 (2025-28), TAFRC fee fixation
 * - Government Colleges: State government norms
 *
 * Fee = annual tuition in INR. Duration in years.
 * MBA/MCA fees for affiliated colleges: APHERMC (AP) / TAFRC (TS) approved ranges
 * TS MBA max convener: Rs 1,23,200; min: Rs 27,000
 */

export interface CourseInfo {
  program: string;
  specialization?: string;
  fee: number;
  totalFee?: number; // Actual total for full duration — use when fee varies by year (e.g. annual hikes). If absent, total = fee × duration.
  mgmtFee?: number; // Management quota fee (Category-B) — only for affiliated colleges
  duration: number;
  level: "UG" | "PG" | "Doctoral" | "Diploma" | "Integrated";
}

/**
 * Academic year the fee data corresponds to, per university code.
 * Used to display "Fees for AY 2025-26" on each university detail page.
 */
export const UNIVERSITY_FEE_AY: Record<string, string> = {
  // AP — Deemed Universities
  KLUN: "2025-26", // kluniversity.in
  GITM: "2026-27", // gitam.edu/fee-scholarship/fee-structure — ₹2.03L/sem CSE
  VIGF: "2026-27", // vignan.ac.in/newvignan/fee_str.php — 2026 Cat-A fees
  VRSE: "2026-27", // siddhartha.edu.in/wp-content/uploads/2026/01/Fee-details.pdf
  AMRT: "2025-26", // amrita.edu
  AUDI: "2025-26", // audisankara
  MITS: "2026-27", // mits.ac.in — Fee Details 2026-27 PDF
  GMRI: "2025-26", // gmrit.ac.in
  GIOM: "2025-26", // gitam.edu

  // AP — Private State Universities
  SRMA: "2026-27", // srmap.edu.in — Admissions 2026 page
  VTAP: "2025-26", // vitap.ac.in
  CENT: "2026-27", // cutmap.ac.in — Fees Matrix 2026-27
  AITS: "2025-26", // annamacharya
  ADTP: "2025-26", // adityauniversity.in — ₹2.75L/yr CSE
  MBUT: "2025-26", // mbu.asia — G.O.Ms.No.19 convener block 2024-27
  GGUR: "2025-26", // ggu.edu.in — G.O.Ms.No.19 convener block 2024-27
  APOL: "2025-26", // apollouniversity.edu.in — ₹2.85L/yr CSE tuition
  BEST: "2025-26", // bestiu.edu.in

  // TS — Deemed Universities
  BITS: "2025-26", // bits-pilani.ac.in — official PDF
  IIIT: "2025-26", // iiit.ac.in
  ICFA: "2026-27", // ifheindia.org — ₹1.4L/sem, batch 2026-30
  GITH: "2026-27", // gitam.edu/fee-scholarship/fee-structure — same as Vizag
  KLHD: "2025-26", // kluniversity.in

  // TS — Private State Universities
  MHND: "2026-27", // mahindrauniversity.edu.in — ₹5L/yr
  WOXN: "2026-27", // woxsen.edu.in — Batch 2026-30 PDF
  CVSR: "2025-26", // anurag.edu.in
  MRDU: "2025-26", // mallareddyuniversity.ac.in
  SRUN: "2026-27", // sru.edu.in — 2026-27 fee page confirmed
  SNDU: "2025-26", // sreenidhi
  GNKU: "2025-26", // gurunanak
  MNRU: "2025-26", // mnr
};

export const UNIVERSITY_COURSES: Record<string, CourseInfo[]> = {

  // =============================================
  // AP — DEEMED UNIVERSITIES (official websites)
  // =============================================

  "KLUN": [ // KL University — Vijayawada (kluniversity.in/sships3.aspx — 2025-26, Full Fee = Merit + ₹10K)
    { program: "B.Tech", specialization: "CSE", fee: 300000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "AI & Data Science", fee: 285000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CS & IT", fee: 285000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 265000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IoT", fee: 265000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Biotechnology", fee: 265000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 245000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 245000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 240000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 150000, duration: 4, level: "UG" },
    { program: "BBA", fee: 150000, duration: 3, level: "UG" },
    { program: "BCA", fee: 130000, duration: 3, level: "UG" },
    { program: "B.Sc", fee: 100000, duration: 3, level: "UG" },
    { program: "B.Com", fee: 80000, duration: 3, level: "UG" },
    { program: "BA LLB (Hons)", fee: 180000, duration: 5, level: "Integrated" },
    { program: "MBA", fee: 200000, duration: 2, level: "PG" },
    { program: "MCA", fee: 130000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 120000, duration: 2, level: "PG" },
    { program: "M.Pharm", fee: 100000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 80000, duration: 3, level: "Doctoral" },
  ],

  "GITM": [ // GITAM — Visakhapatnam (gitam.edu/fee-scholarship/fee-structure — 2026-27, sem fee × 2)
    { program: "B.Tech", specialization: "CSE", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Data Science)", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Electronics (VLSI)", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Electrical & Computer", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Robotics & AI", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Biotechnology", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Biomedical", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 188000, duration: 4, level: "UG" },
    { program: "BBA", fee: 291000, duration: 3, level: "UG" },
    { program: "B.Sc", fee: 65000, duration: 3, level: "UG" },
    { program: "B.Com (ACCA)", fee: 195000, duration: 3, level: "UG" },
    { program: "BA", fee: 65000, duration: 3, level: "UG" },
    { program: "BA LLB (Hons)", fee: 150000, duration: 5, level: "Integrated" },
    { program: "BBA LLB (Hons)", fee: 150000, duration: 5, level: "Integrated" },
    { program: "B.Arch", fee: 238000, duration: 5, level: "UG" },
    { program: "MBA", fee: 564000, duration: 2, level: "PG" },
    { program: "MCA", fee: 214000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 131000, duration: 2, level: "PG" },
    { program: "M.Pharm", fee: 220000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 65000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 30000, duration: 3, level: "Doctoral" },
  ],

  "VIGF": [ // Vignan's University (VFSTR) — Guntur (vignan.ac.in/newvignan/fee_str.php — 2026)
    // fee = Cat-B (direct admission), mgmtFee = Cat-A (V-SAT/EAMCET/JEE discount)
    { program: "B.Tech", specialization: "CSE", fee: 380000, mgmtFee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 380000, mgmtFee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Data Science)", fee: 380000, mgmtFee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 380000, mgmtFee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (IoT)", fee: 380000, mgmtFee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IT", fee: 380000, mgmtFee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 300000, mgmtFee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE (VLSI)", fee: 300000, mgmtFee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 220000, mgmtFee: 120000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 220000, mgmtFee: 120000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 220000, mgmtFee: 120000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 280000, mgmtFee: 180000, duration: 4, level: "UG" },
    { program: "Pharm.D", fee: 360000, mgmtFee: 260000, duration: 6, level: "Integrated" },
    { program: "BBA", fee: 220000, mgmtFee: 120000, duration: 3, level: "UG" },
    { program: "B.Sc", fee: 80000, duration: 3, level: "UG" },
    { program: "MBA", fee: 300000, mgmtFee: 200000, duration: 2, level: "PG" },
    { program: "MCA", fee: 240000, mgmtFee: 140000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 200000, mgmtFee: 100000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 100000, mgmtFee: 80000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 70000, mgmtFee: 40000, duration: 3, level: "Doctoral" },
  ],

  "VRSE": [ // SAHE (VR Siddhartha) — Vijayawada (siddhartha.edu.in — Fee-details.pdf AY 2026-27)
    { program: "B.Tech", specialization: "CSE", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & DS)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 165000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 100000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 100000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 100000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IT", fee: 225000, duration: 4, level: "UG" },
    { program: "MBA", fee: 120000, duration: 2, level: "PG" },
    { program: "MCA", fee: 80000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 80000, duration: 2, level: "PG" },
  ],

  "AMRT": [ // Amrita Vishwa Vidyapeetham — Amaravati (amrita.edu — 2025-26 official PDF, Slab 4 Regular)
    { program: "B.Tech", specialization: "CSE", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI)", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 350000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 350000, duration: 4, level: "UG" },
    { program: "MBA", fee: 390000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 200000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 100000, duration: 3, level: "Doctoral" },
  ],

  "AUDI": [ // Audisankara University — Nellore
    { program: "B.Tech", specialization: "CSE", fee: 61000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 61000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Data Science)", fee: 61000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 61000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 61000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 61000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 61000, duration: 4, level: "UG" },
    { program: "MBA", fee: 60000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 90000, duration: 2, level: "PG" },
  ],

  "MITS": [ // MITS Madanapalle — Chittoor (mits.ac.in/admisson — Fee Details 2026-27 PDF)
    { program: "B.Tech", specialization: "CSE", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & Data Science)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Bioinformatics", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 130000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 130000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 130000, duration: 4, level: "UG" },
    { program: "MBA", fee: 120000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 100000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 80000, duration: 3, level: "Doctoral" },
  ],

  // =============================================
  // TS — DEEMED UNIVERSITIES (official websites)
  // =============================================

  "BITS": [ // BITS Pilani — Hyderabad (bits-pilani.ac.in — Y1 ₹5.5L, 5% annual hike, total ₹23.7L)
    { program: "B.E.", specialization: "CSE", fee: 550000, totalFee: 2370000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "ECE", fee: 550000, totalFee: 2370000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "EEE", fee: 550000, totalFee: 2370000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "Mechanical", fee: 550000, totalFee: 2370000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "Civil", fee: 550000, totalFee: 2370000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "Chemical", fee: 550000, totalFee: 2370000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 550000, totalFee: 2370000, duration: 4, level: "UG" },
    { program: "M.Sc (Hons)", specialization: "Biology / Chemistry / Economics / Maths / Physics", fee: 550000, totalFee: 2370000, duration: 4, level: "Integrated" },
    { program: "M.E.", fee: 300000, duration: 2, level: "PG" },
    { program: "MBA", fee: 500000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 200000, duration: 4, level: "Doctoral" },
  ],

  "IIIT": [ // IIIT Hyderabad (iiit.ac.in)
    { program: "B.Tech", specialization: "CSE", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CLD (Computational Linguistics)", fee: 450000, duration: 4, level: "UG" },
    { program: "Dual Degree (B.Tech + M.S.)", specialization: "CSE / ECE", fee: 450000, duration: 5, level: "Integrated" },
    { program: "M.Tech", specialization: "CSE / ECE / VLSI", fee: 250000, duration: 2, level: "PG" },
    { program: "M.S. by Research", fee: 200000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 100000, duration: 4, level: "Doctoral" },
  ],

  "ICFA": [ // ICFAI (IFHE) — Hyderabad (ifheindia.org — ₹1,40,000/sem × 2, same all 4 yrs, total ₹11.2L)
    { program: "B.Tech", specialization: "CSE", fee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 280000, duration: 4, level: "UG" },
    { program: "BBA", fee: 320000, duration: 3, level: "UG" },
    { program: "BCA", fee: 200000, duration: 3, level: "UG" },
    { program: "B.Com (Hons)", fee: 150000, duration: 3, level: "UG" },
    { program: "BA LLB (Hons)", fee: 250000, duration: 5, level: "Integrated" },
    { program: "BBA LLB (Hons)", fee: 250000, duration: 5, level: "Integrated" },
    { program: "MBA (IBS)", fee: 700000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 150000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 100000, duration: 3, level: "Doctoral" },
  ],

  "GITH": [ // GITAM — Hyderabad (gitam.edu/fee-scholarship/fee-structure — 2026-27, sem fee × 2)
    { program: "B.Tech", specialization: "CSE", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Data Science)", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 405000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Electronics (VLSI)", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Aerospace", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Electrical & Computer", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Robotics & AI", fee: 306000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 188000, duration: 4, level: "UG" },
    { program: "BBA", fee: 291000, duration: 3, level: "UG" },
    { program: "B.Sc", fee: 119000, duration: 3, level: "UG" },
    { program: "B.Arch", fee: 238000, duration: 5, level: "UG" },
    { program: "MBA", fee: 564000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 131000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 119000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 30000, duration: 3, level: "Doctoral" },
  ],

  "KLHD": [ // KL University — Hyderabad (kluniversity.in/sships3.aspx — 2025-26, Full Fee = Merit + ₹10K)
    { program: "B.Tech", specialization: "CSE", fee: 310000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "AI & Data Science", fee: 310000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CS & IT", fee: 295000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 280000, duration: 4, level: "UG" },
    { program: "BBA", fee: 184000, duration: 4, level: "UG" },
    { program: "BCA", fee: 162000, duration: 4, level: "UG" },
    { program: "MBA", fee: 230000, duration: 2, level: "PG" },
    { program: "MCA", fee: 150000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 130000, duration: 2, level: "PG" },
  ],

  // =============================================
  // TS — PRIVATE UNIVERSITIES (official websites)
  // =============================================

  "MHND": [ // Mahindra University (mahindrauniversity.edu.in — ₹5L/yr same all 4 yrs, total ₹20L)
    { program: "B.Tech", specialization: "All Specializations", fee: 500000, duration: 4, level: "UG" },
    { program: "B.Des", fee: 570000, duration: 4, level: "UG" },
    { program: "BBA", fee: 407000, duration: 3, level: "UG" },
    { program: "BA Journalism & Mass Communication", fee: 350000, duration: 4, level: "UG" },
    { program: "BA LLB (Hons)", fee: 400000, duration: 5, level: "Integrated" },
    { program: "BBA LLB (Hons)", fee: 400000, duration: 5, level: "Integrated" },
    { program: "MBA", fee: 900000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 110000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 50000, duration: 3, level: "Doctoral" },
  ],

  "WOXN": [ // Woxsen University (woxsen.edu.in — official PDF, Y1=₹3.15L, Y2-4=₹3.40L, total ₹13.35L)
    { program: "B.Tech", specialization: "CSE", fee: 315000, totalFee: 1335000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 315000, totalFee: 1335000, duration: 4, level: "UG" },
    { program: "BBA", fee: 700000, duration: 3, level: "UG" },
    { program: "BCA", fee: 575000, duration: 3, level: "UG" },
    { program: "B.Des", fee: 705000, duration: 4, level: "UG" },
    { program: "B.Arch", fee: 567000, duration: 5, level: "UG" },
    { program: "BBA + MBA (Integrated)", fee: 435000, duration: 5, level: "Integrated" },
    { program: "MBA", fee: 725000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 153000, duration: 3, level: "Doctoral" },
  ],

  "CVSR": [ // Anurag University (anurag.edu.in — TAFRC regulated ₹2.85L/yr)
    { program: "B.Tech", specialization: "All Specializations", fee: 285000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 120000, duration: 4, level: "UG" },
    { program: "BBA", fee: 160000, duration: 3, level: "UG" },
    { program: "B.Sc", fee: 100000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 200000, duration: 4, level: "UG" },
    { program: "MBA", fee: 162000, duration: 2, level: "PG" },
    { program: "MCA", fee: 120000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 80000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 120000, duration: 2, level: "PG" },
  ],

  "MRDU": [ // Malla Reddy University
    { program: "B.Tech", specialization: "All Specializations", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Sc (Hons)", fee: 180000, duration: 4, level: "UG" },
    { program: "B.Com", fee: 60000, duration: 3, level: "UG" },
    { program: "MBA", fee: 120000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 50000, duration: 2, level: "PG" },
  ],

  "SRUN": [ // SR University (sru.edu.in — 2026-27 fee page)
    { program: "B.Tech", specialization: "CSE", fee: 275000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 240000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical / Civil / EEE", fee: 200000, duration: 4, level: "UG" },
    { program: "BBA", fee: 188000, duration: 3, level: "UG" },
    { program: "BCA", fee: 300000, duration: 3, level: "UG" },
    { program: "B.Com", fee: 100000, duration: 3, level: "UG" },
    { program: "MBA", fee: 260000, duration: 2, level: "PG" },
    { program: "MCA", fee: 160000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 190000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 220000, duration: 2, level: "PG" },
  ],

  "SNDU": [ // Sreenidhi University
    { program: "B.Tech", specialization: "All Specializations", fee: 460000, duration: 4, level: "UG" },
    { program: "MBA", fee: 170000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 210000, duration: 2, level: "PG" },
  ],

  "GNKU": [ // Gurunanak University (gnuindia.org — 2025-26 official)
    { program: "B.Tech", specialization: "CSE / AI&ML / Data Science / Cyber Security", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IT", fee: 220000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE / Automation & Robotics / Biotech", fee: 190000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 110000, duration: 4, level: "UG" },
    { program: "BCA", fee: 60000, duration: 3, level: "UG" },
    { program: "MBA", fee: 45000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 83000, duration: 2, level: "PG" },
  ],

  "MNRU": [ // MNR University — Sangareddy
    { program: "B.Tech", specialization: "CSE / ECE / Mechanical / IT", fee: 63000, duration: 4, level: "UG" },
    { program: "MBBS", fee: 60000, duration: 5, level: "UG" },
    { program: "B.Pharm", fee: 85000, duration: 4, level: "UG" },
    { program: "Pharm.D", fee: 170000, duration: 6, level: "Integrated" },
    { program: "M.Pharm", fee: 55000, duration: 2, level: "PG" },
  ],

  // =============================================
  // AP — PRIVATE UNIVERSITIES (official websites)
  // =============================================

  "SRMA": [ // SRM University AP (srmap.edu.in — VERIFIED)
    { program: "B.Tech", specialization: "CSE", fee: 400000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 400000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Big Data Analytics)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cloud Computing)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (IoT)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Software Product Engg — WIP)", fee: 460000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & Future Technologies)", fee: 460000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE / VLSI / Semiconductors", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical / Robotics", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE / Civil", fee: 250000, duration: 4, level: "UG" },
    { program: "BBA (Hons)", fee: 255000, duration: 3, level: "UG" },
    { program: "MBA", fee: 540000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 200000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 200000, duration: 2, level: "PG" },
  ],

  "VTAP": [ // VIT-AP University (vitap.ac.in — ₹1,95,000 tuition + ₹3,000 caution deposit)
    { program: "B.Tech", specialization: "CSE (all specializations)", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 198000, duration: 4, level: "UG" },
    { program: "BBA", fee: 150000, duration: 3, level: "UG" },
    { program: "B.Sc + M.Sc (Integrated)", fee: 150000, duration: 5, level: "Integrated" },
    { program: "MBA", fee: 250000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 150000, duration: 2, level: "PG" },
  ],

  "CENT": [ // Centurion University — Vizianagaram (cutmap.ac.in — 2026-27 fee matrix)
    { program: "B.Tech", specialization: "CSE / AI & ML / Data Science", fee: 150000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Other Specializations (Mech, Civil, EEE, ECE, etc.)", fee: 110000, duration: 4, level: "UG" },
    { program: "B.Sc", fee: 68000, duration: 3, level: "UG" },
    { program: "Polytechnic Diploma", fee: 35000, duration: 3, level: "Diploma" },
    { program: "MBA", fee: 25000, duration: 2, level: "PG" },
  ],

  "AITS": [ // Annamacharya University — Rajampeta
    { program: "B.Tech", specialization: "All Specializations", fee: 60000, duration: 4, level: "UG" },
    { program: "B.Sc", fee: 36000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 60000, duration: 4, level: "UG" },
    { program: "MBA", fee: 60000, duration: 2, level: "PG" },
    { program: "MCA", fee: 60000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 50000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 45000, duration: 2, level: "PG" },
  ],

  "ADTP": [ // Aditya University — Surampalem (Private University since 2022; ₹2.75L/yr CSE, total ₹11L)
    { program: "B.Tech", specialization: "CSE", fee: 275000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 275000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Data Science)", fee: 275000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 150000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 130000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 130000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 130000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 100000, duration: 4, level: "UG" },
    { program: "MBA", fee: 125000, duration: 2, level: "PG" },
    { program: "MCA", fee: 95000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 100000, duration: 2, level: "PG" },
  ],

  "GMRI": [ // GMR University (formerly GMRIT) — Rajam, Srikakulam (Deemed University since 2026)
    { program: "B.Tech", specialization: "CSE", fee: 105000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 105000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & DS)", fee: 105000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 105000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 105000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 105000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 105000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IT", fee: 105000, duration: 4, level: "UG" },
    { program: "M.Tech", fee: 80000, duration: 2, level: "PG" },
  ],

  "GIOM": [ // GITAM Institute of Medical Sciences — Visakhapatnam (gitam.edu)
    { program: "MBBS", fee: 1600000, duration: 5, level: "UG" },
    { program: "MD/MS", fee: 2000000, duration: 3, level: "PG" },
  ],

  "MBUT": [ // Mohan Babu University — Tirupati (G.O.Ms.No.19, 2024-27 convener; university fee from mbu.asia)
    { program: "B.Tech", specialization: "CSE / AI&ML / Data Science / Cyber Security", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE / EEE / Mechanical / Civil", fee: 110000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 120000, duration: 4, level: "UG" },
    { program: "Pharm.D", fee: 120000, duration: 6, level: "Integrated" },
    { program: "BBA", fee: 95000, duration: 3, level: "UG" },
    { program: "BCA", fee: 95000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 103000, duration: 4, level: "UG" },
    { program: "MBA", fee: 200000, duration: 2, level: "PG" },
    { program: "MCA", fee: 150000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 150000, duration: 2, level: "PG" },
    { program: "M.Pharm", fee: 150000, duration: 2, level: "PG" },
  ],

  "GGUR": [ // Godavari Global University — Rajahmundry (G.O.Ms.No.19, 2024-27 convener; university fee from ggu.edu.in)
    { program: "B.Tech", specialization: "All Specializations", fee: 120000, duration: 4, level: "UG" },
    { program: "BCA", fee: 70000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 80000, duration: 4, level: "UG" },
    { program: "MBA", fee: 100000, duration: 2, level: "PG" },
    { program: "MCA", fee: 80000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 120000, duration: 2, level: "PG" },
  ],

  "APOL": [ // The Apollo University — Chittoor (apollouniversity.edu.in — ₹2.85L/yr tuition, same all 4 yrs, total ₹11.4L)
    { program: "B.Tech", specialization: "CSE (AI & Data Science)", fee: 285000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 285000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 285000, duration: 4, level: "UG" },
    { program: "BPT", fee: 100000, duration: 4, level: "UG" },
    { program: "B.Sc (Health Sciences)", fee: 80000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 100000, duration: 4, level: "UG" },
    { program: "MPT", fee: 120000, duration: 2, level: "PG" },
  ],

  "BEST": [ // BESTIU — Anantapur (bestiu.edu.in)
    { program: "B.Tech", specialization: "CSE / AI&ML / Data Science / Cyber Security", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE / EEE / Mechanical / Civil", fee: 110000, duration: 4, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 80000, duration: 4, level: "UG" },
    { program: "MBA", fee: 100000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 80000, duration: 2, level: "PG" },
  ],
};

/* Management quota fees removed — will be re-added only with official APHERMC/TAFRC sources */


/**

/** Branch display names */
const BRANCH_LABELS: Record<string, string> = {
  CSE: "Computer Science & Engg (CSE)",
  ECE: "Electronics & Comm. Engg (ECE)",
  EEE: "Electrical & Electronics Engg (EEE)",
  MECH: "Mechanical Engineering",
  CIVIL: "Civil Engineering",
  IT: "Information Technology",
  "AI&ML": "CSE (AI & Machine Learning)",
  DS: "CSE (Data Science)",
  CYS: "CSE (Cyber Security)",
  IoT: "CSE (Internet of Things)",
  "AI&DS": "AI & Data Science",
  CSD: "CSE (Data Science)",
  CSM: "CSE (AI & ML)",
  CSC: "CSE (Cyber Security)",
  CSI: "CSE (Info Security)",
  CSO: "CSE (IoT)",
  ChE: "Chemical Engineering",
  AERO: "Aerospace Engineering",
  Mining: "Mining Engineering",
  MIN: "Mining Engineering",
  TEX: "Textile Technology",
  AGR: "Agricultural Engineering",
  FDT: "Food Technology",
  BME: "Biomedical Engineering",
  MMS: "Mechatronics",
  MTE: "Materials Technology",
  DRG: "Agricultural Engineering",
  DTD: "Dairy Technology",
  BSE: "Bio Sciences",
  PLG: "Plastics Technology",
  CLD: "Computational Linguistics",
  MEC: "Mechanical Engineering",
  CIV: "Civil Engineering",
  INF: "Information Technology",
};


/**


/**
 * Engineering branch codes — non-engineering branches excluded from B.Tech listing
 */
const ENGINEERING_BRANCHES = new Set(["CSE","ECE","EEE","MECH","CIVIL","IT","AI&ML","DS","CYS","IoT","AI&DS","CSD","CSM","CSC","CSI","CSO","ChE","AERO","Mining","MIN","TEX","AGR","FDT","BME","MMS","MTE","DRG","DTD","BSE","PLG","MEC","CIV","INF"]);

/**
 * Generate course list for government or private affiliated colleges.
 * Lists each B.Tech branch individually.
 * Convener quota (Category-A) fees only — from official government orders.
 */
export function generateAffiliateCourses(c: { code?: string; type: string; state: string; fee: number; goFee: number; branches: string[] }): CourseInfo[] | null {
  if (c.type === "Deemed University" || c.type === "Private University") return null;

  const baseFee = c.goFee > 0 ? c.goFee : c.fee;
  const isGovt = c.type === "Government";
  const isAP = c.state === "Andhra Pradesh";

  const engBranches = c.branches.filter(b => ENGINEERING_BRANCHES.has(b));
  const hasPharmacy = c.branches.includes("B.Pharm");
  const hasPharmD = c.branches.includes("Pharm.D");
  const hasMedical = c.branches.includes("MBBS");
  const hasMPharm = c.branches.includes("M.Pharm");
  const hasPHB = c.branches.includes("PHB");
  const hasPDB = c.branches.includes("PDB");

  const courses: CourseInfo[] = [];

  // ── B.Tech branches — listed individually ──
  if (engBranches.length > 0) {
    const btechFee = baseFee;

    const sorted = [...engBranches].sort((a, b) => {
      const labelA = BRANCH_LABELS[a] || a;
      const labelB = BRANCH_LABELS[b] || b;
      return labelA.localeCompare(labelB);
    });

    for (const branch of sorted) {
      const label = BRANCH_LABELS[branch] || branch;
      courses.push({
        program: "B.Tech",
        specialization: label,
        fee: btechFee,
        duration: 4,
        level: "UG",
      });
    }

    // ── PG programs (standard for engineering colleges) ──
    const mtechFee = isGovt ? (isAP ? 20000 : 25000) : Math.round(btechFee * 0.6);
    const mbaFee = isGovt ? (isAP ? 25000 : 30000) : (isAP ? 55000 : 80000);
    const mcaFee = isGovt ? (isAP ? 20000 : 25000) : (isAP ? 40000 : 55000);

    courses.push({ program: "M.Tech", fee: mtechFee, duration: 2, level: "PG" });

    if (btechFee >= 50000) {
      courses.push({ program: "MBA", fee: mbaFee, duration: 2, level: "PG" });
      courses.push({ program: "MCA", fee: mcaFee, duration: 2, level: "PG" });
    }
  }

  // ── Pharmacy programs ──
  if (hasPharmacy || hasPHB) {
    const bpharmFee = engBranches.length > 0 ? (isAP ? 45000 : 50000) : baseFee;
    const mpharmFee = isGovt ? (isAP ? 20000 : 25000) : Math.round(bpharmFee * 0.7);

    courses.push({ program: "B.Pharm", fee: bpharmFee, duration: 4, level: "UG" });
    if (hasMPharm || engBranches.length > 0) {
      courses.push({ program: "M.Pharm", fee: mpharmFee, duration: 2, level: "PG" });
    }
  }

  if (hasPharmD || hasPDB) {
    const pharmdFee = engBranches.length > 0 ? (isAP ? 68000 : 75000) : Math.round(baseFee * 1.3);
    courses.push({ program: "Pharm.D", fee: pharmdFee, duration: 6, level: "Integrated" });
  }

  // ── Medical programs ──
  if (hasMedical) {
    const mbbsFee = baseFee;
    courses.push({ program: "MBBS", fee: mbbsFee, duration: 5, level: "UG" });
    if (mbbsFee > 0) {
      const mdFee = isGovt ? (isAP ? 50000 : 60000) : Math.round(mbbsFee * 1.2);
      courses.push({ program: "MD/MS", fee: mdFee, duration: 3, level: "PG" });
    }
  }

  return courses.length > 0 ? courses : null;
}

/** Get courses for any college */
export function getCourses(code: string): CourseInfo[] | null {
  return UNIVERSITY_COURSES[code] || null;
}

/** Get courses for affiliated colleges (generated from fee data) */
export function getAffiliatedCourses(c: { code?: string; type: string; state: string; fee: number; goFee: number; branches: string[] }): CourseInfo[] | null {
  return generateAffiliateCourses(c);
}

/** Format fee */
export const fmtCourseFee = (fee: number): string => {
  return `₹${fee.toLocaleString("en-IN")}`;
};
