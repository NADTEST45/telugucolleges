import Link from "next/link";
import { COLLEGES, fmtFee } from "@/lib/colleges";
import { getLatestNews } from "@/lib/news";
import AdSlot from "@/components/ads/AdSlot";

export default function Home() {
  const stats = {
    total: COLLEGES.length,
    ts: COLLEGES.filter(c => c.state === "Telangana").length,
    ap: COLLEGES.filter(c => c.state === "Andhra Pradesh").length,
    govt: COLLEGES.filter(c => c.type === "Government").length,
    eng: COLLEGES.filter(c => c.branches.some(b => ["CSE","ECE","EEE","MECH","CIVIL"].includes(b))).length,
    pharm: COLLEGES.filter(c => c.branches.includes("B.Pharm")).length,
    mpharm: COLLEGES.filter(c => c.branches.includes("M.Pharm")).length,
    pharmd: COLLEGES.filter(c => c.branches.includes("Pharm.D")).length,
    med: COLLEGES.filter(c => c.branches.includes("MBBS")).length,
    mba: 567,
    mca: 152,
  };

  const latestNews = getLatestNews(3);
  const topTS = COLLEGES.filter(c => c.state === "Telangana" && c.cutoff.cse > 0).sort((a, b) => a.cutoff.cse - b.cutoff.cse).slice(0, 5);
  const topAP = COLLEGES.filter(c => c.state === "Andhra Pradesh" && c.cutoff.cse > 0).sort((a, b) => a.cutoff.cse - b.cutoff.cse).slice(0, 5);
  const cheapest = [...COLLEGES].filter(c => c.fee > 0 && c.branches.some(b => ["CSE","ECE","EEE","MECH","CIVIL"].includes(b))).sort((a, b) => a.fee - b.fee).slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f2b3d] via-[#1a5276] to-[#2e86c1] text-white px-4 sm:px-6 pt-10 sm:pt-16 pb-14 sm:pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px"}} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-blue-200 mb-2 sm:mb-3 font-medium">Andhra Pradesh & Telangana</p>
          <h1 className="text-2xl sm:text-5xl font-extrabold mb-3 sm:mb-5 leading-tight">
            Find the Right College<br className="hidden sm:block" /><span className="sm:hidden"> </span>for Your Future
          </h1>
          <p className="text-sm sm:text-lg opacity-80 mb-6 sm:mb-10 font-light max-w-xl mx-auto leading-relaxed">
            Compare fees, cutoffs, placements and rankings for {stats.total}+ engineering, pharmacy & medical colleges across both states.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
            <Link href="/colleges" className="inline-block bg-white text-[#1a5276] font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg shadow-xl active:scale-[0.98] transition-all">
              Explore Colleges
            </Link>
            <Link href="/eapcet" className="inline-block bg-white/15 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg border border-white/30 active:scale-[0.98] transition-all">
              EAPCET Predictor
            </Link>
          </div>
        </div>
      </section>

      {/* Program Quick Links Bar */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-12 sm:top-14 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto scrollbar-hide px-2 sm:px-6">
          {[
            { label: "B.Tech", href: "/programs/b-tech" },
            { label: "M.Tech", href: "/programs/m-tech" },
            { label: "MBA", href: "/programs/mba" },
            { label: "MCA", href: "/programs/mca" },
            { label: "BBA", href: "/programs/bba" },
            { label: "BCA", href: "/programs/bca" },
            { label: "MBBS", href: "/programs/mbbs" },
            { label: "B.Pharm", href: "/programs/b-pharm" },
            { label: "Pharm.D", href: "/programs/pharm-d" },
            { label: "M.Pharm", href: "/programs/m-pharm" },
            { label: "B.Arch", href: "/programs/b-arch" },
            { label: "BA LLB", href: "/programs/ba-llb-hons" },
            { label: "PhD", href: "/programs/ph-d" },
            { label: "Compare", href: "/compare" },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-600 hover:text-[#1a5276] hover:bg-blue-50 whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-[#2e86c1] active:bg-blue-50">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Ad: Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        <AdSlot slot="homepage_hero_below" />
      </div>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 relative z-10 pt-8 sm:pt-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            { label: "B.Tech", count: stats.eng, href: "/programs/b-tech", icon: "⚙️", color: "text-indigo-600" },
            { label: "MBA", count: stats.mba, href: "/programs/mba", icon: "📊", color: "text-amber-600" },
            { label: "MCA", count: stats.mca, href: "/programs/mca", icon: "💻", color: "text-cyan-600" },
            { label: "BBA", count: null, href: "/programs/bba", icon: "📈", color: "text-orange-600" },
            { label: "BCA", count: null, href: "/programs/bca", icon: "🖥️", color: "text-sky-600" },
            { label: "MBBS", count: stats.med, href: "/programs/mbbs", icon: "🏥", color: "text-rose-600" },
            { label: "B.Pharm", count: stats.pharm, href: "/programs/b-pharm", icon: "💊", color: "text-teal-600" },
            { label: "Pharm.D", count: stats.pharmd, href: "/programs/pharm-d", icon: "🧪", color: "text-emerald-600" },
            { label: "M.Pharm", count: stats.mpharm, href: "/programs/m-pharm", icon: "🔬", color: "text-violet-600" },
            { label: "M.Tech", count: null, href: "/programs/m-tech", icon: "🎓", color: "text-blue-600" },
            { label: "B.Arch", count: null, href: "/programs/b-arch", icon: "🏛️", color: "text-stone-600" },
            { label: "BA LLB", count: null, href: "/programs/ba-llb-hons", icon: "⚖️", color: "text-red-600" },
          ].map(item => (
            <Link key={item.label} href={item.href} className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
              <div className="text-xl sm:text-2xl mb-1">{item.icon}</div>
              <div className={`font-bold text-xs sm:text-sm ${item.color}`}>{item.label}</div>
              {item.count ? <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{item.count} colleges</div> : null}
            </Link>
          ))}
        </div>
      </section>

      {/* News Alert Strip */}
      {latestNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
              <span className="font-bold text-sm text-gray-800">Latest Admission Updates</span>
              <Link href="/news" className="ml-auto text-xs text-[#2e86c1] font-semibold hover:underline">View All →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {latestNews.map(item => (
                <Link key={item.id} href="/news" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold ${item.state === "AP" ? "bg-green-50 text-green-700" : item.state === "TS" ? "bg-blue-50 text-[#2e86c1]" : "bg-violet-50 text-violet-700"}`}>
                    {item.state}
                  </span>
                  <span className="text-sm text-gray-700 truncate">{item.title}</span>
                  <span className="shrink-0 text-[10px] text-gray-400 ml-auto">{item.date.slice(5)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Top CSE Colleges */}
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Top CSE Colleges by EAPCET Cutoff</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Final-phase OC closing ranks from official TSCHE/APSCHE data. Lower rank = harder to get in.</p>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {[
            { title: "Telangana — Top 5", color: "bg-[#2e86c1]", list: topTS },
            { title: "Andhra Pradesh — Top 5", color: "bg-green-600", list: topAP },
          ].map(({ title, color, list }) => (
            <div key={title} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className={`${color} text-white px-4 sm:px-5 py-3 sm:py-3.5 font-bold text-sm sm:text-base`}>{title}</div>
              {list.map((c, i) => (
                <Link key={c.id} href={`/colleges/${c.slug}`} className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-gray-400 font-semibold mr-1.5 sm:mr-2 text-xs sm:text-sm">#{i + 1}</span>
                    <span className="font-semibold text-xs sm:text-sm">{c.name.length > 32 ? c.name.slice(0, 32) + "..." : c.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-[#1a5276] text-xs sm:text-sm">Rank {c.cutoff.cse.toLocaleString()}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400">{fmtFee(c.fee)}/yr</div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Ad: Mid-page */}
        <div className="mb-10 sm:mb-14">
          <AdSlot slot="homepage_mid" />
        </div>

        {/* Affordable Colleges */}
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Most Affordable B.Tech Programs</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Lowest tuition fees across AP & Telangana.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {cheapest.map(c => (
            <Link key={c.id} href={`/colleges/${c.slug}`} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98]">
              <div className={`text-[11px] sm:text-xs font-semibold mb-1 ${c.type === "Government" ? "text-green-600" : "text-[#2e86c1]"}`}>
                {c.type} · {c.state}
              </div>
              <div className="font-bold text-sm sm:text-base mb-2 leading-snug">{c.name}</div>
              <div className="flex items-center justify-between">
                <div className="text-lg sm:text-xl font-extrabold text-[#1a5276]">{fmtFee(c.fee)}<span className="text-[10px] sm:text-xs font-normal text-gray-400">/yr</span></div>
                <span className="bg-blue-50 text-[#2e86c1] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold">{c.district}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-5 mb-10 sm:mb-14">
          {[
            ["Telangana Colleges", `${stats.ts} colleges with fees, cutoffs & placements`, "border-l-[#2e86c1]", "/colleges?state=Telangana"],
            ["Andhra Pradesh Colleges", `${stats.ap} colleges with fees, cutoffs & placements`, "border-l-green-600", "/colleges?state=Andhra+Pradesh"],
            ["Compare Colleges", "Pick 2–4 colleges and compare side by side", "border-l-amber-500", "/compare"],
          ].map(([title, desc, border, href]) => (
            <Link key={title as string} href={href as string} className={`block bg-white rounded-xl p-4 sm:p-6 shadow-sm border-l-4 ${border} hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98]`}>
              <div className="font-bold text-base sm:text-lg mb-1">{title as string}</div>
              <div className="text-xs sm:text-sm text-gray-500">{desc as string}</div>
            </Link>
          ))}
        </div>

        {/* Ad: Bottom */}
        <div className="mb-10 sm:mb-14">
          <AdSlot slot="homepage_bottom" />
        </div>

        {/* Why Us */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Built for Telugu States</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              ["Official Fees", "All fee data comes from government orders, not estimates."],
              ["Real Cutoffs", "EAPCET closing ranks from official TSCHE & APSCHE counselling data."],
              ["900+ Colleges", "The most comprehensive directory of AP & Telangana professional colleges."],
            ].map(([t, d]) => (
              <div key={t} className="text-center">
                <div className="font-bold text-[#1a5276] mb-2">{t}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
