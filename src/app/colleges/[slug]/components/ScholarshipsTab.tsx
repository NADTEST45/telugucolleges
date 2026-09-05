"use client";
import type { ScholarshipInfo } from "@/lib/scholarships";

/**
 * "Scholarships" tab of CollegeDetail. Extracted verbatim from
 * CollegeDetail.tsx; `scholarshipInfo` is looked up server-side and passed
 * down as a prop.
 */
export default function ScholarshipsTab({ scholarshipInfo }: { scholarshipInfo: ScholarshipInfo }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-amber-900 bg-amber-50 rounded-lg p-3">Recorded scholarship terms may refer to an earlier intake. Confirm the admission year, renewal conditions and available awards on the linked official source before relying on a concession.</p>
      {/* Scholarship tables grouped by exam */}
      {(() => {
        // Group tables by examName
        const grouped = new Map<string, typeof scholarshipInfo.tables>();
        scholarshipInfo.tables.forEach(t => {
          const key = t.examName;
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key)!.push(t);
        });

        return [...grouped.entries()].map(([examName, tables]) => (
          <section key={examName} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-1">{examName}</h2>
            <p className="text-xs text-gray-500 mb-4">Merit-based tuition fee waiver</p>

            {tables.map((table, ti) => (
              <div key={ti} className={ti > 0 ? "mt-5" : ""}>
                {table.branchGroup && (
                  <div className="mb-2">
                    <span className="text-xs font-bold text-brand bg-blue-50 px-2.5 py-1 rounded-lg">{table.branchGroup}</span>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand text-white">
                        <th className="px-4 py-2.5 text-left rounded-tl-lg">Fee Concession</th>
                        <th className="px-4 py-2.5 text-left rounded-tr-lg">Eligibility Criteria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.slabs.map((slab, si) => {
                        // Determine badge color based on content
                        const p = slab.percent;
                        const isNoDiscount = p.includes("No concession") || p.includes("no concession") || p.includes("Regular");
                        const isFull = p.startsWith("100%");
                        const isHigh = /^(7[05]|8[0]|~80|~75)%/.test(p);
                        const isMid = /^(5[0]|6[0]|~60|~50)%/.test(p);
                        const isModerate = /^(3[0]|4[0]|~30|~40)%/.test(p);
                        const isLow = /^(1[0-9]|2[0-5]|~2[0-5]|~1[0-9])%/.test(p);
                        const badgeColor = isNoDiscount
                          ? "bg-gray-100 text-gray-500"
                          : isFull ? "bg-green-100 text-green-800"
                          : isHigh ? "bg-emerald-50 text-emerald-700"
                          : isMid ? "bg-blue-50 text-blue-700"
                          : isModerate ? "bg-violet-50 text-violet-700"
                          : isLow ? "bg-amber-50 text-amber-700"
                          : p.includes("Pay") ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-700";

                        return (
                          <tr key={si} className={si % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2.5 py-1.5 rounded-lg text-xs font-bold leading-tight ${badgeColor}`}>{p}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{slab.criteria}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        ));
      })()}

      {/* Continuation Requirements */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-3">Continuation Requirements</h2>
        <div className="bg-amber-50 rounded-lg px-5 py-4">
          <p className="text-sm text-amber-800 font-semibold">{scholarshipInfo.maintenance}</p>
        </div>
      </section>

      {/* Additional Notes */}
      {scholarshipInfo.notes && scholarshipInfo.notes.length > 0 && (
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-3">Important Notes</h2>
          <div className="space-y-2">
            {scholarshipInfo.notes.map((note, i) => (
              <div key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-accent mt-0.5 shrink-0">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Source Attribution */}
      <div className="bg-blue-50 rounded-xl px-5 py-3 flex items-center justify-between">
        <div className="text-xs text-blue-700">
          <span className="font-semibold">Data source:</span> {scholarshipInfo.sourceLabel}
        </div>
        <a href={scholarshipInfo.source} target="_blank" rel="noopener noreferrer"
          className="text-xs font-semibold text-accent hover:underline shrink-0 ml-3">
          Verify on official site →
        </a>
      </div>
    </div>
  );
}
