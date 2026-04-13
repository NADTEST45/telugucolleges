"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useShortlist, type ShortlistItem } from "@/lib/useShortlist";

interface ShortlistContextType {
  items: ShortlistItem[];
  loading: boolean;
  error: string | null;
  isShortlisted: (collegeSlug: string, program?: string | null) => boolean;
  toggle: (collegeSlug: string, program?: string | null) => Promise<boolean>;
  isLoggedIn: boolean;
}

const ShortlistContext = createContext<ShortlistContextType>({
  items: [],
  loading: true,
  error: null,
  isShortlisted: () => false,
  toggle: async () => false,
  isLoggedIn: false,
});

export function useShortlistContext() {
  return useContext(ShortlistContext);
}

/**
 * Provides shortlist state to the entire app via context.
 * Wraps the useShortlist hook so all components share the same state.
 * Shows a toast notification on errors.
 */
export default function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const shortlist = useShortlist();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Show toast on error, auto-dismiss after 3s
  useEffect(() => {
    if (shortlist.error) {
      setToastMsg(shortlist.error);
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [shortlist.error]);

  return (
    <ShortlistContext.Provider value={shortlist}>
      {children}
      {/* Error toast — fixed at bottom-center above mobile nav */}
      {toastMsg && (
        <div
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 bg-gray-900 text-white text-sm rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out] max-w-[90vw]"
          role="alert"
        >
          {toastMsg}
        </div>
      )}
    </ShortlistContext.Provider>
  );
}
