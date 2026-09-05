"use client";

import { useEffect, useState } from "react";

/** Preserve server hydration, then refresh time-sensitive labels while open. */
export function useCurrentTime(initialNow: number): number {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
