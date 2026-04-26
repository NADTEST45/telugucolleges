import type { Metadata } from "next";
import { NEWS_ITEMS } from "@/lib/news";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const url = `${SITE_URL}/news`;

export const metadata: Metadata = {
  title: "Engineering Admission News — AP & TS EAPCET Updates | TeluguColleges",
  description:
    "Latest news on AP EAPCET, TS EAPCET, JEE, BITSAT, VITEEE & other engineering entrance exams. Counselling dates, result updates, and registration deadlines.",
  alternates: { canonical: url },
  openGraph: {
    title: "Engineering Admission News — AP & TS EAPCET Updates | TeluguColleges",
    description:
      "Latest news on AP EAPCET, TS EAPCET, JEE, BITSAT, VITEEE & other engineering entrance exams.",
    url,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Admission News | TeluguColleges",
    description:
      "Latest engineering entrance exam news — AP EAPCET, TS EAPCET, JEE, BITSAT & more.",
  },
};

/**
 * Build an ItemList of NewsArticle objects for the news index page.
 *
 * Why ItemList of NewsArticle (vs a single Article)? The /news page is a
 * news index, not a single article. ItemList lets Google understand the
 * page as a list of dated news items and surface individual entries in
 * News-style rich results. Each entry includes the headline, dateline,
 * publisher and a fragment URL pointing back to the index — sufficient
 * for indexing and snippet eligibility.
 *
 * We cap at the 30 most recent items: more isn't useful for crawlers, and
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
    itemListElement: recent.map((n, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "NewsArticle",
        "@id": `${SITE_URL}/news#${n.id}`,
        headline: n.title,
        description: n.summary,
        datePublished: `${n.date}T09:00:00+05:30`,
        dateModified: `${n.date}T09:00:00+05:30`,
        url: `${SITE_URL}/news#${n.id}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/news`,
        },
        author: {
          "@type": "Organization",
          name: "TeluguColleges Editorial",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "TeluguColleges",
          url: SITE_URL,
          // Google's News rich-result spec wants a raster logo; we don't
          // have one yet, so reuse the OG image (1200×630 PNG).
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
    })),
  };
}

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News & Alerts", item: url },
    ],
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildNewsListJsonLd()) }}
      />
    </>
  );
}
