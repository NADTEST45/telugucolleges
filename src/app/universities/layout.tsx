import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { getCollegesMerged } from "@/lib/colleges-merged";
import JsonLd from "@/components/JsonLd";
import { UniversitiesDataProvider } from "./UniversitiesDataProvider";


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

// The page itself is a client component, so its JSON-LD is emitted here from
// the (server) layout. Mirrors the universities-section filter on the page:
// deemed + private state universities, each linking to its /colleges/[slug].
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Universities", item: `${SITE_URL}/universities` },
  ],
};

export default async function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  const colleges = (await getCollegesMerged()).filter(
    c => c.type === "Deemed University" || c.type === "Private University"
  );
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Deemed & Private Universities in Andhra Pradesh & Telangana",
    numberOfItems: colleges.length,
    itemListElement: colleges.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/colleges/${c.slug}`,
      name: c.name,
    })),
  };
  return (
    <UniversitiesDataProvider colleges={colleges}>
      <JsonLd data={[breadcrumbLd, itemListLd]} />
      {children}
    </UniversitiesDataProvider>
  );
}
