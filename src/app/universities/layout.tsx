import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universities in AP & Telangana — Deemed & Private Universities | TeluguColleges.com",
  description:
    "Browse deemed universities and private state universities in Andhra Pradesh & Telangana. Compare fees, placements, NIRF rankings, and NAAC ratings for KL, GITAM, SRM AP, Anurag, Centurion, and more.",
  openGraph: {
    title: "Universities in AP & Telangana | TeluguColleges.com",
    description:
      "Compare deemed and private universities in AP & Telangana — fees, placements, rankings, and accreditations.",
    type: "website",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://telugucolleges.com/og-image.png"] },
  alternates: { canonical: "https://telugucolleges.com/universities" },
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
