export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
      <div className="h-8 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-6" />
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </main>
  );
}
