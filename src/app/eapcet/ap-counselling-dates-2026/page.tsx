import { getCounsellingStatus } from "@/lib/counselling-status";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { type CounsellingPhase } from "@/lib/counselling-schedule";
import {
  AP_COUNSELLING_PHASES,
  AP_COUNSELLING_PORTAL,
  AP_ICS_CONFIG,
  AP_NOTIFICATION_TRAIL,
  type ApCounsellingMilestone,
} from "@/lib/ap-counselling-schedule";
import { AddMilestoneButton, AddPhaseButton } from "@/components/AddToCalendar";

const url = `${SITE_URL}/eapcet/ap-counselling-dates-2026`;

const LAST_UPDATED = "2026-07-17";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AP EAPCET Counselling Dates 2026 — Official Schedule (Registration July 20) | TeluguColleges",
  description:
    "Official AP EAPCET 2026 counselling schedule: registration July 20–29, certificate verification July 22–31, web options July 25–31, change of options August 1, seat allotment August 6, reporting August 7–13. Fees, documents and deadlines.",
  alternates: { canonical: url },
  openGraph: {
    title: "AP EAPCET Counselling Dates 2026 — Official First-Phase Schedule",
    description:
      "First-phase registration was scheduled for July 20, 2026. Full APSCHE-notified schedule with web options, allotment and reporting dates.",
    url,
    siteName: "TeluguColleges.com",
    type: "article",
    locale: "en_IN",
    publishedTime: "2026-07-17T09:00:00+05:30",
    modifiedTime: `${LAST_UPDATED}T09:00:00+05:30`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AP EAPCET Counselling Dates 2026 — Official Schedule",
    description: "Registration July 20–29, web options July 25–31, seat allotment August 6.",
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "When does AP EAPCET 2026 counselling start?",
    a: "Registration and processing-fee payment run from July 20 to July 29, 2026 on eapcet-sche.aptonline.in. APSCHE notified the first-phase schedule on July 16, 2026 and it was published in newspapers on July 17. Verification of uploaded certificates runs July 22–31 and web options open July 25.",
  },
  {
    q: "When is AP EAPCET 2026 web options entry?",
    a: "July 25 to July 31, 2026, with a dedicated change-of-options day on August 1. Web options open only after you have registered, paid the processing fee, and completed certificate verification.",
  },
  {
    q: "When is the AP EAPCET 2026 seat allotment result?",
    a: "Seat allotments are released on August 6, 2026. Self joining and reporting at the allotted college runs August 7–13, and classes begin August 10, 2026.",
  },
  {
    q: "Is there a mock allotment in AP EAPCET 2026 counselling?",
    a: "No. Unlike TG EAPCET, the AP first phase has no mock seat allotment. You get one change-of-options day on August 1, and the next thing published is the real seat allotment on August 6 — so August 1 is your final chance to fix your priority order.",
  },
  {
    q: "What is the AP EAPCET 2026 counselling fee?",
    a: "The processing fee is ₹1,200 for OC and BC candidates and ₹600 for SC and ST candidates. It must be paid during the July 20–29 registration window before you can proceed to certificate verification and web options.",
  },
  {
    q: "Do I have to visit a Help Line Centre for certificate verification?",
    a: "Verification of uploaded certificates at Help Line Centres runs July 22–31, 2026 and is done online. If your certificates are verified online through web services, you may not need to visit a Help Line Centre in person. Verification must be completed for your web options to be considered.",
  },
  {
    q: "How many phases of AP EAPCET 2026 counselling are there?",
    a: "This page records the first-phase notification from July 2026, with reporting through August 13. Those dates have passed. Check the official portal for later-phase notices; the current window could not be confirmed during our September 5 review.",
  },
  {
    q: "Can I get reminders for the AP EAPCET 2026 counselling deadlines?",
    a: "Yes. Use the calendar icon next to any milestone above to add that deadline to your phone's calendar (Google, Apple or Outlook) — it sets an all-day event with an alert the day before. You can also add every deadline at once with the 'Add all deadlines' button, or enter your number in the alerts box near the top of the page for a WhatsApp ping.",
  },
];

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "AP Counselling Dates 2026", item: url },
    ],
  };
}

function buildArticleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: "AP EAPCET Counselling Dates 2026 — Official First-Phase Schedule",
    description:
      "Complete APSCHE-notified AP EAPCET 2026 first-phase counselling schedule, with fees and document requirements.",
    url,
    datePublished: "2026-07-17T09:00:00+05:30",
    dateModified: `${LAST_UPDATED}T09:00:00+05:30`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "TeluguColleges Editorial", url: SITE_URL },
    publisher: { "@type": "Organization", name: "TeluguColleges", url: SITE_URL },
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

function PhaseTable({ phase }: { phase: CounsellingPhase }) {
  const milestones = phase.milestones as ApCounsellingMilestone[];
  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-base sm:text-lg font-bold">{phase.title}</h2>
        <AddPhaseButton initialNow={Date.now()}
          milestones={phase.milestones}
          phaseTag={phase.tag}
          phaseLabel={phase.title}
          config={AP_ICS_CONFIG}
          filePrefix="ap-eapcet"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-3 font-semibold">Event</th>
              <th className="py-2 font-semibold whitespace-nowrap">Dates</th>
              <th className="py-2 pl-3 font-semibold text-right whitespace-nowrap">Days</th>
              <th className="py-2 pl-2 font-semibold w-px">
                <span className="sr-only">Add to calendar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {milestones.map(m => (
              <tr key={m.id} className="border-b last:border-0 align-top">
                <td className="py-2.5 pr-3 text-gray-700 leading-relaxed">{m.event}</td>
                <td className="py-2.5 text-gray-800 font-medium whitespace-nowrap">{m.dates}</td>
                <td className="py-2.5 pl-3 text-right text-gray-500">{m.days ?? "—"}</td>
                <td className="py-2.5 pl-2 text-right">
                  <AddMilestoneButton initialNow={Date.now()}
                    milestone={m}
                    phaseTag={phase.tag}
                    config={AP_ICS_CONFIG}
                    filePrefix="ap-eapcet"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ApCounsellingDates2026Page() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[buildBreadcrumbJsonLd(), buildArticleJsonLd(), buildFaqJsonLd()]} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">AP Counselling Dates 2026</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AP EAPCET Counselling Dates 2026 — Official Schedule
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        APSCHE notified the AP EAPCET 2026 first-phase counselling schedule on July 16, 2026
        (published in newspapers July 17). <strong>First-phase registration was scheduled for July 20</strong> on{" "}
        <a
          href={AP_COUNSELLING_PORTAL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          eapcet-sche.aptonline.in
        </a>
        , and the phase runs through August 13. Notification recorded July 17, 2026; freshness reviewed September 5, 2026.
      </p>

      <section className="rounded-xl mb-6 p-4 bg-amber-50 text-amber-900">
        <h2 className="font-bold mb-2">Published first-phase dates have passed</h2>
        <p className="text-sm">{getCounsellingStatus("AP").next}</p>
      </section>
      {/* Key dates banner */}
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-blue-50 border border-blue-200">
        <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-2">First phase at a glance</h2>
        <ul className="text-sm text-blue-900 space-y-1 leading-relaxed">
          <li><strong>July 20–29</strong> — Register &amp; pay processing fee (₹1,200 OC/BC · ₹600 SC/ST)</li>
          <li><strong>July 22–31</strong> — Verification of uploaded certificates at HLCs (online)</li>
          <li><strong>July 25–31</strong> — Enter web options (change them August 1)</li>
          <li><strong>August 6</strong> — Seat allotment → self-join &amp; report August 7–13</li>
        </ul>
      </section>

      {AP_COUNSELLING_PHASES.map(phase => (
        <PhaseTable key={phase.id} phase={phase} />
      ))}

      {/* No mock allotment — the single most misunderstood difference vs TG */}
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-amber-50 border border-amber-200">
        <h2 className="text-base sm:text-lg font-bold text-amber-900 mb-1.5">
          There is no mock allotment — August 1 is your last chance
        </h2>
        <p className="text-sm text-amber-900 leading-relaxed">
          TG EAPCET publishes a mock allotment so students can see where they&rsquo;d land and
          reshuffle. <strong>AP does not.</strong> After the August 1 change-of-options day, the
          next thing published is the <strong>real seat allotment on August 6</strong>. Treat
          August 1 as the final deadline to get your priority order right — there is no preview
          and no second look.
        </p>
      </section>

      {/* Fee + documents */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Fee and documents</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Pay the counselling processing fee — <strong>₹1,200</strong> (OC/BC) or{" "}
          <strong>₹600</strong> (SC/ST) — during the July 20–29 registration window. Certificate
          verification (July 22–31) is done online at Help Line Centres; if your certificates are
          verified through web services you may not need to attend in person.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          <strong>Verification must be completed for your web options to be considered.</strong>{" "}
          The verification and web-options windows overlap, which catches people out — do not
          leave verification to the last days of July.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Full checklist with validity rules (income certificate must be issued on or after
          January 1, 2026):{" "}
          <Link href="/eapcet/certificate-verification-documents" className="text-accent underline">
            EAPCET certificate verification documents list
          </Link>
          .
        </p>
      </section>

      {/* Predictor funnel */}
      <section
        className="rounded-xl sm:rounded-2xl mb-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold text-white mb-1">
            Compare historical closing ranks
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            The predictor shows every Andhra Pradesh college where the official APSCHE closing
            rank for your exact category × gender covered your rank — the right raw material for
            your priority order. Candidates who enter too few options regularly go unallotted
            even when their rank could have secured a seat.
          </p>
          <Link
            href="/eapcet"
            className="inline-block bg-white text-brand font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            Open the EAPCET College Predictor →
          </Link>
        </div>
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

      {/* Related */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Related guides</h2>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>
            → <Link href="/eapcet/ap-web-options" className="text-accent underline">AP web options entry — step-by-step guide</Link>
          </li>
          <li>
            → <Link href="/eapcet/ap-results-2026" className="text-accent underline">AP EAPCET Results 2026 — rank card &amp; toppers</Link>
          </li>
          <li>
            → <Link href="/eapcet/ap-cutoff-2026" className="text-accent underline">AP EAPCET 2026 cutoff — branch-wise closing ranks</Link>
          </li>
          <li>
            → <Link href="/eapcet/certificate-verification-documents" className="text-accent underline">Certificate verification — documents list</Link>
          </li>
          <li>
            → <Link href="/eapcet/ts-counselling-dates-2026" className="text-accent underline">TS (TG) EAPCET counselling dates 2026</Link>
          </li>
        </ul>
      </section>

      <p className="text-xs text-gray-500 leading-relaxed">
        Source: APSCHE APEAPCET-2026 admissions counselling schedule (first phase).{" "}
        {AP_NOTIFICATION_TRAIL.map(t => `${t.event}: ${t.date}`).join("; ")}. This table records the July first-phase notification. Confirm later rounds on the official portal. Dates can be revised by the council — always confirm on{" "}
        <a
          href="https://cets.apsche.ap.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          cets.apsche.ap.gov.in
        </a>{" "}
        before acting.
      </p>
    </main>
  );
}
