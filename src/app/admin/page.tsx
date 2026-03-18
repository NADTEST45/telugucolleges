"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EditRequest, AdminUser } from "@/lib/supabase/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [edits, setEdits] = useState<EditRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const loadEdits = useCallback(async () => {
    const url = filter === "all" ? "/api/edits" : `/api/edits?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setEdits(data.edits || []);
  }, [filter]);

  useEffect(() => {
    async function init() {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "super_admin") {
        router.push("/admin/login");
        return;
      }
      setUser(meData.user);
      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (user) loadEdits();
  }, [user, filter, loadEdits]);

  async function handleReview(editId: string, action: "approve" | "reject") {
    if (action === "reject" && !reviewNotes.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch("/api/edits/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_id: editId, action, notes: reviewNotes }),
      });
      if (res.ok) {
        setReviewingId(null);
        setReviewNotes("");
        await loadEdits();
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  }

  const pendingCount = edits.length; // when filter is "pending" this is the count

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold">TC</Link>
            <span className="text-white/30">|</span>
            <span className="text-sm text-white/80">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/users" className="text-xs bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25 transition-colors">
              Manage Users
            </Link>
            <span className="text-xs text-white/50 hidden sm:inline">{user?.email}</span>
            <button onClick={handleLogout} className="text-xs bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending College Edits</h1>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["pending", "approved", "rejected", "all"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Edits list */}
        {edits.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
            {filter === "pending" ? "No pending edits. All clear!" : `No ${filter} edits.`}
          </div>
        ) : (
          <div className="space-y-4">
            {edits.map(edit => (
              <div key={edit.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{edit.college_name}</span>
                      <span className="text-xs text-gray-400">({edit.college_code})</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[edit.status]}`}>
                        {edit.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">{edit.field_name}</span>
                      <span className="mx-2">·</span>
                      <span className="text-xs">{edit.category}</span>
                      <span className="mx-2">·</span>
                      <span className="text-xs">by {edit.submitted_by_email}</span>
                    </div>

                    {/* Diff */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg line-through">{edit.old_value || "(empty)"}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg font-medium">{edit.new_value}</span>
                    </div>

                    {edit.change_reason && (
                      <div className="text-xs text-gray-400 mt-2 italic">&quot;{edit.change_reason}&quot;</div>
                    )}

                    {edit.reviewer_notes && (
                      <div className="text-xs text-red-500 mt-1">Review notes: {edit.reviewer_notes}</div>
                    )}
                  </div>

                  {/* Actions */}
                  {edit.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      {reviewingId === edit.id ? (
                        <div className="flex flex-col gap-2 w-64">
                          <textarea
                            value={reviewNotes}
                            onChange={e => setReviewNotes(e.target.value)}
                            placeholder="Notes (required for rejection)..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReview(edit.id, "approve")}
                              disabled={actionLoading}
                              className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(edit.id, "reject")}
                              disabled={actionLoading}
                              className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => { setReviewingId(null); setReviewNotes(""); }}
                              className="px-3 py-2 text-xs text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewingId(edit.id)}
                          className="bg-[#1a5276] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#154360] transition-colors"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-2 bg-gray-50 text-xs text-gray-400">
                  Submitted {new Date(edit.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
