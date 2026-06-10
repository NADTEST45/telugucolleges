import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const url = `${SITE_URL}/eapcet/ap-results-2026`;

// Bump this (and the update log below) whenever the page content changes.
const LAST_UPDATED = "2026-06-10";

export const metadata: Metadata = {
  title: "AP EAPCET Results 2026 — Live Updates: New Date, Why Delayed, Rank Card Steps",
  description:
    "AP EAPCET 2026 results postponed: rank cards now expected June 18–21 after Inter supplementary results. Why the delay happened, how to download your rank card at cets.apsche.ap.gov.in, and what to do next.",
  alternates: { canonical: url },
  openGraph: {
    title: "AP EAPCET Results 2026 — Live Updates: New Date & Rank Card Steps",
    description:
      "Results postponed to June 18–21, 2026. Reason for the delay, rank card download steps, and counselling next steps.",
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
    title: "AP EAPCET Results 2026 — Live Updates",
    description:
      "Results postponed to June 18–21, 2026. Why, and how to download your rank card.",
  },
};

/*
 * Dated update log — newest first. Append a new entry each time the
 * situation changes (result declared, official date confirmed, etc.).
 * Each entry also feeds the LiveBlogPosting JSON-LD below.
 */
const UPDATES: { date: string; time: string; title: string; body: string }[] = [
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
    q: "Why are AP EAPCET 2026 results delayed?",
    a: "The final EAPCET rank is computed with 75% weightage to the EAPCET score and 25% weightage to Intermediate (Class 12) marks. Around 1.5 lakh students wrote the Inter second-year supplementary/improvement exams in 2026 — including nearly 1 lakh for the Mathematics paper alone — so APSCHE is waiting for those results before computing final ranks. Declaring ranks earlier would make them provisional for lakhs of candidates.",
  },
  {
    q: "What is the new expected date for AP EAPCET 2026 results?",
    a: "Rank cards are expected between June 18 and June 21, 2026, after the Intermediate supplementary results are declared (expected around June 18). APSCHE has not yet notified an exact official date — treat all dates as expected until the official announcement on cets.apsche.ap.gov.in.",
  },
  {
    q: "Where do I check my AP EAPCET 2026 result and download the rank card?",
    a: "On the official APSCHE CETs portal: cets.apsche.ap.gov.in. Go to EAPCET 2026 → Results / Rank Card, log in with your hall ticket number and date of birth (or registration number), and download the PDF rank card. Keep printed copies — you will need the rank card at every counselling step.",
  },
  {
    q: "What details does the AP EAPCET rank card contain?",
    a: "Your combined final rank, EAPCET marks and normalized score, Intermediate weightage marks, category (local area, caste category, gender) details, and qualification status. Verify every field immediately — errors must be raised with APSCHE before counselling begins.",
  },
  {
    q: "What should I do while waiting for the result?",
    a: "Two things: (1) keep your counselling documents ready — income certificate, caste certificate, study certificates and Transfer Certificate take time to obtain; (2) build your college priority list now using your expected rank, so you can enter web options quickly when counselling opens.",
  },
  {
    q: "When will AP EAPCET 2026 counselling start?",
    a: "The counselling schedule is announced only after results. Based on the result window of June 18–21, round-1 registration is expected to begin in late June or early July 2026 on eapcet-sche.aptonline.in. Telangana's TG EAPCET counselling schedule is already out, with phase 1 starting June 19, 2026.",
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
    headline: "AP EAPCET Results 2026 — Live Updates: New Date, Delay Reason, Rank Card Steps",
    description:
      "Live tracking of AP EAPCET 2026 result declaration: postponement, new expected date, and rank card download steps.",
    url,
    datePublished: "2026-06-01T10:00:00+05:30",
    dateModified: `${LAST_UPDATED}T09:00:00+05:30`,
    coverageStartTime: "2026-06-01T00:00:00+05:30",
    coverageEndTime: "2026-06-30T23:59:59+05:30",
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
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[buildBreadcrumbJsonLd(), buildLiveBlogJsonLd(), buildFaqJsonLd()]} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">AP Results 2026 — Live Updates</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AP EAPCET Results 2026 — Live Updates
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Last updated: <strong>{formatDate(LAST_UPDATED)}</strong>. Results are{" "}
        <strong>postponed</strong> — rank cards are now expected{" "}
        <strong>June 18–21, 2026</strong> on{" "}
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
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-amber-50 border border-amber-200">
        <h2 className="text-base sm:text-lg font-bold text-amber-900 mb-1">
          Current status: Postponed — expected June 18–21
        </h2>
        <p className="text-sm text-amber-900 leading-relaxed">
          APSCHE is holding the result until Intermediate supplementary/improvement
          exam evaluation finishes, because Inter marks carry{" "}
          <strong>25% weightage</strong> in your final EAPCET rank. About 1.5 lakh
          students wrote improvement exams this year. No exact official date has
          been notified yet.
        </p>
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

      {/* Why delayed */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Why the result is delayed — the 25% weightage rule</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Your AP EAPCET rank is not just your entrance exam score. The final rank is
          computed as <strong>75% EAPCET marks + 25% Intermediate (Class 12) group
          subject marks</strong>. Roughly 1.5 lakh candidates appeared for the Inter
          second-year supplementary and improvement exams in May–June 2026 — including
          close to 1 lakh for Mathematics alone. Until those marks are finalised,
          APSCHE cannot compute final ranks for a large share of candidates, so the
          government chose to wait rather than publish provisional ranks.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Intermediate supplementary results are expected around <strong>June 18,
          2026</strong>, with EAPCET rank cards following within days — hence the
          June 18–21 window.
        </p>
      </section>

      {/* Rank card steps */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">How to download your rank card (when released)</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>
            Open the official APSCHE CETs portal:{" "}
            <a
              href="https://cets.apsche.ap.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              cets.apsche.ap.gov.in
            </a>{" "}
            and select <strong>EAPCET 2026</strong>.
          </li>
          <li>Click the <strong>Results / Rank Card download</strong> link.</li>
          <li>
            Log in with your <strong>hall ticket number</strong> and{" "}
            <strong>date of birth</strong> (or registration number).
          </li>
          <li>Your result opens with the combined final rank. Click <strong>Download Rank Card</strong>.</li>
          <li>
            Save the PDF and take <strong>2–3 printouts</strong> — the rank card is
            required at certificate verification, web options and college reporting.
          </li>
          <li>
            Verify name, hall ticket number, category, local area and marks
            immediately. Report any mismatch to APSCHE helplines before counselling.
          </li>
        </ol>
        <p className="text-xs text-gray-500 mt-3">
          The portal slows down in the first hours after release — if it doesn&rsquo;t
          load, retry after some time instead of re-submitting repeatedly.
        </p>
      </section>

      {/* Predictor funnel */}
      <section
        className="rounded-xl sm:rounded-2xl mb-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold text-white mb-1">
            Don&rsquo;t wait for the rank card to plan
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            Enter your expected rank in our free predictor to see which B.Tech
            colleges matched that rank in official APSCHE counselling — category and
            gender-wise. Have your web options list ready before counselling opens.
          </p>
          <Link
            href="/eapcet"
            className="inline-block bg-white text-brand font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            Open the EAPCET College Predictor →
          </Link>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">After the result: counselling roadmap</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          AP EAPCET counselling runs on{" "}
          <a
            href="https://eapcet-sche.aptonline.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            eapcet-sche.aptonline.in
          </a>{" "}
          — registration and fee payment (₹1,200 OC/BC, ₹600 SC/ST), certificate
          verification, web options entry, seat allotment, and self-reporting. The
          schedule is notified after results; round 1 is expected from late June /
          early July 2026.
        </p>
        <ul className="text-sm text-gray-700 space-y-1.5">
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
        Dates marked &ldquo;expected&rdquo; are based on education department
        statements reported in the press and are not official until APSCHE notifies
        them on cets.apsche.ap.gov.in. Always confirm on the official portal before
        acting.
      </p>
    </main>
  );
}
