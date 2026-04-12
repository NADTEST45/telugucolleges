import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Colleges — Fee, Cutoff & Placements | TeluguColleges",
  description: "Compare 2–4 AP & Telangana engineering colleges side-by-side on fees, EAPCET cutoffs, placements, NAAC grades and more.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
