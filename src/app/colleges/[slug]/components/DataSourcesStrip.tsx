import type { College } from "@/lib/colleges";
import { COLLEGE_DATA_PROVENANCE } from "@/lib/data-provenance";
import ReportDataButton from "./ReportDataButton";

const institutionRankNotes: Record<string, string> = {
  BITS: "NIRF 2025 Engineering ranks BITS Pilani 11; it does not publish a separate Hyderabad-campus rank. Domestic first-degree tuition for the 2026 intake is ₹5.83 lakh in year one and ₹25.13 lakh for eight regular semesters. Summer/Practice School and other charges are additional.",
  AMRT: "NIRF 2025 Engineering ranks Amrita Vishwa Vidyapeetham 23; it does not publish a separate Amaravati-campus rank.",
  GITH: "NIRF 2025 Engineering lists GITAM, Visakhapatnam in 101–150; a separate Hyderabad-campus rank is not established.",
  KLHD: "NIRF 2025 Engineering ranks KL's Vaddeswaram institution 35; a separate Hyderabad-campus rank is not established.",
};

export default function DataSourcesStrip({ college, medical }: { college: College; medical: boolean }) {
  return (
    <div className="bg-white rounded-xl px-4 py-2.5 shadow-sm mb-6 flex flex-col gap-1.5 text-[11px] sm:text-xs text-gray-500">
      <p>
        <span className="font-semibold text-gray-600">Data coverage:</span>{" "}
        {medical ? "Medical fees and admission rules require course-specific confirmation." : "Cutoffs are historical and labelled by year."}{" "}
        Fees, accreditation, scholarships and placement figures have not all been reverified for the current admission cycle. Confirm the applicable year and terms with the institution.
      </p>
      {institutionRankNotes[college.code] && <p>{institutionRankNotes[college.code]}</p>}
      <span>
        Partial dataset audit: {COLLEGE_DATA_PROVENANCE.auditDate} · <ReportDataButton collegeCode={college.code} variant="link" />
      </span>
    </div>
  );
}
