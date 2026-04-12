import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | TeluguColleges",
  description: "Privacy policy for TeluguColleges.com — how we collect, use, store, and protect your data.",
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
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
          <p>TeluguColleges.com (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. By using the Site, you consent to the data practices described in this policy. If you do not agree, please discontinue use of the Site.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
          <p className="mt-1"><span className="font-semibold text-gray-700">2.1 Information collected automatically:</span> When you visit the Site, we automatically collect certain technical information including your IP address (anonymised for analytics), browser type and version, operating system, device type (mobile/desktop), referring URL, pages visited, time and duration of visit, and approximate geographic location (country/state level). This data is collected through analytics tools and server logs.</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">2.2 Cookies and tracking technologies:</span> We use cookies (small text files stored on your device) for essential site functionality, analytics, and advertising. See Section 5 (Cookies) for full details, including how to manage your preferences.</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">2.3 Information you provide:</span> If you create an admin account, submit a data correction, or contact us, we collect the information you voluntarily provide, such as your name, email address, college affiliation, and the content of your submission. We do not require general visitors to register or provide personal information to browse the Site.</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">2.4 Information we do not collect:</span> We do not collect financial information (credit cards, bank details), Aadhaar numbers, phone numbers from general visitors, or biometric data. We do not require social media login.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
          <p>We use collected information for the following purposes: to display and improve college data and site functionality; to serve relevant advertisements that support the free operation of the Site; to monitor site performance, uptime, and security; to prevent abuse such as brute-force login attempts and automated scraping (via rate limiting and CSRF protection); to respond to data correction submissions and contact inquiries; and to generate aggregate, anonymised usage statistics that help us understand how the Site is used.</p>
          <p className="mt-2 font-semibold text-gray-700">We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Advertising & Third-Party Partners</h2>
          <p>We display advertisements to support the free operation of this Site. Our third-party advertising partners may use cookies, web beacons, and similar technologies to collect information about your browsing activity across websites in order to serve ads that are more relevant to your interests (interest-based advertising).</p>
          <p className="mt-2">These third-party ad networks operate independently and have their own privacy policies. We do not provide personally identifiable information to advertisers. You can opt out of personalised advertising by: adjusting your browser cookie settings, visiting the Network Advertising Initiative opt-out page at <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-[#2e86c1] hover:underline">optout.networkadvertising.org</a>, or using the Digital Advertising Alliance opt-out at <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#2e86c1] hover:underline">optout.aboutads.info</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Cookies</h2>
          <p><span className="font-semibold text-gray-700">Essential cookies:</span> Required for core site functionality such as admin authentication sessions. These cannot be disabled without breaking site features.</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">Analytics cookies:</span> Used to understand how visitors interact with the Site (pages viewed, session duration, traffic sources). This data is aggregated and anonymised.</p>
          <p className="mt-2"><span className="font-semibold text-gray-700">Advertising cookies:</span> Set by third-party ad networks to deliver relevant advertisements and track ad campaign performance. These may track your activity across multiple websites.</p>
          <p className="mt-2">You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may impair site functionality. Blocking advertising cookies will result in less relevant ads but will not affect your access to college data.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Data Sources & College Information</h2>
          <p>College information displayed on this Site — including fee structures, EAPCET cutoff ranks, placement statistics, and accreditation data — is sourced from official government orders (G.O.Ms. No.17 AP, G.O.Ms. No.06 Telangana), APSCHE, TSCHE, AICTE, NAAC, NBA, NIRF submissions, and official university websites. This is publicly available government data and does not constitute personal information.</p>
          <p className="mt-2">We strive for accuracy but cannot guarantee that all information is current or error-free. Data may change when new government orders are issued, counselling results are updated, or institutions report revised statistics. Always verify with the relevant institution or authority.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Data Security</h2>
          <p>We implement industry-standard security measures to protect the information we collect, including: HTTPS/TLS encryption for all data in transit; httpOnly, Secure, SameSite cookies for authentication tokens; CSRF (Cross-Site Request Forgery) protection on all API endpoints; rate limiting on authentication endpoints to prevent brute-force attacks; and input validation and field whitelisting on data submission forms.</p>
          <p className="mt-2">While we take reasonable precautions, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security and are not liable for any breach resulting from circumstances beyond our reasonable control.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Data Retention</h2>
          <p>Analytics data is retained in aggregate, anonymised form and is not associated with individual users. Admin account data (email, name, role) is retained for as long as the account is active and deleted upon account removal. Data correction submissions are retained as part of the site&apos;s audit log for accountability and data integrity purposes. Server logs are retained for a limited period for security monitoring.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. Data Sharing & Disclosure</h2>
          <p>We may share information in the following limited circumstances: with service providers (hosting, analytics, advertising) who process data on our behalf and are bound by contractual obligations; if required by law, subpoena, court order, or government request; to protect our rights, property, or safety, or that of our users or the public; and in connection with a merger, acquisition, or sale of assets (in which case you will be notified).</p>
          <p className="mt-2">We do not share admin account credentials or personally identifiable information with colleges, advertisers, or other third parties for their independent use.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">10. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to: request access to the personal data we hold about you; request correction of inaccurate data; request deletion of your data (subject to legal and operational requirements); object to or restrict certain processing of your data; and withdraw consent where processing is based on consent.</p>
          <p className="mt-2">To exercise any of these rights, please contact us at <a href="mailto:contact@telugucolleges.com" className="text-[#2e86c1] font-semibold hover:underline">contact@telugucolleges.com</a>. We will respond within a reasonable timeframe.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">11. Third-Party Links</h2>
          <p>Our Site contains links to external websites including official college portals, APSCHE, TSCHE, AICTE, and other third-party resources. We are not responsible for the privacy practices, content, or security of these external websites. We encourage you to review their privacy policies before providing any personal information.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">12. Children&apos;s Privacy</h2>
          <p>Our service is intended for students (typically aged 16+), parents, and education professionals. We do not knowingly collect personal information from children under 13 years of age. If you are a parent or guardian and believe your child under 13 has provided personal data to us, please contact us immediately and we will take steps to delete such information.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">13. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. For material changes, we may provide additional notice (such as a banner on the Site). Your continued use of the Site after changes are posted constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">14. Governing Law</h2>
          <p>This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000 and its applicable rules. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">15. Contact Us</h2>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us via our <Link href="/contact" className="text-[#2e86c1] font-semibold hover:underline">contact page</Link> or email <a href="mailto:contact@telugucolleges.com" className="text-[#2e86c1] font-semibold hover:underline">contact@telugucolleges.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
