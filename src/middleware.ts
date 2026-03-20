import { NextRequest, NextResponse } from "next/server";

/* ── Simple in-memory rate limiter for login endpoint (S8) ── */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Periodic cleanup to prevent memory leak (every 1000 checks)
let cleanupCounter = 0;
function maybeCleanup() {
  if (++cleanupCounter % 1000 === 0) {
    const now = Date.now();
    for (const [ip, entry] of loginAttempts) {
      if (now > entry.resetAt) loginAttempts.delete(ip);
    }
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ── CSRF Protection on API POST/PUT/DELETE/PATCH (S1) ── */
  if (pathname.startsWith("/api/") && ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // If Origin header is present, validate it matches the host
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: "Cross-origin request blocked" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid origin header" },
          { status: 403 }
        );
      }
    }
  }

  /* ── Rate limiting on login endpoint (S8) ── */
  if (pathname === "/api/auth/login" && request.method === "POST") {
    maybeCleanup();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
