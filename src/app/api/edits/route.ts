import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server-client";
import { getAuthUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/** GET /api/edits — Get edit requests (filtered by role) */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Authorize by role with an explicit allow-list. Only super_admin (all rows)
    // and college_admin (self-scoped, below) may read edit requests. Any other
    // role — e.g. "marketing" — is denied before the query runs, so a future
    // 4th role defaults to no access rather than leaking partner PII.
    if (user.role !== "super_admin" && user.role !== "college_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sb = getServiceClient();
    const status = req.nextUrl.searchParams.get("status"); // optional filter

    // Explicit column projection — exactly the fields the admin and
    // college-admin dashboards render, plus the columns this handler relies on
    // (created_at for ordering, status for the filter, submitted_by for
    // self-scoping). Avoids select("*") leaking unused columns.
    let query = sb
      .from("edit_requests")
      .select(
        "id, college_code, college_name, submitted_by, submitted_by_email, category, field_name, old_value, new_value, change_reason, evidence_url, status, reviewer_notes, created_at"
      )
      .order("created_at", { ascending: false });

    // College admins can only see their own edits
    if (user.role === "college_admin") {
      query = query.eq("submitted_by", user.id);
    }

    // Optional status filter
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch edits" }, { status: 500 });
    }

    return NextResponse.json({ edits: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
