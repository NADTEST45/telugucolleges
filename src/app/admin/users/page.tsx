"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COLLEGES } from "@/lib/colleges";
import type { AdminUser } from "@/lib/supabase/types";

export default function ManageUsersPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "super_admin") {
        router.push("/admin/login");
        return;
      }
      setUser(meData.user);

      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
      setLoading(false);
    }
    init();
  }, [router]);

  // Auto-fill college name when code is selected
  function handleCollegeSelect(code: string) {
    setCollegeCode(code);
    const c = COLLEGES.find(c => c.code === code);
    setCollegeName(c?.name || "");
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, college_code: collegeCode, college_name: collegeName }),
      });

      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Failed to create user"); return; }

      setUsers(prev => [data.user, ...prev]);
      setShowForm(false);
      setEmail("");
      setPassword("");
      setCollegeCode("");
      setCollegeName("");
    } catch {
      setFormError("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <span className="font-bold">Manage College Admins</span>
          </div>
          <span className="text-xs text-white/50">{user?.email}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">College Admin Accounts</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {showForm ? "Cancel" : "+ Add College Admin"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreateUser} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
            {formError && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{formError}</div>}

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="admin@college.edu" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Password</span>
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} required
                  className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Temporary password" />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">College</span>
              <select value={collegeCode} onChange={e => handleCollegeSelect(e.target.value)} required
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">Select college...</option>
                {COLLEGES.slice().sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
            </label>

            <button type="submit" disabled={formLoading}
              className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
              {formLoading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Users list */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {users.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">No admin users yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">College</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500">{u.college_name || "—"} <span className="text-xs text-gray-300">{u.college_code}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "super_admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                        {u.role === "super_admin" ? "Super Admin" : "College Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
