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
      { phase: "Phase 1", examDates: "Jan 2026", lastDateToApply: "Dec 2025" },
      { phase: "Phase 2", examDates: "Mar 28–29, 2026", lastDateToApply: "Mar 25, 2026" },
      { phase: "Phase 3", examDates: "May 2026 (tentative)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts JEE Main, SAT, and state EAPCET scores",
    counsellingNote: "GITAM conducts its own centralised counselling after results",
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
      { phase: "Phase 1", examDates: "Jan 30 – Feb 1, 2026", lastDateToApply: "Jan 2026", resultDate: "Announced (Feb 2026)" },
      { phase: "Phase 2", examDates: "Apr 24–30, 2026", lastDateToApply: "Apr 15, 2026" },
    ],
    alternateEntry: "Also accepts JEE Main percentile scores",
    counsellingNote: "Centralised Seat Allotment Process (CSAP) in May 2026",
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
      { phase: "Session 1", examDates: "Apr 15–17, 2026", lastDateToApply: "Mar 19, 2026" },
      { phase: "Session 2", examDates: "May 24–26, 2026", lastDateToApply: "May 2, 2026" },
    ],
    counsellingNote: "Admission through BITS counselling based on BITSAT score and board marks",
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
      { phase: "Phase 1", examDates: "Dec 2025 – Jan 2026", lastDateToApply: "Dec 2025" },
      { phase: "Phase 2", examDates: "Feb–Mar 2026", lastDateToApply: "Feb 2026" },
      { phase: "Phase 3", examDates: "Mar 28–31, 2026", lastDateToApply: "Mar 27, 2026" },
    ],
    alternateEntry: "Also accepts JEE Main, AP/TS EAPCET scores",
    counsellingNote: "KL conducts its own counselling after KLEEE results",
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
      { phase: "Main Exam", examDates: "Apr 23 – May 3, 2026", lastDateToApply: "Mar 31, 2026" },
    ],
    counsellingNote: "VIT conducts centralised counselling; candidates choose campus (Vellore, Chennai, AP, Bhopal). IMPORTANT: Negative marking (+4/−1) introduced for the first time in VITEEE 2026.",
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
      { phase: "Phase 1", examDates: "Apr 23–28, 2026", lastDateToApply: "Apr 16, 2026" },
      { phase: "Phase 2", examDates: "Jun 10–15, 2026", lastDateToApply: "Jun 4, 2026" },
      { phase: "Phase 3", examDates: "Jul 4–5, 2026", lastDateToApply: "Jun 30, 2026" },
    ],
    alternateEntry: "Also accepts JEE Main scores",
    counsellingNote: "SRM conducts its own counselling; candidates choose SRM campus (KTR, Ramapuram, AP, etc.)",
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
      { phase: "Phase 1", examDates: "Dec 21–26, 2025", lastDateToApply: "Dec 19, 2025" },
      { phase: "Phase 2", examDates: "Apr 19–27, 2026", lastDateToApply: "Apr 17, 2026" },
    ],
    alternateEntry: "Also accepts JEE Main and state-level entrance exam scores",
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
      { phase: "Rolling", examDates: "Jan 15 – Apr 15, 2026", lastDateToApply: "Ongoing" },
    ],
    alternateEntry: "Also accepts JEE Main, AP/TS EAPCET scores",
    counsellingNote: "Vignan conducts its own counselling after VSAT results",
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
      { phase: "Exam", examDates: "May 2, 2026 (9 AM – 12 PM)", lastDateToApply: "Mar 31, 2026" },
    ],
    counsellingNote: "Shortlisted candidates attend on-campus interview Jun 4–6, 2026",
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
      { phase: "Admission Rounds", examDates: "No separate exam — admits via JEE Main / JEE Advanced / SAT / ACT scores", lastDateToApply: "Round 1: Jan 2026, Round 2: Mar 2026 (check website)" },
    ],
    alternateEntry: "Primarily admits through JEE Main / JEE Advanced / SAT / ACT scores. No standalone entrance exam conducted.",
    counsellingNote: "Mahindra University conducts its own merit-based selection and counselling based on JEE/SAT/ACT scores",
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
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts TS EAPCET, JEE Main scores. TS EAPCET admits get government-regulated fees",
    counsellingNote: "Dual route: TS EAPCET counselling (govt fees) or university admission (university fees)",
    collegeCodes: ["CVSR"],
  },

  // ── GMR University ──
  {
    examName: "GMR Entrance",
    examFullName: "GMR University Entrance Test",
    officialUrl: "https://www.gmruniversity.ac.in/",
    applicationFee: "Contact university",
    mode: "Online",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts AP EAPCET, JEE Main scores",
    collegeCodes: ["GMRI"],
  },

  // ── MITS Madanapalle (Deemed) ──
  {
    examName: "MITS Entrance",
    examFullName: "MITS Admission Test",
    officialUrl: "https://mfrits.ac.in/",
    applicationFee: "Contact university",
    mode: "Online / At campus",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts AP EAPCET, JEE Main scores",
    collegeCodes: ["MITS"],
  },

  // ── Siddhartha Academy / VR Siddhartha ──
  {
    examName: "SAHE Entrance",
    examFullName: "Siddhartha Academy Entrance Test",
    officialUrl: "https://www.vrsiddhartha.ac.in/",
    applicationFee: "Contact university",
    mode: "At campus",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts AP EAPCET, JEE Main scores",
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
      { phase: "Rolling", examDates: "Dates communicated after application", lastDateToApply: "Jan 20, 2026 (Round 1)" },
    ],
    alternateEntry: "Also accepts JEE Main, VITEEE, TS/AP EAPCET, MHT CET scores",
    counsellingNote: "Woxsen conducts its own admission process and counselling",
    collegeCodes: ["WOXN"],
  },

  // ── Malla Reddy University (MRUCET) ──
  {
    examName: "MRUCET",
    examFullName: "Malla Reddy University Common Entrance Test",
    officialUrl: "https://admissions.mallareddyuniversity.ac.in/",
    applicationFee: "Contact university",
    mode: "Online / At campus",
    duration: "2 hours",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM, minimum 60% aggregate",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts JEE Main, TS EAPCET scores. TS EAPCET admits exempted from MRUCET",
    counsellingNote: "Dual route: TS EAPCET counselling (govt fees) or university admission (university fees)",
    collegeCodes: ["MRDU"],
  },

  // ── SR University (SRUEE) ──
  {
    examName: "SRUEE",
    examFullName: "SR University Entrance Examination",
    officialUrl: "https://sru.edu.in/admission/",
    applicationFee: "Contact university",
    mode: "Online / At campus",
    duration: "2 hours",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts JEE Main, TS EAPCET scores",
    counsellingNote: "Dual route: TS EAPCET counselling (govt fees) or university admission (university fees)",
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
      { phase: "Rolling", examDates: "Dec 1, 2025 – Jun 30, 2026", lastDateToApply: "Jun 30, 2026", resultDate: "Same day as exam" },
    ],
    alternateEntry: "Also accepts JEE Main, AP EAPCET scores, and Merit in Sports",
    counsellingNote: "Dual route: AP EAPCET counselling (govt fees) or university admission (university fees)",
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
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts AP EAPCET, JEE Main scores",
    counsellingNote: "Scholarships up to ₹25 Lakhs based on AUET score",
    collegeCodes: ["AITS"],
  },

  // ── Audisankara Deemed University ──
  {
    examName: "Audisankara Entrance",
    examFullName: "Audisankara University Entrance Test",
    officialUrl: "https://www.audisankara.ac.in/",
    applicationFee: "Contact university",
    mode: "At campus",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts AP EAPCET, JEE Main scores",
    collegeCodes: ["AUDI"],
  },

  // ── Centurion University ──
  {
    examName: "CUTM Entrance",
    examFullName: "Centurion University Entrance Test",
    officialUrl: "https://cutm.ac.in/admissions/",
    applicationFee: "Contact university",
    mode: "Online",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry, English",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts JEE Main, AP EAPCET, OJEE scores",
    collegeCodes: ["CENT"],
  },

  // ── Gurunanak University ──
  {
    examName: "GNU Entrance",
    examFullName: "Gurunanak University Entrance Test",
    officialUrl: "https://www.gndu.ac.in/",
    applicationFee: "Contact university",
    mode: "At campus / Online",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts TS EAPCET, JEE Main scores",
    collegeCodes: ["GNKU"],
  },

  // ── Sreenidhi University ──
  {
    examName: "SNU Entrance",
    examFullName: "Sreenidhi University Entrance Test",
    officialUrl: "https://www.sreenidhi.edu.in/",
    applicationFee: "Contact university",
    mode: "At campus / Online",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts TS EAPCET, JEE Main scores",
    collegeCodes: ["SNDU"],
  },

  // ── MNR University ──
  {
    examName: "MNR Entrance",
    examFullName: "MNR University Entrance Test",
    officialUrl: "https://www.mnru.ac.in/",
    applicationFee: "Contact university",
    mode: "At campus",
    duration: "Contact university",
    subjects: "Mathematics, Physics, Chemistry",
    eligibility: "10+2 with PCM",
    phases: [
      { phase: "2026 Exam", examDates: "2026 (dates TBA)", lastDateToApply: "TBA" },
    ],
    alternateEntry: "Also accepts TS EAPCET, JEE Main scores",
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
      { phase: "Exam", examDates: "May 17, 2026 (Paper 1: 9 AM–12 PM, Paper 2: 2:30–5:30 PM)", lastDateToApply: "May 2, 2026" },
      { phase: "JoSAA Counselling", examDates: "Jun–Jul 2026 (multiple rounds)", lastDateToApply: "Jun 2, 2026 (registration opens)" },
    ],
    counsellingNote: "Admission through JoSAA (Joint Seat Allocation Authority) centralised counselling. Seat allotment in 5+ rounds based on JEE Advanced rank, category, and preferences.",
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
      { phase: "Session 1", examDates: "Jan 21–28, 2026", lastDateToApply: "Nov 2025", resultDate: "Feb 2026" },
      { phase: "Session 2", examDates: "Apr 2–8, 2026", lastDateToApply: "Feb 25, 2026", resultDate: "Apr 2026" },
      { phase: "JoSAA Counselling", examDates: "Jun–Jul 2026 (multiple rounds)", lastDateToApply: "Jun 2, 2026 (registration opens)" },
    ],
    counsellingNote: "Admission through JoSAA (Joint Seat Allocation Authority) centralised counselling. Best of Session 1 and Session 2 NTA scores is used. Seat allotment in 5+ rounds based on JEE Main All India Rank.",
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
      { phase: "JEE Main Session 2", examDates: "Apr 2–8, 2026", lastDateToApply: "Feb 25, 2026" },
      { phase: "CUET UG 2026", examDates: "May 11–31, 2026", lastDateToApply: "Mar 2026" },
      { phase: "UoH Counselling", examDates: "Jun–Jul 2026", lastDateToApply: "Post results" },
    ],
    counsellingNote: "BTech/MTech integrated programmes in CSE and Materials Engineering admit through JEE Main scores. Other integrated programmes use CUET UG scores. University conducts its own counselling after results.",
    collegeCodes: ["UOHE"],
  },
];

/** Look up the admission exam for a given college code */
export function getExamByCollegeCode(code: string): AdmissionExam | null {
  return ADMISSION_EXAMS.find(e => e.collegeCodes.includes(code)) || null;
}
