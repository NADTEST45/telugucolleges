import { NEWS_ITEMS, NEWS_CATEGORIES, type NewsItem } from "@/lib/news";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export const revalidate = 3600;
// dynamicParams=false → any slug not in NEWS_ITEMS returns a real HTTP 404,
// not a soft-404. NEWS_ITEMS is the sole source of valid slugs.
export const dynamicParams = false;

export function generateStaticParams() {
  return NEWS_ITEMS.map(n => ({ slug: n.id }));
}

function getItem(slug: string): NewsItem | undefined {
  return NEWS_ITEMS.find(n => n.id === slug);
}

const STATE_LABEL: Record<NewsItem["state"], string> = {
  AP: "Andhra Pradesh",
  TS: "Telangana",
  Both: "AP & Telangana",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  const url = `${SITE_URL}/news/${item.id}`;
  const title = `${item.title} | TeluguColleges News`;
  const description = item.summary;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description,
      url,
      siteName: "TeluguColleges.com",
      type: "article",
      locale: "en_IN",
      publishedTime: `${item.date}T09:00:00+05:30`,
      modifiedTime: `${item.date}T09:00:00+05:30`,
      tags: item.tags,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
    },
  };
}

function buildNewsArticleJsonLd(item: NewsItem) {
  const url = `${SITE_URL}/news/${item.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": url,
    headline: item.title,
    description: item.summary,
    articleBody: item.body,
    datePublished: `${item.date}T09:00:00+05:30`,
    dateModified: `${item.date}T09:00:00+05:30`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: "TeluguColleges Editorial",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "TeluguColleges",
      url: SITE_URL,
      // Google's News rich-result spec wants a raster logo; we don't have a
      // dedicated one yet, so reuse the OG image (1200×630 PNG).
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    },
    image: [`${SITE_URL}/og-image.png`],
    articleSection: item.category,
    keywords: item.tags.join(", "),
    inLanguage: "en-IN",
    isAccessibleForFree: true,
  };
}

function buildBreadcrumbJsonLd(item: NewsItem) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News & Alerts", item: `${SITE_URL}/news` },
      { "@type": "ListItem", position: 3, name: item.title, item: `${SITE_URL}/news/${item.id}` },
    ],
  };
}

const priorityBadge: Record<string, { label: string; cls: string }> = {
  high: { label: "Urgent", cls: "bg-red-100 text-red-700" },
  medium: { label: "Important", cls: "bg-amber-100 text-amber-700" },
  low: { label: "Info", cls: "bg-gray-100 text-gray-500" },
};

const stateBadge: Record<string, { label: string; cls: string }> = {
  AP: { label: "Andhra Pradesh", cls: "bg-green-50 text-green-700 border-green-200" },
  TS: { label: "Telangana", cls: "bg-blue-50 text-accent border-blue-200" },
  Both: { label: "AP & TS", cls: "bg-violet-50 text-violet-700 border-violet-200" },
};

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();

  const catMeta = NEWS_CATEGORIES.find(c => c.key === item.category);
  const pBadge = priorityBadge[item.priority];
  const sBadge = stateBadge[item.state];

  // Up to 4 related items: same category first, then same state. Excludes self.
  const sorted = [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date));
  const sameCategory = sorted.filter(n => n.id !== item.id && n.category === item.category);
  const seen = new Set<string>([item.id, ...sameCategory.map(n => n.id)]);
  const sameState = sorted.filter(
    n => !seen.has(n.id) && (n.state === item.state || n.state === "Both" || item.state === "Both"),
  );
  const related = [...sameCategory, ...sameState].slice(0, 4);

  return (
    <>
      <JsonLd data={buildNewsArticleJsonLd(item)} />
      <JsonLd data={buildBreadcrumbJsonLd(item)} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href="/news" className="hover:text-accent">News &amp; Alerts</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium line-clamp-1">{item.title}</span>
        </nav>

        <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <header className="px-5 sm:px-7 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {catMeta && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${catMeta.bgColor} ${catMeta.color}`}>
                  {catMeta.label}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${sBadge.cls}`}>
                {sBadge.label}
              </span>
              {item.priority === "high" && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${pBadge.cls}`}>
                  {pBadge.label}
                </span>
              )}
              <time dateTime={item.date} className="text-xs text-gray-600 ml-auto">
                {formatDate(item.date)}
              </time>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{item.title}</h1>
            <p className="text-base text-gray-600 leading-relaxed">{item.summary}</p>
          </header>

          <div className="px-5 sm:px-7 py-6 text-[15px] text-gray-800 leading-relaxed whitespace-pre-line">
            {item.body}
          </div>

          {(item.source || item.tags.length > 0) && (
            <footer className="px-5 sm:px-7 pb-6 border-t border-gray-100 pt-5 space-y-3">
              {item.source && (
                <div className="text-xs text-gray-600 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">Source:</span>
                  <span>{item.source}</span>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Visit official page →
                    </a>
                  )}
                </div>
              )}
              {item.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </footer>
          )}
        </article>

        {/* Region context */}
        <div className="mt-4 text-xs text-gray-600">
          Applies to: <span className="font-semibold">{STATE_LABEL[item.state]}</span>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-3">Related updates</h2>
            <div className="space-y-3">
              {related.map(r => {
                const rCat = NEWS_CATEGORIES.find(c => c.key === r.category);
                const rState = stateBadge[r.state];
                return (
                  <Link
                    key={r.id}
                    href={`/news/${r.id}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow px-5 py-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {rCat && (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${rCat.bgColor} ${rCat.color}`}>
                          {rCat.label}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${rState.cls}`}>
                        {rState.label}
                      </span>
                      <span className="text-[11px] text-gray-600 ml-auto">{formatDate(r.date)}</span>
                    </div>
                    <h3 className="font-semibold text-sm leading-snug mb-0.5">{r.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{r.summary}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            ← Back to all news
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 rounded-xl px-5 py-3 text-xs text-amber-700">
          Information is sourced from official government notifications (APSCHE, TGCHE, TAFRC, APHERMC) and verified news outlets. Dates and details may change — always verify on the official website before taking action.
        </div>
      </main>
    </>
  );
}
