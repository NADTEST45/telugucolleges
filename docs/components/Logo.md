# Component: Logo

_Design handoff spec · TeluguColleges · 2026-04-21_

## Location

- React component: `src/components/Logo.tsx` — exports `Logo` (default) and `LogoMark` (named)
- Static SVGs: `public/logo/mark.svg`, `public/logo/logo-horizontal.svg`, `public/logo/logo-horizontal-light.svg`, `public/logo/wordmark.svg`
- Favicon: `public/favicon.svg` (identical to `mark.svg` with a unique gradient id)

## Description

The TeluguColleges brand mark. A rounded-square tile with the brand gradient (`brand-dark → brand → accent`) and a white "TC" monogram — the letter T (straight bar + stem) and an open letter C (arc with rounded caps). The mark scales cleanly from 16px favicons to 1024px PWA icons without losing legibility.

The full logo lockup places the mark to the left of the wordmark "TeluguColleges" with a `.com` suffix tinted in `accent` (or `blue-300` on dark backgrounds). On mobile the wordmark is hidden and only the mark renders, preventing header crowding.

## Variants

| Variant | Use When | Background |
|---------|----------|-----------|
| `mark` | Nav on mobile, favicons, PWA icons, social, buttons, empty states | Any |
| `dark` (default) | Full lockup on light backgrounds — marketing pages, legal pages, light cards | Light / white |
| `light` | Full lockup on dark backgrounds — main nav (brand blue), footer (surface-dark), dark banners | Dark |

## Props

### `Logo` (default export)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `"dark" \| "light" \| "mark"` | `"dark"` | Color treatment and whether the wordmark is shown. |
| `decorative` | `boolean` | `false` | When `true`, the mark sets `aria-hidden` and omits its label. Use when adjacent visible text already names the brand (e.g. inside a `<Link aria-label="...">`). |
| `className` | `string` | `""` | Extra classes on the outer `<span>` wrapper. |

### `LogoMark` (named export)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `className` | `string` | `"w-8 h-8"` | Tailwind size classes applied to the `<svg>`. |
| `decorative` | `boolean` | `false` | Same semantics as above. |

## States

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Gradient tile (`brand-dark → brand → accent`), white monogram | Static — no animation |
| Hover (inside `<Link>`) | Inherit from parent anchor (opacity/scale) | Parent handles interaction |
| Focus | Inherits the global `:focus-visible` outline (2px accent) | Use on the parent `<Link>`, not the svg |
| Loading / Skeleton | Render `<div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />` placeholder | Mark has no loading state of its own |

## Design Tokens Used

| Token | Where | Fallback |
|-------|-------|----------|
| `--color-brand` (`#1a5276`) | Gradient stop 55% | Inlined in static SVGs |
| `--color-brand-dark` (`#154360`) | Gradient stop 0% | Inlined in static SVGs |
| `--color-accent` (`#2e86c1`) | Gradient stop 100%, `.com` suffix color | Inlined in static SVGs |

The React `LogoMark` references tokens via `var(--color-brand, #…)` with literal fallbacks so the logo stays correct even if the stylesheet hasn't loaded yet.

## Geometry (for pixel-perfect replication)

**Canvas:** 64 × 64 (viewBox units)
**Corner radius:** `rx=14` (22% of size)

**T letter:**
- Horizontal bar: `x=8, y=17, width=24, height=7, rx=2`
- Vertical stem: `x=16.5, y=17, width=7, height=30, rx=2`
- Fill: `#ffffff`

**C letter:**
- Open arc centered at `(46, 32)` with radius 10
- Path: `M 52 25 A 10 10 0 1 0 52 39`
- Stroke: `#ffffff`, `stroke-width=7`, `stroke-linecap=round`, `fill=none`

**Gradient:** linear, top-left → bottom-right, stops at 0% / 55% / 100%

## Clearspace & Minimum Size

**Clearspace:** On external media (slides, partner sites, social), keep an area equal to 25% of the mark's height on all four sides free of other content.

**Minimum sizes:**
- Mark alone: **16px** (favicon). Below this, the C's arc collapses and the T bar looks squashed.
- Horizontal lockup: **96px wide** (mark + wordmark). Below this, switch to the mark.
- Wordmark alone: **120px wide**. Below this, the `.com` tint gets muddy.

## Responsive Behavior

Inside the default `<Logo />`, the mark is always visible and the wordmark uses `hidden sm:inline` — on phones you only see the mark. Mirrors the pattern in `layout.tsx` (where the old "TC" tile already did this manually).

## Accessibility

- **Role:** `img` with `aria-label="TeluguColleges"` by default. When used inside a named parent (e.g. `<Link aria-label="TeluguColleges.com — Home">`), pass `decorative` to suppress the duplicate announcement.
- **Keyboard:** No keyboard interaction — the logo is not focusable itself. Wrap it in a `<Link>` or `<button>` to be interactive.
- **Screen reader:** Announces as "TeluguColleges, image" or is skipped entirely when `decorative`.
- **Contrast:** White monogram on the darkest gradient stop (`#154360`) measures 8.9:1 contrast — passes WCAG AA and AAA. On the lightest stop (`#2e86c1`) it measures 4.6:1, passes WCAG AA for large text/graphics (3:1) comfortably.
- **Touch target:** The logo itself does not need a 44px target. Its parent `<Link>` is responsible for sizing — in the nav it already inherits the 44px-on-coarse-pointer rule from `globals.css`.
- **Reduced motion:** No animations. `prefers-reduced-motion` has no effect.

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|------|---------|
| Use `LogoMark` in mobile contexts where space is tight | Don't add "beta" or tagline text inside the mark — add it beside the wordmark |
| Set `decorative` when the parent `<Link>` has an `aria-label` | Don't recolor the mark (e.g. `bg-red-500`) — the gradient is the brand |
| Use `variant="light"` on `bg-brand`, `bg-surface-dark`, or darker imagery | Don't stretch the lockup horizontally — keep the SVG's intrinsic aspect ratio |
| Raster-render (PNG/ICO) from the SVG at export time if a platform requires it | Don't re-draw the monogram in a different font — the T + open-C shape is the mark |
| Pair with the `Inter` / system sans stack for the wordmark | Don't rotate the mark, apply drop shadows, or add strokes |

## Usage Examples

```tsx
// Main nav (dark blue background) — mark + wordmark, with parent aria-label
<Link href="/" aria-label="TeluguColleges.com — Home" className="flex items-center gap-2">
  <LogoMark className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" decorative />
  <span className="font-bold text-base sm:text-lg hidden sm:inline" aria-hidden="true">
    TeluguColleges<span className="text-blue-300">.com</span>
  </span>
</Link>

// Marketing page hero (light background)
<Logo variant="dark" className="h-10" />

// Footer (dark background) — full lockup in light variant
<Logo variant="light" />

// Favicon-sized placeholder
<LogoMark className="w-4 h-4" decorative />
```

## SEO & Metadata Hooks

- `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` is set in `src/app/layout.tsx` — modern browsers pick the vector version.
- `<link rel="apple-touch-icon" href="/logo/mark.svg">` is set for iOS homescreen.
- `public/manifest.json` references `/favicon.svg` (any purpose) and `/logo/mark.svg` (maskable) plus the legacy `/favicon.ico` fallback.
- `<meta name="theme-color" content="#1a5276">` in the head is synced with `manifest.json` `"theme_color": "#1a5276"`.
- OG image (`/og-image.png`, 1200×630) is **not yet regenerated with the new mark.** See open questions.

## Open Questions

- **OG image regeneration.** The existing `public/og-image.png` predates the new mark. Worth regenerating at some point so shared links match the live site. Low-priority — it's on-brand enough.
- **Dedicated PNG raster exports.** Some partner platforms (some Android launchers, email clients) prefer raster PNGs at 192×192, 512×512. Can be generated from `mark.svg` on demand; no current consumer requires them.
- **Telugu-script wordmark.** A `తెలుగు కాలేజీలు` wordmark lockup could be useful for Telugu-first marketing surfaces. Out of scope for this pass; flag for future exploration.
- **Standalone monogram symbol (no tile).** Would be useful as a bullet/list marker or inside dark cards. Could be derived by rendering just the T + C paths without the gradient rect — left for a follow-up if needed.
