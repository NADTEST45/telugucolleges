import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { getAuthUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/** GET /api/edits — Get edit requests (filtered by role) */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sb = getServiceClient();
    const status = req.nextUrl.searchParams.get("status"); // optional filter

    let query = sb
      .from("edit_requests")
      .select("*")
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
      console.error("Get edits error:", error);
      return NextResponse.json({ error: "Failed to fetch edits" }, { status: 500 });
    }

    return NextResponse.json({ edits: data });
  } catch (err) {
    console.error("Get edits error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
