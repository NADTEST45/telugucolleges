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

  // Editorial separation: ads must never read as content. A consistent top
  // rule + "Advertisement" caption gives a uniform trust boundary regardless
  // of which creative (banner / sponsored card) fills the slot.
  return (
    <div className="border-t border-gray-100 pt-3" role="complementary" aria-label="Advertisement">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Advertisement</div>
      {toRender.map((ad: Ad) => {
        if (ad.type === "banner") {
          return <AdBanner key={ad.id} ad={ad} className={className} />;
        }
        if (ad.type === "sponsored_card") {
          return <SponsoredCard key={ad.id} ad={ad} variant={variant} className={className} />;
        }
        return null;
      })}
    </div>
  );
}
