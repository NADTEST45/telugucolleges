// Client-only persistence of the user's preferred EAPCET state across the
// /eapcet section. Stored as a cookie (not just localStorage) so it can later
// be read server-side for SSR personalization without a flash of the wrong
// state. All functions no-op safely on the server (typeof document guard), so
// they're hydration-safe: callers must apply the value in an effect, never in a
// useState initializer, to avoid SSR/client mismatch.

export type EapcetState = "Telangana" | "Andhra Pradesh";

const COOKIE_NAME = "eapcet_state";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Short cookie code <-> full state name. */
export function stateToCode(state: EapcetState): "ts" | "ap" {
  return state === "Andhra Pradesh" ? "ap" : "ts";
}
export function codeToState(code: string): EapcetState | null {
  if (code === "ap") return "Andhra Pradesh";
  if (code === "ts") return "Telangana";
  return null;
}

/** Read the saved preference, or null if none/unreadable (e.g. on the server). */
export function readStatePref(): EapcetState | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)eapcet_state=(ts|ap)(?:;|$)/);
  return m ? codeToState(m[1]) : null;
}

/** Persist the preference for a year. No-op on the server. */
export function writeStatePref(state: EapcetState): void {
  if (typeof document === "undefined") return;
  document.cookie =
    `${COOKIE_NAME}=${stateToCode(state)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
