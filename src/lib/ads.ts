/**
 * Ad configuration for TeluguColleges.com
 *
 * To add/change ads, edit the arrays below. No code changes needed elsewhere.
 *
 * Ad types:
 *   - "banner": Full-width image banner with link
 *   - "sponsored_card": Native-looking college/course promotion card
 *
 * Slots (where ads appear):
 *   - "homepage_hero_below": Below hero section on homepage
 *   - "homepage_mid": Between sections on homepage
 *   - "homepage_bottom": Before footer on homepage
 *   - "listing_top": Top of colleges/universities listing pages
 *   - "listing_mid": Between college cards in listing pages (after every N items)
 *   - "detail_sidebar": Right sidebar on college detail pages
 *   - "detail_below_fees": Below fees section on college detail pages
 *   - "detail_bottom": Bottom of college detail pages
 */

export interface BannerAd {
  id: string;
  type: "banner";
  slot: string[];
  imageUrl: string;        // URL to banner image
  linkUrl: string;         // Click destination
  altText: string;         // Alt text for the image
  label?: string;          // e.g., "Sponsored" or "Ad"
  isActive: boolean;
  /** Optional: only show on these college detail pages (by slug) */
  targetSlugs?: string[];
  /** Optional: only show for these states */
  targetStates?: ("AP" | "TS")[];
}

export interface SponsoredCard {
  id: string;
  type: "sponsored_card";
  slot: string[];
  collegeName: string;
  tagline: string;         // e.g., "Admissions Open 2026–27"
  description: string;     // Short promo text
  highlights: string[];    // 3-4 key selling points
  ctaText: string;         // Button text, e.g., "Apply Now"
  ctaUrl: string;          // Button link
  logoUrl?: string;        // College logo image URL
  badgeText?: string;      // e.g., "NAAC A++", "NIRF #35"
  label?: string;          // e.g., "Sponsored" — defaults to "Sponsored"
  isActive: boolean;
  targetSlugs?: string[];
  targetStates?: ("AP" | "TS")[];
}

export type Ad = BannerAd | SponsoredCard;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTIVE ADS — Edit these to manage your campaigns
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ADS: Ad[] = [
  // ── Example: Banner ad for a college ───────────────────────
  // {
  //   id: "kl-university-banner-1",
  //   type: "banner",
  //   slot: ["homepage_hero_below", "listing_top"],
  //   imageUrl: "/ads/kl-university-banner.jpg",
  //   linkUrl: "https://www.kluniversity.in/admissions",
  //   altText: "KL University — Admissions Open 2026-27",
  //   label: "Sponsored",
  //   isActive: true,
  //   targetStates: ["AP"],
  // },

  // ── Example: Sponsored card for a college ──────────────────
  // {
  //   id: "kl-university-card-1",
  //   type: "sponsored_card",
  //   slot: ["homepage_mid", "listing_mid", "detail_sidebar"],
  //   collegeName: "KL University, Vijayawada",
  //   tagline: "Admissions Open 2026–27",
  //   description: "Apply now for B.Tech, M.Tech, MBA & more. NAAC A++ accredited deemed university with 95% placement record.",
  //   highlights: ["NIRF Rank #35", "95% Placement Rate", "₹7.6L Avg Package", "200+ Recruiters"],
  //   ctaText: "Apply Now →",
  //   ctaUrl: "https://www.kluniversity.in/admissions",
  //   badgeText: "NAAC A++",
  //   isActive: true,
  // },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper functions — used by ad components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Get all active ads for a specific slot */
export function getAdsForSlot(slot: string, options?: { state?: string; slug?: string }): Ad[] {
  return ADS.filter(ad => {
    if (!ad.isActive) return false;
    if (!ad.slot.includes(slot)) return false;
    if (options?.state && ad.targetStates && !ad.targetStates.includes(options.state as "AP" | "TS")) return false;
    if (options?.slug && ad.targetSlugs && !ad.targetSlugs.includes(options.slug)) return false;
    return true;
  });
}

/** Get a single random ad for a slot (useful for single-ad placements) */
export function getRandomAdForSlot(slot: string, options?: { state?: string; slug?: string }): Ad | null {
  const ads = getAdsForSlot(slot, options);
  if (ads.length === 0) return null;
  return ads[Math.floor(Math.random() * ads.length)];
}
