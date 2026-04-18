import React from "react";

/**
 * StatCell — single stat used in card footers, detail-page stat strips,
 * best-colleges summary blocks. Ensures consistent label/value hierarchy.
 */
export function StatCell({
  label,
  value,
  unit,
  valueClassName = "",
  small = false,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** Override color of the value, e.g. "text-green-600" */
  valueClassName?: string;
  /** Compact variant for tight grids */
  small?: boolean;
}) {
  return (
    <div className="text-center">
      <div className={`${small ? "text-[11px]" : "text-xs"} text-gray-500 font-medium`}>{label}</div>
      <div className={`${small ? "text-xs sm:text-sm" : "text-sm sm:text-base"} font-bold text-[color:var(--color-brand-700)] ${valueClassName}`}>
        {value}
        {unit && <span className="text-[10px] font-normal text-gray-400 ml-0.5">{unit}</span>}
      </div>
    </div>
  );
}
