"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";

export interface ShortlistItem {
  id: string;
  college_slug: string;
  program: string | null;
  created_at: string;
}

/**
 * Hook to manage shortlist state.
 * Fetches the full shortlist on mount (when user is logged in),
 * and provides add/remove/check functions with optimistic updates.
 */
export function useShortlist() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track in-flight toggles to prevent race conditions
  const pendingToggles = useRef(new Set<string>());

  /** Build a unique key for a college+program combo */
  const toggleKey = (slug: string, program?: string | null) => `${slug}::${program || ""}`;

  // Fetch shortlist when user is available
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch("/api/shortlist")
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setItems(data.shortlists || []);
      })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user, authLoading]);

  /** Check if a college (+ optional program) is shortlisted */
  const isShortlisted = useCallback(
    (collegeSlug: string, program?: string | null) => {
      return items.some(
        item =>
          item.college_slug === collegeSlug &&
          (program ? item.program === program : !item.program)
      );
    },
    [items]
  );

  /** Toggle shortlist for a college (+ optional program).
   *  Returns true on success, false on failure. */
  const toggle = useCallback(
    async (collegeSlug: string, program?: string | null): Promise<boolean> => {
      if (!user) return false;

      const key = toggleKey(collegeSlug, program);

      // Prevent concurrent toggles on the same item
      if (pendingToggles.current.has(key)) return false;
      pendingToggles.current.add(key);

      setError(null);

      // Inline shortlisted check (avoids stale closure on isShortlisted)
      const alreadyShortlisted = items.some(
        item =>
          item.college_slug === collegeSlug &&
          (program ? item.program === program : !item.program)
      );

      try {
        if (alreadyShortlisted) {
          // Optimistic remove
          setItems(prev =>
            prev.filter(
              item =>
                !(item.college_slug === collegeSlug &&
                  (program ? item.program === program : !item.program))
            )
          );

          const res = await fetch("/api/shortlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ college_slug: collegeSlug, program: program || null }),
          });

          if (!res.ok) {
            // Revert on failure — refetch full list
            setError("Could not remove. Please try again.");
            const data = await fetch("/api/shortlist").then(r => r.json());
            setItems(data.shortlists || []);
            return false;
          }
          return true;
        } else {
          // Optimistic add
          const tempItem: ShortlistItem = {
            id: `temp-${Date.now()}`,
            college_slug: collegeSlug,
            program: program || null,
            created_at: new Date().toISOString(),
          };
          setItems(prev => [tempItem, ...prev]);

          const res = await fetch("/api/shortlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ college_slug: collegeSlug, program: program || null }),
          });

          if (res.ok) {
            const data = await res.json();
            setItems(prev =>
              prev.map(item => (item.id === tempItem.id ? data.shortlist : item))
            );
            return true;
          } else {
            // Revert + show error
            setItems(prev => prev.filter(item => item.id !== tempItem.id));
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Could not shortlist. Please try again.");
            return false;
          }
        }
      } catch {
        setError("Network error. Please check your connection.");
        // Refetch to get consistent state
        try {
          const data = await fetch("/api/shortlist").then(r => r.json());
          setItems(data.shortlists || []);
        } catch { /* offline — keep current state */ }
        return false;
      } finally {
        pendingToggles.current.delete(key);
      }
    },
    [user, items]
  );

  return { items, loading, error, isShortlisted, toggle, isLoggedIn: !!user };
}
