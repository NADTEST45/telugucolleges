"use client";
/**
 * Global header search. Rendered on EVERY page via the root layout, so it
 * must never import COLLEGES directly (that would ship the full dataset in
 * the shared client bundle — CLAUDE.md bundle rule). Instead it lazily
 * fetches the slim /api/search-index on first focus and filters client-side.
 */
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCollegeSearch } from "@/lib/useCollegeSearch";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // Shared hook: lazily fetches the slim index once, filters by name/code/district.
  const { results, ensureIndex } = useCollegeSearch(q);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen && mobileInputRef.current) mobileInputRef.current.focus();
  }, [mobileOpen]);

  const go = (slug: string) => { setOpen(false); setMobileOpen(false); setQ(""); setActiveIdx(-1); router.push(`/colleges/${slug}`); };

  // Reset the active option whenever the result set changes.
  useEffect(() => { setActiveIdx(-1); }, [q]);

  const expanded = open && results.length > 0;

  /** Shared combobox keyboard handling (WAI-ARIA combobox pattern). */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIdx(i => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIdx(i => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && expanded && activeIdx >= 0 && activeIdx < results.length) {
      e.preventDefault();
      go(results[activeIdx].slug);
    }
  };

  /** ARIA attributes for each combobox input; ids differ so desktop/mobile stay unique. */
  const comboProps = (idPrefix: string) => ({
    role: "combobox" as const,
    "aria-expanded": expanded,
    "aria-controls": `${idPrefix}-listbox`,
    "aria-autocomplete": "list" as const,
    "aria-activedescendant": expanded && activeIdx >= 0 ? `${idPrefix}-option-${activeIdx}` : undefined,
    onKeyDown,
  });

  const renderOptions = (idPrefix: string, optionClass: string) => (
    <div role="listbox" id={`${idPrefix}-listbox`} aria-label="College search results">
      {results.map((c, i) => (
        <button key={c.id} onClick={() => go(c.slug)}
          role="option" id={`${idPrefix}-option-${i}`} aria-selected={i === activeIdx} tabIndex={-1}
          onMouseEnter={() => setActiveIdx(i)}
          className={`w-full text-left ${optionClass} transition-colors border-b border-gray-50 last:border-0 ${i === activeIdx ? "bg-blue-50" : "hover:bg-blue-50"}`}>
          <div className="font-semibold text-sm text-gray-900">{c.name}</div>
          <div className="text-xs text-gray-500">{c.code} · {c.district}, {c.state} · {c.type}</div>
        </button>
      ))}
    </div>
  );

  const dropdown = expanded && (
    <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      {renderOptions("search-desktop", "px-4 py-2.5")}
      <Link href="/colleges" onClick={() => { setOpen(false); setMobileOpen(false); setQ(""); }}
        className="block w-full text-center px-4 py-2 text-xs text-accent font-semibold hover:bg-blue-50">
        View all colleges →
      </Link>
    </div>
  );

  return (
    <div ref={ref} className="relative flex-1 max-w-md mx-4">
      {/* Desktop search — always visible */}
      <div className="hidden md:block relative">
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); ensureIndex(); }}
          onFocus={() => { setFocused(true); setOpen(true); ensureIndex(); }}
          placeholder="Search colleges / universities..."
          aria-label="Search colleges"
          {...comboProps("search-desktop")}
          className={`w-full px-4 py-1.5 rounded-lg text-sm outline-none transition-all ${focused ? "bg-white text-gray-900 shadow-lg" : "bg-white/20 text-white placeholder-white/80"}`}
        />
        {dropdown}
      </div>

      {/* Mobile search — toggle button + full-width overlay */}
      <div className="md:hidden flex justify-end">
        {!mobileOpen ? (
          <button onClick={() => { setMobileOpen(true); ensureIndex(); }} className="p-2.5 rounded-lg hover:bg-white/15 transition-colors" aria-label="Search">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        ) : (
          <div className="fixed inset-x-0 top-0 z-[60]">
            <div className="flex items-center gap-2 bg-brand px-3 h-14 shadow-lg">
              <svg className="w-5 h-5 text-white/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                ref={mobileInputRef}
                value={q}
                onChange={e => { setQ(e.target.value); setOpen(true); ensureIndex(); }}
                onFocus={() => { setFocused(true); setOpen(true); ensureIndex(); }}
                placeholder="Search colleges / universities..."
                aria-label="Search colleges"
                {...comboProps("search-mobile")}
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-white text-gray-900 outline-none"
              />
              <button onClick={() => { setMobileOpen(false); setQ(""); setOpen(false); }} className="p-2 text-white shrink-0" aria-label="Close search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {expanded && (
              <div className="mx-3 bg-white rounded-b-xl shadow-xl border border-gray-100 overflow-hidden max-h-[60vh] overflow-y-auto">
                {renderOptions("search-mobile", "px-4 py-3")}
                <Link href="/colleges" onClick={() => { setOpen(false); setMobileOpen(false); setQ(""); }}
                  className="block w-full text-center px-4 py-2.5 text-xs text-accent font-semibold hover:bg-blue-50">
                  View all colleges →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
