import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser, clearAuthCookies } from "@/lib/supabase/auth";
import { getServiceClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

// Must match TOKEN_COOKIE in src/lib/supabase/auth.ts
const TOKEN_COOKIE = "tc_admin_token";

export async function POST() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Invalidate session server-side before clearing cookies.
  // admin.signOut() expects the user's access token (JWT), NOT the
  // admin_users.id UUID — so we read the token cookie directly.
  const sb = getServiceClient();
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_COOKIE)?.value;
    if (accessToken) {
      await sb.auth.admin.signOut(accessToken);
    }
  } catch {
    // Continue with cookie cleanup even if server-side signout fails
  }

  // Audit log — write before cookie clear so session is still valid
  try {
    await sb.from("audit_log").insert({
      action: "logout",
      actor_id: user.id,
      actor_email: user.email,
      target_type: "admin_user",
      target_id: user.id,
      details: { role: user.role },
    });
  } catch {
    // Non-fatal — continue
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
