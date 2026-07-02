"use client";
import type { AdmissionExam } from "@/lib/admission-exams";
import type { MedicalAdmissionInfo } from "@/lib/medical-admission";

/**
 * "Admission" tab of CollegeDetail (medical/NEET variant + own-exam variant).
 * Extracted verbatim from CollegeDetail.tsx; `medical` / `admissionExam` are
 * looked up server-side and passed down as props.
 */
export default function AdmissionTab({ collegeName, medical, admissionExam }: { collegeName: string; medical: MedicalAdmissionInfo | null; admissionExam: AdmissionExam | null }) {
  if (medical) {
    return (
      <div className="space-y-6">
        {/* NEET Overview */}
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold">{medical.exam} — {medical.examFullName}</h2>
              <p className="text-sm text-gray-500 mt-1">Admission to {collegeName} is through NEET-UG, not EAPCET/EAMCET</p>
            </div>
            <a href={medical.primaryUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-dark transition-colors shrink-0">
              Counselling Portal
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[
              ["Qualifying Exam", "NEET-UG (single national exam)"],
              ["Counselling Authority", medical.primaryCounsellor],
              ["All India Quota (15%)", medical.aiqAuthority],
              ["Eligibility", "10+2 with Physics, Chemistry, Biology + qualified NEET-UG"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* EAPCET clarification */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
          <p className="font-semibold text-amber-800 mb-1">MBBS is filled through NEET, not EAPCET</p>
          <p className="text-sm text-amber-700">
            AP/TS EAPCET (EAMCET) is only for engineering, pharmacy, and agriculture courses. MBBS seats are allotted
            solely on a valid NEET-UG score and rank. Do not register on EAPCET counselling portals for an MBBS seat.
          </p>
        </section>

        {/* Seat Quotas */}
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">How Seats Are Filled</h2>
          <div className="space-y-3">
            {medical.quotas.map(q => (
              <div key={q.label} className="border-l-4 border-brand bg-blue-50/50 rounded-r-lg px-4 py-3">
                <div className="text-sm font-semibold text-brand">{q.label}</div>
                <div className="text-sm text-gray-600 mt-0.5">{q.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Counselling Process */}
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Counselling Process</h3>
            <p className="text-sm text-gray-600 bg-blue-50 rounded-lg px-4 py-2.5">{medical.counsellingSummary}</p>
          </div>
          <p className="text-xs text-gray-500">
            NEET-UG and counselling schedules are set by NTA, MCC, and {medical.authority}. Dates and seat matrices change each year —
            always verify on the official portal ({medical.officialUrl}) before registering.
          </p>
        </section>
      </div>
    );
  }

  if (!admissionExam) return null;

  return (
    <div className="space-y-6">
      {/* Exam Overview */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold">{admissionExam.examName} — {admissionExam.examFullName}</h2>
            <p className="text-sm text-gray-500 mt-1">Entrance exam for {collegeName}</p>
          </div>
          <a href={admissionExam.officialUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-dark transition-colors shrink-0">
            Official Website
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {[
            ["Exam Mode", admissionExam.mode],
            ["Duration", admissionExam.duration],
            ["Application Fee", admissionExam.applicationFee],
            ["Subjects", admissionExam.subjects],
            ["Eligibility", admissionExam.eligibility],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Exam Schedule */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">2026 Exam Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Phase</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Exam Dates</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Last Date to Apply</th>
                {admissionExam.phases.some(p => p.resultDate) && (
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Result</th>
                )}
              </tr>
            </thead>
            <tbody>
              {admissionExam.phases.map((phase, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 px-3 font-semibold">{phase.phase}</td>
                  <td className="py-3 px-3 text-brand font-semibold">{phase.examDates}</td>
                  <td className="py-3 px-3">{phase.lastDateToApply}</td>
                  {admissionExam.phases.some(p => p.resultDate) && (
                    <td className="py-3 px-3">{phase.resultDate || "—"}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        {admissionExam.alternateEntry && (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Alternative Entry</h3>
            <p className="text-sm text-gray-600 bg-green-50 rounded-lg px-4 py-2.5">{admissionExam.alternateEntry}</p>
          </div>
        )}
        {admissionExam.counsellingNote && (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Counselling Process</h3>
            <p className="text-sm text-gray-600 bg-blue-50 rounded-lg px-4 py-2.5">{admissionExam.counsellingNote}</p>
          </div>
        )}
        <p className="text-xs text-gray-500">Dates and details are sourced from official notifications and may change. Always verify on the official website before applying.</p>
      </section>
    </div>
  );
}
