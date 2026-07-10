import { EDITABLE_FIELDS, type EditCategory } from "@/lib/supabase/types";

export const MAX_EDIT_VALUE_LENGTH = 500;
export const MAX_EVIDENCE_URL_LENGTH = 500;

const NAAC_GRADES = new Set(["A++", "A+", "A", "B++", "B+", "B", "C", "-"]);

/** Pure validation shared by the edit API and regression tests. */
export function validateEditValue(
  category: EditCategory,
  fieldName: string,
  value: unknown,
  currentYear = new Date().getFullYear(),
): string | null {
  const fieldDef = EDITABLE_FIELDS[category]?.find(field => field.field === fieldName);
  if (!fieldDef) return `Invalid field: ${fieldName}`;

  const valueStr = String(value);
  if (valueStr.length > MAX_EDIT_VALUE_LENGTH) {
    return `Value must be under ${MAX_EDIT_VALUE_LENGTH} characters`;
  }

  if (fieldDef.type === "number") {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return `${fieldDef.label} must be a number`;
    if (numeric < 0) return `${fieldDef.label} cannot be negative`;
    if (fieldName === "year" && (!Number.isInteger(numeric) || numeric < 1800 || numeric > currentYear)) {
      return "Established year must be a real year between 1800 and the current year";
    }
    if (["fee", "goFee"].includes(fieldName) && numeric > 10_000_000) {
      return "Annual fee is outside the supported range";
    }
    if (["placements.avg", "placements.highest"].includes(fieldName) && numeric > 500) {
      return "Package value is outside the supported range";
    }
    if (fieldName === "placements.companies" && (!Number.isInteger(numeric) || numeric > 10_000)) {
      return "Companies visiting must be a whole number under 10,000";
    }
  }

  if (fieldDef.type === "boolean" && value !== "true" && value !== "false") {
    return `${fieldDef.label} must be yes or no`;
  }
  if (fieldName === "naac" && !NAAC_GRADES.has(valueStr.trim())) {
    return "NAAC grade is not recognized";
  }
  if (fieldName === "affiliation" && valueStr.trim().length < 2) {
    return "Affiliation is too short";
  }
  return null;
}

export function validateEvidenceUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > MAX_EVIDENCE_URL_LENGTH) {
    return "A valid official evidence URL is required";
  }
  try {
    const evidence = new URL(value);
    if (evidence.protocol !== "https:") return "Evidence URL must be a valid HTTPS link";
  } catch {
    return "Evidence URL must be a valid HTTPS link";
  }
  return null;
}
