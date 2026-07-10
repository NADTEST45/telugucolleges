import type { Metadata } from "next";
import { getCollegesMerged } from "@/lib/colleges-merged";

export const metadata: Metadata = {
  title: "About Us | TeluguColleges",
  description: "About TeluguColleges.com — how we source verified fee, cutoff, and accreditation data for professional colleges in AP & Telangana.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | TeluguColleges",
    description: "About TeluguColleges.com — how we source verified fee, cutoff, and accreditation data for professional colleges in AP & Telangana.",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
};

export default async function AboutPage() {
  // Render the actual count — not a marketing-rounded number. This is a
  // public-facing page and the claim needs to match reality at all times.
  const totalColleges = (await getCollegesMerged()).length;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-3">About TeluguColleges.com</h1>
      <p className="text-gray-500 leading-relaxed mb-8">
        TeluguColleges.com helps students and parents research professional colleges in Andhra Pradesh and Telangana using verified government data.
      </p>

      <section className="bg-white rounded-xl p-7 shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Our Data Sources</h2>
        <div className="space-y-4">
          {[
            ["Official Fee Orders", "Fee data comes directly from government orders — G.O.Ms.No.17 (AP, 2024) and G.O.Ms.No.06 (Telangana, 2026). These are legally binding fee structures."],
            ["EAPCET Counselling Data", "Cutoff ranks are from official counselling data published by TGCHE and APSCHE after each round."],
            ["AICTE / NAAC / NBA", "Accreditation data from official records of the national bodies."],
            ["NIRF Rankings", "Placement statistics reference NIRF submissions where available."],
          ].map(([t, d]) => (
            <div key={t} className="border-l-[3px] border-accent pl-4">
              <div className="font-bold mb-1">{t}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl p-7 shadow-sm">
        <h2 className="text-xl font-bold mb-4">What We Offer</h2>
        <div className="space-y-4">
          {[
            [`${totalColleges} Colleges`, "The most comprehensive directory of professional colleges across AP & Telangana."],
            ["Verified Data", "Every fee and cutoff links to an official source. If we can't verify, we don't publish."],
            ["Comparison Tools", "Side-by-side fee comparison, branch-wise cutoffs, and placement data to help you decide."],
            ["College Admin Portal", "Colleges can log in and update their own data, keeping information current."],
          ].map(([t, d]) => (
            <div key={t} className="border-l-[3px] border-green-500 pl-4">
              <div className="font-bold mb-1">{t}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
