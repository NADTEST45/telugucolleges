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

      {/* EAPCET 2026 Quick Dates Banner */}
      <section className="bg-gradient-to-r from-brand-dark via-brand to-accent text-white rounded-2xl p-4 sm:p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px"}} />
        <div className="relative">
          <h2 className="text-lg font-bold mb-4">EAPCET 2026 — Key Dates at a Glance</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* AP */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">AP</span>
                <span className="font-semibold text-sm">AP EAPCET 2026</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-white/70 line-through">Registration</span><span className="text-white/70 line-through">Feb 4 — Mar 24</span></div>
                <div className="flex justify-between"><span className="text-white/70 line-through">Engineering Exam</span><span className="text-white/70 line-through">May 12–15, 18 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/70 line-through">Agri/Pharmacy</span><span className="text-white/70 line-through">May 19–20 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/70 line-through">Preliminary Key</span><span className="text-white/70 line-through">Released May 25 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/70 line-through">Objections</span><span className="text-white/70 line-through">Closed May 27 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/90">Results + Final Key</span><span className="font-bold text-green-300">July 2, 2026</span></div>
                <div className="flex justify-between"><span className="text-white/90">Counselling</span><span className="font-semibold">TBA (after results)</span></div>
              </div>
              <a href="https://cets.apsche.ap.gov.in/EAPCET/" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                Open Results Portal →
              </a>
            </div>
            {/* TS */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-accent text-white text-[11px] font-bold px-2 py-0.5 rounded">TS</span>
                <span className="font-semibold text-sm">TG EAPCET 2026</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-white/70 line-through">Registration</span><span className="text-white/70 line-through">Feb 19 — Apr 4</span></div>
                <div className="flex justify-between"><span className="text-white/70 line-through">Agri/Pharmacy Exam</span><span className="text-white/70 line-through">May 4–5 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/70 line-through">Engineering Exam</span><span className="text-white/70 line-through">May 9–11 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/90">Results</span><span className="font-bold text-blue-300">Declared May 17 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/90">Counselling Reg.</span><span className="font-bold text-blue-300">Jun 19–28</span></div>
                <div className="flex justify-between"><span className="text-white/90">Web Options</span><span className="font-semibold">Jun 25–Jul 1 ✓</span></div>
                <div className="flex justify-between"><span className="text-white/90">Counselling Rounds</span><span className="font-semibold">Jul–Aug 2026</span></div>
              </div>
              <a href="https://eapcet.tgche.ac.in/" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                Download Rank Card →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + news list (client island) */}
      <NewsList items={NEWS_ITEMS} categories={NEWS_CATEGORIES} />

      {/* Disclaimer */}
      <div className="mt-8 bg-amber-50 rounded-xl px-5 py-3 text-xs text-amber-700">
        Information is sourced from official government notifications (APSCHE, TGCHE, TAFRC, APHERMC) and verified news outlets. Dates and details may change — always verify on the official website before taking action.
      </div>
    </main>
  );
}
