import { COLLEGES, getCollegeBySlug, fmtFee } from "@/lib/colleges";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, CollegeCutoffs, YearCutoffs } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";
import { TS_PHASES, getTSPhaseCutoffs, type PhaseKey } from "@/lib/ts-cutoffs-phases";
import { notFound } from "next/navigation";
import CollegeDetail from "../CollegeDetail";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.vercel.app";

export type FAQItem = { question: string; answer: string };

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamicParams = true; // Allow pages not in generateStaticParams

export function generateStaticParams() {
  return COLLEGES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollegeBySlug(slug);
  if (!c) return {};

  const pkgInfo = c.placements.avg > 0 ? `, Average ₹${c.placements.avg} LPA` : "";
  const highestInfo = c.placements.highest > 0 ? `, Highest ₹${c.placements.highest} LPA` : "";
  const companiesInfo = c.placements.companies > 0 ? `, ${c.placements.companies}+ Companies` : "";

  const title = `${c.name} Placement 2026 — Average Package, Top Recruiters | TeluguColleges`;
  const description = `${c.name} (${c.code}) placement statistics${pkgInfo}${highestInfo}${companiesInfo}. Branch-wise data, trends & ROI analysis.`;
  const url = `${SITE_URL}/colleges/${slug}/placement`;

  return {
    title,
    description,
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
  const url = `${SITE_URL}/colleges/${c.slug}`;

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

/** Generate FAQ items from college data */
function generateFAQs(c: NonNullable<ReturnType<typeof getCollegeBySlug>>): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Placements FAQ
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

  // Fee FAQ
  if (c.fee > 0) {
    const isDeemed = c.type === "Deemed University";
    const isPvtUni = c.type === "Private University";
    const feeBlock = c.state === "Telangana" ? "G.O.Ms.No.06 (2025–28)" : "APHERMC block (2023–26)";
    faqs.push({
      question: `What is the B.Tech fee at ${c.name}?`,
      answer: isDeemed
        ? `The B.Tech tuition fee at ${c.name} (${c.code}) is approximately ${fmtFee(c.fee)} per year. As a deemed university, fees are set by the university and may vary by programme. Check the official website for the latest fee structure.`
        : isPvtUni
        ? `The B.Tech tuition fee at ${c.name} (${c.code}) is ${fmtFee(c.fee)} per year for students admitted through EAPCET counselling, as regulated by the government. Students admitted directly by the university may have different fees set by the institution.`
        : `The B.Tech tuition fee at ${c.name} (${c.code}) is ${fmtFee(c.fee)} per year for the convener quota (Category-A), as per ${feeBlock}. ${c.type === "Government" ? "As a government college, this is among the lowest fees in " + c.state + "." : "For management quota (Category-B, 30% of seats), fees are set by the college management and may be higher."}`,
    });
  }

  // Branches offered
  if (c.branches.length > 0) {
    const isDeemed = c.type === "Deemed University";
    const isPvtUni = c.type === "Private University";
    const exam = c.state === "Telangana" ? "TS EAPCET" : "AP EAPCET";
    const council = c.state === "Telangana" ? "TSCHE" : "APSCHE";
    faqs.push({
      question: `What branches are available at ${c.name}?`,
      answer: isDeemed
        ? `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. As a deemed university, admissions are conducted by the university through its own entrance exam and counselling process.`
        : isPvtUni
        ? `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. Some seats are filled through ${exam} counselling conducted by ${council}, while the university also admits students through its own process.`
        : `${c.name} offers ${c.branches.length} branches: ${c.branches.join(", ")}. ${c.type === "Government" ? `Admissions to all seats are through ${exam} counselling conducted by ${council}.` : `70% of seats (Category-A) are filled through ${exam} counselling by ${council}. The remaining 30% (Category-B) are management quota seats where admissions are controlled by the college management.`}`,
    });
  }

  // NAAC Accreditation
  faqs.push({
    question: `Is ${c.name} NAAC accredited?`,
    answer: c.naac && c.naac !== "-"
      ? `Yes, ${c.name} holds NAAC Grade ${c.naac} accreditation${c.nba ? " and also has NBA-accredited programmes" : ""}. NAAC accreditation indicates the institution meets national quality standards.`
      : `${c.name} does not currently have a NAAC accreditation grade on record.${c.nba ? " However, it does have NBA-accredited programmes." : ""} Students should check the official NAAC website for the latest status.`,
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

export default async function PlacementPage({ params }: { params: Promise<{ slug: string }> }) {
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
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}` },
      { "@type": "ListItem", position: 2, name: "Colleges", item: `${SITE_URL}/colleges` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE_URL}/colleges/${c.slug}` },
      { "@type": "ListItem", position: 4, name: "Placement Data", item: `${SITE_URL}/colleges/${c.slug}/placement` },
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
      <CollegeDetail c={c} similar={similar} historicalCutoffs={historicalCutoffs} cutoffYears={cutoffYears} phaseCutoffs={phaseCutoffs} phases={phases} faqs={faqs} initialTab="placements" />
    </>
  );
}
