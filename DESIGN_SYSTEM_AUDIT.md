# Design System Audit — TeluguColleges

_Audited 2026-04-21 · Tailwind v4 + Next.js 16 · Production host: www.telugucolleges.com (verified live)_

## Summary

**Components reviewed:** 9 shared + ~40 page-level | **Issues found:** 7 (1 critical, 3 high, 3 medium) | **Score:** 58 / 100

The code is clean, mobile-first, and well-structured — the problem is it has **no design system**. Tailwind v4 is installed but `@theme` is never defined, so every brand color, spacing quirk, and font size is inlined as an arbitrary value in JSX. `#1a5276` and `#2e86c1` alone appear 209 times across the repo. There are also no shared primitives (`Button`, `Badge`, `Card`) — every page reassembles them from scratch, which is how the tiny `text-[10px]` / `text-[11px]` pattern proliferated to 193 sites (a real legibility and a11y problem on a public-facing data site).

## tailwind.config (i.e. `src/app/globals.css`)

Tailwind v4 uses a CSS-based config via `@theme`. `globals.css` contains utility CSS and media queries but **no `@theme` block at all** — so zero brand tokens are defined.

| Area | Finding |
|------|---------|
| Color palette | **No `@theme` tokens.** Brand blues `#1a5276` (107×) and `#2e86c1` (102×) are inlined everywhere. 16 distinct hex values in use (including 6 unnamed dark variants). |
| Spacing scale | Tailwind defaults only. Arbitrary values are modest — mostly `w-[320px]`, `h-[44px]`, `w-[500px]` for table widths (reasonable). |
| Typography | No custom font family loaded (uses system default). Preconnects to `fonts.googleapis.com` in `layout.tsx` but nothing consumes the connection — dead preconnect. No type scale tokens. |
| Breakpoints | Tailwind defaults. Mobile-first usage is strong (sm: appears 453 times vs md: only 11 times). |
| Focus ring | Hardcoded `outline: 2px solid #2e86c1` in `globals.css` — duplicates brand color outside any token. |

## Hardcoded Values Found

| Category | Count | Examples |
|----------|-------|----------|
| Hex colors in JSX | **180** | `src/app/colleges/[slug]/CollegeDetail.tsx: text-[#1a5276]` (×21 in one file) |
| Arbitrary sub-12px text | **193** | `text-[10px]`, `text-[11px]`, `text-[9px]` on 21 files — including the main nav, homepage, all table rows |
| Arbitrary width / height | ~35 | `w-[320px]`, `w-[500px]` for table columns — mostly OK but undocumented |
| Inline SVG strokes | 82 buttons | Every icon is an inline SVG path — duplicated hundreds of times |
| Dead preconnects | 2 | `fonts.googleapis.com`, `fonts.gstatic.com` in `layout.tsx` but no `@font-face` or `next/font` import |

**Distribution of brand colors:** `#1a5276` (107), `#2e86c1` (102), `#154360` (5), `#25D366` (3 — WhatsApp green, OK), `#0088cc` (3 — Telegram, OK), Google brand hexes (8). Everything else is stragglers.

## Naming Consistency

| Issue | Components | Recommendation |
|-------|------------|----------------|
| No shared `Button` primitive | All "buttons" are `<Link>` or `<button>` + ad-hoc className strings | Extract `components/ui/Button.tsx` with `variant="primary"|"secondary"|"ghost"` |
| No shared `Card` primitive | "bg-white rounded-xl shadow-sm" appears ~30 times | Extract `components/ui/Card.tsx` |
| No shared `Badge` / `Pill` | "px-2 py-0.5 rounded text-[10px]" pattern for category pills appears ~25 times | Extract `components/ui/Badge.tsx` with `tone="brand"|"success"|"warning"|"neutral"` |
| Inline SVG icons | 82 buttons each re-declare the SVG path | Extract `components/ui/Icon.tsx` or add `lucide-react` (already in bundle elsewhere) |
| Color folk-taxonomy | "Telangana = blue, AP = green" is implemented inline in every list view | Define `--color-state-ts`, `--color-state-ap` tokens |

## Component Completeness

| Component | States | Variants | Docs | Score |
|-----------|--------|----------|------|-------|
| SearchBar | Default, focused, mobile-open, results-open, empty | Desktop / mobile overlay | ❌ | 7/10 |
| BottomNav | Active/inactive per tab, auth-gated Shortlist→Login | One | ❌ | 8/10 |
| ShortlistButton | Default, hover, busy, shortlisted, disabled | `icon` / `full` (documented in TS props ✅) | ⚠️ TS comment only | 8/10 |
| UserNavMenu | Not yet read | — | ❌ | — |
| AdBanner / AdSlot / SponsoredCard | — | — | ❌ | — |
| FAQAccordion | — | — | ❌ | — |
| ShareButtons | — | — | ❌ | — |
| ThemeToggle | Exists but… | — | ❌ | — |
| JsonLd | N/A (server helper) | — | N/A | N/A |

Observations: `ShortlistButton` is the only component with a clear `variant` prop API and prop-documented TS. Every other component is single-purpose. `ThemeToggle` exists but the root `<body>` has no `dark:` support — likely dead code.

## Mobile-First Coverage

Very strong. 453 `sm:` prefixes vs 11 `md:`. Touch targets enforced globally via `@media (pointer: coarse) { button, a, …{ min-height: 44px } }` in `globals.css` — a good safety net, but it **fights the design** when you set `h-11` or tighter rows because the global rule also affects table row `<a>` tags. It's a blunt tool.

`meta viewport` in `layout.tsx` sets `maximum-scale=5` which allows zoom (good for a11y).

### Legibility concern — public-facing accuracy matters

The tiny-type habit is heavy: **193 uses of `text-[9px]`, `text-[10px]`, or `text-[11px]`**, including the homepage, main nav, and college/branch cards. On a 2× iPhone display that's ~18–22 CSS pixels of content at 9–11px font — readable, but below the WCAG AAA recommended 16px and uncomfortable for parents / older prospective students (a core audience). This also compounds with cutoff ranks and fees, where accuracy matters.

## Accessibility Spot Checks

| Check | Finding |
|-------|---------|
| Skip link | ✅ present in layout.tsx |
| `<html lang>` | ⚠️ `"en"` — should be `"en-IN"` given locale is en_IN in metadata |
| Focus outline | ✅ custom 2px outline, but hex inlined twice |
| `aria-label` | 18 uses — spot-checked SearchBar, BottomNav, ShortlistButton — all correct |
| `aria-pressed` | 2 uses (correctly on ShortlistButton) |
| `aria-expanded` / `aria-controls` | 3 uses — light, but matches the simple widgets in the codebase |
| Semantic landmarks | `<main>` × 25, `<section>` × 77, `<h1>` on 29/40 pages — 11 pages may be missing an H1 |

## Priority Actions

### Critical (do this week)
**1. Define `@theme` tokens in `globals.css`** and migrate brand blues.

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #1a5276;        /* currently 107 inlines */
  --color-brand-hover: #154360;  /* currently 5 inlines */
  --color-accent: #2e86c1;       /* currently 102 inlines */
  --color-accent-soft: #eaf4fb;  /* blue-50 alias */
  --color-ts: #2e86c1;           /* Telangana */
  --color-ap: #16a34a;           /* Andhra (green-600) */
  --color-surface-dark: #1b2631; /* footer bg */

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --text-xxs: 0.6875rem;  /* 11px — caps at the bottom of the scale */
}
```
Then codemod replace: `bg-[#1a5276]` → `bg-brand`, `text-[#2e86c1]` → `text-accent`, etc. Removes 209+ inlines in one pass and turns future rebrands into a one-line edit. Drop the dead Google Fonts preconnect or wire up `next/font/google` for Inter — don't preconnect to a domain you never call.

### High (next sprint)
**2. Extract three shared primitives: `Button`, `Card`, `Badge`.** Even crude versions will kill the worst className duplication. `ShortlistButton` is already a decent template for the API pattern — same `variant` prop, same disabled/busy wiring.

**3. Raise the type-size floor to 12px minimum for body copy and data.** Replace `text-[10px]` / `text-[11px]` with `text-xs` (12px) in the homepage, nav, and all cards/tables. Only keep `text-xxs` (11px) for timestamp chips and truly secondary metadata. For a public-facing data site aimed at students and parents, tiny text erodes trust — especially alongside fees and cutoffs where the whole value prop is "accurate."

**4. Fix `<html lang>` and remove dead preconnects.** `layout.tsx` → `<html lang="en-IN">`. Drop the two `fonts.googleapis.com` preconnects unless you're adding a real font load.

### Medium (ongoing)
**5. Delete or activate `ThemeToggle`.** No `dark:` classes in the tree — the toggle currently does nothing observable. Either commit to dark mode (and gate the bulk of the rebrand above on `@theme` properly) or remove the component.

**6. Soften the global 44px `min-height`.** The `@media (pointer: coarse)` rule in `globals.css` that sets `min-height: 44px` on every `button, a, select, input, [role="button"]` is too broad — it inflates table-row links and inline anchors. Scope it to `button:not([data-inline]), nav a, [role="button"]:not([data-inline])` or drop the rule and enforce touch targets at the component level (ShortlistButton already does this correctly).

**7. Audit the 11 pages missing `<h1>`.** For SEO and a11y both — every page needs exactly one H1.

## Suggested Next Steps

Happy to go deeper on any of these. The highest-leverage single move is **#1** — defining `@theme` tokens and running a mechanical find-replace on the two brand hexes. That alone takes the repo from "inline arbitrary values everywhere" to "a real design system" in one PR, without risking any visual regression.

If you'd like, I can:

- Write the `@theme` block + a codemod script that rewrites `bg-[#1a5276]` → `bg-brand` across all .tsx files
- Draft `components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx` based on the patterns already in use
- Produce per-component docs (`docs/components/*.md`) for the nine existing shared components
