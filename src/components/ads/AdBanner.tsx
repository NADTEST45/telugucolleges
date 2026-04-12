import type { BannerAd } from "@/lib/ads";
import Image from "next/image";

interface AdBannerProps {
  ad: BannerAd;
  className?: string;
}

export default function AdBanner({ ad, className = "" }: AdBannerProps) {
  return (
    <div className={`relative group ${className}`}>
      <a
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <Image
          src={ad.imageUrl}
          alt={ad.altText}
          width={728}
          height={90}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </a>
      <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
        {ad.label || "Sponsored"}
      </span>
    </div>
  );
}
