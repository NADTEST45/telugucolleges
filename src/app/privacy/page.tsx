import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | TeluguColleges",
  description: "Privacy policy for TeluguColleges.com — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#2e86c1]">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Privacy Policy</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 20, 2026</p>

      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>TeluguColleges.com (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects minimal information to provide and improve our service:</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">Usage data:</span> We use analytics to understand how visitors use our site. This includes pages visited, time spent, device type, browser, and approximate location (country/state level). No personally identifiable information is collected through analytics.</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">Cookies:</span> We use essential cookies for site functionality (e.g., admin authentication). Third-party advertising partners may set cookies for ad personalization — see the Advertising section below.</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">Admin accounts:</span> If you are a registered college administrator, we store your email address, name, and role for authentication purposes only.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p>We use collected information to: display and improve college data, serve relevant advertisements, monitor site performance and security, and prevent abuse (e.g., rate limiting). We do not sell, rent, or share personal information with third parties except as described in this policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Advertising</h2>
          <p>We display advertisements to support the free operation of this site. Our advertising partners may use cookies and similar technologies to serve ads based on your browsing activity. You can manage your ad preferences through your browser settings or by visiting the relevant ad network&apos;s opt-out page.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Sources</h2>
          <p>College information displayed on this site (fees, cutoffs, placements, accreditation) is sourced from official government orders, AICTE, NAAC, NBA, NIRF submissions, and official university websites. We strive for accuracy but cannot guarantee that all information is current. Always verify with the respective institution before making admission decisions.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
          <p>We implement reasonable security measures including HTTPS encryption, secure httpOnly cookies, CSRF protection, and rate limiting. Admin authentication tokens are encrypted and stored securely. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Third-Party Links</h2>
          <p>Our site contains links to official college websites, APSCHE, TSCHE, and other third-party sites. We are not responsible for the privacy practices of these external websites. We encourage you to review their privacy policies.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Children&apos;s Privacy</h2>
          <p>Our service is intended for students, parents, and education professionals. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us so we can delete it.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. Contact Us</h2>
          <p>If you have questions about this privacy policy, please reach out via our <Link href="/contact" className="text-[#2e86c1] font-semibold hover:underline">contact page</Link>.</p>
        </section>
      </div>
    </main>
  );
}
