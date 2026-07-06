import { SITE_URL } from "@/lib/site";
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
  type CollegesFilters,
} from "./filtering";
import { COLLEGES, type College } from "@/lib/colleges";
import { isIndexable } from "@/lib/cutoff-presence"; // SERVER-only — this page is a Server Component


/**
 * Cards rendered per page. The full ~849-card render produced ~3.9 MB of
 * HTML, killing mobile LCP. 60 rich cards keeps the payload well under
 * ~400 KB while an A–Z plain-link index at the bottom of page 1 preserves
 * a crawlable internal link to every indexable college profile.
 */
const PAGE_SIZE = 60;

/** Parse and clamp the ?page= param (1-based). */
function parsePage(raw: Record<string, string | string[] | undefined>): number {
  const v = raw.page;
  const s = Array.isArray(v) ? v[0] : v;
  const n = s ? parseInt(s, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/**
 * Metadata for /colleges. Page 1 keeps the bare-/colleges canonical so
 * filter-state variants don't fragment ranking signal. Paginated pages
 * (?page=2+) are noindex,follow — they're thin near-duplicates, but their
 * links should still be followed so card links keep passing equity.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const rawParams = (await searchParams) ?? {};
  const page = parsePage(rawParams);
  const base: Metadata = {
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
  if (page > 1) {
    return {
      ...base,
      title: `Engineering College Directory — Page ${page} | TeluguColleges`,
      alternates: undefined,
      robots: { index: false, follow: true },
    };
  }
  return base;
}

/**
 * /colleges — Server Component.
 *
 * Reads all filter/sort/page state from `searchParams` and renders the
 * matching cards on the server. The COLLEGES dataset (~849 rows) is
 * therefore *not* shipped in the client JS bundle — only the small
 * <CollegeFilterBar/> island ships, which mutates the URL and lets the
 * server re-render the result list.
 *
 * Results are paginated at PAGE_SIZE rich cards per page with real <a>
 * prev/next links (?page=N), so pagination works without JS and is
 * crawlable. Any filter change resets to page 1 (the filter bar drops
 * the `page` param on every update).
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

/** Build a ?page=N href that preserves the current (validated) filter state. */
function pageHref(filters: CollegesFilters, page: number): string {
  const params = new URLSearchParams();
  const entries: [keyof CollegesFilters, string][] = [
    ["q", filters.q],
    ["state", filters.state],
    ["district", filters.district],
    ["affiliation", filters.affiliation],
    ["maxFee", filters.maxFee],
    ["naac", filters.naac],
    ["category", filters.category],
    ["section", filters.section],
  ];
  for (const [k, v] of entries) if (v) params.set(k, v);
  if (filters.sort && filters.sort !== "name") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/colleges?${qs}` : "/colleges";
}

export default async function CollegesPage({ searchParams }: PageProps) {
  const rawParams = (await searchParams) ?? {};
  const filters = parseFilters(rawParams);
  const filtered = filterAndSort(filters);

  // Pre-computed inputs for the client filter bar
  const counts = sectionCounts(filters.state);
  const districts = districtsForState(filters.state);

  // --- Pagination over the *display* order -------------------------------
  // When no section filter is active the list renders grouped by section
  // (Deemed → Private University → Government → Private), so pagination
  // must follow that same order or page boundaries would jump around.
  const displayOrdered: College[] = filters.section
    ? filtered
    : SECTIONS.flatMap(s => filtered.filter(c => c.type === s.key));

  const totalPages = Math.max(1, Math.ceil(displayOrdered.length / PAGE_SIZE));
  const page = Math.min(parsePage(rawParams), totalPages);
  const pageItems = displayOrdered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showingFrom = displayOrdered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = (page - 1) * PAGE_SIZE + pageItems.length;

  // Group the current page's slice by section type for the grouped view
  const grouped: Map<string, College[]> | null = filters.section
    ? null
    : (() => {
        const map = new Map<string, College[]>();
        for (const s of SECTIONS) map.set(s.key, []);
        for (const c of pageItems) {
          const arr = map.get(c.type);
          if (arr) arr.push(c);
        }
        return map;
      })();

  const showAPInfo = !filters.state || filters.state === "Andhra Pradesh";
  const showTSInfo = !filters.state || filters.state === "Telangana";

  // JSON-LD: BreadcrumbList + ItemList of the top filtered colleges. We
  // only emit the ItemList when filters are unset and we're on page 1
  // (the canonical /colleges view) — emitting per-filter/per-page ItemList
  // variants would generate near-duplicate structured data across many
  // URLs, all sharing the same canonical, which Google will ignore at
  // best and penalise at worst.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Colleges", item: `${SITE_URL}/colleges` },
    ],
  };
  const isCanonicalView =
    !filters.state && !filters.section && !filters.district && !filters.affiliation && !filters.q &&
    page === 1;
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

  // A–Z plain-link index (canonical page-1 view only): a crawlable bare
  // <a> link to every indexable college, so capping the rich cards at 60
  // per page doesn't orphan any profile from internal linking. Light HTML
  // — name-only links, no cards.
  const azIndex: [string, College[]][] = isCanonicalView
    ? (() => {
        const indexable = COLLEGES.filter(isIndexable).sort((a, b) => a.name.localeCompare(b.name));
        const byLetter = new Map<string, College[]>();
        for (const c of indexable) {
          const letter = /^[A-Za-z]/.test(c.name) ? c.name[0]!.toUpperCase() : "#";
          const arr = byLetter.get(letter);
          if (arr) arr.push(c);
          else byLetter.set(letter, [c]);
        }
        return [...byLetter.entries()].sort(([a], [b]) => a.localeCompare(b));
      })()
    : [];

  const prevHref = page > 1 ? pageHref(filters, page - 1) : null;
  const nextHref = page < totalPages ? pageHref(filters, page + 1) : null;

  const paginationNav = totalPages > 1 && (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3 text-sm">
      {prevHref ? (
        <Link href={prevHref} rel="prev" className="px-4 py-2 rounded-lg bg-white border border-gray-200 font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all">
          ← Previous
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 font-semibold text-gray-300">← Previous</span>
      )}
      <span className="text-gray-500 font-semibold px-2">Page {page} of {totalPages}</span>
      {nextHref ? (
        <Link href={nextHref} rel="next" className="px-4 py-2 rounded-lg bg-white border border-gray-200 font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all">
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 font-semibold text-gray-300">Next →</span>
      )}
    </nav>
  );

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

      <div className="text-sm text-gray-500 font-semibold mb-4">
        {filtered.length} colleges found
        {totalPages > 1 && (
          <span className="font-normal"> · Showing {showingFrom}–{showingTo} · Page {page} of {totalPages}</span>
        )}
      </div>

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
          {pageItems.map(c => {
            const s = SECTIONS.find(s => s.key === c.type);
            return <CollegeCard key={c.id} c={c} borderClass={s?.border || "border-l-gray-300"} />;
          })}
        </div>
      )}

      {paginationNav}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">🔍</div>
          <div className="text-lg font-semibold">No colleges match your filters</div>
          <Link href="/colleges" className="mt-2 inline-block text-sm text-accent font-semibold hover:underline">
            Clear all filters
          </Link>
        </div>
      )}

      {/* A–Z index of every indexable college — canonical page-1 view only.
          Plain name-only links keep this section light while preserving a
          crawlable internal link to each profile that isn't among the 60
          rich cards above. */}
      {azIndex.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold mb-1">All Colleges A–Z</h2>
          <p className="text-xs text-gray-500 mb-5">
            Quick links to every college profile with cutoff, fee, and placement data.
          </p>
          <div className="space-y-5">
            {azIndex.map(([letter, items]) => (
              <div key={letter}>
                <h3 className="text-sm font-bold text-gray-400 mb-1.5">{letter}</h3>
                <ul className="columns-1 sm:columns-2 lg:columns-3 gap-6 text-[13px] leading-relaxed">
                  {items.map(c => (
                    <li key={c.id} className="break-inside-avoid">
                      <Link href={`/colleges/${c.slug}`} className="text-gray-600 hover:text-accent hover:underline">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
