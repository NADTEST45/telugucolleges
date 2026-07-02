"use client";

export default function AccountError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">Account error</div>
      <p className="text-gray-600 mb-6">
        Your account page encountered an error. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-accent text-white rounded-lg font-semibold hover:bg-brand transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
