import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "TeluguColleges.com — Professional Colleges in AP & Telangana",
  description: "Research professional colleges in Andhra Pradesh & Telangana. Official fees from government orders for B.Tech, MBA, MCA, M.Tech, Medical & more. Real EAPCET cutoffs and comparison tools.",
  keywords: "engineering colleges, Telangana, Andhra Pradesh, EAPCET, fees, cutoffs, JNTUH, JNTUK, MBA, MCA, M.Tech, B.Tech, medical, BBA, BCA",
  openGraph: {
    title: "TeluguColleges.com — Professional Colleges in AP & Telangana",
    description: "Official fees from government orders, real cutoffs, and tools that actually help you pick the right college.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Nav */}
        <nav className="bg-[#1a5276] text-white sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#2e86c1] flex items-center justify-center font-extrabold text-sm">TC</div>
              <span className="font-bold text-lg hidden sm:inline">TeluguColleges<span className="text-blue-300">.com</span></span>
            </Link>
            <SearchBar />
            <div className="hidden md:flex gap-0.5 shrink-0">
              {[
                ["Universities", "/universities"],
                ["Colleges", "/colleges"],
                ["Branches", "/branches"],
                ["EAPCET", "/eapcet"],
                ["News", "/news"],
                ["Compare", "/compare"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="px-2.5 py-1.5 rounded-md text-sm hover:bg-white/15 transition-colors whitespace-nowrap">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom padding on mobile so content isn't hidden behind tab bar */}
        <div className="pb-16 md:pb-0">
          {children}
        </div>

        {/* Mobile bottom tab bar */}
        <BottomNav />

        {/* Footer */}
        <footer className="bg-[#1b2631] text-gray-400 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-white font-bold text-lg mb-3">TeluguColleges.com</div>
                <p className="text-sm leading-relaxed">Research professional colleges in AP & Telangana. Official fees, real cutoffs, and tools that actually help.</p>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Quick Links</div>
                <div className="space-y-2 text-sm">
                  <Link href="/universities" className="block hover:text-white">Universities</Link>
                  <Link href="/colleges" className="block hover:text-white">All Colleges</Link>
                  <Link href="/branches" className="block hover:text-white">All Branches</Link>
                  <Link href="/eapcet" className="block hover:text-white">EAPCET 2026</Link>
                  <Link href="/news" className="block hover:text-white">News & Alerts</Link>
                  <Link href="/compare" className="block hover:text-white">Fee Comparison</Link>
                  <Link href="/about" className="block hover:text-white">About</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">For Colleges</div>
                <div className="space-y-2 text-sm">
                  <Link href="/college-admin/login" className="block hover:text-white">College Admin Login</Link>
                  <Link href="/marketing/login" className="block hover:text-white">Marketing Login</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 text-center text-xs">
              All fee data sourced from official government orders. Cutoff ranks are approximate and vary by category.
              <br />© 2026 TeluguColleges.com — Not affiliated with any government body.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
