# TeluguColleges.com — Project Changelog & Setup Guide

> Last updated: March 12, 2026
> Production URL: https://telugucolleges.vercel.app

---

## How to Continue on Another Machine

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- Vercel CLI: `npm i -g vercel`
- Git (optional but recommended)

### Setup Steps
1. Copy this entire folder to the new machine
2. `cd telugucolleges`
3. `npm install`
4. `npm install lightningcss` (peer dep that sometimes needs manual install)
5. `npm run dev` → runs at http://localhost:3000
6. `npm run build` → should generate ~839 static pages
7. To deploy: `npx vercel --yes --prod` (log in to your Vercel account first via `npx vercel login`)

### Tech Stack
- **Framework**: Next.js 16.1.6 (App Router, Static Site Generation)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.2 (via @tailwindcss/postcss + lightningcss)
- **Hosting**: Vercel (static export with SSG)
- **No database** — all data is in TypeScript files in `src/lib/`

---

## Current State (March 12, 2026)

### Data Summary
- **797 colleges total** (471 AP + 328 TS) — IDs 1 through 799 (2 gaps)
- **509 engineering** colleges
- **214 pharmacy** colleges (branches include B.Pharm, M.Pharm, Pharm.D)
- **80 medical** colleges (MBBS, MD/MS)
- **7 multi-category** colleges (engineering + pharmacy: AUCE, CBIT, CVSR, GURU, NNRG, GGIB, VGTN)
- **52 districts** covered across both states
- **34+ programs** tracked (B.Tech, M.Tech, MBA, MCA, MBBS, B.Pharm, etc.)

### Pages & Routes (839 static pages)
- `/` — Homepage with category cards, stats, search
- `/colleges` — College directory with filters (state, district, type, category, fee range, search)
- `/colleges/[slug]` — 797 individual college detail pages (SSG)
- `/programs` — All programs grouped by category with fee ranges
- `/programs/[slug]` — 34+ program detail pages with college lists, filters, sorting (SSG)
- `/eapcet` — EAPCET cutoff data explorer
- `/compare` — Side-by-side college fee comparison tool
- `/about` — About page

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              — Root layout, nav bar, footer
│   ├── page.tsx                — Homepage
│   ├── globals.css             — Global styles
│   ├── about/page.tsx          — About page
│   ├── colleges/
│   │   ├── page.tsx            — College directory (filters: state, district, type, category, fee)
│   │   └── [slug]/
│   │       ├── page.tsx        — SSG wrapper (generateStaticParams)
│   │       └── CollegeDetail.tsx — Client component with full college info
│   ├── compare/page.tsx        — Fee comparison tool
│   ├── eapcet/page.tsx         — EAPCET cutoff explorer
│   └── programs/
│       ├── page.tsx            — Programs listing by category
│       └── [slug]/
│           ├── page.tsx        — SSG wrapper (generateStaticParams)
│           └── ProgramDetail.tsx — Client component with filters/sorting
├── components/
│   └── SearchBar.tsx           — Global search in nav
└── lib/
    ├── colleges.ts             — COLLEGES array (797 entries) + College interface
    ├── university-courses.ts   — UNIVERSITY_COURSES record + generateAffiliateCourses()
    ├── program-data.ts         — getAllPrograms(), getCollegesForProgram(), getAllProgramSlugs()
    ├── programs.ts             — Legacy program constants (kept for reference)
    ├── ap-cutoffs.ts           — EAPCET cutoff data
    ├── go_data.json            — Government order reference data
    ├── ap_btech_data.json      — AP B.Tech fee audit data
    ├── ap_mba_data.json        — AP MBA fee data
    ├── ap_mca_data.json        — AP MCA fee data
    ├── ap_mtech_data.json      — AP M.Tech fee data
    ├── ap_barch_data.json      — AP B.Arch fee data
    ├── ap_bba_bca_data.json    — AP BBA/BCA fee data
    ├── ap_medical_data.json    — AP medical college data
    ├── ap_paramedical_data.json — AP paramedical data
    ├── mba_data.json           — TS MBA fee data
    ├── mca_data.json           — TS MCA fee data
    └── mtech_data.json         — TS M.Tech fee data
```

---

## Changelog (Reverse Chronological)

### 2026-03-12 — Programs Feature + Daily Automation

**New: /programs pages**
- Created `src/lib/program-data.ts` — data aggregation layer that scans all colleges and their courses to produce ProgramSummary and CollegeProgram lists
- Created `src/app/programs/page.tsx` — programs listing grouped by category (Engineering, Pharmacy, Medical, Management, Science, Other) with color-coded cards showing college count and fee range
- Created `src/app/programs/[slug]/page.tsx` — SSG page with generateStaticParams for all 34+ programs
- Created `src/app/programs/[slug]/ProgramDetail.tsx` — client component with:
  - State toggle (All/AP/TS with counts)
  - Search by college name, district, or code
  - Sort by fee (low→high, high→low), name, district
  - Filter panel: district dropdown (state-aware), college type
  - Stats cards: lowest/median/highest fee + total colleges
  - College list with fee details, badges, links to college pages
- Added "Programs" link to nav bar and footer in layout.tsx

**New: Daily automation**
- Created scheduled task `telugucolleges-news-updater` (runs daily at 7 AM)
- Searches for new GOs, fee notifications, EAPCET results, NAAC/NIRF updates
- Writes daily report to `daily-updates/YYYY-MM-DD.md`
- Auto-updates data and redeploys if high-confidence official changes found

### 2026-03-12 — Pharmacy & Medical Colleges Expansion

**Added 288 new colleges (IDs 512–799)**
- **207 pharmacy colleges** extracted from EAPCET PDF data
  - AP: ~120 colleges affiliated to JNTUK, AKNU, AU
  - TS: ~87 colleges affiliated to JNTUH, OU, KU
  - Programs: B.Pharm (4yr), M.Pharm (2yr), Pharm.D (6yr)
  - Fees from APHERMC (AP) and TAFRC (TS) block periods
- **80 medical colleges** compiled from NMC, YSRUHS, KNRUHS sources
  - ~40 AP + ~40 TS (government + private)
  - Programs: MBBS (5.5yr), MD/MS (3yr)
  - Fees: Govt ~₹15K-25K; Private ~₹10L-25L
- **7 existing colleges updated** with pharmacy branches (AUCE, CBIT, CVSR, GURU, NNRG, GGIB, VGTN)

**College directory updates (src/app/colleges/page.tsx)**
- Added category filter toggle (All / Engineering / Pharmacy / Medical)
- Added Pharmacy and Medical badges on college cards
- Expanded fee filter to ₹10L and ₹20L ranges

**University courses updates (src/lib/university-courses.ts)**
- Updated `generateAffiliateCourses()` to handle pharmacy and medical branches
- Added B.Pharm, M.Pharm, Pharm.D, MBBS, MD/MS course generation with management quota fees

**Bug fixes**
- Fixed 26 pharmacy colleges that had "COED" as district (parsing error from PDF)
- Mapped old EAMCET district codes to official 2022 reorganization district names

### 2026-03-11 — Fee Audit + District Filtering + 2026 Districts

**Fee data audit against official GOs**
- Verified all AP B.Tech fees against G.O.Ms.No.17 & 23 (2024), APHERMC block 2023-26
- Verified all TS B.Tech fees against G.O.Ms.No.06, TAFRC block 2025-28
- Corrected discrepancies found in 40+ colleges
- Added management quota fees (Category-B): AP = ~2.5× convener; TS = ~2× convener

**AP districts updated to 2026**
- Base: 26 districts from 2022 reorganization (Srikakulam, Parvathipuram Manyam, Vizianagaram, Visakhapatnam, Alluri Sitharama Raju, Anakapalle, Kakinada, East Godavari, Konaseema, Eluru, West Godavari, NTR, Krishna, Palnadu, Guntur, Bapatla, Prakasam, Sri Potti Sriramulu Nellore, Kurnool, Nandyal, Anantapur, Sri Sathya Sai, YSR Kadapa, Annamayya, Tirupati, Chittoor)
- Added 3 new 2026 districts: Mandapalle, Markapuram, Polavaram

**District filtering**
- All college pages support filtering by district
- Districts are state-aware (shows AP districts for AP, TS districts for TS)

### 2026-03-10 — Initial Build

**Core site launch with 509 engineering colleges**
- Next.js 16 App Router with TypeScript and Tailwind CSS 4
- Static Site Generation for all college pages
- Homepage with search, category cards, statistics
- College directory with state/district/type/fee filters
- Individual college detail pages with fee breakdown, cutoff data, placement stats
- EAPCET cutoff explorer
- Side-by-side fee comparison tool
- About page
- Responsive design, sticky nav, SEO metadata

---

## Fee Data Sources Reference

| Source | Scope | Period |
|--------|-------|--------|
| G.O.Ms.No.41/42/43 (AP) | B.Tech base fees | 2023-26 |
| G.O.Ms.No.17 & 23 (AP) | B.Tech enhanced fees | 2024-26 |
| G.O.Ms.No.35 (AP) | PG fees (M.Tech, MBA, MCA) | 2023-26 |
| G.O.Ms.No.64 (AP) | PG enhanced fees | 2024-26 |
| G.O.Ms.No.59 (AP) | UG degree (BBA, BCA) | 2024-26 |
| G.O.Ms.No.62 (AP) | M.Tech fees | 2024-26 |
| G.O.Ms.No.06 (TS) | B.Tech TAFRC block | 2025-28 |
| G.O.Ms.No.39 (TS) | MBA/MCA fees | 2025-28 |
| APHERMC | AP pharmacy fee regulation | 2023-26 |
| TAFRC | TS fee regulation committee | 2025-28 |
| NMC/YSRUHS/KNRUHS | Medical college fees | 2025-26 |
| Deemed/Private University websites | Individual fee structures | 2025-26 |

---

## Key Interfaces

```typescript
// src/lib/colleges.ts
interface College {
  id: number; name: string; code: string; slug: string;
  district: string; state: "Telangana" | "Andhra Pradesh";
  type: "Government" | "Private" | "Deemed University" | "Private University";
  affiliation: string; naac: string; nba: boolean; year: number;
  fee: number; goFee: number; nirf: number;
  cutoff: Record<string, number>;
  placements: { avg: number; highest: number; companies: number };
  branches: string[];
}

// src/lib/university-courses.ts
interface CourseInfo {
  program: string; specialization?: string;
  fee: number; mgmtFee?: number;
  duration: number; level: "UG" | "PG" | "Doctoral" | "Diploma" | "Integrated";
}

// src/lib/program-data.ts
interface ProgramSummary {
  slug: string; name: string; level: string; duration: number;
  collegeCount: number; feeMin: number; feeMax: number; feeMedian: number;
  category: "Engineering" | "Pharmacy" | "Medical" | "Management" | "Science" | "Other";
}
```

---

## Deployment Notes
- Deploy command: `npx vercel --yes --prod`
- Build generates ~839 static HTML pages
- lightningcss is a required peer dependency — install manually if npm complains
- Vercel project name: telugucolleges
- If Vercel auth expires, run `npx vercel login` first
