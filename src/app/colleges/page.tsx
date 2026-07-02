import Link from "next/link";
import type { Metadata } from "next";
import AdSlot from "@/components/ads/AdSlot";
import JsonLd from "@/components/JsonLd";
import CollegeCard from "./CollegeCard";
import CollegeFilterBar from "./CollegeFilterBar";
import {
  parseFilters,
  filterAndSort,
  sectionCounts,
  districtsForState,
  ALL_AFFILIATIONS,
  TOTAL_AP,
  TOTAL_TS,
  TOTAL_ALL,
} from "./filtering";
import { COLLEGES, type College } from "@/lib/colleges";
import { isIndexable } from "@/lib/cutoff-presence"; // SERVER-only — this page is a Server Component

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

/*
 * Metadata for /colleges. Until now this route had no metadata exported,
 * so it inherited the site-wide default — useless against directory-intent
 * queries like "engineering colleges in andhra pradesh" or "list of
 * private engineering colleges telangana." Set a unique title/description
 * + canonical so the route can actually rank for those.
 *
 * The canonical points at the bare /colleges URL (no query params) so
 * filter-state variants don't fragment ranking signal.
 */
export const metadata: Metadata = {
  title: "Engineering College Directory — AP & Telangana | TeluguColleges",
  description: `Browse ${TOTAL_ALL}+ engineering, pharmacy, and management colleges in Andhra Pradesh & Telangana. Filter by state, district, type (government, private, deemed), affiliation, and fees.`,
  alternates: { canonical: `${SITE_URL}/colleges` },
  openGraph: {
    title: "Engineering College Directory — AP & Telangana | TeluguColleges",
    description: `Browse ${TOTAL_ALL}+ engineering, pharmacy, and management colleges in Andhra Pradesh & Telangana.`,
    url: `${SITE_URL}/colleges`,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Engineering College Directory — AP & Telangana",
    description: `Browse ${TOTAL_ALL}+ engineering colleges across AP & TS.`,
  },
};

/**
 * /colleges — Server Component.
 *
 * Reads all filter/sort/section state from `searchParams` and renders the
 * matching cards on the server. The COLLEGES dataset (~700 rows, ~80 KB
 * of inline data) is therefore *not* shipped in the client JS bundle —
 * only the small <CollegeFilterBar/> island ships, which mutates the URL
 * and lets the server re-render the result list.
 *
 * Trade-off: each filter change is a navigation, so React Router fetches
 * a fresh RSC payload. The trade is worth it because (a) the JS bundle
 * for the page drops dramatically and (b) the rendered HTML is cacheable
 * by the CDN per unique filter combination.
 */

const SECTIONS: {
  key: College["type"];
  label: string;
  color: string;
  border: string;
  bg: string;
  desc: string;
}[] = [
  { key: "Deemed University", label: "Deemed Universities", color: "text-amber-700", border: "border-l-amber-500", bg: "bg-amber-50", desc: "UGC-recognised deemed-to-be universities with full autonomy over admissions, curriculum, and fees" },
  { key: "Private University", label: "Private State Universities", color: "text-violet-700", border: "border-l-violet-500", bg: "bg-violet-50", desc: "Established by state legislation with authority to grant their own degrees" },
  { key: "Government", label: "Government Colleges", color: "text-green-700", border: "border-l-green-500", bg: "bg-green-50", desc: "State-funded university colleges with the lowest fee structures" },
  { key: "Private", label: "Private Affiliated Colleges", color: "text-blue-700", border: "border-l-accent", bg: "bg-blue-50", desc: "Private unaided colleges affiliated to state universities, with fees regulated by government orders" },
];

interface PageProps {
  // Next.js 15: searchParams is async (a Promise) in Server Components.
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CollegesPage({ searchParams }: PageProps) {
  const rawParams = (await searchParams) ?? {};
  const filters = parseFilters(rawParams);
  const filtered = filterAndSort(filters);

  // Pre-computed inputs for the client filter bar
  const counts = sectionCounts(filters.state);
  const districts = districtsForState(filters.state);

  // Group results by section type when no explicit section filter is active
  const grouped: Map<string, College[]> | null = filters.section
    ? null
    : (() => {
        const map = new Map<string, College[]>();
        for (const s of SECTIONS) map.set(s.key, []);
        for (const c of filtered) {
          const arr = map.get(c.type);
          if (arr) arr.push(c);
        }
        return map;
      })();

  const showAPInfo = !filters.state || filters.state === "Andhra Pradesh";
  const showTSInfo = !filters.state || filters.state === "Telangana";

  // JSON-LD: BreadcrumbList + ItemList of the top filtered colleges. We
  // only emit the ItemList when filters are unset (canonical /colleges
  // view) — emitting per-filter ItemList variants would generate near-
  // duplicate structured data across many URLs, all sharing the same
  // canonical, which Google will ignore at best and penalise at worst.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Colleges", item: `${SITE_URL}/colleges` },
    ],
  };
  const isCanonicalView =
    !filters.state && !filters.section && !filters.district && !filters.affiliation && !filters.q;
  // Only indexable colleges belong in the ItemList — pointing structured
  // data at noindexed placeholder profiles wastes crawl budget and creates
  // an indexing-signal mismatch.
  const topColleges = isCanonicalView ? filtered.filter(isIndexable).slice(0, 50) : [];
  const itemListLd = topColleges.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Top Engineering Colleges in AP & Telangana",
        numberOfItems: topColleges.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: topColleges.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/colleges/${c.slug}`,
          name: c.name,
        })),
      }
    : null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={itemListLd ? [breadcrumbLd, itemListLd] : [breadcrumbLd]} />
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
        <Link href="/">Home</Link><span>/</span><span className="text-gray-600 font-medium">Colleges</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">College Directory</h1>
      <p className="text-sm text-gray-500 mb-4">{COLLEGES.length} professional colleges across Andhra Pradesh & Telangana</p>

      {/* Block Period Info */}
      {(showAPInfo || showTSInfo) && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4">
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">📋</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-700 mb-1">Fee Block Period — Private Affiliated Colleges</div>
              <div className="space-y-1">
                {showTSInfo && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-accent">Telangana:</span>{" "}
                    G.O.Ms.No.06 block period <span className="font-semibold">2025–2028</span> — TSCHE-approved tuition fees fixed for 3 years for all private unaided colleges affiliated to JNTUH, OU, and KU.
                  </div>
                )}
                {showAPInfo && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-green-700">Andhra Pradesh:</span>{" "}
                    APHERMC block period <span className="font-semibold">2023–2026</span> — Fee structure regulated by AP Higher Education Regulatory and Monitoring Commission for all private unaided colleges affiliated to JNTUK and JNTUA.
                  </div>
                )}
              </div>
              <div className="text-[11px] text-gray-500 mt-1.5">
                Fees shown for private affiliated colleges are convener-quota (category-A) rates as per the applicable block period GO.{" "}
                <Link href="/fee-calculator" className="text-accent font-semibold hover:underline">Estimate your full 4-year cost →</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive controls — the only client-side JS on this page */}
      <CollegeFilterBar
        filters={filters}
        sections={SECTIONS.map(s => ({ key: s.key, label: s.label, color: s.color, bg: s.bg }))}
        sectionCounts={counts}
        districts={districts}
        affiliations={ALL_AFFILIATIONS}
        totalAll={TOTAL_ALL}
        totalAp={TOTAL_AP}
        totalTs={TOTAL_TS}
      />

      <div className="text-sm text-gray-500 font-semibold mb-4">{filtered.length} colleges found</div>

      {/* Ad: Top of listing */}
      <div className="mb-4">
        <AdSlot slot="listing_top" state={filters.state || undefined} />
      </div>

      {/* Grouped View (when no section filter active) */}
      {grouped ? (
        <div className="space-y-8">
          {SECTIONS.map((s, sectionIdx) => {
            const items = grouped.get(s.key) || [];
            if (items.length === 0) return null;
            return (
              <section key={s.key}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className={`text-lg font-bold ${s.color}`}>{s.label}</h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{s.desc}</p>
                <div className="space-y-3">
                  {items.map(c => <CollegeCard key={c.id} c={c} borderClass={s.border} />)}
                </div>
                {/* Ad: Between sections */}
                {sectionIdx === 1 && (
                  <div className="mt-6">
                    <AdSlot slot="listing_mid" state={filters.state || undefined} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* Flat View (when a section filter is active) */
        <div className="space-y-3">
          {filtered.map(c => {
            const s = SECTIONS.find(s => s.key === c.type);
            return <CollegeCard key={c.id} c={c} borderClass={s?.border || "border-l-gray-300"} />;
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">🔍</div>
          <div className="text-lg font-semibold">No colleges match your filters</div>
          <Link href="/colleges" className="mt-2 inline-block text-sm text-accent font-semibold hover:underline">
            Clear all filters
          </Link>
        </div>
      )}
    </main>
  );
}
