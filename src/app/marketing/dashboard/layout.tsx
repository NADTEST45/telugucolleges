import { getCollegesMerged } from "@/lib/colleges-merged";
import { MarketingDataProvider, type MarketingData } from "./MarketingDataProvider";

export default async function MarketingDashboardLayout({ children }: { children: React.ReactNode }) {
  const colleges = await getCollegesMerged();
  const topFields = (college: (typeof colleges)[number]) => ({
    id: college.id,
    name: college.name,
    code: college.code,
    slug: college.slug,
    district: college.district,
    state: college.state,
    placements: college.placements,
  });
  const value: MarketingData = {
    totalColleges: colleges.length,
    totalAP: colleges.filter(college => college.state === "Andhra Pradesh").length,
    totalTS: colleges.filter(college => college.state === "Telangana").length,
    totalDeemed: colleges.filter(college => college.type === "Deemed University").length,
    totalPrivateUniversity: colleges.filter(college => college.type === "Private University").length,
    totalGovernment: colleges.filter(college => college.type === "Government").length,
    totalPrivate: colleges.filter(college => college.type === "Private").length,
    withPlacements: colleges.filter(college => college.placements.avg > 0).length,
    withNirf: colleges.filter(college => college.nirf > 0).length,
    withNaac: colleges.filter(college => college.naac && college.naac !== "-" && college.naac !== "N/A").length,
    branchCount: new Set(colleges.flatMap(college => college.branches)).size,
    districtCount: new Set(colleges.map(college => college.district)).size,
    topByPlacements: [...colleges].filter(college => college.placements.avg > 0)
      .sort((a, b) => b.placements.avg - a.placements.avg).slice(0, 10).map(topFields),
    topByHighest: [...colleges].filter(college => college.placements.highest > 0)
      .sort((a, b) => b.placements.highest - a.placements.highest).slice(0, 10).map(topFields),
  };
  return <MarketingDataProvider value={value}>{children}</MarketingDataProvider>;
}
