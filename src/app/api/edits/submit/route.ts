import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { getAuthUser } from "@/lib/supabase/auth";
import { COLLEGES } from "@/lib/colleges";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { college_code, category, field_name, new_value, change_reason } = await req.json();

    // Validate college admin can only edit their own college
    if (user.role === "college_admin" && user.college_code !== college_code) {
      return NextResponse.json({ error: "You can only edit your own college" }, { status: 403 });
    }

    // Find the college to get old value
    const college = COLLEGES.find(c => c.code === college_code);
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Get old value from college data
    let old_value: string;
    if (field_name.startsWith("placements.")) {
      const key = field_name.split(".")[1] as keyof typeof college.placements;
      old_value = String(college.placements[key] ?? "");
    } else {
      old_value = String((college as unknown as Record<string, unknown>)[field_name] ?? "");
    }

    if (!category || !field_name || new_value === undefined || !change_reason) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sb = getServiceClient();

    const { data, error } = await sb
      .from("edit_requests")
      .insert({
        college_code,
        college_name: college.name,
        submitted_by: user.id,
        submitted_by_email: user.email,
        category,
        field_name,
        old_value,
        new_value: String(new_value),
        change_reason,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Submit error:", error);
      return NextResponse.json({ error: "Failed to submit edit" }, { status: 500 });
    }

    // Audit log
    await sb.from("audit_log").insert({
      action: "submit_edit",
      actor_id: user.id,
      actor_email: user.email,
      target_type: "edit_request",
      target_id: data.id,
      details: { college_code, field_name, old_value, new_value: String(new_value) },
    });

    return NextResponse.json({ edit: data });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
