// Unified multi-program data layer for TeluguColleges.com

import goData from "./go_data.json";
import mbaData from "./mba_data.json";
import mcaData from "./mca_data.json";
import mtechData from "./mtech_data.json";
import apBtechData from "./ap_btech_data.json";
import apMtechData from "./ap_mtech_data.json";
import apBbaBcaData from "./ap_bba_bca_data.json";
import apBarchData from "./ap_barch_data.json";
import apMbaData from "./ap_mba_data.json";
import apMcaData from "./ap_mca_data.json";

export interface ProgramEntry {
  sno: number;
  code: string;
  name: string;
  fee: number;
  district?: string;
  programme?: string;
  go?: string;
}

export interface ProgramInfo {
  id: string;
  name: string;
  shortName: string;
  state: "Telangana" | "Andhra Pradesh";
  goNumber: string;
  goDate: string;
  blockPeriod: string;
  entries: ProgramEntry[];
  note?: string;
}

export const PROGRAMS: ProgramInfo[] = [
  {
    id: "ts-btech",
    name: "B.E./B.Tech",
    shortName: "B.Tech",
    state: "Telangana",
    goNumber: "G.O.Ms.No.06",
    goDate: "04.03.2026",
    blockPeriod: "2025-26 to 2027-28",
    entries: (goData as ProgramEntry[]),
  },
  {
    id: "ts-mba",
    name: "MBA",
    shortName: "MBA",
    state: "Telangana",
    goNumber: "G.O.Ms.No.39",
    goDate: "18.10.2022",
    blockPeriod: "2022-23 to 2024-25 (extended to 2025-26 via G.O.Ms.No.26)",
    entries: (mbaData as ProgramEntry[]),
    note: "Fees continued for AY 2025-26 per G.O.Ms.No.26 dated 30.06.2025",
  },
  {
    id: "ts-mca",
    name: "MCA",
    shortName: "MCA",
    state: "Telangana",
    goNumber: "G.O.Ms.No.39",
    goDate: "18.10.2022",
    blockPeriod: "2022-23 to 2024-25 (extended to 2025-26 via G.O.Ms.No.26)",
    entries: (mcaData as ProgramEntry[]),
    note: "Fees continued for AY 2025-26 per G.O.Ms.No.26 dated 30.06.2025",
  },
  {
    id: "ts-mtech",
    name: "M.E./M.Tech",
    shortName: "M.Tech",
    state: "Telangana",
    goNumber: "G.O.Ms.No.38",
    goDate: "18.10.2022",
    blockPeriod: "2022-23 to 2024-25 (extended to 2025-26 via G.O.Ms.No.26)",
    entries: (mtechData as ProgramEntry[]),
    note: "Fees continued for AY 2025-26 per G.O.Ms.No.26 dated 30.06.2025",
  },
  {
    id: "ap-btech",
    name: "B.Tech",
    shortName: "B.Tech",
    state: "Andhra Pradesh",
    goNumber: "G.O.Ms.No.17",
    goDate: "07.07.2024",
    blockPeriod: "2024-25 (Convenor Quota)",
    entries: (apBtechData as ProgramEntry[]),
  },
  {
    id: "ap-mtech",
    name: "M.Tech",
    shortName: "M.Tech",
    state: "Andhra Pradesh",
    goNumber: "G.O.Ms.No.62",
    goDate: "10.09.2024",
    blockPeriod: "2024-25",
    entries: (apMtechData as ProgramEntry[]),
    note: "Tentative, subject to outcome of Writ Appeals before APHC",
  },
  {
    id: "ap-barch",
    name: "B.Arch",
    shortName: "B.Arch",
    state: "Andhra Pradesh",
    goNumber: "G.O.Ms.No.17",
    goDate: "07.07.2024",
    blockPeriod: "2024-25 (Convenor Quota)",
    entries: (apBarchData as ProgramEntry[]),
  },
  {
    id: "ap-mba",
    name: "MBA",
    shortName: "MBA",
    state: "Andhra Pradesh",
    goNumber: "G.O.Ms.No.49",
    goDate: "28.07.2016",
    blockPeriod: "2016-17 to 2018-19 (continued for subsequent years)",
    entries: (apMbaData as ProgramEntry[]),
    note: "AFRC-determined fees for private unaided colleges. Fees may have been revised for later blocks.",
  },
  {
    id: "ap-mca",
    name: "MCA",
    shortName: "MCA",
    state: "Andhra Pradesh",
    goNumber: "G.O.Ms.No.49",
    goDate: "28.07.2016",
    blockPeriod: "2016-17 to 2018-19 (continued for subsequent years)",
    entries: (apMcaData as ProgramEntry[]),
    note: "AFRC-determined fees for private unaided colleges. Fees may have been revised for later blocks.",
  },
];

export function fmtFee(fee: number | undefined): string {
  if (!fee) return "—";
  return "₹" + fee.toLocaleString("en-IN");
}

export function getProgramById(id: string): ProgramInfo | undefined {
  return PROGRAMS.find(p => p.id === id);
}

export function getProgramsByState(state: "Telangana" | "Andhra Pradesh"): ProgramInfo[] {
  return PROGRAMS.filter(p => p.state === state);
}

export function getAllProgramStats() {
  return {
    totalPrograms: PROGRAMS.length,
    totalEntries: PROGRAMS.reduce((sum, p) => sum + p.entries.length, 0),
    tsPrograms: PROGRAMS.filter(p => p.state === "Telangana"),
    apPrograms: PROGRAMS.filter(p => p.state === "Andhra Pradesh"),
    tsBtech: PROGRAMS.find(p => p.id === "ts-btech")!,
    apBtech: PROGRAMS.find(p => p.id === "ap-btech")!,
  };
}
