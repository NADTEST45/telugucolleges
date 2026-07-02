"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CollegesFilters } from "./filtering";

interface SectionMeta {
  key: string;
  label: string;
  color: string;
  bg: string;
}

interface CollegeFilterBarProps {
  filters: CollegesFilters;
  sections: SectionMeta[];
  sectionCounts: Record<string, number>;
  districts: string[];
  affiliations: string[];
  totalAll: number;
  totalAp: number;
  totalTs: number;
}

/**
 * Interactive controls for /colleges. All state is mirrored to the URL via
 * `router.replace`; the page (a Server Component) re-renders the result
 * list from those URL params. This is what keeps the COLLEGES dataset out
 * of the client JS bundle.
 *
 * The search box debounces (200ms) so each keystroke doesn't fire a
 * navigation. Other controls (selects, buttons) fire immediately.
 */
export default function CollegeFilterBar({
  filters,
  sections,
  sectionCounts,
  districts,
  affiliations,
  totalAll,
  totalAp,
  totalTs,
}: CollegeFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Mirror `q` locally so the input stays responsive while the URL
  // navigation is in flight (otherwise typing feels "sticky").
  const [q, setQ] = useState(filters.q);
  const [showFilters, setShowFilters] = useState(false);

  // Keep local `q` in sync when the URL changes from outside (back/forward).
  useEffect(() => {
    setQ(filters.q);
  }, [filters.q]);

  const hasActiveFilters = !!(
    filters.state ||
    filters.district ||
    filters.affiliation ||
    filters.maxFee ||
    filters.naac ||
    filters.category ||
    filters.q
  );

  /** Build the next URL by mutating a single param. Empty value drops it. */
  function buildUrl(patch: Partial<CollegesFilters>): string {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    for (const [k, v] of Object.entries(patch)) {
      if (v === "" || v == null) next.delete(k);
      else next.set(k, String(v));
    }
    // Any filter/sort change invalidates the current page — reset to page 1.
    next.delete("page");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function update(patch: Partial<CollegesFilters>) {
    startTransition(() => {
      router.replace(buildUrl(patch), { scroll: false });
    });
  }

  // Debounce search input → URL
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function onSearchChange(value: string) {
    setQ(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      update({ q: value });
    }, 200);
  }

  function clearAll() {
    setQ("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const sel = "px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer";

  return (
    <>
      {/* State Toggle */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button
          onClick={() => update({ state: "", district: "" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${!filters.state ? "bg-brand text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All States
        </button>
        <button
          onClick={() => update({ state: filters.state === "Andhra Pradesh" ? "" : "Andhra Pradesh", district: "" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filters.state === "Andhra Pradesh" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
        >
          AP ({totalAp})
        </button>
        <button
          onClick={() => update({ state: filters.state === "Telangana" ? "" : "Telangana", district: "" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filters.state === "Telangana" ? "bg-accent text-white" : "bg-blue-50 text-accent hover:bg-blue-100"}`}
        >
          Telangana ({totalTs})
        </button>
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button
          onClick={() => update({ category: "" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${!filters.category ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => update({ category: filters.category === "engineering" ? "" : "engineering" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filters.category === "engineering" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}
        >
          Engineering
        </button>
        <button
          onClick={() => update({ category: filters.category === "pharmacy" ? "" : "pharmacy" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filters.category === "pharmacy" ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-700 hover:bg-teal-100"}`}
        >
          Pharmacy
        </button>
        <button
          onClick={() => update({ category: filters.category === "medical" ? "" : "medical" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filters.category === "medical" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`}
        >
          Medical
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide">
        <button
          onClick={() => update({ section: "" })}
          className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${!filters.section ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All ({filters.state === "Andhra Pradesh" ? totalAp : filters.state === "Telangana" ? totalTs : totalAll})
        </button>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => update({ section: filters.section === s.key ? "" : s.key })}
            className={`px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filters.section === s.key ? "bg-gray-800 text-white" : `${s.bg} ${s.color} hover:opacity-80`}`}
          >
            {s.label} ({sectionCounts[s.key] || 0})
          </button>
        ))}
      </div>

      {/* Search + Sort row */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
          <input
            value={q}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search name, district, or code..."
            aria-label="Search colleges by name, district, or code"
            className="w-full sm:flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="flex gap-2 sm:gap-3">
            <select
              value={filters.sort}
              onChange={e => update({ sort: e.target.value })}
              aria-label="Sort colleges"
              className={`${sel} font-semibold flex-1 sm:flex-none text-xs sm:text-sm`}
            >
              <option value="name">Sort: Name</option>
              <option value="fee_low">Fee ↑</option>
              <option value="fee_high">Fee ↓</option>
              <option value="placements">Placements</option>
              <option value="cutoff">CSE Cutoff</option>
              <option value="nirf">NIRF Rank</option>
            </select>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${showFilters || hasActiveFilters ? "bg-accent text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Filters {hasActiveFilters ? `(${[filters.state, filters.district, filters.affiliation, filters.maxFee, filters.naac, filters.category].filter(Boolean).length})` : ""}
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label htmlFor="filter-state" className="text-[11px] text-gray-500 font-semibold mb-1 block">State</label>
                <select
                  id="filter-state"
                  value={filters.state}
                  onChange={e => update({ state: e.target.value, district: "" })}
                  className={`${sel} w-full`}
                >
                  <option value="">All States</option>
                  <option>Telangana</option>
                  <option>Andhra Pradesh</option>
                </select>
              </div>
              <div>
                <label htmlFor="filter-district" className="text-[11px] text-gray-500 font-semibold mb-1 block">District</label>
                <select
                  id="filter-district"
                  value={filters.district}
                  onChange={e => update({ district: e.target.value })}
                  className={`${sel} w-full`}
                >
                  <option value="">All Districts</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="filter-affiliation" className="text-[11px] text-gray-500 font-semibold mb-1 block">University</label>
                <select
                  id="filter-affiliation"
                  value={filters.affiliation}
                  onChange={e => update({ affiliation: e.target.value })}
                  className={`${sel} w-full`}
                >
                  <option value="">All Universities</option>
                  {affiliations.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="filter-maxfee" className="text-[11px] text-gray-500 font-semibold mb-1 block">Max Fee</label>
                <select
                  id="filter-maxfee"
                  value={filters.maxFee}
                  onChange={e => update({ maxFee: e.target.value })}
                  className={`${sel} w-full`}
                >
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
                <label htmlFor="filter-naac" className="text-[11px] text-gray-500 font-semibold mb-1 block">NAAC</label>
                <select
                  id="filter-naac"
                  value={filters.naac}
                  onChange={e => update({ naac: e.target.value })}
                  className={`${sel} w-full`}
                >
                  <option value="">Any</option>
                  <option value="rated">NAAC Rated</option>
                  <option value="A+">A++ Only</option>
                  <option value="A">A+ &amp; A</option>
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearAll} className="mt-3 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
