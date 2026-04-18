import { Star } from "lucide-react";

/**
 * Rating — replaces "★".repeat() hack with proper SVG stars.
 */
export function Rating({
  value,
  max = 5,
  size = 14,
  showValue = false,
  className = "",
}: {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const rounded = Math.round(value * 2) / 2; // nearest half
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value.toFixed(1)} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= rounded;
        const half = !filled && i + 0.5 <= rounded;
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={1.5}
            className={filled ? "text-amber-500 fill-amber-500" : half ? "text-amber-500" : "text-gray-300"}
            aria-hidden="true"
          />
        );
      })}
      {showValue && <span className="ml-1 text-sm font-semibold text-gray-700">{value.toFixed(1)}</span>}
    </div>
  );
}
