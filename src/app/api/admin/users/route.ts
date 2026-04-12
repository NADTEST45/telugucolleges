import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { getAuthUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/users — List all admin users (super admin only) */
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sb = getServiceClient();
    const { data, error } = await sb
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    return NextResponse.json({ users: data });
  } catch (err) {
    console.error("Get users error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/admin/users — Create a new college admin (super admin only) */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { email, password, college_code, college_name, role } = await req.json();
    const userRole = (role === "marketing") ? "marketing" : "college_admin";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Enforce minimum password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (userRole === "college_admin" && (!college_code || !college_name)) {
      return NextResponse.json({ error: "college_code and college_name required for college admins" }, { status: 400 });
    }

    const sb = getServiceClient();

    // Create auth user in Supabase
    const { data: authData, error: authError } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error("Auth create error:", authError);
      return NextResponse.json({ error: authError?.message || "Failed to create auth user" }, { status: 500 });
    }

    // Create admin_users record
    const { data: adminUser, error: userError } = await sb
      .from("admin_users")
      .insert({
        auth_id: authData.user.id,
        email,
        college_code: userRole === "marketing" ? null : college_code,
        college_name: userRole === "marketing" ? null : college_name,
        role: userRole,
      })
      .select()
      .single();

    if (userError) {
      console.error("Admin user create error:", userError);
      await sb.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: "Failed to create admin record" }, { status: 500 });
    }

    // Audit log
    await sb.from("audit_log").insert({
      action: `create_${userRole}`,
      actor_id: user.id,
      actor_email: user.email,
      target_type: "admin_user",
      target_id: adminUser.id,
      details: { email, college_code, college_name, role: userRole },
    });

    return NextResponse.json({ user: adminUser });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
