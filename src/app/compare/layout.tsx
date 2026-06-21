import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export const metadata: Metadata = {
  title: "Compare Colleges — Fee, Cutoff & Placements | TeluguColleges",
  description: "Compare 2–4 AP & Telangana engineering colleges side-by-side on fees, EAPCET cutoffs, placements, NAAC grades and more.",
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: {
    title: "Compare Colleges — Fee, Cutoff & Placements | TeluguColleges",
    description: "Compare 2–4 AP & Telangana engineering colleges side-by-side on fees, EAPCET cutoffs, placements, NAAC grades and more.",
    type: "website",
    siteName: "TeluguColleges.com",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
};

// Page is a client component (the compare picker), so its JSON-LD lives here in
// the server layout. The hub is a tool, not a list of a fixed set of colleges —
// the concrete head-to-head pages live at /compare/[pair] and carry their own
// schema — so the hub only needs a BreadcrumbList.
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare` },
  ],
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      {children}
    </>
  );
}
