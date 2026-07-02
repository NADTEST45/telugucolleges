"use client";

/**
 * Last-resort error boundary — catches errors thrown by the root layout
 * itself. Per Next.js docs it must render its own <html>/<body>, and it
 * replaces the root layout entirely, so Tailwind/global CSS may not be
 * available — style inline.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#4b5563", marginBottom: 24 }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 24px",
              background: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
