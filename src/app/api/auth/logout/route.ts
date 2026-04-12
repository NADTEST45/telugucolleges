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
  try {
    const sb = getServiceClient();
    await sb.auth.admin.signOut(user.id);
  } catch {
    // Continue with cookie cleanup even if server-side signout fails
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
