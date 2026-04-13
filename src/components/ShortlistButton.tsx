"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useShortlistContext } from "@/components/ShortlistProvider";

interface ShortlistButtonProps {
  collegeSlug: string;
  program?: string | null;
  /** "icon" = just the heart icon, "full" = icon + text label */
  variant?: "icon" | "full";
  className?: string;
}

export default function ShortlistButton({
  collegeSlug,
  program,
  variant = "icon",
  className = "",
}: ShortlistButtonProps) {
  const { user } = useAuth();
  const { isShortlisted, toggle } = useShortlistContext();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const shortlisted = isShortlisted(collegeSlug, program);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (busy) return; // Prevent double-tap race condition

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setBusy(true);
    try {
      await toggle(collegeSlug, program);
    } finally {
      setBusy(false);
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleClick}
        disabled={busy}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] disabled:opacity-60 ${
          shortlisted
            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        } ${className}`}
        aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
        aria-pressed={shortlisted}
      >
        <svg
          className={`w-5 h-5 transition-transform ${busy ? "scale-125" : "scale-100"}`}
          fill={shortlisted ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={shortlisted ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        {shortlisted ? "Shortlisted" : "Shortlist"}
      </button>
    );
  }

  // Icon-only variant (for cards) — min 44x44 touch target
  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all hover:bg-rose-50 active:scale-90 disabled:opacity-60 ${
        shortlisted ? "text-rose-500" : "text-gray-300 hover:text-rose-400"
      } ${className}`}
      aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
      aria-pressed={shortlisted}
    >
      <svg
        className={`w-5 h-5 transition-transform ${busy ? "scale-125" : "scale-100"}`}
        fill={shortlisted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={shortlisted ? 0 : 1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
