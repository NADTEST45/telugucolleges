"use client";

import { createContext, useContext } from "react";
import type { College } from "@/lib/colleges";

export type CompareCollege = Pick<
  College,
  | "id"
  | "name"
  | "code"
  | "district"
  | "state"
  | "type"
  | "affiliation"
  | "naac"
  | "nba"
  | "year"
  | "fee"
  | "cutoff"
  | "placements"
>;

export interface FeaturedComparison {
  slug: string;
  college1: Pick<College, "code" | "district">;
  college2: Pick<College, "code" | "district">;
}

interface CompareData {
  colleges: CompareCollege[];
  featured: FeaturedComparison[];
}

const CompareDataContext = createContext<CompareData | null>(null);

export function CompareDataProvider({ value, children }: { value: CompareData; children: React.ReactNode }) {
  return <CompareDataContext.Provider value={value}>{children}</CompareDataContext.Provider>;
}

export function useCompareData(): CompareData {
  const value = useContext(CompareDataContext);
  if (!value) throw new Error("CompareDataProvider is missing");
  return value;
}
