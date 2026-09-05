"use client";
import type { College } from "@/lib/colleges";
import type { CollegePlacementData } from "@/lib/placement-data";
import { branchDisplayName } from "@/lib/placement-branch-names";

/**
 * "Placement Data" tab of CollegeDetail. Extracted verbatim from
 * CollegeDetail.tsx; `pd` is looked up server-side and passed down so the
 * placement dataset never ships in the client bundle.
 */
export default function PlacementsTab({ c, pd }: { c: College; pd: CollegePlacementData | null }) {
  const latestYear = pd?.years[0] ?? null;
  return (
    <div className="space-y-6">
      {/* ── Placement Highlights (always shown) ── */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1">Placement Highlights</h2>
        <p className="text-xs text-gray-500 mb-4">{c.placements.avg > 0 ? "Recorded headline figures; reporting year and source are not established for every value" : "Placement data is not available in this dataset"}</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-3 sm:p-5 text-center">
            <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Average Package</div>
            <div className="text-lg sm:text-2xl font-extrabold text-green-700">{c.placements.avg > 0 ? `₹${c.placements.avg} LPA` : "—"}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 sm:p-5 text-center">
            <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Highest Package</div>
            <div className="text-lg sm:text-2xl font-extrabold text-amber-700">{c.placements.highest > 0 ? `₹${c.placements.highest} LPA` : "—"}</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 sm:p-5 text-center">
            <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Recruiting Companies</div>
            <div className="text-lg sm:text-2xl font-extrabold text-accent">{c.placements.companies > 0 ? `${c.placements.companies}+` : "—"}</div>
          </div>
        </div>

        {/* ROI section removed */}
      </section>

      {/* ── NIRF / institutional placement summary (college-level) ── */}
      {pd?.summary && (
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-1">Placement Summary · {pd.summary.year}</h2>
          <p className="text-xs text-gray-500 mb-4">
            {pd.source === "NIRF" ? "Figures recorded from an institutional NIRF submission" : "Institutional data"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {pd.summary.medianPackage != null && (
              <div className="bg-green-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Median Package</div>
                <div className="text-base sm:text-xl font-extrabold text-green-700">₹{pd.summary.medianPackage} LPA</div>
              </div>
            )}
            {pd.summary.avgPackage != null && (
              <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Average Package</div>
                <div className="text-base sm:text-xl font-extrabold text-emerald-700">₹{pd.summary.avgPackage} LPA</div>
              </div>
            )}
            {pd.summary.maxPackage != null && (
              <div className="bg-amber-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Highest Package</div>
                <div className="text-base sm:text-xl font-extrabold text-amber-700">₹{pd.summary.maxPackage} LPA</div>
              </div>
            )}
            {pd.summary.placed != null && (
              <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Students Placed</div>
                <div className="text-base sm:text-xl font-extrabold text-accent">{pd.summary.placed.toLocaleString("en-IN")}</div>
              </div>
            )}
            {pd.summary.graduated != null && (
              <div className="bg-indigo-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Graduated</div>
                <div className="text-base sm:text-xl font-extrabold text-indigo-700">{pd.summary.graduated.toLocaleString("en-IN")}</div>
              </div>
            )}
            {pd.summary.placed != null && pd.summary.graduated != null && pd.summary.graduated > 0 && (
              <div className="bg-purple-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Placement Rate</div>
                <div className="text-base sm:text-xl font-extrabold text-purple-700">{Math.round((pd.summary.placed / pd.summary.graduated) * 100)}%</div>
              </div>
            )}
          </div>
          {pd.summary.note && <p className="text-[11px] sm:text-xs text-gray-500 mt-3">{pd.summary.note}</p>}
          {pd.sourceUrl && (
            <p className="text-[11px] sm:text-xs text-gray-500 mt-2">Source: <a href={pd.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">{pd.source === "NIRF" ? "NIRF India Rankings 2025" : "Institution"}</a></p>
          )}
        </section>
      )}

      {/* ── Branch-wise Placement Data (only if detailed data exists) ── */}
      {latestYear && Object.keys(latestYear.branches).length > 0 && (
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-1">Branch-wise Placement Data</h2>
          <p className="text-xs text-gray-500 mb-4">Detailed placements by department · {latestYear.year}</p>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-[280px] sm:min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 px-3 text-gray-500 font-medium text-xs sticky left-0 bg-white">Branch</th>
                  <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Intake</th>
                  <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Placed</th>
                  <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">%</th>
                  <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Avg Pkg</th>
                  {Object.values(latestYear.branches).some(b => b.maxPackage) && (
                    <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Max Pkg</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.entries(latestYear.branches)
                  .sort((a, b) => b[1].avgPackage - a[1].avgPackage)
                  .map(([branch, data]) => {
                    const pct = data.intake > 0 && data.placed > 0 ? Math.round((data.placed / data.intake) * 100) : 0;
                    return (
                      <tr key={branch} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold sticky left-0 bg-white break-words">{branchDisplayName(branch)}</td>
                        <td className="py-2.5 px-3 text-right text-gray-600">{data.intake || "—"}</td>
                        <td className="py-2.5 px-3 text-right font-semibold">{data.placed || "—"}</td>
                        <td className="py-2.5 px-3 text-right">
                          {pct > 0 ? (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${pct >= 80 ? "bg-green-100 text-green-700" : pct >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                              {pct}%
                            </span>
                          ) : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-green-700">₹{data.avgPackage}L</td>
                        {Object.values(latestYear.branches).some(b => b.maxPackage) && (
                          <td className="py-2.5 px-3 text-right font-bold text-amber-600">{data.maxPackage ? `₹${data.maxPackage}L` : "—"}</td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {pd?.sourceUrl && (
            <p className="text-[11px] sm:text-xs text-gray-500 mt-3">Source: <a href={pd.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">AICTE Mandatory Disclosure</a></p>
          )}
        </section>
      )}

      {/* ── Top Recruiters ── */}
      {latestYear?.topRecruiters && latestYear.topRecruiters.length > 0 && (
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-1">Top Recruiters</h2>
          <p className="text-xs text-gray-500 mb-4">Companies that recruited from this college · {latestYear.year}</p>
          <div className="grid gap-2">
            {latestYear.topRecruiters
              .sort((a, b) => b.offers - a.offers)
              .slice(0, 15)
              .map((r, i) => (
                <div key={r.name} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="font-semibold text-sm flex-1 min-w-0 truncate">{r.name}</span>
                  <span className="text-xs text-gray-500 shrink-0">{r.offers} offers</span>
                  <span className="text-xs font-bold text-green-700 shrink-0 w-16 text-right">₹{r.avgPackage}L</span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ── Year-over-Year Trends (if multiple years available) ── */}
      {pd && pd.years.length > 1 && (
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-1">Placement Trends</h2>
          <p className="text-xs text-gray-500 mb-4">Year-over-year placement performance</p>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-[280px] sm:min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 px-3 text-gray-500 font-medium text-xs">Year</th>
                  {Object.keys(pd.years[0].branches).map(br => (
                    <th key={br} className="py-2 px-3 text-gray-500 font-medium text-xs text-center" colSpan={2}>{br}</th>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 text-left">
                  <th className="py-1 px-3"></th>
                  {Object.keys(pd.years[0].branches).map(br => (
                    <>{/* eslint-disable-next-line react/jsx-key */}
                      <th key={`${br}-p`} className="py-1 px-2 text-[11px] sm:text-xs text-gray-500 font-medium text-right">Placed</th>
                      <th key={`${br}-a`} className="py-1 px-2 text-[11px] sm:text-xs text-gray-500 font-medium text-right">Avg ₹</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pd.years.map(yr => (
                  <tr key={yr.year} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-semibold text-brand">{yr.year}</td>
                    {Object.keys(pd.years[0].branches).map(br => {
                      const d = yr.branches[br];
                      return (
                        <>{/* eslint-disable-next-line react/jsx-key */}
                          <td key={`${yr.year}-${br}-p`} className="py-2.5 px-2 text-right text-gray-700">{d?.placed || "—"}</td>
                          <td key={`${yr.year}-${br}-a`} className="py-2.5 px-2 text-right font-bold text-green-700">{d ? `${d.avgPackage}L` : "—"}</td>
                        </>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Data source note ── */}
      <section className="bg-blue-50 rounded-xl p-4 sm:p-5">
        <div className="flex gap-3 items-start">
          <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <div>
            <p className="text-sm font-semibold text-brand mb-1">About this data</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {pd
                ? "The detailed figures use the source and reporting year identified above. Median salary and average salary are different measures; headline figures may cover a different cohort."
                : "The source and reporting year for these headline figures have not been established here. Confirm them with the college before comparing outcomes."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
