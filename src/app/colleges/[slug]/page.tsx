import { COLLEGES, getCollegeBySlug, fmtFee, hasRealData } from "@/lib/colleges";
import { getCollegeBySlugMerged, getCollegesMerged } from "@/lib/colleges-merged";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, CollegeCutoffs, YearCutoffs } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";
import { TS_PHASES, getTSPhaseCutoffs, type PhaseKey } from "@/lib/ts-cutoffs-phases";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CollegeDetail from "./CollegeDetail";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export type FAQItem = { question: string; answer: string };

export const revalidate = 3600; // ISR: revalidate every hour
// dynamicParams=false → any slug not in generateStaticParams() returns a
// real HTTP 404 (framework-level), not a soft-404 (200 with a 404 UI).
// Safe because COLLEGES is the sole source of valid slugs: colleges-merged
// only *modifies* existing entries, never adds new ones. If that ever
// changes, expand generateStaticParams() to include the new source.
export const dynamicParams = false;

export function generateStaticParams() {
  return COLLEGES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCollegeBySlugMerged(slug);
  if (!c) return {};
  const title = `${c.name} — Fee, Cutoffs, Placements | TeluguColleges`;
  const description = `${c.name} (${c.code}) in ${c.district}, ${c.state}. B.Tech fee ${c.fee > 0 ? fmtFee(c.fee) + "/yr" : ""}, EAPCET cutoff ranks, placements, NAAC ${c.naac && c.naac !== "-" ? c.naac : ""} & NIRF rankings.`;
  const url = `${SITE_URL}/colleges/${slug}`;

  // Placeholder rows (no real cutoff / placement / NAAC / NIRF data) emit
  // `noindex, follow` so Google won't index thin pages but will still
  // discover linked URLs from them. This complements the sitemap
  // exclusion in src/app/sitemap.ts. See hasRealData() for the rule.
  const noindex = !hasRealData(c);

  return {
    title,
    description,
    robots: noindex ? "noindex, follow" : undefined,
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
      // Per-college OG card served by /api/og/[slug] (route handler, not the
      // opengraph-image.tsx file convention — in Next 16/Turbopack the
      // convention registered as file-based metadata, overriding these
      // config images, but failed to inject its own URL; verified in
      // production 2026-06-12).
      images: [{ url: `${SITE_URL}/api/og/${slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/api/og/${slug}`],
    },
  };
}

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
 * Build JSON-LD CollegeOrUniversity + Course schema for a college.
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
function buildJsonLd(c: ReturnType<typeof getCollegeBySlug>) {
  if (!c) return null;
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

/** Generate FAQ items from college data */
function generateFAQs(c: NonNullable<ReturnType<typeof getCollegeBySlug>>): FAQItem[] {
  const faqs: FAQItem[] = [];
  const exam = c.state === "Telangana" ? "TS EAPCET" : "AP EAPCET";
  const council = c.state === "Telangana" ? "TSCHE" : "APSCHE";
  const feeBlock = c.state === "Telangana" ? "G.O.Ms.No.06 (2025–28)" : "APHERMC block (2023–26)";
  const isDeemed = c.type === "Deemed University";
  const isPvtUni = c.type === "Private University";

  // 1. Fee
  if (c.fee > 0) {
    faqs.push({
      question: `What is the B.Tech fee at ${c.name}?`,
      answer: isDeemed
        ? `The B.Tech tuition fee at ${c.name} (${c.code}) is approximately ${fmtFee(c.fee)} per year. As a deemed university, fees are set by the university and may vary by programme. Check the official website for the latest fee structure.`
        : isPvtUni
        ? `The B.Tech tuition fee at ${c.name} (${c.code}) is ${fmtFee(c.fee)} per year for students admitted through ${exam} counselling, as regulated by the government. Students admitted directly by the university may have different fees set by the institution.`
        : `The B.Tech tuition fee at ${c.name} (${c.code}) is ${fmtFee(c.fee)} per year for the convener quota (Category-A), as per ${feeBlock}. ${c.type === "Government" ? "As a government college, this is among the lowest fees in " + c.state + "." : "For management quota (Category-B, 30% of seats), fees are set by the college management and may be higher."}`,
    });
  }

  // 2. Cutoff
  if (c.cutoff.cse > 0 && !isDeemed) {
    const cseCutoff = c.cutoff.cse.toLocaleString("en-IN");
    faqs.push({
      question: `What is the ${exam} cutoff rank for CSE at ${c.name}?`,
      answer: `The last available final-phase OC closing rank for CSE at ${c.name} is ${cseCutoff}. This means students with a ${exam} rank of ${cseCutoff} or better (lower number) were admitted to CSE in the most recent counselling.`,
    });
  }

  // 3. Branches offered
  if (c.branches.length > 0) {
    faqs.push({
      question: `What branches are available at ${c.name}?`,
      answer: isDeemed
        ? `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. As a deemed university, admissions are conducted by the university through its own entrance exam and counselling process.`
        : isPvtUni
        ? `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. Some seats are filled through ${exam} counselling conducted by ${council}, while the university also admits students through its own process.`
        : `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. ${c.type === "Government" ? `Admissions to all seats are through ${exam} counselling conducted by ${council}.` : `70% of seats (Category-A) are filled through ${exam} counselling by ${council}. The remaining 30% (Category-B) are management quota seats where admissions are controlled by the college management.`}`,
    });
  }

  // 4. NAAC / Accreditation
  faqs.push({
    question: `Is ${c.name} NAAC accredited?`,
    answer: c.naac && c.naac !== "-"
      ? `Yes, ${c.name} holds NAAC Grade ${c.naac} accreditation${c.nba ? " and also has NBA-accredited programmes" : ""}. NAAC accreditation indicates the institution meets national quality standards.`
      : `${c.name} does not currently have a NAAC accreditation grade on record.${c.nba ? " However, it does have NBA-accredited programmes." : ""} Students should check the official NAAC website for the latest status.`,
  });

  // 5. Location
  faqs.push({
    question: `Where is ${c.name} located?`,
    answer: isDeemed
      ? `${c.name} (college code: ${c.code}) is located in ${c.district} district, ${c.state}, India. It is a deemed university with the authority to set its own curriculum and award its own degrees${c.year > 0 ? `, established in ${c.year}` : ""}.`
      : isPvtUni
      ? `${c.name} (college code: ${c.code}) is located in ${c.district} district, ${c.state}, India. It is a state private university that awards its own degrees${c.year > 0 ? `, established in ${c.year}` : ""}.`
      : `${c.name} (college code: ${c.code}) is located in ${c.district} district, ${c.state}, India. It is affiliated to ${c.affiliation}${c.year > 0 ? ` and was established in ${c.year}` : ""}.`,
  });

  // 6. Placements
  if (c.placements.avg > 0 || c.placements.highest > 0) {
    const parts: string[] = [];
    if (c.placements.avg > 0) parts.push(`an average package of ₹${c.placements.avg} LPA`);
    if (c.placements.highest > 0) parts.push(`a highest package of ₹${c.placements.highest} LPA`);
    if (c.placements.companies > 0) parts.push(`${c.placements.companies}+ recruiting companies`);
    faqs.push({
      question: `What are the placement statistics at ${c.name}?`,
      answer: `${c.name} reports ${parts.join(", ")}. Actual placement figures may vary by branch and year. Students should verify the latest placement data directly with the college.`,
    });
  }

  // 7. NIRF
  if (c.nirf > 0) {
    faqs.push({
      question: `What is the NIRF ranking of ${c.name}?`,
      answer: `${c.name} is ranked within the top ${c.nirf} in the NIRF (National Institutional Ranking Framework) Engineering category. NIRF rankings consider teaching, research, graduation outcomes, outreach, and perception.`,
    });
  }

  // 8. Admission process
  faqs.push({
    question: `How to get admission in ${c.name}?`,
    answer: isDeemed
      ? `Admission to ${c.name} is through the university's own entrance exam and counselling process. As a deemed university, it does not participate in ${exam} state counselling. Candidates should visit the official website for application deadlines, eligibility criteria, and the admission procedure.`
      : isPvtUni
      ? `Admission to ${c.name} is through two routes: (1) ${exam} counselling conducted by ${council}, where fees are regulated by the government, and (2) the university's own admission process with university-set fees. Candidates should check both ${council} counselling and the university's official website.`
      : `Admission to ${c.name} is primarily through ${exam} counselling conducted by ${council}. ${c.type === "Government" ? "All seats are filled through convener quota." : "70% of seats are filled through convener quota (Category-A) via state counselling. The remaining 30% are management quota (Category-B) where admissions and fees are controlled by the college management."} Candidates must qualify ${exam} and participate in the web counselling process.`,
  });

  return faqs;
}

/** Build FAQPage JSON-LD schema */
function buildFaqJsonLd(faqs: FAQItem[]) {
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

export default async function CollegePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mergedColleges = await getCollegesMerged();
  const c = mergedColleges.find(col => col.slug === slug);
  if (!c) notFound();

  /*
   * Pick up to 4 "similar" colleges to surface "Compare vs X" links.
   *
   * Layered strategy (each layer fills only if previous didn't reach 4):
   *  1. Same-state peers within ±5k EAPCET CSE rank — apples-to-apples.
   *  2. Same tier (Govt / Deemed-Univ / Private) ranked by qualityScore —
   *     handles deemed unis (cutoff=0) and placeholder rows that layer 1
   *     misses, and brings in cross-state marquees for peer-tier comparisons
   *     (e.g. GITAM Vizag ↔ KL Univ ↔ SRM AP ↔ VIT-AP).
   *  3. Same-state peers ranked by qualityScore — last-resort fallback.
   *
   * This widens internal linking into /compare/[pair] significantly:
   * every college page now points at 4 compare URLs rather than 0–4.
   */
  const tierOf = (col: typeof c): "government" | "deemed" | "private" => {
    if (col.type === "Government") return "government";
    if (col.type === "Deemed University" || col.type === "Private University") return "deemed";
    return "private";
  };
  const NAAC_BONUS: Record<string, number> = { "A++": 25, "A+": 18, "A": 12, "B++": 6, "B+": 4, "B": 2 };
  const qScore = (col: typeof c): number => {
    let s = 0;
    if (col.cutoff.cse > 0) s += Math.min(40, 100000 / col.cutoff.cse);
    s += Math.min(40, col.placements.avg * 2.5);
    if (col.nirf > 0) s += Math.min(20, 400 / col.nirf);
    s += NAAC_BONUS[col.naac?.trim?.() ?? ""] ?? 0;
    if (col.nba) s += 5;
    return s;
  };
  const cTier = tierOf(c);

  const layer1 = mergedColleges.filter(s =>
    s.id !== c.id &&
    s.state === c.state &&
    s.cutoff.cse > 0 &&
    c.cutoff.cse > 0 &&
    Math.abs(s.cutoff.cse - c.cutoff.cse) < 5000,
  );
  const seenIds = new Set<number>([c.id, ...layer1.map(s => s.id)]);

  const layer2 = mergedColleges
    .filter(s => !seenIds.has(s.id) && tierOf(s) === cTier && qScore(s) > 5)
    .sort((a, b) => qScore(b) - qScore(a));
  for (const s of layer2) seenIds.add(s.id);

  const layer3 = mergedColleges
    .filter(s => !seenIds.has(s.id) && s.state === c.state && qScore(s) > 0)
    .sort((a, b) => qScore(b) - qScore(a));

  const similar = [...layer1, ...layer2, ...layer3].slice(0, 4);
  const historicalCutoffs = (c.state === "Telangana" ? TS_CUTOFFS[c.code] : AP_CUTOFFS[c.code]) || null;
  const cutoffYears = c.state === "Telangana" ? TS_CUTOFF_YEARS : AP_CUTOFF_YEARS;

  // Build phase-wise cutoff map for TS colleges
  let phaseCutoffs: Record<string, YearCutoffs> | null = null;
  let phases: { key: string; label: string }[] | null = null;
  if (c.state === "Telangana") {
    const phaseMap: Record<string, YearCutoffs> = {};
    for (const phase of TS_PHASES) {
      const data = phase.key === "2024"
        ? (TS_CUTOFFS[c.code]?.["2024"] || null)
        : phase.key === "2023"
        ? (TS_CUTOFFS[c.code]?.["2023"] || null)
        : getTSPhaseCutoffs(c.code, phase.key as PhaseKey);
      if (data) phaseMap[phase.key] = data;
    }
    if (Object.keys(phaseMap).length > 0) {
      phaseCutoffs = phaseMap;
      phases = TS_PHASES.filter(p => phaseMap[p.key]).map(p => ({ key: p.key, label: p.label }));
    }
  }

  const jsonLd = buildJsonLd(c);
  const faqs = generateFAQs(c);
  const faqJsonLd = buildFaqJsonLd(faqs);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}` },
      { "@type": "ListItem", position: 2, name: "Colleges", item: `${SITE_URL}/colleges` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE_URL}/colleges/${c.slug}` },
    ],
  };

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbLd} />
      <CollegeDetail c={c} similar={similar} historicalCutoffs={historicalCutoffs} cutoffYears={cutoffYears} phaseCutoffs={phaseCutoffs} phases={phases} faqs={faqs} initialTab="overview" />
    </>
  );
}
