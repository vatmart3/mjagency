"use client";

import { useEffect, useState } from "react";
import { toutEffacer } from "@/lib/db.ts";
import { REGLAGES_DEFAUT, type Reglages as TReglages } from "@/lib/schema.ts";
import { IconeSortie } from "./icones";
import { Bouton, classeChamp, Etiquette, Interrupteur, Segments, useToast } from "./ui";

export function Reglages({
  valeur,
  onChange,
  onHistoriqueVide,
}: {
  valeur: TReglages;
  onChange: (r: TReglages) => void;
  onHistoriqueVide: () => void;
}) {
  const toast = useToast();
  const [stockage, setStockage] = useState<string | null>(null);
  const maj = <K extends keyof TReglages>(k: K, v: TReglages[K]) => onChange({ ...valeur, [k]: v });

  useEffect(() => {
    navigator.storage
      ?.estimate?.()
      .then(({ usage }) => usage !== undefined && setStockage(`${(usage / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`))
      .catch(() => {});
  }, []);

  async function deconnexion() {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/login";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-[32px] leading-none font-semibold tracking-[-0.03em]">Réglages</h1>
      <p className="text-encre-2">Ils s'appliquent à toutes les prochaines annonces.</p>

      <Section titre="Écriture">
        <div className="space-y-4 py-2">
          <div>
            <Etiquette>Ton de la description</Etiquette>
            <Segments
              nom="ton"
              valeur={valeur.ton}
              onChange={(v) => maj("ton", v)}
              options={[
                { valeur: "naturel", libelle: "Naturel" },
                { valeur: "pro", libelle: "Sobre" },
                { valeur: "enjoue", libelle: "Enjoué" },
              ]}
            />
          </div>
        </div>
        <Interrupteur actif={valeur.tutoiement} onChange={(v) => maj("tutoiement", v)} libelle="Tutoyer l'acheteur" aide="L'usage sur Vinted" />
        <Interrupteur actif={valeur.emojis} onChange={(v) => maj("emojis", v)} libelle="Quelques emojis" aide="Dans la description seulement" />
        <Interrupteur actif={valeur.hashtags} onChange={(v) => maj("hashtags", v)} libelle="Hashtags en fin de description" aide="Aident la recherche" />
      </Section>

      <Section titre="Prix">
        <div className="py-2">
          <Etiquette>Stratégie</Etiquette>
          <Segments
            nom="strategie"
            valeur={valeur.strategie}
            onChange={(v) => maj("strategie", v)}
            options={[
              { valeur: "rapide", libelle: "Vendre vite" },
              { valeur: "equilibre", libelle: "Équilibre" },
              { valeur: "max", libelle: "Au meilleur prix" },
            ]}
          />
          <p className="mt-2 text-sm text-encre-2">
            {valeur.strategie === "rapide"
              ? "Prix dans le bas du marché, petite marge de négo."
              : valeur.strategie === "max"
                ? "Prix dans le haut du marché, plancher ferme."
                : "Prix au milieu du marché, 15 à 20 % de marge de négo."}
          </p>
        </div>
      </Section>

      <Section titre="Signature">
        <div className="py-2">
          <Etiquette htmlFor="signature">Ajoutée à la fin de chaque description</Etiquette>
          <textarea
            id="signature"
            value={valeur.signature}
            onChange={(e) => maj("signature", e.target.value)}
            maxLength={400}
            rows={4}
            className={`${classeChamp} resize-none`}
            placeholder="Envoi rapide et soigné…"
          />
          <button type="button" className="mt-2 text-sm font-semibold text-encre-2 underline" onClick={() => maj("signature", REGLAGES_DEFAUT.signature)}>
            Remettre la signature proposée
          </button>
        </div>
      </Section>

      <Section titre="Données">
        <p className="py-2 text-sm text-encre-2">
          Historique et réglages restent sur cet appareil{stockage ? ` (${stockage} utilisés)` : ""}. Rien n'est stocké sur un serveur.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 pb-3">
          <Bouton
            variante="contour"
            taille="sm"
            onClick={async () => {
              if (!confirm("Effacer tout l'historique de cet appareil ?")) return;
              await toutEffacer();
              onHistoriqueVide();
              toast("Historique effacé");
            }}
          >
            Effacer l'historique
          </Bouton>
          <Bouton variante="contour" taille="sm" onClick={deconnexion}>
            <IconeSortie taille={16} /> Se déconnecter
          </Bouton>
        </div>
      </Section>
    </div>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rounded-carte bg-carte px-4 pt-3 pb-1 shadow-carte ring-1 ring-ligne">
      <h2 className="text-[12px] font-semibold tracking-wide text-encre-3 uppercase">{titre}</h2>
      <div className="divide-y divide-ligne">{children}</div>
    </section>
  );
}
