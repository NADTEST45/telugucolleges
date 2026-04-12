import { notFound } from "next/navigation";
import { getAllBranchSlugs, getBranchBySlug, getCollegesForBranch } from "@/lib/branch-data";
import BranchDetail from "./BranchDetail";

export function generateStaticParams() {
  return getAllBranchSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) return {};
  const title = `${branch.name} Colleges in AP & Telangana — EAPCET Cutoffs | TeluguColleges`;
  const description = `Top ${branch.name} (${branch.shortName}) colleges in Andhra Pradesh & Telangana. Compare EAPCET cutoff ranks, fees, and placements for B.Tech ${branch.shortName}.`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com"}/branches/${slug}`;
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
    },
    twitter: {
      card: "summary" as const,
      title,
      description,
    },
  };
}

export default async function BranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) notFound();
  const colleges = getCollegesForBranch(branch.code);
  return <BranchDetail branch={branch} colleges={colleges} />;
}
