"use client";
import { ask } from "@/components/ui/Confirm";
import { useFill } from "@/lib/useFill";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Empty, Segmented, SectionTitle, Sheet, Tag } from "@/components/ui/primitives";
import { toast } from "@/components/ui/Toast";
import { ScriptEditor } from "@/components/ScriptEditor";
import { getSector } from "@/content/sectors";
import { pricingSummary } from "@/content/offers";
import type { Channel, Objection, Script, ScriptStep, SectorSheet } from "@/content/types";
import { db, useTable } from "@/lib/data/hooks";
import { baseKey, effectiveScript, variantsOf } from "@/lib/scripts";
import { useFavorites } from "@/lib/favorites";
import { useSettings } from "@/lib/settings";
import { dayName, fillPlaceholders, hhmmFr } from "@/lib/format";
import { useSession } from "@/lib/session";
import type { CustomScript } from "@/lib/types";

const SPIN_LABEL = { S: "Situation", P: "Problème", I: "Implication", N: "Besoin" } as const;

export default function SectorPage() {
  const { secteur } = useParams<{ secteur: string }>();
  const s = getSector(secteur);
  const fav = useFavorites();
  if (!s)
    return (
      <div className="pt-16">
        <Empty title="Secteur introuvable.">
          <Link href="/scripts" className="text-blue">
            Retour à la bibliothèque
          </Link>
        </Empty>
      </div>
    );

  return (
    <div>
      <header className="pb-10 pt-8 md:pt-14">
        <Link href="/scripts" className="inline-flex items-center gap-1.5 text-[15px] text-ink-2 hover:text-ink">
          <Icon name="back" size={16} /> Bibliothèque
        </Link>
        <h1 className="display mt-6 text-[48px] md:text-[88px]">{s.name}</h1>
        <p className="mt-4 max-w-3xl text-[19px] leading-relaxed text-ink-2 md:text-[22px]">{s.tagline}</p>
        <p className="mt-3 text-[14px] text-ink-3">{s.examples.join(" · ")}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href={`/scripts/prompteur?secteur=${s.id}&canal=physique`}>
            <Icon name="play" size={16} /> Téléprompteur terrain
          </ButtonLink>
          <ButtonLink href={`/scripts/prompteur?secteur=${s.id}&canal=telephone`} variant="secondary">
            <Icon name="play" size={16} /> Téléprompteur téléphone
          </ButtonLink>
          <Button variant="quiet" onClick={() => fav.toggle("secteur", s.id)}>
            <Icon name="star" size={18} className={fav.has("secteur", s.id) ? "fill-blue text-blue" : ""} /> {fav.has("secteur", s.id) ? "En favori" : "Favori"}
          </Button>
        </div>
        <nav className="scrollbar-none -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 text-[14px] font-medium text-ink-2">
          {[
            ["#realite", "Réalité"],
            ["#offres", "Offres"],
            ["#creneaux", "Créneaux"],
            ["#scripts", "Scripts"],
            ["#decouverte", "Découverte"],
            ["#objections", "Objections"],
            ["#preuves", "Arguments"],
          ].map(([h, l]) => (
            <a key={h} href={h} className="shrink-0 hover:text-blue">
              {l}
            </a>
          ))}
        </nav>
      </header>

      <Reality s={s} />
      <Offers s={s} />
      <Timing s={s} />
      <Scripts s={s} />
      <Discovery s={s} />
      <Objections s={s} />
      <Proofs s={s} />
    </div>
  );
}

function Reality({ s }: { s: SectorSheet }) {
  return (
    <section id="realite" className="scroll-mt-6 pb-16">
      <SectionTitle kicker="01" title="La réalité du métier" />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6 text-[17px] leading-relaxed">
          <p>{s.reality.rhythm}</p>
          <div className="rounded-2xl bg-mist p-5">
            <p className="kicker">Saisonnalité</p>
            <p className="mt-2 text-[16px]">{s.reality.seasonality}</p>
          </div>
          <p className="text-ink-2">{s.reality.digitalHabits}</p>
        </div>
        <div className="space-y-8">
          <List title="Ce qui leur pèse" items={s.reality.pains} />
          <List title="Ce qui leur fait perdre des clients" items={s.reality.clientLoss} />
        </div>
      </div>
      {s.compliance && (
        <div className="mt-8 rounded-2xl border border-signal/20 bg-signal/5 p-5">
          <p className="kicker text-signal">Règles à respecter</p>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed">{s.compliance}</p>
        </div>
      )}
    </section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="kicker">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((x, i) => (
          <li key={i} className="flex gap-3 text-[16px] leading-snug">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue" />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Offers({ s }: { s: SectorSheet }) {
  const { settings } = useSettings();
  const f = useFill();
  const offer = (id: string) => settings.offers.find((o) => o.id === id);
  return (
    <section id="offres" className="scroll-mt-6 pb-16">
      <SectionTitle kicker="02" title="Quoi proposer" />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="kicker">Pied dans la porte</p>
          {s.offers.entry.map((o) => (
            <div key={o.offer} className="mt-3 rounded-2xl bg-blue-soft p-5">
              <p className="text-[18px] font-semibold">{offer(o.offer)?.name ?? o.offer}</p>
              <p className="mt-1 text-[13px] text-blue">{offer(o.offer) ? pricingSummary(offer(o.offer)!) : ""}</p>
              <p className="mt-3 text-[16px] leading-relaxed">« {f(o.pitch)} »</p>
            </div>
          ))}
        </div>
        <div>
          <p className="kicker">À pousser en priorité</p>
          {s.offers.priority.map((o) => (
            <div key={o.offer} className="mt-3 rounded-2xl border border-line p-5">
              <p className="text-[18px] font-semibold">{offer(o.offer)?.name ?? o.offer}</p>
              <p className="mt-1 text-[13px] text-ink-2">{offer(o.offer) ? pricingSummary(offer(o.offer)!) : ""}</p>
              <p className="mt-3 text-[16px] leading-relaxed">« {f(o.pitch)} »</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-[16px] text-ink-2">
        <span className="font-semibold text-ink">Et ensuite : </span>
        {s.offers.upsell}
      </p>
    </section>
  );
}

function Timing({ s }: { s: SectorSheet }) {
  const t = s.timing;
  const days = (d?: number[]) => (d?.length ? d.map(dayName).join(", ") : "tous les jours");
  return (
    <section id="creneaux" className="scroll-mt-6 pb-16">
      <SectionTitle kicker="03" title="Quand passer, quand appeler" />
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="kicker text-ok">Meilleurs créneaux</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {t.best.map((w, i) => (
              <li key={i} className="py-3">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="num text-[20px] font-semibold">
                    {hhmmFr(w.from)} – {hhmmFr(w.to)}
                  </span>
                  <span className="text-[14px] text-ink-2">
                    {w.label} · {days(w.days)}
                  </span>
                </p>
                <p className="mt-1 text-[15px] text-ink-2">{w.why}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker text-signal">À éviter</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {t.avoid.map((w, i) => (
              <li key={i} className="py-3">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="num text-[20px] font-semibold text-ink-2 line-through decoration-signal/50">
                    {hhmmFr(w.from)} – {hhmmFr(w.to)}
                  </span>
                  <span className="text-[14px] text-ink-2">
                    {w.label} · {days(w.days)}
                  </span>
                </p>
                <p className="mt-1 text-[15px] text-ink-2">{w.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Note title="Souvent fermé">{t.usuallyClosed.length ? t.usuallyClosed.map(dayName).join(", ") : "Rarement fermé"}</Note>
        <Note title="Au téléphone">{t.phoneNote}</Note>
        <Note title="Dans l'année">{t.seasonNote}</Note>
      </div>
    </section>
  );
}

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-mist p-4">
      <p className="kicker">{title}</p>
      <p className="mt-2 text-[15px] leading-relaxed">{children}</p>
    </div>
  );
}

function Scripts({ s }: { s: SectorSheet }) {
  const [channel, setChannel] = useState<Channel>("physique");
  const { rows: customs } = useTable("custom_scripts");
  const fav = useFavorites();
  const { script, custom } = effectiveScript(s, channel, customs);
  const variants = variantsOf(s.id, customs).filter((v) => v.channel === channel);
  const [editing, setEditing] = useState<null | { mode: "override" | "variant" | "edit-variant"; base: { title: string; steps: ScriptStep[] }; id?: string }>(null);

  async function saveEdit(title: string, steps: ScriptStep[]) {
    if (!editing) return;
    if (editing.mode === "override") {
      if (custom) await db.update("custom_scripts", custom.id, { title, steps });
      else await db.insert("custom_scripts", { sector: s.id, channel, base_key: baseKey(s.id, channel), title, steps });
      toast("Script mis à jour", "L'original reste dans la bibliothèque.");
    } else if (editing.mode === "variant") {
      await db.insert("custom_scripts", { sector: s.id, channel, base_key: null, title, steps });
      toast("Variante créée");
    } else if (editing.id) {
      await db.update("custom_scripts", editing.id, { title, steps });
      toast("Variante enregistrée");
    }
    setEditing(null);
  }

  async function restore() {
    if (!custom || !(await ask("Revenir au script d'origine ? Vos modifications seront supprimées.", { action: "Restaurer" }))) return;
    for (const c of customs.filter((c) => c.base_key === baseKey(s.id, channel))) await db.remove("custom_scripts", c.id);
    toast("Script d'origine restauré");
  }

  return (
    <section id="scripts" className="scroll-mt-6 pb-16">
      <SectionTitle kicker="04" title="Les scripts">
        <Segmented
          value={channel}
          onChange={setChannel}
          options={[
            { value: "physique", label: "Terrain" },
            { value: "telephone", label: "Téléphone" },
          ]}
        />
      </SectionTitle>
      <div id={`script-${channel}`} className="scroll-mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] text-ink-2">
            {script.title} · {script.duration}
            {custom && (
              <Tag tone="blue" className="ml-2">
                Modifié
              </Tag>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/scripts/prompteur?secteur=${s.id}&canal=${channel}`} size="sm">
              <Icon name="play" size={14} /> Téléprompteur
            </ButtonLink>
            <Button size="sm" variant="secondary" onClick={() => setEditing({ mode: "override", base: script })}>
              <Icon name="edit" size={14} /> Modifier
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEditing({ mode: "variant", base: { title: `${script.title} (variante)`, steps: script.steps } })}>
              <Icon name="copy" size={14} /> Dupliquer
            </Button>
            <Button size="sm" variant="quiet" onClick={() => fav.toggle("script", `${s.id}|${channel}`)} aria-label="Favori">
              <Icon name="star" size={16} className={fav.has("script", `${s.id}|${channel}`) ? "fill-blue text-blue" : ""} />
            </Button>
            {custom && (
              <Button size="sm" variant="quiet" onClick={restore}>
                Restaurer l&apos;original
              </Button>
            )}
          </div>
        </div>
        <ScriptView script={script} />
      </div>

      {variants.length > 0 && (
        <div className="mt-10">
          <p className="kicker">Vos variantes</p>
          <div className="mt-3 space-y-2">
            {variants.map((v: CustomScript) => (
              <div key={v.id} id={`custom-${v.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-mist px-4 py-3">
                <span className="font-semibold">{v.title}</span>
                <span className="flex gap-1.5">
                  <ButtonLink href={`/scripts/prompteur?custom=${v.id}`} size="sm" variant="ghost">
                    <Icon name="play" size={14} />
                  </ButtonLink>
                  <Button size="sm" variant="ghost" onClick={() => setEditing({ mode: "edit-variant", base: v, id: v.id })}>
                    <Icon name="edit" size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={async () => (await ask("Supprimer cette variante ?", { action: "Supprimer" })) && db.remove("custom_scripts", v.id)}>
                    <Icon name="trash" size={14} />
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Sheet open={!!editing} onClose={() => setEditing(null)} title={editing?.mode === "override" ? "Modifier le script" : editing?.mode === "variant" ? "Nouvelle variante" : "Modifier la variante"} wide>
        {editing && <ScriptEditor initialTitle={editing.base.title} initialSteps={editing.base.steps} onSave={saveEdit} />}
      </Sheet>
    </section>
  );
}

function ScriptView({ script }: { script: Script }) {
  const { me } = useSession();
  const f = (t: string) => fillPlaceholders(t, { prenom: me?.display_name });
  return (
    <ol className="mt-6 space-y-8">
      {script.steps.map((st, i) => (
        <motion.li key={st.id + i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} className="grid gap-3 md:grid-cols-[200px_1fr]">
          <div>
            <p className="num text-[13px] font-semibold text-blue">Étape {i + 1}</p>
            <p className="mt-1 text-[19px] font-semibold leading-tight tracking-tight">{st.title}</p>
            <p className="mt-1 text-[14px] text-ink-2">{st.goal}</p>
          </div>
          <div>
            <div className="space-y-3 border-l-2 border-blue/30 pl-5">
              {st.lines.map((l, k) => (
                <p key={k} className="text-[18px] leading-relaxed">
                  {f(l)}
                </p>
              ))}
            </div>
            {st.tip && <p className="mt-3 text-[15px] italic text-ink-2">{f(st.tip)}</p>}
            {!!st.branches?.length && (
              <div className="mt-4 space-y-2">
                {st.branches.map((b, k) => (
                  <div key={k} className="rounded-xl bg-mist px-4 py-3 text-[15px]">
                    <span className="font-semibold">Si {b.if.replace(/^si\s+/i, "")}</span> → {f(b.then)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

function Discovery({ s }: { s: SectorSheet }) {
  return (
    <section id="decouverte" className="scroll-mt-6 pb-16">
      <SectionTitle kicker="05" title="Questions de découverte (SPIN)" />
      <ol className="divide-y divide-line border-y border-line">
        {s.discovery.map((q, i) => (
          <li key={i} className="grid gap-2 py-4 md:grid-cols-[130px_1fr_1fr] md:gap-6">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-blue">{SPIN_LABEL[q.type]}</span>
            <span className="text-[18px] font-medium leading-snug">« {q.question} »</span>
            <span className="text-[15px] text-ink-2">{q.why}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Objections({ s }: { s: SectorSheet }) {
  const [open, setOpen] = useState<string | null>(null);
  const fav = useFavorites();
  return (
    <section id="objections" className="scroll-mt-6 pb-16">
      <SectionTitle kicker="06" title="Objections et réponses">
        <span className="text-[13px] text-ink-2">Accueillir → Questionner → Recadrer → Proposer</span>
      </SectionTitle>
      <div className="border-t border-line">
        {s.objections.map((o) => (
          <ObjectionRow key={o.id} o={o} open={open === o.id} onToggle={() => setOpen(open === o.id ? null : o.id)} fav={fav.has("objection", `${s.id}|${o.id}`)} onFav={() => fav.toggle("objection", `${s.id}|${o.id}`)} />
        ))}
      </div>
    </section>
  );
}

function ObjectionRow({ o, open, onToggle, fav, onFav }: { o: Objection; open: boolean; onToggle: () => void; fav: boolean; onFav: () => void }) {
  const f = useFill();
  const steps = [
    ["Accueillir", f(o.accueillir)],
    ["Questionner", f(o.questionner)],
    ["Recadrer", f(o.recadrer)],
    ["Proposer", f(o.proposer)],
  ];
  return (
    <div id={`obj-${o.id}`} className="scroll-mt-6 border-b border-line">
      <div className="flex items-center gap-2">
        <button onClick={onToggle} className="flex flex-1 items-center justify-between gap-3 py-5 text-left" aria-expanded={open}>
          <span className="text-[20px] font-semibold leading-snug tracking-tight md:text-[24px]">« {o.objection} »</span>
          <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-ink-3">
            <Icon name="plus" size={22} />
          </motion.span>
        </button>
        <button onClick={onFav} className="grid size-10 place-items-center rounded-full hover:bg-mist" aria-label="Favori">
          <Icon name="star" size={18} className={fav ? "fill-blue text-blue" : "text-ink-3"} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-4 text-[15px] text-ink-2">
              <span className="font-semibold text-ink">Ce que ça cache souvent : </span>
              {o.hidden}
            </p>
            <div className="grid gap-3 pb-6 md:grid-cols-4">
              {steps.map(([label, text], i) => (
                <div key={label} className={`rounded-2xl p-4 ${i === 3 ? "bg-blue text-white" : "bg-mist"}`}>
                  <p className={`text-[12px] font-semibold uppercase tracking-wider ${i === 3 ? "text-white/80" : "text-blue"}`}>
                    {i + 1}. {label}
                  </p>
                  <p className="mt-2 text-[16px] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Proofs({ s }: { s: SectorSheet }) {
  const f = useFill();
  return (
    <section id="preuves" className="scroll-mt-6 grid gap-10 pb-16 md:grid-cols-2">
      <div>
        <SectionTitle kicker="07" title="Arguments honnêtes" />
        <List title="En général…" items={s.proofs} />
      </div>
      <div>
        <SectionTitle kicker="08" title="Signaux d'achat" />
        <List title="Quand vous voyez ça, proposez le RDV" items={s.buyingSignals} />
        <div className="mt-8 rounded-2xl bg-ink p-5 text-white">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-white/60">Pitch 30 secondes</p>
          <p className="mt-2 text-[17px] leading-relaxed">{f(s.pitch30s)}</p>
        </div>
      </div>
    </section>
  );
}
