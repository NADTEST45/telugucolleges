import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  // Map IndexNow's default key-location path (<host>/<key>.txt) to our
  // working route handler. We tried serving it as a static file in
  // public/ but Vercel's standalone output + CDN behaviour caches
  // Next.js's 404 page for that path, which IndexNow treats as a
  // verification failure. The rewrite preserves the standard path
  // search engines expect while routing through code we control.
  async rewrites() {
    return [
      {
        source: "/c153314b7546b33a6566a06402fd1965.txt",
        destination: "/indexnow-key/c153314b7546b33a6566a06402fd1965",
      },
    ];
  },
  async headers() {
    // Content Security Policy.
    // 'unsafe-inline' on script-src is required because we embed JSON-LD
    // blobs via <script type="application/ld+json"> in many pages and
    // Next.js emits inline hydration scripts. Nonces would require a
    // dynamic middleware rewrite that defeats our SSG prerendering, so
    // we accept 'unsafe-inline' here — XSS surface is limited because we
    // never concatenate user input into HTML (JSON.stringify only) and
    // there are no 3rd-party scripts loaded on the public site.
    // 'unsafe-inline' on style-src is for Tailwind v4's inline runtime styles.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.googleusercontent.com https://telugucolleges.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;