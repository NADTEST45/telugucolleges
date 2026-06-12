import { notFound } from "next/navigation";
import { getAllProgramSlugs, getCollegesForProgram } from "@/lib/program-data";
import JsonLd from "@/components/JsonLd";
import ProgramDetail from "./ProgramDetail";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export function generateStaticParams() {
  return getAllProgramSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCollegesForProgram(slug);
  if (!data) return {};
  const title = `${data.program.name} Colleges in AP & Telangana — Fees & Cutoffs | TeluguColleges`;
  const description = `${data.program.collegeCount}+ colleges offering ${data.program.name} in Andhra Pradesh & Telangana. Compare fees, cutoff ranks, and placements.`;
  const url = `${SITE_URL}/programs/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary" as const,
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCollegesForProgram(slug);
  if (!data) notFound();

  const { program, colleges } = data;
  const url = `${SITE_URL}/programs/${slug}`;

  // Cap ItemList to top 50 (by college quality — already sorted by ProgramDetail server)
  const topColleges = colleges.slice(0, 50);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Programs", item: `${SITE_URL}/programs` },
      { "@type": "ListItem", position: 3, name: program.name, item: url },
    ],
  };

  // Aggregate Course schema for the program. Google's Course rich-result
  // guidelines accept top-level Course as a "course list" entry when
  // accompanied by an ItemList; this lets the program page surface in
  // course-list search features.
  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.name,
    description: `${program.name} (${program.level}) programs offered by ${program.collegeCount} colleges across Andhra Pradesh and Telangana. Duration: ${program.duration} years.`,
    url,
    provider: {
      "@type": "Organization",
      name: "TeluguColleges.com",
      sameAs: SITE_URL,
    },
    educationalLevel: program.level,
    timeRequired: `P${program.duration}Y`,
    inLanguage: "en",
    // Aggregate offers: fee range across all colleges offering this program.
    ...(program.feeMin > 0 && program.feeMax > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: program.feeMin,
            highPrice: program.feeMax,
            offerCount: program.collegeCount,
          },
        }
      : {}),
  };

  const itemListLd = topColleges.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Colleges offering ${program.name} in AP & Telangana`,
        numberOfItems: topColleges.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: topColleges.map((cp, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/colleges/${cp.college.slug}`,
          name: cp.college.name,
        })),
      }
    : null;

  const ld = itemListLd
    ? [breadcrumbLd, courseLd, itemListLd]
    : [breadcrumbLd, courseLd];

  return (
    <>
      <JsonLd data={ld} />
      <ProgramDetail program={program} colleges={colleges} />
    </>
  );
}
