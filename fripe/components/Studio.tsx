"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ecrireReglages, lireReglages, type FicheHistorique } from "@/lib/db.ts";
import { REGLAGES_DEFAUT, type Reglages as TReglages } from "@/lib/schema.ts";
import { Historique } from "./Historique";
import { IconeEtincelle, IconeHistorique, IconeReglages } from "./icones";
import { NouvelleAnnonce } from "./NouvelleAnnonce";
import { Reglages } from "./Reglages";
import { FournisseurToasts } from "./ui";

type Onglet = "nouvelle" | "historique" | "reglages";

const ONGLETS: { id: Onglet; libelle: string; Icone: typeof IconeEtincelle }[] = [
  { id: "nouvelle", libelle: "Annonce", Icone: IconeEtincelle },
  { id: "historique", libelle: "Historique", Icone: IconeHistorique },
  { id: "reglages", libelle: "Réglages", Icone: IconeReglages },
];

export function Studio() {
  const [onglet, setOnglet] = useState<Onglet>("nouvelle");
  const [reglages, setReglages] = useState<TReglages>(REGLAGES_DEFAUT);
  const [aOuvrir, setAOuvrir] = useState<FicheHistorique | null>(null);
  const [versionHistorique, setVersionHistorique] = useState(0);

  useEffect(() => {
    lireReglages().then(setReglages).catch(() => {});
  }, []);

  function changerReglages(r: TReglages) {
    setReglages(r);
    ecrireReglages(r).catch(() => {});
  }

  function aller(o: Onglet) {
    setOnglet(o);
    window.scrollTo({ top: 0 });
  }

  return (
    <FournisseurToasts>
      <div className="relative z-10 mx-auto min-h-dvh max-w-xl px-4">
        <header className="pt-safe sticky select-none top-0 z-20 -mx-4 bg-papier/80 px-4 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between">
            <button type="button" onClick={() => aller("nouvelle")} className="flex items-baseline" aria-label="FRIPE, accueil">
              <span
                className="font-display text-[26px] font-bold tracking-[-0.04em]"
                style={{ fontVariationSettings: '"SOFT" 100, "opsz" 72' }}
              >
                FRIPE
              </span>
              <span className="font-display text-[26px] font-bold text-accent">.</span>
            </button>
            <span className="text-[12px] font-semibold tracking-wide text-encre-3 uppercase">pour Vinted</span>
          </div>
        </header>

        <main className="pt-2 pb-[calc(env(safe-area-inset-bottom)+96px)]">
          {/* L'onglet Annonce reste monté : changer d'onglet ne perd ni photos ni brouillon. */}
          <div hidden={onglet !== "nouvelle"}>
            <NouvelleAnnonce reglages={reglages} aOuvrir={aOuvrir} onEnregistre={() => setVersionHistorique((v) => v + 1)} />
          </div>
          {onglet === "historique" && (
            <Historique
              version={versionHistorique}
              onOuvrir={(f) => {
                setAOuvrir(f);
                aller("nouvelle");
              }}
            />
          )}
          {onglet === "reglages" && (
            <Reglages valeur={reglages} onChange={changerReglages} onHistoriqueVide={() => setVersionHistorique((v) => v + 1)} />
          )}
        </main>
      </div>

      <nav
        className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-ligne bg-papier/95 backdrop-blur-xl"
        aria-label="Navigation principale"
      >
        <ul className="mx-auto grid h-16 max-w-xl grid-cols-3">
          {ONGLETS.map(({ id, libelle, Icone }) => {
            const actif = onglet === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => aller(id)}
                  aria-current={actif ? "page" : undefined}
                  className={`relative flex size-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                    actif ? "text-encre" : "text-encre-3"
                  }`}
                >
                  {actif && (
                    <motion.span
                      layoutId="onglet-actif"
                      className="absolute top-0 h-0.5 w-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icone taille={22} strokeWidth={actif ? 2.1 : 1.75} />
                  {libelle}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </FournisseurToasts>
  );
}
