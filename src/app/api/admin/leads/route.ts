import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/client";
import { getAuthUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * Admin read/export for counselling_leads (super admin only).
 *
 * The table is service-role-only (RLS with no policies), so the anon client
 * can't read it. This route is the trusted read surface for the admin portal
 * and the manual WhatsApp-outreach workflow until an automated sender exists.
 *
 *  GET /api/admin/leads            → JSON  { leads: Lead[], counts: {...} }
 *  GET /api/admin/leads?format=csv → text/csv attachment
 *
 * Optional filters: ?source=predictor|counselling-dates  ?state=Telangana|Andhra Pradesh
 */

const LEAD_COLUMNS = [
  "created_at",
  "phone",
  "name",
  "exam_state",
  "rank",
  "branch",
  "category",
  "source",
  "page_url",
] as const;

type LeadRow = Record<(typeof LEAD_COLUMNS)[number], string | number | null>;

/**
 * Narrow an unknown Supabase row to the LeadRow shape at runtime. The select
 * uses a dynamic column string, so supabase-js can't infer the row type —
 * validate each expected column instead of blind-casting.
 */
function toLeadRow(raw: unknown): LeadRow {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const row = {} as LeadRow;
  for (const col of LEAD_COLUMNS) {
    const v = obj[col];
    row[col] = typeof v === "string" || typeof v === "number" ? v : null;
  }
  return row;
}

/** RFC 4180 CSV field: quote if it contains comma, quote, CR or LF; double inner quotes. */
function csvField(value: string | number | null): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows: LeadRow[]): string {
  const header = LEAD_COLUMNS.join(",");
  const lines = rows.map(r => LEAD_COLUMNS.map(c => csvField(r[c])).join(","));
  // Prepend a UTF-8 BOM so Excel opens it with correct encoding.
  return "﻿" + [header, ...lines].join("\r\n") + "\r\n";
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source");
    const state = searchParams.get("state");
    const format = searchParams.get("format");

    const sb = getServiceClient();
    let query = sb
      .from("counselling_leads")
      .select(LEAD_COLUMNS.join(","))
      .order("created_at", { ascending: false });

    if (source === "predictor" || source === "counselling-dates") {
      query = query.eq("source", source);
    }
    if (state === "Telangana" || state === "Andhra Pradesh") {
      query = query.eq("exam_state", state);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    const rows: LeadRow[] = (data ?? []).map(toLeadRow);

    if (format === "csv") {
      const today = new Date().toISOString().slice(0, 10);
      return new NextResponse(toCsv(rows), {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="counselling-leads-${today}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // JSON summary for the dashboard view.
    const counts = rows.reduce(
      (acc, r) => {
        acc.total++;
        const src = String(r.source ?? "unknown");
        acc.bySource[src] = (acc.bySource[src] ?? 0) + 1;
        return acc;
      },
      { total: 0, bySource: {} as Record<string, number> }
    );

    return NextResponse.json({ leads: rows, counts });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
