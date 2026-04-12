import Image from "next/image";
import type { SponsoredCard as SponsoredCardType } from "@/lib/ads";

interface SponsoredCardProps {
  ad: SponsoredCardType;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export default function SponsoredCard({ ad, variant = "horizontal", className = "" }: SponsoredCardProps) {
  if (variant === "vertical") {
    return (
      <div className={`bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 shadow-sm relative ${className}`}>
        <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
          {ad.label || "Sponsored"}
        </span>

        {ad.logoUrl && (
          <Image src={ad.logoUrl} alt={ad.collegeName} width={48} height={48} className="w-12 h-12 rounded-lg object-cover mb-3" loading="lazy" />
        )}

        <div className="text-xs text-indigo-600 font-semibold mb-1">{ad.tagline}</div>
        <div className="font-bold text-gray-900 text-[15px] mb-2 leading-tight">{ad.collegeName}</div>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{ad.description}</p>

        {ad.badgeText && (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 mb-3">
            {ad.badgeText}
          </span>
        )}

        <div className="space-y-1.5 mb-4">
          {ad.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {h}
            </div>
          ))}
        </div>

        <a
          href={ad.ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center bg-indigo-600 text-white font-bold text-sm py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {ad.ctaText}
        </a>
      </div>
    );
  }

  // Horizontal variant (for listing pages / inline)
  return (
    <div className={`bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-xl px-4 sm:px-6 py-4 shadow-sm relative ${className}`}>
      <span className="absolute top-2.5 right-3 bg-indigo-100 text-indigo-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
        {ad.label || "Sponsored"}
      </span>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {ad.logoUrl && (
            <Image src={ad.logoUrl} alt={ad.collegeName} width={48} height={48} className="w-12 h-12 rounded-lg object-cover shrink-0" loading="lazy" />
          )}
          <div className="min-w-0">
            <div className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wide">{ad.tagline}</div>
            <div className="font-bold text-gray-900 text-sm sm:text-[15px] leading-tight mt-0.5">{ad.collegeName}</div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ad.description}</p>
            <div className="flex gap-3 mt-2 flex-wrap">
              {ad.highlights.slice(0, 4).map((h, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] text-gray-600 font-medium flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {ad.badgeText && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
              {ad.badgeText}
            </span>
          )}
          <a
            href={ad.ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block bg-indigo-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            {ad.ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}
