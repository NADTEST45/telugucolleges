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

    if (action === "reject") {
      // Reject is a pure status change — no override. The .eq("status","pending")
      // guard makes a double-review a no-op (0 rows updated → 409).
      const { data: updated, error: updateError } = await sb
        .from("edit_requests")
        .update({
          status: newStatus,
          reviewer_id: user.id,
          reviewer_notes: notes || null,
        })
        .eq("id", edit_id)
        .eq("status", "pending")
        .select();

      if (updateError) {
        return NextResponse.json({ error: "Failed to update edit" }, { status: 500 });
      }
      if (!updated || updated.length === 0) {
        return NextResponse.json({ error: "Edit already reviewed by another admin" }, { status: 409 });
      }
    } else {
      // Approve: the status flip and the override write MUST be atomic. If they
      // are not, an override-write failure can leave an edit marked "approved"
      // whose change never reaches the public site (silent data drift). Use the
      // DB function that does both in one transaction with a row lock
      // (approve_edit_request, see 003_security_hardening.sql).
      const { error: rpcError } = await sb.rpc("approve_edit_request", {
        p_edit_id: edit_id,
        p_reviewer_id: user.id,
        p_reviewer_notes: notes || null,
      });

      if (rpcError) {
        const code = (rpcError as { code?: string }).code;
        const msg = (rpcError.message || "").toLowerCase();

        // Function raised because the row is no longer pending.
        if (msg.includes("not found") || msg.includes("already reviewed")) {
          return NextResponse.json({ error: "Edit already reviewed by another admin" }, { status: 409 });
        }

        // Fallback only if the function isn't deployed (PostgREST PGRST202 /
        // Postgres 42883). Any other RPC error is a real failure — surface it.
        const functionMissing =
          code === "PGRST202" ||
          code === "42883" ||
          msg.includes("could not find the function") ||
          msg.includes("does not exist");
        if (!functionMissing) {
          return NextResponse.json({ error: "Failed to approve edit. Please retry." }, { status: 500 });
        }

        // --- Sequential fallback: write the override FIRST, then flip status. ---
        // This ordering means an edit is only ever marked "approved" after its
        // override has actually landed, so a failure can never produce the
        // "approved but public data unchanged" state.
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
          return NextResponse.json({ error: "Failed to save override. Please retry." }, { status: 500 });
        }

        const { data: updated, error: updateError } = await sb
          .from("edit_requests")
          .update({
            status: newStatus,
            reviewer_id: user.id,
            reviewer_notes: notes || null,
          })
          .eq("id", edit_id)
          .eq("status", "pending")
          .select();

        if (updateError) {
          return NextResponse.json({ error: "Override saved but failed to mark approved. Please retry." }, { status: 500 });
        }
        if (!updated || updated.length === 0) {
          return NextResponse.json({ error: "Edit already reviewed by another admin" }, { status: 409 });
        }
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
