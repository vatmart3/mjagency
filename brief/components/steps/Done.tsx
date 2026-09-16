"use client";

import { motion } from "framer-motion";
import type { BriefValues } from "@/lib/schema";
import { recapSentence } from "@/lib/summary";
import { MonoLabel } from "@/components/ui/Label";
import { Em } from "./StepShell";

const NEXT = [
  { n: "01", t: "On étudie votre brief", d: "Ligne par ligne, avec vos inspirations sous les yeux." },
  { n: "02", t: "On vous appelle sous 24 h ouvrées", d: "Au créneau que vous avez choisi, pas un autre." },
  { n: "03", t: "Première direction visuelle offerte", d: "Une piste dessinée pour vous, sans engagement." },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Done({ values }: { values: Partial<BriefValues> }) {
  const firstName = (values.firstName ?? "").trim();

  return (
    <div className="flex w-full flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-7 flex items-baseline gap-4"
      >
        <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--color-accent)]">--</span>
        <span aria-hidden className="h-px w-8 bg-[var(--hair-strong)]" />
        <MonoLabel>Brief envoyé</MonoLabel>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
        className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.03em]"
      >
        C'est reçu{firstName ? ", " : ""}
        {firstName && <Em>{firstName}</Em>}.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease }}
        className="mt-6 max-w-[40ch] font-display text-[clamp(1.25rem,2.4vw,1.7rem)] italic leading-snug text-[var(--color-ink)]"
      >
        {recapSentence(values)}
      </motion.p>

      <motion.ol
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } } }}
        className="mt-12 border-t border-[var(--hair)]"
      >
        {NEXT.map((s) => (
          <motion.li
            key={s.n}
            variants={{
              hidden: { opacity: 0, y: 12 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
            }}
            className="flex items-baseline gap-5 border-b border-[var(--hair)] py-5"
          >
            <span className="font-mono text-[11px] tabular-nums text-[var(--color-accent)]">
              {s.n}
            </span>
            <span>
              <span className="block font-ui text-[1.05rem] tracking-[-0.015em]">{s.t}</span>
              <span className="mt-1 block font-ui text-[0.85rem] text-[var(--muted)]">{s.d}</span>
            </span>
          </motion.li>
        ))}
      </motion.ol>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="mt-10 flex flex-wrap items-center gap-6"
      >
        <a
          href="https://mjagency.eu"
          data-cursor="pointer"
          className="group inline-flex items-center gap-3 rounded-full border border-[var(--hair-strong)] px-7 py-3.5 font-ui text-[0.95rem] transition-colors duration-300 hover:border-[var(--color-ink)]"
        >
          Visiter mjagency.eu
          <span
            aria-hidden
            className="transition-transform duration-500 [transition-timing-function:var(--ease-editorial)] group-hover:translate-x-1"
          >
            →
          </span>
        </a>
        <p className="font-mono text-[11px] tracking-[0.1em] text-[var(--muted)]">
          Un récapitulatif vient de partir sur votre email.
        </p>
      </motion.div>
    </div>
  );
}
