import type { Metadata } from "next";
import Link from "next/link";
import { BRANCHES, getCollegesForBranch } from "@/lib/branch-data";
import { getAllPrograms } from "@/lib/program-data";
import { fmtFee } from "@/lib/colleges";

export const metadata: Metadata = {
  title: "Engineering Branches — CSE, ECE, EEE & More | TeluguColleges",
  description: "Explore all B.Tech branches offered in AP & Telangana colleges — fees, scope, placements, and top colleges for each branch.",
  openGraph: {
    title: "Engineering Branches — CSE, ECE, EEE & More | TeluguColleges",
    description: "Explore all B.Tech branches offered in AP & Telangana colleges — fees, scope, placements, and top colleges for each branch.",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
};

const CATEGORY_META: Record<string, { label: string; subtitle: string; color: string; icon: string }> = {
  "cse-family": { label: "Computer Science & IT", subtitle: "Engineering", color: "border-l-blue-500", icon: "💻" },
  core: { label: "Core Engineering", subtitle: "Engineering", color: "border-l-amber-500", icon: "⚙️" },
  interdisciplinary: { label: "Interdisciplinary & Emerging", subtitle: "Engineering", color: "border-l-emerald-500", icon: "🔬" },
  medical: { label: "Medical", subtitle: "Medical", color: "border-l-rose-500", icon: "🏥" },
  pharma: { label: "Pharmacy", subtitle: "Pharmacy", color: "border-l-teal-500", icon: "💊" },
  agriculture: { label: "Agriculture & Food Technology", subtitle: "Agriculture", color: "border-l-lime-500", icon: "🌾" },
};

// Programs that are NOT covered by branches (degree types rather than specialisations)
const PROGRAM_CATEGORY_META: Record<string, { label: string; color: string; icon: string }> = {
  Management: { label: "Management & Business", color: "border-l-amber-500", icon: "📊" },
  Science: { label: "Science & Arts", color: "border-l-emerald-500", icon: "🔬" },
  Other: { label: "Other Programmes", color: "border-l-gray-400", icon: "📚" },
};

// Engineering programs already covered by branches — exclude from programs section
const BRANCH_COVERED_PROGRAMS = new Set(["B.Tech", "B.E.", "B.Pharm", "M.Pharm", "Pharm.D", "MBBS"]);
// Postgraduate engineering shown separately
const PG_ENGINEERING = new Set(["M.Tech", "M.E.", "Dual Degree (B.Tech + M.S.)", "Polytechnic Diploma"]);

export default function BranchesPage() {
  const categories = new Map<string, typeof enriched>();

  const enriched = BRANCHES.map(b => {
    const colleges = getCollegesForBranch(b.code);
    const fees = colleges.filter(c => c.college.fee > 0).map(c => c.college.fee);
    return {
      ...b,
      count: colleges.length,
      withCutoff: colleges.filter(c => c.hasCutoff).length,
      minFee: fees.length > 0 ? Math.min(...fees) : 0,
    };
  });

  for (const b of enriched) {
    if (!categories.has(b.category)) categories.set(b.category, []);
    categories.get(b.category)!.push(b);
  }

  // Get programs not covered by branches
  const allPrograms = getAllPrograms();
  const extraPrograms = allPrograms.filter(p => !BRANCH_COVERED_PROGRAMS.has(p.name));
  const pgEngineering = extraPrograms.filter(p => PG_ENGINEERING.has(p.name));
  const managementPrograms = extraPrograms.filter(p => p.category === "Management");
  const sciencePrograms = extraPrograms.filter(p => p.category === "Science");
  const otherPrograms = extraPrograms.filter(p => p.category === "Other" || (p.category === "Engineering" && !PG_ENGINEERING.has(p.name) && !BRANCH_COVERED_PROGRAMS.has(p.name)));

  const totalCount = enriched.length + extraPrograms.length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <nav className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#2e86c1]">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Branches & Programmes</span>
      </nav>

      <h1 className="text-xl sm:text-3xl font-bold mb-1">All Branches & Programmes</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
        Explore {totalCount}+ programmes across engineering, medical, pharmacy, management & more in Telangana & Andhra Pradesh.
        Tap any branch to see colleges, fees, and cutoff ranks.
      </p>

      <div className="space-y-10 sm:space-y-14">
        {/* Branch categories under parent headings */}
        {([
          { heading: "Engineering", cats: ["cse-family", "core", "interdisciplinary"] },
          { heading: "Medical", cats: ["medical"] },
          { heading: "Pharmacy", cats: ["pharma"] },
          { heading: "Agriculture & Food Technology", cats: ["agriculture"] },
        ] as { heading: string; cats: string[] }[]).map(group => {
          const groupCats = group.cats.filter(c => categories.has(c));
          if (groupCats.length === 0) return null;
          return (
            <div key={group.heading}>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-5 sm:mb-6 pb-2 border-b-2 border-gray-200">
                {group.heading}
              </h2>

              <div className="space-y-8 sm:space-y-10">
                {groupCats.map(cat => {
                  const branches = categories.get(cat)!;
                  const meta = CATEGORY_META[cat] || { label: cat, subtitle: "", color: "border-l-gray-400", icon: "📚" };
                  return (
                    <section key={cat}>
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <span className="text-lg sm:text-xl">{meta.icon}</span>
                        <h3 className="text-sm sm:text-base font-bold text-gray-700">{meta.label}</h3>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {branches.map(b => (
                          <Link key={b.slug} href={`/branches/${b.slug}`}
                            className={`block bg-white rounded-xl p-3 sm:p-4 shadow-sm border-l-4 ${meta.color} hover:shadow-md hover:bg-blue-50/30 transition-all active:bg-blue-50`}>
                            <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                              <div className="min-w-0">
                                <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">{b.shortName}</div>
                                <div className="text-[9px] sm:text-[11px] text-gray-400 leading-tight line-clamp-2">{b.name}</div>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-[#2e86c1] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                                {b.count}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-1.5 text-[9px] sm:text-[11px] text-gray-400">
                              {b.minFee > 0 && <span>From {fmtFee(b.minFee)}</span>}
                              {b.withCutoff > 0 && <span>· {b.withCutoff} cutoffs</span>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Postgraduate Engineering */}
        {pgEngineering.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-5 sm:mb-6 pb-2 border-b-2 border-gray-200">
              Postgraduate & Diploma (Engineering)
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {pgEngineering.map(p => (
                <Link key={p.slug} href={`/programs/${p.slug}`}
                  className="block bg-white rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-l-indigo-500 hover:shadow-md hover:bg-blue-50/30 transition-all active:bg-blue-50">
                  <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">{p.name}</div>
                      <div className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">{p.level} · {p.duration} {p.duration === 1 ? "yr" : "yrs"}</div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#2e86c1] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      {p.collegeCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 text-[10px] sm:text-[11px] text-gray-400">
                    <span>From {fmtFee(p.feeMin)}</span>
                    <span>· Median {fmtFee(p.feeMedian)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Management & Business */}
        {managementPrograms.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-5 sm:mb-6 pb-2 border-b-2 border-gray-200">
              Management & Business
            </h2>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-lg sm:text-xl">📊</span>
              <h3 className="text-sm sm:text-base font-bold text-gray-700">MBA, MCA, BBA & More</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {managementPrograms.map(p => (
                <Link key={p.slug} href={`/programs/${p.slug}`}
                  className="block bg-white rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-l-amber-500 hover:shadow-md hover:bg-blue-50/30 transition-all active:bg-blue-50">
                  <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">{p.name}</div>
                      <div className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">{p.level} · {p.duration} {p.duration === 1 ? "yr" : "yrs"}</div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#2e86c1] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      {p.collegeCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 text-[10px] sm:text-[11px] text-gray-400">
                    <span>From {fmtFee(p.feeMin)}</span>
                    <span>· Median {fmtFee(p.feeMedian)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Science & Arts */}
        {sciencePrograms.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-5 sm:mb-6 pb-2 border-b-2 border-gray-200">
              Science & Arts
            </h2>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-lg sm:text-xl">🔬</span>
              <h3 className="text-sm sm:text-base font-bold text-gray-700">B.Sc, B.Com, BA & More</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {sciencePrograms.map(p => (
                <Link key={p.slug} href={`/programs/${p.slug}`}
                  className="block bg-white rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-l-emerald-500 hover:shadow-md hover:bg-blue-50/30 transition-all active:bg-blue-50">
                  <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">{p.name}</div>
                      <div className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">{p.level} · {p.duration} {p.duration === 1 ? "yr" : "yrs"}</div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#2e86c1] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      {p.collegeCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 text-[10px] sm:text-[11px] text-gray-400">
                    <span>From {fmtFee(p.feeMin)}</span>
                    <span>· Median {fmtFee(p.feeMedian)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Programmes */}
        {otherPrograms.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-5 sm:mb-6 pb-2 border-b-2 border-gray-200">
              Other Programmes
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {otherPrograms.map(p => (
                <Link key={p.slug} href={`/programs/${p.slug}`}
                  className="block bg-white rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-l-gray-400 hover:shadow-md hover:bg-blue-50/30 transition-all active:bg-blue-50">
                  <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">{p.name}</div>
                      <div className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">{p.level} · {p.duration} {p.duration === 1 ? "yr" : "yrs"}</div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#2e86c1] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      {p.collegeCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 text-[10px] sm:text-[11px] text-gray-400">
                    <span>From {fmtFee(p.feeMin)}</span>
                    <span>· Median {fmtFee(p.feeMedian)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
