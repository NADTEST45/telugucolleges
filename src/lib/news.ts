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
  // ── New: April 12, 2026 ───────────────────────────────────────
  {
    id: "jee-main-2026-session-2-results-expected",
    date: "2026-04-12",
    title: "JEE Main 2026 Session 2 — Results Expected by April 20",
    summary: "JEE Main 2026 Session 2 exam concluded on April 9. Answer key released April 11. Final results and All India Ranks expected by April 20.",
    body: "JEE Main 2026 Session 2 has been completed successfully.\n\n• Exam conducted: April 2–9, 2026 (CBT mode)\n• Provisional answer key: Released April 11 at jeemain.nta.nic.in\n• Challenge window: Open until April 13, 2026\n• Final result & AIR: Expected by April 20, 2026\n\nSession 2 results will include JEE Advanced 2026 qualification cutoffs and final All India Ranks. Candidates who appeared in both sessions will be awarded the better of the two NTA scores.\n\nJEE Advanced 2026 registration opens April 23 (exam May 17). Top 2.5 lakh JEE Main qualifiers are eligible.\n\nFor AP/TS students — JEE Main scores are accepted by GITAM, KL University, SRM AP, and Vignan's for direct admission without separate entrance exams.",
    category: "general",
    state: "Both",
    priority: "high",
    source: "NTA",
    sourceUrl: "https://jeemain.nta.nic.in/",
    tags: ["JEE Main", "Session 2", "Results", "NTA", "JEE Advanced", "2026"],
  },
  {
    id: "jee-advanced-2026-registration-april-23",
    date: "2026-04-12",
    title: "JEE Advanced 2026 — Registration Opens April 23, Exam on May 17",
    summary: "JEE Advanced 2026 registration opens April 23. Exam scheduled for May 17 at IIT Dhanbad. Top 2.5 lakh JEE Main qualifiers eligible.",
    body: "JEE Advanced 2026, the gateway to all 23 IITs, has confirmed its schedule.\n\n• Registration opens: April 23, 2026\n• Registration closes: April 30, 2026\n• Admit card download: May 11, 2026\n• Exam date: May 17, 2026 (Paper 1: 9 AM–12 PM, Paper 2: 2 PM–5 PM)\n• Organizing institute: IIT (ISM) Dhanbad\n• Result: June 8, 2026\n\nEligibility: Top 2,50,000 candidates from JEE Main 2026 (across all categories). Candidates must have been born on or after October 1, 2001 (relaxation for reserved categories).\n\nIIT Hyderabad remains a top choice for AP/TS students. Architecture Aptitude Test (AAT) registration opens after JEE Advanced results.",
    category: "general",
    state: "Both",
    priority: "high",
    source: "JEE Advanced 2026",
    sourceUrl: "https://jeeadv.ac.in/",
    tags: ["JEE Advanced", "IIT", "Registration", "2026"],
  },
  {
    id: "tg-eapcet-2026-admit-cards-april",
    date: "2026-04-12",
    title: "TG EAPCET 2026 — Admit Cards: Agriculture April 23, Engineering April 27",
    summary: "TG EAPCET 2026 admit cards will be released on April 23 (Agriculture/Pharmacy) and April 27 (Engineering). Correction window has closed.",
    body: "TG EAPCET 2026 admit card schedule has been confirmed.\n\n• Agriculture/Pharmacy admit card: April 23, 2026\n• Engineering admit card: April 27, 2026\n• Download at: eapcet.tgche.ac.in\n• Application correction window: Closed (ended April 8)\n\nExam schedule:\n• Agriculture/Pharmacy: May 4–5, 2026\n• Engineering: May 9–11, 2026\n• Shifts: Morning (9 AM–12 PM) and Afternoon (3 PM–6 PM)\n• 160 MCQs for 160 marks, no negative marking\n\nLate registration is still open with progressive late fees (₹1,000 until April 25, ₹2,000 until April 28, ₹10,000 until May 2). Download admit cards using your registration number and date of birth.",
    category: "eapcet",
    state: "TS",
    priority: "high",
    source: "TGCHE / JNTU Hyderabad",
    sourceUrl: "https://eapcet.tgche.ac.in/",
    tags: ["TG EAPCET", "Admit Card", "2026"],
  },
  {
    id: "ts-ecet-2026-last-date-april-18",
    date: "2026-04-12",
    title: "TS ECET 2026 — Last Date to Apply April 18, Lateral Entry Exam May 15",
    summary: "TS ECET 2026 for lateral entry into B.Tech/B.Pharm has a registration deadline of April 18. Exam scheduled for May 15.",
    body: "Telangana State Engineering Common Entrance Test (TS ECET) 2026 for lateral entry admissions is approaching its deadline.\n\n• Last date to apply (without late fee): April 18, 2026\n• Exam date: May 15, 2026\n• Eligibility: Diploma holders and B.Sc graduates seeking lateral entry into B.Tech/B.Pharm second year\n• Official website: ecet.tsche.ac.in\n\nTS ECET is conducted by Kakatiya University on behalf of TSCHE. This is the primary pathway for diploma holders in Telangana to enter engineering degree programs directly in the second year.\n\nCandidates should ensure all documents are ready for verification during counselling (expected July–August 2026).",
    category: "general",
    state: "TS",
    priority: "medium",
    source: "TSCHE",
    sourceUrl: "https://ecet.tsche.ac.in/",
    tags: ["TS ECET", "Lateral Entry", "2026", "Diploma"],
  },
  {
    id: "ap-icet-2026-admit-card-released",
    date: "2026-04-12",
    title: "AP ICET 2026 — Admit Card Released, Exam on May 2",
    summary: "AP ICET 2026 admit cards are now available for download. The MBA/MCA entrance exam is scheduled for May 2, 2026.",
    body: "AP ICET 2026 admit cards have been released for download.\n\n• Admit card available at: cets.apsche.ap.gov.in/ICET\n• Exam date: May 2, 2026\n• Download using: Registration number + date of birth\n• Late fee registration: Closed (final deadline was April 5)\n\nAP ICET is the entrance test for MBA and MCA admissions in all AP-affiliated universities and colleges. Candidates should download and print their admit cards well in advance.\n\nEnsure you carry a valid photo ID along with the admit card to the exam centre. Check the venue details on your admit card and plan your travel accordingly.",
    category: "general",
    state: "AP",
    priority: "medium",
    source: "APSCHE",
    sourceUrl: "https://cets.apsche.ap.gov.in/ICET/",
    tags: ["AP ICET", "MBA", "MCA", "Admit Card", "2026"],
  },
  {
    id: "ap-pgecet-2026-exam-april-29-30",
    date: "2026-04-12",
    title: "AP PGECET 2026 — Exam on April 29–30 for M.Tech/M.Pharm Admissions",
    summary: "AP PGECET 2026 exam is scheduled for April 29–30. Admit cards expected shortly for M.Tech, M.Pharm, and M.Arch aspirants.",
    body: "AP Post Graduate Engineering Common Entrance Test (AP PGECET) 2026 is just weeks away.\n\n• Exam dates: April 29–30, 2026\n• Mode: Computer Based Test (CBT)\n• For admissions to: M.E/M.Tech, M.Pharm, M.Arch, Pharm.D (PB)\n• Conducted by: Sri Krishnadevaraya University on behalf of APSCHE\n• Admit cards: Expected mid-April at cets.apsche.ap.gov.in\n\nThis exam is for B.Tech/B.E. graduates seeking postgraduate engineering education in Andhra Pradesh. Qualifying AP PGECET along with a valid GATE score improves chances during counselling.\n\nCounselling is expected in July–August 2026 along with AP EAPCET counselling.",
    category: "general",
    state: "AP",
    priority: "low",
    source: "APSCHE",
    sourceUrl: "https://cets.apsche.ap.gov.in/",
    tags: ["AP PGECET", "M.Tech", "M.Pharm", "2026"],
  },
  // ── Updated: March 26, 2026 ────────────────────────────────────
  {
    id: "ap-eapcet-2026-correction-window-open",
    date: "2026-03-26",
    title: "AP EAPCET 2026 — Application Correction Window Closed, Admit Cards April 28",
    summary: "The AP EAPCET 2026 correction window (March 26–28) has closed. Next milestone: admit card download from April 28.",
    body: "The AP EAPCET 2026 application form correction window has closed.\n\n• Correction window: March 26–28, 2026 (closed)\n• Status: All corrections finalized\n\nUpcoming key dates:\n• Admit card download: April 28, 2026 onwards at cets.apsche.ap.gov.in\n• Engineering exam: May 12, 13, 14, 15 & 18, 2026\n• Agriculture/Pharmacy exam: May 19 & 20, 2026\n• Result: June 1, 2026\n\nCandidates should now focus on exam preparation. Admit cards will be downloadable using registration number or payment reference ID, qualifying exam hall ticket number, and date of birth.",
    category: "eapcet",
    state: "AP",
    priority: "high",
    source: "APSCHE",
    sourceUrl: "https://cets.apsche.ap.gov.in/EAPCET/",
    tags: ["AP EAPCET", "Correction Window", "Admit Card", "2026"],
  },
  {
    id: "tg-eapcet-2026-registration-deadline-april-4",
    date: "2026-03-26",
    title: "TG EAPCET 2026 — Registration Closed, Late Fee Window Still Open",
    summary: "TG EAPCET 2026 regular registration (April 4) has closed. Late fee applications still accepted until May 2. Correction window ended April 8.",
    body: "TG EAPCET (formerly TS EAMCET) 2026 registration update.\n\n• Regular deadline (April 4): Closed\n• Form correction window (April 6–8): Closed\n• Late fee registration: Still open (₹1,000 until April 25, ₹2,000 until April 28, ₹10,000 until May 2)\n• Official website: eapcet.tgche.ac.in\n\nExam schedule:\n• Agriculture/Pharmacy: May 4–5, 2026\n• Engineering: May 9–11, 2026\n• Admit cards: Agriculture April 23 | Engineering April 27\n\nThe exam will have 160 MCQs for 160 marks with no negative marking. Two shifts per day — 9 AM to 12 PM and 3 PM to 6 PM.",
    category: "eapcet",
    state: "TS",
    priority: "high",
    source: "TGCHE / JNTU Hyderabad",
    sourceUrl: "https://eapcet.tgche.ac.in/",
    tags: ["TG EAPCET", "TS EAMCET", "Registration", "Late Fee", "2026"],
  },
  {
    id: "jee-main-2026-session-2-april",
    date: "2026-03-26",
    title: "JEE Main 2026 Session 2 — Exam Completed, Results Expected April 20",
    summary: "JEE Main 2026 Session 2 was conducted April 2–9. Answer key released April 11. Results and AIR expected by April 20.",
    body: "JEE Main 2026 Session 2 has been completed.\n\n• Exam conducted: April 2–9, 2026 (CBT mode)\n• Answer key: Released April 11 at jeemain.nta.nic.in\n• Result: Expected by April 20, 2026\n\nSession 2 results will include JEE Advanced 2026 qualification cutoffs and All India Ranks. Candidates who appeared in both sessions will be awarded the better of the two NTA scores.\n\nJEE Advanced 2026: Registration opens April 23, exam on May 17.\n\nFor students targeting AP/TS private and deemed universities — JEE Main scores are accepted by GITAM (GAT waiver), KL University, SRM AP, and Vignan's (V-SAT waiver) for direct admission.",
    category: "general",
    state: "Both",
    priority: "high",
    source: "NTA",
    sourceUrl: "https://jeemain.nta.nic.in/",
    tags: ["JEE Main", "Session 2", "NTA", "Results", "2026"],
  },
  {
    id: "ap-icet-2026-late-fee-deadline-march-26",
    date: "2026-03-26",
    title: "AP ICET 2026 — Registration Closed, Admit Card Now Available",
    summary: "AP ICET 2026 registration has closed (final deadline April 5). Admit cards are now available for download. Exam on May 2.",
    body: "AP ICET 2026 (for MBA/MCA admissions) registration is now closed.\n\n• Regular deadline: Closed (March 23)\n• Final late fee deadline (₹10,000): Closed (April 5)\n• Admit card: Now available at cets.apsche.ap.gov.in/ICET\n• Exam date: May 2, 2026\n\nCandidates who registered should download their admit cards immediately. Carry a valid photo ID along with the printed admit card to the exam centre.\n\nAP ICET is conducted by APSCHE for admission to MBA and MCA programs in AP-affiliated universities and colleges.",
    category: "general",
    state: "AP",
    priority: "medium",
    source: "APSCHE",
    sourceUrl: "https://cets.apsche.ap.gov.in/ICET/",
    tags: ["AP ICET", "MBA", "MCA", "Admit Card", "2026"],
  },
  // ── Updated: March 17, 2026 ────────────────────────────────────
  {
    id: "ap-eapcet-2026-result-admit-card-dates",
    date: "2026-03-17",
    title: "AP EAPCET 2026 — Result on June 1, Admit Card Available April 28",
    summary: "JNTU Kakinada has confirmed that AP EAPCET 2026 results will be declared on June 1, 2026. Admit cards will be available for download from April 28.",
    body: "Key upcoming dates for AP EAPCET 2026 candidates:\n\n• Application form correction window: March 26–28, 2026 (closed)\n• Admit card download: April 28, 2026 onwards at cets.apsche.ap.gov.in\n• Engineering exam: May 12, 13, 14, 15 & 18, 2026\n• Agriculture/Pharmacy exam: May 19 & 20, 2026\n• Result declaration: June 1, 2026\n\nCandidates can download their hall tickets using registration number or payment reference ID, qualifying exam hall ticket number, and date of birth. Keep the admit card safe — it is required throughout the admission process.\n\nNote: AP EAPCET 2026 application fees have been revised to ₹800 (General), ₹750 (BC), ₹700 (SC/ST) — a ₹200 increase across all categories.",
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
    title: "IIIT Hyderabad UGEE 2026 — Registration Closed, Exam on May 2",
    summary: "IIIT Hyderabad UGEE 2026 registration closed March 31. The entrance exam will be held on May 2.",
    body: "The International Institute of Information Technology, Hyderabad (IIIT-H) UGEE 2026 registration has closed.\n\n• Registration: Closed (deadline was March 31, 2026)\n• Exam date: May 2, 2026 (9:00 AM – 12:00 Noon)\n• Interview dates: June 4–6, 2026 (on campus)\n\nIIIT Hyderabad is one of the top CS/IT institutions in India. Admission is through UGEE scores + JEE Mains marks + interview. Registered candidates should prepare for the upcoming exam.\n\nCheck ugadmissions.iiit.ac.in for admit card updates.",
    category: "general",
    state: "TS",
    priority: "medium",
    source: "IIIT Hyderabad",
    sourceUrl: "https://ugadmissions.iiit.ac.in/ugee/",
    tags: ["IIIT Hyderabad", "UGEE", "Exam", "2026"],
  },
  {
    id: "gitam-gat-2026-march-phase",
    date: "2026-03-17",
    title: "GITAM GAT 2026 — March Phase Completed, Further Phases Available",
    summary: "GITAM GAT 2026 March phase exam (March 29) has been completed. Further admission phases are available throughout 2026.",
    body: "GITAM (Gandhi Institute of Technology and Management) GAT 2026 March phase has been completed.\n\n• March phase exam: Completed (March 29, 2026)\n• Results: Announced on the day of the exam\n• Campuses: Visakhapatnam (AP), Hyderabad (TS), Bengaluru\n\nGITAM conducts GAT in multiple phases throughout the admission season. Students who missed the March phase can register for upcoming phases at apply.gitam.edu.\n\nGITAM is a Deemed University with NAAC A++ accreditation, offering B.Tech programs across multiple branches. JEE Main score holders may be eligible for GAT waiver — check the GITAM admissions portal for details.",
    category: "general",
    state: "Both",
    priority: "low",
    source: "GITAM University",
    sourceUrl: "https://apply.gitam.edu/",
    tags: ["GITAM", "GAT", "Admission", "2026", "Visakhapatnam", "Hyderabad"],
  },
  {
    id: "bitsat-2026-registration-deadline",
    date: "2026-03-17",
    title: "BITSAT 2026 — Session 1 Completed, Session 2 Registration Open",
    summary: "BITSAT 2026 Session 1 (April 15–16) has been completed. Session 2 registration is open until May 2, exam on May 24–26.",
    body: "BITS Pilani BITSAT 2026 Session 1 has been completed.\n\n• Session 1 exam: Completed (April 15–16, 2026)\n• Admit cards for Session 1: Were released April 10\n• Session 2 registration: Open until May 2, 2026\n• Session 2 exam: May 24–26, 2026\n\nMajor update: Starting with the 2026–27 academic year, BITS Pilani has introduced tuition-blind admissions for the top 500 BITSAT rank holders, offering a four-year scholarship covering full tuition fees.\n\nStudents who missed Session 1 can still register for Session 2. BITS Pilani Hyderabad campus is a top choice for AP and TS engineering aspirants. Apply at admissions.bits-pilani.ac.in.",
    category: "general",
    state: "Both",
    priority: "medium",
    source: "BITS Pilani Admissions",
    sourceUrl: "https://admissions.bits-pilani.ac.in/",
    tags: ["BITSAT", "BITS Pilani", "Session 2", "Registration", "Scholarship", "2026"],
  },
  {
    id: "viteee-srmjeee-2026-deadlines",
    date: "2026-03-17",
    title: "VITEEE 2026 Exam Underway, SRMJEEE Phase 1 Revised to April 24–29",
    summary: "VITEEE 2026 registration closed April 12. Exam runs April 28–May 3. SRMJEEE Phase 1 revised to April 24–29.",
    body: "Updates on two major private university entrance exams:\n\nVITEEE 2026 (VIT Vellore, Chennai, AP-Amaravati, Bhopal):\n• Registration: Closed (extended deadline was April 12, 2026)\n• Exam dates: April 28 – May 3, 2026 (slot-based online)\n• VIT-AP (Amaravati) campus is relevant for AP students\n• Slot booking in progress at viteee.vit.ac.in\n\nSRMJEEE 2026 (SRM University):\n• Phase 1 exam: Revised to April 24–29, 2026 (remote proctored, home-based)\n• Phase 2: June 10–15 | Phase 3: July 4–5\n• No negative marking. Application fee: ₹1,400 per phase\n• Apply at applications.srmist.edu.in/btech\n\nBoth VIT and SRM are popular choices for AP/TS students seeking private university B.Tech admissions.",
    category: "general",
    state: "Both",
    priority: "medium",
    source: "VIT / SRM Official",
    sourceUrl: "https://viteee.vit.ac.in/",
    tags: ["VITEEE", "SRMJEEE", "VIT", "SRM", "Exam", "2026"],
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
