import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | TeluguColleges",
  description: "Get in touch with TeluguColleges.com for data corrections, partnerships, or general inquiries.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#2e86c1]">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Contact</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Contact Us</h1>
      <p className="text-sm text-gray-500 mb-8">We&apos;d love to hear from you — whether it&apos;s a data correction, partnership inquiry, or just feedback.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-2xl mb-3">&#x1f4e7;</div>
          <h2 className="font-bold text-base mb-1">General Inquiries</h2>
          <p className="text-sm text-gray-500 mb-3">Questions, feedback, or suggestions about the site.</p>
          <a href="mailto:nadellasujeeth@hotmail.com" className="text-sm text-[#2e86c1] font-semibold hover:underline">nadellasujeeth@hotmail.com</a>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-2xl mb-3">&#x1f527;</div>
          <h2 className="font-bold text-base mb-1">Data Corrections</h2>
          <p className="text-sm text-gray-500 mb-3">Found incorrect fees, cutoffs, or college info? Let us know.</p>
          <a href="mailto:nadellasujeeth@hotmail.com?subject=Data%20Correction%20-%20TeluguColleges" className="text-sm text-[#2e86c1] font-semibold hover:underline">Report a correction</a>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-2xl mb-3">&#x1f91d;</div>
          <h2 className="font-bold text-base mb-1">College Partnerships</h2>
          <p className="text-sm text-gray-500 mb-3">Represent a college? Partner with us to update your profile.</p>
          <a href="mailto:nadellasujeeth@hotmail.com?subject=College%20Partnership%20-%20TeluguColleges" className="text-sm text-[#2e86c1] font-semibold hover:underline">Get in touch</a>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-2xl mb-3">&#x1f4e2;</div>
          <h2 className="font-bold text-base mb-1">Advertising</h2>
          <p className="text-sm text-gray-500 mb-3">Interested in reaching students and parents in AP & Telangana?</p>
          <a href="mailto:nadellasujeeth@hotmail.com?subject=Advertising%20Inquiry%20-%20TeluguColleges" className="text-sm text-[#2e86c1] font-semibold hover:underline">Advertise with us</a>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-700">
        <span className="font-semibold">Response time:</span> We typically respond within 24-48 hours. For urgent data corrections, please include the college name, the incorrect data, and a source link for the correct information.
      </div>
    </main>
  );
}
