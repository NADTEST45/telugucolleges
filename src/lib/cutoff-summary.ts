import type { CollegeCutoffs, YearCutoffs } from "./categories";

/** Only dated 2024+ Telangana records have usable gender provenance here. */
export function getCseSummary(
  state: string,
  historical: CollegeCutoffs | null,
  phaseData: Record<string, YearCutoffs> | null = null,
  phases: { key: string; label: string }[] | null = null,
): { rank: number; label: string } | null {
  if (state !== "Telangana") return null;
  const candidates = [
    ...Object.entries(historical ?? {}).map(([year, data]) => ({ key: year, label: `${year} Final Phase`, data })),
    ...(phases ?? []).map(p => ({ ...p, data: phaseData?.[p.key] })),
  ].filter(p => Number(p.key.slice(0, 4)) >= 2024);
  const order = (key: string) => Number(key.slice(0, 4)) * 10 + (key.includes("phase") ? Number(key.slice(-1)) : 9);
  candidates.sort((a, b) => order(b.key) - order(a.key));
  for (const candidate of candidates) {
    const ranks = candidate.data?.CSE;
    if (ranks?.OC && ranks.OC > 0) return { rank: ranks.OC, label: `${candidate.label} · OC boys` };
    if (ranks?.OC_G && ranks.OC_G > 0) return { rank: ranks.OC_G, label: `${candidate.label} · OC girls` };
  }
  return null;
}
