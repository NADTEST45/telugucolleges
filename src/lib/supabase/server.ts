import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for public user auth (App Router).
 * Uses @supabase/ssr for cookie-based session management.
 * Call this in Server Components, Route Handlers, and Server Actions.
 *
 * Wrapped in React's `cache()` so multiple call sites within the same
 * request (e.g. a Server Component + a Route Handler triggered by it,
 * or several helpers running off the same /api/shortlist invocation)
 * share one client instance instead of re-reading cookies and re-
 * instantiating Supabase on each call.
 */
export const createSupabaseServer = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (err) {
            // setAll can fail in Server Components (read-only context).
            // The middleware handles session refresh, so this is recoverable.
            // Error details omitted for security.
          }
        },
      },
    }
  );
});

/** Get the currently authenticated public user, or null */
export async function getPublicUser() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
