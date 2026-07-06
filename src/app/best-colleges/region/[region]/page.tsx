import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import {
  getRegionFromSlug,
  getCollegesInRegion,
  getAllRegionSlugs,
  REGION_META,
} from "@/lib/region-data";
import { fmtFee, type College } from "@/lib/colleges";


export const revalidate = 3600; // ISR: revalidate every hour
// dynamicParams=false → unknown region slugs return a real HTTP 404 instead
// of a 200-status soft-404. REGION_META is the only source of valid slugs.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRegionSlugs().map((slug) => ({ region: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const meta = REGION_META[region];

  if (!meta) {
    return { title: "Region Not Found" };
  }

  const colleges = getCollegesInRegion(region);
  const feeRange = colleges
    .filter((c) => c.fee > 0)
    .map((c) => c.fee)
    .sort((a, b) => a - b);
  const placementRange = colleges
    .filter((c) => c.placements.avg > 0)
    .map((c) => c.placements.avg)
    .sort((a, b) => a - b);

  const minFee = feeRange[0] || 0;
  const maxFee = feeRange[feeRange.length - 1] || 0;
  const minPlacement = placementRange[0] || 0;
  const maxPlacement = placementRange[placementRange.length - 1] || 0;

  const title = `Top Engineering Colleges in ${meta.name} 2026 — Rankings, Fees, Placements | TeluguColleges`;
  const feeDesc =
    minFee > 0 && maxFee > 0
      ? ` Fees range from ${fmtFee(minFee)} to ${fmtFee(maxFee)} per year.`
      : "";
  const description = `Best ${colleges.length} engineering colleges in the ${meta.name} region, ${meta.state}. Compare fees, EAPCET cutoffs, placement packages (₹${Math.round(minPlacement)}-${Math.round(maxPlacement)} LPA), NAAC ratings across ${meta.districts.length} districts.${feeDesc}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/best-colleges/region/${region}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/best-colleges/region/${region}`,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
  };
}

function BreadcrumbSchema({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best Colleges",
        item: `${SITE_URL}/best-colleges`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: name,
        item: `${SITE_URL}/best-colleges/region/${slug}`,
      },
    ],
  };

  return <JsonLd data={jsonLd} />;
}

function CollegeListSchema({
  colleges,
  name,
}: {
  colleges: College[];
  name: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Engineering Colleges in ${name}`,
    itemListElement: colleges.slice(0, 10).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/colleges/${c.slug}`,
      description: `${c.type} engineering college in ${c.district}. Fee: ${fmtFee(c.fee)}/yr. NAAC: ${c.naac}. CSE Cutoff: ${c.cutoff.cse || "N/A"}. Avg Package: ₹${c.placements.avg} LPA`,
    })),
  };

  return <JsonLd data={jsonLd} />;
}

export default async function BestCollegesRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const meta = REGION_META[region];

  if (!meta) {
    notFound();
  }

  const colleges = getCollegesInRegion(region);

  if (colleges.length === 0) {
    notFound();
  }

  // Calculate stats
  const feeRange = colleges
    .filter((c) => c.fee > 0)
    .map((c) => c.fee)
    .sort((a, b) => a - b);
  const placementRange = colleges
    .filter((c) => c.placements.avg > 0)
    .map((c) => c.placements.avg)
    .sort((a, b) => a - b);

  const minFee = feeRange[0] || 0;
  const maxFee = feeRange[feeRange.length - 1] || 0;
  const minPlacement = placementRange[0] || 0;
  const maxPlacement = placementRange[placementRange.length - 1] || 0;

  // Districts that actually have at least one listed college, in ranked order.
  const districtsWithColleges = Array.from(
    new Set(colleges.map((c) => c.district))
  );

  // Find highlights
  const bestValue = colleges
    .filter((c) => c.fee > 0)
    .sort((a, b) => a.fee - b.fee)[0];
  const bestPlacements = colleges
    .filter((c) => c.placements.avg > 0)
    .sort((a, b) => b.placements.avg - a.placements.avg)[0];
  const mostSelective = colleges
    .filter((c) => c.cutoff.cse > 0)
    .sort((a, b) => a.cutoff.cse - b.cutoff.cse)[0];

  return (
    <>
      <BreadcrumbSchema name={meta.name} slug={region} />
      <CollegeListSchema colleges={colleges} name={meta.name} />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand to-accent text-white py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="text-sm mb-4 opacity-90">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/best-colleges" className="hover:underline">
                Best Colleges
              </Link>
              <span className="mx-2">›</span>
              <span>{meta.name}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Top Engineering Colleges in {meta.name}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              {meta.state} · {colleges.length} colleges across{" "}
              {districtsWithColleges.length} districts, ranked by NIRF 2025, then
              EAPCET cutoff, then placement average
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-500 font-semibold">
                Total Colleges
              </div>
              <div className="text-3xl font-bold text-brand mt-2">
                {colleges.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Engineering colleges</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-500 font-semibold">
                Districts
              </div>
              <div className="text-3xl font-bold text-brand mt-2">
                {districtsWithColleges.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">In this region</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-500 font-semibold">
                Tuition Fee/Year
              </div>
              <div className="text-2xl font-bold text-brand mt-2">
                {minFee > 0 ? fmtFee(minFee) : "—"}
                <span className="text-gray-500 mx-2">to</span>
                {maxFee > 0 ? fmtFee(maxFee) : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-1">Fee range</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-500 font-semibold">
                Avg Placement
              </div>
              <div className="text-2xl font-bold text-brand mt-2">
                {minPlacement > 0 ? `₹${Math.round(minPlacement)}` : "—"}
                <span className="text-gray-500 mx-2">–</span>
                {maxPlacement > 0 ? `₹${Math.round(maxPlacement)}` : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-1">LPA range</p>
            </div>
          </div>

          {/* Districts covered */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 mb-10">
            <h3 className="font-bold text-gray-900 mb-3">
              Districts in {meta.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {meta.districts.map((d) => {
                const hasColleges = districtsWithColleges.includes(d);
                return hasColleges ? (
                  <Link
                    key={d}
                    href={`/best-colleges/${d
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/&/g, "and")
                      .replace(/[^a-z0-9-]/g, "")}`}
                    className="inline-block px-3 py-1 rounded-full bg-blue-50 text-brand text-sm font-semibold hover:bg-blue-100 transition-colors"
                  >
                    {d}
                  </Link>
                ) : (
                  <span
                    key={d}
                    className="inline-block px-3 py-1 rounded-full bg-gray-50 text-gray-400 text-sm font-semibold"
                  >
                    {d}
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Tap a district with available colleges to see its dedicated
              ranking.
            </p>
          </div>

          {/* Highlights */}
          {(bestValue || bestPlacements || mostSelective) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 sm:p-6 mb-10">
              <h3 className="font-bold text-amber-900 mb-3">Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {bestValue && (
                  <div>
                    <div className="text-amber-700 font-semibold mb-1">
                      💰 Best Value
                    </div>
                    <div className="text-amber-900">
                      <Link
                        href={`/colleges/${bestValue.slug}`}
                        className="font-bold hover:underline"
                      >
                        {bestValue.name}
                      </Link>
                      <div className="text-xs text-amber-700 mt-0.5">
                        {fmtFee(bestValue.fee)}/year · {bestValue.district}
                      </div>
                    </div>
                  </div>
                )}
                {bestPlacements && (
                  <div>
                    <div className="text-amber-700 font-semibold mb-1">
                      🏆 Best Placements
                    </div>
                    <div className="text-amber-900">
                      <Link
                        href={`/colleges/${bestPlacements.slug}`}
                        className="font-bold hover:underline"
                      >
                        {bestPlacements.name}
                      </Link>
                      <div className="text-xs text-amber-700 mt-0.5">
                        ₹{bestPlacements.placements.avg} LPA avg ·{" "}
                        {bestPlacements.district}
                      </div>
                    </div>
                  </div>
                )}
                {mostSelective && (
                  <div>
                    <div className="text-amber-700 font-semibold mb-1">
                      🎯 Most Selective
                    </div>
                    <div className="text-amber-900">
                      <Link
                        href={`/colleges/${mostSelective.slug}`}
                        className="font-bold hover:underline"
                      >
                        {mostSelective.name}
                      </Link>
                      <div className="text-xs text-amber-700 mt-0.5">
                        Rank {mostSelective.cutoff.cse} ·{" "}
                        {mostSelective.district}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Colleges Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      Rank
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      College Name
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      NAAC
                    </th>
                    <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      Fee/Yr
                    </th>
                    <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      CSE Cutoff
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      Avg Pkg
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                      Highest
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((college, idx) => (
                    <tr
                      key={college.id}
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <span className="font-bold text-brand">
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="font-bold text-accent hover:underline text-sm sm:text-base"
                        >
                          {college.name}
                        </Link>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {college.district}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            college.type === "Government"
                              ? "bg-green-50 text-green-700"
                              : college.type === "Private"
                                ? "bg-blue-50 text-blue-700"
                                : college.type ===
                                    "Deemed University"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-violet-50 text-violet-700"
                          }`}
                        >
                          {college.type}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm font-bold">
                        {college.naac && college.naac !== "-" ? (
                          <a
                            href={`https://www.naac.gov.in/index.php/en/accreditation-status`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Verify NAAC ${college.naac} grade on naac.gov.in`}
                            className="text-brand hover:underline"
                          >
                            NAAC {college.naac}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm font-bold">
                        {college.fee > 0 ? fmtFee(college.fee) : "—"}
                      </td>
                      <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm">
                        {college.cutoff.cse > 0
                          ? `#${college.cutoff.cse}`
                          : "—"}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="font-bold text-brand text-sm sm:text-base">
                          {college.placements.avg > 0
                            ? `₹${college.placements.avg} L`
                            : "—"}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm">
                        {college.placements.highest > 0
                          ? `₹${college.placements.highest} L`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Ordered by NIRF 2025 Engineering rank first, then CSE EAPCET closing rank, then placement average. Colleges without NIRF ranks appear below NIRF-ranked ones. Use the compare tool to apply your own weighting.
            </p>
          </div>

          {/* SEO Paragraph */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              About Engineering Colleges in {meta.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              The <strong>{meta.name}</strong> region of {meta.state} spans the
              districts of {meta.districts.slice(0, -1).join(", ")} and{" "}
              {meta.districts[meta.districts.length - 1]}. It is home to{" "}
              <strong>{colleges.length} engineering colleges</strong> offering
              B.Tech programs in Computer Science Engineering (CSE), Electronics
              and Communication Engineering (ECE), Electrical and Electronics
              Engineering (EEE), Mechanical Engineering, and Civil Engineering.
              These institutions range from government colleges to private
              universities, each with their own strengths in academics,
              placements, and research.
              {minFee > 0 && maxFee > 0 && (
                <>
                  {" "}
                  Annual tuition fees range from <strong>{fmtFee(minFee)}</strong>{" "}
                  to <strong>{fmtFee(maxFee)}</strong> per year depending on the
                  college type and specialization.
                </>
              )}
              {bestPlacements && bestPlacements.placements.avg > 0 && (
                <>
                  {" "}
                  The top college by placement is{" "}
                  <strong>
                    <Link
                      href={`/colleges/${bestPlacements.slug}`}
                      className="text-accent hover:underline"
                    >
                      {bestPlacements.name}
                    </Link>
                  </strong>{" "}
                  ({bestPlacements.district}) with an average placement package
                  of <strong>₹{bestPlacements.placements.avg} LPA</strong> and
                  highest package reaching{" "}
                  <strong>₹{bestPlacements.placements.highest} LPA</strong>.
                </>
              )}
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-brand to-accent text-white rounded-lg p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Ready to choose your college?
            </h3>
            <p className="text-blue-100 mb-5">
              Click on any college above to see complete details, EAPCET cutoff
              trends, placements breakdown, and more.
            </p>
            <Link
              href="/best-colleges"
              className="inline-block px-6 py-2 bg-white text-brand font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Explore Other Regions & Cities
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
