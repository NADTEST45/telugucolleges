import type { Metadata } from "next";

const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com"}/eapcet`;

export const metadata: Metadata = {
  title: "EAPCET Rank Predictor — College Cutoff Finder | TeluguColleges",
  description:
    "Enter your AP or TS EAPCET rank to find matching B.Tech colleges. Weighted prediction using official TSCHE & APSCHE closing ranks, category & gender-wise.",
  alternates: { canonical: url },
  openGraph: {
    title: "EAPCET Rank Predictor — College Cutoff Finder | TeluguColleges",
    description:
      "Enter your AP or TS EAPCET rank to find matching B.Tech colleges. Weighted prediction using official TSCHE & APSCHE closing ranks.",
    url,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EAPCET Rank Predictor — College Cutoff Finder | TeluguColleges",
    description:
      "Enter your AP or TS EAPCET rank to find matching B.Tech colleges with official cutoff data.",
  },
};

export default function EapcetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
