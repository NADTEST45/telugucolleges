"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

/** Only allow HTTPS image URLs — blocks data:, javascript:, SVG SSRF, etc. */
function isSafeImageUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    // Block SVG (potential SSRF/XSS vector) and non-image extensions
    const path = parsed.pathname.toLowerCase();
    if (path.endsWith(".svg") || path.endsWith(".html") || path.endsWith(".htm")) return false;
    return true;
  } catch {
    return false;
  }
}

export default function UserNavMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);

  // Close dropdown on outside click + Escape key
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKeyDown);
      // Focus first menu item for keyboard accessibility
      firstItemRef.current?.focus();
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse ml-2" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="ml-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/15 hover:bg-white/25 transition-colors"
      >
        Login
      </Link>
    );
  }

  const initial = (user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="relative ml-2" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className="w-9 h-9 rounded-full bg-[#2e86c1] flex items-center justify-center text-sm font-bold hover:ring-2 hover:ring-white/50 transition-all"
        aria-label="Account menu"
      >
        {isSafeImageUrl(avatarUrl) ? (
          <img
            src={avatarUrl}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[60] text-gray-900"
          role="menu"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-semibold truncate">
              {user.user_metadata?.full_name || "Student"}
            </div>
            <div className="text-xs text-gray-400 truncate">{user.email}</div>
          </div>

          <Link
            ref={firstItemRef}
            href="/account/shortlist"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors focus:bg-gray-50 outline-none"
            role="menuitem"
          >
            <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            My Shortlist
          </Link>

          <button
            onClick={async () => {
              setOpen(false);
              await signOut();
              window.location.href = "/";
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors w-full text-left text-gray-600"
            role="menuitem"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
