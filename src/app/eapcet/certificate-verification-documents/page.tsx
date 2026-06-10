import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const url = `${SITE_URL}/eapcet/certificate-verification-documents`;

export const metadata: Metadata = {
  title: "EAPCET Certificate Verification 2026 — Complete Documents List (AP & TS) | TeluguColleges",
  description:
    "Every document needed for AP EAPCET and TS (TG) EAPCET 2026 counselling certificate verification: rank card, study certificates, income certificate validity, caste/EWS certificates, originals vs photocopies, and special cases.",
  alternates: { canonical: url },
  openGraph: {
    title: "EAPCET Certificate Verification 2026 — Complete Documents List (AP & TS)",
    description:
      "Checklist of mandatory and conditional documents for EAPCET counselling certificate verification in both states.",
    url,
    siteName: "TeluguColleges.com",
    type: "article",
    locale: "en_IN",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EAPCET Certificate Verification 2026 — Documents List",
    description: "Mandatory and conditional documents for AP & TS EAPCET counselling.",
  },
};

interface DocItem {
  name: string;
  detail: string;
  who: string;
}

const MANDATORY_DOCS: DocItem[] = [
  {
    name: "EAPCET 2026 Rank Card",
    detail: "Downloaded from the official CET portal after results.",
    who: "All candidates",
  },
  {
    name: "EAPCET 2026 Hall Ticket",
    detail: "The admit card you carried to the exam.",
    who: "All candidates",
  },
  {
    name: "Aadhaar Card",
    detail: "Details must match your application; mismatches cause delays at the Help Line Centre.",
    who: "All candidates",
  },
  {
    name: "Class 10 (SSC) Marks Memo",
    detail: "Original marks memorandum.",
    who: "All candidates",
  },
  {
    name: "Class 12 (Intermediate) Marks Memo",
    detail: "Or equivalent qualifying exam memo. Supplementary/improvement candidates bring the latest memo.",
    who: "All candidates",
  },
  {
    name: "Study Certificates — Class 6 to 12",
    detail: "Issued by each school/college you studied in. These establish local-area status (AU/SVU/OU region), which controls 85% of convenor-quota seats.",
    who: "All candidates who studied in an institution",
  },
  {
    name: "Transfer Certificate (TC)",
    detail: "From the institution last attended.",
    who: "All candidates",
  },
  {
    name: "Income Certificate",
    detail: "Issued on or after January 1, 2026 by the Tahsildar/MeeSeva. Needed for fee reimbursement eligibility — an expired certificate is the most common verification-day rejection.",
    who: "Candidates claiming fee reimbursement",
  },
];

const CONDITIONAL_DOCS: DocItem[] = [
  {
    name: "Caste Certificate",
    detail: "Issued by the competent authority (Tahsildar/MeeSeva) for BC/SC/ST candidates. The category claimed in your EAPCET application must match.",
    who: "BC / SC / ST candidates",
  },
  {
    name: "EWS Income & Asset Certificate",
    detail: "For 2026–27, issued by the Tahsildar. EWS is claimed against the OC quota.",
    who: "EWS candidates",
  },
  {
    name: "Residence Certificate (7 years)",
    detail: "Residence proof of the candidate for the seven years preceding the qualifying exam — required only if you did NOT study in institutions (private/distance candidates), in place of study certificates.",
    who: "Private / non-institutional candidates",
  },
  {
    name: "Parent's Residence Certificate",
    detail: "For candidates who studied outside the state but claim local status through their parents' AP/TS residence — typically 10 years' residence proof.",
    who: "Non-local study, local-claim candidates",
  },
  {
    name: "Minority / PH / NCC / Sports / CAP certificates",
    detail: "Original certificates for any special-category quota claimed (PH: SADAREM certificate; CAP: certificates from Zilla Sainik Welfare Office).",
    who: "Special-category candidates",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How many photocopy sets should I carry for certificate verification?",
    a: "Carry all originals plus two sets of photocopies of every document. The Help Line Centre retains attested copies; originals are returned after verification.",
  },
  {
    q: "Is physical certificate verification compulsory for everyone in AP?",
    a: "No. APSCHE verifies most candidates' data online through web services (Class 10/12 boards, MeeSeva). If your data verifies online, you just confirm your details after paying the processing fee and need not upload or present certificates. Only candidates whose data could not be verified online (other boards, other states, mismatches) attend physical/online verification.",
  },
  {
    q: "What income certificate date is valid for 2026 counselling?",
    a: "An income certificate issued on or after January 1, 2026. Older certificates are rejected for fee-reimbursement purposes. Apply at MeeSeva a few weeks early — it's the single most common last-minute blocker.",
  },
  {
    q: "What if there's a gap in my study certificates?",
    a: "Bring whatever certificates exist plus a gap explanation; for non-institutional periods a residence certificate covering those years is required. Local-area status determines eligibility for 85% of convenor seats, so resolve gaps before your verification slot.",
  },
  {
    q: "Do I need the same documents for TS (TG) EAPCET counselling?",
    a: "The list is nearly identical: TG EAPCET 2026 rank card, hall ticket, Aadhaar, Class 10 and 12 memos, study certificates Class 6–12, TC, income certificate issued on or after January 1, 2026, caste certificate, EWS certificate for 2026–27, and the 7-year residence certificate for non-institutional candidates. TS conducts verification at Help Line Centres after slot booking.",
  },
  {
    q: "What happens if a document is missing on verification day?",
    a: "Verification is left pending for that item; you're typically given time to produce it before web options close for your phase. But pending verification can block options entry, so treat the slot date as your hard deadline for having everything ready.",
  },
];

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "Certificate Verification Documents", item: url },
    ],
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

function DocTable({ docs }: { docs: DocItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2 pr-3 font-semibold">Document</th>
            <th className="py-2 pr-3 font-semibold">Details</th>
            <th className="py-2 font-semibold">Who needs it</th>
          </tr>
        </thead>
        <tbody>
          {docs.map(d => (
            <tr key={d.name} className="border-b last:border-0 align-top">
              <td className="py-2.5 pr-3 font-medium text-gray-800 whitespace-nowrap">{d.name}</td>
              <td className="py-2.5 pr-3 text-gray-600 leading-relaxed">{d.detail}</td>
              <td className="py-2.5 text-gray-600">{d.who}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CertificateVerificationDocsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[buildBreadcrumbJsonLd(), buildFaqJsonLd()]} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Certificate Verification Documents</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        EAPCET Certificate Verification 2026 — Complete Documents List
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        One checklist for both states — AP EAPCET (
        <a href="https://eapcet-sche.aptonline.in" target="_blank" rel="noopener noreferrer" className="text-accent underline">
          eapcet-sche.aptonline.in
        </a>
        ) and TG EAPCET (
        <a href="https://eapcet.tgche.ac.in" target="_blank" rel="noopener noreferrer" className="text-accent underline">
          eapcet.tgche.ac.in
        </a>
        ). Carry <strong>originals + two sets of photocopies</strong> of everything.
      </p>

      {/* Key warning */}
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-amber-50 border border-amber-200">
        <h2 className="text-base sm:text-lg font-bold text-amber-900 mb-1">
          The two documents that block students every year
        </h2>
        <p className="text-sm text-amber-900 leading-relaxed">
          <strong>Income certificate</strong> — must be issued on or after{" "}
          <strong>January 1, 2026</strong> for fee reimbursement; and{" "}
          <strong>study certificates (Class 6–12)</strong> — these prove your
          local-area status, which controls 85% of convenor-quota seats. Both take
          time to obtain from MeeSeva/schools. Apply now, before counselling opens.
        </p>
      </section>

      {/* Mandatory */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Mandatory documents — all candidates</h2>
        <DocTable docs={MANDATORY_DOCS} />
      </section>

      {/* Conditional */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Conditional documents — if applicable</h2>
        <DocTable docs={CONDITIONAL_DOCS} />
      </section>

      {/* AP online verification note */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">AP candidates: you may not need to go anywhere</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          APSCHE verifies certificate data <strong>online through web services</strong>{" "}
          for most candidates who studied in AP — board marks, caste, income and
          local-status data are pulled directly from government databases. If your
          data verifies online, you simply log in after paying the processing fee,
          confirm your personal/academic details are correct, and proceed to{" "}
          <Link href="/eapcet/ap-web-options" className="text-accent underline">web options</Link>{" "}
          without uploading anything.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Physical/online document verification applies mainly to candidates from
          other boards or states, special-category claims (PH/CAP/NCC/Sports), or
          records that fail auto-verification. In Telangana, certificate verification
          at Help Line Centres after slot booking remains the standard process — see
          the{" "}
          <Link href="/eapcet/ts-counselling-dates-2026" className="text-accent underline">
            TG EAPCET 2026 schedule
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
            Documents ready? Plan your options next
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            Use the free predictor to see which colleges your rank realistically
            reaches, category and gender-wise, from official closing-rank data.
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
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold mb-3">Related guides</h2>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>
            → <Link href="/eapcet/ap-results-2026" className="text-accent underline">AP EAPCET Results 2026 — live updates</Link>
          </li>
          <li>
            → <Link href="/eapcet/ap-web-options" className="text-accent underline">AP web options entry — step-by-step</Link>
          </li>
          <li>
            → <Link href="/eapcet/ts-counselling-dates-2026" className="text-accent underline">TS (TG) EAPCET counselling dates 2026</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
