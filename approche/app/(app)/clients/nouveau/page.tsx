"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProspectForm } from "@/components/clients/ProspectForm";
import { PageHeader } from "@/components/ui/primitives";
import { db } from "@/lib/data/hooks";
import { toastError } from "@/components/ui/Toast";
import type { Prospect } from "@/lib/types";

export default function NewProspect() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <div className="max-w-3xl">
      <PageHeader kicker="Espace clients" title="Nouveau dossier" lede="Plus la fiche est riche, plus le prompt de recherche sera précis. Rien n'est obligatoire à part le nom." />
      <ProspectForm
        busy={busy}
        submitLabel="Créer et générer le prompt"
        onSubmit={async (d) => {
          setBusy(true);
          try {
            const p = await db.insert("prospects", d as Partial<Prospect>);
            router.push(`/clients/${p.id}?nouveau=1`);
          } catch (e) {
            toastError("Impossible d'enregistrer", (e as Error).message);
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
