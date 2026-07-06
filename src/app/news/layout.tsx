import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

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

/*
 * The layout intentionally does NOT emit news-list / breadcrumb JSON-LD any
 * more — that markup belongs on the index page only, not on per-item
 * permalink pages at /news/[slug] which now share this layout. The index
 * page (/news/page.tsx) emits its own ItemList of NewsArticle and
 * BreadcrumbList; permalink pages emit a full NewsArticle and a deeper
 * BreadcrumbList themselves.
 */
export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
