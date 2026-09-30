"use client";
/**
 * Reusable college-search hook: lazily fetches the slim /api/search-index
 * once (on first user intent) and filters it client-side by name / code /
 * district. Used by the global header SearchBar; any other client component
 * that only needs name/code/district autocomplete can reuse it instead of
 * importing the full COLLEGES dataset (CLAUDE.md bundle rule).
 *
 * Components that need richer fields (fee, cutoff, NAAC…) for their own
 * logic — e.g. the compare tool or the universities directory — cannot use
 * the slim index and keep their own data source.
 */
import { useState, useRef, useMemo, useCallback } from "react";
import type { SearchIndexEntry } from "@/app/api/search-index/route";

export type { SearchIndexEntry };

export async function loadCollegeSearchIndex(): Promise<SearchIndexEntry[]> {
  const response = await fetch("/api/search-index");
  if (!response.ok) throw new Error("Search index unavailable");
  const data = await response.json();
  if (!Array.isArray(data.colleges)) throw new Error("Invalid search index");
  return data.colleges;
}

export function filterCollegeSearchIndex(index: SearchIndexEntry[], query: string, limit = 8) {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  return index.filter(c =>
    c.name.toLowerCase().includes(needle) ||
    c.code.toLowerCase().includes(needle) ||
    c.district.toLowerCase().includes(needle)
  ).slice(0, limit);
}

export function useCollegeSearch(query: string, limit = 8) {
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Lazy-load the slim index once, the first time the user shows intent.
  const ensureIndex = useCallback(() => {
    if (loadingRef.current || index) return;
    loadingRef.current = true;
    setLoading(true);
    setError(false);
    loadCollegeSearchIndex()
      .then(setIndex)
      .catch(() => {
        loadingRef.current = false; // HTTP failures must allow retry, too.
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [index]);

  const results = useMemo(() => filterCollegeSearchIndex(index ?? [], query, limit), [query, index, limit]);

  return { results, ensureIndex, loading, error, loaded: index !== null };
}
