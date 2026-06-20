# BRIEF.md — Redesign brief for Claude Design

## The ask

Refresh the visual design of TeluguColleges.com while keeping its fast, data-dense,
SEO-strong foundation. This is **not** a rebrand and not a from-scratch rebuild — it's a
polish pass that fixes specific legibility/consistency issues and proposes a cleaner,
more trustworthy look. Read `DESIGN.md` first for brand, tokens, and constraints.

## Goals (in priority order)

1. **Legibility** — kill all sub-12px text; establish a clear type scale that works for
   both 18-year-old students and their parents on phones.
2. **Consistency** — one coherent set of primitives (Button, Card, Badge, StatTile,
   Pill, Icon) with named variants, replacing ~180 inlined color values and ad-hoc cards.
3. **Trust** — make the design feel authoritative and government-source-credible.
   Numbers (ranks, fees, packages) should be the visual heroes.
4. **Polish** — replace inconsistent OS emoji icons with a single icon set; fix the
   cramped nav search; tighten spacing rhythm.

## Pages to design (start with these three)

1. **Homepage** (`/`) — hero, program categories, news strip, top-CSE ranking lists,
   affordable-colleges cards, "why us" trust section.
2. **College directory** (`/colleges`) — filter bar + grouped, scannable list of college
   cards. Must stay skimmable at ~849 items; design the card and the grouping, not a
   redesign that hides results behind interactions.
3. **College detail** (`/colleges/[slug]`) — header with badges + key stats, then tabbed
   sections (Overview, Fees & Courses, Cutoffs, Placements, Admission, Reviews).

(Secondary, if time: the EAPCET rank predictor and the compare view.)

## What's working (keep it)

- The blue brand system and the state color-coding (TS blue / AP green).
- The card + left-accent-border language and soft elevation.
- Strong mobile-first layout and 44px touch targets.
- The college detail page's stat-card + tab structure (it's already the best page).

## What to fix (from a June 2026 audit)

- ~193 uses of 9–11px text — legibility floor of 12px needed.
- Emoji icons render inconsistently and look unpolished.
- No shared component primitives; brand hex inlined ~180×.
- Desktop nav search renders narrow/truncated.
- Directory is visually heavy at full length — needs clearer grouping/hierarchy.

## Constraints (must respect)

- Mobile-first; fast on budget Android over mobile data. No heavy imagery.
- SEO: primary content/links stay server-rendered in the DOM.
- Accessibility: visible focus, 44px targets, zoom allowed, aria labels.
- Maps to Next.js + Tailwind v4 utility classes.
- Show data provenance; never imply estimates are official figures.

## Deliverable from Claude Design

Per page: a desktop and a mobile layout, plus the shared component set (Button, Card,
Badge, StatTile, Pill, Icon) shown as a small style sheet. Export the HTML/CSS so it can
be translated into the existing Tailwind v4 component layer.
