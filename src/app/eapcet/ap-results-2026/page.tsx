import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import LeadCapture from "@/components/LeadCapture";
import {
  AP_EAPCET_2026_RESULT,
  AP_EAPCET_2026_STATS,
  AP_EAPCET_2026_TOPPERS_AGRI,
  AP_EAPCET_2026_TOTAL_QUALIFIED,
} from "@/lib/ap-result-status";
import {
  AP_COUNSELLING_PHASES,
  AP_ICS_CONFIG,
  AP_PHASE_1_MILESTONES,
} from "@/lib/ap-counselling-schedule";
import { AddMilestoneButton, AddPhaseButton } from "@/components/AddToCalendar";

const url = `${SITE_URL}/eapcet/ap-results-2026`;
const teUrl = `${SITE_URL}/eapcet/ap-results-2026-telugu`;

// Bump this (and the update log below) whenever the page content changes.
const LAST_UPDATED = "2026-09-05";

const S = AP_EAPCET_2026_STATS;
const inr = (n: number) => n.toLocaleString("en-IN");

export const metadata: Metadata = {
  title: "AP EAPCET Results 2026 Declared — Download Rank Card, Toppers, What's Next",
  description:
    "AP EAPCET 2026 results were declared on July 1, 2026. 1,82,317 qualified in Engineering (70.52%) and 63,546 in Agriculture & Pharmacy (89.59%). Download your rank card at cets.apsche.ap.gov.in, see the state toppers, and what to do before counselling.",
  alternates: {
    canonical: url,
    languages: {
      "en-IN": url,
      "te-IN": teUrl,
      "x-default": url,
    },
  },
  openGraph: {
    title: "AP EAPCET Results 2026 Declared — Rank Card, Toppers, Next Steps",
    description:
      "Declared July 1, 2026. 1,82,317 qualified in Engineering, 63,546 in Agriculture & Pharmacy. Rank card download steps, state toppers, and counselling next steps.",
    url,
    siteName: "TeluguColleges.com",
    type: "article",
    locale: "en_IN",
    publishedTime: "2026-06-10T09:00:00+05:30",
    modifiedTime: `${LAST_UPDATED}T09:00:00+05:30`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AP EAPCET Results 2026 Declared",
    description:
      "Declared July 1, 2026 — download your rank card, see the state toppers, and what's next for counselling.",
  },
};

/*
 * Dated update log — newest first. Append a new entry each time the
 * situation changes (result declared, official date confirmed, etc.).
 * Each entry also feeds the LiveBlogPosting JSON-LD below.
 */
const UPDATES: { date: string; time: string; title: string; body: string }[] = [
  {
    date: "2026-07-17",
    time: "09:00",
    title: "Counselling schedule notified — registration opens July 20",
    body: "APSCHE has officially notified the AP EAPCET 2026 first-phase counselling schedule. The admission committee met on July 15, the notification was issued on July 16, and it was published in newspapers today, July 17. Registration and processing-fee payment run July 20–29; verification of uploaded certificates at Help Line Centres runs July 22–31 (online); web options entry is open July 25–31, with a single day — August 1 — to change options. Seat allotments are released on August 6, self-joining and reporting at the allotted college runs August 7–13, and classes begin August 10. Register early: the portal is slowest on the closing days, and certificate verification has to finish before your options are considered.",
  },
  {
    date: "2026-07-01",
    time: "15:00",
    title: "Declared — AP EAPCET 2026 rank cards are live",
    body: "APSCHE, through JNTU Kakinada, declared the AP EAPCET 2026 result today at 3:00 PM. In the Engineering stream, 2,76,572 registered and 2,58,545 appeared, of whom 1,82,317 qualified — a 70.52% pass rate. In Agriculture & Pharmacy, 63,546 qualified (89.59%). Sambangi Jaswanth Naidu of Vizianagaram topped the Agriculture & Pharmacy stream with a combined score of 92.5398, followed by Kudumula Venkata Mahant Akshaj Reddy at 91.8114. Rank cards are downloadable now at cets.apsche.ap.gov.in using your hall ticket number and date of birth. Counselling registration is expected to open within about a week.",
  },
  {
    date: "2026-06-25",
    time: "10:00",
    title: "Still awaited as of June 25 — end-of-June window now in focus",
    body: "AP EAPCET 2026 rank cards are still not released as of June 25, and APSCHE has still not notified an official date. The June 22–23 window floated by some press reports passed without a release; officials are now waiting on CBSE revised (re-evaluation) Class XII results before locking ranks, since Intermediate marks carry 25% weightage in the EAPCET rank formula. The latest press reporting points to release by the end of June 2026. Meanwhile in Telangana, TG EAPCET counselling is already live — web options opened June 25 — so AP candidates should use the wait to finalise documents and a draft preference list. We will publish the rank card link here the moment it goes live at cets.apsche.ap.gov.in.",
  },
  {
    date: "2026-06-21",
    time: "09:00",
    title: "Still awaited as of June 21 — rank cards can drop any time now",
    body: "As of the morning of June 21, AP EAPCET 2026 rank cards have still not been released and APSCHE has not notified an official date. With the Intermediate supplementary/improvement results out since June 18, the final 75% EAPCET + 25% Inter rank computation can be completed — so the result can go live any time now, with press and education-department sources still pointing to the June 22–23 window. Note: some result-aggregator sites wrongly list the result as 'declared June 18' — that was the Intermediate supplementary result, not EAPCET. Keep your hall ticket number and date of birth ready; we will publish the rank card link here the moment it goes live at cets.apsche.ap.gov.in.",
  },
  {
    date: "2026-06-20",
    time: "09:00",
    title: "Result still awaited — now expected around June 22–23",
    body: "AP EAPCET 2026 rank cards are still not out as of June 20. The Intermediate supplementary/improvement results — the dependency that held up the final ranks — were declared on June 18, so the 75% EAPCET + 25% Inter rank computation can now be completed. APSCHE has not notified an official date, but education-department and press sources now point to June 22–23, 2026. We will publish the rank card link here the moment it goes live at cets.apsche.ap.gov.in.",
  },
  {
    date: "2026-06-17",
    time: "09:00",
    title: "Still pending — result window June 18–21",
    body: "As of June 17, AP EAPCET 2026 rank cards have not yet been released. APSCHE has still not notified an official date, but the result is expected any time in the June 18–21 window now that Intermediate supplementary/improvement results are out. Keep your hall ticket and date of birth ready — we will update this page and publish the rank card link the moment the result goes live at cets.apsche.ap.gov.in.",
  },
  {
    date: "2026-06-10",
    time: "09:00",
    title: "Results now expected June 18–21",
    body: "Education department sources indicate AP EAPCET 2026 rank cards will be released between June 18 and June 21, once Intermediate supplementary/improvement exam evaluation is complete. No official date has been notified by APSCHE yet — we will update this page the moment it is.",
  },
  {
    date: "2026-06-01",
    time: "10:00",
    title: "Results postponed past the original June 1 window",
    body: "AP EAPCET 2026 results, originally expected around June 1, have been put on hold. APSCHE is waiting for Intermediate supplementary and improvement exam results because Inter marks carry 25% weightage in the final EAPCET rank calculation.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "When were AP EAPCET 2026 results declared?",
    a: "APSCHE, through JNTU Kakinada, declared the AP EAPCET 2026 result on July 1, 2026 at 3:00 PM. In the Engineering stream, 1,82,317 of 2,58,545 candidates who appeared qualified (a 70.52% pass rate); in Agriculture & Pharmacy, 63,546 qualified (89.59%). The result had earlier been delayed past its original June 1 date because the final rank blends 75% EAPCET score with 25% Intermediate (Class 12) marks, and APSCHE waited for Inter supplementary and CBSE revised results to be finalised first.",
  },
  {
    q: "Where do I check my AP EAPCET 2026 result and download the rank card?",
    a: "On the official APSCHE CETs portal: cets.apsche.ap.gov.in. Go to EAPCET 2026 → Results / Rank Card, log in with your hall ticket number and date of birth (or registration number), and download the PDF rank card. Keep printed copies — you will need the rank card at every counselling step.",
  },
  {
    q: "Who topped AP EAPCET 2026?",
    a: "In the Agriculture & Pharmacy stream — the toppers APSCHE announced at the result press meet — Sambangi Jaswanth Naidu of Vizianagaram secured the state 1st rank with a combined score of 92.5398, followed by Kudumula Venkata Mahant Akshaj Reddy (91.8114) in 2nd and Kondreddy Haricadevi Sri Anuhya (Krishna) in 3rd. Individual engineering-stream toppers were not part of the official topper announcement.",
  },
  {
    q: "What details does the AP EAPCET rank card contain?",
    a: "Your combined final rank, EAPCET marks and normalized score, Intermediate weightage marks, category (local area, caste category, gender) details, and qualification status. Verify every field immediately — errors must be raised with APSCHE before counselling begins.",
  },
  {
    q: "What should I do now that the result is out?",
    a: "Three things: (1) download and save your rank card immediately; (2) keep your counselling documents ready — income certificate, caste certificate, study certificates and Transfer Certificate; (3) build your college priority list now using your actual rank, so you can enter web options quickly once counselling opens. Our free EAPCET predictor shows which colleges matched your rank in official counselling.",
  },
  {
    q: "When will AP EAPCET 2026 counselling start?",
    a: "Current AP counselling dates could not be confirmed during our September 5 review. Check eapcet-sche.aptonline.in for the active round, web-options dates and reporting deadline. The results portal and the counselling portal serve different purposes.",
  },
];

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "AP EAPCET Results 2026 — Live Updates", item: url },
    ],
  };
}

/*
 * LiveBlogPosting is the schema Google's "live updates" result treatment
 * looks for (major news sites use it for result-day pages). Each dated
 * entry in UPDATES becomes a liveBlogUpdate BlogPosting.
 */
function buildLiveBlogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    "@id": url,
    headline: "AP EAPCET Results 2026 — Live Updates: Declared, Rank Card, Toppers, Next Steps",
    description:
      "Live tracking of AP EAPCET 2026 result declaration: pass statistics, state toppers, rank card download steps, and counselling next steps.",
    url,
    datePublished: "2026-06-01T10:00:00+05:30",
    dateModified: `${LAST_UPDATED}T09:00:00+05:30`,
    coverageStartTime: "2026-06-01T00:00:00+05:30",
    coverageEndTime: "2026-07-01T23:59:59+05:30",
    author: { "@type": "Organization", name: "TeluguColleges Editorial", url: SITE_URL },
    publisher: { "@type": "Organization", name: "TeluguColleges", url: SITE_URL },
    liveBlogUpdate: UPDATES.map(u => ({
      "@type": "BlogPosting",
      headline: u.title,
      articleBody: u.body,
      datePublished: `${u.date}T${u.time}:00+05:30`,
    })),
  };
}

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ApResults2026Page() {
  const declared = AP_EAPCET_2026_RESULT.declared;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[buildBreadcrumbJsonLd(), buildLiveBlogJsonLd(), buildFaqJsonLd()]} />

      {/* Breadcrumb + language toggle */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <nav className="text-sm text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">AP Results 2026</span>
        </nav>
        <Link
          href="/eapcet/ap-results-2026-telugu"
          hrefLang="te"
          className="text-sm font-medium text-accent border border-accent/30 rounded-full px-3 py-1 hover:bg-accent/5 whitespace-nowrap"
        >
          తెలుగులో చదవండి →
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AP EAPCET Results 2026 — Declared, Download Rank Card
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Last updated: <strong>{formatDate(LAST_UPDATED)}</strong>.{" "}
        {declared ? (
          <>Results are <strong>out</strong> — download your rank card on{" "}</>
        ) : (
          <>
            Results are <strong>still awaited</strong> — rank cards are now expected{" "}
            <strong>by {AP_EAPCET_2026_RESULT.expectedWindow}</strong> on{" "}
          </>
        )}
        <a
          href="https://cets.apsche.ap.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          cets.apsche.ap.gov.in
        </a>
        . This page tracks every official development.
      </p>

      {/* Status banner */}
      {declared ? (
        <section className="rounded-xl mb-6 p-4 sm:p-6 bg-green-50 border border-green-200">
          <h2 className="text-base sm:text-lg font-bold text-green-900 mb-1">
            Results available — confirm the current counselling round
          </h2>
          <p className="text-sm text-green-900 leading-relaxed">
            AP EAPCET 2026 rank cards are now available on cets.apsche.ap.gov.in. Log in
            with your registration number and EAPCET hall ticket number to view your result, then
            check the official counselling portal for the active round and its deadlines.
          </p>
        </section>
      ) : (
        <section className="rounded-xl mb-6 p-4 sm:p-6 bg-amber-50 border border-amber-200">
          <h2 className="text-base sm:text-lg font-bold text-amber-900 mb-1">
            Current status: Awaited — expected by {AP_EAPCET_2026_RESULT.expectedWindow}
          </h2>
          <p className="text-sm text-amber-900 leading-relaxed">
            APSCHE is now waiting on CBSE revised (re-evaluation) Class XII results before
            locking ranks, because Intermediate marks carry{" "}
            <strong>25% weightage</strong> in your final EAPCET rank. The June 22–23 window
            some press reports floated passed without a release. No exact official date has
            been notified yet.
          </p>
        </section>
      )}

      {/* PRIMARY ACTION — check result + predict colleges. On result day this is
          the whole intent of the page, so it sits directly under the status. */}
      {declared && (
        <section className="rounded-xl mb-6 p-4 sm:p-6 bg-white border-2 border-accent/40 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold mb-1">Check your AP EAPCET 2026 result</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Download your official rank card from the APSCHE portal, then see which colleges
            your rank can win before counselling opens.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <a
              href="https://cets.apsche.ap.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center rounded-lg bg-brand text-white px-4 py-3 font-semibold text-sm hover:opacity-95"
            >
              Download rank card
              <span className="text-[11px] font-normal text-blue-100">Official portal · cets.apsche.ap.gov.in</span>
            </a>
            <Link
              href="/eapcet/web-options-generator"
              className="flex flex-col items-center justify-center text-center rounded-lg border-2 border-accent text-accent px-4 py-3 font-semibold text-sm hover:bg-accent/5"
            >
              Predict my colleges
              <span className="text-[11px] font-normal text-gray-500">Free · category &amp; gender-wise cutoffs</span>
            </Link>
          </div>
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-800 select-none">
              How to download your rank card (6 steps)
            </summary>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 leading-relaxed mt-3">
              <li>
                Open <a href="https://cets.apsche.ap.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent underline">cets.apsche.ap.gov.in</a>{" "}
                and select <strong>EAPCET 2026</strong>.
              </li>
              <li>Click the <strong>Results / Rank Card download</strong> link.</li>
              <li>Enter your <strong>registration number</strong> and <strong>EAPCET hall ticket number</strong>.</li>
              <li>Your result opens with the combined final rank. Click <strong>Download Rank Card</strong>.</li>
              <li>Save the PDF and take <strong>2–3 printouts</strong> — the rank card is required at certificate verification, web options and college reporting.</li>
              <li>Verify name, hall ticket number, category, local area and marks immediately. Report any mismatch to APSCHE helplines before counselling.</li>
            </ol>
            <p className="text-xs text-gray-500 mt-3">
              The portal slows down in the first hours after release — if it doesn&rsquo;t
              load, retry after some time instead of re-submitting repeatedly.
            </p>
          </details>
        </section>
      )}

      {/* Result-day alert opt-in — only while awaited (a refreshing visitor is
          the highest-intent lead we get all season). */}
      {!declared && (
        <section className="rounded-xl mb-6 p-4 sm:p-5 bg-white border border-gray-200 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">
            Get an instant alert when the result drops
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Stop refreshing. Drop your WhatsApp number and we&rsquo;ll message you the
            moment AP EAPCET 2026 rank cards go live at cets.apsche.ap.gov.in — plus the
            counselling dates that follow.
          </p>
          <LeadCapture
            examState="Andhra Pradesh"
            source="ap-result-alert"
            heading="WhatsApp me when AP EAPCET results are out"
            subtext="One free alert the moment rank cards go live, then the counselling schedule. No spam — counselling season only."
            buttonLabel="Alert me"
            doneLabel="✓ Done — we'll WhatsApp you the moment AP EAPCET 2026 rank cards go live."
          />
        </section>
      )}

      {/* Statistics — scannable scorecard, split by stream so the numbers are
          unambiguous. */}
      {declared && (
        <section className="mb-6">
          <h2 className="text-base sm:text-lg font-bold mb-3">AP EAPCET 2026 result statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-brand">{inr(S.engAppeared)}</div>
              <div className="text-xs text-gray-500 mt-1">Engineering appeared</div>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-brand">{inr(S.engQualified)}</div>
              <div className="text-xs text-gray-500 mt-1">Engineering qualified · {S.engPassPct}%</div>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-brand">{inr(S.agriQualified)}</div>
              <div className="text-xs text-gray-500 mt-1">Agri &amp; Pharmacy qualified · {S.agriPassPct}%</div>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-brand">{inr(AP_EAPCET_2026_TOTAL_QUALIFIED)}</div>
              <div className="text-xs text-gray-500 mt-1">Total qualified (both streams)</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Engineering: {inr(S.engRegistered)} registered, {inr(S.engAppeared)} appeared,{" "}
            {inr(S.engQualified)} qualified ({S.engPassPct}% pass). Agriculture &amp; Pharmacy:{" "}
            {inr(S.agriQualified)} qualified ({S.agriPassPct}% pass). Source: APSCHE, July 1, 2026.
          </p>
        </section>
      )}

      {/* State toppers */}
      {declared && (
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-base sm:text-lg font-bold mb-1">
            AP EAPCET 2026 state toppers — Agriculture &amp; Pharmacy
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            The top rankers APSCHE announced at the result press meet. Combined scores were
            published for the top two. (Individual engineering-stream toppers were not part
            of the official topper announcement.)
          </p>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-3 font-semibold">Rank</th>
                  <th className="py-2 pr-3 font-semibold">Name</th>
                  <th className="py-2 pr-3 font-semibold">District</th>
                  <th className="py-2 pr-1 font-semibold text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {AP_EAPCET_2026_TOPPERS_AGRI.map(t => (
                  <tr key={t.rank} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-3 font-semibold text-brand">{t.rank}</td>
                    <td className="py-2 pr-3 text-gray-800">{t.name}</td>
                    <td className="py-2 pr-3 text-gray-600">{t.district}</td>
                    <td className="py-2 pr-1 text-right text-gray-600 tabular-nums">
                      {t.score ? t.score.toFixed(4) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Predictor funnel */}
      <section
        className="rounded-xl sm:rounded-2xl mb-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold text-white mb-1">
            Got your rank? See your colleges now
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            Enter your rank in our free predictor to see which B.Tech colleges matched that
            rank in official APSCHE counselling — category and gender-wise. Have your web
            options list ready before counselling opens.
          </p>
          <Link
            href="/eapcet"
            className="inline-block bg-white text-brand font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            Open the EAPCET College Predictor →
          </Link>
        </div>
      </section>

      {/* WhatsApp counselling alerts (declared state) */}
      {declared && (
        <section className="rounded-xl mb-6 p-4 sm:p-5 bg-white border border-gray-200 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">
            Get counselling reminders on WhatsApp
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The schedule is out and the deadlines are tight. Drop your WhatsApp number and
            we&rsquo;ll remind you before registration closes (July 29), before web options
            close (July 31), and when the August 6 seat allotment is released.
          </p>
          <LeadCapture
            examState="Andhra Pradesh"
            source="ap-result-alert"
            heading="WhatsApp me the AP EAPCET counselling reminders"
            subtext="Reminders before the registration and web-options deadlines, and an alert when seat allotment drops. No spam — counselling season only."
            buttonLabel="Notify me"
            doneLabel="✓ Done — we'll WhatsApp you the AP EAPCET 2026 counselling deadline reminders."
          />
        </section>
      )}

      {/* Official counselling schedule */}
      <section id="counselling-schedule" className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-base sm:text-lg font-bold">
            AP EAPCET 2026 counselling schedule — first phase
          </h2>
          <AddPhaseButton initialNow={Date.now()}
            milestones={AP_PHASE_1_MILESTONES}
            phaseTag={AP_COUNSELLING_PHASES[0].tag}
            phaseLabel={AP_COUNSELLING_PHASES[0].title}
            config={AP_ICS_CONFIG}
            filePrefix="ap-eapcet"
          />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          APSCHE has officially notified the first-phase schedule. Counselling runs on{" "}
          <a
            href="https://eapcet-sche.aptonline.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            eapcet-sche.aptonline.in
          </a>{" "}
          — registration and fee payment (₹1,200 OC/BC, ₹600 SC/ST), certificate
          verification, web options entry, seat allotment, and self-reporting.
        </p>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-3 font-semibold">Event</th>
                <th className="py-2 pr-3 font-semibold whitespace-nowrap">Dates</th>
                <th className="py-2 pr-3 font-semibold text-right whitespace-nowrap">Days</th>
                <th className="py-2 w-9">
                  <span className="sr-only">Add to calendar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {AP_PHASE_1_MILESTONES.map(m => (
                <tr key={m.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 pr-3 text-gray-700">{m.event}</td>
                  <td className="py-2.5 pr-3 font-medium whitespace-nowrap">{m.dates}</td>
                  <td className="py-2.5 pr-3 text-right text-gray-500">{m.days ?? "—"}</td>
                  <td className="py-2.5">
                    <AddMilestoneButton initialNow={Date.now()}
                      milestone={m}
                      phaseTag={AP_COUNSELLING_PHASES[0].tag}
                      config={AP_ICS_CONFIG}
                      filePrefix="ap-eapcet"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
          →{" "}
          <Link href="/eapcet/ap-counselling-dates-2026" className="text-accent underline font-medium">
            Full AP EAPCET counselling dates 2026 page
          </Link>{" "}
          — fees, documents, deadline reminders and FAQs.
        </p>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Source: APSCHE APEAPCET-2026 admissions counselling schedule (first phase).
          Admission committee meeting July 15, 2026; notification issued July 16, 2026;
          published in newspapers July 17, 2026. This records the July notification; check the official portal for later phases.
          Always confirm against{" "}
          <a
            href="https://cets.apsche.ap.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            cets.apsche.ap.gov.in
          </a>
          .
        </p>
      </section>

      {/* What happens next */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">After the result: counselling roadmap</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          The first-phase window opened <strong>July 20</strong> and its published dates have passed. For any current round, confirm the portal requirements: download
          your rank card, get your certificates uploaded and verified (July 22–31 — it must
          finish before your options count), and build a long priority list of college+branch
          options ready to enter from July 25.
        </p>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>
            → <Link href="/eapcet/ap-counselling-dates-2026" className="text-accent underline">AP EAPCET counselling dates 2026 — full official schedule</Link>
          </li>
          <li>
            → <Link href="/eapcet/ap-cutoff-2026" className="text-accent underline">AP EAPCET 2026 cutoff — expected branch-wise closing ranks</Link>
          </li>
          <li>
            → <Link href="/eapcet/ap-web-options" className="text-accent underline">AP EAPCET web options entry — step-by-step guide</Link>
          </li>
          <li>
            → <Link href="/eapcet/certificate-verification-documents" className="text-accent underline">Certificate verification — full documents list</Link>
          </li>
          <li>
            → <Link href="/eapcet/ts-counselling-dates-2026" className="text-accent underline">TS (TG) EAPCET counselling dates 2026 — phase-wise schedule</Link>
          </li>
        </ul>
      </section>

      {/* Update log */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-4">Updates</h2>
        <ol className="space-y-4">
          {UPDATES.map(u => (
            <li key={`${u.date}-${u.time}`} className="border-l-2 border-accent pl-4">
              <div className="text-xs text-gray-500 mb-0.5">
                {formatDate(u.date)} · {u.time} IST
              </div>
              <div className="font-semibold text-sm sm:text-base">{u.title}</div>
              <p className="text-sm text-gray-600 leading-relaxed">{u.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why it was delayed */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Why the result was delayed — the 25% weightage rule</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Your AP EAPCET rank is not just your entrance exam score. The final rank is
          computed as <strong>75% EAPCET marks + 25% Intermediate (Class 12) group
          subject marks</strong>. Roughly 1.5 lakh candidates appeared for the Inter
          second-year supplementary and improvement exams in May–June 2026 — including
          close to 1 lakh for Mathematics alone — so APSCHE waited for those marks,
          and later for CBSE revised (re-evaluation) Class XII marks, before computing
          final ranks rather than publish provisional ones.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          AP Intermediate supplementary results were declared on <strong>June 18,
          2026</strong>; with all inputs finalised, APSCHE declared the AP EAPCET 2026
          result on <strong>July 1, 2026</strong>.
        </p>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQS.map(f => (
            <div key={f.q}>
              <h3 className="font-semibold text-sm sm:text-base mb-1">{f.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500 leading-relaxed">
        Statistics and toppers are as declared by APSCHE on July 1, 2026. Dates marked
        &ldquo;expected&rdquo; are based on education department statements reported in the
        press and are not official until APSCHE notifies them on cets.apsche.ap.gov.in.
        Always confirm on the official portal before acting.
      </p>
    </main>
  );
}
