/** Admin user roles */
export type UserRole = "super_admin" | "college_admin" | "marketing";

/** Edit request status */
export type EditStatus = "pending" | "approved" | "rejected";

/** Edit field categories */
export type EditCategory = "fees" | "placements" | "basic_info";

/** Admin user record */
export interface AdminUser {
  id: string;
  email: string;
  college_code: string | null;   // null for super_admin
  college_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

/** Edit request record */
export interface EditRequest {
  id: string;
  college_code: string;
  college_name: string;
  submitted_by: string;          // admin_user id
  submitted_by_email: string;
  category: EditCategory;
  field_name: string;
  old_value: string;
  new_value: string;
  change_reason: string;
  status: EditStatus;
  reviewer_id: string | null;
  reviewer_notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Approved college data override */
export interface CollegeOverride {
  college_code: string;
  field_name: string;
  value: string;
  updated_at: string;
  updated_by: string;
}

/** Editable fields definition */
export const EDITABLE_FIELDS: Record<EditCategory, { field: string; label: string; type: "number" | "text" | "boolean" }[]> = {
  fees: [
    { field: "fee", label: "Annual Tuition Fee (₹)", type: "number" },
    { field: "goFee", label: "GO Fee / Convener Quota (₹)", type: "number" },
  ],
  placements: [
    { field: "placements.avg", label: "Average Package (LPA)", type: "number" },
    { field: "placements.highest", label: "Highest Package (₹ Lakhs)", type: "number" },
    { field: "placements.companies", label: "Companies Visiting", type: "number" },
  ],
  basic_info: [
    { field: "naac", label: "NAAC Grade", type: "text" },
    { field: "nba", label: "NBA Accredited", type: "boolean" },
    { field: "year", label: "Established Year", type: "number" },
    { field: "affiliation", label: "Affiliation / University", type: "text" },
  ],
};
