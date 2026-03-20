import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | TeluguColleges",
  description: "Terms and conditions for using TeluguColleges.com — data accuracy, intellectual property, limitation of liability, and user conduct.",
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
          <p>By accessing, browsing, or using TeluguColleges.com (&ldquo;the Site&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, our <Link href="/privacy" className="text-[#2e86c1] font-semibold hover:underline">Privacy Policy</Link>, and all applicable laws. If you do not agree with any part of these terms, you must discontinue use of the Site immediately.</p>
          <p className="mt-2">We reserve the right to update or modify these Terms at any time without prior notice. Changes take effect immediately upon posting. Your continued use of the Site following any changes constitutes acceptance of the revised Terms. We recommend reviewing this page periodically.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Eligibility & Age Requirements</h2>
          <p>The Site is intended for students, parents, guardians, and education professionals in India. You must be at least 13 years of age to use this Site. If you are between 13 and 18 years of age, you may use the Site only under the supervision of a parent or legal guardian who agrees to be bound by these Terms. By using the Site, you represent and warrant that you meet these eligibility requirements.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Purpose of the Site</h2>
          <p>TeluguColleges.com is a free informational resource that aggregates publicly available data about professional colleges (engineering, pharmacy, and medical) in Andhra Pradesh and Telangana. The Site is designed to help users research and compare colleges using data from official government orders, AICTE, NAAC, NBA, NIRF, APSCHE, and TSCHE sources.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Accuracy of Information & Data Disclaimer</h2>
          <p>While we make every reasonable effort to ensure the accuracy of data displayed on the Site — including fees, EAPCET cutoff ranks, placements, accreditation status, and exam dates — this information is sourced from government orders, official notifications, NIRF submissions, and institutional websites, and <span className="font-semibold text-gray-700">may change without notice</span>.</p>
          <p className="mt-2 font-semibold text-gray-700">We do not guarantee the accuracy, completeness, reliability, or timeliness of any information on the Site. Fee structures are subject to revision by government authorities and institutions. Cutoff ranks vary by year, category, gender, and counselling phase. Placement statistics are approximate and based on publicly available reports.</p>
          <p className="mt-2">You must always verify information directly with the respective college, university, APSCHE, TSCHE, or AICTE before making any admission, financial, or career decisions. TeluguColleges.com shall not be held responsible for any admission rejection, financial loss, or adverse outcome arising from reliance on information presented on this Site.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. No Professional Advice</h2>
          <p>The college predictor tool, cutoff comparisons, fee data, and placement statistics are provided for general informational purposes only. They do not constitute and shall not be construed as admission counselling, educational guidance, financial advice, or any guarantee of admission to any institution. Actual cutoffs, fees, and placement outcomes vary each academic year. You are solely responsible for your admission and educational decisions.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
          <p>The design, code, layout, graphics, logos, compilation of data, and all original content of this Site are the intellectual property of TeluguColleges.com and are protected by applicable copyright and trademark laws. College data sourced from government orders and public records remains in the public domain.</p>
          <p className="mt-2">You may not, without our express prior written permission: reproduce, duplicate, copy, sell, resell, or exploit any portion of the Site or its content for commercial purposes; use data mining, robots, scrapers, or similar automated tools to collect or extract data from the Site; frame or mirror any part of the Site on any other server or website; or create derivative works based on the Site&apos;s design or content.</p>
          <p className="mt-2">Limited, non-commercial use such as sharing individual college pages or screenshots for personal research is permitted, provided you attribute the source to TeluguColleges.com.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. User Accounts & Registration</h2>
          <p>Certain features of the Site (such as college admin dashboards and data submission) require registration and authentication. If you create an account, you are responsible for: maintaining the confidentiality of your login credentials, all activities that occur under your account, and notifying us immediately of any unauthorized access.</p>
          <p className="mt-2">We reserve the right to suspend or terminate any user account at our sole discretion, without notice, for any reason including but not limited to: violation of these Terms, submission of false or misleading data, or activity that compromises the security or integrity of the Site.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. User Conduct & Prohibited Activities</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <p className="mt-2">Attempting to gain unauthorized access to any part of the Site, admin areas, databases, servers, or connected systems; submitting false, misleading, or fraudulent data through edit or submission forms; using automated scripts, bots, scrapers, or crawlers to access or collect data from the Site at scale; interfering with, disrupting, or placing an undue burden on the Site&apos;s infrastructure or security systems; impersonating any person, institution, or entity, or falsely claiming affiliation with any college or official body; uploading or transmitting viruses, malware, or any harmful code; using the Site to engage in any activity that violates applicable Indian law; harvesting email addresses or personal information of other users; or attempting to reverse-engineer, decompile, or disassemble any part of the Site&apos;s software.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. User-Generated Content</h2>
          <p>If you submit content to the Site (including but not limited to data corrections, reviews, or feedback), you grant TeluguColleges.com a non-exclusive, royalty-free, perpetual, irrevocable, worldwide license to use, modify, display, distribute, and create derivative works from such content for the purpose of operating and improving the Site.</p>
          <p className="mt-2">You represent that any content you submit is accurate to the best of your knowledge, does not infringe any third-party intellectual property rights, and does not contain defamatory, obscene, or unlawful material. We reserve the right to review, edit, or remove any user-submitted content at our sole discretion and without notice.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">10. Advertising & Sponsored Content</h2>
          <p>The Site displays advertisements and may feature sponsored college listings to support its free operation. Sponsored or promoted content will be identified where applicable. The inclusion of advertisements does not imply endorsement of the advertised institution, product, or service by TeluguColleges.com. We are not responsible for the content, accuracy, or practices of third-party advertisers.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">11. Third-Party Links & External Websites</h2>
          <p>The Site contains links to external websites including official college portals, APSCHE, TSCHE, AICTE, and other third-party resources. These links are provided for convenience and reference only. TeluguColleges.com does not control, endorse, or assume responsibility for the content, privacy policies, or practices of any third-party websites. Accessing external links is at your own risk.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">12. Disclaimer of Warranties</h2>
          <p className="font-semibold text-gray-700">THE SITE AND ALL CONTENT, TOOLS, DATA, AND SERVICES PROVIDED ON OR THROUGH THE SITE ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, AND NON-INFRINGEMENT.</p>
          <p className="mt-2">We do not warrant that: the Site will be uninterrupted, timely, secure, or error-free; the results obtained from the college predictor or any other tool will be accurate or reliable; any errors in the data or software will be corrected; or the Site is free of viruses or harmful components.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">13. Limitation of Liability</h2>
          <p className="font-semibold text-gray-700">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TELUGUCOLLEGES.COM, ITS OWNER, OPERATORS, AFFILIATES, AND CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING FROM OR IN CONNECTION WITH:</p>
          <p className="mt-2">Your use of or inability to use the Site; any inaccuracies in fee data, cutoff ranks, placement statistics, or other college information; decisions made based on the college predictor tool or any data presented on the Site; admission rejections, financial losses, or career outcomes resulting from reliance on the Site&apos;s content; unauthorized access to or alteration of your data; or any other matter relating to the Site.</p>
          <p className="mt-2">This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, or otherwise) and even if we have been advised of the possibility of such damages.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">14. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless TeluguColleges.com, its owner, operators, affiliates, and contributors from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorney&apos;s fees) arising from: your use of the Site; your violation of these Terms; your violation of any third-party rights; or any content you submit through the Site.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">15. Copyright & Infringement Claims</h2>
          <p>If you believe that any content on the Site infringes your copyright or other intellectual property rights, please contact us at <a href="mailto:nadellasujeeth@hotmail.com" className="text-[#2e86c1] font-semibold hover:underline">nadellasujeeth@hotmail.com</a> with: a description of the copyrighted work; the location (URL) of the infringing content on our Site; your contact information; and a statement that you have a good-faith belief that the use is not authorized. We will investigate and take appropriate action.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">16. Content Moderation & Removal</h2>
          <p>We reserve the right, at our sole discretion and without obligation, to review, edit, refuse to post, or remove any content from the Site for any reason, including content that we determine violates these Terms, is inaccurate, or is otherwise objectionable. We may exercise these rights without prior notice to you.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">17. Service Availability & Modifications</h2>
          <p>We reserve the right to modify, suspend, or discontinue the Site (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Site. We do not guarantee that the Site will be available at all times or in all locations.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">18. Governing Law & Jurisdiction</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">19. Severability</h2>
          <p>If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">20. Entire Agreement</h2>
          <p>These Terms, together with the <Link href="/privacy" className="text-[#2e86c1] font-semibold hover:underline">Privacy Policy</Link>, constitute the entire agreement between you and TeluguColleges.com regarding your use of the Site, and supersede all prior agreements and understandings.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">21. Contact</h2>
          <p>If you have questions or concerns about these Terms of Use, please contact us via our <Link href="/contact" className="text-[#2e86c1] font-semibold hover:underline">contact page</Link> or email <a href="mailto:nadellasujeeth@hotmail.com" className="text-[#2e86c1] font-semibold hover:underline">nadellasujeeth@hotmail.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
