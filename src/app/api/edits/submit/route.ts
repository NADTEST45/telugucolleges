import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server-client";
import { getAuthUser } from "@/lib/supabase/auth";
import type { College } from "@/lib/colleges";
import { EDITABLE_FIELDS, type EditCategory } from "@/lib/supabase/types";
import { validateEditValue, validateEvidenceUrl } from "@/lib/edit-validation";
import { getCollegesMerged } from "@/lib/colleges-merged";

export const dynamic = "force-dynamic";

const MAX_REASON_LENGTH = 1000;
const MIN_REASON_LENGTH = 10;

/** Type-safe accessor for college fields */
function getCollegeFieldValue(college: College, fieldName: string): string {
  if (fieldName.startsWith("placements.")) {
    const key = fieldName.split(".")[1] as keyof typeof college.placements;
    return String(college.placements[key] ?? "");
  }
  // Only access known top-level fields
  const knownFields: Record<string, unknown> = {
    fee: college.fee,
    goFee: college.goFee,
    naac: college.naac,
    nba: college.nba,
    year: college.year,
    affiliation: college.affiliation,
  };
  return String(knownFields[fieldName] ?? "");
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { category, field_name, new_value, change_reason, evidence_url } = body;

    // Role allowlist: only college_admin and super_admin may submit edits.
    // For college_admins, derive college_code from session — body value is ignored (defense in depth).
    // Super_admins may specify college_code in the body (e.g. submitting on behalf of a college).
    // Any other authenticated role (e.g. marketing) is rejected so it cannot
    // POST an arbitrary college_code via the body-trusting path.
    let college_code: string | undefined;
    if (user.role === "college_admin") {
      if (!user.college_code) {
        return NextResponse.json({ error: "Your account is not linked to a college" }, { status: 403 });
      }
      college_code = user.college_code;
    } else if (user.role === "super_admin") {
      college_code = body.college_code;
    } else {
      return NextResponse.json({ error: "Your role is not permitted to submit edit requests" }, { status: 403 });
    }

    // --- Input validation (S4) ---
    if (!college_code || !category || !field_name || new_value === undefined || !change_reason || !evidence_url) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate category
    if (!["fees", "placements", "basic_info"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // A field is valid only inside the submitted category. This prevents a
    // forged category/field combination from bypassing type validation.
    const fieldDef = EDITABLE_FIELDS[category as EditCategory]?.find(f => f.field === field_name);
    if (!fieldDef) {
      return NextResponse.json({ error: `Invalid field: ${field_name}` }, { status: 400 });
    }

    const valueStr = String(new_value);
    // Validate change_reason length
    if (typeof change_reason !== "string" || change_reason.length < MIN_REASON_LENGTH || change_reason.length > MAX_REASON_LENGTH) {
      return NextResponse.json({ error: `Reason must be ${MIN_REASON_LENGTH}-${MAX_REASON_LENGTH} characters` }, { status: 400 });
    }

    const valueError = validateEditValue(category as EditCategory, field_name, new_value);
    if (valueError) return NextResponse.json({ error: valueError }, { status: 400 });
    const evidenceError = validateEvidenceUrl(evidence_url);
    if (evidenceError) return NextResponse.json({ error: evidenceError }, { status: 400 });

    // Validate college admin can only edit their own college
    if (user.role === "college_admin" && user.college_code !== college_code) {
      return NextResponse.json({ error: "You can only edit your own college" }, { status: 403 });
    }

    // Find the college — validates college_code exists (S6)
    const college = (await getCollegesMerged()).find(c => c.code === college_code);
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Get old value using type-safe accessor (Q1)
    const old_value = getCollegeFieldValue(college, field_name);

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
        new_value: valueStr,
        change_reason,
        evidence_url,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to submit edit" }, { status: 500 });
    }

    // Audit log
    await sb.from("audit_log").insert({
      action: "submit_edit",
      actor_id: user.id,
      actor_email: user.email,
      target_type: "edit_request",
      target_id: data.id,
      details: { college_code, field_name, old_value, new_value: valueStr, evidence_url },
    });

    return NextResponse.json({ edit: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
