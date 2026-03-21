import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://telugucolleges.vercel.app"),
  title: "TeluguColleges.com — Professional Colleges in AP & Telangana",
  description: "Research professional colleges in Andhra Pradesh & Telangana. Official fees from government orders for B.Tech, MBA, MCA, M.Tech, Medical & more. Real EAPCET cutoffs and comparison tools.",
  keywords: "engineering colleges, Telangana, Andhra Pradesh, EAPCET, fees, cutoffs, JNTUH, JNTUK, MBA, MCA, M.Tech, B.Tech, medical, BBA, BCA",
  openGraph: {
    title: "TeluguColleges.com — Professional Colleges in AP & Telangana",
    description: "Official fees from government orders, real cutoffs, and tools that actually help you pick the right college.",
    type: "website",
    siteName: "TeluguColleges.com",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5" />
        <meta name="theme-color" content="#1a5276" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Nav */}
        <nav className="bg-[#1a5276] text-white sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-12 sm:h-14">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2e86c1] flex items-center justify-center font-extrabold text-xs sm:text-sm">TC</div>
              <span className="font-bold text-base sm:text-lg hidden sm:inline">TeluguColleges<span className="text-blue-300">.com</span></span>
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

        {/* Bottom padding on mobile so content isn't hidden behind tab bar + safe area */}
        <div className="pb-20 md:pb-0">
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
                <div className="text-white font-semibold mb-3">Company</div>
                <div className="space-y-2 text-sm">
                  <Link href="/contact" className="block hover:text-white">Contact Us</Link>
                  <Link href="/privacy" className="block hover:text-white">Privacy Policy</Link>
                  <Link href="/terms" className="block hover:text-white">Terms of Use</Link>
                  <Link href="/college-admin/login" className="block hover:text-white">College Admin</Link>
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
