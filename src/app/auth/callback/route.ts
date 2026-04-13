import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * OAuth callback handler.
 * Supabase redirects here after Google login or email confirmation.
 * Exchanges the auth code for a session and sets cookies.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  // Validate redirect target — must be a safe relative path
  let next = "/account/shortlist";
  const rawNext = searchParams.get("next");
  if (rawNext) {
    try {
      // Decode to catch %2F%2F and other encoding tricks
      const decoded = decodeURIComponent(rawNext);
      // Must start with single slash, no protocol, no double-slash
      if (decoded.startsWith("/") && !decoded.startsWith("//") && !decoded.includes("://") && !decoded.includes("\\")) {
        next = decoded;
      }
    } catch {
      // Malformed encoding — use default
    }
  }

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
  }

  // If code exchange failed, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
