import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  COUNSELLING_PHASES,
  type CounsellingPhase,
} from "@/lib/counselling-schedule";
import { AddMilestoneButton, AddPhaseButton } from "@/components/AddToCalendar";
import { isDeadlinePast } from "@/lib/content-freshness";
import { getCounsellingStatus, TG_SCHEDULE_SOURCE, COUNSELLING_STATUS_AS_OF } from "@/lib/counselling-status";

export const revalidate = 300;

const url = `${SITE_URL}/eapcet/ts-counselling-dates-2026`;

const LAST_UPDATED = "2026-09-05";

export const metadata: Metadata = {
  title: "TS EAPCET Counselling Dates 2026 — Full Phase-Wise Schedule (TG EAPCET) | TeluguColleges",
  description:
    "Official TG EAPCET 2026 counselling schedule: Phase 1 registration June 19–28, certificate verification June 22–29, web options June 25–July 1, seat allotment by July 10. All three phases, fees, and documents.",
  alternates: { canonical: url },
  openGraph: {
    title: "TS EAPCET Counselling Dates 2026 — Full Phase-Wise Schedule",
    description:
      "Published TGCHE 2026 schedule including internal sliding, elapsed deadlines and links to current notices.",
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
    title: "TS EAPCET Counselling Dates 2026 — Phase-Wise Schedule",
    description: "Phase 1 registration June 19–28. Full TGCHE schedule for all phases.",
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "When does TS EAPCET 2026 counselling start?",
    a: "Phase 1 registration, fee payment and slot booking run from June 19 to June 28, 2026 on the TGCHE counselling portal (tgeapcet.nic.in). Certificate verification starts June 22 and web options open June 25.",
  },
  {
    q: "How many phases of TG EAPCET counselling are there in 2026?",
    a: "Three — Phase 1 (June 19 to July 14), Phase 2 (July 17 to 28), and a Final Phase (July 31 to August 7). Internal sliding was scheduled for August 12–17. Spot admissions have separate notices; confirm their year and deadline on the official portal.",
  },
  {
    q: "What is the TS EAPCET 2026 counselling fee?",
    a: "₹1,200 for OC and BC candidates, ₹600 for SC and ST candidates. The fee must be paid before booking a certificate-verification slot.",
  },
  {
    q: "What is the mock seat allotment on July 4?",
    a: "A simulated allotment based on the options you entered, published on or before July 4, 2026. It shows where you'd currently land, and you then get July 5–7 to reshuffle your options before final freezing on July 7. Use it — students who reorder options after the mock often improve their final allotment.",
  },
  {
    q: "When is the TS EAPCET 2026 Phase 1 seat allotment result?",
    a: "The published Phase 1 allotment date was on or before July 10, 2026, with fee payment and self-reporting through July 14. These are elapsed dates; use the official portal for your current admission status.",
  },
  {
    q: "Can I join Phase 2 if I missed Phase 1 registration?",
    a: "Yes — Phase 2 has a registration window (July 17, 2026) for fresh candidates. But Phase 1 has the widest seat availability; later phases mostly redistribute leftover and cancelled seats.",
  },
  {
    q: "Can I get reminders for the TS EAPCET 2026 counselling deadlines?",
    a: "Calendar buttons are available only for deadlines that have not passed in India. Past milestones are labelled as elapsed and cannot be added as new reminders. Check the official portal for any revised schedule.",
  },
  {
    q: "What documents do I need for TG EAPCET certificate verification?",
    a: "Rank card, hall ticket, Aadhaar, Class 10 and 12 marks memos, study certificates from Class 6 to 12, Transfer Certificate, income certificate issued on or after January 1, 2026, caste certificate and EWS certificate if applicable, plus originals and two sets of photocopies. Candidates who didn't study in institutions need a 7-year residence certificate instead of study certificates.",
  },
];

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "TS Counselling Dates 2026", item: url },
    ],
  };
}

function buildArticleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: "TS EAPCET Counselling Dates 2026 — Full Phase-Wise Schedule",
    description:
      "Complete TGCHE-notified TG EAPCET 2026 counselling schedule across all three phases, with fees and document requirements.",
    url,
    datePublished: "2026-06-10T09:00:00+05:30",
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

function PhaseTable({ phase, now }: { phase: CounsellingPhase; now: number }) {
  const upcoming = phase.milestones.filter(m => !isDeadlinePast(m.deadline, now));
  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-base sm:text-lg font-bold">{phase.title}</h2>
        {upcoming.length > 0 ? <AddPhaseButton
          initialNow={now}
          milestones={upcoming}
          phaseTag={phase.tag}
          phaseLabel={phase.title}
        /> : <span className="text-xs font-semibold text-gray-500">Published dates have passed</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-3 font-semibold">Event</th>
              <th className="py-2 font-semibold whitespace-nowrap">Dates</th>
              <th className="py-2 pl-2 font-semibold w-px">
                <span className="sr-only">Add to calendar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {phase.milestones.map(m => (
              <tr key={m.id} className="border-b last:border-0 align-top">
                <td className="py-2.5 pr-3 text-gray-700 leading-relaxed">{m.event}</td>
                <td className="py-2.5 text-gray-800 font-medium whitespace-nowrap">{m.dates}</td>
                <td className="py-2.5 pl-2 text-right">
                  {isDeadlinePast(m.deadline, now) ? <span className="text-xs text-gray-500">Elapsed</span> : <AddMilestoneButton milestone={m} phaseTag={phase.tag} initialNow={now} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function TsCounsellingDates2026Page() {
  const now = Date.now();
  const status = getCounsellingStatus("TS", now);
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[buildBreadcrumbJsonLd(), buildArticleJsonLd(), buildFaqJsonLd()]} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">TS Counselling Dates 2026</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        TS EAPCET Counselling Dates 2026 — Phase-Wise Schedule
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Published TGCHE schedule, including all three counselling phases and internal sliding.
        Reviewed {COUNSELLING_STATUS_AS_OF}. Past dates remain visible as a reference.
      </p>
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-blue-50 border border-blue-200">
        <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-2">{status.headline}</h2>
        <p className="text-sm text-blue-900 mb-3">{status.next}</p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-accent">
          <a href={status.portalUrl} target="_blank" rel="noopener noreferrer" className="underline">Current TGCHE notices →</a>
          <a href={TG_SCHEDULE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">Official 2026 schedule (PDF) →</a>
        </div>
      </section>

      {COUNSELLING_PHASES.map(phase => (
        <PhaseTable key={phase.id} phase={phase} now={now} />
      ))}

      {/* Fee + documents */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Fee and documents</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Pay the counselling processing fee — <strong>₹1,200</strong> (OC/BC) or{" "}
          <strong>₹600</strong> (SC/ST) — before booking your certificate
          verification slot at a Help Line Centre. Carry originals plus two sets of
          photocopies of all documents.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Full checklist with validity rules (income certificate must be issued on or
          after January 1, 2026):{" "}
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
            Explore historical closing ranks
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            The predictor shows every Telangana college where the official TGCHE
            closing rank for your category × gender covered your rank — across the
            available historical counselling years. Compare the source year, category and gender before interpreting a closing rank.
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
            → <Link href="/eapcet/ap-results-2026" className="text-accent underline">AP EAPCET Results 2026 — live updates</Link>
          </li>
          <li>
            → <Link href="/eapcet/ap-web-options" className="text-accent underline">AP web options entry — step-by-step</Link>
          </li>
          <li>
            → <Link href="/eapcet/certificate-verification-documents" className="text-accent underline">Certificate verification — documents list</Link>
          </li>
        </ul>
      </section>

      <p className="text-xs text-gray-500 leading-relaxed">
        Schedule from the TGCHE notification dated June 8, 2026, reviewed September 5.
        Confirm revisions and any remaining admission opportunity on tgeapcet.nic.in.
      </p>
    </main>
  );
}
