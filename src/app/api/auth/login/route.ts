import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, createPasswordAuthClient } from "@/lib/supabase/server-client";
import { setAuthCookies } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const sb = getServiceClient();

    // Authenticate with Supabase Auth on a DEDICATED, non-persistent client.
    // signInWithPassword() mutates the client's auth session; running it on the
    // cached service singleton would bleed sessions across concurrent logins.
    const authClient = createPasswordAuthClient();
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Get admin user record
    const { data: adminUser, error: userError } = await sb
      .from("admin_users")
      .select("*")
      .eq("auth_id", authData.user.id)
      .eq("is_active", true)
      .single();

    if (userError || !adminUser) {
      return NextResponse.json({ error: "Account not found or deactivated" }, { status: 403 });
    }

    // Update last login
    await sb
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", adminUser.id);

    // Set cookies
    await setAuthCookies(authData.session.access_token, authData.session.refresh_token, adminUser);

    // Audit log
    await sb.from("audit_log").insert({
      action: "login",
      actor_id: adminUser.id,
      actor_email: adminUser.email,
      target_type: "admin_user",
      target_id: adminUser.id,
      details: { role: adminUser.role, college_code: adminUser.college_code },
    });

    return NextResponse.json({
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        college_code: adminUser.college_code,
        college_name: adminUser.college_name,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
