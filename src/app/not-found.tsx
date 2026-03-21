import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#1a5276] flex items-center justify-center text-white text-3xl font-extrabold mb-6">
        TC
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 text-base sm:text-lg max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Try searching for a college instead.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/colleges"
          className="px-6 py-3 bg-[#1a5276] text-white font-semibold rounded-lg hover:bg-[#2e86c1] transition-colors"
        >
          Browse All Colleges
        </Link>
        <Link
          href="/eapcet"
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          EAPCET Rank Predictor
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
