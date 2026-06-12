"use client";
import { useState } from "react";

/**
 * WhatsApp counselling-alert opt-in shown under predictor results.
 * Posts to /api/leads (rate-limited, honeypot-protected). The phone number
 * is stored server-side for counselling-season broadcasts — no message is
 * sent at submit time.
 */
export default function LeadCapture({
  rank,
  examState,
  branch,
  category,
}: {
  rank: number;
  examState: "Telangana" | "Andhra Pradesh";
  branch: string;
  category: string;
}) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          exam_state: examState,
          rank,
          branch,
          category,
          page_url: window.location.href,
          website: "", // honeypot — humans leave this empty
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "done") {
    return (
      <div className="mt-4 bg-green-50 rounded-lg px-4 py-3 text-sm text-green-700 font-medium">
        ✓ You&apos;re on the list — we&apos;ll WhatsApp you cutoff &amp; counselling updates for your rank.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}
      className="mt-4 rounded-lg border border-green-200 bg-green-50/60 px-4 py-3">
      <div className="text-sm font-semibold text-gray-800 mb-0.5">
        Get counselling alerts on WhatsApp
      </div>
      <p className="text-[11px] text-gray-500 mb-2.5">
        Web-options deadlines, seat-allotment results, and cutoff updates for rank {rank.toLocaleString("en-IN")} — free, during counselling season only.
      </p>
      <div className="flex gap-2">
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="10-digit WhatsApp number"
          required
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-200 bg-white"
        />
        <button type="submit" disabled={status === "sending"}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors active:scale-95 disabled:opacity-60 whitespace-nowrap">
          {status === "sending" ? "Saving…" : "Notify me"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-[11px] text-red-600 mt-1.5">{errorMsg}</p>
      )}
    </form>
  );
}
