"use client";

import { useState } from "react";

/**
 * WhatsApp reminder opt-in for the TS EAPCET counselling-dates page.
 *
 * Mirrors LeadCapture but is context-free (no rank/branch) and tags itself with
 * `source: "counselling-dates"` so these opt-ins are stored separately from the
 * predictor leads (the leads table upserts on phone+source). Posts to the same
 * /api/leads endpoint. Every submission is a qualified counselling-season lead.
 */
export default function CounsellingReminderSignup() {
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
          exam_state: "Telangana",
          source: "counselling-dates",
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
      <div className="mt-3 bg-green-50 rounded-lg px-4 py-3 text-sm text-green-700 font-medium">
        ✓ You&apos;re on the list — we&apos;ll WhatsApp you when web options open,
        when allotment results drop, and before each deadline.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 rounded-lg border border-green-200 bg-green-50/60 px-4 py-3"
    >
      <div className="text-sm font-semibold text-gray-800 mb-0.5">
        Get deadline alerts on WhatsApp
      </div>
      <p className="text-[11px] text-gray-500 mb-2.5">
        We&apos;ll ping you before each TG EAPCET 2026 counselling deadline and
        when seat-allotment results are out — free, counselling season only.
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
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors active:scale-95 disabled:opacity-60 whitespace-nowrap"
        >
          {status === "sending" ? "Saving…" : "Notify me"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-[11px] text-red-600 mt-1.5">{errorMsg}</p>
      )}
    </form>
  );
}
