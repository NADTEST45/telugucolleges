import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { setAuthCookies } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const sb = getServiceClient();

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await sb.auth.signInWithPassword({
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
    await setAuthCookies(authData.session.access_token, adminUser);

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
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
