import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { COLLEGES } from "@/lib/colleges";

const url = `${SITE_URL}/colleges`;

// Generated dynamically from COLLEGES so the count claim always matches
// reality. The /colleges page lists engineering, pharmacy, medical and
// other professional colleges — so we use "professional colleges" rather
// than narrower phrasing like "B.Tech colleges".
export function generateMetadata(): Metadata {
  const total = COLLEGES.length;
  return {
    title: "All Engineering Colleges in AP & Telangana | TeluguColleges",
    description:
      `Browse ${total} professional colleges in Andhra Pradesh & Telangana. Compare fees, EAPCET cutoffs, NAAC ratings, NIRF rankings, and placements — all in one place.`,
    alternates: { canonical: url },
    openGraph: {
      title: "All Engineering Colleges in AP & Telangana | TeluguColleges",
      description:
        `Browse ${total} professional colleges in Andhra Pradesh & Telangana. Compare fees, EAPCET cutoffs, NAAC ratings & placements.`,
      url,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
      images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "All Engineering Colleges in AP & Telangana | TeluguColleges",
      description:
        `Browse ${total} AP & TS colleges with fees, cutoffs, NAAC & NIRF data.`,
    },
  };
}

export default function CollegesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
