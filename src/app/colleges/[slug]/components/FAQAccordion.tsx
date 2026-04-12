"use client";

import { useState } from "react";

function FAQAccordionItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const contentId = `faq-content-${index}`;
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 text-left hover:bg-gray-50 transition-colors gap-2"
      >
        <span className="font-semibold text-xs sm:text-sm text-gray-800">{question}</span>
        <svg
          className={`shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div id={contentId} role="region" className="px-3 sm:px-5 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-2 sm:pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export type { FAQItem } from "../page";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <FAQAccordionItem key={i} question={faq.question} answer={faq.answer} index={i} />
      ))}
    </div>
  );
}
