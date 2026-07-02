/**
 * Shared JSON-LD + FAQ builders for the five /colleges/[slug] page modules
 * (profile, cutoff, fees, placement, admission).
 *
 * SERVER-ONLY: imported by the page server components. Never import this
 * from a "use client" file — it pulls medical-admission data and the full
 * College type machinery along.
 *
 * The five pages previously each defined their own buildJsonLd/generateFAQs
 * copies. The logic is deduplicated here, parameterized by page type, while
 * keeping every per-page difference intact (different FAQ sets/order,
 * different JSON-LD shapes per subpage). Output is byte-identical to the
 * old per-page implementations.
 */
import type { College } from "@/lib/colleges";
import { fmtFee } from "@/lib/format";
import { isMedicalCollege, getMedicalAdmission, type MedicalAdmissionInfo } from "@/lib/medical-admission";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export type FAQItem = { question: string; answer: string };

export type CollegePageType = "profile" | "cutoff" | "fees" | "placement" | "admission";

/* ────────────────────────── JSON-LD builders ────────────────────────── */

/** Map internal branch codes to human-readable names for Course schema */
const BRANCH_NAME_MAP: Record<string, string> = {
  CSE: "Computer Science and Engineering",
  ECE: "Electronics and Communication Engineering",
  EEE: "Electrical and Electronics Engineering",
  MECH: "Mechanical Engineering",
  CIVIL: "Civil Engineering",
  IT: "Information Technology",
  "AI&ML": "Artificial Intelligence and Machine Learning",
  "AI&DS": "Artificial Intelligence and Data Science",
  DS: "Data Science",
  CYS: "Cyber Security",
  AERO: "Aeronautical Engineering",
  "B.Pharm": "Bachelor of Pharmacy",
  "Pharm.D": "Doctor of Pharmacy",
};
const branchFullName = (b: string): string => BRANCH_NAME_MAP[b] ?? b;

/**
 * Profile page: CollegeOrUniversity + Course schema in a single @graph.
 *
 * Why a @graph with CollegeOrUniversity + Course entries?
 *  - CollegeOrUniversity is a more specific subtype of EducationalOrganization
 *    that Google understands for Knowledge Panel-style rich results on
 *    branded queries ("VNR VJIET", "GITAM Vizag").
 *  - Course is the schema Google prefers for individual programmes (over the
 *    older EducationalOccupationalProgram), with first-class support for
 *    courseMode, courseWorkload, and provider linkage.
 *  - Emitting both in a single @graph (rather than two scripts) lets each
 *    Course reference the college via @id, so crawlers join them as one
 *    knowledge graph rather than two unrelated entities.
 */
function buildProfileJsonLd(c: College) {
  const url = `${SITE_URL}/colleges/${c.slug}`;
  const collegeId = `${url}#college`;

  const college: Record<string, unknown> = {
    "@type": "CollegeOrUniversity",
    "@id": collegeId,
    name: c.name,
    alternateName: c.code,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.district,
      addressRegion: c.state,
      addressCountry: "IN",
    },
    foundingDate: String(c.year),
  };

  // Affiliation (university the college is affiliated to). Skip when the
  // college *is* a university (Deemed / Private University) — affiliation
  // would point at itself.
  if (c.affiliation && c.type !== "Deemed University" && c.type !== "Private University") {
    college.parentOrganization = {
      "@type": "EducationalOrganization",
      name: c.affiliation,
    };
  }

  // Accreditation
  if (c.naac && c.naac !== "-") {
    college.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "NAAC Accreditation",
      name: `NAAC Grade ${c.naac}`,
    };
  }

  // Fee as priceRange (Google uses this for rich results)
  if (c.fee > 0) {
    college.priceRange = `₹${c.fee.toLocaleString("en-IN")}/year`;
  }

  // Per-branch Course entries (one Course per offered branch).
  // Each Course points back at the college via provider @id, so crawlers
  // can attribute the course to the institution without duplicating
  // address/credential data.
  const courses = c.branches.map(b => {
    const fullName = branchFullName(b);
    const courseUrl = `${url}#course-${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const isPharma = b === "B.Pharm" || b === "Pharm.D";
    const programName = isPharma ? fullName : `B.Tech in ${fullName}`;
    const description = isPharma
      ? `${fullName} programme offered at ${c.name}, ${c.district}, ${c.state}.`
      : `Four-year B.Tech programme in ${fullName} at ${c.name}, affiliated to ${c.affiliation}.`;

    const course: Record<string, unknown> = {
      "@type": "Course",
      "@id": courseUrl,
      name: programName,
      description,
      provider: { "@id": collegeId },
      educationalLevel: "Undergraduate",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Onsite",
        // ISO-8601 duration: P4Y (4 years) for B.Tech, P2Y (2 years) for M.Pharm-tier — we only have UG here.
        courseWorkload: b === "Pharm.D" ? "P6Y" : "P4Y",
      },
    };
    if (c.fee > 0) {
      course.offers = {
        "@type": "Offer",
        price: c.fee,
        priceCurrency: "INR",
        category: "Tuition",
        // Per-year tuition; eligibleDuration mirrors course length.
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: c.fee,
          priceCurrency: "INR",
          unitText: "ANN", // annual
        },
      };
    }
    return course;
  });

  return {
    "@context": "https://schema.org",
    "@graph": [college, ...courses],
  };
}

/** Shared EducationalOrganization base used by the four subpages. */
function buildOrgBase(c: College): Record<string, unknown> {
  const url = `${SITE_URL}/colleges/${c.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: c.name,
    alternateName: c.code,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.district,
      addressRegion: c.state,
      addressCountry: "IN",
    },
    foundingDate: String(c.year),
  };
}

function naacCredential(c: College) {
  return {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "NAAC Accreditation",
    name: `NAAC Grade ${c.naac}`,
  };
}

/**
 * Build the JSON-LD schema for a college page.
 * Shapes per page type (unchanged from the original per-page builders):
 *  - profile:   CollegeOrUniversity + Course @graph
 *  - cutoff:    EducationalOrganization + cutoffRanks + hasCredential
 *  - fees:      EducationalOrganization + priceRange + hasCredential + hasOfferCatalog (with offers)
 *  - placement: EducationalOrganization + placementStats
 *  - admission: EducationalOrganization + hasCredential + hasOfferCatalog (no offers)
 */
export function buildCollegeJsonLd(c: College, page: CollegePageType) {
  if (!c) return null;
  if (page === "profile") return buildProfileJsonLd(c);

  const schema = buildOrgBase(c);

  if (page === "cutoff") {
    // Add cutoff information
    const cutoffs = Object.entries(c.cutoff).filter(([, v]) => v > 0);
    if (cutoffs.length > 0) {
      schema.cutoffRanks = {
        "@type": "Thing",
        branches: cutoffs.map(([branch, rank]) => ({
          branch,
          closingRank: rank,
        })),
      };
    }
    if (c.naac && c.naac !== "-") schema.hasCredential = naacCredential(c);
    return schema;
  }

  if (page === "fees") {
    // Fee information
    if (c.fee > 0) {
      schema.priceRange = `₹${c.fee.toLocaleString("en-IN")}/year`;
    }
    if (c.naac && c.naac !== "-") schema.hasCredential = naacCredential(c);
    // Programs offered with fee info
    const programs = c.branches.map(b => ({
      "@type": "EducationalOccupationalProgram",
      name: `B.Tech in ${b}`,
      educationalProgramMode: "full-time",
      timeToComplete: "P4Y",
      ...(c.fee > 0 ? { offers: { "@type": "Offer", price: c.fee, priceCurrency: "INR", category: "Tuition" } } : {}),
    }));
    if (programs.length > 0) schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Programs Offered",
      itemListElement: programs,
    };
    return schema;
  }

  if (page === "placement") {
    // Add placement stats to schema if available
    if (c.placements.avg > 0 || c.placements.highest > 0) {
      schema.placementStats = {
        "@type": "Thing",
        averagePackage: c.placements.avg,
        highestPackage: c.placements.highest,
        recruitingCompanies: c.placements.companies,
      };
    }
    return schema;
  }

  // admission
  if (c.naac && c.naac !== "-") schema.hasCredential = naacCredential(c);
  // Programs offered
  const programs = c.branches.map(b => ({
    "@type": "EducationalOccupationalProgram",
    name: `B.Tech in ${b}`,
    educationalProgramMode: "full-time",
    timeToComplete: "P4Y",
  }));
  if (programs.length > 0) schema.hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: "Programs Offered",
    itemListElement: programs,
  };
  return schema;
}

/* ─────────────────────────── FAQ builders ───────────────────────────── */

/** Per-college derived labels shared by the FAQ item builders. */
function ctx(c: College) {
  return {
    exam: c.state === "Telangana" ? "TS EAPCET" : "AP EAPCET",
    council: c.state === "Telangana" ? "TSCHE" : "APSCHE",
    feeBlock: c.state === "Telangana" ? "G.O.Ms.No.06 (2025–28)" : "APHERMC block (2023–26)",
    isDeemed: c.type === "Deemed University",
    isPvtUni: c.type === "Private University",
  };
}

/**
 * Fee FAQ. `examLabelForPvtUni` covers a historical per-page wording quirk:
 * the placement page's private-university answer says "EAPCET counselling"
 * (no state prefix) while every other page uses the state-specific exam
 * name. `med` (admission page only) switches to the MBBS wording.
 */
function feeFAQ(c: College, examLabelForPvtUni?: string, med?: MedicalAdmissionInfo | null): FAQItem | null {
  if (!(c.fee > 0)) return null;
  const { exam, feeBlock, isDeemed, isPvtUni } = ctx(c);
  const pvtExam = examLabelForPvtUni ?? exam;
  if (med) {
    return {
      question: `What is the MBBS fee at ${c.name}?`,
      answer: `The MBBS tuition fee at ${c.name} (${c.code}) is approximately ${fmtFee(c.fee)} per year for the convener/competent-authority quota${c.type === "Government" ? ", among the lowest in " + c.state + " as a government college" : ""}. Management (B-category) and NRI (C-category) seats carry higher fees set as per the ${med.authority} notification. Fees are regulated by the state medical fee-fixation framework, not APHERMC/AFRC engineering orders.`,
    };
  }
  return {
    question: `What is the B.Tech fee at ${c.name}?`,
    answer: isDeemed
      ? `The B.Tech tuition fee at ${c.name} (${c.code}) is approximately ${fmtFee(c.fee)} per year. As a deemed university, fees are set by the university and may vary by programme. Check the official website for the latest fee structure.`
      : isPvtUni
      ? `The B.Tech tuition fee at ${c.name} (${c.code}) is ${fmtFee(c.fee)} per year for students admitted through ${pvtExam} counselling, as regulated by the government. Students admitted directly by the university may have different fees set by the institution.`
      : `The B.Tech tuition fee at ${c.name} (${c.code}) is ${fmtFee(c.fee)} per year for the convener quota (Category-A), as per ${feeBlock}. ${c.type === "Government" ? "As a government college, this is among the lowest fees in " + c.state + "." : "For management quota (Category-B, 30% of seats), fees are set by the college management and may be higher."}`,
  };
}

function cutoffFAQ(c: College): FAQItem | null {
  const { exam, isDeemed } = ctx(c);
  if (!(c.cutoff.cse > 0) || isDeemed) return null;
  const cseCutoff = c.cutoff.cse.toLocaleString("en-IN");
  return {
    question: `What is the ${exam} cutoff rank for CSE at ${c.name}?`,
    answer: `The last available final-phase OC closing rank for CSE at ${c.name} is ${cseCutoff}. This means students with a ${exam} rank of ${cseCutoff} or better (lower number) were admitted to CSE in the most recent counselling.`,
  };
}

function branchesFAQ(c: College, med?: MedicalAdmissionInfo | null): FAQItem | null {
  if (c.branches.length === 0) return null;
  const { exam, council, isDeemed, isPvtUni } = ctx(c);
  return {
    question: `What ${med ? "courses" : "branches"} are available at ${c.name}?`,
    answer: med
      ? `${c.name} offers ${c.branches.join(", ")}. Seats are filled through NEET-UG based counselling conducted by ${med.authority} (state quota) and MCC (All India Quota).`
      : isDeemed
      ? `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. As a deemed university, admissions are conducted by the university through its own entrance exam and counselling process.`
      : isPvtUni
      ? `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. Some seats are filled through ${exam} counselling conducted by ${council}, while the university also admits students through its own process.`
      : `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. ${c.type === "Government" ? `Admissions to all seats are through ${exam} counselling conducted by ${council}.` : `70% of seats (Category-A) are filled through ${exam} counselling by ${council}. The remaining 30% (Category-B) are management quota seats where admissions are controlled by the college management.`}`,
  };
}

function naacFAQ(c: College): FAQItem {
  return {
    question: `Is ${c.name} NAAC accredited?`,
    answer: c.naac && c.naac !== "-"
      ? `Yes, ${c.name} holds NAAC Grade ${c.naac} accreditation${c.nba ? " and also has NBA-accredited programmes" : ""}. NAAC accreditation indicates the institution meets national quality standards.`
      : `${c.name} does not currently have a NAAC accreditation grade on record.${c.nba ? " However, it does have NBA-accredited programmes." : ""} Students should check the official NAAC website for the latest status.`,
  };
}

function locationFAQ(c: College): FAQItem {
  const { isDeemed, isPvtUni } = ctx(c);
  return {
    question: `Where is ${c.name} located?`,
    answer: isDeemed
      ? `${c.name} (college code: ${c.code}) is located in ${c.district} district, ${c.state}, India. It is a deemed university with the authority to set its own curriculum and award its own degrees${c.year > 0 ? `, established in ${c.year}` : ""}.`
      : isPvtUni
      ? `${c.name} (college code: ${c.code}) is located in ${c.district} district, ${c.state}, India. It is a state private university that awards its own degrees${c.year > 0 ? `, established in ${c.year}` : ""}.`
      : `${c.name} (college code: ${c.code}) is located in ${c.district} district, ${c.state}, India. It is affiliated to ${c.affiliation}${c.year > 0 ? ` and was established in ${c.year}` : ""}.`,
  };
}

function placementsFAQ(c: College): FAQItem | null {
  if (!(c.placements.avg > 0 || c.placements.highest > 0)) return null;
  const parts: string[] = [];
  if (c.placements.avg > 0) parts.push(`an average package of ₹${c.placements.avg} LPA`);
  if (c.placements.highest > 0) parts.push(`a highest package of ₹${c.placements.highest} LPA`);
  if (c.placements.companies > 0) parts.push(`${c.placements.companies}+ recruiting companies`);
  return {
    question: `What are the placement statistics at ${c.name}?`,
    answer: `${c.name} reports ${parts.join(", ")}. Actual placement figures may vary by branch and year. Students should verify the latest placement data directly with the college.`,
  };
}

function nirfFAQ(c: College): FAQItem | null {
  if (!(c.nirf > 0)) return null;
  return {
    question: `What is the NIRF ranking of ${c.name}?`,
    answer: `${c.name} is ranked within the top ${c.nirf} in the NIRF (National Institutional Ranking Framework) Engineering category. NIRF rankings consider teaching, research, graduation outcomes, outreach, and perception.`,
  };
}

function admissionFAQ(c: College, med?: MedicalAdmissionInfo | null): FAQItem {
  const { exam, council, isDeemed, isPvtUni } = ctx(c);
  return {
    question: `How to get admission in ${c.name}?`,
    answer: med
      ? med.counsellingSummary + ` Counselling is conducted online by ${med.authorityFullName} (${med.officialUrl}).`
      : isDeemed
      ? `Admission to ${c.name} is through the university's own entrance exam and counselling process. As a deemed university, it does not participate in ${exam} state counselling. Candidates should visit the official website for application deadlines, eligibility criteria, and the admission procedure.`
      : isPvtUni
      ? `Admission to ${c.name} is through two routes: (1) ${exam} counselling conducted by ${council}, where fees are regulated by the government, and (2) the university's own admission process with university-set fees. Candidates should check both ${council} counselling and the university's official website.`
      : `Admission to ${c.name} is primarily through ${exam} counselling conducted by ${council}. ${c.type === "Government" ? "All seats are filled through convener quota." : "70% of seats are filled through convener quota (Category-A) via state counselling. The remaining 30% are management quota (Category-B) where admissions and fees are controlled by the college management."} Candidates must qualify ${exam} and participate in the web counselling process.`,
  };
}

function neetFAQ(c: College, med: MedicalAdmissionInfo): FAQItem {
  return {
    question: `Is admission to ${c.name} through EAPCET or NEET?`,
    answer: `Admission to ${c.name} is through NEET-UG, not EAPCET/EAMCET. AP/TS EAPCET is only for engineering, pharmacy, and agriculture courses. MBBS seats are filled solely on the basis of a valid NEET-UG score and rank — 15% through the All India Quota (MCC) and 85% through ${med.authority} state-quota counselling.`,
  };
}

/**
 * Generate FAQ items for a college page. Each page type keeps its original
 * FAQ selection and ordering:
 *  - profile:   fee, cutoff, branches, naac, location, placements, nirf, admission
 *  - cutoff:    cutoff, branches, fee, naac
 *  - fees:      fee, branches, cutoff, naac, location
 *  - placement: placements, fee ("EAPCET" wording), branches, naac
 *  - admission: admission, neet (medical), branches, fee, cutoff, naac, location
 */
export function generateCollegeFAQs(c: College, page: CollegePageType): FAQItem[] {
  let items: (FAQItem | null)[];
  switch (page) {
    case "profile":
      items = [feeFAQ(c), cutoffFAQ(c), branchesFAQ(c), naacFAQ(c), locationFAQ(c), placementsFAQ(c), nirfFAQ(c), admissionFAQ(c)];
      break;
    case "cutoff":
      items = [cutoffFAQ(c), branchesFAQ(c), feeFAQ(c), naacFAQ(c)];
      break;
    case "fees":
      items = [feeFAQ(c), branchesFAQ(c), cutoffFAQ(c), naacFAQ(c), locationFAQ(c)];
      break;
    case "placement":
      items = [placementsFAQ(c), feeFAQ(c, "EAPCET"), branchesFAQ(c), naacFAQ(c)];
      break;
    case "admission": {
      const med = isMedicalCollege(c.branches) ? getMedicalAdmission(c) : null;
      items = [
        admissionFAQ(c, med),
        med ? neetFAQ(c, med) : null,
        branchesFAQ(c, med),
        feeFAQ(c, undefined, med),
        cutoffFAQ(c),
        naacFAQ(c),
        locationFAQ(c),
      ];
      break;
    }
  }
  return items.filter((f): f is FAQItem => f !== null);
}

/* ─────────────────── FAQPage + Breadcrumb JSON-LD ───────────────────── */

/** Build FAQPage JSON-LD schema */
export function buildFaqJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

const BREADCRUMB_LEAF: Record<Exclude<CollegePageType, "profile">, { segment: string; name: string }> = {
  cutoff: { segment: "cutoff", name: "Cutoff Ranks" },
  fees: { segment: "fees", name: "Fees & Courses" },
  placement: { segment: "placement", name: "Placement Data" },
  admission: { segment: "admission", name: "Admission" },
};

/** Build BreadcrumbList JSON-LD (profile: 3 levels; subpages add a 4th). */
export function buildCollegeBreadcrumbLd(c: College, page: CollegePageType) {
  const itemListElement: Record<string, unknown>[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}` },
    { "@type": "ListItem", position: 2, name: "Colleges", item: `${SITE_URL}/colleges` },
    { "@type": "ListItem", position: 3, name: c.name, item: `${SITE_URL}/colleges/${c.slug}` },
  ];
  if (page !== "profile") {
    const leaf = BREADCRUMB_LEAF[page];
    itemListElement.push({ "@type": "ListItem", position: 4, name: leaf.name, item: `${SITE_URL}/colleges/${c.slug}/${leaf.segment}` });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}
