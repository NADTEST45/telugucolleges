import { PROGRAMS, fmtFee } from "@/lib/programs";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return PROGRAMS.map(p => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const prog = PROGRAMS.find(p => p.id === params.id);
  if (!prog) return { title: "Not Found" };
  return {
    title: `${prog.name} Fees — ${prog.state} (${prog.goNumber}) | TeluguColleges`,
    description: `Official ${prog.name} fee structure for ${prog.entries.length} colleges in ${prog.state} from ${prog.goNumber}.`,
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prog = PROGRAMS.find(p => p.id === id);
  if (!prog) notFound();

  const sorted = [...prog.entries].sort((a, b) => a.fee - b.fee);
  const minFee = sorted[0]?.fee || 0;
  const maxFee = sorted[sorted.length - 1]?.fee || 0;
  const avgFee = Math.round(sorted.reduce((s, e) => s + e.fee, 0) / sorted.length);
  const color = prog.state === "Telangana" ? "#2e86c1" : "#16a34a";

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-gray-600">Home</Link>
        {" / "}
        <Link href="/programs" className="hover:text-gray-600">Programs</Link>
        {" / "}
        <span className="text-gray-600">{prog.name} — {prog.state}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">{prog.name} Fee Structure</h1>
            <p className="text-gray-500 mt-1">{prog.state} — {prog.entries.length} colleges</p>
          </div>
          <div className="sm:ml-auto text-right">
            <div className="text-xs font-semibold px-3 py-1 rounded-full inline-block" style={{ background: color + "15", color }}>
              {prog.goNumber}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold" style={{ color }}>{prog.entries.length}</div>
            <div className="text-xs text-gray-500 mt-1">Colleges</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-green-600">{fmtFee(minFee)}</div>
            <div className="text-xs text-gray-500 mt-1">Lowest Fee</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-red-500">{fmtFee(maxFee)}</div>
            <div className="text-xs text-gray-500 mt-1">Highest Fee</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-gray-700">{fmtFee(avgFee)}</div>
            <div className="text-xs text-gray-500 mt-1">Average Fee</div>
          </div>
        </div>

        {/* GO Info */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
          <span className="font-semibold">Source:</span> {prog.goNumber}, dated {prog.goDate} — Block period: {prog.blockPeriod}
          {prog.note && <div className="text-xs text-gray-500 mt-1">{prog.note}</div>}
        </div>
      </div>

      {/* College Fee Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg">All {prog.entries.length} Colleges — Sorted by Fee (Low → High)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3 w-16">Code</th>
                <th className="px-4 py-3">College Name</th>
                {sorted[0]?.district && <th className="px-4 py-3 w-20">District</th>}
                {sorted[0]?.programme && <th className="px-4 py-3 w-24">Programme</th>}
                <th className="px-4 py-3 w-28 text-right">Annual Fee</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, i) => {
                const isLowest = entry.fee === minFee;
                const isHighest = entry.fee === maxFee;
                return (
                  <tr key={`${entry.code}-${i}`} className={`border-b border-gray-50 hover:bg-gray-50 ${isLowest ? "bg-green-50" : isHighest ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color }}>{entry.code}</td>
                    <td className="px-4 py-3 font-medium">{entry.name}</td>
                    {entry.district !== undefined && <td className="px-4 py-3 text-gray-500 text-xs">{entry.district}</td>}
                    {entry.programme !== undefined && <td className="px-4 py-3 text-xs">{entry.programme}</td>}
                    <td className={`px-4 py-3 text-right font-bold ${isLowest ? "text-green-600" : isHighest ? "text-red-500" : ""}`}>
                      {fmtFee(entry.fee)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back */}
      <div className="mt-8 text-center">
        <Link href="/programs" className="text-sm font-semibold hover:underline" style={{ color }}>
          ← Back to All Programs
        </Link>
      </div>
    </main>
  );
}
