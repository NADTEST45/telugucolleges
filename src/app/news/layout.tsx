import type { Metadata } from "next";

const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com"}/news`;

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
  },
  twitter: {
    card: "summary",
    title: "Engineering Admission News | TeluguColleges",
    description:
      "Latest engineering entrance exam news — AP EAPCET, TS EAPCET, JEE, BITSAT & more.",
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
