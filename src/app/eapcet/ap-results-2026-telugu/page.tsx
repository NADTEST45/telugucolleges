import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import LeadCapture from "@/components/LeadCapture";
import {
  AP_EAPCET_2026_STATS,
  AP_EAPCET_2026_TOPPERS_AGRI,
  AP_EAPCET_2026_TOTAL_QUALIFIED,
} from "@/lib/ap-result-status";

/*
 * Telugu-language edition of /eapcet/ap-results-2026. Facts and numbers are
 * read from the same single source of truth (ap-result-status.ts) so the two
 * language pages can never drift. hreflang alternates tie en ↔ te; each page
 * self-canonicalises to its own URL.
 */

const enUrl = `${SITE_URL}/eapcet/ap-results-2026`;
const url = `${SITE_URL}/eapcet/ap-results-2026-telugu`;

const S = AP_EAPCET_2026_STATS;
const inr = (n: number) => n.toLocaleString("en-IN");

export const metadata: Metadata = {
  title: "ఏపీ ఈఏపీసెట్ 2026 ఫలితాలు విడుదల — ర్యాంక్ కార్డ్, టాపర్లు, తర్వాత ఏమిటి",
  description:
    "ఏపీ ఈఏపీసెట్ 2026 ఫలితాలు 1 జూలై 2026న విడుదలయ్యాయి. ఇంజినీరింగ్‌లో 1,82,317 (70.52%), అగ్రికల్చర్ & ఫార్మసీలో 63,546 (89.59%) మంది అర్హత సాధించారు. cets.apsche.ap.gov.in లో మీ ర్యాంక్ కార్డును డౌన్‌లోడ్ చేసుకోండి, రాష్ట్ర టాపర్లను చూడండి, కౌన్సెలింగ్‌కు సిద్ధం అవ్వండి.",
  alternates: {
    canonical: url,
    languages: {
      "en-IN": enUrl,
      "te-IN": url,
      "x-default": enUrl,
    },
  },
  openGraph: {
    title: "ఏపీ ఈఏపీసెట్ 2026 ఫలితాలు విడుదల — ర్యాంక్ కార్డ్, టాపర్లు",
    description:
      "1 జూలై 2026న విడుదల. ఇంజినీరింగ్‌లో 1,82,317, అగ్రికల్చర్ & ఫార్మసీలో 63,546 మంది అర్హత. ర్యాంక్ కార్డ్ డౌన్‌లోడ్ దశలు, రాష్ట్ర టాపర్లు, కౌన్సెలింగ్ వివరాలు.",
    url,
    siteName: "TeluguColleges.com",
    type: "article",
    locale: "te_IN",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "ఏపీ ఈఏపీసెట్ 2026 ఫలితాలు ఎప్పుడు విడుదలయ్యాయి?",
    a: "APSCHE (JNTU కాకినాడ ద్వారా) ఏపీ ఈఏపీసెట్ 2026 ఫలితాలను 1 జూలై 2026న మధ్యాహ్నం 3:00 గంటలకు విడుదల చేసింది. ఇంజినీరింగ్ స్ట్రీమ్‌లో హాజరైన 2,58,545 మందిలో 1,82,317 మంది అర్హత సాధించారు (70.52% ఉత్తీర్ణత); అగ్రికల్చర్ & ఫార్మసీలో 63,546 మంది అర్హత సాధించారు (89.59%). తుది ర్యాంక్ 75% ఈఏపీసెట్ మార్కులు + 25% ఇంటర్ మార్కులతో లెక్కిస్తారు కాబట్టి, ఇంటర్ సప్లిమెంటరీ, CBSE సవరించిన ఫలితాల కోసం వేచి ఉండటంతో ఫలితం జూన్ 1 నుండి ఆలస్యమైంది.",
  },
  {
    q: "నా ఫలితాన్ని ఎక్కడ చూడాలి, ర్యాంక్ కార్డును ఎలా డౌన్‌లోడ్ చేయాలి?",
    a: "అధికారిక APSCHE CETs పోర్టల్: cets.apsche.ap.gov.in. EAPCET 2026 → Results / Rank Card కు వెళ్లి, హాల్ టికెట్ నంబర్, పుట్టిన తేదీ (లేదా రిజిస్ట్రేషన్ నంబర్)తో లాగిన్ అయి PDF ర్యాంక్ కార్డును డౌన్‌లోడ్ చేసుకోండి. ప్రతి కౌన్సెలింగ్ దశలో ర్యాంక్ కార్డ్ అవసరం కాబట్టి ప్రింట్లు తీసుకోండి.",
  },
  {
    q: "ఏపీ ఈఏపీసెట్ 2026లో టాపర్ ఎవరు?",
    a: "APSCHE ఫలితాల ప్రకటన సందర్భంగా వెల్లడించిన అగ్రికల్చర్ & ఫార్మసీ స్ట్రీమ్ టాపర్లలో — విజయనగరం జిల్లాకు చెందిన Sambangi Jaswanth Naidu 92.5398 కంబైన్డ్ స్కోర్‌తో రాష్ట్ర మొదటి ర్యాంక్ సాధించారు; Kudumula Venkata Mahant Akshaj Reddy (91.8114) రెండో స్థానంలో, Kondreddy Haricadevi Sri Anuhya (కృష్ణా జిల్లా) మూడో స్థానంలో నిలిచారు. ఇంజినీరింగ్ స్ట్రీమ్ వ్యక్తిగత టాపర్లు అధికారిక ప్రకటనలో భాగం కాలేదు.",
  },
  {
    q: "ఫలితం వచ్చాక ఏం చేయాలి?",
    a: "మూడు పనులు: (1) మీ ర్యాంక్ కార్డును వెంటనే డౌన్‌లోడ్ చేసి సేవ్ చేసుకోండి; (2) ఆదాయ ధ్రువీకరణ పత్రం, కుల ధ్రువీకరణ పత్రం, స్టడీ సర్టిఫికెట్లు, TC సిద్ధంగా ఉంచుకోండి; (3) మీ అసలు ర్యాంక్‌తో ఇప్పుడే కాలేజీల ప్రాధాన్య జాబితా రూపొందించుకోండి. మీ ర్యాంక్‌కు అధికారిక కౌన్సెలింగ్‌లో ఏ కాలేజీలు వచ్చాయో మా ఉచిత EAPCET ప్రిడిక్టర్‌లో చూడవచ్చు.",
  },
  {
    q: "ఏపీ ఈఏపీసెట్ 2026 కౌన్సెలింగ్ ఎప్పుడు ప్రారంభమవుతుంది?",
    a: "APSCHE మొదటి దశ షెడ్యూల్‌ను 16 జూలై 2026న అధికారికంగా విడుదల చేసింది (17 జూలైన పత్రికల్లో ప్రచురితమైంది). eapcet-sche.aptonline.in లో రిజిస్ట్రేషన్ & ప్రాసెసింగ్ ఫీజు చెల్లింపు జూలై 20–29, సర్టిఫికెట్ల వెరిఫికేషన్ జూలై 22–31, వెబ్ ఆప్షన్ల నమోదు జూలై 25–31, ఆప్షన్ల మార్పు ఆగస్టు 1, సీట్ కేటాయింపు ఆగస్టు 6, సెల్ఫ్ జాయినింగ్ & రిపోర్టింగ్ ఆగస్టు 7–13, తరగతులు ఆగస్టు 10న ప్రారంభం.",
  },
];

function buildBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "ఏపీ ఈఏపీసెట్ 2026 ఫలితాలు", item: url },
    ],
  };
}

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "te-IN",
    mainEntity: FAQS.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function ApResults2026TeluguPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={[buildBreadcrumbJsonLd(), buildFaqJsonLd()]} />

      <p className="rounded-xl bg-amber-50 p-4 mb-6 text-sm text-amber-900">
        సెప్టెంబర్ 5, 2026 గమనిక: కింద ఉన్న మొదటి దశ కౌన్సెలింగ్ తేదీలు ముగిశాయి.
        ప్రస్తుతం అందుబాటులో ఉన్న దశ, గడువుల కోసం అధికారిక కౌన్సెలింగ్ పోర్టల్‌ను చూడండి.
      </p>
      {/* Breadcrumb + language toggle */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <nav className="text-sm text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-accent">హోమ్</Link>
          <span>/</span>
          <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">ఏపీ ఫలితాలు 2026</span>
        </nav>
        <Link
          href="/eapcet/ap-results-2026"
          hrefLang="en"
          className="text-sm font-medium text-accent border border-accent/30 rounded-full px-3 py-1 hover:bg-accent/5 whitespace-nowrap"
        >
          Read in English →
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        ఏపీ ఈఏపీసెట్ 2026 ఫలితాలు విడుదల — ర్యాంక్ కార్డ్ డౌన్‌లోడ్ చేసుకోండి
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        చివరిగా నవీకరించబడింది: <strong>17 జూలై 2026</strong>. ఏపీ ఈఏపీసెట్ 2026 ఫలితాలు{" "}
        <strong>విడుదలయ్యాయి</strong> — మీ ర్యాంక్ కార్డును{" "}
        <a
          href="https://cets.apsche.ap.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          cets.apsche.ap.gov.in
        </a>{" "}
        లో డౌన్‌లోడ్ చేసుకోండి. ఈ పేజీ ప్రతి అధికారిక అప్‌డేట్‌ను ట్రాక్ చేస్తుంది.
      </p>

      {/* Status banner */}
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-green-50 border border-green-200">
        <h2 className="text-base sm:text-lg font-bold text-green-900 mb-1">
          ప్రస్తుత స్థితి: విడుదల — ర్యాంక్ కార్డులు అందుబాటులో ఉన్నాయి
        </h2>
        <p className="text-sm text-green-900 leading-relaxed">
          ఏపీ ఈఏపీసెట్ 2026 ర్యాంక్ కార్డులు ఇప్పుడు cets.apsche.ap.gov.in లో అందుబాటులో ఉన్నాయి.
          మీ హాల్ టికెట్ నంబర్, పుట్టిన తేదీతో లాగిన్ అయి డౌన్‌లోడ్ చేసుకోండి. కౌన్సెలింగ్
          రిజిస్ట్రేషన్ త్వరలో ప్రారంభమవుతుందని భావిస్తున్నారు — మీ వెబ్ ఆప్షన్ల జాబితాను ఇప్పుడే
          సిద్ధం చేసుకోండి.
        </p>
      </section>

      {/* Primary action */}
      <section className="rounded-xl mb-6 p-4 sm:p-6 bg-white border-2 border-accent/40 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold mb-1">మీ ఏపీ ఈఏపీసెట్ 2026 ఫలితాన్ని చూడండి</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          APSCHE పోర్టల్ నుండి మీ అధికారిక ర్యాంక్ కార్డును డౌన్‌లోడ్ చేసుకోండి, ఆపై కౌన్సెలింగ్
          ప్రారంభమయ్యేలోపు మీ ర్యాంక్‌కు ఏ కాలేజీలు వస్తాయో చూడండి.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <a
            href="https://cets.apsche.ap.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center text-center rounded-lg bg-brand text-white px-4 py-3 font-semibold text-sm hover:opacity-95"
          >
            ర్యాంక్ కార్డ్ డౌన్‌లోడ్
            <span className="text-[11px] font-normal text-blue-100">అధికారిక పోర్టల్ · cets.apsche.ap.gov.in</span>
          </a>
          <Link
            href="/eapcet/web-options-generator"
            className="flex flex-col items-center justify-center text-center rounded-lg border-2 border-accent text-accent px-4 py-3 font-semibold text-sm hover:bg-accent/5"
          >
            నా కాలేజీలను అంచనా వేయండి
            <span className="text-[11px] font-normal text-gray-500">ఉచితం · కేటగిరీ &amp; జెండర్ వారీగా కటాఫ్‌లు</span>
          </Link>
        </div>
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-gray-800 select-none">
            ర్యాంక్ కార్డును ఎలా డౌన్‌లోడ్ చేయాలి (6 దశలు)
          </summary>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 leading-relaxed mt-3">
            <li>
              <a href="https://cets.apsche.ap.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent underline">cets.apsche.ap.gov.in</a>{" "}
              తెరిచి <strong>EAPCET 2026</strong> ఎంచుకోండి.
            </li>
            <li><strong>Results / Rank Card</strong> డౌన్‌లోడ్ లింక్‌పై క్లిక్ చేయండి.</li>
            <li>మీ <strong>హాల్ టికెట్ నంబర్</strong>, <strong>పుట్టిన తేదీ</strong> (లేదా రిజిస్ట్రేషన్ నంబర్)తో లాగిన్ అవ్వండి.</li>
            <li>మీ ఫలితం మొత్తం తుది ర్యాంక్‌తో తెరుచుకుంటుంది. <strong>Download Rank Card</strong> క్లిక్ చేయండి.</li>
            <li>PDF సేవ్ చేసి <strong>2–3 ప్రింట్లు</strong> తీసుకోండి — సర్టిఫికెట్ వెరిఫికేషన్, వెబ్ ఆప్షన్లు, కాలేజీ రిపోర్టింగ్‌కు అవసరం.</li>
            <li>పేరు, హాల్ టికెట్ నంబర్, కేటగిరీ, లోకల్ ఏరియా, మార్కులను వెంటనే సరిచూసుకోండి. తేడా ఉంటే కౌన్సెలింగ్‌కు ముందు APSCHE హెల్ప్‌లైన్‌కు తెలియజేయండి.</li>
          </ol>
          <p className="text-xs text-gray-500 mt-3">
            విడుదలైన మొదటి కొన్ని గంటలు పోర్టల్ నెమ్మదిగా ఉంటుంది — లోడ్ కాకపోతే మళ్లీ మళ్లీ సబ్మిట్
            చేయకుండా కాసేపటి తర్వాత ప్రయత్నించండి.
          </p>
        </details>
      </section>

      {/* Statistics */}
      <section className="mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">ఏపీ ఈఏపీసెట్ 2026 ఫలితాల గణాంకాలు</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-brand">{inr(S.engAppeared)}</div>
            <div className="text-xs text-gray-500 mt-1">ఇంజినీరింగ్ హాజరు</div>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-brand">{inr(S.engQualified)}</div>
            <div className="text-xs text-gray-500 mt-1">ఇంజినీరింగ్ అర్హత · {S.engPassPct}%</div>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-brand">{inr(S.agriQualified)}</div>
            <div className="text-xs text-gray-500 mt-1">అగ్రి &amp; ఫార్మసీ అర్హత · {S.agriPassPct}%</div>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-brand">{inr(AP_EAPCET_2026_TOTAL_QUALIFIED)}</div>
            <div className="text-xs text-gray-500 mt-1">మొత్తం అర్హత (రెండు స్ట్రీమ్‌లు)</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          ఇంజినీరింగ్: {inr(S.engRegistered)} నమోదు, {inr(S.engAppeared)} హాజరు,{" "}
          {inr(S.engQualified)} అర్హత ({S.engPassPct}%). అగ్రికల్చర్ &amp; ఫార్మసీ:{" "}
          {inr(S.agriQualified)} అర్హత ({S.agriPassPct}%). ఆధారం: APSCHE, 1 జూలై 2026.
        </p>
      </section>

      {/* Toppers */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-1">
          ఏపీ ఈఏపీసెట్ 2026 రాష్ట్ర టాపర్లు — అగ్రికల్చర్ &amp; ఫార్మసీ
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          ఫలితాల విడుదల సందర్భంగా APSCHE ప్రకటించిన టాప్ ర్యాంకర్లు. మొదటి ఇద్దరికి కంబైన్డ్ స్కోర్లు
          ప్రకటించారు. (ఇంజినీరింగ్ స్ట్రీమ్ వ్యక్తిగత టాపర్లు అధికారిక ప్రకటనలో భాగం కాలేదు.)
        </p>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-3 font-semibold">ర్యాంక్</th>
                <th className="py-2 pr-3 font-semibold">పేరు</th>
                <th className="py-2 pr-3 font-semibold">జిల్లా</th>
                <th className="py-2 pr-1 font-semibold text-right">స్కోర్</th>
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

      {/* Predictor funnel */}
      <section
        className="rounded-xl sm:rounded-2xl mb-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold text-white mb-1">
            ర్యాంక్ వచ్చిందా? మీ కాలేజీలను ఇప్పుడే చూడండి
          </h2>
          <p className="text-sm text-blue-100 mb-3 leading-relaxed">
            మా ఉచిత ప్రిడిక్టర్‌లో మీ ర్యాంక్ నమోదు చేసి, అధికారిక APSCHE కౌన్సెలింగ్‌లో ఆ ర్యాంక్‌కు
            ఏ బీటెక్ కాలేజీలు వచ్చాయో — కేటగిరీ, జెండర్ వారీగా చూడండి. కౌన్సెలింగ్ ప్రారంభమయ్యేలోపు మీ
            వెబ్ ఆప్షన్ల జాబితాను సిద్ధం చేసుకోండి.
          </p>
          <Link
            href="/eapcet"
            className="inline-block bg-white text-brand font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            EAPCET కాలేజ్ ప్రిడిక్టర్ తెరవండి →
          </Link>
        </div>
      </section>

      {/* WhatsApp counselling alerts */}
      <section className="rounded-xl mb-6 p-4 sm:p-5 bg-white border border-gray-200 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">
          కౌన్సెలింగ్ తేదీలను WhatsApp లో పొందండి
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          ఫలితం వచ్చింది — ఇప్పుడు కౌన్సెలింగ్ వంతు. మీ WhatsApp నంబర్ ఇవ్వండి, ఏపీ ఈఏపీసెట్ 2026
          రిజిస్ట్రేషన్, వెబ్ ఆప్షన్ల తేదీలను APSCHE ప్రకటించిన వెంటనే మేము మెసేజ్ చేస్తాం.
        </p>
        <LeadCapture
          examState="Andhra Pradesh"
          source="ap-result-alert"
          heading="కౌన్సెలింగ్ తేదీలను WhatsApp లో పంపండి"
          subtext="రిజిస్ట్రేషన్, వెబ్ ఆప్షన్లు, సీట్ కేటాయింపు తేదీలు — ప్రకటించిన వెంటనే. స్పామ్ లేదు — కౌన్సెలింగ్ సీజన్‌లో మాత్రమే."
          buttonLabel="నాకు తెలియజేయండి"
          doneLabel="✓ పూర్తయింది — ఏపీ ఈఏపీసెట్ 2026 కౌన్సెలింగ్ తేదీలు వచ్చిన వెంటనే WhatsApp లో తెలియజేస్తాం."
        />
      </section>

      {/* Counselling roadmap */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">ఫలితం తర్వాత: కౌన్సెలింగ్ రోడ్‌మ్యాప్</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          ఏపీ ఈఏపీసెట్ కౌన్సెలింగ్{" "}
          <a
            href="https://eapcet-sche.aptonline.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            eapcet-sche.aptonline.in
          </a>{" "}
          లో జరుగుతుంది — రిజిస్ట్రేషన్ & ఫీజు చెల్లింపు (₹1,200 OC/BC, ₹600 SC/ST), సర్టిఫికెట్
          వెరిఫికేషన్, వెబ్ ఆప్షన్ల నమోదు, సీట్ కేటాయింపు, సెల్ఫ్ రిపోర్టింగ్. APSCHE మొదటి దశ
          కౌన్సెలింగ్ షెడ్యూల్‌ను 16 జూలై 2026న అధికారికంగా విడుదల చేసింది (17 జూలైన పత్రికల్లో
          ప్రచురితమైంది): రిజిస్ట్రేషన్ & ప్రాసెసింగ్ ఫీజు <strong>జూలై 20–29</strong>, అప్‌లోడ్ చేసిన
          సర్టిఫికెట్ల వెరిఫికేషన్ (HLCల వద్ద ఆన్‌లైన్‌లో) <strong>జూలై 22–31</strong>, వెబ్ ఆప్షన్ల నమోదు{" "}
          <strong>జూలై 25–31</strong>, ఆప్షన్ల మార్పు <strong>ఆగస్టు 1</strong>, సీట్ కేటాయింపు విడుదల{" "}
          <strong>ఆగస్టు 6</strong>, కళాశాలలో సెల్ఫ్ జాయినింగ్ & రిపోర్టింగ్ <strong>ఆగస్టు 7–13</strong>,
          తరగతులు ప్రారంభం <strong>ఆగస్టు 10</strong>.
        </p>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>
            → <Link href="/eapcet/ap-cutoff-2026" className="text-accent underline">ఏపీ ఈఏపీసెట్ 2026 కటాఫ్ — బ్రాంచ్ వారీగా అంచనా క్లోజింగ్ ర్యాంకులు</Link>
          </li>
          <li>
            → <Link href="/eapcet/ap-web-options" className="text-accent underline">ఏపీ ఈఏపీసెట్ వెబ్ ఆప్షన్ల నమోదు — దశలవారీ గైడ్</Link>
          </li>
          <li>
            → <Link href="/eapcet/certificate-verification-documents" className="text-accent underline">సర్టిఫికెట్ వెరిఫికేషన్ — పూర్తి పత్రాల జాబితా</Link>
          </li>
        </ul>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-4">తరచుగా అడిగే ప్రశ్నలు</h2>
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
        గణాంకాలు, టాపర్ల వివరాలు APSCHE 1 జూలై 2026న ప్రకటించిన ప్రకారం. అధికారిక సమాచారం కోసం ఎప్పుడూ
        cets.apsche.ap.gov.in పోర్టల్‌లో ధృవీకరించుకోండి.
      </p>
    </main>
  );
}
