"use client";
/**
 * Client island for /news: state/category filters + expandable news cards.
 * Receives the (already server-serialized) news items and category metadata
 * as props so news.ts never enters the client bundle via a wholesale import.
 */
import { useState, useMemo } from "react";
import Link from "next/link";
import type { NewsItem } from "@/lib/news";
import { isNewsActionable, isNewsArchived } from "@/lib/content-freshness";
import { useCurrentTime } from "@/lib/useCurrentTime";

export type NewsCategoryMeta = { key: NewsItem["category"]; label: string; color: string; bgColor: string };

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const priorityBadge: Record<string, { label: string; cls: string }> = {
  high: { label: "Urgent", cls: "bg-red-100 text-red-700" },
  medium: { label: "Important", cls: "bg-amber-100 text-amber-700" },
  low: { label: "Info", cls: "bg-gray-100 text-gray-500" },
};

const stateBadge: Record<string, { label: string; cls: string }> = {
  AP: { label: "Andhra Pradesh", cls: "bg-green-50 text-green-700 border-green-200" },
  TS: { label: "Telangana", cls: "bg-blue-50 text-accent border-blue-200" },
  Both: { label: "AP & TS", cls: "bg-violet-50 text-violet-700 border-violet-200" },
};

export default function NewsList({ items, categories, initialNow }: { items: NewsItem[]; categories: NewsCategoryMeta[]; initialNow: number }) {
  const now = useCurrentTime(initialNow);
  const [selectedState, setSelectedState] = useState<"" | "AP" | "TS" | "Both">("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...items].sort((a, b) => b.date.localeCompare(a.date));
    if (selectedState) list = list.filter(n => n.state === selectedState || n.state === "Both");
    if (selectedCategory) list = list.filter(n => n.category === selectedCategory);
    return list;
  }, [items, selectedState, selectedCategory]);

  // Separate urgent/pinned items
  const urgent = filtered.filter(n => isNewsActionable(n, now));
  const rest = filtered.filter(n => !(isNewsActionable(n, now)));

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { key: "", label: "All" },
            { key: "AP", label: "AP" },
            { key: "TS", label: "TS" },
          ].map(s => (
            <button key={s.key} aria-pressed={selectedState === s.key} onClick={() => setSelectedState(s.key as typeof selectedState)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedState === s.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          <button aria-pressed={!selectedCategory} onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${!selectedCategory ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            All Topics
          </button>
          {categories.map(cat => (
            <button key={cat.key} aria-pressed={selectedCategory === cat.key} onClick={() => setSelectedCategory(selectedCategory === cat.key ? "" : cat.key)}
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
              <NewsCard key={item.id} item={item} archived={isNewsArchived(item, now)} categories={categories} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} highlight />
            ))}
          </div>
        </div>
      )}

      {/* All News */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <div className="text-3xl mb-2">📰</div>
            <p className="font-semibold">No news found for this filter</p>
            <p className="text-xs mt-1">Try removing filters to see all updates</p>
          </div>
        )}
        {rest.map(item => (
          <NewsCard key={item.id} item={item} archived={isNewsArchived(item, now)} categories={categories} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
        ))}
      </div>
    </>
  );
}

function NewsCard({ item, categories, expanded, onToggle, highlight, archived }: { archived: boolean; item: NewsItem; categories: NewsCategoryMeta[]; expanded: boolean; onToggle: () => void; highlight?: boolean }) {
  const catMeta = categories.find(c => c.key === item.category);
  const pBadge = priorityBadge[item.priority];
  const sBadge = stateBadge[item.state];

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${highlight ? "ring-2 ring-red-200" : ""}`}>
      <button onClick={onToggle} aria-expanded={expanded} aria-controls={`news-body-${item.id}`} className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {catMeta && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${catMeta.bgColor} ${catMeta.color}`}>
                  {catMeta.label}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${sBadge.cls}`}>
                {sBadge.label}
              </span>
              {highlight && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${pBadge.cls}`}>
                  {pBadge.label}
                </span>
              )}
              <span className="text-[11px] text-gray-600 ml-auto shrink-0">{formatDate(item.date)}</span>
            </div>
            {archived && <span className="block text-xs font-semibold text-amber-800 mb-2">Archived update — check current official notices before acting</span>}
            <h3 className="font-bold text-sm sm:text-base leading-snug mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
          </div>
          <div className="shrink-0 mt-1">
            <svg className={`w-5 h-5 text-gray-600 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div id={`news-body-${item.id}`} className="px-5 pb-5 border-t border-gray-100">
          <div className="pt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.body}</div>
          {item.source && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
              <span>Source: {item.source}</span>
              {item.sourceUrl && (
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Visit →
                </a>
              )}
            </div>
          )}
          {item.tags.length > 0 && (
            <div className="mt-3 flex gap-1.5 flex-wrap">
              {item.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">{tag}</span>
              ))}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              href={`/news/${item.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              Open as standalone page →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
