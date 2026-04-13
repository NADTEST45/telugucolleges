import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Max shortlists per user — prevents DB bloat from abuse */
const MAX_SHORTLISTS = 50;

/** Validate slug format: lowercase alphanumeric + hyphens, must start/end with alphanumeric */
function isValidSlug(s: unknown): s is string {
  if (typeof s !== "string" || s.length === 0 || s.length > 255) return false;
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(s);
}

/** Validate program name: alphanumeric, spaces, dots, hyphens, slashes, parens — no control chars */
function isValidProgram(s: unknown): s is string {
  if (typeof s !== "string" || s.length === 0 || s.length > 100) return false;
  return /^[a-zA-Z0-9\s.\-/()&]+$/.test(s);
}

/** GET /api/shortlist — Get all shortlisted colleges for the current user */
export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_shortlists")
      .select("id, college_slug, program, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(MAX_SHORTLISTS);

    if (error) {
      console.error("Shortlist fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch shortlist" }, { status: 500 });
    }

    return NextResponse.json({ shortlists: data });
  } catch (err) {
    console.error("Shortlist GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/shortlist — Add a college (optionally with program) to shortlist */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { college_slug, program } = body;

    if (!isValidSlug(college_slug)) {
      return NextResponse.json({ error: "Invalid college_slug" }, { status: 400 });
    }

    if (program !== undefined && program !== null && !isValidProgram(program)) {
      return NextResponse.json({ error: "Invalid program" }, { status: 400 });
    }

    // Enforce per-user limit
    const { count } = await supabase
      .from("user_shortlists")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count !== null && count >= MAX_SHORTLISTS) {
      return NextResponse.json(
        { error: `You can shortlist up to ${MAX_SHORTLISTS} colleges` },
        { status: 422 }
      );
    }

    const { data, error } = await supabase
      .from("user_shortlists")
      .insert({
        user_id: user.id,
        college_slug,
        program: program || null,
      })
      .select("id, college_slug, program, created_at")
      .single();

    if (error) {
      // Duplicate — return 201 consistently (don't leak via status codes whether it was new or existing)
      if (error.code === "23505") {
        return NextResponse.json({ shortlist: { college_slug, program: program || null } }, { status: 201 });
      }
      console.error("Shortlist insert error:", error);
      return NextResponse.json({ error: "Failed to add to shortlist" }, { status: 500 });
    }

    return NextResponse.json({ shortlist: data }, { status: 201 });
  } catch (err) {
    console.error("Shortlist POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** DELETE /api/shortlist — Remove a shortlist entry */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { college_slug, program } = body;

    if (!isValidSlug(college_slug)) {
      return NextResponse.json({ error: "Invalid college_slug" }, { status: 400 });
    }

    if (program !== undefined && program !== null && !isValidProgram(program)) {
      return NextResponse.json({ error: "Invalid program" }, { status: 400 });
    }

    let query = supabase
      .from("user_shortlists")
      .delete()
      .eq("user_id", user.id)
      .eq("college_slug", college_slug);

    if (program) {
      query = query.eq("program", program);
    } else {
      query = query.is("program", null);
    }

    const { error } = await query;

    if (error) {
      console.error("Shortlist delete error:", error);
      return NextResponse.json({ error: "Failed to remove from shortlist" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shortlist DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
