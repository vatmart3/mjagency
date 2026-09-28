"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/**
 * La fiche client s'ouvre comme un dossier confidentiel :
 * la couverture pivote sur sa tranche gauche, puis les feuillets glissent.
 */
export function Dossier({ reference, title, children }: { reference: string; title: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(!!reduce);
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setOpen(true), 380);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <div className="perspective relative mt-6 md:mt-10">
      {/* Onglet du dossier */}
      <div className="relative z-0 ml-6 inline-flex h-8 items-center rounded-t-[14px] bg-fog px-4 text-[11px] font-semibold tracking-[0.14em] text-ink-2 uppercase">
        Dossier {reference}
      </div>
      <div className="relative">
        {/* Feuillets */}
        <motion.div
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={open ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="paper-grain relative rounded-[24px] rounded-tl-none bg-white shadow-[var(--shadow-lift)] ring-1 ring-line"
        >
          {children}
        </motion.div>
        {/* Couverture */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="preserve-3d pointer-events-none absolute inset-0 z-20 origin-left rounded-[24px] rounded-tl-none"
            initial={{ rotateY: 0, opacity: 1 }}
            animate={open ? { rotateY: -118, opacity: 0 } : {}}
            transition={{ rotateY: { duration: 0.95, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: 0.55, duration: 0.4 } }}
          >
            <div className="backface-hidden absolute inset-0 flex max-h-[520px] flex-col justify-between rounded-[24px] rounded-tl-none bg-gradient-to-br from-[#f1f1f4] to-[#e4e5ea] p-8 shadow-[var(--shadow-lift)] ring-1 ring-black/5">
              <div className="flex items-start justify-between">
                <span className="rounded-md border-2 border-signal/70 px-2.5 py-1 text-[12px] font-bold tracking-[0.2em] text-signal/80 uppercase">Confidentiel</span>
                <span className="font-mono text-[12px] text-ink-3">MJAGENCY / {reference}</span>
              </div>
              <div>
                <p className="kicker">Dossier de prospection</p>
                <p className="display mt-2 text-[40px] md:text-[56px]">{title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
