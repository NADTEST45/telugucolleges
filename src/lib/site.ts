/**
 * Canonical site URL helper.
 *
 * NEXT_PUBLIC_SITE_URL is set per-environment in Vercel; when unset we fall
 * back to the production apex domain (www must redirect to apex per CLAUDE.md).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
