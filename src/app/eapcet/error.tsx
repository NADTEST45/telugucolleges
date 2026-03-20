"use client";

export default function EAPCETError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">Predictor error</div>
      <p className="text-gray-600 mb-6">
        The EAPCET predictor encountered an error. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-[#2e86c1] text-white rounded-lg font-semibold hover:bg-[#1a5276] transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
