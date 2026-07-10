import type { College } from "@/lib/colleges";
import { fmtFee } from "@/lib/colleges";

export interface FaqItem {
  question: string;
  answer: string;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Programmatic FAQ generation for /compare/[pair] pages.
 *
 * Goals:
 *  - Each Q/A is a real, substantive answer derived from the underlying
 *    data — never a stub. If the data is missing for a metric, we skip
 *    that question rather than emit an "N/A vs N/A" answer.
 *  - Produces 4–6 FAQs per pair, all factual and unique to the pair.
 *  - Output is suitable for both visible HTML rendering and FAQPage
 *    schema.org JSON-LD (rich-result eligibility).
 * ────────────────────────────────────────────────────────────────────── */

const NAAC_RANK: Record<string, number> = {
  "A++": 6,
  "A+": 5,
  "A": 4,
  "B++": 3,
  "B+": 2,
  "B": 1,
};

function naacRank(grade?: string): number {
  if (!grade) return 0;
  return NAAC_RANK[grade.trim()] ?? 0;
}

function inrLakhs(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
}

/**
 * Best CSE-equivalent branch where both colleges have data.
 * Falls back to "CSE" string if neither has cutoffs.
 */
function commonBranch(c1: College, c2: College): string | null {
  for (const b of ["cse", "ece", "eee", "mech", "civil"]) {
    if ((c1.cutoff[b] || 0) > 0 && (c2.cutoff[b] || 0) > 0) return b;
  }
  return null;
}

export function buildCompareFaqs(c1: College, c2: College): FaqItem[] {
  const faqs: FaqItem[] = [];

  // Q1 — Overall verdict (highest-volume query: "is X better than Y")
  {
    const reasons1: string[] = [];
    const reasons2: string[] = [];
    if (c1.placements.avg > 0 && c2.placements.avg > 0) {
      if (c1.placements.avg > c2.placements.avg) {
        reasons1.push(`a higher average placement of ₹${c1.placements.avg} LPA vs ₹${c2.placements.avg} LPA`);
      } else if (c2.placements.avg > c1.placements.avg) {
        reasons2.push(`a higher average placement of ₹${c2.placements.avg} LPA vs ₹${c1.placements.avg} LPA`);
      }
    }
    if (c1.cutoff.cse > 0 && c2.cutoff.cse > 0) {
      if (c1.cutoff.cse < c2.cutoff.cse) {
        reasons1.push(`a tougher (better) EAPCET CSE cutoff at ${c1.cutoff.cse.toLocaleString("en-IN")} vs ${c2.cutoff.cse.toLocaleString("en-IN")}`);
      } else if (c2.cutoff.cse < c1.cutoff.cse) {
        reasons2.push(`a tougher (better) EAPCET CSE cutoff at ${c2.cutoff.cse.toLocaleString("en-IN")} vs ${c1.cutoff.cse.toLocaleString("en-IN")}`);
      }
    }
    if (naacRank(c1.naac) > naacRank(c2.naac) && c1.naac && c1.naac !== "-") {
      reasons1.push(`a higher NAAC grade (${c1.naac} vs ${c2.naac || "—"})`);
    } else if (naacRank(c2.naac) > naacRank(c1.naac) && c2.naac && c2.naac !== "-") {
      reasons2.push(`a higher NAAC grade (${c2.naac} vs ${c1.naac || "—"})`);
    }
    if (c1.nirf > 0 && c2.nirf > 0) {
      if (c1.nirf < c2.nirf) reasons1.push(`a better NIRF rank (${c1.nirf} vs ${c2.nirf})`);
      else if (c2.nirf < c1.nirf) reasons2.push(`a better NIRF rank (${c2.nirf} vs ${c1.nirf})`);
    }

    let answer: string;
    if (reasons1.length > reasons2.length) {
      answer = `On balance, ${c1.name} (${c1.code}) edges out ${c2.name} (${c2.code}) on most measurable signals: it has ${reasons1.slice(0, 3).join(", ")}.`;
      if (reasons2.length) answer += ` ${c2.code}'s relative strengths include ${reasons2.slice(0, 2).join(" and ")}.`;
      answer += ` That said, the right choice depends on your branch preference, fee budget, and city/campus fit — not just headline numbers.`;
    } else if (reasons2.length > reasons1.length) {
      answer = `On balance, ${c2.name} (${c2.code}) edges out ${c1.name} (${c1.code}) on most measurable signals: it has ${reasons2.slice(0, 3).join(", ")}.`;
      if (reasons1.length) answer += ` ${c1.code}'s relative strengths include ${reasons1.slice(0, 2).join(" and ")}.`;
      answer += ` That said, the right choice depends on your branch preference, fee budget, and city/campus fit — not just headline numbers.`;
    } else {
      answer = `${c1.code} and ${c2.code} are closely matched on placements, cutoffs and accreditation. The decision usually comes down to specific branch strength, total fee outlay, and campus location. Compare the EAPCET cutoffs for your target branch and the four-year fee total before deciding.`;
    }

    faqs.push({
      question: `Which is better: ${c1.name} or ${c2.name}?`,
      answer,
    });
  }

  // Q2 — Fee comparison (high-volume "X fees vs Y fees")
  if (c1.fee > 0 && c2.fee > 0) {
    const cheaper = c1.fee < c2.fee ? c1 : c2;
    const pricier = c1.fee < c2.fee ? c2 : c1;
    const fourYearGap = (pricier.fee - cheaper.fee) * 4;
    faqs.push({
      question: `What is the fee difference between ${c1.code} and ${c2.code}?`,
      answer: `${c1.name} charges ${fmtFee(c1.fee)} per year and ${c2.name} charges ${fmtFee(c2.fee)} per year. Over the four-year B.Tech programme, ${cheaper.code} works out to ${inrLakhs(cheaper.fee * 4)} total versus ${inrLakhs(pricier.fee * 4)} at ${pricier.code} — a difference of ${inrLakhs(fourYearGap)}. These figures are convenor-quota tuition fees and exclude special fees, hostel and management-quota premiums.`,
    });
  }

  // Q3 — Placements
  if (c1.placements.avg > 0 && c2.placements.avg > 0) {
    const better = c1.placements.avg > c2.placements.avg ? c1 : c2;
    const other = c1.placements.avg > c2.placements.avg ? c2 : c1;
    const bestHighest = Math.max(c1.placements.highest, c2.placements.highest);
    const bestHighestCollege = c1.placements.highest >= c2.placements.highest ? c1 : c2;
    faqs.push({
      question: `Which has better placements: ${c1.code} or ${c2.code}?`,
      answer: `${better.name} reports a higher average package at ₹${better.placements.avg} LPA, compared with ₹${other.placements.avg} LPA at ${other.name}. ${bestHighest > 0 ? `The highest package on record is ₹${bestHighest} LPA at ${bestHighestCollege.code}.` : ""}${better.placements.companies > 0 && other.placements.companies > 0 ? ` ${better.code} hosted ${better.placements.companies}+ recruiters; ${other.code} hosted ${other.placements.companies}+.` : ""} Placement averages can swing year to year — check the most recent placement brochure for branch-wise breakdowns.`,
    });
  }

  // Q4 — EAPCET cutoff for the most popular shared branch
  {
    const branch = commonBranch(c1, c2);
    if (branch) {
      const r1 = c1.cutoff[branch];
      const r2 = c2.cutoff[branch];
      const better = r1 < r2 ? c1 : c2;
      const otherC = r1 < r2 ? c2 : c1;
      const betterRank = r1 < r2 ? r1 : r2;
      const otherRank = r1 < r2 ? r2 : r1;
      faqs.push({
        question: `What is the EAPCET ${branch.toUpperCase()} cutoff at ${c1.code} vs ${c2.code}?`,
        answer: `For ${branch.toUpperCase()}, ${better.name} closed at rank ${betterRank.toLocaleString("en-IN")} (last admitted) while ${otherC.name} closed at ${otherRank.toLocaleString("en-IN")} in the most recent EAPCET counselling. Lower closing rank means more competitive admission. Closing ranks vary by category, gender and round — these are general (OC) last-round figures and your category cutoff may be more lenient.`,
      });
    }
  }

  // Q5 — Accreditation / NAAC
  if ((c1.naac && c1.naac !== "-") || (c2.naac && c2.naac !== "-")) {
    const naac1 = c1.naac && c1.naac !== "-" ? c1.naac : "not accredited";
    const naac2 = c2.naac && c2.naac !== "-" ? c2.naac : "not accredited";
    const nbaLine = `${c1.code} is ${c1.nba ? "" : "not "}NBA accredited; ${c2.code} is ${c2.nba ? "" : "not "}NBA accredited.`;
    faqs.push({
      question: `Is ${c1.code} or ${c2.code} better accredited?`,
      answer: `${c1.name} holds NAAC ${naac1}; ${c2.name} holds NAAC ${naac2}. ${nbaLine} ${c1.nirf > 0 || c2.nirf > 0 ? `On NIRF, ${c1.code} ranks ${c1.nirf > 0 ? `#${c1.nirf}` : "unranked"} and ${c2.code} ranks ${c2.nirf > 0 ? `#${c2.nirf}` : "unranked"}.` : ""} Accreditation matters for campus recruiting and credit transfer — A+ and above is the practical threshold most top recruiters look for.`,
    });
  }

  // Q6 — Location / affiliation summary
  {
    const sameDistrict = c1.district === c2.district;
    const sameState = c1.state === c2.state;
    let answer: string;
    if (sameDistrict) {
      answer = `Both ${c1.code} and ${c2.code} are based in ${c1.district}, ${c1.state}. ${c1.code} is affiliated to ${c1.affiliation}${c1.year ? ` and was established in ${c1.year}` : ""}; ${c2.code} is affiliated to ${c2.affiliation}${c2.year ? ` (established ${c2.year})` : ""}. Same-city campuses make on-campus visits and direct comparisons easier.`;
    } else if (sameState) {
      answer = `${c1.name} is in ${c1.district}, ${c1.state} (affiliated to ${c1.affiliation}${c1.year ? `, established ${c1.year}` : ""}); ${c2.name} is in ${c2.district}, ${c2.state} (affiliated to ${c2.affiliation}${c2.year ? `, established ${c2.year}` : ""}). Both are within ${c1.state} but in different cities, so factor travel and accommodation costs into your decision.`;
    } else {
      answer = `${c1.name} is in ${c1.district}, ${c1.state} (affiliated to ${c1.affiliation}${c1.year ? `, established ${c1.year}` : ""}); ${c2.name} is in ${c2.district}, ${c2.state} (affiliated to ${c2.affiliation}${c2.year ? `, established ${c2.year}` : ""}). The two are in different states, which affects EAPCET counselling eligibility — AP and TG run separate counselling processes.`;
    }
    faqs.push({
      question: `Where are ${c1.code} and ${c2.code} located, and how are they affiliated?`,
      answer,
    });
  }

  return faqs;
}

/** schema.org FAQPage JSON-LD object — pass directly to JSON.stringify. */
export function buildFaqJsonLd(faqs: FaqItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
