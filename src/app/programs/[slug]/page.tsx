import { notFound } from "next/navigation";
import { getAllProgramSlugs, getCollegesForProgram } from "@/lib/program-data";
import ProgramDetail from "./ProgramDetail";

export function generateStaticParams() {
  return getAllProgramSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCollegesForProgram(slug);
  if (!data) return {};
  const title = `${data.program.name} Colleges in AP & Telangana — Fees & Cutoffs | TeluguColleges`;
  const description = `${data.program.collegeCount}+ colleges offering ${data.program.name} in Andhra Pradesh & Telangana. Compare fees, cutoff ranks, and placements.`;
  const url = `https://telugucolleges.vercel.app/programs/${slug}`;
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

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCollegesForProgram(slug);
  if (!data) notFound();

  return <ProgramDetail program={data.program} colleges={data.colleges} />;
}
