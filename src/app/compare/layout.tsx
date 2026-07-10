import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getCollegesMerged } from "@/lib/colleges-merged";
import { getFeaturedPairs } from "@/lib/comparison-pairs";
import { CompareDataProvider } from "./CompareDataProvider";


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

export default async function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colleges = await getCollegesMerged();
  const byCode = new Map(colleges.map(c => [c.code, c]));
  const featured = getFeaturedPairs(60).flatMap(p => {
    const college1 = byCode.get(p.college1.code);
    const college2 = byCode.get(p.college2.code);
    return college1 && college2 ? [{ slug: p.slug, college1, college2 }] : [];
  });
  const compareColleges = colleges.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
    district: c.district,
    state: c.state,
    type: c.type,
    affiliation: c.affiliation,
    naac: c.naac,
    nba: c.nba,
    year: c.year,
    fee: c.fee,
    cutoff: c.cutoff,
    placements: c.placements,
  }));
  return (
    <CompareDataProvider value={{ colleges: compareColleges, featured }}>
      <JsonLd data={breadcrumbLd} />
      {children}
    </CompareDataProvider>
  );
}
