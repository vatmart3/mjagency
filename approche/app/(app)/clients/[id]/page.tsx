"use client";
import { ask } from "@/components/ui/Confirm";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Empty, Segmented, Sheet, Tag } from "@/components/ui/primitives";
import { celebrate, toast } from "@/components/ui/Toast";
import { Dossier } from "@/components/clients/Dossier";
import { PromptPanel } from "@/components/clients/PromptPanel";
import { HistoryPanel, IntelPanel, PhotosPanel } from "@/components/clients/Panels";
import { ProspectForm } from "@/components/clients/ProspectForm";
import { DebriefForm } from "@/components/DebriefForm";
import { db, useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { PIPELINE, STATUS_COLOR, statusLabel, type PipelineStatus, type Prospect } from "@/lib/types";
import { eur, frDate, relativeDay } from "@/lib/format";
import { getSector, sectorLabel } from "@/content/sectors";
import { profileById } from "@/content/profiles";
import { slotVerdict, VERDICT_LABEL } from "@/lib/timing";
import { IS_ARTIFACT } from "@/lib/target";

type Tab = "fiche" | "intel" | "prompt" | "historique" | "photos";

function DossierPage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { rows, loading } = useTable("prospects");
  const { me, nameOf } = useSession();
  const p = rows.find((r) => r.id === id);
  const [tab, setTab] = useState<Tab>(search.get("nouveau") ? "prompt" : "fiche");
  const [editing, setEditing] = useState(false);
  const [debrief, setDebrief] = useState(false);

  if (loading) return <div className="mt-16 h-96 animate-pulse rounded-3xl bg-mist" />;
  if (!p)
    return (
      <div className="pt-16">
        <Empty title="Dossier introuvable.">
          <Link href="/clients" className="text-blue">
            Retour aux clients
          </Link>
        </Empty>
      </div>
    );

  const sector = getSector(p.sector);
  const verdict = slotVerdict(p.sector, new Date());
  const ref = `${(sector?.short ?? p.sector).slice(0, 3).toUpperCase()}-${p.id.slice(0, 4).toUpperCase()}`;

  async function setStatus(s: PipelineStatus) {
    const patch: Partial<Prospect> = { status: s };
    if (s === "signe") Object.assign(patch, { signed_at: new Date().toISOString(), signed_by: me?.id, signed_amount: p!.signed_amount ?? p!.potential_amount, to_visit: false });
    await db.update("prospects", p!.id, patch);
    if (s === "signe") {
      await db.insert("interactions", { prospect_id: p!.id, channel: "autre", outcome: "signe", notes: `Signature ${eur(patch.signed_amount)}` });
      celebrate("Signé !", p!.name);
    } else if (s === "rdv") celebrate("RDV décroché", p!.name);
    else toast(`Statut : ${statusLabel(s)}`);
  }

  async function remove() {
    if (!(await ask(`Supprimer définitivement le dossier « ${p!.name} » et tout son historique ?`, { action: "Supprimer" }))) return;
    await db.remove("prospects", p!.id);
    router.replace("/clients");
  }

  return (
    <div className="pt-6">
      <Link href="/clients" className="inline-flex items-center gap-1.5 text-[15px] text-ink-2 hover:text-ink">
        <Icon name="back" size={16} /> Clients
      </Link>

      <Dossier reference={ref} title={p.name}>
        <div className="p-5 md:p-10">
          {/* En-tête */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="kicker">
                {sector?.name ?? p.sector}
                {p.sub_activity && ` · ${p.sub_activity}`}
              </p>
              <h1 className="display mt-2 text-[40px] md:text-[64px]">{p.name}</h1>
              <p className="mt-2 text-[16px] text-ink-2">
                {[p.address, p.city].filter(Boolean).join(", ") || "Adresse à compléter"}
                {p.owner_name && ` · ${p.owner_name}`}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Tag tone="ink">
                  <span className="mr-1.5 size-2 rounded-full" style={{ background: STATUS_COLOR[p.status] }} />
                  {statusLabel(p.status)}
                </Tag>
                {p.disc && <Tag>{profileById[p.disc].name}</Tag>}
                {p.temperature && <Tag tone="blue">{p.temperature}</Tag>}
                {p.google_rating !== null && (
                  <Tag>
                    Google {String(p.google_rating).replace(".", ",")} · {p.google_reviews ?? "?"} avis
                  </Tag>
                )}
                <Tag tone={verdict.verdict === "ideal" ? "ok" : verdict.verdict === "eviter" || verdict.verdict === "ferme" ? "signal" : "mist"}>
                  Maintenant : {VERDICT_LABEL[verdict.verdict]}
                </Tag>
              </div>
            </div>
            <div className="no-print flex flex-wrap gap-2">
              {p.phone && (
                <ButtonLink href={`tel:${p.phone.replace(/\s/g, "")}`} external={false}>
                  <Icon name="phone" size={18} /> Appeler
                </ButtonLink>
              )}
              <Button variant="secondary" onClick={() => setDebrief(true)}>
                Débrief
              </Button>
              <Button variant="secondary" onClick={() => setEditing(true)} aria-label="Modifier">
                <Icon name="edit" size={18} />
              </Button>
              {!IS_ARTIFACT && (
                <ButtonLink href={`/clients/${p.id}/imprimer`} variant="secondary">
                  <Icon name="printer" size={18} /> PDF
                </ButtonLink>
              )}
            </div>
          </div>

          {/* Pipeline */}
          <div className="no-print scrollbar-none -mx-5 mt-8 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0">
            {PIPELINE.map((s) => (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatus(s.id)}
                className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] font-medium ${p.status === s.id ? "bg-blue text-white" : "bg-mist text-ink-2 hover:bg-fog"}`}
              >
                {s.label}
              </motion.button>
            ))}
          </div>

          {p.hook && tab !== "intel" && (
            <button onClick={() => setTab("intel")} className="mt-8 block w-full rounded-2xl bg-blue-soft p-5 text-left">
              <p className="kicker text-blue">Accroche personnalisée</p>
              <p className="mt-2 text-[19px] font-semibold leading-snug">« {p.hook} »</p>
            </button>
          )}

          <div className="no-print mt-8 overflow-x-auto scrollbar-none">
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: "fiche", label: "Fiche" },
                { value: "intel", label: "Intel" },
                { value: "prompt", label: "Prompt" },
                { value: "historique", label: "Historique" },
                { value: "photos", label: "Photos" },
              ]}
            />
          </div>

          <div className="mt-8">
            {tab === "fiche" && <Fiche p={p} nameOf={nameOf} />}
            {tab === "intel" && <IntelPanel prospect={p} goPrompt={() => setTab("prompt")} />}
            {tab === "prompt" && <PromptPanel prospect={p} onReport={() => setTab("intel")} />}
            {tab === "historique" && <HistoryPanel prospect={p} />}
            {tab === "photos" && <PhotosPanel prospect={p} />}
          </div>
        </div>
      </Dossier>

      <div className="no-print mt-8 flex flex-wrap gap-2">
        <ButtonLink href={`/entrainement/duo?prospect=${p.id}`} variant="secondary">
          S&apos;entraîner sur ce prospect
        </ButtonLink>
        {sector && (
          <ButtonLink href={`/scripts/${sector.id}`} variant="secondary">
            Scripts {sector.short}
          </ButtonLink>
        )}
        <Button variant="danger" onClick={remove}>
          Supprimer
        </Button>
      </div>

      <Sheet open={editing} onClose={() => setEditing(false)} title="Modifier la fiche" wide>
        <div className="py-4">
          <ProspectForm
            initial={p}
            onSubmit={async (d) => {
              const { id: _id, created_at: _c, updated_at: _u, ...patch } = d;
              void _id;
              void _c;
              void _u;
              await db.update("prospects", p.id, patch);
              setEditing(false);
              toast("Fiche mise à jour", "Pensez à regénérer le prompt.");
            }}
          />
        </div>
      </Sheet>
      <Sheet open={debrief} onClose={() => setDebrief(false)} title="Débrief en 30 secondes">
        <DebriefForm prospect={p} onDone={() => setDebrief(false)} compact />
      </Sheet>
    </div>
  );
}

function Fiche({ p, nameOf }: { p: Prospect; nameOf: (id: string | null) => string }) {
  const link = (v: string | null, href?: string) =>
    v ? (
      <a href={href ?? (v.startsWith("http") ? v : `https://${v.replace(/^@/, "")}`)} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">
        {v}
      </a>
    ) : null;
  const rows: [string, React.ReactNode][] = [
    ["Téléphone", p.phone ? <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="text-blue">{p.phone}</a> : null],
    ["Email", p.email ? <a href={`mailto:${p.email}`} className="text-blue">{p.email}</a> : null],
    ["Site web", link(p.website)],
    ["Instagram", p.instagram ? link(p.instagram, `https://instagram.com/${p.instagram.replace(/^@/, "")}`) : null],
    ["Facebook", p.facebook ? link(p.facebook, p.facebook.startsWith("http") ? p.facebook : `https://www.facebook.com/search/top?q=${encodeURIComponent(p.facebook)}`) : null],
    ["TikTok", p.tiktok ? link(p.tiktok, `https://www.tiktok.com/@${p.tiktok.replace(/^@/, "")}`) : null],
    ["Fiche Google", p.google_url ? link("Ouvrir", p.google_url) : link("Rechercher", `https://www.google.com/maps/search/${encodeURIComponent(`${p.name} ${p.city ?? ""}`)}`)],
    ["Horaires", p.hours],
    ["Création", p.founded_year ? `${p.founded_year} (${new Date().getFullYear() - p.founded_year} ans)` : null],
    ["Salariés", p.employees],
    ["Concurrents", p.competitors],
    ["Montant potentiel", p.potential_amount ? eur(p.potential_amount) : null],
    ["Montant signé", p.signed_amount ? eur(p.signed_amount) : null],
    ["Suivi par", p.assigned_to ? nameOf(p.assigned_to) : "Les deux"],
    ["Prochaine action", p.next_action ? `${p.next_action}${p.next_action_at ? ` · ${relativeDay(p.next_action_at)}` : ""}` : null],
    ["Créé le", frDate(p.created_at)],
  ];
  return (
    <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
      <dl className="divide-y divide-line border-y border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[130px_1fr] gap-3 py-3 text-[15px]">
            <dt className="text-ink-2">{k}</dt>
            <dd className="min-w-0 break-words">{v ?? <span className="text-ink-3">—</span>}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="kicker">Observations terrain</p>
        <p className="mt-3 whitespace-pre-wrap text-[17px] leading-relaxed">{p.field_notes || <span className="text-ink-3">Rien de noté pour l&apos;instant.</span>}</p>
        {p.disc && (
          <div className="mt-8 rounded-2xl p-5" style={{ background: `${profileById[p.disc].color}12` }}>
            <p className="kicker" style={{ color: profileById[p.disc].color }}>
              {profileById[p.disc].name}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed">{profileById[p.disc].close}</p>
            <Link href="/methode" className="mt-3 inline-block text-[14px] font-medium text-blue">
              Relire le profil →
            </Link>
          </div>
        )}
        <p className="mt-6 text-[14px] text-ink-3">Secteur : {sectorLabel(p.sector)}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <DossierPage />
    </Suspense>
  );
}
