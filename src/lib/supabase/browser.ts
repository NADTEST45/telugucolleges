import { createBrowserClient } from "@supabase/ssr";

let _browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser-side Supabase client for public user auth.
 * Uses @supabase/ssr for cookie-based session management.
 * Singleton — safe to call multiple times.
 */
export function createSupabaseBrowser() {
  if (_browserClient) return _browserClient;

  _browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return _browserClient;
}
