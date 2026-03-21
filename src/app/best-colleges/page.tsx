import Link from "next/link";
import { getCitiesByState } from "@/lib/city-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.vercel.app";

export const metadata = {
  title: "Best Engineering Colleges by City — AP & Telangana | TeluguColleges",
  description:
    "Browse the best engineering colleges by city in Andhra Pradesh and Telangana. Compare fees, placements, EAPCET cutoffs, NAAC ratings, and NIRF rankings.",
  openGraph: {
    title: "Best Engineering Colleges by City — AP & Telangana",
    description:
      "Browse the best engineering colleges by city in Andhra Pradesh and Telangana. Compare fees, placements, EAPCET cutoffs, NAAC ratings, and NIRF rankings.",
    url: `${SITE_URL}/best-colleges`,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: `${SITE_URL}/best-colleges`,
  },
};

function BreadcrumbSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best Colleges",
        item: `${SITE_URL}/best-colleges`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function BestCollegesIndexPage() {
  const citiesByState = getCitiesByState();

  return (
    <>
      <BreadcrumbSchema />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a5276] to-[#2e86c1] text-white py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="text-sm mb-4 opacity-90">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span>Best Colleges</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Best Engineering Colleges by City
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
              Compare top engineering colleges across Andhra Pradesh and
              Telangana. Find detailed rankings based on placements, NAAC
              ratings, cutoff scores, and fees.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {citiesByState.map(({ state, cities }) => (
            <section key={state} className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                {state}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/best-colleges/${city.slug}`}
                    className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-[#2e86c1] overflow-hidden"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#1a5276] transition-colors">
                            {city.district}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            {state}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-[#1a5276] text-sm font-semibold">
                            {city.collegeCount}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {city.collegeCount} engineering colleges offering B.Tech
                        programs
                      </p>

                      <div className="inline-flex items-center gap-1 text-[#2e86c1] font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Explore colleges</span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-200 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">What we show</h4>
                <p className="text-sm text-gray-600">
                  Complete data on fees, placements, EAPCET cutoff ranks, NAAC
                  accreditation, and NIRF rankings for all engineering colleges.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">How we rank</h4>
                <p className="text-sm text-gray-600">
                  Colleges are ranked by NIRF score first, then EAPCET CSE
                  cutoff, then by average placement package to give you the best
                  overall picture.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Use this to</h4>
                <p className="text-sm text-gray-600">
                  Compare colleges by city, find the most affordable options,
                  identify best placements, and see EAPCET cutoff trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
