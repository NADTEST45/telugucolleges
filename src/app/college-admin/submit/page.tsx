"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EDITABLE_FIELDS, type EditCategory, type AdminUser } from "@/lib/supabase/types";

export default function SubmitEditPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [category, setCategory] = useState<EditCategory>("fees");
  const [fieldName, setFieldName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.user || (data.user.role !== "college_admin" && data.user.role !== "super_admin")) {
        router.push("/college-admin/login");
        return;
      }
      setUser(data.user);
    }
    load();
  }, [router]);

  // Reset field when category changes
  useEffect(() => {
    const fields = EDITABLE_FIELDS[category];
    if (fields.length > 0) setFieldName(fields[0].field);
    setNewValue("");
  }, [category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/edits/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_code: user?.college_code,
          category,
          field_name: fieldName,
          new_value: newValue,
          change_reason: reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/college-admin/dashboard"), 2000);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const currentField = EDITABLE_FIELDS[category]?.find(f => f.field === fieldName);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Edit Submitted</h2>
          <p className="text-sm text-gray-500">Your change request is pending review by the TeluguColleges admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a5276] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/college-admin/dashboard" className="text-white/60 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <span className="font-bold">Submit Edit</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-gray-900">Propose a Change</h1>
            <p className="text-sm text-gray-500 mt-1">
              Editing data for <span className="font-medium text-[#1a5276]">{user.college_name}</span> ({user.college_code})
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What would you like to edit?</label>
              <div className="flex flex-wrap gap-2">
                {(["fees", "placements", "basic_info"] as EditCategory[]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category === cat
                        ? "bg-[#1a5276] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat === "fees" ? "Fees" : cat === "placements" ? "Placements" : "Basic Info"}
                  </button>
                ))}
              </div>
            </div>

            {/* Field selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
              <select
                value={fieldName}
                onChange={e => { setFieldName(e.target.value); setNewValue(""); }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              >
                {EDITABLE_FIELDS[category].map(f => (
                  <option key={f.field} value={f.field}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* New value input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Value</label>
              {currentField?.type === "boolean" ? (
                <select
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select...</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input
                  type={currentField?.type === "number" ? "number" : "text"}
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder={currentField?.type === "number" ? "Enter a number" : "Enter value"}
                />
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Change</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder="e.g., Updated fee as per latest APHERMC order for 2025-26..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1a5276] text-white font-bold py-3 rounded-xl hover:bg-[#154360] transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit for Review"}
              </button>
              <Link
                href="/college-admin/dashboard"
                className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
