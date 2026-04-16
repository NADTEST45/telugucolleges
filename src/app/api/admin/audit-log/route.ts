import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { getAuthUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/audit-log — View audit logs (super admin only) */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sb = getServiceClient();
    const parsedLimit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
    const parsedOffset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
    const limit = isNaN(parsedLimit) ? 50 : Math.min(Math.max(1, parsedLimit), 200);
    const offset = isNaN(parsedOffset) ? 0 : Math.max(0, parsedOffset);
    const action = req.nextUrl.searchParams.get("action"); // optional filter

    // Whitelist valid audit actions
    const ALLOWED_ACTIONS = [
      "create_college_admin", "create_marketing",
      "approve_edit", "reject_edit",
      "submit_edit", "login", "logout",
    ];

    if (action && !ALLOWED_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid action filter" }, { status: 400 });
    }

    let query = sb
      .from("audit_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) {
      query = query.eq("action", action);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }

    return NextResponse.json({ logs: data, total: count, limit, offset });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
