import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const url = `${SITE_URL}/eapcet/ts-counselling-dates-2026`;

const LAST_UPDATED = "2026-06-10";

export const metadata: Metadata = {
  title: "TS EAPCET Counselling Dates 2026 — Full Phase-Wise Schedule (TG EAPCET) | TeluguColleges",
  description:
    "Official TG EAPCET 2026 counselling schedule: Phase 1 registration June 19–28, certificate verification June 22–29, web options June 25–July 1, seat allotment by July 10. All three phases, fees, and documents.",
  alternates: { canonical: url },
  openGraph: {
    title: "TS EAPCET Counselling Dates 2026 — Full Phase-Wise Schedule",
    description:
      "Phase 1 starts June 19, 2026. Complete TGCHE schedule for all three phases with fees and documents.",
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

interface PhaseEvent {
  event: string;
  dates: string;
}

const PHASE_1: PhaseEvent[] = [
  { event: "Registration, fee payment & slot booking", dates: "June 19 – 28, 2026" },
  { event: "Certificate verification", dates: "June 22 – 29, 2026" },
  { event: "Web options entry", dates: "June 25 – July 1, 2026" },
  { event: "Freezing of web options", dates: "July 1, 2026" },
  { event: "Mock seat allotment", dates: "On or before July 4, 2026" },
  { event: "Change of options after mock allotment", dates: "July 5 – 7, 2026" },
  { event: "Final freezing of options", dates: "July 7, 2026" },
  { event: "Seat allotment result", dates: "On or before July 10, 2026" },
  { event: "Fee payment & self-reporting", dates: "July 10 – 14, 2026" },
];

const PHASE_2: PhaseEvent[] = [
  { event: "Registration, fee payment & slot booking (new candidates)", dates: "July 17, 2026" },
  { event: "Certificate verification", dates: "July 18, 2026" },
  { event: "Web options entry", dates: "July 18 – 19, 2026" },
  { event: "Freezing of web options", dates: "July 19, 2026" },
  { event: "Seat allotment result", dates: "On or before July 22, 2026" },
  { event: "Fee payment & self-reporting", dates: "July 22 – 24, 2026" },
  { event: "Physical reporting at allotted colleges", dates: "July 25 – 28, 2026" },
  { event: "Last date to cancel allotted seat", dates: "July 28, 2026" },
];

const FINAL_PHASE: PhaseEvent[] = [
  { event: "Registration, fee payment & slot booking", dates: "July 31, 2026" },
  { event: "Certificate verification", dates: "August 1, 2026" },
  { event: "Web options entry", dates: "August 1 – 2, 2026" },
  { event: "Freezing of web options", dates: "August 2, 2026" },
  { event: "Seat allotment result", dates: "On or before August 5, 2026" },
  { event: "Fee payment, self-reporting & physical reporting", dates: "August 5 – 7, 2026" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "When does TS EAPCET 2026 counselling start?",
    a: "Phase 1 registration, fee payment and slot booking run from June 19 to June 28, 2026 on the TGCHE portal (eapcet.tgche.ac.in / tgeapcet.nic.in). Certificate verification starts June 22 and web options open June 25.",
  },
  {
    q: "How many phases of TG EAPCET counselling are there in 2026?",
    a: "Three — Phase 1 (June 19 to July 14), Phase 2 (July 17 to 28), and a Final Phase (July 31 to August 7). The overall process concludes by mid-August 2026.",
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
    a: "On or before July 10, 2026. Allotted candidates must pay the tuition fee and self-report online between July 10 and July 14, 2026.",
  },
  {
    q: "Can I join Phase 2 if I missed Phase 1 registration?",
    a: "Yes — Phase 2 has a registration window (July 17, 2026) for fresh candidates. But Phase 1 has the widest seat availability; later phases mostly redistribute leftover and cancelled seats.",
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

function PhaseTable({ title, events }: { title: string; events: PhaseEvent[] }) {
  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
      <h2 className="text-base sm:text-lg font-bold mb-3">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-3 font-semibold">Event</th>
              <th className="py-2 font-semibold whitespace-nowrap">Dates</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.event} className="border-b last:border-0 align-top">
                <td className="py-2.5 pr-3 text-gray-700 leading-relaxed">{e.event}</td>
                <td className="py-2.5 text-gray-800 font-medium whitespace-nowrap">{e.dates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function TsCounsellingDates2026Page() {
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
        TGCHE released the TG EAPCET 2026 counselling schedule on June 9, 2026.{" "}
        <strong>Phase 1 registration opens June 19</strong> on{" "}
        <a
          href="https://eapcet.tgche.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          eapcet.tgche.ac.in
        </a>{" "}
        (also tgeapcet.nic.in). Three phases run through August 2026. Last updated:
        June 10, 2026.
      </p>

      {/* Key dates banner */}
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-blue-50 border border-blue-200">
        <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-2">Phase 1 at a glance</h2>
        <ul className="text-sm text-blue-900 space-y-1 leading-relaxed">
          <li><strong>June 19–28</strong> — Register, pay fee (₹1,200 OC/BC · ₹600 SC/ST), book verification slot</li>
          <li><strong>June 25–July 1</strong> — Enter web options (freeze July 1)</li>
          <li><strong>By July 4</strong> — Mock allotment → reshuffle options July 5–7</li>
          <li><strong>By July 10</strong> — Seat allotment → pay fee & self-report by July 14</li>
        </ul>
      </section>

      <PhaseTable title="Phase 1 — June 19 to July 14, 2026" events={PHASE_1} />
      <PhaseTable title="Phase 2 — July 17 to 28, 2026" events={PHASE_2} />
      <PhaseTable title="Final Phase — July 31 to August 7, 2026" events={FINAL_PHASE} />

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
            Web options open June 25 — build your list now
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            The predictor shows every Telangana college where the official TGCHE
            closing rank for your category × gender covered your rank — across the
            last two counselling years.
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
        Schedule as notified by TGCHE and reported on June 9, 2026. Dates can be
        revised by the council — always confirm on eapcet.tgche.ac.in before acting.
      </p>
    </main>
  );
}
