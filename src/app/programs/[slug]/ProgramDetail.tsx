"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { ProgramSummary, CollegeProgram } from "@/lib/program-data";
import { fmtFee } from "@/lib/colleges";

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: "text-indigo-700",
  Pharmacy: "text-teal-700",
  Medical: "text-rose-700",
  Management: "text-amber-700",
  Science: "text-emerald-700",
  Other: "text-gray-700",
};

export default function ProgramDetail({ program, colleges }: { program: ProgramSummary; colleges: CollegeProgram[] }) {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [sort, setSort] = useState("fee_low");
  const [showFilters, setShowFilters] = useState(false);

  const districts = useMemo(() => {
    const cs = state ? colleges.filter(c => c.college.state === state) : colleges;
    return [...new Set(cs.map(c => c.college.district))].sort();
  }, [colleges, state]);

  const types = useMemo(() => [...new Set(colleges.map(c => c.college.type))].sort(), [colleges]);

  const filtered = useMemo(() => {
    let list = colleges.filter(cp => {
      if (search) {
        const q = search.toLowerCase();
        if (!cp.college.name.toLowerCase().includes(q) && !cp.college.district.toLowerCase().includes(q) && !cp.college.code.toLowerCase().includes(q)) return false;
      }
      if (state && cp.college.state !== state) return false;
      if (district && cp.college.district !== district) return false;
      if (collegeType && cp.college.type !== collegeType) return false;
      return true;
    });

    if (sort === "fee_low") list.sort((a, b) => a.fee - b.fee);
    else if (sort === "fee_high") list.sort((a, b) => b.fee - a.fee);
    else if (sort === "name") list.sort((a, b) => a.college.name.localeCompare(b.college.name));
    else if (sort === "district") list.sort((a, b) => a.college.district.localeCompare(b.college.district));

    return list;
  }, [colleges, search, state, district, collegeType, sort]);

  const hasFilters = !!(search || state || district || collegeType);
  const clearAll = () => { setSearch(""); setState(""); setDistrict(""); setCollegeType(""); };

  const apCount = colleges.filter(c => c.college.state === "Andhra Pradesh").length;
  const tsCount = colleges.filter(c => c.college.state === "Telangana").length;

  const sel = "px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/programs">Programs</Link><span>/</span>
        <span className="text-gray-600 font-medium">{program.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{program.name}</h1>
          <span className={`text-sm font-semibold ${CATEGORY_COLORS[program.category] || "text-gray-600"}`}>{program.category}</span>
        </div>
        <p className="text-sm text-gray-500">
          {program.level} · {program.duration} {program.duration === 1 ? "year" : "years"} · Offered at {program.collegeCount} colleges
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs text-gray-400 mb-1">Lowest Fee</div>
          <div className="font-bold text-lg text-green-600">{fmtFee(program.feeMin)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs text-gray-400 mb-1">Median Fee</div>
          <div className="font-bold text-lg text-[#1a5276]">{fmtFee(program.feeMedian)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs text-gray-400 mb-1">Highest Fee</div>
          <div className="font-bold text-lg text-rose-600">{fmtFee(program.feeMax)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs text-gray-400 mb-1">Total Colleges</div>
          <div className="font-bold text-lg">{program.collegeCount}</div>
        </div>
      </div>

      {/* State Toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setState(""); setDistrict(""); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!state ? "bg-[#1a5276] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          All ({colleges.length})
        </button>
        <button onClick={() => { setState(state === "Andhra Pradesh" ? "" : "Andhra Pradesh"); setDistrict(""); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${state === "Andhra Pradesh" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
          AP ({apCount})
        </button>
        <button onClick={() => { setState(state === "Telangana" ? "" : "Telangana"); setDistrict(""); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${state === "Telangana" ? "bg-[#2e86c1] text-white" : "bg-blue-50 text-[#2e86c1] hover:bg-blue-100"}`}>
          TS ({tsCount})
        </button>
      </div>

      {/* Search + Sort + Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search college name, district, or code..."
            aria-label="Search colleges by name, district, or code"
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          <select value={sort} onChange={e => setSort(e.target.value)} className={`${sel} font-semibold`}>
            <option value="fee_low">Fee: Low → High</option>
            <option value="fee_high">Fee: High → Low</option>
            <option value="name">Name: A → Z</option>
            <option value="district">District</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${showFilters || hasFilters ? "bg-[#2e86c1] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            Filters {hasFilters ? `(${[state, district, collegeType].filter(Boolean).length})` : ""}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">District</label>
                <select value={district} onChange={e => setDistrict(e.target.value)} className={`${sel} w-full`}>
                  <option value="">All Districts</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">College Type</label>
                <select value={collegeType} onChange={e => setCollegeType(e.target.value)} className={`${sel} w-full`}>
                  <option value="">All Types</option>
                  {types.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearAll} className="mt-3 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100">Clear all filters</button>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500 font-semibold mb-4">{filtered.length} colleges found</div>

      {/* College List */}
      <div className="space-y-2">
        {filtered.map((cp, i) => {
          const c = cp.college;
          const typeColor = c.type === "Government" ? "bg-green-50 text-green-600" :
            c.type === "Deemed University" ? "bg-amber-50 text-amber-700" :
            c.type === "Private University" ? "bg-violet-50 text-violet-700" :
            "bg-blue-50 text-blue-600";

          return (
            <Link key={`${c.id}-${i}`} href={`/colleges/${c.slug}`}
              className="flex flex-wrap gap-4 items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex-1 min-w-[240px]">
                <div className="font-bold text-[15px] leading-tight">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {c.district}, {c.state} · {c.affiliation}
                </div>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${typeColor}`}>{c.type}</span>
                  {c.naac && c.naac !== "-" && <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-600">NAAC {c.naac}</span>}
                  {cp.specialization && <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-500">{cp.specialization}</span>}
                </div>
              </div>
              <div className="flex gap-6 items-center shrink-0">
                <div className="text-center">
                  <div className="text-[11px] text-gray-400">{cp.mgmtFee && cp.mgmtFee < cp.fee ? "Direct Admission" : "Convener Fee"}</div>
                  <div className="font-bold text-[#1a5276] text-lg">{fmtFee(cp.fee)}</div>
                </div>
                {cp.mgmtFee && cp.mgmtFee > cp.fee && (
                  <div className="text-center">
                    <div className="text-[11px] text-orange-400">Mgmt Quota</div>
                    <div className="font-bold text-orange-500">{fmtFee(cp.mgmtFee)}</div>
                  </div>
                )}
                {cp.mgmtFee && cp.mgmtFee < cp.fee && (
                  <div className="text-center">
                    <div className="text-[11px] text-green-500">With Entrance</div>
                    <div className="font-bold text-green-600">{fmtFee(cp.mgmtFee)}</div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <div className="text-lg font-semibold">No colleges match your filters</div>
          <button onClick={clearAll} className="mt-2 text-sm text-[#2e86c1] font-semibold hover:underline">Clear all filters</button>
        </div>
      )}
    </main>
  );
}
