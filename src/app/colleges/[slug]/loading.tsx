export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
      <div className="h-8 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </main>
  );
}
