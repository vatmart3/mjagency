"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Bouton, classeChamp } from "@/components/ui";

export function FormulaireConnexion() {
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [secousse, setSecousse] = useState(0);

  async function connecter(e: React.FormEvent) {
    e.preventDefault();
    if (!motDePasse || envoi) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const rep = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motDePasse }),
      });
      if (rep.ok) {
        window.location.replace("/");
        return;
      }
      const json = await rep.json().catch(() => null);
      setErreur(json?.erreur ?? "Connexion impossible.");
      setSecousse((n) => n + 1);
    } catch {
      setErreur("Pas de réseau.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={connecter} className="space-y-3">
      <label htmlFor="mdp" className="sr-only">
        Mot de passe
      </label>
      <motion.input
        key={secousse}
        animate={secousse ? { x: [0, -10, 9, -6, 4, 0] } : undefined}
        transition={{ duration: 0.4 }}
        id="mdp"
        type="password"
        autoComplete="current-password"
        autoFocus
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        placeholder="Mot de passe"
        className={`${classeChamp} h-14 text-lg`}
      />
      {erreur && (
        <p role="alert" className="text-sm font-semibold text-alerte">
          {erreur}
        </p>
      )}
      <Bouton type="submit" variante="plein" taille="lg" className="w-full" disabled={envoi || !motDePasse}>
        {envoi ? "Connexion…" : "Entrer"}
      </Bouton>
    </form>
  );
}
