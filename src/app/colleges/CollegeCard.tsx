import Link from "next/link";
import { type College, fmtFee } from "@/lib/colleges";
import ShortlistButton from "@/components/ShortlistButton";

/**
 * Server-rendered college card. The only client portion is the
 * <ShortlistButton/> island; everything else is plain HTML emitted by
 * the server, which keeps the colleges dataset out of the JS bundle.
 */
function nirfLabel(rank: number): string {
  if (rank <= 0) return "";
  if (rank <= 100) return `#${rank}`;
  if (rank <= 150) return "101-150";
  if (rank <= 200) return "151-200";
  return "201-300";
}

export default function CollegeCard({ c, borderClass }: { c: College; borderClass: string }) {
  const feeLabel =
    c.type === "Deemed University" || c.type === "Private University" || c.type === "Government"
      ? "Tuition/yr"
      : "Convener Fee";

  return (
    <div className={`cv-card relative bg-white rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-sm hover:shadow-md transition-all border-l-4 ${borderClass}`}>
      {/* Full-card link — covers entire card for navigation */}
      <Link href={`/colleges/${c.slug}`} className="absolute inset-0 z-0 rounded-xl" aria-label={c.name} />
      {/* Shortlist button — positioned outside the Link DOM to avoid iOS Safari tap conflicts */}
      <div className="absolute top-2 right-2 z-10">
        <ShortlistButton collegeSlug={c.slug} />
      </div>
      {/* Desktop: side-by-side | Mobile: stacked */}
      <div className="relative z-[1] pointer-events-none flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm sm:text-[15px] leading-tight pr-10">{c.name}</div>
          <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">{c.district}, {c.state} · {c.affiliation} · Est. {c.year}</div>
          <div className="flex gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
            <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold ${c.type === "Government" ? "bg-green-50 text-green-600" : c.type === "Deemed University" ? "bg-amber-50 text-amber-700" : c.type === "Private University" ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-600"}`}>{c.type}</span>
            {c.nirf > 0 && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-600">NIRF {nirfLabel(c.nirf)}</span>}
            {c.naac && c.naac !== "-" && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-600">NAAC {c.naac}</span>}
            {c.nba && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-600">NBA</span>}
            {c.branches.includes("B.Pharm") && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-teal-50 text-teal-600">Pharmacy</span>}
            {c.branches.includes("MBBS") && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-rose-50 text-rose-600">Medical</span>}
          </div>
        </div>
        {/* Stats: 4-col on mobile (full-width row below), 4-col on desktop (fixed-width right side) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0 sm:w-[320px]">
          <div>
            <div className="text-[11px] sm:text-xs text-gray-500">{feeLabel}</div>
            <div className="font-bold text-brand text-xs sm:text-sm">{fmtFee(c.fee)}</div>
          </div>
          <div>
            {c.cutoff.cse > 0 ? (
              <>
                <div className="text-[11px] sm:text-xs text-gray-500">CSE Cutoff</div>
                <div className="font-bold text-xs sm:text-sm">{c.cutoff.cse.toLocaleString()}</div>
              </>
            ) : c.branches.includes("B.Pharm") ? (
              <>
                <div className="text-[11px] sm:text-xs text-gray-500">Type</div>
                <div className="font-bold text-teal-600 text-xs sm:text-sm">Pharmacy</div>
              </>
            ) : c.branches.includes("MBBS") ? (
              <>
                <div className="text-[11px] sm:text-xs text-gray-500">Type</div>
                <div className="font-bold text-rose-600 text-xs sm:text-sm">Medical</div>
              </>
            ) : (
              <>
                <div className="text-[11px] sm:text-xs text-gray-500">CSE Cutoff</div>
                <div className="font-bold text-gray-300 text-xs sm:text-sm">—</div>
              </>
            )}
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-gray-500">Avg Pkg</div>
            <div className={`font-bold text-xs sm:text-sm ${c.placements.avg > 0 ? "text-green-600" : "text-gray-300"}`}>
              {c.placements.avg > 0 ? `₹${c.placements.avg}L` : "—"}
            </div>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-gray-500">Highest</div>
            <div className={`font-bold text-xs sm:text-sm ${c.placements.highest > 0 ? "text-amber-600" : "text-gray-300"}`}>
              {c.placements.highest > 0 ? `₹${c.placements.highest}L` : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
