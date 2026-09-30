import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

const url = `${SITE_URL}/eapcet`;

/**
 * Structured data for the /eapcet predictor HUB PAGE ONLY.
 *
 * History: these schemas used to live in src/app/eapcet/layout.tsx, which
 * meant they rendered on EVERY /eapcet/* child route. That gave the
 * cutoff-2026 and rank-band pages a second FAQPage (Google allows only one
 * per page — duplicates make BOTH ineligible for FAQ rich results), plus a
 * misleading WebApplication schema and a wrong BreadcrumbList. They were
 * moved here and are imported by page.tsx alone. The component is rendered
 * inside a client page, but client components are still server-rendered, so
 * the <script> tags appear in the initial HTML crawlers fetch.
 *
 * Three schemas, each carrying its weight:
 *  - WebApplication: declares the page is a tool. Ranks better for
 *    "tool" / "calculator" intent and is eligible for the SoftwareApp
 *    rich-result family in some result-types.
 *  - FAQPage: 6 substantive Q&A about how the predictor works,
 *    methodology, data sources, and limitations. The same PREDICTOR_FAQS
 *    are rendered visibly on the page (Google requires schema text to
 *    match on-page content).
 *  - BreadcrumbList: navigation hierarchy.
 */

export const PREDICTOR_FAQS: { q: string; a: string }[] = [
  {
    q: "How accurate is the TeluguColleges EAPCET College Predictor?",
    a: "The predictor uses historical TSCHE and APSCHE closing-rank records, with Telangana final-phase data through 2025 and Andhra Pradesh data through 2024. For each available college, branch, category and gender combination, it weights the latest three years 50%/30%/20%, two years 70%/30%, or uses the single available year. Phase-specific selections use their available records. This is a research shortlist, not an official 2026 cutoff or a guarantee of admission.",
  },
  {
    q: "What data does the predictor use to match colleges to my rank?",
    a: "The predictor uses historical TSCHE/APSCHE closing-rank datasets. Coverage varies by year, college, branch, phase, category and gender. Results marked OC reference use a legacy OC record rather than an exact category/gender match. Missing records are not evidence of an available seat; inspect each result label and source year, and confirm current admissions instructions separately.",
  },
  {
    q: "Why do TS and AP have different reference years?",
    a: "The imported Telangana final-phase dataset contains 2025, 2024 and 2023 records, while Andhra Pradesh contains 2024, 2023 and 2022 records. Phase-specific coverage differs. These source years describe the data currently used by this site; they do not establish whether newer official records have been published elsewhere.",
  },
  {
    q: "Does the predictor include management-quota and self-financed seats?",
    a: "No. The closing ranks shown are convenor-quota (state counselling) only. Management-quota, NRI and category-B seats follow college-specific cutoffs that are not published centrally and vary widely between rounds. If you are targeting management quota, contact the college directly and verify any fee and eligibility information directly with that institution.",
  },
  {
    q: "What category and gender options does the predictor support?",
    a: "The predictor supports OC, BC-A through BC-E, SC, ST and EWS, with separate boys and girls selections where source records exist. Telangana also offers SC-I, SC-II and SC-III for 2025 onward; older records may use the combined SC category. EWS uses its own recorded cutoff, not OC. Missing girls records are not silently replaced by boys records.",
  },
  {
    q: "Can I use the predictor for branches other than CSE / ECE / EEE / Mech / Civil?",
    a: "Yes. The branch dropdown includes core branches plus newer specializations — CSE (AI & ML), CSE (Data Science), CSE (Cyber Security), AI & DS, Biomedical, Aerospace, Automobile, Chemical, Mining, Metallurgy, Pharm.D and others. Where official cutoffs are available for a given branch in a given year, the predictor uses them; where no matching records exist, no prediction can be made.",
  },
];

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET Predictor", item: url },
    ],
  };
}

function buildWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TeluguColleges EAPCET College Predictor",
    description:
      "Enter your AP/TS EAPCET rank, category and gender to see B.Tech colleges where the official closing rank matches your score.",
    url,
    applicationCategory: "EducationApplication",
    operatingSystem: "Web",
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    publisher: {
      "@type": "Organization",
      name: "TeluguColleges",
      url: SITE_URL,
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      geographicArea: {
        "@type": "AdministrativeArea",
        name: "Andhra Pradesh and Telangana",
      },
    },
    featureList: [
      "Weighted prediction across two most recent counselling years",
      "Category-wise (OC, BC-A, BC-B, BC-C, BC-D, BC-E, SC, ST)",
      "Gender-wise (Boys / Girls)",
      "Branch-wise (CSE, ECE, EEE, Mech, Civil + 30+ specializations)",
      "Both Andhra Pradesh and Telangana state counselling",
    ],
  };
}

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREDICTOR_FAQS.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function EapcetStructuredData() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd()} />
      <JsonLd data={buildWebApplicationJsonLd()} />
      <JsonLd data={buildFaqJsonLd()} />
    </>
  );
}
