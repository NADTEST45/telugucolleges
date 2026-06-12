"use client";

import { useState } from "react";

const FIELD_OPTIONS = [
  "B.Tech fee",
  "Cutoff ranks",
  "Placements",
  "NAAC / NBA accreditation",
  "Branches offered",
  "Other",
];

/**
 * Public "Report incorrect data" button + modal.
 * Posts anonymous accuracy reports to /api/report (rate-limited 5/hr/IP,
 * stored in Supabase `data_reports` for manual triage).
 */
export default function ReportDataButton({ collegeCode }: { collegeCode: string }) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState(FIELD_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const close = () => {
    setOpen(false);
    if (status === "sent") {
      // Reset for a possible second report
      setStatus("idle");
      setMessage("");
      setField(FIELD_OPTIONS[0]);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_code: collegeCode,
          field_label: field,
          message,
          email,
          website,
          page_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Report incorrect data
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Report incorrect data"
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6"
            onClick={e => e.stopPropagation()}
          >
            {status === "sent" ? (
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Thank you!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your report has been received. We verify every report against official sources before updating the page.
                </p>
                <button onClick={close} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900">Report incorrect data</h3>
                  <button type="button" onClick={close} aria-label="Close" className="text-gray-400 hover:text-gray-600 p-1 -m-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Spotted something wrong? Tell us and we&apos;ll check it against official sources.
                </p>

                <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="report-field">
                  What looks wrong?
                </label>
                <select
                  id="report-field"
                  value={field}
                  onChange={e => setField(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                >
                  {FIELD_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>

                <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="report-message">
                  Details <span className="text-gray-400 font-normal">(what&apos;s wrong, and the correct value if you know it)</span>
                </label>
                <textarea
                  id="report-message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={4}
                  placeholder="e.g. The CSE cutoff shown is from 2023 — the 2025 final-phase OC closing rank was 4,210 as per the official last-rank statement."
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
                />

                <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="report-email">
                  Email <span className="text-gray-400 font-normal">(optional — only if you want a reply)</span>
                </label>
                <input
                  id="report-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  maxLength={200}
                  placeholder="you@example.com"
                  className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                />

                {/* Honeypot — hidden from humans, bots tend to fill it */}
                <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                {status === "error" && (
                  <p className="text-xs text-red-600 mb-3" role="alert">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || message.trim().length < 10}
                  className="w-full py-2.5 rounded-lg bg-brand text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {status === "sending" ? "Sending…" : "Submit report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
