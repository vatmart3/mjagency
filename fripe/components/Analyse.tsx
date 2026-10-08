"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Ce qui s'affiche pendant les quelques secondes d'analyse : des étapes qui
// défilent (elles suivent l'ordre réel du travail demandé au modèle) et des
// blocs fantômes qui annoncent la forme du résultat.
const ETAPES = [
  "Je regarde les photos…",
  "Je cherche l'étiquette et la marque…",
  "J'évalue l'état…",
  "Je compare avec la seconde main…",
  "Je rédige le titre…",
  "J'écris la description…",
  "J'ajuste le prix…",
];

export function Analyse({ nbPhotos, apercus }: { nbPhotos: number; apercus: string[] }) {
  const [etape, setEtape] = useState(0);
  const [secondes, setSecondes] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setEtape((e) => Math.min(e + 1, ETAPES.length - 1)), 1700);
    const t2 = setInterval(() => setSecondes((s) => s + 1), 1000);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <div className="flex justify-center -space-x-5 pt-1">
        {apercus.slice(0, 4).map((u, i) => (
          <motion.img
            key={u}
            src={u}
            alt=""
            className="size-14 rounded-xl object-cover shadow-carte ring-2 ring-papier"
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: (i - 1.5) * 6 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>

      <div className="h-7 overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={etape}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-semibold"
          >
            {ETAPES[etape]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="text-center text-sm text-encre-3 tabular-nums">
        {nbPhotos} photo{nbPhotos > 1 ? "s" : ""} · {secondes} s
      </p>

      <div className="space-y-3 pt-2">
        {[64, 140, 120].map((h, i) => (
          <div key={i} className="relative overflow-hidden rounded-carte bg-carte ring-1 ring-ligne" style={{ height: h }}>
            <motion.div
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-creux to-transparent"
              animate={{ x: ["-100%", "220%"] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: i * 0.15 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
