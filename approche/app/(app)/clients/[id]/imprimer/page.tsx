"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { eur, frDate, frTime } from "@/lib/format";
import { statusLabel } from "@/lib/types";
import { getSector } from "@/content/sectors";
import { profileById } from "@/content/profiles";

/** Version imprimable de la fiche : « Enregistrer au format PDF » depuis la boîte d'impression. */
export default function PrintProspect() {
  const { id } = useParams<{ id: string }>();
  const { rows, loading } = useTable("prospects");
  const { rows: interactions } = useTable("interactions");
  const { nameOf } = useSession();
  const p = rows.find((r) => r.id === id);

  useEffect(() => {
    if (!loading && p) {
      const t = setTimeout(() => window.print(), 600);
      return () => clearTimeout(t);
    }
  }, [loading, p]);

  if (!p) return <p className="pt-16 text-ink-2">{loading ? "Chargement…" : "Dossier introuvable."}</p>;
  const sector = getSector(p.sector);
  const hist = interactions.filter((i) => i.prospect_id === p.id).slice(0, 12);
  const intel = p.intel;
  const row = (k: string, v: unknown) =>
    v !== null && v !== undefined && v !== "" ? (
      <tr>
        <td className="w-44 py-1 pr-4 align-top text-ink-2">{k}</td>
        <td className="py-1">{String(v)}</td>
      </tr>
    ) : null;

  return (
    <article className="mx-auto max-w-3xl py-10 text-[13px] leading-relaxed print:py-0">
      <div className="no-print mb-8 flex gap-2">
        <Button onClick={() => window.print()}>Imprimer / PDF</Button>
        <Button variant="secondary" onClick={() => history.back()}>
          Retour
        </Button>
      </div>
      <header className="border-b-2 border-ink pb-4">
        <p className="kicker">MJAGENCY · Dossier de prospection · {frDate(new Date().toISOString(), { day: "numeric", month: "long", year: "numeric" })}</p>
        <h1 className="display mt-2 text-[40px]">{p.name}</h1>
        <p className="text-ink-2">
          {sector?.name ?? p.sector} · {[p.address, p.city].filter(Boolean).join(", ")} · {statusLabel(p.status)}
        </p>
      </header>
      <table className="mt-5 w-full">
        <tbody>
          {row("Dirigeant", p.owner_name)}
          {row("Téléphone", p.phone)}
          {row("Email", p.email)}
          {row("Site", p.website)}
          {row("Instagram", p.instagram)}
          {row("Facebook", p.facebook)}
          {row("Google", p.google_rating !== null ? `${p.google_rating} / 5 (${p.google_reviews ?? "?"} avis)` : null)}
          {row("Horaires", p.hours)}
          {row("Création", p.founded_year)}
          {row("Salariés", p.employees)}
          {row("Concurrents", p.competitors)}
          {row("Profil", p.disc ? profileById[p.disc].name : null)}
          {row("Température", p.temperature)}
          {row("Potentiel", p.potential_amount ? eur(p.potential_amount) : null)}
          {row("Prochaine action", p.next_action ? `${p.next_action} ${p.next_action_at ? frDate(p.next_action_at) : ""}` : null)}
          {row("Suivi par", p.assigned_to ? nameOf(p.assigned_to) : null)}
        </tbody>
      </table>
      {p.field_notes && (
        <section className="mt-6">
          <h2 className="text-[16px] font-semibold">Observations terrain</h2>
          <p className="whitespace-pre-wrap">{p.field_notes}</p>
        </section>
      )}
      {intel && (
        <section className="mt-6 space-y-4">
          {intel.accroche && (
            <div className="border-l-4 border-blue pl-4">
              <h2 className="text-[16px] font-semibold">Accroche</h2>
              <p className="text-[15px]">« {intel.accroche} »</p>
            </div>
          )}
          {intel.synthese && (
            <div>
              <h2 className="text-[16px] font-semibold">Synthèse</h2>
              <p className="whitespace-pre-wrap">{intel.synthese}</p>
            </div>
          )}
          {intel.problemes && (
            <div>
              <h2 className="text-[16px] font-semibold">Problèmes prioritaires</h2>
              <p className="whitespace-pre-wrap">{intel.problemes}</p>
            </div>
          )}
          {intel.offre && (
            <div>
              <h2 className="text-[16px] font-semibold">Offre recommandée</h2>
              <p className="whitespace-pre-wrap">{intel.offre}</p>
            </div>
          )}
          {!!intel.questions?.length && (
            <div>
              <h2 className="text-[16px] font-semibold">Questions à poser</h2>
              <ol className="list-decimal pl-5">
                {intel.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}
          {!!intel.objections?.length && (
            <div>
              <h2 className="text-[16px] font-semibold">Objections probables</h2>
              {intel.objections.map((o, i) => (
                <p key={i}>
                  <strong>« {o.objection} »</strong> — {o.reponse}
                </p>
              ))}
            </div>
          )}
          {intel.budget && (
            <div>
              <h2 className="text-[16px] font-semibold">Budget</h2>
              <p className="whitespace-pre-wrap">{intel.budget}</p>
            </div>
          )}
        </section>
      )}
      {hist.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[16px] font-semibold">Historique</h2>
          <ul>
            {hist.map((i) => (
              <li key={i.id} className="border-b border-line py-1">
                {frDate(i.created_at)} {frTime(i.created_at)} · {nameOf(i.user_id)} · {i.channel} {i.outcome ? `· ${i.outcome}` : ""} {i.objection ? `· ${i.objection}` : ""} {i.notes ? `— ${i.notes}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="mt-10 text-[11px] text-ink-3">Document interne MJAGENCY — données traitées sur la base de l&apos;intérêt légitime (prospection B2B). Droit d&apos;opposition sur simple demande.</p>
    </article>
  );
}
