import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const url = `${SITE_URL}/eapcet`;

export const metadata: Metadata = {
  title: "EAPCET 2026 College Predictor — Rank-wise Cutoffs & Counselling | TeluguColleges",
  description:
    "Enter your AP or TS EAPCET 2026 rank to find matching B.Tech colleges, then build your web-options list. Official TSCHE & APSCHE closing ranks, category & gender-wise, with live counselling dates.",
  alternates: { canonical: url },
  openGraph: {
    title: "EAPCET 2026 College Predictor — Rank-wise Cutoffs & Counselling | TeluguColleges",
    description:
      "Enter your AP or TS EAPCET 2026 rank to find matching B.Tech colleges, then build your web-options list. Official TSCHE & APSCHE closing ranks, with live counselling dates.",
    url,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EAPCET 2026 College Predictor — Rank-wise Cutoffs & Counselling | TeluguColleges",
    description:
      "Enter your AP or TS EAPCET 2026 rank to find matching B.Tech colleges with official cutoff data and live counselling dates.",
  },
};

/**
 * NOTE: this layout wraps EVERY /eapcet/* route (cutoff-2026, rank bands,
 * counselling guides…), so it must NOT render page-specific JSON-LD. The
 * predictor's BreadcrumbList / WebApplication / FAQPage schemas used to live
 * here and leaked onto all child pages — giving cutoff and rank-band pages a
 * duplicate FAQPage (which disqualifies a page from FAQ rich results) and a
 * wrong breadcrumb. They now live in ./structured-data.tsx, rendered only by
 * the hub page.tsx. Keep this layout metadata-only.
 */
export default function EapcetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
