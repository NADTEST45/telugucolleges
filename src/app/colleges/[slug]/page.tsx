import { COLLEGES, getCollegeBySlug, fmtFee } from "@/lib/colleges";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, CollegeCutoffs, YearCutoffs } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";
import { TS_PHASES, getTSPhaseCutoffs, type PhaseKey } from "@/lib/ts-cutoffs-phases";
import { notFound } from "next/navigation";
import CollegeDetail from "./CollegeDetail";

export type FAQItem = { question: string; answer: string };

export function generateStaticParams() {
  return COLLEGES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollegeBySlug(slug);
  if (!c) return {};
  const title = `${c.name} — Fee, Cutoffs, Placements | TeluguColleges`;
  const description = `${c.name} (${c.code}) in ${c.district}, ${c.state}. B.Tech fee ${c.fee > 0 ? fmtFee(c.fee) + "/yr" : ""}, EAPCET cutoff ranks, placements, NAAC ${c.naac && c.naac !== "-" ? c.naac : ""} & NIRF rankings.`;
  const url = `https://telugucolleges.vercel.app/colleges/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/** Build JSON-LD EducationalOrganization schema for a college */
function buildJsonLd(c: ReturnType<typeof getCollegeBySlug>) {
  if (!c) return null;
  const url = `https://telugucolleges.vercel.app/colleges/${c.slug}`;

  const schema: Record<string, unknown> = {
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

  // Accreditation
  if (c.naac && c.naac !== "-") {
    schema.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "NAAC Accreditation",
      name: `NAAC Grade ${c.naac}`,
    };
  }

  // Fee as priceRange (Google uses this for rich results)
  if (c.fee > 0) {
    schema.priceRange = `₹${c.fee.toLocaleString("en-IN")}/year`;
  }

  // Programs offered
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

  // Aggregate rating placeholder (NIRF rank as proxy)
  // Note: only add aggregateRating if we have review data in future

  return schema;
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
  const c = getCollegeBySlug(slug);
  if (!c) notFound();

  const similar = COLLEGES.filter(s => s.id !== c.id && s.state === c.state && s.cutoff.cse > 0 && c.cutoff.cse > 0 && Math.abs(s.cutoff.cse - c.cutoff.cse) < 5000).slice(0, 4);
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://telugucolleges.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Colleges", item: "https://telugucolleges.vercel.app/colleges" },
      { "@type": "ListItem", position: 3, name: c.name, item: `https://telugucolleges.vercel.app/colleges/${c.slug}` },
    ],
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CollegeDetail c={c} similar={similar} historicalCutoffs={historicalCutoffs} cutoffYears={cutoffYears} phaseCutoffs={phaseCutoffs} phases={phases} faqs={faqs} />
    </>
  );
}
