import { COLLEGES, fmtFee } from "@/lib/colleges";
import { isIndexable } from "@/lib/cutoff-presence";
import { getCollegeBySlugMerged, getCollegesMerged } from "@/lib/colleges-merged";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, CollegeCutoffs } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CollegeDetail from "./CollegeDetail";
import { buildCollegeJsonLd, generateCollegeFAQs, buildFaqJsonLd, buildCollegeBreadcrumbLd } from "./college-structured-data";
import { getCutoffProps, getCollegeDetailData } from "./college-detail-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

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
  // Table-aware CSE closing rank: the summary cutoff.cse is 0 for many
  // colleges whose real ranks live only in the historical tables. This is a
  // server component that already imports AP_CUTOFFS/TS_CUTOFFS, so we can
  // resolve a numeric OC rank from the newest available year as a fallback.
  const cseRankOf = (col: typeof c): number => {
    if (col.cutoff.cse > 0) return col.cutoff.cse;
    const isTS = col.state === "Telangana";
    const table = (isTS ? TS_CUTOFFS[col.code] : AP_CUTOFFS[col.code]) as CollegeCutoffs | undefined;
    if (!table) return 0;
    const years: readonly string[] = isTS ? TS_CUTOFF_YEARS : AP_CUTOFF_YEARS;
    const branchKey = isTS ? "CSE" : "cse";
    for (const y of years) {
      const rank = table[y]?.[branchKey]?.OC;
      if (rank) return rank;
    }
    return 0;
  };
  const qScore = (col: typeof c): number => {
    let s = 0;
    const cse = cseRankOf(col);
    if (cse > 0) s += Math.min(40, 100000 / cse);
    s += Math.min(40, col.placements.avg * 2.5);
    if (col.nirf > 0) s += Math.min(20, 400 / col.nirf);
    s += NAAC_BONUS[col.naac?.trim?.() ?? ""] ?? 0;
    if (col.nba) s += 5;
    return s;
  };
  const cTier = tierOf(c);

  const cRank = cseRankOf(c);
  const layer1 = mergedColleges.filter(s => {
    if (s.id === c.id || s.state !== c.state || cRank <= 0) return false;
    const sRank = cseRankOf(s);
    return sRank > 0 && Math.abs(sRank - cRank) < 5000;
  });
  const seenIds = new Set<number>([c.id, ...layer1.map(s => s.id)]);

  const layer2 = mergedColleges
    .filter(s => !seenIds.has(s.id) && tierOf(s) === cTier && qScore(s) > 5)
    .sort((a, b) => qScore(b) - qScore(a));
  for (const s of layer2) seenIds.add(s.id);

  const layer3 = mergedColleges
    .filter(s => !seenIds.has(s.id) && s.state === c.state && qScore(s) > 0)
    .sort((a, b) => qScore(b) - qScore(a));

  const similar = [...layer1, ...layer2, ...layer3].slice(0, 4);
  const { historicalCutoffs, cutoffYears, phaseCutoffs, phases } = getCutoffProps(c);
  const detail = getCollegeDetailData(c);

  // Mirror generateMetadata's noindex decision: placeholder rows emit
  // `noindex, follow`, and Google flags structured data on noindexed pages
  // as a mismatch. Skip the rich JSON-LD (org + FAQ) there; the visible
  // FAQ content still renders in the DOM.
  const indexable = isIndexable(c);
  const jsonLd = indexable ? buildCollegeJsonLd(c, "profile") : null;
  const faqs = generateCollegeFAQs(c, "profile");
  const faqJsonLd = indexable ? buildFaqJsonLd(faqs) : null;
  const breadcrumbLd = buildCollegeBreadcrumbLd(c, "profile");

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd data={breadcrumbLd} />
      <CollegeDetail c={c} similar={similar} historicalCutoffs={historicalCutoffs} cutoffYears={cutoffYears} phaseCutoffs={phaseCutoffs} phases={phases} faqs={faqs} initialTab="overview" detail={detail} />
    </>
  );
}
