/**
 * TS EAPCET 2026 counselling schedule — single source of truth.
 *
 * Powers both the phase tables on /eapcet/ts-counselling-dates-2026 and the
 * client-side "Add to Calendar" (.ics) feature. Keep this in sync with the
 * TGCHE notification; the page renders `dates` verbatim, the calendar uses the
 * machine-readable `deadline` (and optional `start`) fields.
 *
 * Calendar modelling decision: each milestone becomes an ALL-DAY event on its
 * `deadline` (the day the window closes / the result drops) with a reminder the
 * day before — students care about "don't miss the deadline", not a week-long
 * busy block. The full human window is preserved in the event description.
 */

export interface CounsellingMilestone {
  /** Stable id — used for .ics UID and React keys. Never reuse across phases. */
  id: string;
  /** Display label for the "Event" column. */
  event: string;
  /** Human-readable window, rendered verbatim in the table. */
  dates: string;
  /**
   * Machine-readable deadline as a local IST calendar date `YYYY-MM-DD`.
   * For a window this is the closing day; for a single-day item it equals it;
   * for "on or before X" results it's X. This is the all-day event date.
   */
  deadline: string;
  /** Optional window start `YYYY-MM-DD`, shown in the .ics description. */
  start?: string;
  /**
   * Short calendar-event title. Phrased as the actionable deadline, e.g.
   * "Web options entry closes". Prefixed with the phase tag at build time.
   */
  calendarTitle: string;
}

export interface CounsellingPhase {
  id: string;
  /** Table heading, e.g. "Phase 1 — June 19 to July 14, 2026". */
  title: string;
  /** Short tag used in calendar titles, e.g. "TS EAPCET P1". */
  tag: string;
  milestones: CounsellingMilestone[];
}

export const COUNSELLING_PORTAL = "https://tgeapcet.nic.in";

export const COUNSELLING_PHASES: CounsellingPhase[] = [
  {
    id: "phase-1",
    title: "Phase 1 — June 19 to July 14, 2026",
    tag: "TS EAPCET P1",
    milestones: [
      {
        id: "p1-registration",
        event: "Registration, fee payment & slot booking",
        dates: "June 19 – 28, 2026",
        start: "2026-06-19",
        deadline: "2026-06-28",
        calendarTitle: "Registration & fee payment closes",
      },
      {
        id: "p1-verification",
        event: "Certificate verification",
        dates: "June 22 – 29, 2026",
        start: "2026-06-22",
        deadline: "2026-06-29",
        calendarTitle: "Certificate verification ends",
      },
      {
        id: "p1-web-options",
        event: "Web options entry",
        dates: "June 25 – July 1, 2026",
        start: "2026-06-25",
        deadline: "2026-07-01",
        calendarTitle: "Web options entry closes",
      },
      {
        id: "p1-freeze",
        event: "Freezing of web options",
        dates: "July 1, 2026",
        deadline: "2026-07-01",
        calendarTitle: "Web options freeze",
      },
      {
        id: "p1-mock",
        event: "Mock seat allotment",
        dates: "On or before July 4, 2026",
        deadline: "2026-07-04",
        calendarTitle: "Mock seat allotment released",
      },
      {
        id: "p1-reshuffle",
        event: "Change of options after mock allotment",
        dates: "July 5 – 7, 2026",
        start: "2026-07-05",
        deadline: "2026-07-07",
        calendarTitle: "Last day to change options",
      },
      {
        id: "p1-final-freeze",
        event: "Final freezing of options",
        dates: "July 7, 2026",
        deadline: "2026-07-07",
        calendarTitle: "Final freezing of options",
      },
      {
        id: "p1-allotment",
        event: "Seat allotment result",
        dates: "On or before July 10, 2026",
        deadline: "2026-07-10",
        calendarTitle: "Seat allotment result",
      },
      {
        id: "p1-self-report",
        event: "Fee payment & self-reporting",
        dates: "July 10 – 14, 2026",
        start: "2026-07-10",
        deadline: "2026-07-14",
        calendarTitle: "Fee payment & self-reporting closes",
      },
    ],
  },
  {
    id: "phase-2",
    title: "Phase 2 — July 17 to 28, 2026",
    tag: "TS EAPCET P2",
    milestones: [
      {
        id: "p2-registration",
        event: "Registration, fee payment & slot booking (new candidates)",
        dates: "July 17, 2026",
        deadline: "2026-07-17",
        calendarTitle: "Phase 2 registration (new candidates)",
      },
      {
        id: "p2-verification",
        event: "Certificate verification",
        dates: "July 18, 2026",
        deadline: "2026-07-18",
        calendarTitle: "Certificate verification",
      },
      {
        id: "p2-web-options",
        event: "Web options entry",
        dates: "July 18 – 19, 2026",
        start: "2026-07-18",
        deadline: "2026-07-19",
        calendarTitle: "Web options entry closes",
      },
      {
        id: "p2-freeze",
        event: "Freezing of web options",
        dates: "July 19, 2026",
        deadline: "2026-07-19",
        calendarTitle: "Web options freeze",
      },
      {
        id: "p2-allotment",
        event: "Seat allotment result",
        dates: "On or before July 22, 2026",
        deadline: "2026-07-22",
        calendarTitle: "Seat allotment result",
      },
      {
        id: "p2-self-report",
        event: "Fee payment & self-reporting",
        dates: "July 22 – 24, 2026",
        start: "2026-07-22",
        deadline: "2026-07-24",
        calendarTitle: "Fee payment & self-reporting closes",
      },
      {
        id: "p2-physical-report",
        event: "Physical reporting at allotted colleges",
        dates: "July 25 – 28, 2026",
        start: "2026-07-25",
        deadline: "2026-07-28",
        calendarTitle: "Physical reporting closes",
      },
      {
        id: "p2-cancel",
        event: "Last date to cancel allotted seat",
        dates: "July 28, 2026",
        deadline: "2026-07-28",
        calendarTitle: "Last date to cancel allotted seat",
      },
    ],
  },
  {
    id: "final-phase",
    title: "Final Phase — July 31 to August 7, 2026",
    tag: "TS EAPCET Final",
    milestones: [
      {
        id: "final-registration",
        event: "Registration, fee payment & slot booking",
        dates: "July 31, 2026",
        deadline: "2026-07-31",
        calendarTitle: "Final phase registration",
      },
      {
        id: "final-verification",
        event: "Certificate verification",
        dates: "August 1, 2026",
        deadline: "2026-08-01",
        calendarTitle: "Certificate verification",
      },
      {
        id: "final-web-options",
        event: "Web options entry",
        dates: "August 1 – 2, 2026",
        start: "2026-08-01",
        deadline: "2026-08-02",
        calendarTitle: "Web options entry closes",
      },
      {
        id: "final-freeze",
        event: "Freezing of web options",
        dates: "August 2, 2026",
        deadline: "2026-08-02",
        calendarTitle: "Web options freeze",
      },
      {
        id: "final-allotment",
        event: "Seat allotment result",
        dates: "On or before August 5, 2026",
        deadline: "2026-08-05",
        calendarTitle: "Seat allotment result",
      },
      {
        id: "final-report",
        event: "Fee payment, self-reporting & physical reporting",
        dates: "August 5 – 7, 2026",
        start: "2026-08-05",
        deadline: "2026-08-07",
        calendarTitle: "Fee payment & reporting closes",
      },
    ],
  },
  {
    id: "internal-sliding",
    title: "Internal sliding — August 12 to 17, 2026",
    tag: "TS EAPCET Sliding",
    milestones: [
      { id: "sliding-options", event: "Options for another branch within the same college", dates: "August 12 – 13, 2026", start: "2026-08-12", deadline: "2026-08-13", calendarTitle: "Internal sliding options close" },
      { id: "sliding-freeze", event: "Freezing of internal-sliding options", dates: "August 13, 2026", deadline: "2026-08-13", calendarTitle: "Internal sliding options freeze" },
      { id: "sliding-allotment", event: "Internal-sliding allotment", dates: "On or before August 15, 2026", deadline: "2026-08-15", calendarTitle: "Internal sliding allotment" },
      { id: "sliding-report", event: "Download new order, self-report and report in the new branch", dates: "August 16 – 17, 2026", start: "2026-08-16", deadline: "2026-08-17", calendarTitle: "Internal sliding reporting closes" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* iCalendar (.ics) generation — pure, dependency-free, CSP-safe.      */
/* RFC 5545. All-day VEVENTs (VALUE=DATE) with a 1-day-before VALARM.  */
/* ------------------------------------------------------------------ */

/** `YYYY-MM-DD` → `YYYYMMDD` (the RFC 5545 DATE form for all-day events). */
function toIcsDate(isoDate: string): string {
  return isoDate.replace(/-/g, "");
}

/** All-day DTEND is exclusive, so add one calendar day to the deadline. */
function nextDay(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/**
 * Escape a value for an iCalendar TEXT field per RFC 5545 §3.3.11:
 * backslash, semicolon, comma, and newlines must be escaped.
 */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** UTF-8 byte length of a string, without relying on Node's Buffer. */
function byteLen(s: string): number {
  // TextEncoder is available in browsers and modern Node.
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(s).length;
  }
  return unescape(encodeURIComponent(s)).length;
}

/**
 * Fold lines to ≤75 octets per RFC 5545 §3.1, counting UTF-8 bytes (the
 * content contains en-dashes, which are 3 bytes each). Continuation lines
 * start with a single space. We accumulate whole characters so a multi-byte
 * character is never split across the fold boundary.
 */
function foldLine(line: string): string {
  if (byteLen(line) <= 75) return line;
  const out: string[] = [];
  const chars = Array.from(line); // split by code point, not UTF-16 unit
  let cur = "";
  let curBytes = 0;
  let isContinuation = false;
  // First line budget is 75 bytes; continuation lines reserve 1 byte for the
  // leading space, so their content budget is 74 bytes.
  for (const ch of chars) {
    const chBytes = byteLen(ch);
    const budget = isContinuation ? 74 : 75;
    if (curBytes + chBytes > budget) {
      out.push((isContinuation ? " " : "") + cur);
      isContinuation = true;
      cur = ch;
      curBytes = chBytes;
    } else {
      cur += ch;
      curBytes += chBytes;
    }
  }
  if (cur.length) out.push((isContinuation ? " " : "") + cur);
  return out.join("\r\n");
}

export interface IcsBuildOptions {
  /** DTSTAMP / fixed timestamp so output is deterministic. Defaults to now. */
  now?: Date;
}

function dtStamp(now: Date): string {
  // UTC basic format YYYYMMDDTHHMMSSZ
  return now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Build a single VEVENT block (array of unfolded lines). */
function buildVevent(
  m: CounsellingMilestone,
  phaseTag: string,
  stamp: string
): string[] {
  const title = `${phaseTag}: ${m.calendarTitle}`;
  const windowLine = m.start
    ? `Window: ${m.dates}. `
    : `Date: ${m.dates}. `;
  const description =
    `${windowLine}Deadline day for the TGCHE TS EAPCET 2026 counselling step ` +
    `"${m.event}". Always confirm the latest schedule on ${COUNSELLING_PORTAL} ` +
    `before acting. Reminder via TeluguColleges.com.`;

  return [
    "BEGIN:VEVENT",
    `UID:${m.id}@telugucolleges.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${toIcsDate(m.deadline)}`,
    `DTEND;VALUE=DATE:${nextDay(m.deadline)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `URL:${COUNSELLING_PORTAL}`,
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`Tomorrow: ${title}`)}`,
    "END:VALARM",
    "END:VEVENT",
  ];
}

/**
 * Produce a complete .ics calendar string for the given milestones.
 * Pass one milestone for a per-row download, or many for "Add all".
 */
export function buildIcs(
  milestones: { milestone: CounsellingMilestone; phaseTag: string }[],
  opts: IcsBuildOptions = {}
): string {
  const stamp = dtStamp(opts.now ?? new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TeluguColleges//TS EAPCET Counselling 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:TS EAPCET 2026 Counselling",
  ];
  for (const { milestone, phaseTag } of milestones) {
    lines.push(...buildVevent(milestone, phaseTag, stamp));
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

/** Flatten all phases into the shape buildIcs expects. */
export function allMilestonesForIcs(): {
  milestone: CounsellingMilestone;
  phaseTag: string;
}[] {
  return COUNSELLING_PHASES.flatMap(p =>
    p.milestones.map(milestone => ({ milestone, phaseTag: p.tag }))
  );
}
