"use client";

import { cx } from "@/lib/cx";

export default function CharCounter({ value, max }: { value: number; max: number }) {
  const near = value > max * 0.86;
  return (
    <span
      className={cx(
        "font-mono text-[11px] tabular-nums tracking-[0.06em]",
        near ? "text-[var(--color-accent)]" : "text-[var(--muted)]",
      )}
    >
      {String(value).padStart(3, "0")} / {max}
    </span>
  );
}
