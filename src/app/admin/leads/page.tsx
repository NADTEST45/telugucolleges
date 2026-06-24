"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminUser } from "@/lib/supabase/types";

interface Lead {
  created_at: string;
  phone: string;
  name: string | null;
  exam_state: string | null;
  rank: number | null;
  branch: string | null;
  category: string | null;
  source: string | null;
  page_url: string | null;
}

interface Counts {
  total: number;
  bySource: Record<string, number>;
}

const SOURCE_FILTERS = [
  { value: "", label: "All sources" },
  { value: "counselling-dates", label: "Counselling dates" },
  { value: "predictor", label: "Predictor" },
];

export default function LeadsPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const router = useRouter();

  const load = useCallback(async (src: string) => {
    const qs = src ? `?source=${encodeURIComponent(src)}` : "";
    const res = await fetch(`/api/admin/leads${qs}`);
    if (res.status === 403) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setLeads(data.leads || []);
    setCounts(data.counts || null);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    async function init() {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "super_admin") {
        router.push("/admin/login");
        return;
      }
      setUser(meData.user);
      // Initial load is unfiltered; the filter dropdown calls load() directly.
      await load("");
    }
    init();
  }, [router, load]);

  function handleFilter(src: string) {
    setSource(src);
    setLoading(true);
    load(src);
  }

  function exportCsv() {
    const qs = source ? `?source=${encodeURIComponent(source)}&format=csv` : "?format=csv";
    // Navigating to the route triggers the attachment download.
    window.location.href = `/api/admin/leads${qs}`;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading…</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" aria-label="Back to admin dashboard" className="text-white/60 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <span className="font-bold">Counselling Leads</span>
          </div>
          <span className="text-xs text-white/50">{user?.email}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">WhatsApp opt-ins</h1>
            {counts && (
              <p className="text-sm text-gray-500 mt-0.5">
                {counts.total.toLocaleString("en-IN")} total
                {Object.entries(counts.bySource).map(([s, n]) => (
                  <span key={s}> · {n.toLocaleString("en-IN")} {s}</span>
                ))}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={source}
              onChange={e => handleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              {SOURCE_FILTERS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <button
              onClick={exportCsv}
              disabled={leads.length === 0}
              className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          {leads.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">No leads yet for this filter.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((l, i) => (
                  <tr key={`${l.phone}-${l.source}-${i}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 tabular-nums whitespace-nowrap">{l.phone}</td>
                    <td className="px-4 py-3 text-gray-500">{l.exam_state || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 tabular-nums">{l.rank ? l.rank.toLocaleString("en-IN") : "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{l.branch || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{l.category || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">{l.source || "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
          Service-role only. Until an automated WhatsApp sender is connected, export this list
          and message opt-ins through your provider. See docs/whatsapp-sending.md for the
          automation path.
        </p>
      </div>
    </div>
  );
}
