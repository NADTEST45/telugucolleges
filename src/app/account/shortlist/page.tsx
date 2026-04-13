"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useShortlistContext } from "@/components/ShortlistProvider";
import { COLLEGES, fmtFee, type College } from "@/lib/colleges";

export default function ShortlistPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { items, loading: shortlistLoading, toggle } = useShortlistContext();
  const [removing, setRemoving] = useState<string | null>(null);

  const loading = authLoading || shortlistLoading;

  // Resolve college data for each shortlisted item
  const shortlistedColleges = items.map(item => {
    const college = COLLEGES.find(c => c.slug === item.college_slug) || null;
    return { ...item, college };
  });

  async function handleRemove(collegeSlug: string, program?: string | null) {
    setRemoving(collegeSlug + (program || ""));
    await toggle(collegeSlug, program);
    setRemoving(null);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-100 rounded w-64" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Shortlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.user_metadata?.full_name ? `Hi ${user.user_metadata.full_name}! ` : ""}
            {items.length === 0
              ? "You haven't shortlisted any colleges yet."
              : `${items.length} college${items.length === 1 ? "" : "s"} shortlisted`}
          </p>
        </div>
        <button
          onClick={async () => { await signOut(); window.location.href = "/"; }}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No colleges shortlisted yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Browse colleges and tap the heart icon to add them to your shortlist. You can compare fees, cutoffs, and placements all in one place.
          </p>
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a5276] text-white text-sm font-semibold hover:bg-[#1a5276]/90 transition-colors"
          >
            Browse Colleges
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* Shortlisted colleges */}
      {shortlistedColleges.length > 0 && (
        <div className="space-y-3">
          {shortlistedColleges.map(({ id, college_slug, program, college: c }) => {
            const isRemoving = removing === college_slug + (program || "");
            return (
              <div
                key={id}
                className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 transition-all ${isRemoving ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {c ? (
                      <>
                        <Link href={`/colleges/${c.slug}`} className="group">
                          <div className="font-bold text-[15px] group-hover:text-[#2e86c1] transition-colors">{c.name}</div>
                        </Link>
                        <div className="text-xs text-gray-400 mt-0.5">{c.district}, {c.state} · {c.affiliation}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-[15px] text-gray-400">{college_slug}</div>
                        <div className="text-xs text-amber-500 mt-0.5">College data no longer available</div>
                      </>
                    )}

                    {program && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                        {program}
                      </span>
                    )}

                    {/* Quick stats — only if college data exists */}
                    {c && (
                      <div className="flex gap-4 mt-3 text-xs">
                        <div>
                          <span className="text-gray-400">Fee: </span>
                          <span className="font-semibold text-[#1a5276]">{fmtFee(c.fee)}/yr</span>
                        </div>
                        {c.cutoff.cse > 0 && (
                          <div>
                            <span className="text-gray-400">CSE Cutoff: </span>
                            <span className="font-semibold">{c.cutoff.cse.toLocaleString()}</span>
                          </div>
                        )}
                        {c.placements.avg > 0 && (
                          <div>
                            <span className="text-gray-400">Avg Pkg: </span>
                            <span className="font-semibold text-green-600">₹{c.placements.avg}L</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remove button — 44px min touch target */}
                  <button
                    onClick={() => handleRemove(college_slug, program)}
                    disabled={isRemoving}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shrink-0 disabled:opacity-50"
                    aria-label="Remove from shortlist"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare CTA — only show if at least 2 valid colleges exist */}
      {(() => {
        const validColleges = shortlistedColleges.filter(x => x.college);
        if (validColleges.length < 2) return null;
        return (
          <div className="mt-8 bg-[#1a5276]/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Ready to compare your shortlisted colleges?
            </p>
            <Link
              href={`/compare/${validColleges[0].college!.slug}-vs-${validColleges[1].college!.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a5276] text-white text-sm font-semibold hover:bg-[#1a5276]/90 transition-colors"
          >
            Compare Top 2
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </Link>
        </div>
        );
      })()}
    </main>
  );
}
