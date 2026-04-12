"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { COLLEGES, fmtFee } from "@/lib/colleges";

function CollegeSearchSelect({ selected, onSelect, stateFilter }: {
  selected: number[];
  onSelect: (id: number) => void;
  stateFilter: "" | "Telangana" | "Andhra Pradesh";
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const available = COLLEGES
    .filter(c => !selected.includes(c.id) && (!stateFilter || c.state === stateFilter))
    .sort((a, b) => a.name.localeCompare(b.name));

  const results = q.length >= 1
    ? available.filter(c =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.code.toLowerCase().includes(q.toLowerCase()) ||
        c.district.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 12)
    : available.slice(0, 12);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0 sm:min-w-[240px]">
      <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1.5 sm:mb-2 block">Add colleges to compare:</label>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Type to search colleges / universities..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#2e86c1] focus:ring-1 focus:ring-[#2e86c1]/30 transition-all"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto">
          {results.map(c => (
            <button key={c.id} onClick={() => { onSelect(c.id); setQ(""); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
              <div className="font-semibold text-sm text-gray-900">{c.name}</div>
              <div className="text-xs text-gray-400">{c.code} · {c.district}, {c.state} · {c.type}</div>
            </button>
          ))}
          {q.length >= 1 && results.length === 12 && (
            <div className="px-4 py-2 text-xs text-gray-400 text-center">Type more to narrow results...</div>
          )}
        </div>
      )}
      {open && q.length >= 1 && results.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-50 px-4 py-4 text-center text-sm text-gray-400">
          No colleges found for &ldquo;{q}&rdquo;
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [stateFilter, setStateFilter] = useState<"" | "Telangana" | "Andhra Pradesh">("");
  const colleges = selected.map(id => COLLEGES.find(c => c.id === id)!).filter(Boolean);
  const branches = ["cse", "ece", "eee", "mech", "civil"];

  const addCollege = (id: number) => {
    if (!selected.includes(id) && selected.length < 4) setSelected([...selected, id]);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/">Home</Link><span>/</span><span className="text-gray-600 font-medium">Compare</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Compare Colleges</h1>
      <p className="text-sm text-gray-500 mb-6">Select 2-4 colleges to compare fees, cutoffs, and placements side-by-side</p>

      {/* Selector */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 mb-3">
          <CollegeSearchSelect selected={selected} onSelect={addCollege} stateFilter={stateFilter} />
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Filter by State</label>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value as typeof stateFilter)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer">
              <option value="">All States</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>
        </div>
        {selected.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {colleges.map(c => (
              <span key={c.id} className="bg-blue-50 text-[#1a5276] px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2">
                {c.code}
                <button onClick={() => setSelected(selected.filter(id => id !== c.id))} className="text-red-400 hover:text-red-600 font-bold">×</button>
              </span>
            ))}
            <button onClick={() => setSelected([])} className="px-3 py-1.5 rounded-lg text-sm text-red-500 bg-red-50 font-semibold">Clear all</button>
          </div>
        )}
      </div>

      {colleges.length < 2 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">⚖️</div>
          <div className="text-lg font-semibold mb-2">Select at least 2 colleges to compare</div>
          <p className="text-sm">Use the dropdown above to add colleges.</p>
        </div>
      ) : (
        <>
        <div className="sm:hidden text-xs sm:text-[10px] text-gray-400 text-center mb-1.5">Swipe to see all columns →</div>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm text-sm min-w-[500px]">
            <thead>
              <tr>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a5276] text-white text-left text-[10px] sm:text-xs min-w-[90px] sm:min-w-[140px] sticky left-0 z-10">Feature</th>
                {colleges.map(c => (
                  <th key={c.id} className="px-2.5 sm:px-3 py-2.5 sm:py-3 bg-[#1a5276] text-white text-center min-w-[100px] sm:min-w-[150px]">
                    <div className="font-bold text-xs sm:text-sm">{c.code}</div>
                    <div className="text-[9px] sm:text-[11px] opacity-80 font-normal mt-0.5">{c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Basic info */}
              {[
                ["Type", (c: typeof colleges[0]) => c.type],
                ["Location", (c: typeof colleges[0]) => `${c.district}, ${c.state}`],
                ["Affiliation", (c: typeof colleges[0]) => c.affiliation],
                ["Established", (c: typeof colleges[0]) => String(c.year)],
                ["NAAC", (c: typeof colleges[0]) => c.naac || "—"],
                ["NBA", (c: typeof colleges[0]) => c.nba ? "Yes" : "No"],
              ].map(([label, fn]) => (
                <tr key={label as string} className="border-b border-gray-100">
                  <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-semibold text-gray-500 text-[10px] sm:text-xs sticky left-0 bg-white z-10">{label as string}</td>
                  {colleges.map(c => <td key={c.id} className="px-2.5 sm:px-3 py-2 sm:py-2.5 text-center text-[10px] sm:text-xs">{(fn as (c: typeof colleges[0]) => string)(c)}</td>)}
                </tr>
              ))}

              {/* Fees */}
              <tr><td colSpan={colleges.length + 1} className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 font-bold text-[#1a5276] text-[10px] sm:text-xs">Fee Structure (Annual)</td></tr>
              {(() => {
                const vals = colleges.map(c => c.fee || Infinity);
                const bestIdx = vals.indexOf(Math.min(...vals));
                return (
                  <tr className="border-b border-gray-100">
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-semibold text-gray-500 text-[10px] sm:text-xs sticky left-0 bg-white z-10">Annual Fee (GO)</td>
                    {colleges.map((c, i) => (
                      <td key={c.id} className={`px-2.5 sm:px-3 py-2 sm:py-2.5 text-center text-[10px] sm:text-xs ${i === bestIdx ? "font-bold text-green-600 bg-green-50" : ""}`}>
                        {fmtFee(c.fee)}
                      </td>
                    ))}
                  </tr>
                );
              })()}

              {/* Cutoffs */}
              <tr><td colSpan={colleges.length + 1} className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 font-bold text-[#1a5276] text-[10px] sm:text-xs">EAPCET Cutoffs (2024-25)</td></tr>
              {branches.map(b => {
                const vals = colleges.map(c => c.cutoff[b] || Infinity);
                const bestIdx = vals.indexOf(Math.min(...vals));
                return (
                  <tr key={b} className="border-b border-gray-100">
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-semibold text-gray-500 text-[10px] sm:text-xs uppercase sticky left-0 bg-white z-10">{b} Rank</td>
                    {colleges.map((c, i) => (
                      <td key={c.id} className={`px-2.5 sm:px-3 py-2 sm:py-2.5 text-center text-[10px] sm:text-xs ${i === bestIdx ? "font-bold text-green-600 bg-green-50" : ""}`}>
                        {c.cutoff[b]?.toLocaleString() || "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Placements */}
              <tr><td colSpan={colleges.length + 1} className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 font-bold text-[#1a5276] text-[10px] sm:text-xs">Placements</td></tr>
              {[
                ["Avg Package", (c: typeof colleges[0]) => `₹${c.placements.avg} LPA`, (c: typeof colleges[0]) => -c.placements.avg],
                ["Highest Package", (c: typeof colleges[0]) => `₹${c.placements.highest}L`, (c: typeof colleges[0]) => -c.placements.highest],
                ["Companies", (c: typeof colleges[0]) => `${c.placements.companies}+`, (c: typeof colleges[0]) => -c.placements.companies],
              ].map(([label, display, compare]) => {
                const vals = colleges.map(c => (compare as (c: typeof colleges[0]) => number)(c));
                const bestIdx = vals.indexOf(Math.min(...vals));
                return (
                  <tr key={label as string} className="border-b border-gray-100">
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-semibold text-gray-500 text-[10px] sm:text-xs sticky left-0 bg-white z-10">{label as string}</td>
                    {colleges.map((c, i) => (
                      <td key={c.id} className={`px-2.5 sm:px-3 py-2 sm:py-2.5 text-center text-[10px] sm:text-xs ${i === bestIdx ? "font-bold text-green-600 bg-green-50" : ""}`}>
                        {(display as (c: typeof colleges[0]) => string)(c)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}
    </main>
  );
}