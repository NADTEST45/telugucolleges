import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server-client";
import { COLLEGES } from "@/lib/colleges";

export const dynamic = "force-dynamic";

/**
 * Public "report incorrect data" endpoint — no auth required.
 *
 * Unlike /api/edits/submit (authenticated college-admin workflow that feeds
 * the override pipeline), this accepts anonymous accuracy reports from
 * visitors and stores them in `data_reports` for manual triage. Nothing here
 * mutates college data directly.
 *
 * Abuse controls:
 *  - rate limited in middleware ("report": 5/hour per IP)
 *  - CSRF origin check in middleware (same as all API POSTs)
 *  - honeypot field: bots that fill `website` are silently accepted
 *  - strict length caps; college_code must exist in COLLEGES
 */

const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 10;
const MAX_FIELD_LABEL = 100;
const MAX_EMAIL = 200;
const MAX_URL = 300;

// Pragmatic shape check only — the address is optional contact info, not an identity.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { college_code, field_label, message, email, page_url, website } = body;

    // Honeypot: hidden field humans never fill. Pretend success for bots.
    if (typeof website === "string" && website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (typeof message !== "string" || message.trim().length < MIN_MESSAGE) {
      return NextResponse.json(
        { error: `Please describe the issue (at least ${MIN_MESSAGE} characters).` },
        { status: 400 }
      );
    }
    if (message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Description must be under ${MAX_MESSAGE} characters.` },
        { status: 400 }
      );
    }
    if (field_label !== undefined && (typeof field_label !== "string" || field_label.length > MAX_FIELD_LABEL)) {
      return NextResponse.json({ error: "Invalid field label." }, { status: 400 });
    }
    if (email !== undefined && email !== "") {
      if (typeof email !== "string" || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
        return NextResponse.json({ error: "Please enter a valid email or leave it empty." }, { status: 400 });
      }
    }
    if (page_url !== undefined && (typeof page_url !== "string" || page_url.length > MAX_URL)) {
      return NextResponse.json({ error: "Invalid page URL." }, { status: 400 });
    }

    const college = COLLEGES.find(c => c.code === college_code);
    if (!college) {
      return NextResponse.json({ error: "College not found." }, { status: 404 });
    }

    const sb = getServiceClient();
    const { error } = await sb.from("data_reports").insert({
      college_code: college.code,
      college_name: college.name,
      field_label: field_label?.trim() || null,
      message: message.trim(),
      reporter_email: email?.trim() || null,
      page_url: page_url?.trim() || null,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit report. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
