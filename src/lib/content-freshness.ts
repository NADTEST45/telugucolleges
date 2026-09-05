import type { NewsItem } from "./news";

const DAY_MS = 86_400_000;

/** Calendar date in India, independent of the server/browser time zone. */
export function indiaDate(now: number = Date.now()): string {
  return new Date(now + 330 * 60_000).toISOString().slice(0, 10);
}

/** A deadline remains usable through its entire local calendar day. */
export function isDeadlinePast(deadline: string, now: number = Date.now()): boolean {
  return !/^\d{4}-\d{2}-\d{2}$/.test(deadline) || deadline < indiaDate(now);
}

/** Old reports remain readable, but must not be promoted as current advice. */
export function isNewsArchived(item: NewsItem, now: number = Date.now()): boolean {
  const published = Date.parse(`${item.date}T00:00:00+05:30`);
  const expires = item.expiresAt
    ? Date.parse(item.expiresAt)
    : published + 14 * DAY_MS;
  return !Number.isFinite(published) || !Number.isFinite(expires) || now >= expires;
}

export function isNewsActionable(item: NewsItem, now: number = Date.now()): boolean {
  return item.priority === "high" && item.date <= indiaDate(now) && !isNewsArchived(item, now);
}
