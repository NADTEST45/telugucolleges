export interface NewsItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  summary: string;
  body: string; // HTML-safe plain text with line breaks
  category: "eapcet" | "fees" | "counselling" | "naac-nirf" | "general";
  state: "AP" | "TS" | "Both";
  priority: "high" | "medium" | "low";
  source?: string;
  sourceUrl?: string;
  tags: string[];
}

export const NEWS_ITEMS: NewsItem[] = [
  // ── New: March 17, 2026 ────────────────────────────────────────
  {
    id: "ap-eapcet-2026-result-admit-card-dates",
    date: "2026-03-17",
    title: "AP EAPCET 2026 — Result on June 1, Admit Card Available April 28",
    summary: "JNTU Kakinada has confirmed that AP EAPCET 2026 results will be declared on June 1, 2026. Admit cards will be available for download from April 28.",
    body: "Key upcoming dates for AP EAPCET 2026 candidates:\n\n• Application form correction window: March 26–28, 2026\n• Admit card download: April 28, 2026 onwards at cets.apsche.ap.gov.in\n• Engineering exam: May 12, 13, 14, 15 & 18, 2026\n• Agriculture/Pharmacy exam: May 19 & 20, 2026\n• Result declaration: June 1, 2026\n\nCandidates can download their hall tickets using registration number or payment reference ID, qualifying exam hall ticket number, and date of birth. Keep the admit card safe — it is required throughout the admission process.\n\nNote: AP EAPCET 2026 application fees have been revised to ₹800 (General), ₹750 (BC), ₹700 (SC/ST) — a ₹200 increase across all categories.",
    category: "eapcet",
    state: "AP",
    priority: "high",
    source: "APSCHE Official Notification",
    sourceUrl: "https://cets.apsche.ap.gov.in/EAPCET/",
    tags: ["AP EAPCET", "Result Date", "Admit Card", "2026"],
  },
  {
    id: "iiit-hyderabad-ugee-2026-registration",
    date: "2026-03-17",
    title: "IIIT Hyderabad UGEE 2026 — Apply by March 31, Exam on May 2",
    summary: "IIIT Hyderabad has opened UGEE 2026 registration. Last date to apply is March 31, 2026. The entrance exam will be held on May 2.",
    body: "The International Institute of Information Technology, Hyderabad (IIIT-H) has opened applications for the Undergraduate Entrance Examination (UGEE) 2026.\n\n• Registration open since: February 11, 2026\n• Last date to apply: March 31, 2026\n• Exam date: May 2, 2026 (9:00 AM – 12:00 Noon)\n• Interview dates: June 4–6, 2026 (on campus)\n• Application fee: ₹3,100 (male), ₹1,550 (female)\n\nIIIT Hyderabad is one of the top CS/IT institutions in India. Admission is through UGEE scores + JEE Mains marks + interview. Apply at ugadmissions.iiit.ac.in.",
    category: "general",
    state: "TS",
    priority: "medium",
    source: "IIIT Hyderabad",
    sourceUrl: "https://ugadmissions.iiit.ac.in/ugee/",
    tags: ["IIIT Hyderabad", "UGEE", "Registration", "2026"],
  },
  {
    id: "gitam-gat-2026-march-phase",
    date: "2026-03-17",
    title: "GITAM GAT 2026 — Apply by March 25, Phase Exam on March 29",
    summary: "GITAM Admission Test (GAT) 2026 current phase deadline is March 25. Exam scheduled for March 29 at Visakhapatnam, Hyderabad & Bengaluru campuses.",
    body: "GITAM (Gandhi Institute of Technology and Management) has opened applications for the current phase of GAT 2026.\n\n• Last date to apply (current phase): March 25, 2026\n• Exam date: March 29, 2026\n• Results: Announced on the day of the exam itself\n• Campuses: Visakhapatnam (AP), Hyderabad (TS), Bengaluru\n\nGITAM is a Deemed University with NAAC A++ accreditation, offering B.Tech programs across multiple branches. GAT is the gateway for admission to all GITAM campuses. Apply at apply.gitam.edu.",
    category: "general",
    state: "Both",
    priority: "medium",
    source: "GITAM University",
    sourceUrl: "https://apply.gitam.edu/",
    tags: ["GITAM", "GAT", "Admission", "2026", "Visakhapatnam", "Hyderabad"],
  },
  {
    id: "bitsat-2026-registration-deadline",
    date: "2026-03-17",
    title: "BITSAT 2026 — Apply by March 19, Tuition-Blind Admissions for Top 500",
    summary: "BITS Pilani has extended BITSAT 2026 registration to March 19. New tuition-blind admissions policy offers full scholarship to top 500 rank holders.",
    body: "BITS Pilani has extended the BITSAT 2026 Session 1 registration deadline to March 19, 2026.\n\n• Session 1 exam: April 15–17, 2026\n• Session 1 slot booking: March 27–31, 2026\n• Session 2 registration: April 20 – May 2, 2026\n• Session 2 exam: May 24–26, 2026\n\nMajor update: Starting with the 2026–27 academic year, BITS Pilani has introduced tuition-blind admissions for the top 500 BITSAT rank holders, offering a four-year scholarship covering full tuition fees.\n\nBITS Pilani Hyderabad campus is a top choice for AP and TS engineering aspirants. Apply at admissions.bits-pilani.ac.in.",
    category: "general",
    state: "Both",
    priority: "medium",
    source: "BITS Pilani Admissions",
    sourceUrl: "https://admissions.bits-pilani.ac.in/",
    tags: ["BITSAT", "BITS Pilani", "Registration", "Scholarship", "2026"],
  },
  {
    id: "viteee-srmjeee-2026-deadlines",
    date: "2026-03-17",
    title: "VITEEE & SRMJEEE 2026 — Registration Deadlines Approaching",
    summary: "VITEEE 2026 registration closes March 31 (exam April 23–May 3). SRMJEEE Phase 1 deadline is April 16 (exam April 23–28).",
    body: "Two major private university entrance exams have upcoming registration deadlines:\n\nVITEEE 2026 (VIT Vellore, Chennai, AP-Amaravati, Bhopal):\n• Registration deadline: March 31, 2026\n• Exam dates: April 23 – May 3, 2026 (slot-based online)\n• VIT-AP (Amaravati) campus is relevant for AP students\n• Apply at viteee.vit.ac.in\n\nSRMJEEE 2026 (SRM University):\n• Phase 1 registration deadline: April 16, 2026\n• Phase 1 exam: April 23–28, 2026 (remote proctored, home-based)\n• Phase 2: June 10–15 | Phase 3: July 4–5\n• No negative marking. Application fee: ₹1,400 per phase\n• Apply at applications.srmist.edu.in/btech\n\nBoth VIT and SRM are popular choices for AP/TS students seeking private university B.Tech admissions.",
    category: "general",
    state: "Both",
    priority: "low",
    source: "VIT / SRM Official",
    sourceUrl: "https://viteee.vit.ac.in/",
    tags: ["VITEEE", "SRMJEEE", "VIT", "SRM", "Registration", "2026"],
  },

  // ── EAPCET 2026 ──────────────────────────────────────────────
  {
    id: "ap-eapcet-2026-deadline",
    date: "2026-03-17",
    title: "AP EAPCET 2026 — Last Date Extended Again to March 24 (No Late Fee)",
    summary: "APSCHE has extended the AP EAPCET 2026 registration deadline once more — apply without late fee by March 24, 2026.",
    body: "The Andhra Pradesh State Council of Higher Education (APSCHE) has extended the last date for AP EAPCET 2026 registration without late fee to March 24, 2026. This is the second extension (previously March 17).\n\nRevised late fee schedule:\n• ₹1,000 late fee: by March 28\n• ₹2,000 late fee: by April 1\n• ₹4,000 late fee: by April 6\n• ₹10,000 late fee: by April 10\n• Correction window: April 11–13\n\nApplication fee: ₹800 (General), ₹750 (BC), ₹700 (SC/ST). The exam is conducted by JNTU Kakinada on behalf of APSCHE. Apply at cets.apsche.ap.gov.in/EAPCET.",
    category: "eapcet",
    state: "AP",
    priority: "high",
    source: "APSCHE Official Notification",
    sourceUrl: "https://cets.apsche.ap.gov.in/EAPCET/",
    tags: ["AP EAPCET", "Registration", "Deadline", "2026"],
  },
  {
    id: "ap-eapcet-2026-exam-dates",
    date: "2026-02-04",
    title: "AP EAPCET 2026 Exam Dates Announced — Engineering: May 12–18",
    summary: "APSCHE has released the full AP EAPCET 2026 schedule. Engineering exam on May 12, 13, 14, 15 & 18. Agriculture/Pharmacy on May 19 & 20.",
    body: "The AP-CETs 2026 notification was issued on February 3, 2026 by the Secretary of APSCHE, Guntur. AP EAPCET (APEAPCET) 2026 for Engineering will be conducted by JNTU Kakinada on May 12, 13, 14, 15, and 18, 2026. The Agriculture & Pharmacy stream exam (APECET) will be conducted by JNTU Anantapur on April 23, 2026.\n\nAll AP CETs 2026 will be conducted through Computer Based Test (CBT) mode. Registration opened February 4, 2026.\n\nOther AP CETs: APICET (May 2), APPGECET (April 28–30), APLAWCET (May 4), APEDCET (May 4), APPGCET (May 8–11), APPECET (June 3).",
    category: "eapcet",
    state: "AP",
    priority: "high",
    source: "APSCHE Official Notification (03.02.2026)",
    sourceUrl: "https://cets.apsche.ap.gov.in/EAPCET/",
    tags: ["AP EAPCET", "Exam Dates", "2026", "AP CETs"],
  },
  {
    id: "ts-eapcet-2026-registration",
    date: "2026-02-19",
    title: "TG EAPCET 2026 Registration Open — Apply by April 4 Without Late Fee",
    summary: "Telangana EAPCET 2026 application forms are live. Last date without late fee is April 4, 2026. Exam: May 4–11.",
    body: "JNTU Hyderabad, on behalf of TGCHE, has opened online registration for TG EAPCET 2026 from February 19, 2026. Candidates can apply without late fee until April 4, 2026.\n\nLate fee schedule: ₹250 (by April 10), ₹500 (by April 15), ₹2,500 (by April 20), ₹5,000 (by April 24), ₹10,000 (by May 2).\n\nApplication fee: ₹900 (General, single stream), ₹1,800 (both streams), ₹500/₹1,000 (SC/ST/PH).\n\nExam dates — Agriculture & Pharmacy: May 4–5; Engineering: May 9–11 (two shifts per day: 9 AM–12 PM and 3–6 PM).\n\nApply at eapcet.tgche.ac.in.",
    category: "eapcet",
    state: "TS",
    priority: "high",
    source: "TGCHE / JNTUH Official Notification",
    sourceUrl: "https://eapcet.tgche.ac.in/",
    tags: ["TS EAPCET", "TG EAPCET", "Registration", "2026"],
  },
  {
    id: "ts-eapcet-2026-marks-vs-rank",
    date: "2026-02-19",
    title: "TG EAPCET 2026 — Marks vs Rank Band Reference (2024 & 2025 Data)",
    summary: "Official normalization marks vs rank band data released for TG EAPCET 2026 based on 2024 and 2025 performance.",
    body: "The TG EAPCET 2026 convener has published marks-vs-rank reference tables based on TG EAPCET 2024 and 2025 data.\n\nEngineering (2025): 80+ marks → below rank 2,613 | 75+ → 2,614–3,995 | 70+ → 3,996–6,104 | 65+ → 6,105–9,226 | 60+ → 9,227–14,418 | 55+ → 14,419–24,028 | 50+ → 24,029–44,121 | 45+ → 44,122–82,343 | 40+ → 82,344–1,35,462.\n\nAgriculture & Pharmacy (2025): 80+ → below 2,726 | 70+ → 4,629–7,182 | 60+ → 10,537–15,011 | 50+ → 21,745–32,151 | 40+ → 46,573–61,764.\n\nNote: These are based on normalized marks out of 160.",
    category: "eapcet",
    state: "TS",
    priority: "medium",
    source: "TG EAPCET 2026 Convener",
    sourceUrl: "https://eapcet.tgche.ac.in/",
    tags: ["TS EAPCET", "Marks vs Rank", "Reference", "2026"],
  },

  // ── Counselling & Admissions ──────────────────────────────────
  {
    id: "ap-eapcet-2026-counselling-preview",
    date: "2026-03-14",
    title: "AP EAPCET 2026 Counselling Expected July 2026 — What to Expect",
    summary: "AP EAPCET 2026 counselling is expected to begin in the first week of July 2026 with 2 rounds of web counselling.",
    body: "Based on previous years' schedules, AP EAPCET 2026 counselling is expected to start in the 1st week of July 2026. The process will include:\n\n1. Online registration and slot booking\n2. Certificate verification at designated Help Line Centers\n3. Web options entry (choosing colleges and branches)\n4. Seat allotment (2 rounds + spot round)\n5. Reporting to allotted college\n\nCounselling registration fee: ₹1,200 (OC/BC), ₹600 (SC/ST).\n\nCategory-A (Convener Quota): ~70% of seats filled via APSCHE counselling.\nCategory-B (Management Quota): ~30% — fees regulated by APHERMC.",
    category: "counselling",
    state: "AP",
    priority: "low",
    source: "APSCHE",
    sourceUrl: "https://cets.apsche.ap.gov.in/EAPCET/",
    tags: ["Counselling", "AP EAPCET", "2026", "Admissions"],
  },
  {
    id: "ts-eapcet-2026-counselling-preview",
    date: "2026-03-14",
    title: "TS EAPCET 2026 Counselling Expected July–August 2026",
    summary: "Telangana EAPCET counselling typically runs July–August with 3 rounds + 1 special round.",
    body: "TS EAPCET 2026 counselling is expected to begin in July 2026, running through August. Based on previous years:\n\n• 3 regular rounds + 1 special round\n• Convener quota: 70% of seats filled via TSCHE web counselling\n• Minimum qualifying marks: 25% (40 out of 160)\n• Registration fee: ₹1,200 (unreserved), ₹600 (reserved categories)\n\nCounselling will be conducted through the TSCHE website. Candidates need to register, verify documents, enter web options, and report to allotted college within the specified timeline.\n\nFee regulation: TS AFRC (block period system, currently 2025–28 per G.O. Ms. No. 06).",
    category: "counselling",
    state: "TS",
    priority: "low",
    source: "TSCHE",
    sourceUrl: "https://eapcet.tgche.ac.in/",
    tags: ["Counselling", "TS EAPCET", "2026", "Admissions"],
  },

  // ── Other CETs ────────────────────────────────────────────────
  {
    id: "tg-pgecet-2026",
    date: "2026-02-27",
    title: "TG PGECET 2026 Applications Open — M.Tech, M.Pharm, M.Arch Admissions",
    summary: "Applications for Telangana PGECET 2026 (M.E/M.Tech, M.Pharm, M.Arch, Pharm.D) are open from February 27 for AY 2026–27.",
    body: "The Telangana Post Graduate Engineering Common Entrance Test (TG PGECET) 2026 applications have opened from February 27, 2026, for admissions into M.E/M.Tech, M.Pharm, M.Arch, and Pharm.D courses for the 2026–27 academic year.\n\nThis is relevant for students who have completed their B.Tech/B.E. and are looking to pursue higher education in Telangana.",
    category: "general",
    state: "TS",
    priority: "low",
    source: "TGCHE",
    sourceUrl: "https://eapcet.tgche.ac.in/",
    tags: ["PGECET", "M.Tech", "Telangana", "2026"],
  },
  {
    id: "ap-ecet-2026",
    date: "2026-03-14",
    title: "AP ECET 2026 — Lateral Entry Engineering Applications Open",
    summary: "AP ECET 2026 applications are open for lateral entry admissions into engineering and pharmacy programs.",
    body: "Applications for AP ECET (Engineering Common Entrance Test) 2026 are open for diploma holders and B.Sc degree holders seeking lateral entry into B.Tech/B.Pharm second year. This is conducted by Acharya Nagarjuna University on behalf of APSCHE.\n\nPhysical Efficiency and Games Skill Test commences on June 3, 2026. Registration started February 13, 2026.",
    category: "general",
    state: "AP",
    priority: "low",
    source: "APSCHE",
    sourceUrl: "https://cets.apsche.ap.gov.in/",
    tags: ["AP ECET", "Lateral Entry", "2026"],
  },

  // ── NAAC / NIRF ───────────────────────────────────────────────
  {
    id: "nirf-naac-2026-status",
    date: "2026-03-14",
    title: "NIRF 2026 Rankings & NAAC Updates — Not Yet Released",
    summary: "NIRF 2026 rankings are expected later in 2026. No new NAAC accreditations for AP/TS colleges announced yet.",
    body: "As of March 14, 2026:\n\n• NIRF 2026 rankings have NOT been released yet. Expected mid-to-late 2026.\n• NAAC A++ updated list for 2026 is expected around August 2026 — no new cycle completions announced.\n• No new NAAC accreditations specifically for AP or TS engineering colleges were found.\n• Notable existing: Andhra University holds NAAC A++ grade. NALSAR (Hyderabad) holds NAAC A++ (CGPA 3.52).\n\nTeluguColleges.com NAAC data reflects the latest available grades.",
    category: "naac-nirf",
    state: "Both",
    priority: "low",
    source: "NAAC / NIRF",
    tags: ["NIRF", "NAAC", "Rankings", "2026"],
  },
];

// Helper to get the latest N news items
export function getLatestNews(n: number = 10): NewsItem[] {
  return [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

// Helper to filter by state
export function getNewsByState(state: "AP" | "TS" | "Both"): NewsItem[] {
  return NEWS_ITEMS.filter(n => n.state === state || n.state === "Both")
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Helper to filter by category
export function getNewsByCategory(category: NewsItem["category"]): NewsItem[] {
  return NEWS_ITEMS.filter(n => n.category === category)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Category metadata
export const NEWS_CATEGORIES: { key: NewsItem["category"]; label: string; color: string; bgColor: string }[] = [
  { key: "eapcet", label: "EAPCET 2026", color: "text-blue-700", bgColor: "bg-blue-50" },
  { key: "counselling", label: "Counselling", color: "text-purple-700", bgColor: "bg-purple-50" },
  { key: "naac-nirf", label: "NAAC / NIRF", color: "text-amber-700", bgColor: "bg-amber-50" },
  { key: "general", label: "General", color: "text-gray-700", bgColor: "bg-gray-100" },
];
