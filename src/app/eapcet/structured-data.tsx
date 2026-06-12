import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
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
    a: "The predictor uses official TSCHE closing ranks for 2023–24 and 2024–25, and APSCHE closing ranks for 2022–23 and 2023–24. Predictions are weighted 70% toward the most recent year and 30% toward the previous year, so they reflect actual counselling behaviour. Real cutoffs vary year to year — the predictor is a strong starting point but not a guarantee. We recommend treating its college list as a shortlist to research, not a final allotment.",
  },
  {
    q: "What data does the predictor use to match colleges to my rank?",
    a: "The TS predictor uses cutoffs published by the Telangana State Council of Higher Education (TSCHE) and JNTU Hyderabad after each round of TG EAPCET counselling. The AP predictor uses cutoffs published by the Andhra Pradesh State Council of Higher Education (APSCHE) and JNTU Kakinada. We import every category-and-gender row from the official notifications — OC, BC-A, BC-B, BC-C, BC-D, BC-E, SC, ST and EWS, separately for boys and girls.",
  },
  {
    q: "Why do TS and AP have different reference years?",
    a: "TSCHE published 2024–25 closing ranks earlier than APSCHE did, so TS predictions can use the latest two years (2023–24 and 2024–25). For AP, the most recent two complete-and-published years are 2022–23 and 2023–24. Once APSCHE releases 2024–25 closing ranks after the 2026 counselling cycle, the AP predictor will roll forward.",
  },
  {
    q: "Does the predictor include management-quota and self-financed seats?",
    a: "No. The closing ranks shown are convenor-quota (state counselling) only. Management-quota, NRI and category-B seats follow college-specific cutoffs that are not published centrally and vary widely between rounds. If you are targeting management quota, contact the college directly and use our /colleges/[name]/fees pages for the published management-quota fee.",
  },
  {
    q: "What category and gender options does the predictor support?",
    a: "Eight categories — OC, BC-A, BC-B, BC-C, BC-D, BC-E, SC, ST — across two genders (boys and girls). EWS is treated as OC for cutoff purposes per current TSCHE/APSCHE counselling rules. The predictor returns colleges where the closing rank for your exact category × gender combination is at or above your input rank.",
  },
  {
    q: "Can I use the predictor for branches other than CSE / ECE / EEE / Mech / Civil?",
    a: "Yes. The branch dropdown includes core branches plus newer specializations — CSE (AI & ML), CSE (Data Science), CSE (Cyber Security), AI & DS, Biomedical, Aerospace, Automobile, Chemical, Mining, Metallurgy, Pharm.D and others. Where official cutoffs are available for a given branch in a given year, the predictor uses them; where they are not, the branch is hidden for that state.",
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
