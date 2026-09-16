"use client";

import { cx } from "@/lib/cx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "quiet";
};

export default function Button({ variant = "primary", className, children, ...props }: Props) {
  return (
    <button
      data-cursor="pointer"
      className={cx(
        "group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-ui text-[0.95rem] tracking-[-0.01em] transition-[background-color,color,border-color,opacity] duration-300 [transition-timing-function:var(--ease-editorial)] disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)]",
        variant === "ghost" &&
          "border border-[var(--hair-strong)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
        variant === "quiet" && "px-0 py-1 text-[var(--muted)] hover:text-[var(--color-ink)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** La flèche du bouton Continuer : elle avance légèrement au survol. */
export function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-editorial)] group-hover:translate-x-1"
    >
      →
    </span>
  );
}
