"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Landmark, SearchX } from "lucide-react";
import { COLLEGES, fmtFee, College } from "@/lib/colleges";
import AdSlot from "@/components/ads/AdSlot";

const UNIVERSITIES = COLLEGES.filter(
  (c) => c.type === "Deemed University" || c.type === "Private University"
);

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
];

const ALL_DISTRICTS = [...new Set(UNIVERSITIES.map((c) => c.district))].sort();

function UniCard({ c, borderClass }: { c: College; borderClass: string }) {
  return (
    <Link
      href={`/colleges/${c.slug}`}
      className={`block bg-white rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-sm hover:shadow-md transition-all border-l-4 ${borderClass}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm sm:text-[15px] leading-tight">{c.name}</div>
          <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
            {c.district}, {c.state} · Est. {c.year}
          </div>
          <div className="flex gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
            <span
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold ${
                c.type === "Deemed University"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-violet-50 text-violet-700"
              }`}
            >
              {c.type}
            </span>
            {c.nirf > 0 && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-600">
                NIRF {nirfLabel(c.nirf)}
              </span>
            )}
            {c.naac && c.naac !== "-" && c.naac !== "N/A" && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-amber-50 text-amber-600">
                NAAC {c.naac}
              </span>
            )}
            {c.nba && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-purple-50 text-purple-600">
                NBA
              </span>
            )}
            {c.branches.includes("B.Pharm") && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-teal-50 text-teal-600">
                Pharmacy
              </span>
            )}
            {c.branches.includes("MBBS") && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-600">
                Medical
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0 sm:w-[320px]">
          <div>
            <div className="text-[10px] sm:text-[11px] text-gray-400">Tuition/yr</div>
            <div className="font-bold text-[#1a5276] text-xs sm:text-sm">{fmtFee(c.fee)}</div>
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] text-gray-400">Branches</div>
            <div className="font-bold text-xs sm:text-sm">{c.branches.length}</div>
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] text-gray-400">Avg Pkg</div>
            <div
              className={`font-bold text-xs sm:text-sm ${
                c.placements.avg > 0 ? "text-green-600" : "text-gray-300"
              }`}
            >
              {c.placements.avg > 0 ? `₹${c.placements.avg}L` : "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] text-gray-400">Highest</div>
            <div
              className={`font-bold text-xs sm:text-sm ${
                c.placements.highest > 0 ? "text-amber-600" : "text-gray-300"
              }`}
            >
              {c.placements.highest > 0 ? `₹${c.placements.highest}L` : "—"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [activeSection, setActiveSection] = useState<string | "">("");
  const [sort, setSort] = useState("name");

  const districtOptions = useMemo(() => {
    const cs = state ? UNIVERSITIES.filter((c) => c.state === state) : UNIVERSITIES;
    return [...new Set(cs.map((c) => c.district))].sort();
  }, [state]);

  const filtered = useMemo(() => {
    let list = UNIVERSITIES.filter((c) => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.district.toLowerCase().includes(search.toLowerCase()) &&
        !c.code.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (state && c.state !== state) return false;
      if (district && c.district !== district) return false;
      if (activeSection && c.type !== activeSection) return false;
      return true;
    });
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "fee_low") list.sort((a, b) => a.fee - b.fee);
    if (sort === "fee_high") list.sort((a, b) => b.fee - a.fee);
    if (sort === "placements") list.sort((a, b) => b.placements.avg - a.placements.avg);
    if (sort === "nirf")
      list.sort((a, b) => {
        if (a.nirf === 0 && b.nirf === 0) return 0;
        if (a.nirf === 0) return 1;
        if (b.nirf === 0) return -1;
        return a.nirf - b.nirf;
      });
    return list;
  }, [search, state, district, activeSection, sort]);

  const grouped = useMemo(() => {
    if (activeSection) return null;
    const map = new Map<string, College[]>();
    SECTIONS.forEach((s) => map.set(s.key, []));
    filtered.forEach((c) => {
      const arr = map.get(c.type);
      if (arr) arr.push(c);
    });
    return map;
  }, [filtered, activeSection]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    const subset = state ? UNIVERSITIES.filter((c) => c.state === state) : UNIVERSITIES;
    subset.forEach((c) => {
      m[c.type] = (m[c.type] || 0) + 1;
    });
    return m;
  }, [state]);

  const clearAll = () => {
    setState("");
    setDistrict("");
    setSearch("");
    setActiveSection("");
  };

  const sel = "px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Universities</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Universities in AP & Telangana</h1>
      <p className="text-sm text-gray-500 mb-4">
        {UNIVERSITIES.length} deemed and private universities across Andhra Pradesh & Telangana — autonomous institutions with their own degree-granting authority
      </p>

      {/* Fee Regulation Info */}
      <div className="mb-6 rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <Landmark className="w-4 h-4 mt-0.5 text-amber-700 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-700 mb-1">Fee Regulation & Admissions</div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-amber-700">Deemed Universities:</span>{" "}
                Fees are set by the university and approved by UGC. They are <span className="font-semibold">not subject</span> to state block period GOs (G.O.Ms.No.06 or APHERMC). Admissions are through university-level entrance exams or national exams.
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-violet-700">Private State Universities:</span>{" "}
                A portion of seats are filled through state counseling via <span className="font-semibold">TS EAMCET</span> (Telangana) or <span className="font-semibold">AP EAPCET</span> (Andhra Pradesh). Fees for these seats may be regulated by the respective state. Remaining seats are filled through university-level admission with university-determined fees.
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-1.5">Fees shown are from official university websites for AY 2025-26. Contact admissions for exact, up-to-date figures.</div>
          </div>
        </div>
      </div>

      {/* State Toggle */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button
          onClick={() => {
            setState("");
            setDistrict("");
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            !state ? "bg-[#1a5276] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All States
        </button>
        <button
          onClick={() => {
            setState(state === "Andhra Pradesh" ? "" : "Andhra Pradesh");
            setDistrict("");
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            state === "Andhra Pradesh"
              ? "bg-green-600 text-white"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          AP ({UNIVERSITIES.filter((c) => c.state === "Andhra Pradesh").length})
        </button>
        <button
          onClick={() => {
            setState(state === "Telangana" ? "" : "Telangana");
            setDistrict("");
          }}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            state === "Telangana"
              ? "bg-[#2e86c1] text-white"
              : "bg-blue-50 text-[#2e86c1] hover:bg-blue-100"
          }`}
        >
          Telangana ({UNIVERSITIES.filter((c) => c.state === "Telangana").length})
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button
          onClick={() => setActiveSection("")}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            !activeSection ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({state ? UNIVERSITIES.filter((c) => c.state === state).length : UNIVERSITIES.length})
        </button>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(activeSection === s.key ? "" : s.key)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeSection === s.key
                ? "bg-gray-800 text-white"
                : `${s.bg} ${s.color} hover:opacity-80`
            }`}
          >
            {s.label} ({counts[s.key] || 0})
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities by name, district, or code..."
            aria-label="Search universities by name, district, or code"
            className="w-full sm:flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="flex gap-2 sm:gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={`${sel} font-semibold flex-1 sm:flex-none text-xs sm:text-sm`}
            >
              <option value="name">Sort: Name</option>
              <option value="fee_low">Fee ↑</option>
              <option value="fee_high">Fee ↓</option>
              <option value="placements">Placements</option>
              <option value="nirf">NIRF Rank</option>
            </select>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`${sel} flex-1 sm:flex-none text-xs sm:text-sm`}
            >
              <option value="">All Districts</option>
              {districtOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 font-semibold mb-4">{filtered.length} universities found</div>

      {/* Ad: Top of listing */}
      <div className="mb-4">
        <AdSlot slot="listing_top" state={state || undefined} />
      </div>

      {/* Grouped View */}
      {grouped ? (
        <div className="space-y-8">
          {SECTIONS.map((s, sectionIdx) => {
            const items = grouped.get(s.key) || [];
            if (items.length === 0) return null;
            return (
              <section key={s.key}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className={`text-lg font-bold ${s.color}`}>{s.label}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{s.desc}</p>
                <div className="space-y-3">
                  {items.map((c) => (
                    <UniCard key={c.id} c={c} borderClass={s.border} />
                  ))}
                </div>
                {/* Ad: Between sections */}
                {sectionIdx === 0 && (
                  <div className="mt-6">
                    <AdSlot slot="listing_mid" state={state || undefined} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const s = SECTIONS.find((s) => s.key === c.type)!;
            return <UniCard key={c.id} c={c} borderClass={s?.border || "border-l-gray-300"} />;
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <SearchX className="w-14 h-14 mx-auto mb-3 text-gray-400" aria-hidden="true" />
          <div className="text-lg font-semibold">No universities match your filters</div>
          <button
            onClick={clearAll}
            className="mt-2 text-sm text-[#2e86c1] font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
}
