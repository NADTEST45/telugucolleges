"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/** Slim projection of a College — only the fields the calculator needs. */
export interface SlimCollege {
  /** name */ n: string;
  /** annual convener-quota tuition (₹) */ f: number;
  /** state */ s: "AP" | "TS";
  /** slug */ u: string;
  /** type */ t: string;
}

const YEARS = 4;
const HOSTEL_MIN = 0;
const HOSTEL_MAX = 200000;
const HOSTEL_DEFAULT = 90000;
const HOSTEL_STEP = 5000;
/** Rough annual extras: university exam fees, books, lab records, misc. */
const EXTRAS_PER_YEAR = 12000;

function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export default function FeeCalculatorClient({ colleges }: { colleges: SlimCollege[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SlimCollege | null>(null);
  const [hostel, setHostel] = useState(false);
  const [hostelPerYear, setHostelPerYear] = useState(HOSTEL_DEFAULT);
  const [includeExtras, setIncludeExtras] = useState(true);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return colleges.filter(c => c.n.toLowerCase().includes(q)).slice(0, 12);
  }, [query, colleges]);

  const tuitionTotal = selected ? selected.f * YEARS : 0;
  const hostelTotal = hostel ? hostelPerYear * YEARS : 0;
  const extrasTotal = includeExtras ? EXTRAS_PER_YEAR * YEARS : 0;
  const grandTotal = tuitionTotal + hostelTotal + extrasTotal;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6">
      {/* College picker */}
      <label htmlFor="college-search" className="block text-sm font-semibold text-gray-700 mb-1.5">
        1. Find your college
      </label>
      <div className="relative">
        <input
          id="college-search"
          type="text"
          value={selected ? selected.n : query}
          onChange={e => {
            setSelected(null);
            setQuery(e.target.value);
          }}
          placeholder="Type a college name, e.g. CBIT, Vasavi, RVR…"
          autoComplete="off"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />
        {!selected && matches.length > 0 && (
          <ul
            role="listbox"
            aria-label="College suggestions"
            className="absolute z-10 mt-1 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg divide-y divide-gray-50"
          >
            {matches.map(c => (
              <li key={c.u} role="option" aria-selected="false">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(c);
                    setQuery("");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                >
                  <span className="font-medium text-gray-800">{c.n}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {c.s === "AP" ? "Andhra Pradesh" : "Telangana"} · {inr(c.f)}/yr
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {!selected && query.trim().length >= 2 && matches.length === 0 && (
          <div className="mt-1 text-xs text-gray-400">No colleges match “{query.trim()}”.</div>
        )}
      </div>

      {/* Options */}
      <div className="mt-5 space-y-4">
        <div className="text-sm font-semibold text-gray-700">2. Living costs</div>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={hostel}
            onChange={e => setHostel(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          I&apos;ll stay in a hostel / PG
        </label>
        {hostel && (
          <div className="pl-6">
            <label htmlFor="hostel-cost" className="block text-xs text-gray-500 mb-1">
              Hostel + mess per year: <span className="font-semibold text-gray-700">{inr(hostelPerYear)}</span>
            </label>
            <input
              id="hostel-cost"
              type="range"
              min={HOSTEL_MIN}
              max={HOSTEL_MAX}
              step={HOSTEL_STEP}
              value={hostelPerYear}
              onChange={e => setHostelPerYear(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>₹0</span>
              <span>₹2,00,000</span>
            </div>
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={includeExtras}
            onChange={e => setIncludeExtras(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          Include exam fees, books &amp; misc (~{inr(EXTRAS_PER_YEAR)}/yr)
        </label>
      </div>

      {/* Result */}
      {selected ? (
        <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 sm:p-5">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Estimated 4-year cost — {selected.n}
          </div>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Tuition ({inr(selected.f)} × {YEARS} yrs, convener quota)</dt>
              <dd className="font-semibold text-gray-800">{inr(tuitionTotal)}</dd>
            </div>
            {hostel && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Hostel &amp; mess ({inr(hostelPerYear)} × {YEARS} yrs)</dt>
                <dd className="font-semibold text-gray-800">{inr(hostelTotal)}</dd>
              </div>
            )}
            {includeExtras && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Exam fees, books &amp; misc ({inr(EXTRAS_PER_YEAR)} × {YEARS} yrs)</dt>
                <dd className="font-semibold text-gray-800">{inr(extrasTotal)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
              <dt className="font-bold text-gray-800">Total estimate</dt>
              <dd className="font-bold text-lg text-accent">{inr(grandTotal)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-gray-500">
            If you qualify for fee reimbursement in {selected.s === "AP" ? "Andhra Pradesh" : "Telangana"},
            part or all of the <span className="font-semibold">tuition</span> component ({inr(tuitionTotal)})
            may be reimbursed — hostel and other costs are never covered. See the eligibility notes below.
          </p>
          <div className="mt-3">
            <Link
              href={`/colleges/${selected.u}/fees`}
              className="text-sm text-accent font-semibold hover:underline"
            >
              View full fee details for {selected.n} →
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          Search and select a college above to see its 4-year cost estimate.
        </div>
      )}
    </div>
  );
}
