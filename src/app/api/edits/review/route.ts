import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server-client";
import { getAuthUser } from "@/lib/supabase/auth";
import { revalidateTag } from "next/cache";

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

    if (typeof edit_id !== "string" || !/^[0-9a-f-]{36}$/i.test(edit_id) || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "edit_id and action (approve/reject) required" }, { status: 400 });
    }
    if (action === "reject" && !notes) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }
    if (notes !== undefined && notes !== null && typeof notes !== "string") {
      return NextResponse.json({ error: "Notes must be text" }, { status: 400 });
    }
    if (typeof notes === "string" && notes.length > 1000) {
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

        // Never fall back to sequential writes: an approve/reject race could
        // leave a rejected edit applied. Missing RPC is a deployment health
        // failure and must fail closed until migrations are installed.
        const functionMissing = code === "PGRST202" || code === "42883" ||
          msg.includes("could not find the function") || msg.includes("does not exist");
        return NextResponse.json(
          { error: functionMissing ? "Approval service is not configured. Deploy database migrations." : "Failed to approve edit. Please retry." },
          { status: 503 },
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
        evidence_url: edit.evidence_url,
      },
    });

    if (action === "approve") revalidateTag("college-overrides", "max");

    return NextResponse.json({ status: newStatus, edit_id });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
