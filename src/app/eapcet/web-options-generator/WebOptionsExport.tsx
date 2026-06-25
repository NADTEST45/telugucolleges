"use client";

import { useState, useCallback } from "react";
import { useShortlistContext } from "@/components/ShortlistProvider";

/**
 * Export controls for the web-options generator results.
 *
 * The page itself is a server component (keeps the cutoff tables server-side),
 * so these client-only actions take the already-computed list as plain props —
 * no predictor logic or cutoff data crosses into the client bundle.
 *
 *  • Copy: writes a clean numbered text list to the clipboard (CSP-safe).
 *  • Print / Save as PDF: window.print(); the page's print styles hide chrome.
 *  • Save to account: persists the top options to the user's shortlist
 *    (college + branch as `program`) via the existing /api/shortlist infra.
 *    Shortlist is per-college, so we store each pick individually and cap the
 *    count to avoid hammering the API.
 */

export interface ExportRow {
  slug: string;
  collegeName: string;
  branchLabel: string;
  district: string;
  state: string;
  closingRank: number;
  safety: string;
}

export interface WebOptionsExportProps {
  rows: ExportRow[];
  meta: {
    rank: number;
    category: string;
    gender: string;
    stateShort: string;
  };
}

// Don't save the entire list to an account in one burst.
const MAX_SAVE = 25;
const SAVE_CONCURRENCY = 4;

/** The list is ordered reach → moderate → safe. Naively saving the first
 *  MAX_SAVE rows would store only the most ambitious options and drop every
 *  safe fallback — the opposite of a useful shortlist. Instead keep the list's
 *  reach-first order but sample across it so safe backstops are included. */
function pickForSave(rows: ExportRow[], limit: number): ExportRow[] {
  if (rows.length <= limit) return rows;
  const step = rows.length / limit;
  const picked: ExportRow[] = [];
  for (let i = 0; i < limit; i++) picked.push(rows[Math.floor(i * step)]);
  return picked;
}

function buildPlainText(rows: ExportRow[], meta: WebOptionsExportProps["meta"]): string {
  const header =
    `TS/AP EAPCET 2026 — Web options preference list\n` +
    `Rank ${meta.rank.toLocaleString("en-IN")} · ${meta.category} · ${meta.gender} · ${meta.stateShort}\n` +
    `Generated on telugucolleges.com\n` +
    `${"-".repeat(44)}\n`;
  const lines = rows.map((r, i) => {
    const n = String(i + 1).padStart(3, " ");
    return `${n}. ${r.collegeName} — ${r.branchLabel} (${r.district}, ${r.state}) · closing ${r.closingRank.toLocaleString("en-IN")} · ${r.safety}`;
  });
  return header + lines.join("\n") + "\n";
}

export default function WebOptionsExport({ rows, meta }: WebOptionsExportProps) {
  const { toggle, isLoggedIn, ensureLoaded } = useShortlistContext();
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [savedCount, setSavedCount] = useState(0);

  const handleCopy = useCallback(async () => {
    const text = buildPlainText(rows, meta);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / insecure contexts: a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setSaveState("error");
      }
      document.body.removeChild(ta);
    }
  }, [rows, meta]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSave = useCallback(async () => {
    if (!isLoggedIn) {
      // Send them to login, then back here.
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?next=${next}`;
      return;
    }
    setSaveState("saving");
    setSavedCount(0);
    await ensureLoaded();

    const toSave = pickForSave(rows, MAX_SAVE);
    let ok = 0;
    let failed = 0;

    // Bounded-concurrency queue.
    let cursor = 0;
    async function worker() {
      while (cursor < toSave.length) {
        const idx = cursor++;
        const r = toSave[idx];
        const success = await toggle(r.slug, r.branchLabel);
        if (success) {
          ok++;
          setSavedCount(ok);
        } else {
          failed++;
        }
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(SAVE_CONCURRENCY, toSave.length) }, worker)
    );

    setSaveState(failed > 0 && ok === 0 ? "error" : "done");
  }, [isLoggedIn, ensureLoaded, rows, toggle]);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
      >
        {copied ? "Copied ✓" : "Copy list"}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
      >
        Print / Save PDF
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={saveState === "saving"}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark active:scale-95 transition-all disabled:opacity-60"
      >
        {saveState === "saving"
          ? `Saving… ${savedCount}`
          : saveState === "done"
            ? `Saved ${savedCount} to account ✓`
            : isLoggedIn
              ? "Save to my account"
              : "Sign in to save"}
      </button>

      {saveState === "done" && (
        <span className="text-xs text-gray-500">
          Top {Math.min(rows.length, MAX_SAVE)} saved to your shortlist
          {rows.length > MAX_SAVE ? ` (of ${rows.length})` : ""}.
        </span>
      )}
      {saveState === "error" && (
        <span className="text-xs text-red-600">Couldn&apos;t save. Please try again.</span>
      )}
    </div>
  );
}
