import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CounsellingToolkit from "@/components/CounsellingToolkit";
import FeeCalculatorClient, { type SlimCollege } from "./FeeCalculatorClient";
import { COLLEGES } from "@/lib/colleges";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export const metadata: Metadata = {
  title: "B.Tech Fee Calculator — 4-Year Cost Estimator for AP & Telangana | TeluguColleges",
  description:
    "Estimate the total 4-year cost of B.Tech at any engineering college in Andhra Pradesh or Telangana — convener-quota tuition, hostel & mess, exam fees — plus fee reimbursement guidance.",
  alternates: { canonical: `${SITE_URL}/fee-calculator` },
  openGraph: {
    title: "B.Tech 4-Year Fee Calculator — AP & Telangana",
    description:
      "Estimate the full 4-year cost of B.Tech at 700+ colleges in AP & Telangana, including hostel and fee reimbursement guidance.",
    url: `${SITE_URL}/fee-calculator`,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "B.Tech 4-Year Fee Calculator — AP & Telangana",
    description: "Tuition + hostel + reimbursement: estimate your real 4-year B.Tech cost.",
  },
};

/**
 * /fee-calculator — Server Component shell.
 *
 * Ships only a slim projection of COLLEGES (name, fee, state, slug) to the
 * client island — the fields the calculator actually needs — instead of the
 * full dataset, keeping the bundle small in line with the /colleges pattern.
 */
export default function FeeCalculatorPage() {
  // Exclude rows without a real notified fee (fee = 0 placeholders) — a
  // "₹0 × 4 years" estimate is worse than no estimate.
  const slim: SlimCollege[] = COLLEGES.filter(c => c.fee > 0).map(c => ({
    n: c.name,
    f: c.fee,
    s: c.state === "Andhra Pradesh" ? "AP" : "TS",
    u: c.slug,
    t: c.type,
  }));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Fee Calculator", item: `${SITE_URL}/fee-calculator` },
    ],
  };
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "B.Tech 4-Year Fee Calculator",
    url: `${SITE_URL}/fee-calculator`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[breadcrumbLd, appLd]} />
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Fee Calculator</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1">B.Tech 4-Year Fee Calculator</h1>
      <p className="text-sm text-gray-500 mb-6">
        Estimate the total cost of a 4-year B.Tech at any of the {COLLEGES.length} colleges in our
        directory — tuition, hostel &amp; mess, and other recurring costs — with fee reimbursement
        guidance for AP and Telangana students.
      </p>

      <FeeCalculatorClient colleges={slim} />

      <section className="mt-10 space-y-4 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-lg font-bold text-gray-800">How this estimate works</h2>
        <p>
          Tuition is the convener-quota (Category-A) annual fee notified for the current block
          period — APHERMC 2023–2026 for Andhra Pradesh and G.O.Ms.No.06 (2025–2028) for
          Telangana — multiplied by 4 years. Management-quota (Category-B) and NRI fees are
          typically 2–3× higher and are not covered here.
        </p>
        <p>
          Hostel &amp; mess costs vary widely by college and city (roughly ₹60,000–₹1,50,000 per
          year). The slider lets you set your own estimate; day scholars can set it to zero and
          budget transport separately.
        </p>

        <h2 className="text-lg font-bold text-gray-800">Fee reimbursement — check before you budget</h2>
        <p>
          Both states run post-matric tuition-fee reimbursement schemes for eligible students
          (subject to category, family income, residency, and admission through convener-quota
          counselling). Rules and amounts are revised by government order and differ by category,
          so always verify your eligibility on the official portals before finalising your budget:
          {" "}
          <a href="https://jnanabhumi.ap.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">Jnanabhumi (AP)</a>
          {" "}and{" "}
          <a href="https://telanganaepass.cgg.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">ePASS (Telangana)</a>.
          In Telangana, full tuition reimbursement has historically applied to SC/ST students and
          to other eligible categories within notified EAMCET/EAPCET rank limits, with a capped
          amount (₹35,000/year) beyond those limits. Reimbursement covers tuition only — never
          hostel, mess, or transport.
        </p>
        <p className="text-xs text-gray-400">
          Disclaimer: figures are indicative estimates based on notified convener-quota fees and
          typical living costs. Actual costs and reimbursement eligibility depend on official
          notifications in force at the time of admission. Found an error?{" "}
          <a href="mailto:contact@telugucolleges.com" className="hover:underline">contact@telugucolleges.com</a>
        </p>
      </section>

      <CounsellingToolkit current="/fee-calculator" className="mt-10" />
    </main>
  );
}
