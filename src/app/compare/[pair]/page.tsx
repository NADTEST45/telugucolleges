import { getComparisonPair, getAllPairSlugs } from "@/lib/comparison-pairs";
import { fmtFee } from "@/lib/colleges";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamicParams = true; // Allow pages not in generateStaticParams

export function generateStaticParams() {
  const slugs = getAllPairSlugs();
  return slugs.map(slug => ({ pair: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const comparisonPair = getComparisonPair(pair);

  if (!comparisonPair) {
    return {};
  }

  const { college1, college2 } = comparisonPair;
  const title = `${college1.name} vs ${college2.name} 2026 — Fees, Cutoffs, Placements Compared | TeluguColleges`;
  const description = `Compare ${college1.name} vs ${college2.name}: fees (₹${college1.fee?.toLocaleString("en-IN") || "N/A"} vs ₹${college2.fee?.toLocaleString("en-IN") || "N/A"}), EAPCET cutoffs, placements (₹${college1.placements.avg || "N/A"} vs ₹${college2.placements.avg || "N/A"} avg package). Side-by-side comparison.`;
  const url = `${SITE_URL}/compare/${pair}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/**
 * Build JSON-LD BreadcrumbList schema
 */
function buildBreadcrumbJsonLd(college1Name: string, college2Name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "TeluguColleges",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Compare",
        item: `${SITE_URL}/compare`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${college1Name} vs ${college2Name}`,
        item: `${SITE_URL}/compare`,
      },
    ],
  };
}

export default async function ComparePairPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const comparisonPair = getComparisonPair(pair);

  if (!comparisonPair) {
    notFound();
  }

  const { college1, college2 } = comparisonPair;
  const branches = ["cse", "ece", "eee", "mech", "civil"];

  // Helper to determine which college is better for a metric
  const getBetterIdx = (values: number[]): number => {
    const filtered = values.filter(v => v > 0);
    if (filtered.length === 0) return -1;
    return values.indexOf(Math.min(...filtered));
  };

  // getBetterIdx is used directly in the table cells below

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-gray-600">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-gray-600">Compare</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{college1.code} vs {college2.code}</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
        {college1.name} vs {college2.name}
      </h1>
      <p className="text-base text-gray-600 mb-8">
        Compare fees, EAPCET cutoffs, placements, and other key metrics side-by-side.
      </p>

      {/* Comparison Table */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide mb-8">
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm text-sm min-w-[500px] border border-gray-100">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-[#1a5276] text-white text-left text-xs min-w-[140px] font-semibold">
                Feature
              </th>
              <th className="px-4 py-3 bg-[#1a5276] text-white text-center min-w-[160px] font-semibold">
                <div className="font-bold text-sm">{college1.code}</div>
                <div className="text-xs opacity-90 font-normal mt-1">{college1.name.length > 30 ? college1.name.slice(0, 30) + "..." : college1.name}</div>
              </th>
              <th className="px-4 py-3 bg-[#1a5276] text-white text-center min-w-[160px] font-semibold">
                <div className="font-bold text-sm">{college2.code}</div>
                <div className="text-xs opacity-90 font-normal mt-1">{college2.name.length > 30 ? college2.name.slice(0, 30) + "..." : college2.name}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Basic Info Section */}
            <tr>
              <td colSpan={3} className="px-4 py-2 bg-blue-50 font-bold text-[#1a5276] text-xs">
                BASIC INFORMATION
              </td>
            </tr>
            {[
              ["Type", (c: typeof college1) => c.type],
              ["Location", (c: typeof college1) => `${c.district}, ${c.state}`],
              ["Affiliation", (c: typeof college1) => c.affiliation],
              ["Established", (c: typeof college1) => String(c.year)],
              ["NAAC Accreditation", (c: typeof college1) => c.naac || "—"],
              ["NBA Accreditation", (c: typeof college1) => c.nba ? "Yes" : "No"],
              ["NIRF Rank", (c: typeof college1) => c.nirf > 0 ? String(c.nirf) : "—"],
            ].map(([label, fn]) => (
              <tr key={label as string} className="border-b border-gray-100">
                <td className="px-4 py-3 font-semibold text-gray-600 text-xs sticky left-0 bg-white z-10">
                  {label as string}
                </td>
                <td className="px-4 py-3 text-center text-xs">
                  {(fn as (c: typeof college1) => string)(college1)}
                </td>
                <td className="px-4 py-3 text-center text-xs">
                  {(fn as (c: typeof college1) => string)(college2)}
                </td>
              </tr>
            ))}

            {/* Fee Structure Section */}
            <tr>
              <td colSpan={3} className="px-4 py-2 bg-blue-50 font-bold text-[#1a5276] text-xs">
                FEE STRUCTURE (ANNUAL)
              </td>
            </tr>
            {(() => {
              const fees = [college1.fee, college2.fee];
              const betterIdx = getBetterIdx(fees);
              return (
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-600 text-xs sticky left-0 bg-white z-10">
                    Annual Fee
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 0 ? "text-green-700 bg-green-50" : ""}`}>
                    {fmtFee(college1.fee)}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 1 ? "text-green-700 bg-green-50" : ""}`}>
                    {fmtFee(college2.fee)}
                  </td>
                </tr>
              );
            })()}
            {(() => {
              const fourYear = [college1.fee * 4, college2.fee * 4];
              const betterIdx = getBetterIdx(fourYear);
              return (
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-600 text-xs sticky left-0 bg-white z-10">
                    4-Year Total
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 0 ? "text-green-700 bg-green-50" : ""}`}>
                    {fmtFee(college1.fee * 4)}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 1 ? "text-green-700 bg-green-50" : ""}`}>
                    {fmtFee(college2.fee * 4)}
                  </td>
                </tr>
              );
            })()}

            {/* Cutoffs Section */}
            <tr>
              <td colSpan={3} className="px-4 py-2 bg-blue-50 font-bold text-[#1a5276] text-xs">
                EAPCET CUTOFFS (2024-25) — Lower Rank is Better
              </td>
            </tr>
            {branches.map(b => {
              const cutoffs = [college1.cutoff[b] || 0, college2.cutoff[b] || 0];
              const betterIdx = getBetterIdx(cutoffs);
              return (
                <tr key={b} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase sticky left-0 bg-white z-10">
                    {b}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 0 && college1.cutoff[b] > 0 ? "text-green-700 bg-green-50" : ""}`}>
                    {college1.cutoff[b] > 0 ? college1.cutoff[b].toLocaleString() : "—"}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 1 && college2.cutoff[b] > 0 ? "text-green-700 bg-green-50" : ""}`}>
                    {college2.cutoff[b] > 0 ? college2.cutoff[b].toLocaleString() : "—"}
                  </td>
                </tr>
              );
            })}

            {/* Placements Section */}
            <tr>
              <td colSpan={3} className="px-4 py-2 bg-blue-50 font-bold text-[#1a5276] text-xs">
                PLACEMENTS
              </td>
            </tr>
            {[
              ["Avg Package (LPA)", (c: typeof college1) => c.placements.avg > 0 ? `₹${c.placements.avg}` : "—", (c: typeof college1) => -c.placements.avg],
              ["Highest Package (L)", (c: typeof college1) => c.placements.highest > 0 ? `₹${c.placements.highest}L` : "—", (c: typeof college1) => -c.placements.highest],
              ["Companies Recruiting", (c: typeof college1) => c.placements.companies > 0 ? `${c.placements.companies}+` : "—", (c: typeof college1) => -c.placements.companies],
            ].map(([label, display, compare]) => {
              const vals = [college1, college2].map(c => (compare as (c: typeof college1) => number)(c));
              const betterIdx = vals.indexOf(Math.min(...vals));
              return (
                <tr key={label as string} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-600 text-xs sticky left-0 bg-white z-10">
                    {label as string}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 0 && college1.placements.avg > 0 ? "text-green-700 bg-green-50" : ""}`}>
                    {(display as (c: typeof college1) => string)(college1)}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-semibold ${betterIdx === 1 && college2.placements.avg > 0 ? "text-green-700 bg-green-50" : ""}`}>
                    {(display as (c: typeof college1) => string)(college2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Verdict Section */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">{college1.code} — Summary</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            {college1.fee > 0 && college1.fee < college2.fee && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>Lower annual fee ({fmtFee(college1.fee)})</span>
              </li>
            )}
            {college1.cutoff.cse > 0 && college1.cutoff.cse < college2.cutoff.cse && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>Better CSE cutoff rank ({college1.cutoff.cse.toLocaleString()})</span>
              </li>
            )}
            {college1.placements.avg > 0 && college1.placements.avg > college2.placements.avg && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>Higher average placement (₹{college1.placements.avg} LPA)</span>
              </li>
            )}
            {college1.naac !== "-" && college1.naac && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>NAAC Grade {college1.naac}</span>
              </li>
            )}
            {college1.nba && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>NBA accredited programs</span>
              </li>
            )}
            <li className="text-gray-600 text-xs pt-2 border-t border-gray-200">
              {college1.branches.slice(0, 4).join(", ")}
              {college1.branches.length > 4 ? " and more" : ""}
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">{college2.code} — Summary</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            {college2.fee > 0 && college2.fee < college1.fee && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>Lower annual fee ({fmtFee(college2.fee)})</span>
              </li>
            )}
            {college2.cutoff.cse > 0 && college2.cutoff.cse < college1.cutoff.cse && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>Better CSE cutoff rank ({college2.cutoff.cse.toLocaleString()})</span>
              </li>
            )}
            {college2.placements.avg > 0 && college2.placements.avg > college1.placements.avg && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>Higher average placement (₹{college2.placements.avg} LPA)</span>
              </li>
            )}
            {college2.naac !== "-" && college2.naac && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>NAAC Grade {college2.naac}</span>
              </li>
            )}
            {college2.nba && (
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>NBA accredited programs</span>
              </li>
            )}
            <li className="text-gray-600 text-xs pt-2 border-t border-gray-200">
              {college2.branches.slice(0, 4).join(", ")}
              {college2.branches.length > 4 ? " and more" : ""}
            </li>
          </ul>
        </div>
      </div>

      {/* SEO Comparison Paragraph */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Comparison Summary</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          {college1.name} ({college1.code}) and {college2.name} ({college2.code}) are both prominent engineering colleges
          in {college1.district === college2.district ? college1.district : `${college1.district} and ${college2.district}`}.
          {college1.fee > 0 && college2.fee > 0 && (
            <> {college1.fee < college2.fee ? college1.code : college2.code} offers a more affordable option at {fmtFee(Math.min(college1.fee, college2.fee))} annually, compared to {fmtFee(Math.max(college1.fee, college2.fee))}.
            </>
          )}
          {college1.cutoff.cse > 0 && college2.cutoff.cse > 0 && (
            <> For CSE admissions, {college1.cutoff.cse < college2.cutoff.cse ? college1.code : college2.code} has a better cutoff rank at {Math.min(college1.cutoff.cse, college2.cutoff.cse).toLocaleString()}.
            </>
          )}
          {college1.placements.avg > 0 && college2.placements.avg > 0 && (
            <> In terms of placements, {college1.placements.avg > college2.placements.avg ? college1.code : college2.code} offers a higher average package of ₹{Math.max(college1.placements.avg, college2.placements.avg)} LPA.
            </>
          )}
          Consider your priorities regarding fees, placements, and academic rankings when making your choice.
        </p>
      </div>

      {/* College Links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href={`/colleges/${college1.slug}`}
          className="block bg-[#1a5276] text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-[#2e86c1] transition-colors"
        >
          View {college1.code} Full Profile →
        </Link>
        <Link
          href={`/colleges/${college2.slug}`}
          className="block bg-[#1a5276] text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-[#2e86c1] transition-colors"
        >
          View {college2.code} Full Profile →
        </Link>
      </div>

      {/* Back to Compare */}
      <div className="text-center mb-4">
        <Link
          href="/compare"
          className="text-[#2e86c1] font-semibold hover:text-[#1a5276] transition-colors"
        >
          ← Compare Different Colleges
        </Link>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(college1.name, college2.name)),
        }}
      />
    </main>
  );
}
