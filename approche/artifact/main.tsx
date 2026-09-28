"use client";
/**
 * Point d'entrée de la version « page unique » d'APPROCHE (artefact claude.ai).
 * Réutilise tel quel les pages de l'app Next.js ; seul le routage change.
 */
import { motion } from "framer-motion";
import { useEffect, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/components/Providers";
import { AuthGate } from "@/components/AuthGate";
import { Dock } from "@/components/Dock";
import { ParamsContext, match, useRoute } from "./router";

import Brief from "@/app/(app)/page";
import Clients from "@/app/(app)/clients/page";
import NewProspect from "@/app/(app)/clients/nouveau/page";
import Dossier from "@/app/(app)/clients/[id]/page";
import Scripts from "@/app/(app)/scripts/page";
import Sector from "@/app/(app)/scripts/[secteur]/page";
import Prompteur from "@/app/(app)/scripts/prompteur/page";
import Terrain from "@/app/(app)/terrain/page";
import Telephone from "@/app/(app)/telephone/page";
import CallMode from "@/app/(focus)/telephone/session/page";
import Methode from "@/app/(app)/methode/page";
import Training from "@/app/(app)/entrainement/page";
import Duo from "@/app/(app)/entrainement/duo/page";
import Flash from "@/app/(app)/entrainement/flash/page";
import Defi from "@/app/(app)/entrainement/defi/page";
import IA from "@/app/(app)/entrainement/ia/page";
import Progression from "@/app/(app)/entrainement/progression/page";
import Tableau from "@/app/(app)/tableau/page";
import Reglages from "@/app/(app)/reglages/page";
import Login from "@/app/login/page";

type Layout = "app" | "focus" | "bare";
const ROUTES: [string, ComponentType, Layout][] = [
  ["/", Brief, "app"],
  ["/clients", Clients, "app"],
  ["/clients/nouveau", NewProspect, "app"],
  ["/clients/:id", Dossier, "app"],
  ["/scripts", Scripts, "app"],
  ["/scripts/prompteur", Prompteur, "app"],
  ["/scripts/:secteur", Sector, "app"],
  ["/terrain", Terrain, "app"],
  ["/telephone", Telephone, "app"],
  ["/telephone/session", CallMode, "focus"],
  ["/methode", Methode, "app"],
  ["/entrainement", Training, "app"],
  ["/entrainement/duo", Duo, "app"],
  ["/entrainement/flash", Flash, "app"],
  ["/entrainement/defi", Defi, "app"],
  ["/entrainement/ia", IA, "app"],
  ["/entrainement/progression", Progression, "app"],
  ["/tableau", Tableau, "app"],
  ["/reglages", Reglages, "app"],
  ["/login", Login, "bare"],
];

function resolve(path: string) {
  for (const [pattern, Page, layout] of ROUTES) {
    const params = match(pattern, path);
    if (params) return { Page, layout, params };
  }
  return { Page: Brief, layout: "app" as Layout, params: {} };
}

function App() {
  const { path, href, anchor } = useRoute();
  const { Page, layout, params } = resolve(path);

  // Nouvelle page : on remonte en haut, ou on va à l'ancre demandée (#obj-…)
  useEffect(() => {
    if (anchor) {
      const t = setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [href, anchor]);

  const page = (
    <ParamsContext.Provider value={params}>
      <Page />
    </ParamsContext.Provider>
  );

  if (layout === "bare") return page;
  if (layout === "focus") return <AuthGate>{page}</AuthGate>;
  return (
    <AuthGate>
      <div className="page mx-auto w-full max-w-[1240px] px-4 md:px-8">
        <motion.div key={href.split("#")[0]} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          {page}
        </motion.div>
      </div>
      <Dock />
    </AuthGate>
  );
}

createRoot(document.getElementById("approche")!).render(
  <Providers>
    <App />
  </Providers>,
);
