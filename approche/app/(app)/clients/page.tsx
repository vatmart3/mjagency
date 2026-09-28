"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip, Empty, PageHeader, Segmented, Tag } from "@/components/ui/primitives";
import { ThauMap } from "@/components/three/Visuals";
import { db, useTable } from "@/lib/data/hooks";
import { PIPELINE, STATUS_COLOR, statusLabel, type PipelineStatus, type Prospect } from "@/lib/types";
import { SECTORS, sectorLabel } from "@/content/sectors";
import { profileById } from "@/content/profiles";
import { eur, relativeDay } from "@/lib/format";
import { positionOf } from "@/lib/timing";
import { celebrate } from "@/components/ui/Toast";
import { useSession } from "@/lib/session";

type View = "liste" | "pipeline" | "carte";

export default function ClientsPage() {
  const { rows: prospects, loading } = useTable("prospects");
  const [view, setView] = useState<View>("liste");
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string | null>(null);
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return prospects.filter(
      (p) =>
        (!sector || p.sector === sector) &&
        (!status || p.status === status) &&
        (!n || [p.name, p.city, p.owner_name, p.sub_activity, p.address].some((v) => v?.toLowerCase().includes(n))),
    );
  }, [prospects, q, sector, status]);

  const usedSectors = SECTORS.filter((s) => prospects.some((p) => p.sector === s.id));
  const potential = filtered.filter((p) => !["signe", "perdu"].includes(p.status)).reduce((s, p) => s + (Number(p.potential_amount) || 0), 0);

  return (
    <div>
      <PageHeader
        kicker="Espace clients"
        title={
          <>
            {prospects.length} dossiers<span className="text-ink-3">,</span> <span className="text-blue">{eur(potential)}</span> en jeu.
          </>
        }
        actions={
          <>
            <ButtonLink href="/clients/nouveau">
              <Icon name="plus" size={18} /> Nouveau dossier
            </ButtonLink>
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "liste", label: "Liste" },
                { value: "pipeline", label: "Pipeline" },
                { value: "carte", label: "Carte" },
              ]}
            />
          </>
        }
      />

      <div className="sticky top-0 z-30 -mx-4 bg-white/85 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="relative">
          <Icon name="search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input className="field pl-10" placeholder="Rechercher un commerce, une ville, un gérant…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="scrollbar-none -mx-1 mt-3 flex gap-2 overflow-x-auto px-1">
          <Chip active={!sector} onClick={() => setSector(null)}>
            Tous
          </Chip>
          {usedSectors.map((s) => (
            <Chip key={s.id} active={sector === s.id} onClick={() => setSector(sector === s.id ? null : s.id)}>
              {s.short}
            </Chip>
          ))}
        </div>
        {view !== "pipeline" && (
          <div className="scrollbar-none -mx-1 mt-2 flex gap-2 overflow-x-auto px-1">
            {PIPELINE.map((s) => (
              <Chip key={s.id} active={status === s.id} onClick={() => setStatus(status === s.id ? null : s.id)}>
                <span className="size-2 rounded-full" style={{ background: STATUS_COLOR[s.id] }} /> {s.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="h-40 animate-pulse rounded-3xl bg-mist" />
        ) : !filtered.length ? (
          <Empty title="Aucun dossier ne correspond.">
            <Link href="/clients/nouveau" className="text-blue">
              Créer un dossier
            </Link>
          </Empty>
        ) : view === "liste" ? (
          <List prospects={filtered} />
        ) : view === "pipeline" ? (
          <Kanban prospects={filtered} />
        ) : (
          <div className="overflow-hidden rounded-[28px] bg-mist">
            <ThauMap
              height={560}
              points={filtered.map((p) => ({ id: p.id, ...positionOf(p), color: STATUS_COLOR[p.status], label: p.name, sub: sectorLabel(p.sector), hot: p.status === "rdv" }))}
              onOpen={(id) => router.push(`/clients/${id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function List({ prospects }: { prospects: Prospect[] }) {
  return (
    <ul className="border-t border-line">
      {prospects.map((p, i) => (
        <motion.li key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.025 }}>
          <Link href={`/clients/${p.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line py-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <div className="min-w-0">
              <p className="truncate text-[18px] font-semibold tracking-tight group-hover:text-blue">{p.name}</p>
              <p className="truncate text-[14px] text-ink-2">
                {sectorLabel(p.sector)} · {p.city ?? "—"}
                {p.owner_name && ` · ${p.owner_name}`}
              </p>
            </div>
            <div className="hidden md:block">
              {p.disc ? <span className="text-[14px] font-medium" style={{ color: profileById[p.disc].color }}>{profileById[p.disc].name}</span> : <span className="text-ink-3">—</span>}
            </div>
            <div className="hidden text-[14px] text-ink-2 md:block">
              {p.next_action ? (
                <>
                  {p.next_action}
                  {p.next_action_at && <span className="block text-ink-3">{relativeDay(p.next_action_at)}</span>}
                </>
              ) : (
                "—"
              )}
            </div>
            <div className="num hidden text-right text-[15px] md:block">{eur(p.signed_amount ?? p.potential_amount)}</div>
            <span className="inline-flex items-center gap-1.5 justify-self-end text-[13px] font-medium">
              <span className="size-2.5 rounded-full" style={{ background: STATUS_COLOR[p.status] }} />
              {statusLabel(p.status)}
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}

function Kanban({ prospects }: { prospects: Prospect[] }) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<PipelineStatus | null>(null);
  const { me } = useSession();

  async function move(p: Prospect, to: PipelineStatus) {
    if (p.status === to) return;
    const patch: Partial<Prospect> = { status: to };
    if (to === "signe") {
      patch.signed_at = new Date().toISOString();
      patch.signed_by = me?.id ?? null;
      patch.signed_amount = p.signed_amount ?? p.potential_amount;
      patch.to_visit = false;
    }
    await db.update("prospects", p.id, patch);
    if (to === "rdv") celebrate("RDV décroché", p.name);
    if (to === "signe") celebrate("Signé !", `${p.name} · ${eur(patch.signed_amount)}`);
  }

  return (
    <div className="scrollbar-none -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
      {PIPELINE.map((col, ci) => {
        const items = prospects.filter((p) => p.status === col.id);
        const total = items.reduce((s, p) => s + (Number(p.signed_amount ?? p.potential_amount) || 0), 0);
        return (
          <div
            key={col.id}
            onDragOver={(e) => (e.preventDefault(), setOver(col.id))}
            onDragLeave={() => setOver(null)}
            onDrop={() => {
              const p = prospects.find((x) => x.id === dragging);
              if (p) void move(p, col.id);
              setDragging(null);
              setOver(null);
            }}
            className={`w-[78vw] shrink-0 snap-start rounded-[24px] p-3 transition-colors sm:w-[280px] ${over === col.id ? "bg-blue-soft" : "bg-mist"}`}
          >
            <div className="flex items-baseline justify-between px-2 pb-3 pt-1">
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                <span className="size-2.5 rounded-full" style={{ background: STATUS_COLOR[col.id] }} />
                {col.label}
                <span className="num font-normal text-ink-3">{items.length}</span>
              </p>
              <span className="num text-[13px] text-ink-2">{total ? eur(total) : ""}</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {items.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    draggable
                    onDragStart={() => setDragging(p.id)}
                    className="rounded-[18px] bg-white p-3.5 shadow-[var(--shadow-soft)]"
                  >
                    <Link href={`/clients/${p.id}`} className="block">
                      <p className="font-semibold leading-tight">{p.name}</p>
                      <p className="mt-0.5 text-[13px] text-ink-2">
                        {sectorLabel(p.sector)} · {p.city}
                      </p>
                    </Link>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex gap-1">
                        {p.temperature && <Tag tone={p.temperature === "brulant" || p.temperature === "chaud" ? "blue" : "mist"}>{p.temperature}</Tag>}
                      </span>
                      <span className="flex gap-1">
                        {ci > 0 && (
                          <button onClick={() => move(p, PIPELINE[ci - 1].id)} className="grid size-8 place-items-center rounded-full bg-mist text-ink-2 hover:bg-fog" aria-label="Étape précédente">
                            <Icon name="back" size={15} />
                          </button>
                        )}
                        {ci < PIPELINE.length - 1 && (
                          <button onClick={() => move(p, PIPELINE[ci + 1].id)} className="grid size-8 place-items-center rounded-full bg-mist text-ink-2 hover:bg-blue hover:text-white" aria-label="Étape suivante">
                            <Icon name="arrow" size={15} />
                          </button>
                        )}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
