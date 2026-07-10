"use client";

import { createContext, useContext } from "react";

export interface CollegeOption { code: string; name: string }
const Context = createContext<CollegeOption[] | null>(null);

export function CollegeOptionsProvider({ value, children }: { value: CollegeOption[]; children: React.ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCollegeOptions(): CollegeOption[] {
  const value = useContext(Context);
  if (!value) throw new Error("CollegeOptionsProvider is missing");
  return value;
}
