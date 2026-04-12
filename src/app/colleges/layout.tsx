import type { Metadata } from "next";

const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com"}/colleges`;

export const metadata: Metadata = {
  title: "All Engineering Colleges in AP & Telangana | TeluguColleges",
  description:
    "Browse 837+ B.Tech colleges in Andhra Pradesh & Telangana. Compare fees, EAPCET cutoffs, NAAC ratings, NIRF rankings, and placements — all in one place.",
  alternates: { canonical: url },
  openGraph: {
    title: "All Engineering Colleges in AP & Telangana | TeluguColleges",
    description:
      "Browse 837+ B.Tech colleges in Andhra Pradesh & Telangana. Compare fees, EAPCET cutoffs, NAAC ratings & placements.",
    url,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "All Engineering Colleges in AP & Telangana | TeluguColleges",
    description:
      "Browse 837+ B.Tech colleges in AP & TS with fees, cutoffs, NAAC & NIRF data.",
  },
};

export default function CollegesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
