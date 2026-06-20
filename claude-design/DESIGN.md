# DESIGN.md — TeluguColleges.com

> Drop this file into Claude Design as context. It captures the existing brand,
> tokens, components, and voice so every generated design stays on-brand.
> Source of truth: `src/app/globals.css` (`@theme`) + live site `telugucolleges.com`.

## What this product is

A public, data-first directory for college admissions in Andhra Pradesh (AP) and
Telangana (TS), India. It covers EAPCET/EAMCET cutoffs, official fees, placements,
rankings, a rank predictor, and comparison tools across ~849 professional colleges
(engineering, pharmacy, medical, management). **Trust and accuracy are the product** —
the design must read as authoritative and government-source-credible, never flashy.

## Audience

- **Primary:** 17–19 year-old EAPCET/EAMCET aspirants choosing a college, on **budget
  Android phones** over mobile data. Mobile-first is non-negotiable.
- **Secondary:** Parents (often 40s–50s, may read Telugu first, English second) who
  care about fees and placements. They need **larger, legible type** and plain language.
- Implication: high information density, but never at the cost of legibility. Avoid the
  current habit of 9–11px text (see "Known issues" below).

## Brand voice

Trustworthy, plain-spoken, regional-but-professional. "Official fees, real cutoffs,
tools that actually help." No hype, no marketing fluff, no emoji in body copy. Numbers
(ranks, fees, packages) are the heroes — make them prominent and scannable.

## Color tokens (current — keep these)

Defined in `globals.css` `@theme`:

| Token | Hex | Use |
|---|---|---|
| `--color-brand` | `#1a5276` | Primary brand blue — nav bar, headings, primary numbers, primary buttons |
| `--color-brand-dark` | `#154360` | Hover/pressed of brand; darker end of hero gradient |
| `--color-accent` | `#2e86c1` | Links, focus ring, secondary actions, Telangana accent |
| `--color-surface-dark` | `#1b2631` | Footer / deep backgrounds |
| Page background | `#f9fafb` (gray-50) | App background |
| Surface | `#ffffff` | Cards |

### Semantic / category colors (in use across the site — preserve meaning)

- **State coding (consistent everywhere):** Telangana = blue/accent (`#2e86c1`),
  Andhra Pradesh = green (`green-600 #16a34a`). Never swap these.
- **Status:** "Updates/alerts" = red (`red-600/100`); success = green; info = blue.
- **Program accents** (used on category tiles, keep subtle): B.Tech indigo, MBA amber,
  MCA cyan, MBBS/Medical rose, Pharmacy teal, M.Pharm violet, etc.
- **Badges:** Government = green, Deemed University = amber, Private University = violet,
  Private = blue, NIRF = rose, NAAC = amber, NBA = purple.

Recommendation for the redesign: formalize the above as named tokens
(`--color-state-ts`, `--color-state-ap`, `--color-status-alert`, `--color-badge-govt`…)
instead of inlining Tailwind palette classes. There are currently 16 distinct hex
values inlined ~180× across the codebase — consolidate them.

## Typography

- **Family:** currently the system stack (no web font loaded). A clean, highly legible
  sans is fine — if introducing a font, prefer one with strong Latin + Telugu support
  and good number legibility (e.g. Inter, or a Noto pairing). Keep it fast.
- **Scale (target — fixes the legibility problem):**
  - Hero H1: ~30–48px, `font-extrabold`, tight leading.
  - Section H2: 20–24px, `font-bold`.
  - Card title: 14–16px, `font-bold`.
  - Body: **15–16px minimum** on mobile (not 11px).
  - Meta/caption: **12px floor** — never below 12px anywhere. (Current site uses
    9–11px in ~193 places; the redesign should retire all sub-12px text.)
  - Numbers (rank/fee/package): bold, brand-colored, one step larger than their label.

## Spacing, shape, elevation

- Container: `max-w-7xl` (1280px), `px-4 sm:px-6`.
- Radius: cards `rounded-xl` (12px); large surfaces `rounded-2xl`; pills `rounded-full`.
- Elevation: `shadow-sm` at rest, `shadow-md` on hover; cards lift `-translate-y-0.5`
  on hover. Keep shadows soft and subtle — this is a data site, not a SaaS landing page.
- Borders: hairline `border-gray-100`; left-accent border (`border-l-4`) denotes
  college type/section.
- Touch targets: **44px minimum** for all interactive elements (enforced globally).

## Core components (current inventory — reuse these patterns)

1. **Top nav** — sticky, brand-blue, logo + search + 6 section links + user menu.
2. **Search bar** — autocomplete over colleges; desktop inline, mobile full-screen overlay.
3. **Hero** — brand gradient (`brand-dark → brand → accent`), eyebrow + H1 + subhead +
   two CTAs (solid white primary, translucent secondary).
4. **Program quick-link bar** — horizontal-scroll pills, sticky under nav.
5. **Category tiles** — grid of program cards with icon + label + count. *(Currently use
   OS emoji — see issues; replace with a consistent icon set.)*
6. **News/alert strip** — "Updates" badge + latest items, state-colored chips.
7. **Ranking lists** — numbered rows: college name + rank + fee.
8. **College card (directory)** — left-accent border, name, meta line, badge row
   (type/NIRF/NAAC/NBA), and a 4-up stat grid (fee, cutoff, avg pkg, highest pkg).
9. **College detail header** — type badge + NIRF badge, big name, meta, action buttons,
   then a grid of stat cards, then tabbed sections (Overview/Fees/Cutoffs/Placements…).
10. **Filter bar** — state toggle, category pills, section tabs, search+sort, expandable
    advanced filters.
11. **Footer** — `surface-dark`, three link columns + legal/sourcing note.
12. **Mobile bottom tab bar** — fixed, safe-area aware.

## Known issues to FIX in the redesign (priorities)

1. **Sub-12px text everywhere** (~193 instances) — biggest legibility problem for the
   parent audience. Establish and enforce a 12px floor.
2. **Emoji category icons** (⚙️ 📊 💻) render inconsistently across devices and look
   unpolished against the otherwise professional UI — replace with one coherent icon set.
3. **No shared primitives** — `Button`, `Card`, `Badge`, `StatTile`, `Pill` are
   reassembled ad-hoc on every page (brand hex inlined ~180×). Design them as named,
   reusable components with explicit variants.
4. **Desktop nav search** renders cramped/truncated — give it a comfortable min-width.
5. **Directory density** — the all-849 list is heavy; design a scannable, grouped,
   skimmable layout (the engineering fix for render cost is already handled in code).

## Hard constraints (do not break)

- **Mobile-first**, fast on low-end Android over 3G/4G. No heavy hero images, minimal JS.
- **SEO-critical:** real content and links must stay in the DOM (server-rendered).
  Don't propose designs that hide primary content behind JS-only interactions.
- **Accessibility:** visible focus rings, 44px targets, `aria` labels, zoom allowed.
- **Accuracy framing:** always show data provenance (e.g. "from official TSCHE/APSCHE
  government orders"); never imply estimates are official.
- Stack is Next.js + Tailwind v4; deliverables should map cleanly to utility classes.
