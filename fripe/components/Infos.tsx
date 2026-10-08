"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import type { Infos } from "@/lib/schema.ts";
import { ETATS, type Etat } from "@/lib/vinted.ts";
import { IconeChevron } from "./icones";
import { classeChamp, Etiquette } from "./ui";

// Le formulaire garde le prix en texte (saisie libre « 49,90 ») ;
// il n'est converti qu'à l'envoi.
export type InfosSaisies = Omit<Infos, "prixAchat" | "etat"> & { prixAchat: string; etat: Etat | "" };

export const INFOS_VIDES: InfosSaisies = {
  marque: "",
  taille: "",
  etat: "",
  defauts: "",
  prixAchat: "",
  mesures: "",
  precisions: "",
};

export function versInfos(s: InfosSaisies): Infos {
  const prix = Number(s.prixAchat.replace(",", ".").replace(/[^\d.]/g, ""));
  return {
    marque: s.marque.trim(),
    taille: s.taille.trim(),
    etat: s.etat || undefined,
    defauts: s.defauts.trim(),
    prixAchat: Number.isFinite(prix) && prix > 0 ? prix : undefined,
    mesures: s.mesures.trim(),
    precisions: s.precisions.trim(),
  };
}

export function depuisInfos(i: Infos): InfosSaisies {
  return {
    ...INFOS_VIDES,
    ...i,
    etat: i.etat ?? "",
    prixAchat: i.prixAchat ? String(i.prixAchat).replace(".", ",") : "",
  };
}

export function nbRenseignees(s: InfosSaisies) {
  return Object.values(s).filter((v) => String(v).trim()).length;
}

export function InfosFacultatives({ valeur, onChange }: { valeur: InfosSaisies; onChange: (v: InfosSaisies) => void }) {
  const [ouvert, setOuvert] = useState(false);
  const id = useId();
  const n = nbRenseignees(valeur);
  const maj = <K extends keyof InfosSaisies>(k: K, v: InfosSaisies[K]) => onChange({ ...valeur, [k]: v });

  return (
    <section className="rounded-carte bg-carte shadow-carte ring-1 ring-ligne">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-controls={`${id}-corps`}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span>
          <span className="block font-semibold">Infos facultatives</span>
          <span className="block text-sm text-encre-2">
            {n ? `${n} renseignée${n > 1 ? "s" : ""} · prioritaires sur l'IA` : "Marque, taille, état, défauts… pour corriger l'IA"}
          </span>
        </span>
        <motion.span animate={{ rotate: ouvert ? 180 : 0 }} className="text-encre-2">
          <IconeChevron />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {ouvert && (
          <motion.div
            id={`${id}-corps`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 px-4 pb-5">
              <div>
                <Etiquette htmlFor={`${id}-marque`}>Marque</Etiquette>
                <input
                  id={`${id}-marque`}
                  className={classeChamp}
                  value={valeur.marque}
                  onChange={(e) => maj("marque", e.target.value)}
                  placeholder="Nike, Sézane…"
                  autoCapitalize="words"
                  maxLength={60}
                />
              </div>
              <div>
                <Etiquette htmlFor={`${id}-taille`}>Taille</Etiquette>
                <input
                  id={`${id}-taille`}
                  className={classeChamp}
                  value={valeur.taille}
                  onChange={(e) => maj("taille", e.target.value)}
                  placeholder="M, 38, W30…"
                  maxLength={40}
                />
              </div>

              <div className="col-span-2">
                <Etiquette>État</Etiquette>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="État">
                  {ETATS.map((e) => {
                    const actif = valeur.etat === e;
                    return (
                      <button
                        key={e}
                        type="button"
                        role="radio"
                        aria-checked={actif}
                        onClick={() => maj("etat", actif ? "" : e)}
                        className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                          actif ? "bg-encre text-papier" : "bg-creux text-encre-2 hover:text-encre"
                        }`}
                      >
                        {e}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-2">
                <Etiquette htmlFor={`${id}-defauts`}>Défauts</Etiquette>
                <textarea
                  id={`${id}-defauts`}
                  className={`${classeChamp} min-h-20 resize-none`}
                  value={valeur.defauts}
                  onChange={(e) => maj("defauts", e.target.value)}
                  placeholder="Petite tache sur la manche gauche, bouloches…"
                  maxLength={500}
                />
              </div>

              <div>
                <Etiquette htmlFor={`${id}-prix`}>Prix d'achat</Etiquette>
                <div className="relative">
                  <input
                    id={`${id}-prix`}
                    className={`${classeChamp} pr-8`}
                    value={valeur.prixAchat}
                    onChange={(e) => maj("prixAchat", e.target.value.replace(/[^\d.,]/g, ""))}
                    placeholder="60"
                    inputMode="decimal"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-encre-3">€</span>
                </div>
              </div>
              <div>
                <Etiquette htmlFor={`${id}-mesures`}>Mesures</Etiquette>
                <input
                  id={`${id}-mesures`}
                  className={classeChamp}
                  value={valeur.mesures}
                  onChange={(e) => maj("mesures", e.target.value)}
                  placeholder="Aisselles 54, long. 70"
                  maxLength={300}
                />
              </div>

              <div className="col-span-2">
                <Etiquette htmlFor={`${id}-precisions`}>Autre précision</Etiquette>
                <input
                  id={`${id}-precisions`}
                  className={classeChamp}
                  value={valeur.precisions}
                  onChange={(e) => maj("precisions", e.target.value)}
                  placeholder="Porté deux fois, taille petit…"
                  maxLength={500}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
