/**
 * Inline-SVG cutoff trend sparkline. Pure, server-renderable, no client JS and
 * no third-party library — just markup, so it's CSP-safe (script-src 'self').
 *
 * Plots a branch's closing rank across years. Input `ranks` is expected
 * NEWEST-FIRST (as produced in CollegeDetail's cutoff table); we reverse it so
 * the line reads left→right = oldest→newest. Zeros are treated as missing and
 * the line connects only the years with real data.
 *
 * Rank semantics: LOWER rank = more competitive. We invert the Y axis so an
 * "improving for the student / less competitive" trend (rank going UP, i.e.
 * numerically larger) slopes DOWN, and "getting harder" (rank dropping toward 1)
 * slopes UP — matching the ↑ = harder convention already used on the page.
 */

export interface CutoffSparklineProps {
  /** Closing ranks newest-first; 0 / null means no data for that year. */
  ranks: (number | null)[];
  /** Year labels newest-first, parallel to `ranks` (for the title tooltip). */
  labels?: string[];
  width?: number;
  height?: number;
  className?: string;
}

export default function CutoffSparkline({
  ranks,
  labels,
  width = 64,
  height = 20,
  className = "",
}: CutoffSparklineProps) {
  // Reverse to oldest→newest for left-to-right reading.
  const series = [...ranks].reverse();
  const seriesLabels = labels ? [...labels].reverse() : undefined;

  // Index→value pairs for points that have real data.
  const points = series
    .map((r, i) => ({ i, v: r && r > 0 ? r : null }))
    .filter((p): p is { i: number; v: number } => p.v !== null);

  // Need at least two real points to draw a line.
  if (points.length < 2) return null;

  const values = points.map(p => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1; // avoid /0 when all equal

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const n = series.length;
  const stepX = n > 1 ? w / (n - 1) : 0;

  // x by absolute year slot (so gaps are spaced correctly), y inverted so that
  // a numerically HIGHER rank (less competitive) sits LOWER on the chart.
  const xy = (i: number, v: number) => {
    const x = pad + i * stepX;
    const y = pad + ((v - min) / span) * h; // higher rank → larger y → lower
    return [x, y] as const;
  };

  const linePts = points.map(p => xy(p.i, p.v));
  const path = linePts
    .map(([x, y], idx) => `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  // Direction over the full available window (oldest→newest real points).
  // Lower latest rank than earliest = getting harder.
  const first = values[0];
  const last = values[values.length - 1];
  const diff = last - first;
  const harder = diff < 0; // rank dropped toward 1 → more competitive
  const flat = Math.abs(diff) <= 500;
  const stroke = flat ? "#9ca3af" : harder ? "#ef4444" : "#22c55e";

  const [lastX, lastY] = linePts[linePts.length - 1];

  const title = seriesLabels
    ? points.map(p => `${seriesLabels[p.i] ?? ""}: ${p.v.toLocaleString("en-IN")}`).join("  ·  ")
    : points.map(p => p.v.toLocaleString("en-IN")).join(" → ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`Cutoff trend: ${title}`}
      preserveAspectRatio="none"
    >
      <title>{title}</title>
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="1.8" fill={stroke} />
    </svg>
  );
}
