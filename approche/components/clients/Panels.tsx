"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Empty, Sheet, Tag } from "@/components/ui/primitives";
import { toast, toastError } from "@/components/ui/Toast";
import { DebriefForm } from "@/components/DebriefForm";
import { db, useTable } from "@/lib/data/hooks";
import { getRepo } from "@/lib/data/repo";
import { useSession } from "@/lib/session";
import { frDate, frTime } from "@/lib/format";
import type { Interaction, ParsedReport, Prospect } from "@/lib/types";
import { profileById } from "@/content/profiles";

/* ---------------------------------------------------------------- Intel */

const LONG_SECTIONS: { key: keyof ParsedReport; title: string }[] = [
  { key: "synthese", title: "Synthèse" },
  { key: "problemes", title: "Les 3 problèmes les plus coûteux" },
  { key: "offre", title: "Offre recommandée" },
  { key: "budget", title: "Budget réaliste" },
  { key: "presence", title: "Présence digitale" },
  { key: "site", title: "Site web" },
  { key: "reseaux", title: "Réseaux sociaux" },
  { key: "avis", title: "Avis Google" },
  { key: "concurrents", title: "Concurrents locaux" },
  { key: "saisonnalite", title: "Saisonnalité" },
  { key: "opportunites", title: "Opportunités" },
  { key: "manquants", title: "Non trouvé" },
];

function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-[16px] leading-relaxed text-ink">
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {para.replace(/\*\*/g, "")}
        </p>
      ))}
    </div>
  );
}

export function IntelPanel({ prospect, goPrompt }: { prospect: Prospect; goPrompt: () => void }) {
  const intel = prospect.intel;
  const { rows: reports } = useTable("research_reports");
  const mine = reports.filter((r) => r.prospect_id === prospect.id);
  const [openKey, setOpenKey] = useState<string | null>("synthese");

  if (!intel)
    return (
      <Empty title="Pas encore de renseignements.">
        <p>Lancez le prompt de recherche, puis collez le rapport : l&apos;accroche, les questions et les objections apparaîtront ici.</p>
        <Button className="mt-4" onClick={goPrompt}>
          Aller au prompt
        </Button>
      </Empty>
    );

  return (
    <div className="space-y-12">
      {intel.accroche && (
        <section>
          <p className="kicker">Accroche personnalisée</p>
          <blockquote className="display mt-4 text-[28px] leading-[1.15] md:text-[40px]">
            <span className="text-blue">«</span> {intel.accroche} <span className="text-blue">»</span>
          </blockquote>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href={`/scripts/prompteur?prospect=${prospect.id}`} variant="secondary" size="sm">
              <Icon name="play" size={14} /> Téléprompteur
            </ButtonLink>
            <ButtonLink href={`/entrainement/duo?prospect=${prospect.id}`} size="sm">
              S&apos;entraîner sur ce prospect
            </ButtonLink>
          </div>
        </section>
      )}

      <div className="grid gap-10 md:grid-cols-2">
        {!!intel.questions?.length && (
          <section>
            <p className="kicker">5 questions à poser</p>
            <ol className="mt-4 space-y-3">
              {intel.questions.map((q, i) => (
                <li key={i} className="flex gap-3 text-[17px] leading-snug">
                  <span className="num w-6 shrink-0 font-semibold text-blue">{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </section>
        )}
        {!!intel.objections?.length && (
          <section>
            <p className="kicker">Objections probables</p>
            <div className="mt-4 space-y-4">
              {intel.objections.map((o, i) => (
                <div key={i} className="rounded-2xl bg-mist p-4">
                  <p className="font-semibold">« {o.objection} »</p>
                  {o.reponse && <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{o.reponse}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="border-t border-line">
        {LONG_SECTIONS.filter((s) => typeof intel[s.key] === "string" && intel[s.key]).map((s) => (
          <div key={s.key} className="border-b border-line">
            <button onClick={() => setOpenKey(openKey === s.key ? null : s.key)} className="flex w-full items-center justify-between py-4 text-left" aria-expanded={openKey === s.key}>
              <span className="text-[18px] font-semibold tracking-tight">{s.title}</span>
              <motion.span animate={{ rotate: openKey === s.key ? 45 : 0 }} className="text-ink-3">
                <Icon name="plus" size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openKey === s.key && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pb-6">
                    <Prose text={intel[s.key] as string} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>
      {intel.missing.length > 0 && <p className="text-[13px] text-ink-3">Sections absentes du dernier rapport : {intel.missing.join(", ")}.</p>}
      {mine.length > 0 && <p className="text-[13px] text-ink-3">{mine.length} rapport(s) archivé(s). Dernier : {frDate(mine[0].created_at)}.</p>}
    </div>
  );
}

/* ------------------------------------------------------------- Historique */

const OUTCOME_LABEL: Record<string, string> = {
  pas_de_reponse: "Pas de réponse",
  messagerie: "Messagerie",
  barrage: "Barrage",
  refus: "Refus",
  rappel: "Rappel demandé",
  rdv: "RDV décroché",
  visite: "Visite",
  note: "Note",
  signe: "Signature",
};
const CHANNEL_LABEL: Record<string, string> = { physique: "Terrain", telephone: "Téléphone", sms: "SMS", email: "Email", autre: "Autre" };

export function HistoryPanel({ prospect }: { prospect: Prospect }) {
  const { rows } = useTable("interactions");
  const { nameOf } = useSession();
  const [open, setOpen] = useState<null | "physique" | "telephone">(null);
  const list = useMemo(() => rows.filter((r) => r.prospect_id === prospect.id).sort((a, b) => b.created_at.localeCompare(a.created_at)), [rows, prospect.id]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setOpen("physique")}>Débrief de visite</Button>
        <Button variant="secondary" onClick={() => setOpen("telephone")}>
          Noter un appel
        </Button>
      </div>
      <ol className="mt-8 border-l border-line pl-6">
        {list.length === 0 && <p className="text-ink-2">Aucune interaction pour l&apos;instant.</p>}
        {list.map((i: Interaction) => (
          <li key={i.id} className="relative pb-7">
            <span className={`absolute -left-[31px] top-1.5 size-2.5 rounded-full ${i.outcome === "rdv" || i.outcome === "signe" ? "bg-blue" : "bg-ink-3"}`} />
            <p className="text-[13px] text-ink-3">
              {frDate(i.created_at)} · {frTime(i.created_at)} · {nameOf(i.user_id)}
            </p>
            <p className="mt-0.5 text-[17px] font-semibold">
              {CHANNEL_LABEL[i.channel]}
              {i.outcome && i.outcome !== "visite" && ` — ${OUTCOME_LABEL[i.outcome] ?? i.outcome}`}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {i.disc && <Tag>{profileById[i.disc].name}</Tag>}
              {i.interest && <Tag tone="blue">Intérêt {i.interest}/5</Tag>}
              {i.objection && <Tag>{i.objection}</Tag>}
              {i.next_action && (
                <Tag tone="ink">
                  {i.next_action}
                  {i.next_action_at && ` · ${frDate(i.next_action_at, { day: "numeric", month: "short" })}`}
                </Tag>
              )}
              {i.duration_sec ? <Tag>{Math.round(i.duration_sec / 60)} min</Tag> : null}
            </div>
            {i.notes && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">{i.notes}</p>}
          </li>
        ))}
      </ol>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open === "telephone" ? "Noter un appel" : "Débrief en 30 secondes"}>
        {open && <DebriefForm prospect={prospect} channel={open} onDone={() => setOpen(null)} compact />}
      </Sheet>
    </div>
  );
}

/* ----------------------------------------------------------------- Photos */

export function PhotosPanel({ prospect }: { prospect: Prospect }) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void Promise.all(prospect.photos.map(async (p) => [p, await getRepo().photoUrl(p).catch(() => "")] as const)).then((pairs) => {
      if (alive) setUrls(Object.fromEntries(pairs));
    });
    return () => {
      alive = false;
    };
  }, [prospect.photos]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const paths: string[] = [];
      for (const f of Array.from(files).slice(0, 6)) paths.push(await getRepo().uploadPhoto(prospect.id, f));
      await db.update("prospects", prospect.id, { photos: [...prospect.photos, ...paths] });
      toast(paths.length > 1 ? `${paths.length} photos ajoutées` : "Photo ajoutée");
    } catch (e) {
      toastError("Envoi impossible", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(p: string) {
    await getRepo().removePhoto(p).catch(() => undefined);
    await db.update("prospects", prospect.id, { photos: prospect.photos.filter((x) => x !== p) });
  }

  return (
    <div>
      <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-blue px-5 text-[15px] font-medium text-white active:scale-95">
        <Icon name="camera" size={18} /> {busy ? "Envoi…" : "Ajouter des photos"}
        <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
      </label>
      <p className="mt-2 text-[13px] text-ink-3">Vitrine, comptoir, affichage, menu : tout ce qui aide à préparer le RDV.</p>
      {prospect.photos.length === 0 ? (
        <div className="mt-6">
          <Empty title="Aucune photo." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {prospect.photos.map((p) => (
            <div key={p} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
              {urls[p] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urls[p]} alt="" className="size-full object-cover" onClick={() => setZoom(urls[p])} />
              )}
              <button onClick={() => removePhoto(p)} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-ink-2 shadow" aria-label="Supprimer la photo">
                <Icon name="trash" size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {zoom && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoom} alt="" className="max-h-full max-w-full rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
