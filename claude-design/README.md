# Claude Design kit — TeluguColleges.com

A small set of context files to upload to **Claude Design** (claude.ai/design) so it
produces an on-brand refresh of the site. Built June 2026 from the live site + codebase.

## Files

- **`DESIGN.md`** — the important one. Brand, color tokens, typography, spacing, the
  component inventory, voice, and hard constraints. Claude Design reads this once and
  auto-applies it to every prompt in the project (you won't re-specify colors/fonts).
- **`BRIEF.md`** — what to design: goals, the three pages to start with, what to keep,
  what to fix, and the expected deliverable.
- **`screenshots/`** — drop current-state screenshots here (see below) and upload them
  alongside the markdown so Claude Design can see the starting point.

## How to use it

1. Turn Claude Design on: Claude → Organization settings → Capabilities → Anthropic Labs
   → enable. Then open **claude.ai/design** and start a new project.
2. **Upload `DESIGN.md` and `BRIEF.md`** as project context (drag them in).
3. *(Optional but recommended)* Upload the screenshots, or just paste the live URLs
   below — Claude Design can also read the codebase/live site directly.
4. Prompt, for example:
   > "Using DESIGN.md and BRIEF.md, redesign the College Directory page (`/colleges`).
   > Show desktop and mobile. Fix the sub-12px text and replace emoji icons with a
   > consistent icon set. Output the component primitives (Button, Card, Badge,
   > StatTile, Pill) as a small style sheet first, then the page."
5. Refine on the canvas (inline comments, spacing/color knobs), then export the HTML/CSS
   from the Artifacts panel to translate into the Tailwind v4 component layer.

## Live URLs to screenshot (current state)

- Homepage: https://telugucolleges.com
- College directory: https://telugucolleges.com/colleges
- College detail: https://telugucolleges.com/colleges/amrita-amaravati
- EAPCET predictor: https://telugucolleges.com/eapcet

To add screenshots: open each URL, capture full-page (desktop and a mobile width),
and save the images into `screenshots/`. They're optional — `DESIGN.md` carries the
brand on its own — but they help Claude Design match the existing layout.

## Scope reminder

This is a **polish pass**, not a rebrand or rebuild. Keep the blue brand system, the
TS-blue / AP-green state coding, the card language, and the fast mobile-first
foundation. The redesign's job is legibility, consistency, trust, and icon polish —
the details are in `BRIEF.md`.
