import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/* ── Rate limiter ──
 * Limits are primarily enforced by Upstash Redis (sliding window), which is
 * shared across Edge / Vercel serverless instances — the only way to get an
 * accurate global limit. Production MUST configure Upstash; a loud
 * console.error fires at cold start if the env vars are missing.
 *
 * When Upstash is absent (e.g. a fresh local dev checkout, or a misconfigured
 * prod), we fall back to a bounded in-process limiter (see below) rather than
 * failing open. The fallback is per-instance and best-effort, NOT a
 * replacement for Upstash, but it prevents unlimited login brute force.
 */
type LimiterName =
  | "login" | "createUser" | "editSubmit" | "editReview" | "auditLog"
  | "shortlist" | "report" | "leads"
  // Read-side limiters (GET endpoints). Generous where the route is
  // CDN-cached or crawler-facing — the limit only protects the origin.
  | "og" | "shortlistRead" | "editsRead" | "adminUsersRead" | "adminLeadsRead"
  | "authMe" | "predict" | "searchIndex";

function createUpstashLimiters(): Record<LimiterName, Ratelimit> | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      // Fires ONCE per boot (module scope, not per-request) and surfaces in
      // Vercel logs. We keep serving via the in-process fallback below rather
      // than failing closed (a misconfig must not take down public GETs or
      // lock admins out of login), but this state is a misconfiguration:
      // limits are PER-INSTANCE and reset on every cold start, so the
      // effective global limit is N× the configured value across the fleet.
      console.error(
        "[middleware] MISCONFIGURATION: UPSTASH_REDIS_REST_URL/_TOKEN missing in production — " +
        "rate limiting is falling back to a per-instance in-memory limiter. " +
        "Limits are NOT enforced fleet-wide (each serverless instance counts separately " +
        "and resets on cold start). Configure Upstash immediately."
      );
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
    report:      mk(5,  "1 h",  "rl:report"),
    leads:       mk(5,  "1 h",  "rl:leads"),
    // GET-side limits. `og` is deliberately generous: robots.txt allows
    // /api/og/ and Googlebot/social crawlers fetch it in bursts — 60/min per
    // IP never throttles a legitimate crawler but caps a CPU-exhaustion loop
    // (each image render is Satori work). `predict`/`searchIndex` sit behind
    // CDN caching, so the limit only shields the origin from cache-busting.
    og:             mk(60,  "1 m", "rl:og"),
    shortlistRead:  mk(60,  "1 m", "rl:shortlistRead"),
    editsRead:      mk(30,  "1 m", "rl:editsRead"),
    adminUsersRead: mk(30,  "1 m", "rl:adminUsersRead"),
    adminLeadsRead: mk(30,  "1 m", "rl:adminLeadsRead"),
    authMe:         mk(60,  "1 m", "rl:authMe"),
    predict:        mk(120, "1 m", "rl:predict"),
    searchIndex:    mk(60,  "1 m", "rl:searchIndex"),
  };
}

const upstashLimiters = createUpstashLimiters();

/* ── In-process fallback limiter ──
 * Used ONLY when Upstash is not configured (upstashLimiters === null). This
 * converts the previous fail-OPEN behavior (unlimited brute force when env
 * vars are missing) into a bounded, best-effort limiter. It is per-instance:
 * Vercel may run multiple instances, so the effective limit can be N× the
 * configured value and resets on cold start. This is a safety net, NOT a
 * replacement for Upstash — production should always configure Upstash.
 */
const FALLBACK_LIMITS: Record<LimiterName, { tokens: number; windowMs: number }> = {
  login:      { tokens: 5,  windowMs: 15 * 60 * 1000 },
  createUser: { tokens: 10, windowMs: 60 * 60 * 1000 },
  editSubmit: { tokens: 20, windowMs: 60 * 60 * 1000 },
  editReview: { tokens: 60, windowMs: 60 * 60 * 1000 },
  auditLog:   { tokens: 30, windowMs: 60 * 1000 },
  shortlist:  { tokens: 60, windowMs: 60 * 1000 },
  report:     { tokens: 5,  windowMs: 60 * 60 * 1000 },
  leads:      { tokens: 5,  windowMs: 60 * 60 * 1000 },
  og:             { tokens: 60,  windowMs: 60 * 1000 },
  shortlistRead:  { tokens: 60,  windowMs: 60 * 1000 },
  editsRead:      { tokens: 30,  windowMs: 60 * 1000 },
  adminUsersRead: { tokens: 30,  windowMs: 60 * 1000 },
  adminLeadsRead: { tokens: 30,  windowMs: 60 * 1000 },
  authMe:         { tokens: 60,  windowMs: 60 * 1000 },
  predict:        { tokens: 120, windowMs: 60 * 1000 },
  searchIndex:    { tokens: 60,  windowMs: 60 * 1000 },
};

// Map of "name:key" -> recent request timestamps (ms). Module-level so it
// survives across requests on the same instance.
const fallbackHits = new Map<string, number[]>();

// Abandoned keys (e.g. rotating attacker IPs) would otherwise accumulate
// until cold start — sweep entries older than the largest window every 10 min.
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
const MAX_WINDOW_MS = Math.max(...Object.values(FALLBACK_LIMITS).map((l) => l.windowMs));
let lastSweep = 0;

function sweepFallbackHits(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  const cutoff = now - MAX_WINDOW_MS;
  for (const [k, hits] of fallbackHits) {
    if (hits.length === 0 || hits[hits.length - 1] <= cutoff) fallbackHits.delete(k);
  }
}

function fallbackRateLimited(name: LimiterName, key: string): boolean {
  const { tokens, windowMs } = FALLBACK_LIMITS[name];
  const now = Date.now();
  sweepFallbackHits(now);
  const cutoff = now - windowMs;
  const mapKey = `${name}:${key}`;
  const recent = (fallbackHits.get(mapKey) || []).filter((t) => t > cutoff);
  if (recent.length >= tokens) {
    fallbackHits.set(mapKey, recent);
    return true;
  }
  recent.push(now);
  fallbackHits.set(mapKey, recent);
  return false;
}

/** Unified rate-limit check. Returns true if the request should be rejected.
 *  Uses Upstash when configured; otherwise falls back to a bounded in-process
 *  limiter (see above) so missing env vars never mean unlimited brute force. */
async function isRateLimited(name: LimiterName, key: string): Promise<boolean> {
  if (!upstashLimiters) return fallbackRateLimited(name, key);
  const { success } = await upstashLimiters[name].limit(key);
  return !success;
}

/** Client IP — Vercel trust model.
 *  On Vercel, `x-real-ip` is set by the platform to the TRUE client IP and
 *  cannot be spoofed by the caller (Vercel overwrites any inbound value), so
 *  it's the only header we trust in production. We do NOT trust
 *  `cf-connecting-ip`: this site is not behind Cloudflare, so Vercel never
 *  sets it — an attacker could send it to fully control (and rotate) the
 *  rate-limit key and bypass every limit. `x-forwarded-for` is only used as a
 *  local/dev fallback (where `x-real-ip` may be absent). */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function proxy(request: NextRequest) {
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

  /* ── Defense-in-depth gate for /admin, /college-admin, /marketing ──
   * Cookie-PRESENCE check only — we deliberately do NOT verify the token
   * here. Admin identity lives in the httpOnly `tc_admin_token` cookie and
   * is verified server-side by getAuthUser() (Supabase service client) in
   * every API route those pages call; that remains the authoritative check.
   * Verifying in middleware would add a service-client round-trip to every
   * admin request and pull heavy Supabase code into the edge bundle. This
   * gate only stops unauthenticated visitors from loading the admin page
   * shells at all. Login pages live UNDER these prefixes, so they are
   * excluded to avoid a redirect loop. */
  const adminArea = ["/admin", "/college-admin", "/marketing"].find(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (adminArea) {
    const isLoginPage = pathname === `${adminArea}/login`;
    const hasAdminCookie = Boolean(request.cookies.get("tc_admin_token")?.value);
    if (!isLoginPage && !hasAdminCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = `${adminArea}/login`;
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
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

  /* ── Rate limiting: public data-accuracy reports (5 per hour per IP) ── */
  if (pathname === "/api/report" && request.method === "POST") {
    const ip = getClientIp(request);
    if (await isRateLimited("report", ip)) {
      return NextResponse.json(
        { error: "Too many reports. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: WhatsApp lead capture (5 per hour per IP) ── */
  if (pathname === "/api/leads" && request.method === "POST") {
    const ip = getClientIp(request);
    if (await isRateLimited("leads", ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
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

  /* ── Rate limiting: OG images (60 per min per IP — generous, crawler-facing) ── */
  if (pathname.startsWith("/api/og/") && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("og", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: shortlist reads (60 per min per IP) ── */
  if (pathname === "/api/shortlist" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("shortlistRead", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: edit-request reads (30 per min per IP) ── */
  if (pathname === "/api/edits" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("editsRead", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: admin user listing (30 per min per IP) ── */
  if (pathname === "/api/admin/users" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("adminUsersRead", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: counselling-lead reads (30 per min per IP) ── */
  if (pathname === "/api/admin/leads" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("adminLeadsRead", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: auth session check (60 per min per IP — admin UIs poll this on mount) ── */
  if (pathname === "/api/auth/me" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("authMe", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: predictor API (120 per min per IP — CDN-cached, origin shield only) ── */
  if (pathname === "/api/predict" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("predict", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  /* ── Rate limiting: search index (60 per min per IP — CDN-cached, origin shield only) ── */
  if (pathname === "/api/search-index" && request.method === "GET") {
    const ip = getClientIp(request);
    if (await isRateLimited("searchIndex", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  return response;
}

/* ── Matcher scope: /admin, /college-admin, /marketing ──
 * These admin areas are now matched for a LIGHTWEIGHT defense-in-depth gate
 * (see the cookie-presence check in proxy() above). The gate only checks
 * that the httpOnly `tc_admin_token` cookie EXISTS — it does not verify it.
 * Verification stays where it always was: getAuthUser() (Supabase service
 * client) inside every API route those pages call, which returns 401/403 to
 * unauthenticated callers. The pages themselves are client components that
 * hold no server-rendered sensitive data, so the cookie-presence check adds
 * a shell-level barrier at zero network cost without importing any Supabase
 * code into the middleware path. Login pages (/admin/login,
 * /college-admin/login, /marketing/login) are excluded from the redirect to
 * avoid a loop.
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/account/:path*",
    "/login",
    "/auth/:path*",
    "/admin/:path*",
    "/college-admin/:path*",
    "/marketing/:path*",
  ],
};
