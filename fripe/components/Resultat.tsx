"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatPrix, toutCopier } from "@/lib/format.ts";
import type { Annonce } from "@/lib/schema.ts";
import { DESCRIPTION_MAX, TITRE_CIBLE, TITRE_MAX } from "@/lib/vinted.ts";
import { copier } from "@/lib/clipboard.ts";
import { IconeAlerte, IconeEtincelle, IconePlus, IconeRelancer } from "./icones";
import { Bouton, BoutonCopier, classeChamp, useToast } from "./ui";

const apparition = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
});

export function Resultat({
  annonce,
  onChange,
  onRegenerer,
  onNouveau,
  regeneration,
  couverture,
}: {
  annonce: Annonce;
  onChange: (a: Annonce) => void;
  onRegenerer: (consigne: string) => void;
  onNouveau: () => void;
  regeneration: boolean;
  couverture?: string;
}) {
  const [feuille, setFeuille] = useState(false);

  return (
    <div className={`space-y-3 transition-opacity ${regeneration ? "pointer-events-none opacity-50" : ""}`}>
      {/* En-tête : couverture + nom */}
      <motion.section {...apparition(0)} className="flex items-start gap-3.5 rounded-carte bg-carte p-3 shadow-carte ring-1 ring-ligne">
        {couverture && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={couverture} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold tracking-wide text-encre-3 uppercase">Nom</div>
          <ZoneAuto
            valeur={annonce.nom}
            onChange={(nom) => onChange({ ...annonce, nom: nom.replace(/\n/g, " ") })}
            className="font-display text-[21px] leading-tight font-semibold tracking-[-0.02em]"
            libelle="Nom de l'article"
          />
          <Confiance niveau={annonce.confiance} />
        </div>
        <BoutonCopier texte={annonce.nom} quoi="Nom" />
      </motion.section>

      {annonce.a_verifier.length > 0 && (
        <motion.section {...apparition(1)} className="rounded-carte bg-alerte-fond p-4 text-alerte ring-1 ring-alerte/20">
          <div className="mb-1.5 flex items-center gap-2 font-semibold">
            <IconeAlerte taille={18} /> À vérifier avant de publier
          </div>
          <ul className="space-y-1 pl-6 text-[15px] leading-snug">
            {annonce.a_verifier.map((p, i) => (
              <li key={i} className="list-disc">
                {p}
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      <Bloc i={2} titre="Titre" compteur={{ n: annonce.titre.length, cible: TITRE_CIBLE, max: TITRE_MAX }} copie={<BoutonCopier texte={annonce.titre} quoi="Titre" />}>
        <ZoneAuto
          valeur={annonce.titre}
          onChange={(titre) => onChange({ ...annonce, titre: titre.replace(/\n/g, " ") })}
          className="text-[17px] leading-snug font-semibold"
          libelle="Titre"
        />
      </Bloc>

      <Bloc
        i={3}
        titre="Description"
        compteur={{ n: annonce.description.length, max: DESCRIPTION_MAX }}
        copie={<BoutonCopier texte={annonce.description} quoi="Description" feminin />}
      >
        <ZoneAuto
          valeur={annonce.description}
          onChange={(description) => onChange({ ...annonce, description })}
          className="text-base leading-relaxed"
          libelle="Description"
        />
      </Bloc>

      <Prix i={4} annonce={annonce} onChange={onChange} />

      <Fiche i={5} annonce={annonce} />

      <motion.div {...apparition(6)} className="grid grid-cols-2 gap-2.5 pt-2">
        <Bouton variante="contour" onClick={() => setFeuille(true)} disabled={regeneration}>
          <IconeRelancer taille={18} /> Régénérer
        </Bouton>
        <Bouton variante="contour" onClick={onNouveau}>
          <IconePlus taille={18} /> Nouvel article
        </Bouton>
      </motion.div>

      {/* Barre fixe : l'action qu'on fait à chaque fois. */}
      <div className="h-20" aria-hidden />
      <div className="pointer-events-none fixed inset-x-0 z-30 bg-gradient-to-t from-papier via-papier/80 to-transparent px-4 pt-8 pb-3" style={{ bottom: "calc(env(safe-area-inset-bottom) + 64px)" }}>
        <div className="pointer-events-auto mx-auto max-w-xl">
          <BoutonCopier
            texte={toutCopier(annonce)}
            libelle="Tout copier"
            quoi="Annonce"
            feminin
            variante="accent"
            taille="lg"
            className="w-full"
          />
        </div>
      </div>

      <FeuilleRegeneration
        ouverte={feuille}
        onFermer={() => setFeuille(false)}
        onValider={(c) => {
          setFeuille(false);
          onRegenerer(c);
        }}
      />
    </div>
  );
}

function Bloc({
  i,
  titre,
  compteur,
  copie,
  children,
}: {
  i: number;
  titre: string;
  compteur?: { n: number; cible?: number; max: number };
  copie: React.ReactNode;
  children: React.ReactNode;
}) {
  const ton = !compteur
    ? ""
    : compteur.n > compteur.max
      ? "text-alerte font-bold"
      : compteur.cible && compteur.n > compteur.cible
        ? "text-alerte"
        : "text-encre-3";
  return (
    <motion.section {...apparition(i)} className="rounded-carte bg-carte p-4 shadow-carte ring-1 ring-ligne">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="flex items-baseline gap-2 text-[12px] font-semibold tracking-wide text-encre-3 uppercase">
          {titre}
          {compteur && (
            <span className={`text-[12px] tabular-nums normal-case ${ton}`}>
              {compteur.n}/{compteur.max}
            </span>
          )}
        </h2>
        {copie}
      </div>
      {children}
    </motion.section>
  );
}

// Zone de texte qui grandit avec son contenu, éditable sur place.
function ZoneAuto({
  valeur,
  onChange,
  className,
  libelle,
}: {
  valeur: string;
  onChange: (v: string) => void;
  className?: string;
  libelle: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [valeur]);
  return (
    <textarea
      ref={ref}
      value={valeur}
      onChange={(e) => onChange(e.target.value)}
      aria-label={libelle}
      rows={1}
      spellCheck
      className={`-mx-1 block w-[calc(100%+0.5rem)] resize-none overflow-hidden rounded-lg bg-transparent px-1 py-0.5 outline-none focus:bg-creux/60 ${className}`}
    />
  );
}

function Prix({ i, annonce, onChange }: { i: number; annonce: Annonce; onChange: (a: Annonce) => void }) {
  const p = annonce.prix;
  const marge = p.conseille > 0 ? Math.round((1 - p.plancher / p.conseille) * 100) : 0;
  const majPrix = (champ: "conseille" | "plancher", n: number) => onChange({ ...annonce, prix: { ...p, [champ]: n } });

  // Position des deux prix sur la fourchette du marché, pour la jauge.
  const min = Math.min(p.marche_bas, p.plancher);
  const max = Math.max(p.marche_haut, p.conseille);
  const pos = (v: number) => (max > min ? ((v - min) / (max - min)) * 100 : 50);

  return (
    <motion.section {...apparition(i)} className="overflow-hidden rounded-carte bg-encre p-4 text-papier shadow-carte">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[12px] font-semibold tracking-wide text-papier/60 uppercase">Prix conseillé</h2>
        <BoutonCopier texte={String(p.conseille).replace(".", ",")} quoi="Prix" variante="accent" />
      </div>

      <div className="flex items-end justify-between gap-4">
        <label className="flex items-baseline">
          <span className="sr-only">Prix conseillé en euros</span>
          <ChampPrix
            valeur={p.conseille}
            onChange={(n) => majPrix("conseille", n)}
            className="bg-transparent font-display text-[64px] leading-none font-semibold tracking-[-0.04em] tabular-nums outline-none"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
            marge={0.05}
          />
          <span className="font-display text-4xl font-semibold text-accent">€</span>
        </label>
        <div className="pb-1.5 text-right text-sm leading-tight">
          <div className="text-papier/60">Accepte jusqu'à</div>
          <label className="inline-flex items-baseline gap-0.5 text-xl font-semibold">
            <span className="sr-only">Prix plancher en euros</span>
            <ChampPrix
              valeur={p.plancher}
              onChange={(n) => majPrix("plancher", n)}
              className="bg-transparent text-right tabular-nums outline-none"
              marge={0.4}
            />
            €
          </label>
          {marge > 0 && <div className="text-xs text-papier/50">marge de négo −{marge} %</div>}
        </div>
      </div>

      <div className="mt-5" aria-label={`Marché : de ${formatPrix(p.marche_bas)} à ${formatPrix(p.marche_haut)}`}>
        <div className="relative h-1.5 rounded-full bg-papier/15">
          <div
            className="absolute inset-y-0 rounded-full bg-papier/35"
            style={{ left: `${pos(p.marche_bas)}%`, right: `${100 - pos(p.marche_haut)}%` }}
          />
          <motion.div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-papier ring-2 ring-encre"
            animate={{ left: `${pos(p.plancher)}%` }}
          />
          <motion.div
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-encre"
            animate={{ left: `${pos(p.conseille)}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-papier/50 tabular-nums">
          <span>Marché {formatPrix(p.marche_bas)}</span>
          <span>{formatPrix(p.marche_haut)}</span>
        </div>
      </div>

      <p className="mt-3 text-[14px] leading-snug text-papier/75">{p.justification}</p>
    </motion.section>
  );
}

// Saisie d'un prix en texte libre (« 12,5 ») : le texte vit localement,
// le nombre remonte dès qu'il est valide.
function ChampPrix({
  valeur,
  onChange,
  className,
  style,
  marge,
}: {
  valeur: number;
  onChange: (n: number) => void;
  className?: string;
  style?: React.CSSProperties;
  marge: number;
}) {
  const [texte, setTexte] = useState(String(valeur).replace(".", ","));
  const [enSaisie, setEnSaisie] = useState(false);
  const affiche = enSaisie ? texte : String(valeur).replace(".", ",");
  return (
    <input
      value={affiche}
      inputMode="decimal"
      onFocus={() => {
        setTexte(String(valeur).replace(".", ","));
        setEnSaisie(true);
      }}
      onBlur={() => setEnSaisie(false)}
      onChange={(e) => {
        const t = e.target.value.replace(/[^\d.,]/g, "");
        setTexte(t);
        const n = Number(t.replace(",", "."));
        if (t && Number.isFinite(n) && n >= 0) onChange(n);
      }}
      className={className}
      style={{ ...style, width: `${Math.max(1, affiche.length) + marge}ch` }}
    />
  );
}

function Fiche({ i, annonce }: { i: number; annonce: Annonce }) {
  const toast = useToast();
  const f = annonce.fiche;
  const lignes: [string, string, boolean][] = [
    ["Catégorie", f.categorie, true],
    ["Marque", f.marque, true],
    ["Taille", f.taille, true],
    ["État", f.etat, false],
    ["Couleur", f.couleurs.join(", "), true],
    ["Matière", f.matiere, true],
  ];
  return (
    <motion.section {...apparition(i)} className="rounded-carte bg-carte shadow-carte ring-1 ring-ligne">
      <h2 className="px-4 pt-4 pb-1 text-[12px] font-semibold tracking-wide text-encre-3 uppercase">Fiche Vinted · touche pour copier</h2>
      <ul>
        {lignes.map(([cle, val, feminin]) => (
          <li key={cle} className="border-t border-ligne first:border-t-0">
            <button
              type="button"
              onClick={async () => {
                if (await copier(val)) toast(`${cle} copié${feminin ? "e" : ""}`);
              }}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition active:bg-creux"
            >
              <span className="text-sm text-encre-2">{cle}</span>
              <span className={`text-right font-semibold ${/à vérifier/i.test(val) ? "text-alerte" : ""}`}>{val || "—"}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

function Confiance({ niveau }: { niveau: Annonce["confiance"] }) {
  const styles = {
    haute: "bg-ok/15 text-ok",
    moyenne: "bg-creux text-encre-2",
    faible: "bg-alerte-fond text-alerte",
  };
  return (
    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${styles[niveau]}`}>
      confiance {niveau}
    </span>
  );
}

const CONSIGNES_RAPIDES = ["Plus court", "Plus vendeur", "Plus sobre", "Sans emojis", "Prix plus bas", "Prix plus haut"];

function FeuilleRegeneration({
  ouverte,
  onFermer,
  onValider,
}: {
  ouverte: boolean;
  onFermer: () => void;
  onValider: (consigne: string) => void;
}) {
  const [consigne, setConsigne] = useState("");
  const glisser = useDragControls();
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  if (!monte) return null;
  // Portail vers <body> : la feuille passe au-dessus de la barre de navigation.
  return createPortal(
    <AnimatePresence>
      {ouverte && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFermer}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label="Régénérer l'annonce"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl rounded-t-[28px] bg-papier px-5 pt-3 shadow-2xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
            drag="y"
            dragListener={false}
            dragControls={glisser}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onFermer();
            }}
          >
            <div className="-mt-3 flex cursor-grab touch-none justify-center pt-3 pb-4" onPointerDown={(e) => glisser.start(e)}>
              <div className="h-1.5 w-10 rounded-full bg-ligne-forte" />
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">Une autre version ?</h3>
            <p className="mt-1 mb-4 text-sm text-encre-2">Dis ce qui ne va pas, ou relance tel quel.</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {CONSIGNES_RAPIDES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setConsigne((v) => (v ? `${v}, ${c.toLowerCase()}` : c))}
                  className="rounded-full bg-creux px-3.5 py-2 text-sm font-semibold text-encre-2 transition active:scale-95"
                >
                  {c}
                </button>
              ))}
            </div>
            <textarea
              value={consigne}
              onChange={(e) => setConsigne(e.target.value)}
              placeholder="Ex. : insiste sur le côté vintage, c'est une taille 40 et pas 38…"
              maxLength={300}
              className={`${classeChamp} min-h-24 resize-none`}
            />
            <Bouton
              variante="plein"
              taille="lg"
              className="mt-4 w-full"
              onClick={() => {
                onValider(consigne);
                setConsigne("");
              }}
            >
              <IconeEtincelle taille={20} /> Régénérer
            </Bouton>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
