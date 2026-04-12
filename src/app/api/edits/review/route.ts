import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { getAuthUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/** POST /api/edits/review — Approve or reject an edit (super admin only) */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can review edits" }, { status: 403 });
    }

    const { edit_id, action, notes } = await req.json();

    if (!edit_id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "edit_id and action (approve/reject) required" }, { status: 400 });
    }
    if (action === "reject" && !notes) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }
    if (notes && typeof notes === "string" && notes.length > 1000) {
      return NextResponse.json({ error: "Notes must be 1000 characters or fewer" }, { status: 400 });
    }

    const sb = getServiceClient();

    // Get the edit request
    const { data: edit, error: fetchError } = await sb
      .from("edit_requests")
      .select("*")
      .eq("id", edit_id)
      .eq("status", "pending")
      .single();

    if (fetchError || !edit) {
      return NextResponse.json({ error: "Edit request not found or already reviewed" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    // Update edit request status
    const { error: updateError } = await sb
      .from("edit_requests")
      .update({
        status: newStatus,
        reviewer_id: user.id,
        reviewer_notes: notes || null,
      })
      .eq("id", edit_id);

    if (updateError) {
      console.error("Review update error:", updateError);
      return NextResponse.json({ error: "Failed to update edit" }, { status: 500 });
    }

    // If approved, upsert into college_overrides
    if (action === "approve") {
      const { error: overrideError } = await sb
        .from("college_overrides")
        .upsert({
          college_code: edit.college_code,
          field_name: edit.field_name,
          value: edit.new_value,
          edit_request_id: edit_id,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        }, { onConflict: "college_code,field_name" });

      if (overrideError) {
        console.error("Override upsert error:", overrideError);
        return NextResponse.json(
          { error: "Edit approved but failed to save override. Please retry." },
          { status: 500 }
        );
      }
    }

    // Audit log
    await sb.from("audit_log").insert({
      action: `${action}_edit`,
      actor_id: user.id,
      actor_email: user.email,
      target_type: "edit_request",
      target_id: edit_id,
      details: {
        college_code: edit.college_code,
        field_name: edit.field_name,
        old_value: edit.old_value,
        new_value: edit.new_value,
        notes,
      },
    });

    return NextResponse.json({ status: newStatus, edit_id });
  } catch (err) {
    console.error("Review error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
