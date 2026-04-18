import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none rounded-[var(--radius-button)]";

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs min-h-[36px]",
  md: "px-4 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-brand-700)] text-white hover:bg-[color:var(--color-brand-800)] shadow-sm",
  secondary:
    "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)] hover:bg-[color:var(--color-brand-100)]",
  ghost:
    "bg-gray-100 text-gray-700 hover:bg-gray-200",
  danger:
    "bg-[color:var(--color-danger-50)] text-[color:var(--color-danger-600)] hover:bg-red-100",
  outline:
    "bg-white text-[color:var(--color-brand-700)] border border-[color:var(--color-brand-200)] hover:bg-[color:var(--color-brand-50)]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...rest
}: AnchorProps) {
  // Use next/link for internal, plain <a> for external
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} {...rest} className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest} className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}>
      {children}
    </a>
  );
}
