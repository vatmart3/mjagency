"use client";

import { cx } from "@/lib/cx";

/** Petit label technique, en mono capitale — la signature du plan d'architecte. */
export function MonoLabel({
  children,
  className,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "legend" | "div" | "h2";
}) {
  return (
    <Tag
      className={cx(
        "font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 font-mono text-[11px] tracking-[0.06em] text-[#b3261e]">
      {message}
    </p>
  );
}
