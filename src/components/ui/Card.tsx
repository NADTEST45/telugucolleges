import React from "react";

/**
 * Card — the single surface primitive. Replaces the ~5 hand-rolled
 * `bg-white rounded-xl shadow-sm` patterns scattered across pages.
 */
export function Card({
  as: Tag = "div",
  accentBorder,
  className = "",
  interactive = false,
  children,
  ...rest
}: {
  as?: React.ElementType;
  /** Left-border accent, e.g. "border-l-[color:var(--color-type-government-600)]" */
  accentBorder?: string;
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      {...rest}
      className={[
        "bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)]",
        interactive ? "hover:shadow-[var(--shadow-card-hover)] transition-shadow" : "",
        accentBorder ? `border-l-4 ${accentBorder}` : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
}
