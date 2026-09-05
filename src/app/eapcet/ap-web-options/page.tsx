import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

const url = `${SITE_URL}/eapcet/ap-web-options`;

export const metadata: Metadata = {
  title: "AP EAPCET Web Options Entry 2026 — Step-by-Step Guide | TeluguColleges",
  description:
    "How to enter web options for AP EAPCET 2026 counselling at eapcet-sche.aptonline.in: login steps, priority-order strategy, saving and modifying options, freezing, and the mistakes that cost students seats.",
  alternates: { canonical: url },
  openGraph: {
    title: "AP EAPCET Web Options Entry 2026 — Step-by-Step Guide",
    description:
      "Login steps, priority-order strategy, modifying and freezing options at eapcet-sche.aptonline.in.",
    url,
    siteName: "TeluguColleges.com",
    type: "article",
    locale: "en_IN",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AP EAPCET Web Options Entry 2026 — Step-by-Step Guide",
    description: "Exact steps and strategy for entering web options in AP EAPCET counselling.",
  },
};

const STEPS: { name: string; text: string }[] = [
  {
    name: "Complete registration and fee payment first",
    text: "Web options open only for candidates who have paid the counselling processing fee (₹1,200 for OC/BC, ₹600 for SC/ST) and completed certificate verification on eapcet-sche.aptonline.in. If your certificates were verified online through web services, you may not need to visit a Help Line Centre at all.",
  },
  {
    name: "Open the web options portal",
    text: "Go to eapcet-sche.aptonline.in during the notified web options window and click the Web Options Entry link. Options can only be entered during the scheduled dates for your rank range — check the counselling notification.",
  },
  {
    name: "Log in with hall ticket number and date of birth",
    text: "Enter your AP EAPCET hall ticket number and date of birth, then submit. Your candidate dashboard opens. Some cycles also send an OTP to your registered mobile number — keep that phone with you.",
  },
  {
    name: "Open manual web options entry",
    text: "Click manual web options entry. You will see the list of colleges and courses you are eligible for. Each option is a specific college + branch combination (e.g., a college's CSE is one option, the same college's ECE is a separate option).",
  },
  {
    name: "Enter options in true priority order",
    text: "Option 1 should be the college+branch you want most, regardless of whether you think your rank reaches it. The allotment algorithm gives you the highest-priority option your rank can secure — you lose nothing by aiming high, but you can't get a college you never listed.",
  },
  {
    name: "Enter as many options as possible",
    text: "This is the single most repeated official advice. Students who enter only 10–15 options risk getting no allotment at all. List every college+branch you would genuinely join — 50, 100 or more options is normal and safe.",
  },
  {
    name: "Save, review, and modify freely until the deadline",
    text: "Options can be saved and modified any number of times within the scheduled window. After the mock/seat allotment displays (where applicable), you get a window to reshuffle options before final freezing.",
  },
  {
    name: "Take a printout of the final saved options",
    text: "After final submission, download/print the saved options list. It is your proof of what you entered, and you'll want it when the allotment result comes out.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "When does AP EAPCET 2026 web options entry start?",
    a: "Current AP counselling and web-options dates could not be confirmed during our September 5 review. Check eapcet-sche.aptonline.in for an active 2026 round and its notified dates before following this guide.",
  },
  {
    q: "What do I need to log in for web options entry?",
    a: "Your AP EAPCET hall ticket number and date of birth. You must already have paid the processing fee and completed certificate verification, otherwise the options page won't open for you.",
  },
  {
    q: "How many web options should I enter?",
    a: "As many as you would genuinely accept — there is no penalty for listing more. Officials repeatedly advise maximising options; candidates with too few options regularly go unallotted even when their rank could have secured a seat somewhere they'd have accepted.",
  },
  {
    q: "Does the order of options matter more than my rank?",
    a: "Both matter, differently. Your rank decides which options are reachable; your priority order decides which reachable option you get. The algorithm walks down your list and stops at the first option where your rank fits the category seat. So order strictly by your real preference.",
  },
  {
    q: "Can I change my options after saving them?",
    a: "Yes — any number of times within the scheduled window, and again during the change-of-options window after mock allotment (where provided). After final freezing, no changes are possible for that round.",
  },
  {
    q: "If I'm allotted a seat in round 1, can I participate in round 2?",
    a: "Yes, you can generally exercise fresh options in later rounds for upward movement (sliding). But read that round's notification carefully — rules on retaining vs forfeiting your earlier seat and self-reporting obligations change between cycles.",
  },
];

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "AP Web Options Entry Guide", item: url },
    ],
  };
}

function buildHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to enter web options for AP EAPCET 2026 counselling",
    description:
      "Step-by-step process to exercise web options on eapcet-sche.aptonline.in, from login to final freezing.",
    totalTime: "PT1H",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
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

export default function ApWebOptionsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[buildBreadcrumbJsonLd(), buildHowToJsonLd(), buildFaqJsonLd()]} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">AP Web Options Entry Guide</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AP EAPCET Web Options Entry 2026 — Step-by-Step
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Web options are where your seat is actually decided — not the exam. This
        guide covers the exact entry process on{" "}
        <a
          href="https://eapcet-sche.aptonline.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          eapcet-sche.aptonline.in
        </a>
        , plus the priority-order strategy that decides which college you land.
      </p>

      {/* Prerequisites */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Before you can enter options</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
          <li>Qualified rank in AP EAPCET 2026 (rank card downloaded).</li>
          <li>
            Counselling registration + processing fee paid: <strong>₹1,200</strong>{" "}
            (OC/BC) or <strong>₹600</strong> (SC/ST).
          </li>
          <li>
            Certificate verification completed — online for most candidates;{" "}
            <Link href="/eapcet/certificate-verification-documents" className="text-accent underline">
              full documents list here
            </Link>
            .
          </li>
          <li>
            A ready priority list of college+branch combinations — build it with the{" "}
            <Link href="/eapcet" className="text-accent underline">EAPCET College Predictor</Link>{" "}
            using official closing ranks for your category and gender.
          </li>
        </ul>
      </section>

      {/* Steps */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-4">The 8 steps, in order</h2>
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.name} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold text-sm sm:text-base mb-0.5">{s.name}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Strategy */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">Mistakes that cost students seats every year</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 leading-relaxed">
          <li>
            <strong>Entering too few options.</strong> An unallotted round-1 result
            with a workable rank is almost always a short options list.
          </li>
          <li>
            <strong>Ordering by expected cutoff instead of preference.</strong> The
            algorithm already handles reachability — putting a &ldquo;safe&rdquo;
            college first hands away a better seat you might have got.
          </li>
          <li>
            <strong>Listing branches you'd never join</strong> just to fill the list.
            If allotted, withdrawing later has fee and round-eligibility consequences.
          </li>
          <li>
            <strong>Waiting until the last day.</strong> The portal slows under load,
            and OTP/login issues on deadline day are common. Save a full list early,
            refine later.
          </li>
          <li>
            <strong>Forgetting the printout.</strong> Always keep the final saved
            options PDF — disputes without it are hard to resolve.
          </li>
        </ul>
      </section>

      {/* Predictor funnel */}
      <section
        className="rounded-xl sm:rounded-2xl mb-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold text-white mb-1">
            Build your options list from real cutoff data
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            The predictor shows every college where the official APSCHE closing rank
            for your exact category × gender covered your rank — the right raw
            material for your priority order.
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
            → <Link href="/eapcet/certificate-verification-documents" className="text-accent underline">Certificate verification — documents list (AP & TS)</Link>
          </li>
          <li>
            → <Link href="/eapcet/ts-counselling-dates-2026" className="text-accent underline">TS (TG) EAPCET counselling dates 2026</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
