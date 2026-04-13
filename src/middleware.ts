import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/* ── Simple in-memory rate limiter ──
 * TODO: Replace with Upstash Redis (@upstash/ratelimit) for production.
 * In-memory stores reset on cold starts and are not shared across
 * serverless instances, making them ineffective on Vercel.
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

// Periodic cleanup to prevent memory leak (every 1000 checks)
let cleanupCounter = 0;
function maybeCleanup() {
  if (++cleanupCounter % 1000 === 0) {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetAt) rateLimitStore.delete(key);
    }
  }
}

/** Best-effort client IP — prefer Cloudflare/Vercel headers over spoofable x-forwarded-for */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  maybeCleanup();

  /* ── Supabase session refresh (keeps cookies alive) ── */
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  let authenticatedUser: { id: string } | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Refresh session and get user — this validates the token server-side
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        authenticatedUser = { id: user.id };
      }
    } catch (err) {
      console.warn("Middleware session refresh failed:", err);
    }
  }

  /* ── Protect /account/* routes — verify actual auth, not just cookie presence ── */
  if (pathname.startsWith("/account") && !authenticatedUser) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ── CSRF Protection on API POST/PUT/DELETE/PATCH ── */
  if (pathname.startsWith("/api/") && ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (!origin) {
      return NextResponse.json(
        { error: "Origin header required" },
        { status: 403 }
      );
    }

    if (host) {
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

  /* ── Rate limiting: admin login (5 per 15 min per IP) ── */
  if (pathname === "/api/auth/login" && request.method === "POST") {
    const ip = getClientIp(request);
    if (isRateLimited(`login:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: user creation (10 per hour per IP) ── */
  if (pathname === "/api/admin/users" && request.method === "POST") {
    const ip = getClientIp(request);
    if (isRateLimited(`create_user:${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many user creation attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: edit submissions (20 per hour per IP) ── */
  if (pathname === "/api/edits/submit" && request.method === "POST") {
    const ip = getClientIp(request);
    if (isRateLimited(`edit_submit:${ip}`, 20, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many edit submissions. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: audit-log reads (30 per min per IP) ── */
  if (pathname === "/api/admin/audit-log" && request.method === "GET") {
    const ip = getClientIp(request);
    if (isRateLimited(`audit:${ip}`, 30, 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: shortlist API (60 writes per min per user/IP) ── */
  if (pathname === "/api/shortlist" && ["POST", "DELETE"].includes(request.method)) {
    const key = authenticatedUser ? `shortlist:${authenticatedUser.id}` : `shortlist:${getClientIp(request)}`;
    if (isRateLimited(key, 60, 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/account/:path*", "/login", "/auth/:path*"],
};
