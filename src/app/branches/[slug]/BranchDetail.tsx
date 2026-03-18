"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { fmtFee } from "@/lib/colleges";
import type { BranchInfo, CollegeForBranch } from "@/lib/branch-data";

const CATEGORY_COLORS: Record<string, string> = {
  "cse-family": "bg-blue-100 text-blue-700",
  core: "bg-amber-100 text-amber-700",
  emerging: "bg-purple-100 text-purple-700",
  interdisciplinary: "bg-emerald-100 text-emerald-700",
  pharma: "bg-teal-100 text-teal-700",
  medical: "bg-rose-100 text-rose-700",
  agriculture: "bg-lime-100 text-lime-700",
  other: "bg-gray-100 text-gray-600",
};

export default function BranchDetail({ branch, colleges }: { branch: BranchInfo; colleges: CollegeForBranch[] }) {
  const [stateFilter, setStateFilter] = useState<"all" | "Telangana" | "Andhra Pradesh">("all");
  const [sortBy, setSortBy] = useState<"fee" | "cutoff" | "name">("fee");
  const [typeFilter, setTypeFilter] = useState<"all" | "Government" | "Private" | "Deemed University" | "Private University">("all");

  const filtered = useMemo(() => {
    let list = colleges;
    if (stateFilter !== "all") list = list.filter(c => c.college.state === stateFilter);
    if (typeFilter !== "all") list = list.filter(c => c.college.type === typeFilter);

    return [...list].sort((a, b) => {
      if (sortBy === "fee") return a.college.fee - b.college.fee;
      if (sortBy === "cutoff") {
        if (a.hasCutoff && b.hasCutoff) return a.cutoffOC - b.cutoffOC;
        if (a.hasCutoff) return -1;
        if (b.hasCutoff) return 1;
        return a.college.fee - b.college.fee;
      }
      return a.college.name.localeCompare(b.college.name);
    });
  }, [colleges, stateFilter, sortBy, typeFilter]);

  const tsCount = colleges.filter(c => c.college.state === "Telangana").length;
  const apCount = colleges.filter(c => c.college.state === "Andhra Pradesh").length;
  const withCutoff = colleges.filter(c => c.hasCutoff).length;
  const fees = colleges.filter(c => c.college.fee > 0).map(c => c.college.fee);
  const minFee = fees.length > 0 ? Math.min(...fees) : 0;
  const maxFee = fees.length > 0 ? Math.max(...fees) : 0;
  const naacCount = colleges.filter(c => c.college.naac !== "-").length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#2e86c1]">Home</Link>
        <span>/</span>
        <Link href="/branches" className="hover:text-[#2e86c1]">Branches</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{branch.shortName}</span>
      </nav>

      {/* Header — badge wraps below on mobile */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-3xl font-bold leading-tight">{branch.name}</h1>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${CATEGORY_COLORS[branch.category] || CATEGORY_COLORS.other}`}>
            {branch.category === "cse-family" ? "Engineering — CSE" : branch.category === "core" ? "Engineering — Core" : branch.category === "interdisciplinary" ? "Engineering" : branch.category === "pharma" ? "Pharmacy" : branch.category === "medical" ? "Medical" : branch.category === "agriculture" ? "Agriculture" : "Other"}
          </span>
          <span className="text-xs text-gray-400">{colleges.length} colleges</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mt-2 max-w-3xl">{branch.description}</p>
      </div>

      {/* Quick stats — 3 cols on mobile (row 1: total/TS/AP, row 2: fees) */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-5 sm:mb-6">
        {[
          [String(colleges.length), "Total"],
          [String(tsCount), "TS"],
          [String(apCount), "AP"],
          [minFee > 0 ? fmtFee(minFee) : "—", "Lowest Fee"],
          [maxFee > 0 ? fmtFee(maxFee) : "—", "Highest Fee"],
        ].map(([value, label]) => (
          <div key={label} className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm">
            <div className="text-base sm:text-xl font-extrabold text-[#1a5276]">{value}</div>
            <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters — stack vertically on mobile */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-2 mb-4">
        {/* State toggle — full width on mobile */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
          {(["all", "Telangana", "Andhra Pradesh"] as const).map(s => (
            <button key={s} onClick={() => setStateFilter(s)}
              className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${stateFilter === s ? "bg-white text-[#1a5276] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {s === "all" ? `All (${colleges.length})` : s === "Telangana" ? `TS (${tsCount})` : `AP (${apCount})`}
            </button>
          ))}
        </div>

        {/* Dropdowns — side by side on mobile */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
            className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg border border-gray-200 text-xs font-semibold cursor-pointer bg-white">
            <option value="all">All Types</option>
            <option value="Government">Govt</option>
            <option value="Private">Private</option>
            <option value="Deemed University">Deemed</option>
            <option value="Private University">Pvt Uni</option>
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg border border-gray-200 text-xs font-semibold cursor-pointer bg-white">
            <option value="fee">Fee ↑</option>
            <option value="cutoff">Cutoff (best)</option>
            <option value="name">Name A→Z</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs sm:text-sm text-gray-500 mb-3">
        {filtered.length} college{filtered.length !== 1 ? "s" : ""}
        {withCutoff > 0 && <span className="text-blue-500 ml-1">· {withCutoff} with cutoffs</span>}
      </div>

      {/* College list — mobile-optimised card layout */}
      <div className="space-y-2">
        {filtered.map(({ college: col, cutoffOC, hasCutoff }) => (
          <Link key={col.id} href={`/colleges/${col.slug}`}
            className="block px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-blue-50/50 transition-all active:bg-blue-50">
            {/* Top row: name */}
            <div className="font-semibold text-[13px] sm:text-sm text-gray-900 leading-snug">{col.name}</div>
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-gray-400 mt-1">
              <span>{col.district}, {col.state === "Telangana" ? "TS" : "AP"}</span>
              <span>·</span>
              <span>{col.type === "Private University" ? "Pvt Uni" : col.type === "Deemed University" ? "Deemed" : col.type}</span>
              {col.naac !== "-" && (
                <>
                  <span>·</span>
                  <span className="text-green-600 font-semibold">NAAC {col.naac}</span>
                </>
              )}
              {col.nirf > 0 && (
                <>
                  <span>·</span>
                  <span className="text-purple-600 font-semibold">NIRF {col.nirf}</span>
                </>
              )}
            </div>
            {/* Bottom row: fee + cutoff as inline chips */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[11px] font-semibold text-[#1a5276]">
                {col.fee > 0 ? fmtFee(col.fee) : "—"}<span className="text-[10px] font-normal text-gray-400">/yr</span>
              </span>
              {hasCutoff && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-[11px] font-semibold text-gray-600">
                  OC {cutoffOC.toLocaleString()}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="font-semibold">No colleges found</p>
          <p className="text-xs mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* SEO footer text */}
      <section className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">{branch.name} Colleges in Telangana & Andhra Pradesh</h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          There are {colleges.length} engineering colleges offering {branch.name} ({branch.shortName}) across Telangana ({tsCount} colleges) and Andhra Pradesh ({apCount} colleges).
          {minFee > 0 && ` Convener quota fees range from ${fmtFee(minFee)} to ${fmtFee(maxFee)} per year.`}
          {withCutoff > 0 && ` We have EAPCET cutoff rank data for ${withCutoff} of these colleges, sourced from official TSCHE and APSCHE last rank statement PDFs.`}
          {naacCount > 0 && ` ${naacCount} colleges have NAAC accreditation.`}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
          Click on any college to view detailed fee breakdowns, EAPCET cutoff ranks by category, placement statistics, and scholarship information.
        </p>
      </section>
    </main>
  );
}
