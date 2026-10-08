import type { Metadata } from "next";
import { motDePasseConfigure } from "@/lib/auth.ts";
import { FormulaireConnexion } from "./FormulaireConnexion";

export const metadata: Metadata = { title: "Connexion — FRIPE" };
export const dynamic = "force-dynamic";

export default function Connexion() {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 pb-[env(safe-area-inset-bottom)]">
      <div className="mb-10">
        <p
          className="font-display text-[64px] leading-none font-bold tracking-[-0.05em]"
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
        >
          FRIPE<span className="text-accent">.</span>
        </p>
        <p className="mt-3 text-lg text-encre-2">
          Des photos à l'annonce Vinted, <span className="text-encre italic">en quelques secondes.</span>
        </p>
      </div>
      {motDePasseConfigure() ? (
        <FormulaireConnexion />
      ) : (
        <p role="alert" className="rounded-2xl bg-alerte-fond p-4 text-alerte">
          <strong>APP_PASSWORD</strong> n'est pas configuré sur le serveur : l'app reste verrouillée. Ajoute la variable
          d'environnement puis redéploie.
        </p>
      )}
    </main>
  );
}
