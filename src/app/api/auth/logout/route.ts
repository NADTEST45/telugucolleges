import { NextResponse } from "next/server";
import { getAuthUser, clearAuthCookies } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
