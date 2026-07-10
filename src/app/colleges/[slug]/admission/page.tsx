import { SITE_URL } from "@/lib/site";
import { COLLEGES } from "@/lib/colleges";
import { isCollegeSectionIndexable } from "@/lib/college-page-quality";
import { getCollegeBySlugMerged, getCollegesMerged } from "@/lib/colleges-merged";
import { isMedicalCollege } from "@/lib/medical-admission";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CollegeDetail from "../CollegeDetail";
import { buildCollegeJsonLd, generateCollegeFAQs, buildFaqJsonLd, buildCollegeBreadcrumbLd } from "../college-structured-data";
import { getCutoffProps, getCollegeDetailData } from "../college-detail-data";


export const revalidate = 3600; // ISR: revalidate every hour
// dynamicParams=false → unknown slugs return a framework-level HTTP 404,
// matching the main /colleges/[slug] page. Safe because generateStaticParams
// enumerates the full COLLEGES slug set (same as the parent page) and
// colleges-merged never adds new slugs. Renamed slugs 301 via next.config.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return COLLEGES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCollegeBySlugMerged(slug);
  if (!c) return {};

  const exam = c.state === "Telangana" ? "TS EAPCET" : "AP EAPCET";
  const isDeemed = c.type === "Deemed University";
  const isMedical = isMedicalCollege(c.branches);

  const title = `${c.name} Admission 2026 — Process, Dates, Eligibility | TeluguColleges`;
  const description = isMedical
    ? `How to get admission in ${c.name}. NEET-UG counselling process, eligibility criteria, ${c.state === "Telangana" ? "KNRUHS" : "NTRUHS"} state quota, All India Quota, and important dates.`
    : isDeemed
    ? `How to get admission in ${c.name}. University entrance exam and counselling process, eligibility criteria, important dates, and direct admission details.`
    : `How to get admission in ${c.name}. ${exam} counselling process, eligibility criteria, important dates, and management quota details.`;
  const url = `${SITE_URL}/colleges/${slug}/admission`;
  // No real data → noindex; SEO-irrelevant page when fields are placeholders.
  const noindex = !isCollegeSectionIndexable(c, "admission");

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

export default async function AdmissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mergedColleges = await getCollegesMerged();
  const c = mergedColleges.find(col => col.slug === slug);
  if (!c) notFound();

  const similar = mergedColleges.filter(s => s.id !== c.id && s.state === c.state && s.cutoff.cse > 0 && c.cutoff.cse > 0 && Math.abs(s.cutoff.cse - c.cutoff.cse) < 5000).slice(0, 4);
  const { historicalCutoffs, cutoffYears, phaseCutoffs, phases } = getCutoffProps(c);
  const detail = getCollegeDetailData(c);

  // Mirror generateMetadata's noindex decision: skip rich JSON-LD (org +
  // FAQ) on placeholder rows that emit `noindex, follow` — structured data
  // on noindexed pages reads as a mismatch to Google. Visible FAQ content
  // still renders in the DOM.
  const indexable = isCollegeSectionIndexable(c, "admission");
  const jsonLd = indexable ? buildCollegeJsonLd(c, "admission") : null;
  const faqs = generateCollegeFAQs(c, "admission");
  const faqJsonLd = indexable ? buildFaqJsonLd(faqs) : null;
  const breadcrumbLd = buildCollegeBreadcrumbLd(c, "admission");

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd data={breadcrumbLd} />
      <CollegeDetail c={c} similar={similar} historicalCutoffs={historicalCutoffs} cutoffYears={cutoffYears} phaseCutoffs={phaseCutoffs} phases={phases} faqs={faqs} initialTab="admission" detail={detail} />
    </>
  );
}
