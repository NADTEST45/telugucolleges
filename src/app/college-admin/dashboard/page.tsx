"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EditRequest, AdminUser } from "@/lib/supabase/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function CollegeAdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [edits, setEdits] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.user) { router.push("/college-admin/login"); return; }
        if (meData.user.role === "super_admin") { router.push("/admin"); return; }
        setUser(meData.user);

        const editsRes = await fetch("/api/edits");
        const editsData = await editsRes.json();
        setEdits(editsData.edits || []);
      } catch {
        router.push("/college-admin/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/college-admin/login");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  }

  const pending = edits.filter(e => e.status === "pending").length;
  const approved = edits.filter(e => e.status === "approved").length;
  const rejected = edits.filter(e => e.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a5276] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-lg font-bold">TC</Link>
            <span className="mx-2 text-white/30">|</span>
            <span className="text-sm text-white/80">College Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60 hidden sm:inline">{user?.email}</span>
            <button onClick={handleLogout} className="text-xs bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* College info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{user?.college_name || "Dashboard"}</h1>
          <p className="text-sm text-gray-500 mt-1">Code: {user?.college_code} · Manage your college data</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-yellow-400">
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <div className="text-xs text-gray-500 mt-1">Pending Review</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-green-400">
            <div className="text-2xl font-bold text-green-600">{approved}</div>
            <div className="text-xs text-gray-500 mt-1">Approved</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-red-400">
            <div className="text-2xl font-bold text-red-600">{rejected}</div>
            <div className="text-xs text-gray-500 mt-1">Rejected</div>
          </div>
        </div>

        {/* Submit button */}
        <div className="mb-6">
          <Link
            href="/college-admin/submit"
            className="inline-flex items-center gap-2 bg-[#1a5276] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#154360] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Submit New Edit
          </Link>
        </div>

        {/* Edit history */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Your Submissions</h2>
          </div>
          {edits.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No submissions yet. Click &quot;Submit New Edit&quot; to propose changes.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Field</th>
                    <th className="px-6 py-3 text-left">Old Value</th>
                    <th className="px-6 py-3 text-left">New Value</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {edits.map(edit => (
                    <tr key={edit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{edit.field_name}</div>
                        <div className="text-xs text-gray-400">{edit.category}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{edit.old_value}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{edit.new_value}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[edit.status]}`}>
                          {edit.status}
                        </span>
                        {edit.status === "rejected" && edit.reviewer_notes && (
                          <div className="text-xs text-red-500 mt-1">{edit.reviewer_notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(edit.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
