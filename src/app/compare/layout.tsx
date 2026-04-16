import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Colleges — Fee, Cutoff & Placements | TeluguColleges",
  description: "Compare 2–4 AP & Telangana engineering colleges side-by-side on fees, EAPCET cutoffs, placements, NAAC grades and more.",
  openGraph: {
    title: "Compare Colleges — Fee, Cutoff & Placements | TeluguColleges",
    description: "Compare 2–4 AP & Telangana engineering colleges side-by-side on fees, EAPCET cutoffs, placements, NAAC grades and more.",
    type: "website",
    siteName: "TeluguColleges.com",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
