import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { getAuthUser } from "@/lib/supabase/auth";
import { COLLEGES, College } from "@/lib/colleges";
import { EDITABLE_FIELDS, type EditCategory } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

/** Maximum allowed length for string fields */
const MAX_VALUE_LENGTH = 500;
const MAX_REASON_LENGTH = 1000;
const MIN_REASON_LENGTH = 10;

/** All allowed field names from EDITABLE_FIELDS */
const ALLOWED_FIELDS = new Set(
  Object.values(EDITABLE_FIELDS).flatMap(fields => fields.map(f => f.field))
);

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

    const { college_code, category, field_name, new_value, change_reason } = await req.json();

    // --- Input validation (S4) ---
    if (!college_code || !category || !field_name || new_value === undefined || !change_reason) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate category
    if (!["fees", "placements", "basic_info"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Validate field_name against whitelist
    if (!ALLOWED_FIELDS.has(field_name)) {
      return NextResponse.json({ error: `Invalid field: ${field_name}` }, { status: 400 });
    }

    // Validate new_value length
    const valueStr = String(new_value);
    if (valueStr.length > MAX_VALUE_LENGTH) {
      return NextResponse.json({ error: `Value must be under ${MAX_VALUE_LENGTH} characters` }, { status: 400 });
    }

    // Validate change_reason length
    if (typeof change_reason !== "string" || change_reason.length < MIN_REASON_LENGTH || change_reason.length > MAX_REASON_LENGTH) {
      return NextResponse.json({ error: `Reason must be ${MIN_REASON_LENGTH}-${MAX_REASON_LENGTH} characters` }, { status: 400 });
    }

    // Validate numeric fields are actually numbers
    const fieldDef = EDITABLE_FIELDS[category as EditCategory]?.find(f => f.field === field_name);
    if (fieldDef?.type === "number" && isNaN(Number(new_value))) {
      return NextResponse.json({ error: `${fieldDef.label} must be a number` }, { status: 400 });
    }
    if (fieldDef?.type === "number" && Number(new_value) < 0) {
      return NextResponse.json({ error: `${fieldDef.label} cannot be negative` }, { status: 400 });
    }

    // Validate college admin can only edit their own college
    if (user.role === "college_admin" && user.college_code !== college_code) {
      return NextResponse.json({ error: "You can only edit your own college" }, { status: 403 });
    }

    // Find the college — validates college_code exists (S6)
    const college = COLLEGES.find(c => c.code === college_code);
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
      details: { college_code, field_name, old_value, new_value: valueStr },
    });

    return NextResponse.json({ edit: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
