"use client";

import { cx } from "@/lib/cx";
import { FieldError, MonoLabel } from "./Label";

/** Jusqu'à trois adresses de sites aimés, ajoutées une par une. */
export default function UrlList({
  values,
  onChange,
  label,
  error,
  max = 3,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  label: string;
  error?: string;
  max?: number;
}) {
  const rows = values.length ? values : [""];

  const set = (i: number, v: string) => {
    const next = [...rows];
    next[i] = v;
    onChange(next);
  };

  return (
    <div className="w-full">
      <MonoLabel className="mb-4 block">{label}</MonoLabel>
      <div className="border-t border-[var(--hair)]">
        {rows.map((v, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-[var(--hair)]">
            <span aria-hidden className="font-mono text-[11px] tabular-nums text-[var(--muted)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              value={v}
              onChange={(e) => set(i, e.target.value)}
              data-cursor="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="unsitequejadore.fr"
              aria-label={`Site inspirant ${i + 1}`}
              className="flex-1 border-0 bg-transparent py-3.5 font-ui text-[1.05rem] tracking-[-0.01em] outline-none"
            />
            {rows.length > 1 && (
              <button
                type="button"
                data-cursor="pointer"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                className="font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[#b3261e]"
                aria-label={`Retirer le site ${i + 1}`}
              >
                retirer
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        data-cursor="pointer"
        disabled={rows.length >= max}
        onClick={() => onChange([...rows, ""])}
        className={cx(
          "mt-4 font-ui text-[0.9rem] transition-colors duration-300",
          rows.length >= max
            ? "cursor-not-allowed text-[var(--muted)]/50"
            : "text-[var(--color-ink)] hover:text-[var(--color-accent)]",
        )}
      >
        Ajouter un site
        <span aria-hidden className="ml-2 text-[var(--muted)]">
          +
        </span>
      </button>

      <FieldError message={error} />
    </div>
  );
}
