import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/* ── Rate limiter ──
 * All limits are enforced by Upstash Redis (sliding window). Edge / Vercel
 * serverless functions can't share state across instances, so an in-memory
 * Map fallback would silently allow abuse on the live site — instead, we
 * require Upstash. When the env vars are missing (e.g. a fresh local dev
 * checkout) rate limiting is a no-op and a single warning is logged at
 * cold start so the developer notices.
 */
type LimiterName = "login" | "createUser" | "editSubmit" | "editReview" | "auditLog" | "shortlist";

function createUpstashLimiters(): Record<LimiterName, Ratelimit> | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      // Surfaces in Vercel logs — we never want production running without limits.
      console.error("[middleware] Upstash env vars missing — rate limiting DISABLED");
    } else {
      console.warn("[middleware] Upstash not configured — rate limiting disabled in dev");
    }
    return null;
  }
  const redis = new Redis({ url, token });
  const mk = (tokens: number, window: Parameters<typeof Ratelimit.slidingWindow>[1], prefix: string) =>
    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(tokens, window), analytics: false, prefix });
  return {
    login:       mk(5,  "15 m", "rl:login"),
    createUser:  mk(10, "1 h",  "rl:createUser"),
    editSubmit:  mk(20, "1 h",  "rl:editSubmit"),
    editReview:  mk(60, "1 h",  "rl:editReview"),
    auditLog:    mk(30, "1 m",  "rl:auditLog"),
    shortlist:   mk(60, "1 m",  "rl:shortlist"),
  };
}

const upstashLimiters = createUpstashLimiters();

/** Unified rate-limit check. Returns true if the request should be rejected.
 *  When Upstash isn't configured (local dev), all requests pass through. */
async function isRateLimited(name: LimiterName, key: string): Promise<boolean> {
  if (!upstashLimiters) return false;
  const { success } = await upstashLimiters[name].limit(key);
  return !success;
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

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  /* ── Gate Supabase auth by pathname ──
   * `supabase.auth.getUser()` is a network round-trip to the Supabase Auth
   * server. The previous implementation ran it on every matched request,
   * which added that latency to dozens of public API endpoints that do
   * their own auth checks downstream (or don't need auth at all).
   *
   * We only need the middleware-level user lookup for routes whose
   * middleware-level behavior depends on it:
   *   - /account/*            : redirects unauthenticated users to /login
   *   - /auth/*               : OAuth/email callbacks rely on session
   *                             cookies being refreshed during the flow
   *   - /api/shortlist (write): bucket the rate limiter by user id when
   *                             we have one, otherwise fall back to IP
   *
   * Every other route either does its own auth via getAuthUser() inside
   * the route handler, or doesn't need auth at all. The browser-side
   * Supabase client refreshes its own session via onAuthStateChange.
   */
  const isShortlistWrite =
    pathname === "/api/shortlist" && (request.method === "POST" || request.method === "DELETE");
  const needsMiddlewareAuth =
    pathname.startsWith("/account") ||
    pathname.startsWith("/auth/") ||
    isShortlistWrite;

  let authenticatedUser: { id: string } | null = null;

  if (
    needsMiddlewareAuth &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
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
      // Session refresh failed — error details omitted for security
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
    if (await isRateLimited("login", ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: user creation (10 per hour per IP) ── */
  if (pathname === "/api/admin/users" && request.method === "POST") {
    const ip = getClientIp(request);
    if (await isRateLimited("createUser", ip)) {
      return NextResponse.json(
        { error: "Too many user creation attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: edit submissions (20 per hour per IP) ── */
  if (pathname === "/api/edits/submit" && request.method === "POST") {
    const ip = getClientIp(request);
    if (await isRateLimited("editSubmit", ip)) {
      return NextResponse.json(
        { error: "Too many edit submissions. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: edit reviews (60 per hour per IP) ── */
  if (pathname === "/api/edits/review" && request.method === "POST") {
    const ip = getClientIp(request);
    if (await isRateLimited("editReview", ip)) {
      return NextResponse.json(
        { error: "Too many review actions. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: audit-log reads (30 per min per IP) ── */
  if (pathname === "/api/admin/audit-log" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("auditLog", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: shortlist API (60 writes per min per user/IP) ── */
  if (pathname === "/api/shortlist" && ["POST", "DELETE"].includes(request.method)) {
    const key = authenticatedUser ? `user:${authenticatedUser.id}` : `ip:${getClientIp(request)}`;
    if (await isRateLimited("shortlist", key)) {
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
