"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { COLLEGES, fmtFee, College } from "@/lib/colleges";
import AdSlot from "@/components/ads/AdSlot";
import ShortlistButton from "@/components/ShortlistButton";
import { isEngineeringCollege, isPharmacyCollege, isMedicalCollege } from "@/lib/branch-constants";

function nirfLabel(rank: number): string {
  if (rank <= 0) return "";
  if (rank <= 100) return `#${rank}`;
  if (rank <= 150) return "101-150";
  if (rank <= 200) return "151-200";
  return "201-300";
}

const SECTIONS: { key: College["type"]; label: string; color: string; border: string; bg: string; desc: string }[] = [
  { key: "Deemed University", label: "Deemed Universities", color: "text-amber-700", border: "border-l-amber-500", bg: "bg-amber-50", desc: "UGC-recognised deemed-to-be universities with full autonomy over admissions, curriculum, and fees" },
  { key: "Private University", label: "Private State Universities", color: "text-violet-700", border: "border-l-violet-500", bg: "bg-violet-50", desc: "Established by state legislation with authority to grant their own degrees" },
  { key: "Government", label: "Government Colleges", color: "text-green-700", border: "border-l-green-500", bg: "bg-green-50", desc: "State-funded university colleges with the lowest fee structures" },
  { key: "Private", label: "Private Affiliated Colleges", color: "text-blue-700", border: "border-l-[#2e86c1]", bg: "bg-blue-50", desc: "Private unaided colleges affiliated to state universities, with fees regulated by government orders" },
];

/* Unique districts & affiliations for filter dropdowns */
const ALL_DISTRICTS = [...new Set(COLLEGES.map(c => c.district))].sort();
const ALL_AFFILIATIONS = [...new Set(COLLEGES.map(c => c.affiliation))].sort();

const CollegeCard = React.memo(function CollegeCard({ c, borderClass }: { c: College; borderClass: string }) {
  const feeLabel = (c.type === "Deemed University" || c.type === "Private University" || c.type === "Government") ? "Tuition/yr" : "Convener Fee";
  return (
    <div className={`relative bg-white rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-sm hover:shadow-md transition-all border-l-4 ${borderClass}`}>
      {/* Full-card link — covers entire card for navigation */}
      <Link href={`/colleges/${c.slug}`} className="absolute inset-0 z-0 rounded-xl" aria-label={c.name} />
      {/* Shortlist button — positioned outside the Link DOM to avoid iOS Safari tap conflicts */}
      <div className="absolute top-2 right-2 z-10">
        <ShortlistButton collegeSlug={c.slug} />
      </div>
      {/* Desktop: side-by-side | Mobile: stacked */}
      <div className="relative z-[1] pointer-events-none flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm sm:text-[15px] leading-tight pr-10">{c.name}</div>
          <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">{c.district}, {c.state} · {c.affiliation} · Est. {c.year}</div>
          <div className="flex gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
            <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold ${c.type === "Government" ? "bg-green-50 text-green-600" : c.type === "Deemed University" ? "bg-amber-50 text-amber-700" : c.type === "Private University" ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-600"}`}>{c.type}</span>
            {c.nirf > 0 && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-600">NIRF {nirfLabel(c.nirf)}</span>}
            {c.naac && c.naac !== "-" && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-amber-50 text-amber-600">NAAC {c.naac}</span>}
            {c.nba && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-purple-50 text-purple-600">NBA</span>}
            {c.branches.includes("B.Pharm") && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-teal-50 text-teal-600">Pharmacy</span>}
            {c.branches.includes("MBBS") && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-rose-50 text-rose-600">Medical</span>}
          </div>
        </div>
        {/* Stats: 4-col on mobile (full-width row below), 4-col on desktop (fixed-width right side) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0 sm:w-[320px]">
          <div>
            <div className="text-[10px] sm:text-xs text-gray-400">{feeLabel}</div>
            <div className="font-bold text-[#1a5276] text-xs sm:text-sm">{fmtFee(c.fee)}</div>
          </div>
          <div>
            {c.cutoff.cse > 0 ? (
              <>
                <div className="text-[10px] sm:text-xs text-gray-400">CSE Cutoff</div>
                <div className="font-bold text-xs sm:text-sm">{c.cutoff.cse.toLocaleString()}</div>
              </>
            ) : c.branches.includes("B.Pharm") ? (
              <>
                <div className="text-[10px] sm:text-xs text-gray-400">Type</div>
                <div className="font-bold text-teal-600 text-xs sm:text-sm">Pharmacy</div>
              </>
            ) : c.branches.includes("MBBS") ? (
              <>
                <div className="text-[10px] sm:text-xs text-gray-400">Type</div>
                <div className="font-bold text-rose-600 text-xs sm:text-sm">Medical</div>
              </>
            ) : (
              <>
                <div className="text-[10px] sm:text-xs text-gray-400">CSE Cutoff</div>
                <div className="font-bold text-gray-300 text-xs sm:text-sm">—</div>
              </>
            )}
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-gray-400">Avg Pkg</div>
            <div className={`font-bold text-xs sm:text-sm ${c.placements.avg > 0 ? "text-green-600" : "text-gray-300"}`}>
              {c.placements.avg > 0 ? `₹${c.placements.avg}L` : "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-gray-400">Highest</div>
            <div className={`font-bold text-xs sm:text-sm ${c.placements.highest > 0 ? "text-amber-600" : "text-gray-300"}`}>
              {c.placements.highest > 0 ? `₹${c.placements.highest}L` : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

function CollegesPageInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [naac, setNaac] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const [activeSection, setActiveSection] = useState<string | "">("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && ["engineering", "pharmacy", "medical"].includes(cat)) {
      setCategory(cat);
    }
  }, [searchParams]);

  const hasActiveFilters = !!(state || district || affiliation || maxFee || naac || search || category);

  const filtered = useMemo(() => {
    let list = COLLEGES.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.district.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
      if (state && c.state !== state) return false;
      if (district && c.district !== district) return false;
      if (affiliation && c.affiliation !== affiliation) return false;
      if (activeSection && c.type !== activeSection) return false;
      if (maxFee && c.fee > parseInt(maxFee)) return false;
      if (naac === "rated" && (!c.naac || c.naac === "-")) return false;
      if (naac === "A+" && c.naac !== "A+" && c.naac !== "A++") return false;
      if (naac === "A" && c.naac !== "A" && c.naac !== "A+" && c.naac !== "A++") return false;
      if (category === "engineering" && !isEngineeringCollege(c.branches)) return false;
      if (category === "pharmacy" && !isPharmacyCollege(c.branches)) return false;
      if (category === "medical" && !isMedicalCollege(c.branches)) return false;
      return true;
    });
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "fee_low") list.sort((a, b) => a.fee - b.fee);
    if (sort === "fee_high") list.sort((a, b) => b.fee - a.fee);
    if (sort === "placements") list.sort((a, b) => b.placements.avg - a.placements.avg);
    if (sort === "cutoff") list.sort((a, b) => {
      if (!a.cutoff.cse && !b.cutoff.cse) return 0;
      if (!a.cutoff.cse) return 1;
      if (!b.cutoff.cse) return -1;
      return a.cutoff.cse - b.cutoff.cse;
    });
    if (sort === "nirf") list.sort((a, b) => {
      if (a.nirf === 0 && b.nirf === 0) return 0;
      if (a.nirf === 0) return 1;
      if (b.nirf === 0) return -1;
      return a.nirf - b.nirf;
    });
    return list;
  }, [search, state, district, affiliation, activeSection, maxFee, naac, category, sort]);

  const grouped = useMemo(() => {
    if (activeSection) return null;
    const map = new Map<string, College[]>();
    SECTIONS.forEach(s => map.set(s.key, []));
    filtered.forEach(c => { const arr = map.get(c.type); if (arr) arr.push(c); });
    return map;
  }, [filtered, activeSection]);

  const sel = "px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer";

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    const subset = state ? COLLEGES.filter(c => c.state === state) : COLLEGES;
    subset.forEach(c => { m[c.type] = (m[c.type] || 0) + 1; });
    return m;
  }, [state]);

  const districtOptions = useMemo(() => {
    const cs = state ? COLLEGES.filter(c => c.state === state) : COLLEGES;
    return [...new Set(cs.map(c => c.district))].sort();
  }, [state]);

  const clearAll = () => { setState(""); setDistrict(""); setAffiliation(""); setMaxFee(""); setNaac(""); setCategory(""); setSearch(""); };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/">Home</Link><span>/</span><span className="text-gray-600 font-medium">Colleges</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">College Directory</h1>
      <p className="text-sm text-gray-500 mb-4">{COLLEGES.length} engineering, pharmacy & medical colleges across Andhra Pradesh & Telangana</p>

      {/* Block Period Info */}
      {(!state || state === "Telangana" || state === "Andhra Pradesh") && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4">
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">📋</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-700 mb-1">Fee Block Period — Private Affiliated Colleges</div>
              <div className="space-y-1">
                {(!state || state === "Telangana") && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-[#2e86c1]">Telangana:</span>{" "}
                    G.O.Ms.No.06 block period <span className="font-semibold">2025–2028</span> — TSCHE-approved tuition fees fixed for 3 years for all private unaided colleges affiliated to JNTUH, OU, and KU.
                  </div>
                )}
                {(!state || state === "Andhra Pradesh") && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-green-700">Andhra Pradesh:</span>{" "}
                    APHERMC block period <span className="font-semibold">2023–2026</span> — Fee structure regulated by AP Higher Education Regulatory and Monitoring Commission for all private unaided colleges affiliated to JNTUK and JNTUA.
                  </div>
                )}
              </div>
              <div className="text-[10px] text-gray-400 mt-1.5">Fees shown for private affiliated colleges are convener-quota (category-A) rates as per the applicable block period GO.</div>
            </div>
          </div>
        </div>
      )}

      {/* State Toggle */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button onClick={() => { setState(""); setDistrict(""); }}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${!state ? "bg-[#1a5276] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          All States
        </button>
        <button onClick={() => { setState(state === "Andhra Pradesh" ? "" : "Andhra Pradesh"); setDistrict(""); }}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${state === "Andhra Pradesh" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
          AP ({COLLEGES.filter(c => c.state === "Andhra Pradesh").length})
        </button>
        <button onClick={() => { setState(state === "Telangana" ? "" : "Telangana"); setDistrict(""); }}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${state === "Telangana" ? "bg-[#2e86c1] text-white" : "bg-blue-50 text-[#2e86c1] hover:bg-blue-100"}`}>
          Telangana ({COLLEGES.filter(c => c.state === "Telangana").length})
        </button>
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button onClick={() => setCategory("")}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${!category ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          All
        </button>
        <button onClick={() => setCategory(category === "engineering" ? "" : "engineering")}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${category === "engineering" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}>
          Engineering
        </button>
        <button onClick={() => setCategory(category === "pharmacy" ? "" : "pharmacy")}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${category === "pharmacy" ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-700 hover:bg-teal-100"}`}>
          Pharmacy
        </button>
        <button onClick={() => setCategory(category === "medical" ? "" : "medical")}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${category === "medical" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`}>
          Medical
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button onClick={() => setActiveSection("")}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${!activeSection ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          All ({state ? COLLEGES.filter(c => c.state === state).length : COLLEGES.length})
        </button>
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setActiveSection(activeSection === s.key ? "" : s.key)}
            className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${activeSection === s.key ? "bg-gray-800 text-white" : `${s.bg} ${s.color} hover:opacity-80`}`}>
            {s.label} ({counts[s.key] || 0})
          </button>
        ))}
      </div>

      {/* Search + Sort row */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, district, or code..." aria-label="Search colleges by name, district, or code" className="w-full sm:flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          <div className="flex gap-2 sm:gap-3">
            <select value={sort} onChange={e => setSort(e.target.value)} className={`${sel} font-semibold flex-1 sm:flex-none text-xs sm:text-sm`}>
              <option value="name">Sort: Name</option>
              <option value="fee_low">Fee ↑</option>
              <option value="fee_high">Fee ↓</option>
              <option value="placements">Placements</option>
              <option value="cutoff">CSE Cutoff</option>
              <option value="nirf">NIRF Rank</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${showFilters || hasActiveFilters ? "bg-[#2e86c1] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Filters {hasActiveFilters ? `(${[state, district, affiliation, maxFee, naac, category].filter(Boolean).length})` : ""}
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">State</label>
                <select value={state} onChange={e => { setState(e.target.value); setDistrict(""); }} className={`${sel} w-full`}>
                  <option value="">All States</option>
                  <option>Telangana</option>
                  <option>Andhra Pradesh</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">District</label>
                <select value={district} onChange={e => setDistrict(e.target.value)} className={`${sel} w-full`}>
                  <option value="">All Districts</option>
                  {districtOptions.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">University</label>
                <select value={affiliation} onChange={e => setAffiliation(e.target.value)} className={`${sel} w-full`}>
                  <option value="">All Universities</option>
                  {ALL_AFFILIATIONS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Max Fee</label>
                <select value={maxFee} onChange={e => setMaxFee(e.target.value)} className={`${sel} w-full`}>
                  <option value="">Any Fee</option>
                  <option value="50000">Under ₹50K</option>
                  <option value="100000">Under ₹1L</option>
                  <option value="150000">Under ₹1.5L</option>
                  <option value="200000">Under ₹2L</option>
                  <option value="500000">Under ₹5L</option>
                  <option value="1000000">Under ₹10L</option>
                  <option value="2000000">Under ₹20L</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">NAAC</label>
                <select value={naac} onChange={e => setNaac(e.target.value)} className={`${sel} w-full`}>
                  <option value="">Any</option>
                  <option value="rated">NAAC Rated</option>
                  <option value="A+">A++ Only</option>
                  <option value="A">A+ & A</option>
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearAll} className="mt-3 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100">Clear all filters</button>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500 font-semibold mb-4">{filtered.length} colleges found</div>

      {/* Ad: Top of listing */}
      <div className="mb-4">
        <AdSlot slot="listing_top" state={state || undefined} />
      </div>

      {/* Grouped View (when no section filter active) */}
      {grouped ? (
        <div className="space-y-8">
          {SECTIONS.map((s, sectionIdx) => {
            const items = grouped.get(s.key) || [];
            if (items.length === 0) return null;
            return (
              <section key={s.key}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className={`text-lg font-bold ${s.color}`}>{s.label}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{s.desc}</p>
                <div className="space-y-3">
                  {items.map(c => <CollegeCard key={c.id} c={c} borderClass={s.border} />)}
                </div>
                {/* Ad: Between sections */}
                {sectionIdx === 1 && (
                  <div className="mt-6">
                    <AdSlot slot="listing_mid" state={state || undefined} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* Flat View (when a section filter is active) */
        <div className="space-y-3">
          {filtered.map(c => {
            const s = SECTIONS.find(s => s.key === c.type);
            return <CollegeCard key={c.id} c={c} borderClass={s?.border || "border-l-gray-300"} />;
          })}
        </div>
      )}

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

export default function CollegesPage() {
  return (
    <Suspense>
      <CollegesPageInner />
    </Suspense>
  );
}
