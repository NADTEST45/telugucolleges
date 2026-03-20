import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | TeluguColleges",
  description: "Terms and conditions for using TeluguColleges.com.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#2e86c1]">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Terms of Use</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 20, 2026</p>

      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using TeluguColleges.com (&ldquo;the Site&rdquo;), you agree to these Terms of Use. If you do not agree, please do not use the Site.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Purpose of the Site</h2>
          <p>TeluguColleges.com is an informational resource that aggregates publicly available data about professional colleges in Andhra Pradesh and Telangana. The Site is designed to help students, parents, and education professionals research and compare colleges.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Accuracy of Information</h2>
          <p>While we make every effort to ensure the accuracy of data displayed (fees, cutoff ranks, placements, accreditation status), this information is sourced from official government orders, NIRF submissions, and institutional websites, and may change without notice. <span className="font-semibold text-gray-700">Always verify information directly with the respective college or official body (APSCHE, TSCHE, AICTE) before making admission or financial decisions.</span></p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. No Professional Advice</h2>
          <p>The college predictor tool, cutoff data, and placement statistics are provided for informational purposes only. They do not constitute admission counselling, financial advice, or any guarantee of admission. Actual cutoffs, fees, and outcomes vary each year.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Intellectual Property</h2>
          <p>The design, code, and original content of this Site are the property of TeluguColleges.com. College data sourced from government orders and public records remains in the public domain. You may not scrape, reproduce, or redistribute our content without permission.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. User Conduct</h2>
          <p>You agree not to: attempt to gain unauthorized access to admin areas, submit false or misleading data through edit forms, use automated tools to scrape content at scale, or interfere with the site&apos;s operation or security.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Limitation of Liability</h2>
          <p>TeluguColleges.com is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of or inability to use the Site, or from any inaccuracies in the data presented. This includes but is not limited to decisions made based on fee data, cutoff predictions, or placement statistics.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Changes</h2>
          <p>We reserve the right to modify these terms at any time. Changes take effect immediately upon posting. Continued use of the Site constitutes acceptance of updated terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. Contact</h2>
          <p>Questions about these terms? Reach out via our <Link href="/contact" className="text-[#2e86c1] font-semibold hover:underline">contact page</Link>.</p>
        </section>
      </div>
    </main>
  );
}
