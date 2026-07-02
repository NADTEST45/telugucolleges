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

export function useCollegeSearch(query: string, limit = 8) {
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  const loadingRef = useRef(false);

  // Lazy-load the slim index once, the first time the user shows intent.
  const ensureIndex = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    fetch("/api/search-index")
      .then(res => (res.ok ? res.json() : { colleges: [] }))
      .then((d: { colleges?: SearchIndexEntry[] }) => setIndex(d.colleges ?? []))
      .catch(() => { loadingRef.current = false; }); // allow retry on next focus
  }, []);

  const results = useMemo(() => {
    if (query.length < 2 || !index) return [];
    const needle = query.toLowerCase();
    return index.filter(c =>
      c.name.toLowerCase().includes(needle) ||
      c.code.toLowerCase().includes(needle) ||
      c.district.toLowerCase().includes(needle)
    ).slice(0, limit);
  }, [query, index, limit]);

  return { results, ensureIndex };
}
