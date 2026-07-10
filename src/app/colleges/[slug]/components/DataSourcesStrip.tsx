import type { College } from "@/lib/colleges";
import { COLLEGE_DATA_PROVENANCE } from "@/lib/data-provenance";
import ReportDataButton from "./ReportDataButton";

export default function DataSourcesStrip({ college, medical }: { college: College; medical: boolean }) {
  const isUniversity = college.type === "Deemed University" || college.type === "Private University";
  const sourceParts = [
    ...(!medical && college.type !== "Deemed University"
      ? [`Cutoffs from official ${college.state === "Telangana" ? "TGCHE/TSCHE" : "APSCHE"} Last Rank Statements`]
      : []),
    ...(!medical && !isUniversity
      ? [`fees from ${college.state === "Telangana" ? "TS AFRC" : "APHERMC"}-regulated government orders`]
      : []),
    ...((college.naac && college.naac !== "-") || college.nirf > 0
      ? ["NAAC/NIRF from official listings"]
      : []),
  ];
  const reviewed = new Date(`${COLLEGE_DATA_PROVENANCE.verifiedAt}T00:00:00+05:30`)
    .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="bg-white rounded-xl px-4 py-2.5 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[11px] sm:text-xs text-gray-500">
      <p>
        <span className="font-semibold text-gray-600">Data sources:</span>{" "}
        {sourceParts.length > 0 ? `${sourceParts.join(" · ")}.` : "Compiled from official publications."}
      </p>
      <span className="shrink-0">
        Reviewed {reviewed} · <ReportDataButton collegeCode={college.code} variant="link" />
      </span>
    </div>
  );
}
