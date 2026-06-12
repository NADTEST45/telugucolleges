import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/** Browser-safe Supabase client (uses anon key) — lazy initialized */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars not set");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

let _serviceClient: SupabaseClient | null = null;

/** Server-only Supabase client with service role (bypasses RLS) — cached singleton */
export function getServiceClient(): SupabaseClient {
  if (!_serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error("Supabase env vars not set");
    _serviceClient = createClient(url, serviceKey);
  }
  return _serviceClient;
}

/** Fresh, non-cached Supabase client for a single password sign-in.
 *  signInWithPassword() mutates the client's auth session, so it must NOT run
 *  on the cached service singleton (concurrent logins would bleed sessions).
 *  Uses the anon key (correct for password auth) and disables session
 *  persistence/refresh so this client holds no state between requests. */
export function createPasswordAuthClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
