"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COLLEGES } from "@/lib/colleges";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = q.length >= 2
    ? COLLEGES.filter(c =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.code.toLowerCase().includes(q.toLowerCase()) ||
        c.district.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 8)
    : [];

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

  const go = (slug: string) => { setOpen(false); setMobileOpen(false); setQ(""); router.push(`/colleges/${slug}`); };

  const dropdown = open && results.length > 0 && (
    <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      {results.map(c => (
        <button key={c.id} onClick={() => go(c.slug)}
          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
          <div className="font-semibold text-sm text-gray-900">{c.name}</div>
          <div className="text-xs text-gray-400">{c.code} · {c.district}, {c.state} · {c.type}</div>
        </button>
      ))}
      <Link href="/colleges" onClick={() => { setOpen(false); setMobileOpen(false); setQ(""); }}
        className="block w-full text-center px-4 py-2 text-xs text-[#2e86c1] font-semibold hover:bg-blue-50">
        View all {COLLEGES.length} colleges →
      </Link>
    </div>
  );

  return (
    <div ref={ref} className="relative flex-1 max-w-md mx-4">
      {/* Desktop search — always visible */}
      <div className="hidden md:block relative">
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          placeholder="Search colleges / universities..."
          className={`w-full px-4 py-1.5 rounded-lg text-sm outline-none transition-all ${focused ? "bg-white text-gray-900 shadow-lg" : "bg-white/15 text-white placeholder-white/60"}`}
        />
        {dropdown}
      </div>

      {/* Mobile search — toggle button + full-width overlay */}
      <div className="md:hidden flex justify-end">
        {!mobileOpen ? (
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/15 transition-colors" aria-label="Search">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        ) : (
          <div className="fixed inset-x-0 top-0 z-[60]">
            <div className="flex items-center gap-2 bg-[#1a5276] dark:bg-[#0c2d48] px-3 h-14 shadow-lg">
              <svg className="w-5 h-5 text-white/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                ref={mobileInputRef}
                value={q}
                onChange={e => { setQ(e.target.value); setOpen(true); }}
                onFocus={() => { setFocused(true); setOpen(true); }}
                placeholder="Search colleges / universities..."
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-white text-gray-900 outline-none"
              />
              <button onClick={() => { setMobileOpen(false); setQ(""); setOpen(false); }} className="p-2 text-white shrink-0" aria-label="Close search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {open && results.length > 0 && (
              <div className="mx-3 bg-white rounded-b-xl shadow-xl border border-gray-100 overflow-hidden max-h-[60vh] overflow-y-auto">
                {results.map(c => (
                  <button key={c.id} onClick={() => go(c.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="font-semibold text-sm text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.code} · {c.district}, {c.state} · {c.type}</div>
                  </button>
                ))}
                <Link href="/colleges" onClick={() => { setOpen(false); setMobileOpen(false); setQ(""); }}
                  className="block w-full text-center px-4 py-2.5 text-xs text-[#2e86c1] font-semibold hover:bg-blue-50">
                  View all {COLLEGES.length} colleges →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
