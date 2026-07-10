"use client";

import { createContext, useContext } from "react";
import type { College } from "@/lib/colleges";

const UniversitiesDataContext = createContext<College[] | null>(null);

export function UniversitiesDataProvider({ colleges, children }: { colleges: College[]; children: React.ReactNode }) {
  return <UniversitiesDataContext.Provider value={colleges}>{children}</UniversitiesDataContext.Provider>;
}

export function useUniversitiesData(): College[] {
  const value = useContext(UniversitiesDataContext);
  if (!value) throw new Error("UniversitiesDataProvider is missing");
  return value;
}
