import { NextResponse } from "next/server";
import { getAuthUser, clearAuthCookies } from "@/lib/supabase/auth";
import { getServiceClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Invalidate session server-side before clearing cookies
  const sb = getServiceClient();
  try {
    await sb.auth.admin.signOut(user.id);
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
