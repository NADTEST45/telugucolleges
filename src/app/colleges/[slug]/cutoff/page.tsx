import { COLLEGES } from "@/lib/colleges";
import { isIndexable } from "@/lib/cutoff-presence";
import { getCollegeBySlugMerged, getCollegesMerged } from "@/lib/colleges-merged";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CollegeDetail from "../CollegeDetail";
import { buildCollegeJsonLd, generateCollegeFAQs, buildFaqJsonLd, buildCollegeBreadcrumbLd } from "../college-structured-data";
import { getCutoffProps, getCollegeDetailData } from "../college-detail-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

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

  const cseCutoff = c.cutoff.cse > 0 ? c.cutoff.cse.toLocaleString("en-IN") : "N/A";
  const eceCutoff = c.cutoff.ece > 0 ? c.cutoff.ece.toLocaleString("en-IN") : "N/A";

  const title = `${c.name} EAPCET Cutoff 2026 — Branch-wise Closing Ranks | TeluguColleges`;
  const description = `${c.name} (${c.code}) EAPCET cutoff ranks: CSE ${cseCutoff}, ECE ${eceCutoff}. Category-wise closing ranks, year-over-year trends.`;
  const url = `${SITE_URL}/colleges/${slug}/cutoff`;
  // Placeholder rows have no cutoff data → emit noindex so the page
  // doesn't read as thin content to Google.
  const noindex = !isIndexable(c);

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

export default async function CutoffPage({ params }: { params: Promise<{ slug: string }> }) {
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
  const indexable = isIndexable(c);
  const jsonLd = indexable ? buildCollegeJsonLd(c, "cutoff") : null;
  const faqs = generateCollegeFAQs(c, "cutoff");
  const faqJsonLd = indexable ? buildFaqJsonLd(faqs) : null;
  const breadcrumbLd = buildCollegeBreadcrumbLd(c, "cutoff");

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd data={breadcrumbLd} />
      <CollegeDetail c={c} similar={similar} historicalCutoffs={historicalCutoffs} cutoffYears={cutoffYears} phaseCutoffs={phaseCutoffs} phases={phases} faqs={faqs} initialTab="cutoffs" detail={detail} />
    </>
  );
}
