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
 *
 * The shortlist is loaded lazily — `/api/shortlist` is NOT fetched on
 * mount of the provider. Instead, consumers must call `ensureLoaded()`
 * (typically from a `useEffect` in a component that actually displays
 * shortlist state, e.g. `ShortlistButton`). Pages that never render a
 * shortlist-aware component never trigger the Supabase round-trip.
 *
 * `toggle()` also triggers a load if one hasn't happened yet, so the
 * very first interaction is always correct even if `ensureLoaded()`
 * wasn't called explicitly.
 */
export function useShortlist() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<ShortlistItem[]>([]);
  // Start as "not loading" — we haven't fetched yet, and most pages
  // never will. ensureLoaded() flips this to true while in flight.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track in-flight toggles to prevent race conditions
  const pendingToggles = useRef(new Set<string>());
  // Tracks whether we've initiated/completed the initial fetch for the
  // current user. Reset when the user changes (login/logout).
  const loadStateRef = useRef<{ status: "idle" | "loading" | "loaded"; userId: string | null }>({
    status: "idle",
    userId: null,
  });
  // Force a re-render of consumers when load state changes so isShortlisted
  // re-evaluates after the fetch resolves.
  const [, bumpRender] = useState(0);

  /** Build a unique key for a college+program combo */
  const toggleKey = (slug: string, program?: string | null) => `${slug}::${program || ""}`;

  // Reset cached load state when the auth user changes (sign in / out).
  useEffect(() => {
    if (authLoading) return;
    const currentUserId = user?.id ?? null;
    if (loadStateRef.current.userId !== currentUserId) {
      loadStateRef.current = { status: "idle", userId: currentUserId };
      setItems([]);
      setLoading(false);
      setError(null);
    }
  }, [user, authLoading]);

  /**
   * Idempotently fetch the shortlist for the current user.
   * Safe to call from many components — only the first call hits the API.
   */
  const ensureLoaded = useCallback(async (): Promise<void> => {
    if (authLoading) return;
    if (!user) return;
    if (loadStateRef.current.status !== "idle") return;
    if (loadStateRef.current.userId !== user.id) {
      // userId mismatch — reset and proceed
      loadStateRef.current = { status: "idle", userId: user.id };
    }
    loadStateRef.current = { status: "loading", userId: user.id };
    setLoading(true);
    try {
      const res = await fetch("/api/shortlist");
      const data = await res.json().catch(() => ({}));
      // Guard against the user having signed out while the fetch was in flight
      if (loadStateRef.current.userId === user.id) {
        setItems(data.shortlists || []);
        loadStateRef.current = { status: "loaded", userId: user.id };
      }
    } catch {
      if (loadStateRef.current.userId === user.id) {
        setItems([]);
        // Allow a retry on next call
        loadStateRef.current = { status: "idle", userId: user.id };
      }
    } finally {
      setLoading(false);
      bumpRender(n => n + 1);
    }
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

      // Make sure we know the current shortlist contents before deciding
      // whether this is an add or a remove. Idempotent — only fetches once.
      if (loadStateRef.current.status !== "loaded") {
        await ensureLoaded();
      }

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
    [user, items, ensureLoaded]
  );

  return { items, loading, error, isShortlisted, toggle, ensureLoaded, isLoggedIn: !!user };
}
