# Fact gaps: 2024 onward

Reviewed 5 September 2026 against code revision `c960c91a`. Scope: 2024–2026 admission/cutoff records and claims presented as current. No pre-2024 dataset reconciliation was undertaken. Existing source checks from the previous audit were reused where relevant. The findings below describe the audited revision. See the repair status at the end for subsequent changes.

## Confirmed errors and omissions

### 1. IIIT Hyderabad's 2026–27 postgraduate prices are wrong

`src/lib/university-courses.ts:276–278`:

| Programme | Stored annual tuition | Official 2026–27 annual tuition |
| --- | ---: | ---: |
| M.Tech | ₹2,50,000 | ₹5,00,000 |
| M.S. by Research | ₹2,00,000 | ₹60,000 |
| Ph.D. | ₹1,00,000 | ₹60,000 |

The [official postgraduate fee page](https://pgadmissions.iiit.ac.in/fee/), updated April 2026, distinguishes tuition, stipends and living charges. Scholarship/stipend support must not be subtracted from tuition and represented as the price. The stored M.Tech specialisation list also needs aligning with the programmes identified by that source. Priority: high.

### 2. IIIT Hyderabad CLD has the wrong qualification and duration

`src/lib/university-courses.ts:274` records CLD as a four-year B.Tech. The [official programme page](https://ugadmissions.iiit.ac.in/cld/) identifies a five-year dual degree: B.Tech in Computer Science plus M.S. in Computational Linguistics by Research. The [2026 admissions page](https://ugadmissions.iiit.ac.in/dasa/) also lists it under five-year programmes. This changes the qualification and total-cost calculation. Priority: high.

### 3. KL Vijayawada Civil M.Tech is underpriced by the grouping

`src/lib/university-courses.ts:117` groups Civil / EEE / ME at ₹1,25,000 per year. The [2026–27 official fee table](https://www.kluniversity.in/sships3.aspx) lists Civil CTM at ₹72,500 per semester, or ₹1,45,000 for two semesters; EEE/ME are ₹62,500 per semester. Split Civil from that row. Priority: high.

### 4. AP's current status gap can now be closed

`src/lib/counselling-status.ts:26–32` still points to the old portal and describes the current round as unconfirmed. Browser-rendered content at the [Common Admissions Portal](https://cap.apcfss.in/) now confirms final-phase MPC allotment and an extension of online self-joining/college reporting through **2 September 2026**. That deadline has passed. The notice was read in the portal's Important Notice dialog; plain HTTP extraction returns only a JavaScript shell.

Update the current-status link and summary. Do not replace historical first-phase dates with these final-phase dates or infer that applications are presently open. Priority: high.

### 5. Thirty profile summaries override the verified latest cutoff with undated values

`src/app/colleges/[slug]/CollegeDetail.tsx:61` prioritises `c.cutoff.cse`. Its About text at approximately line 234 then calls the result the most recent counselling cycle. Thirty Telangana profiles have a nonzero summary that differs from their verified 2025 final OC boys value, including:

| College | Preferred undated summary | Verified 2025 final |
| --- | ---: | ---: |
| ACEG | 28,981 | 23,801 |
| CBIT | 2,912 | 2,053 |
| BVRI | 10,772 | 7,680 |
| CVRH | 8,110 | 6,590 |
| GRRR | 6,779 | 4,184 |

These are not necessarily incorrect numbers for some other year; their current-cycle attribution is unsupported. Use an explicit year/phase/category/gender record for the summary and its label. All 30 differences are recorded in `fact-gaps-2024-onward/summary-cutoff-conflicts.json`. [Official source](https://tgeapcetd.nic.in/files/TGEAPCET_2025_FINALPHASE_LASTRANKS.pdf). Priority: high.

### 6. The 2025 first/second-phase tables omit 704 official rank cells

Downloaded and independently parsed both full official statements:

| Statement | Official numeric cells | Missing locally | Existing values that disagree |
| --- | ---: | ---: | ---: |
| [First phase](https://tgeapcetd.nic.in/files/TGEAPCET_2025_LASTRANKS_FirstPhase.pdf) | 19,734 | 352 | 0 |
| [Second phase](https://tgeapcetd.nic.in/files/TGEAPCET_2025_LASTRANKS_SecondPhase.pdf) | 20,141 | 352 | 0 |

The final-phase correction from the earlier pass did not fill these separate phase datasets. The 39,171 existing numeric values checked match. Missing cells and source hashes are in `fact-gaps-2024-onward/tg-2025-phase-comparison.json`. Import with the exact year and phase, preserving missing boys categories in women-only institutions. Priority: medium.

## Significant unresolved source/representation gaps

### 7. Anurag's uniform 2026–27 fee conflicts with its cited page

`src/lib/university-courses.ts:364` and following rows state ₹2,85,000 for all B.Tech specialisations. The [cited university page](https://anurag.edu.in/tuition-fee/) instead distinguishes existing AGI intake (₹1,35,000) from new/additional B.Tech intake (₹3,25,000, plus an honours/minor charge). Its BBA is ₹1,50,000 and four years; the local entry is ₹1,60,000 and three years. The page does not clearly identify its academic year. The earlier G.O.22/court-order conflict also remains.

This is a confirmed conflict between sources, **not** enough evidence to declare a single corrected payable 2026–27 fee. Obtain an intake/quota-specific dated notice. Priority: high.

### 8. AP 2024 has no separately identifiable girls' columns

The AP 2024 table contains **273 codes, 1,476 branch rows and 12,644 category cells**, but zero `_G` keys. Its header says girls' values can occupy base keys where no boys were admitted and regional rows were collapsed. Meanwhile `categories.ts` defines base keys as boys and returns no rank when girls-specific data is missing. The stored reference README also records unresolved source-year/mapping concerns for a secondary-source import.

The full original 2024 statement with gender and regional columns is needed. Do not invent girls' values by falling back to boys or certify the whole table as accurately gender-labelled. This is a coverage/provenance defect, not a finding that all 12,644 numeric values are false. Priority: high.

### 9. Accreditation represents missing verification as a negative fact

There are **66 nonempty NAAC grades**, **34 true NBA flags** and **815 false NBA flags**. The schema has no validity period, programme-level NBA scope or per-claim source. `CollegeDetail.tsx:200–201` renders missing grades as “Not rated” and false NBA as “No”. Neither follows from missing evidence. Use “Not verified” for unknowns; only assert expiry/non-accreditation with evidence. Current accreditation needs expiry dates and programme coverage, not just a publication-year filter. Priority: medium.

### 10. Ninety profile placement headlines have no reporting year

Ninety profiles contain a positive average, highest package or recruiter count. The master schema stores no year, cohort, source, or average-versus-median provenance for these values. `CollegeDetail.tsx:229` still calls them “recent”, even though the placement tab warns of limited verification. A general warning does not establish that these are 2024-or-later outcomes. Require a dated source before describing them as recent. No pre-2024 placement figures were rechecked. Priority: high.

### 11. Scholarship units and eligibility need per-table evidence

There are **206 scholarship slabs in 46 tables for 18 college records**. In KL's records, ₹5,000 reductions are labelled “per year”, while the [official table](https://www.kluniversity.in/sships3.aspx) applies the reduction to semester prices. It also has a 100% header but dashes in the relevant course cells, so a blanket 100% award is not substantiated by the displayed course row. Confirm award applicability and renewal conditions; do not resolve contradictory headers by assumption. Priority: medium.

### 12. Current-year labels are broader than the evidence

The 32 university datasets contain **391 course rows**, but a single year label covers each entire university. That does not establish every postgraduate fee or course offering for 2026–27. Fees also lack structured separation of annual tuition, one-time deposits and optional charges. VIT-AP, for example, stores ₹1,98,000 as recurring annual tuition while its own data comment describes ₹1,95,000 tuition plus ₹3,000 caution deposit; fresh campus-specific evidence is needed before correcting it.

The entrance-exam dataset contains 28 records and 68 phase entries, with no per-phase verification date or source. Historical labels reduce immediate risk but do not validate dates or eligibility. Priority: medium.

## Scope status

- TG 2025 final: 19,954 numeric cells already reconciled in the previous pass.
- TG 2025 first/second phases: independently checked this pass; 704 omissions identified.
- TG 2024: 271 codes / 19,899 cells inventoried; fresh full official reconciliation outstanding.
- AP 2024: source, gender and regional mapping unresolved as above.
- AP 2025/2026 and TG 2026 cutoff records: absent locally. Absence does not establish whether an official statement has been published.
- Confirmed positive fee checks: IIIT's single-degree 2026–27 B.Tech tuition is ₹5 lakh/year ([official page](https://ugadmissions.iiit.ac.in/fee-jee-spec/)); KL's published CSE amounts match the stored semester/term annualisation. These confirmations do not certify other rows in those universities.
- Pre-2024 data is outside this pass. Undated claims remain in scope when the UI presents them as current.

Recommended repair order: current AP notice and IIIT/KL confirmed errors; cutoff-summary selection; missing 2025 phase cells; dated accreditation/placement evidence; AP 2024 reconstruction; remaining fee and scholarship rows. Source conflicts should remain flagged until a dated authoritative record resolves them.

## Repair status — 5 September 2026

- **Fixed (1–6):** IIIT postgraduate annual tuition and M.Tech specialisations; CLD qualification/duration; KL Civil M.Tech tuition; AP final-phase reporting status/link; dated cutoff summary selection in profile cards, About text and FAQs; all 704 missing first/second-phase cells.
- **Mitigated (7–10):** Anurag's conflicting fee source is flagged on its fee page. AP 2024 has a prominent gender/region warning and is excluded from the summary resolver until mapping is verified. Unknown accreditation now says “Not verified”; recorded accreditation validity and placement years are explicitly unverified. Undated cutoff summaries no longer populate a year/category/gender table.
- **Partially fixed (11):** Vijayawada's fixed merit concessions use semester units, and renewal timing follows the official second-year rule. Unsubstantiated 100% awards now require confirmation. Hyderabad's concession period and campus-specific bands remain unverified; annual special-category concessions are preserved.
- **Partially fixed (12):** Corrected PG rows carry individual official-source URLs, academic years and review dates. University reference years no longer imply every course is verified. A structured deposit breakdown and the remaining course/exam evidence still need research. The [VIT-AP fee page](https://www.vitap.ac.in/fees-and-scholarships) was rechecked but its extracted B.Tech section did not expose a usable fee table; no numeric correction was inferred.

Still outstanding: original AP 2024 gender/region reconstruction, remaining AP/TG 2024+ cutoff coverage, dated accreditation and placement evidence, Anurag intake-specific fees, remaining fee/scholarship/exam verification. No pre-2024 numeric datasets were edited. These changes do not certify the entire codebase as fact-checked.

Validation: all 48 tests pass, with typecheck and lint. Independent re-extraction of both official 2025 phase PDFs after the repair matched all 39,875 numeric cells with zero missing values and zero disagreements; see `fact-gaps-2024-onward/tg-2025-phase-verification-after.json`.

Production validation: `npm run build -- --webpack` passed (5,242 generated pages). Generated CBIT and Anurag HTML confirms the corrected dated summary and fee-conflict notice. Default Turbopack was blocked by the local worker port restriction, including on the elevated retry; the deployment build configuration was not changed.
