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
  KLUN: "2026-27", // kluniversity.in/sships3.aspx — AY 2026-27 page published; ₹1.475L/sem CSE Vijayawada
  GITM: "2026-27", // gitam.edu/fee-scholarship/fee-structure — ₹2.03L/sem CSE
  VIGF: "2026-27", // vignan.ac.in/newvignan/fee_str.php — 2026 Cat-A fees
  VRSE: "2026-27", // siddhartha.edu.in/wp-content/uploads/2026/01/Fee-details.pdf
  AMRT: "2026-27", // amrita.edu — AEEE 2026 admissions; slab-based, Slab 4 Regular tier
  AUDI: "2026-27", // audisankara.ac.in — ₹61K/yr B.Tech
  MITS: "2026-27", // mits.ac.in — Fee Details 2026-27 PDF
  GMRI: "2026-27", // gmrit.edu.in/du/eligibility.php — ₹1.25L/sem CSE, ₹75K/sem EEE/Mech/Civil
  NRIA: "2026-27", // nriit.edu.in/nri-deemed-university/fee-structure — "Tuition Fee particulars for AY 2026-27"
  GIOM: "2025-26", // gitam.edu/gimsr/admissions/under-graduate — official ₹25.37L/yr (Y1-4), ₹12.7L Y5; 2026-27 notification awaited

  // AP — Private State Universities
  SRMA: "2026-27", // srmap.edu.in — Admissions 2026 page (refreshed 2026-05-19 — added Microelectronics, Defence, Energy, Health, Semiconductor, AI, Quantum Tech)
  VTAP: "2026-27", // vitap.ac.in / vit.ac.in/admission/ug/fee-structure — Cat-1 ₹1.95L/yr + ₹3K caution
  CENT: "2026-27", // cutmap.ac.in — Fees Matrix 2026-27
  AITS: "2026-27", // annamacharyauniversity.edu.in — ₹60K/yr B.Tech
  ADTP: "2026-27", // adityauniversity.in — ₹2.75L/yr CSE (total ₹11L)
  MBUT: "2026-27", // mbu.asia — MBU_Fee_Structrure_2026_27_1.pdf — ₹2.5L/yr CSE
  GGUR: "2026-27", // ggu.edu.in/fee-structure — convener (G.O. block 2024-27) + university quota tables; page updated 2026-03-28
  APOL: "2026-27", // apollouniversity.edu.in/admissions/fee-structure — ₹2.60L/yr CSE tuition (total ₹10.99L)
  BEST: "2026-27", // bestiu.edu.in — ₹2L/yr CSE (total ₹8L)

  // TS — Deemed Universities
  BITS: "2026-27", // admissions.bits-pilani.ac.in — Y1 ₹4.90L (₹2.45L/sem × 2), 5% annual hike, total ₹20.76L
  IIIT: "2026-27", // ugadmissions.iiit.ac.in/fee-jee-spec/ — ₹5L/yr B.Tech
  ICFA: "2026-27", // ifheindia.org — ₹1.4L/sem, batch 2026-30
  GITH: "2026-27", // gitam.edu/fee-scholarship/fee-structure — same as Vizag
  KLHD: "2026-27", // kluniversity.in/sships3.aspx — AY 2026-27 (3 terms/yr at Aziz Nagar & Bowrampet campuses)

  // TS — Private State Universities
  MHND: "2026-27", // mahindrauniversity.edu.in — ₹5L/yr
  WOXN: "2026-27", // woxsen.edu.in — Batch 2026-30 PDF
  CVSR: "2026-27", // anurag.edu.in — TAFRC ₹2.85L/yr B.Tech
  MRDU: "2026-27", // mallareddyuniversity.ac.in — ₹2L/yr B.Tech CSE
  SRUN: "2026-27", // sru.edu.in — 2026-27 fee page confirmed
  SNDU: "2025-26", // suh.edu.in/university-fee — ATFC 2025-26 official (₹4.5L sticker, merit slabs ₹1.25L–4L); 2026-27 not yet published
  GNKU: "2026-27", // gnuindia.org/gnu-fee-structure.php — official "Fee Structure AY 2026-27" table
  MNRU: "2026-27", // mnruniversity.edu.in/fees — official "Programme Fee Structure AY 2026-27"
};

export const UNIVERSITY_COURSES: Record<string, CourseInfo[]> = {

  // =============================================
  // AP — DEEMED UNIVERSITIES (official websites)
  // =============================================

  "KLUN": [ // KL University — Vijayawada (kluniversity.in/sships3.aspx — AY 2026-27 published; Merit Fee/sem × 2 + ₹16K one-time admission)
    { program: "B.Tech", specialization: "CSE", fee: 295000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "AI & Data Science", fee: 280000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CS & IT", fee: 275000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 255000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IoT", fee: 255000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Biotechnology", fee: 255000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 235000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 235000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 230000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE-AI & ML (Full Stack, 3 terms/yr)", fee: 315000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE-VLSI (Chip Mfg, 3 terms/yr)", fee: 270000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 235000, duration: 4, level: "UG" },
    { program: "Pharm.D", fee: 310000, duration: 6, level: "Integrated" },
    { program: "BBA", specialization: "Multi-Specialization", fee: 215000, duration: 3, level: "UG" },
    { program: "BBA", specialization: "Global Finance / Business Analytics / Fintech", fee: 235000, duration: 3, level: "UG" },
    { program: "BBA LLB", fee: 175000, duration: 5, level: "Integrated" },
    { program: "BCA", fee: 215000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 235000, duration: 4, level: "UG" },
    { program: "B.Sc (Food Technology)", fee: 170000, duration: 3, level: "UG" },
    { program: "B.Sc (Animation & Gaming)", fee: 160000, duration: 3, level: "UG" },
    { program: "B.Com (Hons) with ACCA/CMA/EA", fee: 195000, duration: 3, level: "UG" },
    { program: "BA Economics (IAS orientation)", fee: 170000, duration: 3, level: "UG" },
    { program: "MBA", specialization: "Marketing/HR/Finance/Digital Mktg/Business Analytics", fee: 325000, duration: 2, level: "PG" },
    { program: "MBA", specialization: "Fintech", fee: 550000, duration: 2, level: "PG" },
    { program: "MBA", specialization: "Global Program", fee: 600000, duration: 2, level: "PG" },
    { program: "MCA", fee: 250000, duration: 2, level: "PG" },
    { program: "M.Tech", specialization: "CSE (AI&DS / Cyber Security / Digital Forensic)", fee: 160000, duration: 2, level: "PG" },
    { program: "M.Tech", specialization: "ECE (VLSI / IoT)", fee: 140000, duration: 2, level: "PG" },
    { program: "M.Tech", specialization: "Civil / EEE / ME", fee: 125000, duration: 2, level: "PG" },
    { program: "M.Pharm", fee: 220000, duration: 2, level: "PG" },
    { program: "M.Sc Chemistry", fee: 90000, duration: 2, level: "PG" },
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

  "AMRT": [ // Amrita Vishwa Vidyapeetham — Amaravati (amrita.edu — AY 2026-27 admissions open, Slab 4 Regular tier; slab-based fees from AEEE 2026)
    { program: "B.Tech", specialization: "CSE", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI)", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 450000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 350000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 350000, duration: 4, level: "UG" },
    { program: "MBA", fee: 390000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 200000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 100000, duration: 3, level: "Doctoral" },
  ],

  "AUDI": [ // Audisankara University — Nellore (audisankara.ac.in — AY 2026-27, ₹61K/yr B.Tech total ₹2.44L)
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

  "MITS": [ // MITS Madanapalle — Chittoor (mits.ac.in/assets/pdf/admin/Fee Details 2026-27.pdf)
    // Fees below are annual BASE (sticker) fees per year (2× per-sem from PDF).
    // MITS offers tiered scholarships reducing these based on 10+2, CBSE/ICSE,
    // State CET and JEE performance — see scholarships.ts for detail.
    { program: "B.Tech", specialization: "CSE", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & Data Science)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Bioinformatics", fee: 198000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 130000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 130000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 130000, duration: 4, level: "UG" },
    { program: "BBA", fee: 90000, duration: 3, level: "UG" },
    { program: "BCA", fee: 90000, duration: 3, level: "UG" },
    { program: "MBA", fee: 120000, duration: 2, level: "PG" },
    { program: "MCA", fee: 120000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 70000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 80000, duration: 3, level: "Doctoral" },
  ],

  "NRIA": [ // Dr. RVR NRI Institute of Technology (NRI Deemed University) — Agiripalli, Eluru (nriit.edu.in/nri-deemed-university/fee-structure — official AY 2026-27)
    // fee = sticker tuition/yr. Merit scholarships reduce Computer-school fees to ₹1L–1.6L
    // (Cat 1–4 by Inter % / CBSE % / JEE percentile / EAPCET rank) and ECE to ₹75K–90K.
    { program: "B.Tech", specialization: "AI & ML", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Data Science)", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IT", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 100000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 55000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 55000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 55000, duration: 4, level: "UG" },
    { program: "M.Tech", specialization: "CSE / Structural / Thermal / VLSI & Embedded / EV Technology", fee: 55000, duration: 2, level: "PG" },
    { program: "B.Pharm", fee: 60000, duration: 4, level: "UG" },
    { program: "Pharm.D", fee: 140000, duration: 6, level: "Integrated" },
    { program: "M.Pharm", specialization: "Pharmaceutics / Pharmaceutical Analysis / Quality Analysis", fee: 50000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 40000, duration: 3, level: "Doctoral" }, // ₹20K/sem (full-time), ₹15K/sem (part-time)
  ],

  // =============================================
  // TS — DEEMED UNIVERSITIES (official websites)
  // =============================================

  "BITS": [ // BITS Pilani — Hyderabad (admissions.bits-pilani.ac.in — AY 2026-27: Y1 ₹4.90L tuition (₹2.45L/sem × 2), 5% annual hike, total 4-yr ₹20.76L)
    { program: "B.E.", specialization: "CSE", fee: 490000, totalFee: 2076000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "ECE", fee: 490000, totalFee: 2076000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "EEE", fee: 490000, totalFee: 2076000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "Mechanical", fee: 490000, totalFee: 2076000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "Civil", fee: 490000, totalFee: 2076000, duration: 4, level: "UG" },
    { program: "B.E.", specialization: "Chemical", fee: 490000, totalFee: 2076000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 490000, totalFee: 2076000, duration: 4, level: "UG" },
    { program: "M.Sc (Hons)", specialization: "Biology / Chemistry / Economics / Maths / Physics", fee: 490000, totalFee: 2076000, duration: 4, level: "Integrated" },
    { program: "M.E.", fee: 300000, duration: 2, level: "PG" },
    { program: "MBA", fee: 500000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 200000, duration: 4, level: "Doctoral" },
  ],

  "IIIT": [ // IIIT Hyderabad (iiit.ac.in) — AY 2026-27 from ugadmissions.iiit.ac.in/fee-jee-spec/
    { program: "B.Tech", specialization: "CSE", fee: 500000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 500000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CLD (Computational Linguistics)", fee: 500000, duration: 4, level: "UG" },
    { program: "Dual Degree (B.Tech + M.S.)", specialization: "CSE / ECE", fee: 500000, duration: 5, level: "Integrated" },
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

  "KLHD": [ // KL University — Hyderabad (Aziz Nagar & Bowrampet campuses) (kluniversity.in/sships3.aspx — AY 2026-27, 3 terms/yr × Merit Fee)
    { program: "B.Tech", specialization: "CSE", fee: 330000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "AI & Data Science", fee: 330000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CS & IT (Bowrampet)", fee: 300000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 285000, duration: 4, level: "UG" },
    { program: "BCA", fee: 220000, duration: 3, level: "UG" },
    { program: "BBA", specialization: "Marketing/HR/Finance/Digital Mktg/Business Analytics", fee: 250000, duration: 3, level: "UG" },
    { program: "BBA", specialization: "Global Finance / Fintech / LSCM / Business Analytics", fee: 270000, duration: 3, level: "UG" },
    { program: "B.Com (Hons) with ACCA/CMA/EA", fee: 210000, duration: 3, level: "UG" },
    { program: "B.Sc (Animation & Gaming)", fee: 210000, duration: 3, level: "UG" },
    { program: "MBA", specialization: "Marketing/HR/Finance/Digital Mktg/Business Analytics", fee: 450000, duration: 2, level: "PG" },
    { program: "MBA", specialization: "Fintech", fee: 650000, duration: 2, level: "PG" },
    { program: "MBA", specialization: "Global Program", fee: 600000, duration: 2, level: "PG" },
    { program: "MCA", fee: 250000, duration: 2, level: "PG" },
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

  "CVSR": [ // Anurag University — Hyderabad (anurag.edu.in/tuition-fee — AY 2026-27, TAFRC regulated ₹2.85L/yr B.Tech)
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

  "MRDU": [ // Malla Reddy University — Hyderabad (mallareddyuniversity.ac.in — AY 2026-27, ₹2L/yr B.Tech CSE total ₹8L)
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

  "SNDU": [ // Sreenidhi University (suh.edu.in/university-fee — ATFC 2025-26: ₹4.5L/yr sticker tuition; merit scholarships reduce to ₹1.25L–4L; +₹20K one-time admission +₹20K refundable deposit)
    { program: "B.Tech", specialization: "All Specializations (CSE / AI&ML / Data Science / Cyber Security / SAP-Cloud ERP)", fee: 450000, duration: 4, level: "UG" },
    { program: "MBA", fee: 170000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 210000, duration: 2, level: "PG" },
  ],

  "GNKU": [ // Guru Nanak University (gnuindia.org/gnu-fee-structure.php — official AY 2026-27 fee table)
    { program: "B.Tech", specialization: "CSE", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML / Data Science / Cyber Security)", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Biotechnology", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IT / ECE / Mechanical / Civil", fee: 240000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE-SAP / CSE-AIML (IBM / Intellipaat) / Robotics & AI (Industry-Linked)", fee: 320000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 200000, duration: 4, level: "UG" },
    { program: "BCA", fee: 170000, duration: 3, level: "UG" },
    { program: "BCA", specialization: "Data Science / Cyber Security / AI", fee: 150000, duration: 3, level: "UG" },
    { program: "BBA", fee: 150000, duration: 3, level: "UG" },
    { program: "B.Com", fee: 80000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 180000, duration: 4, level: "UG" },
    { program: "B.Sc Nursing", fee: 150000, duration: 4, level: "UG" },
    { program: "BPT", fee: 200000, duration: 4.5, level: "UG" },
    { program: "BA LLB (Hons)", fee: 150000, duration: 5, level: "Integrated" },
    { program: "MBA", fee: 250000, duration: 2, level: "PG" },
    { program: "MBA", specialization: "Business Analytics / Fintech / Entrepreneurship", fee: 260000, duration: 2, level: "PG" },
    { program: "MCA", fee: 200000, duration: 2, level: "PG" },
    { program: "M.Tech", specialization: "CSE", fee: 150000, duration: 2, level: "PG" },
    { program: "M.Tech", specialization: "ECE / Biotechnology", fee: 100000, duration: 2, level: "PG" },
  ],

  "MNRU": [ // MNR University — Sangareddy (mnruniversity.edu.in/fees — official AY 2026-27; annual tuition, +services ₹9K-19K/sem; 5% annual escalation)
    // Note: MBBS / B.Pharm / Pharm.D are offered by MNR Medical College & MNR College of Pharmacy
    // (separate KNRUHS/JNTUH-affiliated institutions), NOT by MNR University — removed per official MNRU fee page.
    { program: "B.Tech", specialization: "CSE", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & Data Science)", fee: 200000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE (IoT)", fee: 200000, duration: 4, level: "UG" },
    { program: "BPT", fee: 200000, duration: 5, level: "UG" },
    { program: "B.Sc (Allied Healthcare Sciences)", specialization: "MLS / AOTT / MRIT / Dialysis / Optometry / Emergency / Respiratory / Cardiac & Perfusion etc.", fee: 150000, duration: 4, level: "UG" },
    { program: "M.Tech", specialization: "CSE (AI & ML)", fee: 120000, duration: 2, level: "PG" },
    { program: "M.Sc (Medical)", specialization: "Anatomy / Physiology / Biochemistry / Pharmacology / Microbiology", fee: 150000, duration: 2, level: "PG" },
    { program: "MPT", fee: 120000, duration: 2, level: "PG" },
    { program: "Ph.D", fee: 100000, duration: 3, level: "Doctoral" },
  ],

  // =============================================
  // AP — PRIVATE UNIVERSITIES (official websites)
  // =============================================

  "SRMA": [ // SRM University AP (srmap.edu.in/admission/seas-btech-tuition-fee — AY 2026-27, page last modified 2026-05-07)
    { program: "B.Tech", specialization: "CSE", fee: 400000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 400000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Big Data Analytics)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Distributed & Cloud Computing)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (IoT)", fee: 360000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Product Engineering with AI)", fee: 460000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & Future Technologies)", fee: 460000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE (incl. Adv. Comm. Systems / Signal Processing AI-ML / Embedded Systems & IoT / VLSI Design)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Microelectronics & Semiconductors", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical (incl. Additive Mfg / Automotive / Robotics & Automation)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE (incl. Renewable Energy)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil (incl. Computer Aided Structural Engineering)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Defence Engineering", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Energy Engineering", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Health Engineering", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Semiconductor Engineering", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Artificial Intelligence (AiTI)", fee: 400000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Quantum Technology (QuTI)", fee: 400000, duration: 4, level: "UG" },
    { program: "BBA (Hons)", fee: 255000, duration: 3, level: "UG" },
    { program: "MBA", fee: 540000, duration: 2, level: "PG" }, // Tuition + Hostel (fully residential) — Paari School of Business
    { program: "M.Tech", fee: 200000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 200000, duration: 2, level: "PG" },
  ],

  "VTAP": [ // VIT-AP University (vitap.ac.in / vit.ac.in — AY 2026-27 published; Cat-1 ₹1,95,000 tuition + ₹3,000 caution = ₹1,98,000/yr)
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

  "AITS": [ // Annamacharya University — Rajampeta (annamacharyauniversity.edu.in — AY 2026-27, ₹60K/yr B.Tech total ₹2.4L)
    { program: "B.Tech", specialization: "All Specializations", fee: 60000, duration: 4, level: "UG" },
    { program: "B.Sc", fee: 36000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 60000, duration: 4, level: "UG" },
    { program: "MBA", fee: 60000, duration: 2, level: "PG" },
    { program: "MCA", fee: 60000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 50000, duration: 2, level: "PG" },
    { program: "M.Sc", fee: 45000, duration: 2, level: "PG" },
  ],

  "ADTP": [ // Aditya University — Surampalem (adityauniversity.in — AY 2026-27, ₹2.75L/yr CSE total ₹11L)
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

  "GMRI": [ // GMR University (formerly GMRIT) — Rajam, Srikakulam (Deemed University) — AY 2026-27 from gmrit.edu.in/du/eligibility.php
    { program: "B.Tech", specialization: "CSE", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & DS)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 150000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 150000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 150000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "IT", fee: 250000, duration: 4, level: "UG" },
    { program: "M.Tech", fee: 60000, duration: 2, level: "PG" },
  ],

  "GIOM": [ // GITAM Institute of Medical Sciences (GIMSR) — Visakhapatnam (gitam.edu/gimsr/admissions/under-graduate — official AY 2025-26: ₹25.37L/yr Y1-4, ₹12.7L Y5; NEET-rank scholarships up to 100%)
    { program: "MBBS", fee: 2537000, totalFee: 11418000, duration: 5, level: "UG" },
    { program: "MD/MS", fee: 2000000, duration: 3, level: "PG" },
  ],

  "MBUT": [ // Mohan Babu University — Tirupati — AY 2026-27 from media.mbu.asia MBU_Fee_Structrure_2026_27_1.pdf
    { program: "B.Tech", specialization: "CSE / AI&ML / Data Science / Cyber Security / DevOps / Cloud / IT", fee: 250000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE / Electronics & Computer Engg.", fee: 215000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE", fee: 140000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Electronics & Instrumentation", fee: 120000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Mechanical", fee: 115000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Civil", fee: 110000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 125000, duration: 4, level: "UG" },
    { program: "Pharm.D", fee: 250000, duration: 6, level: "Integrated" },
    { program: "BBA", fee: 100000, duration: 3, level: "UG" },
    { program: "BCA", fee: 70000, duration: 3, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 125000, duration: 4, level: "UG" },
    { program: "MBA", fee: 125000, duration: 2, level: "PG" },
    { program: "MCA", fee: 125000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 85000, duration: 2, level: "PG" },
    { program: "M.Pharm", fee: 125000, duration: 2, level: "PG" },
  ],

  "GGUR": [ // Godavari Global University — Rajahmundry (ggu.edu.in/fee-structure — official convener + university quota tables, updated 2026-03)
    // fee = Convener (EAPCET/ICET) quota tuition; mgmtFee = University (management) quota tuition
    { program: "B.Tech", specialization: "CSE", fee: 60000, mgmtFee: 220000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 60000, mgmtFee: 220000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Data Science / Cyber Security / AI & DS)", fee: 60000, mgmtFee: 180000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "ECE", fee: 60000, mgmtFee: 180000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "EEE / Mechanical / Civil", fee: 60000, mgmtFee: 100000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "Automobile / Mining / Agricultural Engg", fee: 60000, mgmtFee: 75000, duration: 4, level: "UG" },
    { program: "BCA (Hons)", fee: 37000, mgmtFee: 60000, duration: 4, level: "UG" },
    { program: "BBA (Hons)", fee: 35500, mgmtFee: 60000, duration: 4, level: "UG" },
    { program: "B.Com (Hons)", fee: 35500, mgmtFee: 50000, duration: 4, level: "UG" },
    { program: "B.Sc (Hons)", specialization: "AI / Data Science / Computer Science / Forensic Science / Physics / Chemistry etc.", fee: 35500, mgmtFee: 60000, duration: 4, level: "UG" },
    { program: "B.Sc (Hons) Agriculture", fee: 44500, mgmtFee: 100000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 52500, mgmtFee: 120000, duration: 4, level: "UG" },
    { program: "Pharm.D", fee: 65000, mgmtFee: 200000, duration: 6, level: "Integrated" },
    { program: "B.Sc (Hons) Allied Health Sciences", fee: 35500, mgmtFee: 70000, duration: 4, level: "UG" },
    { program: "MBA", fee: 60000, mgmtFee: 80000, duration: 2, level: "PG" },
    { program: "MCA", fee: 60000, mgmtFee: 90000, duration: 2, level: "PG" },
    { program: "M.Tech", fee: 80000, duration: 2, level: "PG" },
    { program: "M.Pharm", fee: 80000, duration: 2, level: "PG" },
  ],

  "APOL": [ // The Apollo University — Chittoor (apollouniversity.edu.in/admissions/fee-structure — AY 2026-27; ₹2.60L/yr tuition + ₹13K recurring/yr, total ₹10.99L incl ₹7K admission)
    { program: "B.Tech", specialization: "CSE", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & Data Science)", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & ML)", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cyber Security)", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (Cloud Computing)", fee: 260000, duration: 4, level: "UG" },
    { program: "B.Tech", specialization: "CSE (AI & Healthcare Technology)", fee: 260000, duration: 4, level: "UG" },
    { program: "BPT", fee: 100000, duration: 4, level: "UG" },
    { program: "B.Sc (Health Sciences)", fee: 80000, duration: 4, level: "UG" },
    { program: "B.Pharm", fee: 100000, duration: 4, level: "UG" },
    { program: "BBA", fee: 150000, duration: 3, level: "UG" },
    { program: "MBA", specialization: "Hospital & Healthcare Management", fee: 200000, duration: 2, level: "PG" },
    { program: "MPT", fee: 120000, duration: 2, level: "PG" },
    { program: "M.Tech", specialization: "VLSI / Data Science / CSE / Embedded Systems", fee: 150000, duration: 2, level: "PG" },
  ],

  "BEST": [ // BESTIU — Anantapur (bestiu.edu.in — AY 2026-27, ₹2L/yr CSE total ₹8L)
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
