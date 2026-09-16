"use client";

import { motion } from "framer-motion";
import { cx } from "@/lib/cx";

/** Barre de progression : un filet d'un pixel, et rien d'autre. */
export function ProgressRail({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-px bg-[var(--hair)]">
      <motion.div
        className="h-full origin-left bg-[var(--color-accent)]"
        initial={false}
        animate={{ scaleX: Math.max(0.004, progress) }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export function TopBar({
  number,
  total,
  kicker,
  timeLeft,
  saved,
  done,
}: {
  number: string;
  total: string;
  kicker: string;
  timeLeft: string;
  saved: boolean;
  done: boolean;
}) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[var(--rail)] pt-5 mix-blend-multiply">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em]">MJAGENCY</span>
        <span aria-hidden className="hidden h-px w-6 bg-[var(--hair-strong)] sm:block" />
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] sm:inline">
          Brief projet
        </span>
      </div>

      <div className="flex items-baseline gap-4 text-right">
        {done ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Brief envoyé
          </span>
        ) : (
          <>
            <span
              className={cx(
                "font-mono text-[11px] tracking-[0.1em] text-[var(--muted)] transition-opacity duration-500",
                saved ? "opacity-100" : "opacity-0",
              )}
            >
              enregistré
            </span>
            <span className="font-mono text-[11px] tabular-nums tracking-[0.16em]">
              <span className="text-[var(--color-accent)]">{number}</span>
              <span className="text-[var(--muted)]"> / {total}</span>
            </span>
            <span className="hidden font-mono text-[11px] tracking-[0.12em] text-[var(--muted)] sm:inline">
              {timeLeft}
            </span>
          </>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {done ? "Brief envoyé." : `Étape ${number} sur ${total} — ${kicker}`}
      </span>
    </header>
  );
}

/** Repères d'architecte : quelques filets et croix, discrets, alignés sur la grille. */
export function GridMarks() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
      <div className="absolute inset-y-0 left-[var(--rail)] w-px hairline-y opacity-60" />
      <div className="absolute inset-y-0 left-[45%] w-px hairline-y opacity-40" />
      <div className="absolute inset-y-0 right-[var(--rail)] w-px hairline-y opacity-60" />
      <Tick className="left-[var(--rail)] top-[22%]" />
      <Tick className="left-[45%] top-[64%]" />
      <Tick className="right-[var(--rail)] top-[38%]" />
    </div>
  );
}

function Tick({ className }: { className: string }) {
  return (
    <span className={cx("absolute block h-2.5 w-2.5 -translate-x-1/2", className)}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--hair-strong)]" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--hair-strong)]" />
    </span>
  );
}
