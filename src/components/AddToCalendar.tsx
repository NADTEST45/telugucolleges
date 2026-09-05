"use client";

import { useCallback } from "react";
import { isDeadlinePast } from "@/lib/content-freshness";
import { useCurrentTime } from "@/lib/useCurrentTime";
import {
  buildIcs,
  type CounsellingMilestone,
  type IcsCalendarConfig,
} from "@/lib/counselling-schedule";

/**
 * Client-side "Add to Calendar" for EAPCET counselling deadlines (TS and AP).
 *
 * Generates a .ics file entirely in the browser (Blob + object URL) and
 * triggers a download — no backend, no third-party script, so it stays within
 * the site CSP (`script-src 'self' 'unsafe-inline'`, no external connect).
 * The .ics imports cleanly into Google Calendar, Apple Calendar and Outlook.
 *
 * `config`/`filePrefix` default to TS/TGCHE so the TS dates page needs no
 * changes; the AP schedule passes AP_ICS_CONFIG and a "ap-eapcet" prefix.
 */

function downloadIcs(filename: string, ics: string) {
  // Safari needs an in-DOM anchor; revoke the URL on the next tick so the
  // download has time to start.
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function slugForFile(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
  </svg>
);

/** Small per-row button: adds a single milestone deadline. */
export function AddMilestoneButton({
  milestone,
  phaseTag,
  initialNow,
  config,
  filePrefix = "ts-eapcet",
}: {
  milestone: CounsellingMilestone;
  phaseTag: string;
  initialNow: number;
  config?: IcsCalendarConfig;
  filePrefix?: string;
}) {
  const now = useCurrentTime(initialNow);
  const handleClick = useCallback(() => {
    if (isDeadlinePast(milestone.deadline)) return;
    const ics = buildIcs([{ milestone, phaseTag }], { config });
    downloadIcs(`${filePrefix}-${slugForFile(milestone.calendarTitle)}.ics`, ics);
  }, [milestone, phaseTag, config, filePrefix]);

  if (isDeadlinePast(milestone.deadline, now)) return <span className="text-xs text-gray-500">Elapsed</span>;

  const label = `Add "${milestone.calendarTitle}" (${milestone.dates}) to your calendar`;

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Add this deadline to your calendar"
      aria-label={label}
      className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] -my-1 rounded-lg text-gray-400 hover:text-accent hover:bg-blue-50 active:scale-90 transition-all"
    >
      <CalendarIcon className="w-4 h-4" />
    </button>
  );
}

/** Prominent button: adds every milestone in a phase as one .ics. */
export function AddPhaseButton({
  milestones,
  phaseTag,
  phaseLabel,
  initialNow,
  config,
  filePrefix = "ts-eapcet",
}: {
  milestones: CounsellingMilestone[];
  phaseTag: string;
  phaseLabel: string;
  initialNow: number;
  config?: IcsCalendarConfig;
  filePrefix?: string;
}) {
  const now = useCurrentTime(initialNow);
  const handleClick = useCallback(() => {
    const upcoming = milestones.filter(m => !isDeadlinePast(m.deadline));
    if (upcoming.length === 0) return;
    const ics = buildIcs(
      upcoming.map(milestone => ({ milestone, phaseTag })),
      { config }
    );
    downloadIcs(`${filePrefix}-2026-${slugForFile(phaseLabel)}.ics`, ics);
  }, [milestones, phaseTag, phaseLabel, config, filePrefix]);

  if (milestones.every(m => isDeadlinePast(m.deadline, now))) return <span className="text-xs text-gray-500">Published dates have passed</span>;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all whitespace-nowrap"
    >
      <CalendarIcon className="w-3.5 h-3.5" />
      Add upcoming deadlines
    </button>
  );
}
