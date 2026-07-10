import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;

/** Server-only service-role client. Never import this module into client code. */
export function getServiceClient(): SupabaseClient {
  if (!serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error("Supabase env vars not set");
    serviceClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serviceClient;
}

/** Fresh client because password sign-in mutates the auth session. */
export function createPasswordAuthClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
