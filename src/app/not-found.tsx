import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-extrabold text-gray-200 mb-4">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Page not found</h2>
      <p className="text-sm text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="inline-block bg-[#2e86c1] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#2471a3] transition-colors">
        Back to Home
      </Link>
    </main>
  );
}
