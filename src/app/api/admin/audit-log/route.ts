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
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50"), 200);
    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
    const action = req.nextUrl.searchParams.get("action"); // optional filter

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
      console.error("Audit log fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }

    return NextResponse.json({ logs: data, total: count, limit, offset });
  } catch (err) {
    console.error("Audit log error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
