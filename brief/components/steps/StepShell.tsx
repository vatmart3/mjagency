"use client";

import { MonoLabel } from "@/components/ui/Label";

/**
 * Le gabarit d'une étape : un numéro, une question en très grand, la
 * réponse dessous. Toujours la même partition, jamais le même rythme.
 */
export default function StepShell({
  number,
  kicker,
  title,
  lead,
  children,
  footnote,
}: {
  number: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children: React.ReactNode;
  footnote?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col">
      <div className="mb-7 flex items-baseline gap-4">
        <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-[var(--color-accent)]">
          {number}
        </span>
        <span aria-hidden className="h-px w-8 bg-[var(--hair-strong)]" />
        <MonoLabel>{kicker}</MonoLabel>
      </div>

      <h1 className="max-w-[18ch] font-display text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1.04] tracking-[-0.025em]">
        {title}
      </h1>

      {lead && (
        <p className="mt-5 max-w-[46ch] font-ui text-[clamp(0.95rem,1.35vw,1.05rem)] leading-relaxed text-[var(--muted)]">
          {lead}
        </p>
      )}

      <div className="mt-9 space-y-9">{children}</div>

      {footnote && (
        <p className="mt-8 max-w-[52ch] border-t border-[var(--hair)] pt-4 font-ui text-[0.82rem] leading-relaxed text-[var(--muted)]">
          {footnote}
        </p>
      )}
    </div>
  );
}

/** Le mot mis en italique dans les titres : l'accent éditorial. */
export function Em({ children }: { children: React.ReactNode }) {
  return <em className="italic">{children}</em>;
}
