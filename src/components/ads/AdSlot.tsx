import { getAdsForSlot, type Ad } from "@/lib/ads";
import AdBanner from "./AdBanner";
import SponsoredCard from "./SponsoredCard";

interface AdSlotProps {
  slot: string;
  state?: string;
  slug?: string;
  variant?: "horizontal" | "vertical";
  className?: string;
  /** For listing_mid: render multiple ads inline between items */
  max?: number;
}

export default function AdSlot({ slot, state, slug, variant = "horizontal", className = "", max }: AdSlotProps) {
  const ads = getAdsForSlot(slot, { state, slug });
  if (ads.length === 0) return null;

  const toRender = max ? ads.slice(0, max) : ads;

  return (
    <>
      {toRender.map((ad: Ad) => {
        if (ad.type === "banner") {
          return <AdBanner key={ad.id} ad={ad} className={className} />;
        }
        if (ad.type === "sponsored_card") {
          return <SponsoredCard key={ad.id} ad={ad} variant={variant} className={className} />;
        }
        return null;
      })}
    </>
  );
}
