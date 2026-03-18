"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminUser } from "@/lib/supabase/types";
import { COLLEGES } from "@/lib/colleges";

/* Precompute stats from the colleges data */
const TOTAL_COLLEGES = COLLEGES.length;
const TOTAL_AP = COLLEGES.filter(c => c.state === "Andhra Pradesh").length;
const TOTAL_TS = COLLEGES.filter(c => c.state === "Telangana").length;
const TOTAL_DEEMED = COLLEGES.filter(c => c.type === "Deemed University").length;
const TOTAL_PVT_UNI = COLLEGES.filter(c => c.type === "Private University").length;
const TOTAL_GOVT = COLLEGES.filter(c => c.type === "Government").length;
const TOTAL_PRIVATE = COLLEGES.filter(c => c.type === "Private").length;
const WITH_PLACEMENTS = COLLEGES.filter(c => c.placements.avg > 0).length;
const WITH_NIRF = COLLEGES.filter(c => c.nirf > 0).length;
const WITH_NAAC = COLLEGES.filter(c => c.naac && c.naac !== "-" && c.naac !== "N/A").length;
const BRANCHES_SET = new Set(COLLEGES.flatMap(c => c.branches));
const DISTRICTS_SET = new Set(COLLEGES.map(c => c.district));

const TOP_BY_PLACEMENTS = [...COLLEGES]
  .filter(c => c.placements.avg > 0)
  .sort((a, b) => b.placements.avg - a.placements.avg)
  .slice(0, 10);

const TOP_BY_HIGHEST = [...COLLEGES]
  .filter(c => c.placements.highest > 0)
  .sort((a, b) => b.placements.highest - a.placements.highest)
  .slice(0, 10);

export default function MarketingDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.user) { router.push("/marketing/login"); return; }
        if (meData.user.role !== "marketing" && meData.user.role !== "super_admin") {
          router.push("/marketing/login");
          return;
        }
        setUser(meData.user);
      } catch {
        router.push("/marketing/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/marketing/login");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold">TC</Link>
            <span className="text-white/30">|</span>
            <span className="text-sm text-white/80">Marketing Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60 hidden sm:inline">{user?.email}</span>
            <button onClick={handleLogout} className="text-xs bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketing Overview</h1>
        <p className="text-sm text-gray-500 mb-8">Site analytics and college data insights for marketing campaigns</p>

        {/* Coverage Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Colleges" value={TOTAL_COLLEGES} color="purple" />
          <StatCard label="AP Colleges" value={TOTAL_AP} color="green" />
          <StatCard label="TS Colleges" value={TOTAL_TS} color="blue" />
          <StatCard label="Districts Covered" value={DISTRICTS_SET.size} color="amber" />
        </div>

        {/* Type Breakdown */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">College Type Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Government" value={TOTAL_GOVT} color="green" />
          <StatCard label="Private Affiliated" value={TOTAL_PRIVATE} color="blue" />
          <StatCard label="Deemed Universities" value={TOTAL_DEEMED} color="amber" />
          <StatCard label="Private Universities" value={TOTAL_PVT_UNI} color="violet" />
        </div>

        {/* Data Quality */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Data Quality & Coverage</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="With Placement Data" value={WITH_PLACEMENTS} color="green" sub={`${Math.round(WITH_PLACEMENTS / TOTAL_COLLEGES * 100)}%`} />
          <StatCard label="NIRF Ranked" value={WITH_NIRF} color="rose" sub={`${Math.round(WITH_NIRF / TOTAL_COLLEGES * 100)}%`} />
          <StatCard label="NAAC Accredited" value={WITH_NAAC} color="amber" sub={`${Math.round(WITH_NAAC / TOTAL_COLLEGES * 100)}%`} />
          <StatCard label="Branches/Programs" value={BRANCHES_SET.size} color="indigo" />
        </div>

        {/* Top Colleges Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-green-50">
              <h3 className="font-bold text-green-800">Top 10 by Avg Package</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2.5 text-left">#</th>
                    <th className="px-4 py-2.5 text-left">College</th>
                    <th className="px-4 py-2.5 text-right">Avg Pkg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TOP_BY_PLACEMENTS.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/colleges/${c.slug}`} className="font-medium text-gray-900 hover:text-purple-700">
                          {c.name}
                        </Link>
                        <div className="text-[11px] text-gray-400">{c.district}, {c.state}</div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-green-600">₹{c.placements.avg}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
              <h3 className="font-bold text-amber-800">Top 10 by Highest Package</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2.5 text-left">#</th>
                    <th className="px-4 py-2.5 text-left">College</th>
                    <th className="px-4 py-2.5 text-right">Highest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TOP_BY_HIGHEST.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/colleges/${c.slug}`} className="font-medium text-gray-900 hover:text-purple-700">
                          {c.name}
                        </Link>
                        <div className="text-[11px] text-gray-400">{c.district}, {c.state}</div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-amber-600">₹{c.placements.highest}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/colleges" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-purple-500">
            <div className="font-bold text-gray-900 mb-1">Browse All Colleges</div>
            <div className="text-xs text-gray-500">View the full college directory with filters</div>
          </Link>
          <Link href="/universities" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-500">
            <div className="font-bold text-gray-900 mb-1">Universities</div>
            <div className="text-xs text-gray-500">Deemed & private universities listing</div>
          </Link>
          <Link href="/compare" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
            <div className="font-bold text-gray-900 mb-1">Fee Comparison</div>
            <div className="text-xs text-gray-500">Compare colleges side by side</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, sub }: { label: string; value: number; color: string; sub?: string }) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-l-purple-400" },
    green: { bg: "bg-green-50", text: "text-green-700", border: "border-l-green-400" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-l-blue-400" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-l-amber-400" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-l-violet-400" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-l-rose-400" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-l-indigo-400" },
  };
  const c = colorMap[color] || colorMap.purple;
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${c.border}`}>
      <div className={`text-2xl font-bold ${c.text}`}>
        {value.toLocaleString()}
        {sub && <span className="text-xs font-medium text-gray-400 ml-1.5">{sub}</span>}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
