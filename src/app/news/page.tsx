import { SITE_URL } from "@/lib/site";
/**
 * /news — Server Component shell.
 *
 * Renders the JSON-LD, breadcrumb, heading, and static EAPCET dates banner
 * on the server; the interactive filter/expand UI lives in the NewsList
 * client island, which receives NEWS_ITEMS as props (≈51 items) instead of
 * importing news.ts wholesale into the client bundle. Metadata (title,
 * description, canonical /news) is provided by src/app/news/layout.tsx.
 */
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { NEWS_ITEMS, NEWS_CATEGORIES } from "@/lib/news";
import NewsList from "./NewsList";
import { getCounsellingStatus, COUNSELLING_STATUS_AS_OF } from "@/lib/counselling-status";

export const revalidate = 300;


/**
 * Build an ItemList of NewsArticle objects for the news index page.
 *
 * Why ItemList of NewsArticle (vs a single Article)? The /news page is a
 * news index, not a single article. ItemList lets Google understand the
 * page as a list of dated news items and surface individual entries in
 * News-style rich results. Each entry's `url` now points at the per-item
 * permalink at /news/[slug] (which serves a full NewsArticle JSON-LD of
 * its own) rather than a fragment on the index — Top Stories needs a
 * standalone URL per article to surface it.
 *
 * Capped at the 30 most recent items: more isn't useful for crawlers, and
 * the JSON-LD payload size stays under control.
 */
function buildNewsListJsonLd() {
  const recent = [...NEWS_ITEMS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TeluguColleges Admission News & Alerts",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: recent.length,
    itemListElement: recent.map((n, idx) => {
      const itemUrl = `${SITE_URL}/news/${n.id}`;
      return {
        "@type": "ListItem",
        position: idx + 1,
        url: itemUrl,
        item: {
          "@type": "NewsArticle",
          "@id": itemUrl,
          headline: n.title,
          description: n.summary,
          datePublished: `${n.date}T09:00:00+05:30`,
          dateModified: `${n.date}T09:00:00+05:30`,
          url: itemUrl,
          mainEntityOfPage: { "@type": "WebPage", "@id": itemUrl },
          author: {
            "@type": "Organization",
            name: "TeluguColleges Editorial",
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "TeluguColleges",
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/og-image.png`,
              width: 1200,
              height: 630,
            },
          },
          articleSection: n.category,
          keywords: n.tags.join(", "),
        },
      };
    }),
  };
}

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News & Alerts", item: `${SITE_URL}/news` },
    ],
  };
}

export default function NewsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Structured data — ItemList of NewsArticle + BreadcrumbList. Lives on
          the index page only so /news/[slug] can emit its own NewsArticle
          schema without duplicate breadcrumbs. */}
      <JsonLd data={buildBreadcrumbJsonLd()} />
      <JsonLd data={buildNewsListJsonLd()} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">News & Alerts</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admission News & Alerts</h1>
      <p className="text-sm text-gray-600 mb-6">Latest updates on EAPCET 2026, fee notifications, counselling schedules, and more for AP & Telangana.</p>

      <section className="bg-brand text-white rounded-2xl p-4 sm:p-6 mb-8">
        <h2 className="text-lg font-bold mb-2">EAPCET 2026 — Admission status</h2>
        <p className="text-xs text-white/80 mb-4">Reviewed {COUNSELLING_STATUS_AS_OF}. Historical notices below retain their publication dates.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {(["AP", "TS"] as const).map(state => {
            const status = getCounsellingStatus(state);
            return (
              <div key={state} className="bg-white/10 rounded-xl p-4">
                <h3 className="font-bold mb-2">{state} · {status.stage}</h3>
                <p className="text-sm font-semibold">{status.headline}</p>
                <p className="text-sm text-white/80 mt-2">{status.next}</p>
                <a href={status.portalUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm underline">Official counselling portal →</a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filters + news list (client island) */}
      <NewsList items={NEWS_ITEMS} categories={NEWS_CATEGORIES} initialNow={Date.now()} />

      {/* Disclaimer */}
      <div className="mt-8 bg-amber-50 rounded-xl px-5 py-3 text-xs text-amber-700">
        Information is sourced from official government notifications (APSCHE, TGCHE, TAFRC, APHERMC) and verified news outlets. Dates and details may change — always verify on the official website before taking action.
      </div>
    </main>
  );
}
