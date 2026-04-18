"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { NEWS_ITEMS, NEWS_CATEGORIES, type NewsItem } from "@/lib/news";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr + "T00:00:00");
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} week${Math.floor(diff / 7) > 1 ? "s" : ""} ago`;
  return formatDate(dateStr);
}

const priorityBadge: Record<string, { label: string; cls: string }> = {
  high: { label: "Urgent", cls: "bg-red-100 text-red-700" },
  medium: { label: "Important", cls: "bg-amber-100 text-amber-700" },
  low: { label: "Info", cls: "bg-gray-100 text-gray-500" },
};

const stateBadge: Record<string, { label: string; cls: string }> = {
  AP: { label: "Andhra Pradesh", cls: "bg-green-50 text-green-700 border-green-200" },
  TS: { label: "Telangana", cls: "bg-blue-50 text-[#2e86c1] border-blue-200" },
  Both: { label: "AP & TS", cls: "bg-violet-50 text-violet-700 border-violet-200" },
};

export default function NewsPage() {
  const [selectedState, setSelectedState] = useState<"" | "AP" | "TS" | "Both">("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date));
    if (selectedState) items = items.filter(n => n.state === selectedState || n.state === "Both");
    if (selectedCategory) items = items.filter(n => n.category === selectedCategory);
    return items;
  }, [selectedState, selectedCategory]);

  // Separate urgent/pinned items
  const urgent = filtered.filter(n => n.priority === "high" && n.date >= "2026-03-01");
  const rest = filtered.filter(n => !(n.priority === "high" && n.date >= "2026-03-01"));

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#2e86c1]">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">News & Alerts</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admission News & Alerts</h1>
      <p className="text-sm text-gray-600 mb-6">Latest updates on EAPCET 2026, fee notifications, counselling schedules, and more for AP & Telangana.</p>

      {/* EAPCET 2026 Quick Dates Banner */}
      <section className="bg-gradient-to-r from-[#0f2b3d] via-[#1a5276] to-[#2e86c1] text-white rounded-2xl p-4 sm:p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px"}} />
        <div className="relative">
          <h2 className="text-lg font-bold mb-4">EAPCET 2026 — Key Dates at a Glance</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* AP */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">AP</span>
                <span className="font-semibold text-sm">AP EAPCET 2026</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-white/90">Registration</span><span className="font-semibold">Feb 4 — Mar 17</span></div>
                <div className="flex justify-between"><span className="text-white/90">Late fee deadline</span><span className="font-semibold">Apr 3</span></div>
                <div className="flex justify-between"><span className="text-white/90">Engineering Exam</span><span className="font-bold text-green-300">May 12–15, 18</span></div>
                <div className="flex justify-between"><span className="text-white/90">Agri/Pharmacy</span><span className="font-semibold">May 19–20</span></div>
                <div className="flex justify-between"><span className="text-white/90">Results (Expected)</span><span className="font-semibold">June 2026</span></div>
                <div className="flex justify-between"><span className="text-white/90">Counselling</span><span className="font-semibold">July 2026</span></div>
              </div>
              <a href="https://cets.apsche.ap.gov.in/EAPCET/" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                Apply Now →
              </a>
            </div>
            {/* TS */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#2e86c1] text-white text-[10px] font-bold px-2 py-0.5 rounded">TS</span>
                <span className="font-semibold text-sm">TG EAPCET 2026</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-white/90">Registration</span><span className="font-semibold">Feb 19 — Apr 4</span></div>
                <div className="flex justify-between"><span className="text-white/90">Late fee deadline</span><span className="font-semibold">May 2</span></div>
                <div className="flex justify-between"><span className="text-white/90">Agri/Pharmacy</span><span className="font-semibold">May 4–5</span></div>
                <div className="flex justify-between"><span className="text-white/90">Engineering Exam</span><span className="font-bold text-blue-300">May 9–11</span></div>
                <div className="flex justify-between"><span className="text-white/90">Results (Expected)</span><span className="font-semibold">June 2026</span></div>
                <div className="flex justify-between"><span className="text-white/90">Counselling</span><span className="font-semibold">Jul–Aug 2026</span></div>
              </div>
              <a href="https://eapcet.tgche.ac.in/" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                Apply Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { key: "", label: "All" },
            { key: "AP", label: "AP" },
            { key: "TS", label: "TS" },
          ].map(s => (
            <button key={s.key} onClick={() => setSelectedState(s.key as typeof selectedState)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedState === s.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          <button onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${!selectedCategory ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            All Topics
          </button>
          {NEWS_CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setSelectedCategory(selectedCategory === cat.key ? "" : cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${selectedCategory === cat.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Urgent / Pinned */}
      {urgent.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">Action Required</div>
          <div className="space-y-3">
            {urgent.map(item => (
              <NewsCard key={item.id} item={item} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} highlight />
            ))}
          </div>
        </div>
      )}

      {/* All News */}
      <div className="space-y-3">
        {rest.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Newspaper className="w-10 h-10 mx-auto mb-2 text-gray-400" aria-hidden="true" />
            <p className="font-semibold">No news found for this filter</p>
            <p className="text-xs mt-1">Try removing filters to see all updates</p>
          </div>
        )}
        {rest.map(item => (
          <NewsCard key={item.id} item={item} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-amber-50 rounded-xl px-5 py-3 text-xs text-amber-700">
        Information is sourced from official government notifications (APSCHE, TGCHE, TAFRC, APHERMC) and verified news outlets. Dates and details may change — always verify on the official website before taking action.
      </div>
    </main>
  );
}

function NewsCard({ item, expanded, onToggle, highlight }: { item: NewsItem; expanded: boolean; onToggle: () => void; highlight?: boolean }) {
  const catMeta = NEWS_CATEGORIES.find(c => c.key === item.category);
  const pBadge = priorityBadge[item.priority];
  const sBadge = stateBadge[item.state];

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${highlight ? "ring-2 ring-red-200" : ""}`}>
      <button onClick={onToggle} className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {catMeta && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${catMeta.bgColor} ${catMeta.color}`}>
                  {catMeta.label}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sBadge.cls}`}>
                {sBadge.label}
              </span>
              {item.priority === "high" && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pBadge.cls}`}>
                  {pBadge.label}
                </span>
              )}
              <span className="text-[11px] text-gray-600 ml-auto shrink-0">{daysAgo(item.date)}</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base leading-snug mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
          </div>
          <div className="shrink-0 mt-1">
            <svg className={`w-5 h-5 text-gray-600 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="pt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.body}</div>
          {item.source && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
              <span>Source: {item.source}</span>
              {item.sourceUrl && (
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#2e86c1] hover:underline">
                  Visit →
                </a>
              )}
            </div>
          )}
          {item.tags.length > 0 && (
            <div className="mt-3 flex gap-1.5 flex-wrap">
              {item.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
