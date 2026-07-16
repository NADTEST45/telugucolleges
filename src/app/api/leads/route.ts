import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server-client";

export const dynamic = "force-dynamic";

/**
 * Public WhatsApp lead-capture endpoint — no auth required.
 *
 * Stores counselling-alert opt-ins from the EAPCET predictor results screen
 * in `counselling_leads` (service-role only table, migration 007). Upserts on
 * (phone, source) so a student tweaking filters and re-submitting refreshes
 * their context instead of creating duplicates.
 *
 * Abuse controls:
 *  - rate limited in middleware ("leads": 5/hour per IP)
 *  - CSRF origin check in middleware (same as all API POSTs)
 *  - honeypot field: bots that fill `website` are silently accepted
 *  - phone must be a valid 10-digit Indian mobile; strict caps on the rest
 */

const MAX_NAME = 100;
const MAX_FIELD = 50;
const MAX_URL = 300;

// Capture surfaces. Upsert key is (phone, source), so each surface keeps its
// own row per phone instead of overwriting another surface's opt-in.
const ALLOWED_SOURCES = [
  "predictor",
  "counselling-dates", // TS counselling-dates page
  "ap-counselling-dates", // AP counselling-dates page (separate bucket: upsert key is phone+source)
  "ap-result-alert",
] as const;
const DEFAULT_SOURCE = "predictor";

// Indian mobile: 10 digits starting 6-9, after stripping +91/0 prefix and separators.
function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let digits = raw.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name, exam_state, rank, branch, category, page_url, website, source } = body;

    // Honeypot: hidden field humans never fill. Pretend success for bots.
    if (typeof website === "string" && website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }
    if (name !== undefined && name !== "" && (typeof name !== "string" || name.length > MAX_NAME)) {
      return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    }
    const examState =
      exam_state === "Telangana" || exam_state === "Andhra Pradesh" ? exam_state : null;
    const numRank =
      typeof rank === "number" && Number.isInteger(rank) && rank > 0 && rank <= 500000
        ? rank
        : null;
    const cleanBranch =
      typeof branch === "string" && branch.length <= MAX_FIELD ? branch : null;
    const cleanCategory =
      typeof category === "string" && category.length <= MAX_FIELD ? category : null;
    const cleanUrl =
      typeof page_url === "string" && page_url.length <= MAX_URL ? page_url : null;
    const cleanSource = ALLOWED_SOURCES.includes(source) ? source : DEFAULT_SOURCE;

    const sb = getServiceClient();
    const { error } = await sb.from("counselling_leads").upsert(
      {
        phone: normalizedPhone,
        name: typeof name === "string" && name.trim() ? name.trim() : null,
        exam_state: examState,
        rank: numRank,
        branch: cleanBranch,
        category: cleanCategory,
        source: cleanSource,
        page_url: cleanUrl,
      },
      { onConflict: "phone,source" }
    );

    if (error) {
      return NextResponse.json({ error: "Failed to save. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
