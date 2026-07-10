"use client";

import { createContext, useContext } from "react";

interface TopCollege {
  id: number;
  name: string;
  code: string;
  slug: string;
  district: string;
  state: "Telangana" | "Andhra Pradesh";
  placements: { avg: number; highest: number; companies: number };
}

export interface MarketingData {
  totalColleges: number;
  totalAP: number;
  totalTS: number;
  totalDeemed: number;
  totalPrivateUniversity: number;
  totalGovernment: number;
  totalPrivate: number;
  withPlacements: number;
  withNirf: number;
  withNaac: number;
  branchCount: number;
  districtCount: number;
  topByPlacements: TopCollege[];
  topByHighest: TopCollege[];
}

const Context = createContext<MarketingData | null>(null);

export function MarketingDataProvider({ value, children }: { value: MarketingData; children: React.ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMarketingData(): MarketingData {
  const value = useContext(Context);
  if (!value) throw new Error("MarketingDataProvider is missing");
  return value;
}
