import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCitySlug,
  getCityFromSlug,
  getCollegesInCity,
  getAllCitySlugs,
  CITY_META,
} from "@/lib/city-data";
import { fmtFee, type College } from "@/lib/colleges";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.vercel.app";

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamicParams = true; // Allow pages not in generateStaticParams

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const meta = CITY_META[city];

  if (!meta) {
    return { title: "City Not Found" };
  }

  const colleges = getCollegesInCity(city);
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

  const title = `Top Engineering Colleges in ${meta.district} 2026 — Rankings, Fees, Placements | TeluguColleges`;
  const feeDesc =
    minFee > 0 && maxFee > 0
      ? ` Fees range from ${fmtFee(minFee)} to ${fmtFee(maxFee)} per year.`
      : "";
  const description = `Best ${colleges.length} engineering colleges in ${meta.district}, ${meta.state}. Compare fees, EAPCET cutoffs, placement packages (₹${Math.round(minPlacement)}-${Math.round(maxPlacement)} LPA), NAAC ratings.${feeDesc}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/best-colleges/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/best-colleges/${city}`,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
    },
  };
}

function BreadcrumbSchema({
  district,
  state,
}: {
  district: string;
  state: string;
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
        name: district,
        item: `${SITE_URL}/best-colleges/${getCitySlug(district)}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function CollegeListSchema({
  colleges,
  district,
}: {
  colleges: College[];
  district: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Engineering Colleges in ${district}`,
    itemListElement: colleges.slice(0, 10).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/colleges/${c.slug}`,
      description: `${c.type} engineering college in ${c.district}. Fee: ${fmtFee(c.fee)}/yr. NAAC: ${c.naac}. CSE Cutoff: ${c.cutoff.cse || "N/A"}. Avg Package: ₹${c.placements.avg} LPA`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BestCollegesCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const meta = CITY_META[city];

  if (!meta) {
    notFound();
  }

  const colleges = getCollegesInCity(city);

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
      <BreadcrumbSchema district={meta.district} state={meta.state} />
      <CollegeListSchema colleges={colleges} district={meta.district} />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a5276] to-[#2e86c1] text-white py-8 sm:py-12">
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
              <span>{meta.district}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Top Engineering Colleges in {meta.district}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              {meta.state} · {colleges.length} colleges ranked by placement,
              NAAC rating & EAPCET cutoff
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
              <div className="text-3xl font-bold text-[#1a5276] mt-2">
                {colleges.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Engineering colleges</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-500 font-semibold">
                Tuition Fee/Year
              </div>
              <div className="text-2xl font-bold text-[#1a5276] mt-2">
                {minFee > 0 ? fmtFee(minFee) : "—"}
                <span className="text-gray-400 mx-2">to</span>
                {maxFee > 0 ? fmtFee(maxFee) : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-1">Fee range</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-500 font-semibold">
                Avg Placement
              </div>
              <div className="text-2xl font-bold text-[#1a5276] mt-2">
                {minPlacement > 0 ? `₹${Math.round(minPlacement)}` : "—"}
                <span className="text-gray-400 mx-2">–</span>
                {maxPlacement > 0 ? `₹${Math.round(maxPlacement)}` : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-1">LPA range</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-500 font-semibold">
                Top Types
              </div>
              <div className="text-sm font-bold text-[#1a5276] mt-2">
                {Array.from(new Set(colleges.map((c) => c.type)))
                  .slice(0, 2)
                  .join(", ")}
              </div>
              <p className="text-xs text-gray-500 mt-1">College types</p>
            </div>
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
                        {fmtFee(bestValue.fee)}/year
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
                        ₹{bestPlacements.placements.avg} LPA avg
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
                        Rank {mostSelective.cutoff.cse}
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
                        <span className="font-bold text-[#1a5276]">
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="font-bold text-[#2e86c1] hover:underline text-sm sm:text-base"
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
                        {college.naac && college.naac !== "-"
                          ? `NAAC ${college.naac}`
                          : "—"}
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
                        <span className="font-bold text-[#1a5276] text-sm sm:text-base">
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
          </div>

          {/* SEO Paragraph */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              About Engineering Colleges in {meta.district}
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              There are <strong>{colleges.length} engineering colleges</strong>{" "}
              in {meta.district}, {meta.state}, offering B.Tech programs in
              Computer Science Engineering (CSE), Electronics and Communication
              Engineering (ECE), Electrical and Electronics Engineering (EEE),
              Mechanical Engineering, and Civil Engineering. These institutions
              range from government colleges to private universities, each with
              their own strengths in academics, placements, and research.
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
                      className="text-[#2e86c1] hover:underline"
                    >
                      {bestPlacements.name}
                    </Link>
                  </strong>{" "}
                  with an average placement package of{" "}
                  <strong>₹{bestPlacements.placements.avg} LPA</strong> and
                  highest package reaching{" "}
                  <strong>₹{bestPlacements.placements.highest} LPA</strong>.
                </>
              )}
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#1a5276] to-[#2e86c1] text-white rounded-lg p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Ready to choose your college?
            </h3>
            <p className="text-blue-100 mb-5">
              Click on any college above to see complete details, EAPCET cutoff
              trends, placements breakdown, and more.
            </p>
            <Link
              href="/best-colleges"
              className="inline-block px-6 py-2 bg-white text-[#1a5276] font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Explore Other Cities
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
