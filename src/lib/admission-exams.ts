/** Admission entrance exam data for deemed & private universities */

export interface ExamPhase {
  phase: string;        // e.g. "Phase 1", "Session 1"
  examDates: string;    // e.g. "Apr 15–17, 2026"
  lastDateToApply: string;
  resultDate?: string;
}

export interface AdmissionExam {
  examName: string;        // e.g. "GAT", "AEEE"
  examFullName: string;    // e.g. "GITAM Admission Test"
  officialUrl: string;
  applicationFee: string;  // e.g. "₹1,200"
  mode: string;            // e.g. "Online CBT", "Remote Proctored"
  duration: string;        // e.g. "2.5 hours"
  subjects: string;        // e.g. "Physics, Chemistry, Mathematics, English"
  eligibility: string;     // brief eligibility
  phases: ExamPhase[];
  alternateEntry?: string; // e.g. "Also accepts JEE Main scores"
  counsellingNote?: string;
  /** College codes this exam applies to */
  collegeCodes: string[];
}

export const ADMISSION_EXAMS: AdmissionExam[] = [
  // ── GITAM (GAT) ──
  {
    examName: "GAT",
    examFullName: "GITAM Admission Test",
    officialUrl: "https://www.gitam.edu/admissions",
    applicationFee: "₹1,200 (single group)",
    mode: "Online CBT at designated centres",
    duration: "2 hours",
    subjects: "Physics, Chemistry, Mathematics, English",
    eligibility: "10+2 with PCM, minimum 60% aggregate",
    phases: [
      { phase: "Phase 1", examDates: "Jan 2026", lastDateToApply: "Dec 2025", resultDate: "Jan 2026 (declared)" },
      { phase: "Phase 2", examDates: "Mar 28–29, 2026", lastDateToApply: "Mar 25, 2026", resultDate: "Mar 2026 (declared)" },
      { phase: "Phase 3", examDates: "Apr 19, 2026", lastDateToApply: "Apr 16, 2026", resultDate: "Apr 2026 (declared)" },
      { phase: "Phase 4", examDates: "May 17, 2026", lastDateToApply: "May 14, 2026", resultDate: "May 17, 2026 (same-day)" },
    ],
    alternateEntry: "Also accepts JEE Main, SAT, and state EAPCET scores",
    counsellingNote: "GITAM conducts its own centralised counselling after each phase result. Phase 4 is the final 2026 admission window.",
    collegeCodes: ["GITM", "GITH", "GIOM"],
  },

  // ── Amrita (AEEE) ──
  {
    examName: "AEEE",
    examFullName: "Amrita Engineering Entrance Examination",
    officialUrl: "https://aeee.amrita.edu/",
    applicationFee: "₹1,200",
    mode: "Online CBT at 100+ centres across India",
    duration: "2.5 hours",
    subjects: "Physics, Chemistry, Mathematics, English, Quantitative Aptitude",
    eligibility: "10+2 with PCM, minimum 60% aggregate",
    phases: [
      { phase: "Phase 1", examDates: "Jan 30 – Feb 1, 2026", lastDateToApply: "Jan 2026", resultDate: "Feb 2026 (declared)" },
      { phase: "Phase 2", examDates: "Apr 24–30, 2026", lastDateToApply: "Apr 15, 2026", resultDate: "May 9, 2026 (declared)" },
    ],
    alternateEntry: "Also accepts JEE Main percentile scores",
    counsellingNote: "Centralised Seat Allotment Process (CSAP) registration began May 12, 2026 — fully online, no campus visit required",
    collegeCodes: ["AMRT"],
  },

  // ── BITS Pilani (BITSAT) ──
  {
    examName: "BITSAT",
    examFullName: "BITS Admission Test",
    officialUrl: "https://www.bits-pilani.ac.in/bitsat/",
    applicationFee: "₹3,600 (male) / ₹3,100 (female)",
    mode: "Online CBT at designated centres",
    duration: "3 hours",
    subjects: "Physics, Chemistry, Mathematics, English Proficiency, Logical Reasoning",
    eligibility: "10+2 with PCM, minimum 75% aggregate with 60% in each subject",
    phases: [
      { phase: "Session 1", examDates: "Apr 15–17, 2026", lastDateToApply: "Mar 19, 2026", resultDate: "Apr 29, 2026 (declared)" },
      { phase: "Session 2", examDates: "May 25–27, 2026", lastDateToApply: "May 2, 2026", resultDate: "Jun 2026 (expected)" },
      { phase: "BITSAT Counselling", examDates: "Jun 2026 onwards (online iterations)", lastDateToApply: "Post Session 2 result" },
    ],
    counsellingNote: "Admission through BITS preference-based online iterations (no physical counselling) using best-of-both BITSAT score and Class 12 board marks",
    collegeCodes: ["BITS"],
  },

  // ── KL University (KLEEE) ──
  {
    examName: "KLEEE",
    examFullName: "KL Engineering Entrance Examination",
    officialUrl: "https://admissions.kluniversity.in/",
    applicationFee: "₹1,000",
    mode: "Online and Offline at KL campus",
    duration: "2 hours",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "10+2 with PCM, minimum 60% aggregate",
    phases: [
      { phase: "Phase 1", examDates: "Dec 2025 – Jan 2026", lastDateToApply: "Dec 2025", resultDate: "Jan 13, 2026 (declared)" },
      { phase: "Phase 2", examDates: "Feb–Mar 2026", lastDateToApply: "Feb 2026", resultDate: "Mar 2026 (declared)" },
      { phase: "Phase 3", examDates: "Mar 28–31, 2026", lastDateToApply: "Mar 27, 2026", resultDate: "Apr 2026 (declared)" },
    ],
    alternateEntry: "Also accepts JEE Main, AP/TS EAPCET scores",
    counsellingNote: "KLEEE counselling rounds were conducted Apr 26–30, 2026. Late applications via spot admission may still be accepted — check kluniversity.in.",
    collegeCodes: ["KLUN", "KLHD"],
  },

  // ── VIT-AP (VITEEE) ──
  {
    examName: "VITEEE",
    examFullName: "VIT Engineering Entrance Examination",
    officialUrl: "https://viteee.vit.ac.in/",
    applicationFee: "₹1,350",
    mode: "Online CBT at centres across India",
    duration: "2.5 hours",
    subjects: "Mathematics (40), Physics (35), Chemistry (35), Aptitude (10), English (5) — 125 MCQs, 500 marks total. +4 per correct, −1 per wrong (negative marking introduced in 2026)",
    eligibility: "10+2 with PCM, minimum 60% aggregate, 50% in Maths. DOB on or after Jul 1, 2004",
    phases: [
      { phase: "Main Exam", examDates: "Apr 23 – May 3, 2026", lastDateToApply: "Mar 31, 2026", resultDate: "May 8, 2026 (declared)" },
      { phase: "Phase 1 Counselling (Ranks 1–20,000)", examDates: "Choice filling May 12–13; allotment May 14, 2026", lastDateToApply: "May 11, 2026 (registration + fee)" },
      { phase: "Phase 2 Counselling (Ranks 20,001–45,000)", examDates: "Choice filling May 19 (10 AM) – May 20 (5 PM), 2026", lastDateToApply: "May 19, 2026" },
    ],
    counsellingNote: "VIT conducts centralised counselling; candidates choose campus (Vellore, Chennai, AP, Bhopal). Counselling fee ₹5,900 (incl. GST). IMPORTANT: Negative marking (+4/−1) introduced for the first time in VITEEE 2026.",
    collegeCodes: ["VTAP"],
  },

  // ── SRM AP (SRMJEEE) ──
  {
    examName: "SRMJEEE",
    examFullName: "SRM Joint Engineering Entrance Examination",
    officialUrl: "https://applications.srmist.edu.in/btech",
    applicationFee: "₹1,400",
    mode: "Remote Proctored Online (from home)",
    duration: "2.5 hours",
    subjects: "Physics, Chemistry, Mathematics/Biology, English, Aptitude",
    eligibility: "10+2 with Physics + Maths (mandatory) + one of Chemistry/Bio/CS, minimum 60% aggregate",
    phases: [
      { phase: "Phase 1", examDates: "Apr 23–28, 2026", lastDateToApply: "Apr 16, 2026", resultDate: "May 2026 (declared); choice filling May 7, allotment May 14–21" },
      { phase: "Phase 2", examDates: "Jun 10–15, 2026", lastDateToApply: "Jun 4, 2026", resultDate: "Jun 2026 (expected)" },
      { phase: "Phase 3", examDates: "Jul 4–5, 2026", lastDateToApply: "Jun 30, 2026", resultDate: "Jul 2026 (expected)" },
    ],
    alternateEntry: "Also accepts JEE Main scores",
    counsellingNote: "SRM conducts its own counselling after each phase; candidates choose SRM campus (KTR, Ramapuram, AP, etc.)",
    collegeCodes: ["SRMA"],
  },

  // ── ICFAI / IFHE (ATIT) ──
  {
    examName: "ATIT",
    examFullName: "Admission Test for IcfaiTech",
    officialUrl: "https://www.ifheindia.org/icfaitech-school-hyderabad/",
    applicationFee: "₹500",
    mode: "Online CBT",
    duration: "2 hours",
    subjects: "Mathematics, Physics, Chemistry, English, Logical Reasoning",
    eligibility: "10+2 with minimum 60% marks",
    phases: [
      { phase: "Phase 1", examDates: "Dec 21–26, 2025", lastDateToApply: "Dec 19, 2025", resultDate: "Jan 2026 (declared)" },
      { phase: "Phase 2", examDates: "Apr 19–27, 2026", lastDateToApply: "Apr 17, 2026", resultDate: "May 2026 (declared per phase)" },
    ],
    alternateEntry: "Also accepts JEE Main and state-level entrance exam scores",
    counsellingNote: "Phase 2 admissions ongoing — results sent via email and published on ifheindia.org",
    collegeCodes: ["ICFA"],
  },

  // ── Vignan's University (VSAT) ──
  {
    examName: "VSAT",
    examFullName: "Vignan's Scholastic Aptitude Test",
    officialUrl: "https://admissions.vignan.ac.in/",
    applicationFee: "₹1,200",
    mode: "Remote Proctored Online / At campus",
    duration: "2 hours",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "Rolling", examDates: "Jan 15 – Apr 15, 2026 (concluded)", lastDateToApply: "Apr 15, 2026", resultDate: "Released per-candidate after exam" },
      { phase: "Counselling", examDates: "May 2026 (Round 1 ongoing), Round 2 at Vadlamudi campus for vacant seats", lastDateToApply: "Post-result registration" },
    ],
    alternateEntry: "Also accepts JEE Main, AP/TS EAPCET scores. Direct admission also possible for AP EAPCET qualifiers.",
    counsellingNote: "Vignan conducts two-round online counselling after VSAT results, plus spot round at campus",
    collegeCodes: ["VIGF"],
  },

  // ── IIIT Hyderabad (UGEE) ──
  {
    examName: "UGEE",
    examFullName: "Undergraduate Entrance Examination",
    officialUrl: "https://ugadmissions.iiit.ac.in/ugee/",
    applicationFee: "₹3,100 (male) / ₹1,550 (female)",
    mode: "Online at designated centres",
    duration: "3 hours",
    subjects: "SUPR (Subject Proficiency, 60 min) + REAP (Research Aptitude, 120 min)",
    eligibility: "10+2 with Maths as a subject",
    phases: [
      { phase: "Exam", examDates: "May 2, 2026 (9 AM – 12 PM)", lastDateToApply: "Mar 31, 2026", resultDate: "May 11, 2026 (declared)" },
      { phase: "SPEC Interview", examDates: "May 22–23, 2026", lastDateToApply: "Post-result invitation" },
      { phase: "General Interview", examDates: "Jun 4–6, 2026 (online)", lastDateToApply: "Post-result invitation" },
    ],
    counsellingNote: "Result declared May 11, 2026 at ugadmissions.iiit.ac.in. Interview performance is the sole basis for final admission offer.",
    collegeCodes: ["IIIT"],
  },

  // ── Mahindra University (MU Entrance) ──
  {
    examName: "MU Entrance",
    examFullName: "Mahindra University Entrance Test",
    officialUrl: "https://www.mahindrauniversity.edu.in/programs/b-tech/",
    applicationFee: "Contact university",
    mode: "Online",
    duration: "Contact university",
    subjects: "Physics, Chemistry, Mathematics, Aptitude",
    eligibility: "10+2 with PCM. Preference for JEE Main / JEE Advanced qualifiers",
    phases: [
      { phase: "SAT Interactions Round", examDates: "Interactions Apr 30 – May 6, 2026", lastDateToApply: "Apr 27, 2026" },
      { phase: "JEE Main Based Admission", examDates: "Post JEE Main Session 2 result (declared Apr 20, 2026)", lastDateToApply: "Rolling — check mahindrauniversity.edu.in" },
    ],
    alternateEntry: "Primarily admits through JEE Main / JEE Advanced / SAT / ACT scores. No standalone entrance exam conducted. 240 total B.Tech seats.",
    counsellingNote: "Mahindra University conducts its own merit-based selection. Eligibility requires JEE Main 2026 qualification or top All-India Rank, plus 60% in 10+2.",
    collegeCodes: ["MHND"],
  },

  // ── Private Universities accepting TS/AP EAPCET + own exam ──
  // Anurag University
  {
    examName: "Anurag CET",
    examFullName: "Anurag Common Entrance Test",
    officialUrl: "https://anurag.edu.in/entrance-tests/",
    applicationFee: "Contact university",
    mode: "Online / At campus",
    duration: "2 hours",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM, minimum 45% marks",
    phases: [
      { phase: "Anurag CET", examDates: "May 9, 2026", lastDateToApply: "Jan 15, 2026", resultDate: "May 2026 (declared)" },
      { phase: "TS EAPCET (alternate route)", examDates: "May 9–11, 2026", lastDateToApply: "Apr 4 (no late fee) / May 2, 2026 (with late fee)", resultDate: "May 17, 2026 (declared)" },
    ],
    alternateEntry: "Also accepts TS EAPCET, JEE Main scores. TS EAPCET admits get government-regulated fees via TSCHE counselling (registration begins June 2026).",
    counsellingNote: "Dual route: TS EAPCET counselling (govt fees, starts Jun 2026) or university admission via Anurag CET (university fees)",
    collegeCodes: ["CVSR"],
  },

  // ── GMR University (formerly GMRIT, Rajam) — Deemed — own admissions ──
  {
    examName: "GMRCET / Student Interaction",
    examFullName: "GMRIT Deemed University Holistic Admission Process",
    officialUrl: "https://admissions.gmrit.edu.in/",
    applicationFee: "₹500 + GST",
    mode: "Online / At campus (student interaction with faculty)",
    duration: "Contact university",
    subjects: "Holistic assessment — academic record + student interaction / GMRCET",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "Phase 1", examDates: "Seat allotment May 4, 2026", lastDateToApply: "May 2, 2026 (closed)" },
      { phase: "Phase 3", examDates: "Seat allotment Jun 30, 2026", lastDateToApply: "Jun 25, 2026" },
    ],
    alternateEntry: "Category-B (NRI and non-NRI) seats are filled through separate merit lists via direct application at admissions.gmrit.edu.in.",
    counsellingNote: "GMRIT is now a deemed university — admission is through its own online application + GMRCET/student-interaction process, NOT AP EAPCET / APSCHE counselling (it last participated in EAPCET in 2025).",
    collegeCodes: ["GMRI"],
  },

  // ── MITS Madanapalle (Deemed) — MITSUCET ──
  {
    examName: "MITSUCET",
    examFullName: "MITS University Common Entrance Test",
    officialUrl: "https://admission.mits.ac.in/",
    applicationFee: "Contact university",
    mode: "Online",
    duration: "Contact university",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "MITSUCET 2026", examDates: "May 3, 2026 (conducted)", lastDateToApply: "Apr 25, 2026", resultDate: "May 15, 2026 (merit list declared)" },
      { phase: "MITS Counselling", examDates: "Post merit list — May/Jun 2026", lastDateToApply: "Post results" },
    ],
    alternateEntry: "Missed MITSUCET? Apply directly at admission.mits.ac.in with 10+2 marks or JEE Main / state CET scores.",
    counsellingNote: "MITS is a deemed university — admission is through its own MITSUCET exam and university counselling, NOT AP EAPCET / APSCHE counselling. JEE Main and state CET scores are accepted for direct admission and scholarship slabs.",
    collegeCodes: ["MITS"],
  },

  // ── Siddhartha Academy of Higher Education (formerly VR Siddhartha) — Deemed — SEEE ──
  {
    examName: "SEEE",
    examFullName: "Siddhartha Engineering Entrance Examination",
    officialUrl: "https://admissions.siddhartha.edu.in/",
    applicationFee: "Contact university",
    mode: "Contact university",
    duration: "Contact university",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "10+2 with PCM, minimum 50% aggregate",
    phases: [
      { phase: "JEE Main Counselling", examDates: "Round 1: Apr 10–16 · Round 2: Apr 20–28, 2026 (concluded)", lastDateToApply: "Apr 2026" },
      { phase: "SEEE Phase I", examDates: "Apr 4–26, 2026, 8 sittings (conducted)", lastDateToApply: "Apr 20, 2026", resultDate: "Apr 30, 2026 — counselling from May 4" },
      { phase: "SEEE Phase II", examDates: "May 23–24, 2026 (conducted)", lastDateToApply: "May 18, 2026", resultDate: "May 26, 2026 — counselling from May 30" },
      { phase: "AP EAPCET (leftover seats only)", examDates: "Counselling ~1 week after EAPCET results (Jun 2026)", lastDateToApply: "2 days after EAPCET result declaration" },
    ],
    alternateEntry: "JEE Main scores get dedicated counselling rounds. AP EAPCET scores are accepted only for seats left over after JEE and SEEE counselling.",
    counsellingNote: "Siddhartha (SAHE) is a deemed university — all B.Tech counselling is conducted by the university itself, NOT APSCHE. Seats fill via JEE Main and SEEE merit; EAPCET candidates take only leftover seats. Phase-II admissions don't guarantee merit scholarships.",
    collegeCodes: ["VRSE"],
  },

  // ── Woxsen University (W-JEET) ──
  {
    examName: "W-JEET",
    examFullName: "Woxsen Joint Engineering Entrance Test",
    officialUrl: "https://woxsen.edu.in/admissions/",
    applicationFee: "Contact university",
    mode: "Online",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry, Aptitude",
    eligibility: "10+2 with PCM, minimum 60% aggregate",
    phases: [
      { phase: "Application Window", examDates: "Test scheduled per-candidate via remote proctored mode after registration", lastDateToApply: "Feb 25, 2026 (extended)", resultDate: "Released within days of test + interview" },
      { phase: "Personal Interview", examDates: "Scheduled after W-JEET + psychometric test", lastDateToApply: "Post-W-JEET" },
    ],
    alternateEntry: "Also accepts JEE Main, VITEEE, TS/AP EAPCET, MHT CET scores",
    counsellingNote: "Woxsen admission = W-JEET + psychometric test + personal interview. Results sent individually by email. No fixed result date.",
    collegeCodes: ["WOXN"],
  },

  // ── Malla Reddy University (MRUCET) ──
  {
    examName: "MRUCET",
    examFullName: "Malla Reddy University Common Entrance Test",
    officialUrl: "https://admissions.mallareddyuniversity.ac.in/",
    applicationFee: "Contact university",
    mode: "Online CBT (60 minutes)",
    duration: "1 hour",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM, minimum 60% aggregate",
    phases: [
      { phase: "MRUCET 2026", examDates: "Multiple slots through 2026 — schedule on demand at admissions.mallareddyuniversity.ac.in", lastDateToApply: "Rolling", resultDate: "Released soon after each slot" },
      { phase: "TS EAPCET (alternate route)", examDates: "May 9–11, 2026", lastDateToApply: "Apr 4 / May 2, 2026", resultDate: "May 17, 2026 (declared)" },
    ],
    alternateEntry: "Also accepts JEE Main, CAT, GATE, TS EAPCET scores. TS EAPCET admits exempted from MRUCET.",
    counsellingNote: "Dual route: TS EAPCET counselling (govt fees, from Jun 2026) or direct MRUCET admission (university fees)",
    collegeCodes: ["MRDU"],
  },

  // ── SR University (Warangal) ──
  {
    examName: "TS EAPCET / JEE Main",
    examFullName: "SR University admits primarily through TS EAPCET",
    officialUrl: "https://sru.edu.in/admission/",
    applicationFee: "TS EAPCET: ₹900 (General) / ₹500 (SC/ST)",
    mode: "Online CBT (TS EAPCET)",
    duration: "3 hours (TS EAPCET)",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "TS EAPCET 2026", examDates: "Engineering: May 9–11, 2026", lastDateToApply: "Apr 4 (no late fee) / May 2, 2026 (with late fee)", resultDate: "May 17, 2026 (declared)" },
      { phase: "TSCHE Counselling", examDates: "Jun–Aug 2026 (3 rounds + spot)", lastDateToApply: "Post results" },
    ],
    alternateEntry: "Also accepts JEE Main, GATE, CAT scores. PhD applications close Jun 5, 2026.",
    counsellingNote: "Dual route: TSCHE EAPCET counselling (govt fees) or direct university admission (university fees)",
    collegeCodes: ["SRUN"],
  },

  // ── Aditya University (ASAT) ──
  {
    examName: "ASAT",
    examFullName: "Aditya Scholastic Aptitude Test",
    officialUrl: "https://apply.adityauniversity.in/",
    applicationFee: "Contact university",
    mode: "Online / At campus",
    duration: "2 hours",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM, minimum 50% marks",
    phases: [
      { phase: "Rolling", examDates: "Dec 1, 2025 – Jun 30, 2026 (ongoing)", lastDateToApply: "Jun 30, 2026", resultDate: "Same day as exam" },
      { phase: "AP EAPCET (alternate route)", examDates: "Engineering: May 12–15, 18, 2026", lastDateToApply: "Apr 10, 2026 (with late fee)", resultDate: "Jun 1, 2026 (expected)" },
    ],
    alternateEntry: "Also accepts JEE Main, AP EAPCET scores, and Merit in Sports",
    counsellingNote: "Dual route: AP EAPCET counselling (govt fees, Jul 2026) or direct ASAT admission (university fees, same-day result)",
    collegeCodes: ["ADTP"],
  },

  // ── Annamacharya University (AUET) ──
  {
    examName: "AUET",
    examFullName: "Annamacharya University Entrance Test",
    officialUrl: "https://annamacharyauniversity.edu.in/admission-requirements/",
    applicationFee: "Contact university",
    mode: "Online / At campus",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM, minimum 45% marks (5% relaxation for SC/ST/BC)",
    phases: [
      { phase: "AUET 2026", examDates: "Rolling — scheduled per applicant after registration", lastDateToApply: "Rolling", resultDate: "Released after each session + PI round" },
      { phase: "AP EAPCET (alternate route)", examDates: "Engineering: May 12–15, 18, 2026", lastDateToApply: "Apr 10, 2026 (with late fee)", resultDate: "Jun 1, 2026 (expected)" },
    ],
    alternateEntry: "Also accepts AP EAPCET, JEE Main scores",
    counsellingNote: "Scholarships up to ₹25 Lakhs based on AUET score. AUET followed by personal interview round.",
    collegeCodes: ["AITS"],
  },

  // ── Audisankara Deemed to be University (Gudur, Nellore) — AUCET ──
  {
    examName: "AUCET",
    examFullName: "Audisankara University Common Entrance Test (AUCET-2026)",
    officialUrl: "https://audisankarauniversity.edu.in/",
    applicationFee: "Contact university",
    mode: "Contact university",
    duration: "Contact university",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "AUCET 2026", examDates: "See audisankarauniversity.edu.in for notification", lastDateToApply: "See official website" },
    ],
    alternateEntry: "The sister affiliated colleges in Gudur (ASIT, ASCET) still admit via AP EAPCET — only the deemed university admits through AUCET.",
    counsellingNote: "Audisankara became a deemed university in 2025 — admission is via its own AUCET and university counselling, NOT AP EAPCET / APSCHE counselling. ~80% of UG students receive financial aid.",
    collegeCodes: ["AUDI"],
  },

  // ── NRI Deemed to be University (Dr. RVR NRIIT, Agiripalli) — NRIUCET ──
  {
    examName: "NRIUCET",
    examFullName: "NRI University Common Entrance Test",
    officialUrl: "https://nriit.edu.in/nri-deemed-university/admissions/",
    applicationFee: "Contact university",
    mode: "Contact university",
    duration: "Contact university",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "NRIUCET 2026", examDates: "See nriit.edu.in for notification", lastDateToApply: "Online registration open — see official website" },
    ],
    alternateEntry: "Online registration form and Prospectus 2026-27 available at nriit.edu.in.",
    counsellingNote: "Dr. RVR NRI Institute of Technology is a deemed university — admission is via its own NRIUCET exam and university counselling, NOT AP EAPCET / APSCHE counselling.",
    collegeCodes: ["NRIA"],
  },

  // ── Centurion University (CUTM, Vizianagaram) ──
  {
    examName: "CUEE",
    examFullName: "Centurion University Entrance Examination",
    officialUrl: "https://admissions.cutm.ac.in/",
    applicationFee: "Contact university",
    mode: "Online",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry, English",
    eligibility: "10+2 with PCM, minimum 45% aggregate",
    phases: [
      { phase: "CUEE 2026", examDates: "Rolling test slots through 2026", lastDateToApply: "May 24, 2026", resultDate: "Released soon after each slot" },
      { phase: "AP EAPCET (alternate route)", examDates: "Engineering: May 12–15, 18, 2026", lastDateToApply: "Apr 10, 2026 (with late fee)", resultDate: "Jun 1, 2026 (expected)" },
    ],
    alternateEntry: "Also accepts JEE Main (rank up to 3 lakh), AP EAPCET, OJEE scores",
    counsellingNote: "CUEE rank up to 50,000 required for B.Tech. Selection done by admissions team after merit-based counselling.",
    collegeCodes: ["CENT"],
  },

  // ── Guru Nanak University (Hyderabad) ──
  {
    examName: "GNUCET",
    examFullName: "Guru Nanak University Common Entrance Test",
    officialUrl: "https://www.gnuindia.org/admissions-department.php",
    applicationFee: "Contact university",
    mode: "Online (scholarship test)",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM, minimum 45% aggregate (40% for SC/ST/BC)",
    phases: [
      { phase: "GNUCET 2026", examDates: "Rolling — university scholarship test", lastDateToApply: "Jun 2026 (tentative)", resultDate: "Released soon after each test" },
      { phase: "TS EAPCET (alternate route)", examDates: "Engineering: May 9–11, 2026", lastDateToApply: "Apr 4 / May 2, 2026", resultDate: "May 17, 2026 (declared)" },
    ],
    alternateEntry: "Also accepts TS EAPCET, JEE Main scores",
    counsellingNote: "GNUCET is primarily a scholarship test. Direct admission also offered based on TS EAPCET / JEE Main.",
    collegeCodes: ["GNKU"],
  },

  // ── Sreenidhi University (Hyderabad) ──
  {
    examName: "SUCET",
    examFullName: "Sreenidhi University Common Entrance Test",
    officialUrl: "https://suh.edu.in/",
    applicationFee: "Contact university",
    mode: "Online",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with minimum 60% in Physics, Chemistry, and Mathematics",
    phases: [
      { phase: "SUCET 2026", examDates: "Rolling — scheduled per applicant", lastDateToApply: "Jul 2026 (tentative, before academic session)", resultDate: "Released soon after each test" },
      { phase: "TS EAPCET (alternate route)", examDates: "Engineering: May 9–11, 2026", lastDateToApply: "Apr 4 / May 2, 2026", resultDate: "May 17, 2026 (declared)" },
    ],
    alternateEntry: "Also accepts TS EAPCET, AP EAPCET, JEE Main scores",
    counsellingNote: "Sreenidhi University admits based on merit and entrance exam scores. SUCET is the university-conducted route.",
    collegeCodes: ["SNDU"],
  },

  // ── MNR University (Sangareddy) ──
  {
    examName: "TS EAPCET / JEE Main",
    examFullName: "MNR University admits through TS EAPCET, JEE Main and direct application",
    officialUrl: "https://mnruniversity.edu.in/btech",
    applicationFee: "TS EAPCET: ₹900 (General) / ₹500 (SC/ST)",
    mode: "Online CBT (TS EAPCET)",
    duration: "3 hours (TS EAPCET)",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "TS EAPCET 2026", examDates: "Engineering: May 9–11, 2026", lastDateToApply: "Apr 4 / May 2, 2026", resultDate: "May 17, 2026 (declared)" },
      { phase: "TSCHE Counselling", examDates: "Jun–Aug 2026 (3 rounds + spot)", lastDateToApply: "Post results" },
    ],
    alternateEntry: "Also accepts JEE Main scores. Direct admission available for category B seats.",
    counsellingNote: "Specializations include CSE (AI & DS / AI & ML) and ECE (IoT). Primarily admits via TSCHE counselling.",
    collegeCodes: ["MNRU"],
  },

  // ── JEE Advanced (IITs) ──
  {
    examName: "JEE Advanced",
    examFullName: "Joint Entrance Examination — Advanced",
    officialUrl: "https://jeeadv.ac.in/",
    applicationFee: "₹3,200 (General/OBC) / ₹1,600 (SC/ST/PwD/Female)",
    mode: "Online CBT at designated centres across India",
    duration: "3 hours per paper (Paper 1 + Paper 2)",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "Must be in top 2,50,000 in JEE Main 2026 (BE/BTech); Class 12 passed in 2025 or 2026 with PCM; born on or after Oct 1, 2001 (5-year relaxation for SC/ST/PwD)",
    phases: [
      { phase: "Registration", examDates: "Apr 23 – May 2, 2026", lastDateToApply: "May 2, 2026" },
      { phase: "Exam", examDates: "May 17, 2026 (Paper 1: 9 AM–12 PM, Paper 2: 2:30–5:30 PM) — conducted", lastDateToApply: "May 2, 2026" },
      { phase: "Response Sheet & Answer Key", examDates: "Response sheet: May 21, 2026; Provisional answer key: May 25, 2026 (10 AM)", lastDateToApply: "—" },
      { phase: "Result", examDates: "Jun 1, 2026 (10 AM IST)", lastDateToApply: "—", resultDate: "Jun 1, 2026 (scheduled)" },
      { phase: "JoSAA Counselling", examDates: "Jun 2 (5 PM) – last week of Jul 2026 (5+ rounds)", lastDateToApply: "Jun 2, 2026 (registration opens)" },
    ],
    counsellingNote: "Conducted by IIT Roorkee in 221 cities (incl. 2 international). Admission through JoSAA centralised counselling. Seat allotment in 5+ rounds based on JEE Advanced rank, category, and preferences.",
    collegeCodes: ["IITH", "IITP"],
  },

  // ── JEE Main / JoSAA (NITs, IIITs, GFTIs) ──
  {
    examName: "JEE Main",
    examFullName: "Joint Entrance Examination — Main",
    officialUrl: "https://jeemain.nta.nic.in/",
    applicationFee: "₹1,000 (General) / ₹500 (SC/ST/PwD/Female) per session",
    mode: "Online CBT at NTA-designated centres across India",
    duration: "3 hours",
    subjects: "Physics, Chemistry, Mathematics",
    eligibility: "Class 12 passed (or appearing) with Physics, Mathematics, and one of Chemistry/Biology/Biotechnology/any Technical Vocational subject",
    phases: [
      { phase: "Session 1", examDates: "Jan 21–28, 2026", lastDateToApply: "Nov 2025", resultDate: "Feb 12, 2026 (declared)" },
      { phase: "Session 2", examDates: "Apr 2–8, 2026", lastDateToApply: "Feb 25, 2026", resultDate: "Apr 20, 2026 (declared)" },
      { phase: "JoSAA Counselling", examDates: "Jun 2 (5 PM) – last week of Jul 2026 (5+ rounds)", lastDateToApply: "Jun 2, 2026 (registration opens)" },
    ],
    counsellingNote: "Admission through JoSAA centralised counselling for 23 IITs, 31 NITs, IIEST Shibpur, 26 IIITs, and 38 GFTIs. Best of Session 1 and Session 2 NTA scores is used. Session 2 had 26 candidates with 100 percentile.",
    collegeCodes: ["NITW"],
  },

  // ── University of Hyderabad (JEE Main + CUET) ──
  {
    examName: "JEE Main / CUET UG",
    examFullName: "JEE Main (for BTech) / CUET UG (for Integrated Programmes)",
    officialUrl: "https://acad.uohyd.ac.in/",
    applicationFee: "JEE Main: ₹1,000 (General) / ₹500 (reserved); CUET UG: ₹750 (General) / ₹350 (reserved)",
    mode: "Online CBT at NTA-designated centres",
    duration: "JEE Main: 3 hours; CUET UG: varies by subjects chosen",
    subjects: "JEE Main: Physics, Chemistry, Mathematics; CUET UG: domain subjects + general test",
    eligibility: "10+2 passed with relevant subjects; JEE Main rank for engineering programmes; CUET UG score for integrated programmes",
    phases: [
      { phase: "JEE Main Session 2", examDates: "Apr 2–8, 2026", lastDateToApply: "Feb 25, 2026", resultDate: "Apr 20, 2026 (declared)" },
      { phase: "CUET UG 2026", examDates: "May 11–31, 2026 (two slots: 9 AM–12 PM, 3 PM–6 PM)", lastDateToApply: "Mar 2026", resultDate: "Late Jun – first week Jul 2026 (expected)" },
      { phase: "UoH Counselling", examDates: "Jul–Aug 2026 (post-CUET result)", lastDateToApply: "Per UoH admission portal" },
    ],
    counsellingNote: "BTech/MTech integrated programmes in CSE and Materials Engineering admit through JEE Main scores (Session 2 result declared Apr 20, 2026). Other integrated programmes use CUET UG scores. UoH conducts its own counselling — CUET counselling is not centralised by NTA.",
    collegeCodes: ["UOHE"],
  },
];

/** Look up the admission exam for a given college code */
export function getExamByCollegeCode(code: string): AdmissionExam | null {
  return ADMISSION_EXAMS.find(e => e.collegeCodes.includes(code)) || null;
}
