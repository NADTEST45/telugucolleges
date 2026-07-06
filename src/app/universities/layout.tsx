import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { COLLEGES } from "@/lib/colleges";
import JsonLd from "@/components/JsonLd";


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
const UNIVERSITIES = COLLEGES.filter(
  (c) => c.type === "Deemed University" || c.type === "Private University"
);

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Universities", item: `${SITE_URL}/universities` },
  ],
};

const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Deemed & Private Universities in Andhra Pradesh & Telangana",
  numberOfItems: UNIVERSITIES.length,
  itemListElement: UNIVERSITIES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/colleges/${c.slug}`,
    name: c.name,
  })),
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbLd, itemListLd]} />
      {children}
    </>
  );
}
