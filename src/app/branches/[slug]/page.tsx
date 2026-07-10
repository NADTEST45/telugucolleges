import { SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import { getAllBranchSlugs, getBranchBySlug, getCollegesForBranch } from "@/lib/branch-data";
import JsonLd from "@/components/JsonLd";
import BranchDetail from "./BranchDetail";
import { getCollegesMerged } from "@/lib/colleges-merged";


export function generateStaticParams() {
  return getAllBranchSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) return {};
  const title = `${branch.name} Colleges in AP & Telangana — EAPCET Cutoffs | TeluguColleges`;
  const description = `Top ${branch.name} (${branch.shortName}) colleges in Andhra Pradesh & Telangana. Compare EAPCET cutoff ranks, fees, and placements for B.Tech ${branch.shortName}.`;
  const url = `${SITE_URL}/branches/${slug}`;
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

export default async function BranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) notFound();
  const colleges = getCollegesForBranch(branch.code, await getCollegesMerged());

  const url = `${SITE_URL}/branches/${slug}`;

  // Limit ItemList to the top 50 colleges to keep payload reasonable;
  // BranchDetail still renders the full set.
  const topColleges = colleges.slice(0, 50);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Branches", item: `${SITE_URL}/branches` },
      { "@type": "ListItem", position: 3, name: branch.name, item: url },
    ],
  };

  const itemListLd = topColleges.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${branch.name} Colleges in Andhra Pradesh & Telangana`,
        description: `Engineering colleges in AP & TS offering ${branch.name} (${branch.shortName}).`,
        numberOfItems: topColleges.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: topColleges.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/colleges/${c.college.slug}`,
          name: c.college.name,
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={itemListLd ? [breadcrumbLd, itemListLd] : [breadcrumbLd]} />
      <BranchDetail branch={branch} colleges={colleges} />
    </>
  );
}
