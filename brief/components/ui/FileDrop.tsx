"use client";

import { useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { ACCEPTED_EXT, MAX_FILES, checkFiles } from "@/lib/schema";
import { MonoLabel } from "./Label";

const kb = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} Ko` : `${(n / 1024 / 1024).toFixed(1)} Mo`);

/**
 * Dépôt de fichiers : logo, charte, ancienne plaquette. Trois au plus,
 * 4 Mo en tout — les mêmes limites que celles vérifiées côté serveur.
 */
export default function FileDrop({
  files,
  onChange,
  label,
}: {
  files: File[];
  onChange: (next: File[]) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const next = [...files, ...Array.from(incoming)].slice(0, MAX_FILES + 1);
    const problem = checkFiles(next);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    onChange(next);
  };

  return (
    <div className="w-full">
      <MonoLabel className="mb-3 block">{label}</MonoLabel>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          accept(e.dataTransfer.files);
        }}
        className={cx(
          "flex items-center justify-between gap-4 border border-dashed px-5 py-6 transition-colors duration-300",
          over ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.04]" : "border-[var(--hair-strong)]",
        )}
      >
        <p className="font-ui text-[0.92rem] leading-snug text-[var(--muted)]">
          Glissez vos fichiers ici — jpg, png, svg ou pdf, trois au maximum, 4 Mo en tout.
        </p>
        <button
          type="button"
          data-cursor="pointer"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-full border border-[var(--hair-strong)] px-4 py-2 font-ui text-[0.85rem] transition-colors duration-300 hover:border-[var(--color-ink)]"
        >
          Parcourir
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXT.join(",")}
          onChange={(e) => {
            accept(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
          aria-label={label}
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 font-mono text-[11px] text-[#b3261e]">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 border-t border-[var(--hair)]">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-4 border-b border-[var(--hair)] py-3"
            >
              <span className="truncate font-ui text-[0.9rem]">{f.name}</span>
              <span className="flex shrink-0 items-center gap-4">
                <span className="font-mono text-[11px] tabular-nums text-[var(--muted)]">
                  {kb(f.size)}
                </span>
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => {
                    setError(null);
                    onChange(files.filter((_, j) => j !== i));
                  }}
                  className="font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[#b3261e]"
                >
                  retirer
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
