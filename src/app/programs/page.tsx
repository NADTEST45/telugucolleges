import Link from "next/link";
import { getAllPrograms, fmtFee } from "@/lib/program-data";

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Engineering: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-l-indigo-500", icon: "⚙️" },
  Pharmacy: { bg: "bg-teal-50", text: "text-teal-700", border: "border-l-teal-500", icon: "💊" },
  Medical: { bg: "bg-rose-50", text: "text-rose-700", border: "border-l-rose-500", icon: "🏥" },
  Management: { bg: "bg-amber-50", text: "text-amber-700", border: "border-l-amber-500", icon: "📊" },
  Science: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-l-emerald-500", icon: "🔬" },
  Other: { bg: "bg-gray-50", text: "text-gray-700", border: "border-l-gray-400", icon: "📚" },
};

export default function ProgramsPage() {
  const programs = getAllPrograms();

  // Group by category
  const categories = new Map<string, typeof programs>();
  for (const p of programs) {
    if (!categories.has(p.category)) categories.set(p.category, []);
    categories.get(p.category)!.push(p);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/">Home</Link><span>/</span><span className="text-gray-600 font-medium">Programs</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1">All Programs & Courses</h1>
      <p className="text-sm text-gray-500 mb-8">
        {programs.length} programs offered across {programs.reduce((s, p) => s + p.collegeCount, 0).toLocaleString()} college-program combinations.
        Click any program to see which colleges offer it and compare fees.
      </p>

      <div className="space-y-10">
        {Array.from(categories).map(([category, progs]) => {
          const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{style.icon}</span>
                <h2 className={`text-xl font-bold ${style.text}`}>{category}</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{progs.length} programs</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {progs.map(p => (
                  <Link key={p.slug} href={`/programs/${p.slug}`}
                    className={`block bg-white rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all border-l-4 ${style.border}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-lg leading-tight">{p.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {p.level} · {p.duration} {p.duration === 1 ? "year" : "years"}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold ${style.bg} ${style.text}`}>
                        {p.collegeCount} colleges
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] sm:text-[11px] text-gray-400 mb-0.5">Fee Range</div>
                        <div className="text-sm font-semibold text-[#1a5276]">
                          {fmtFee(p.feeMin)} — {fmtFee(p.feeMax)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] sm:text-[11px] text-gray-400 mb-0.5">Median</div>
                        <div className="text-sm font-bold text-green-600">{fmtFee(p.feeMedian)}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
