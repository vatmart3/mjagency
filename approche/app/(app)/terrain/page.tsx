"use client";
import { useFill } from "@/lib/useFill";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip, Field, PageHeader, SectionTitle, Segmented, Sheet, Tag } from "@/components/ui/primitives";
import { toast } from "@/components/ui/Toast";
import { DebriefForm } from "@/components/DebriefForm";
import { checklist, fieldRules, tourAdvice, visitSteps, whatIf } from "@/content/field-method";
import { SECTORS, getSector, sectorLabel } from "@/content/sectors";
import { cityByName } from "@/content/cities";
import { db, useTable } from "@/lib/data/hooks";
import { useSettings } from "@/lib/settings";
import { mapsLinks, planTour, timingFor, VERDICT_LABEL, type TourPlan } from "@/lib/timing";
import { addDays, dayName, frDate, hhmmFr, todayISO } from "@/lib/format";
import type { Prospect } from "@/lib/types";

type Tab = "tournee" | "methode" | "debrief";

function TerrainPage() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(params.get("debrief") ? "debrief" : "tournee");
  return (
    <div>
      <PageHeader
        kicker="Plan de prospection physique"
        title={
          <>
            Le terrain. <span className="text-ink-3">Entrer, accrocher, sortir avec quelque chose.</span>
          </>
        }
        actions={
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "tournee", label: "Tournée" },
              { value: "methode", label: "Méthode" },
              { value: "debrief", label: "Débrief" },
            ]}
          />
        }
      />
      {tab === "tournee" && <TourGenerator />}
      {tab === "methode" && <Method />}
      {tab === "debrief" && <QuickDebrief />}
    </div>
  );
}

/* ------------------------------------------------------------- Tournée */

function TourGenerator() {
  const { settings } = useSettings();
  const { rows: prospects } = useTable("prospects");
  const [cities, setCities] = useState<string[]>(["Sète"]);
  const [extraCity, setExtraCity] = useState("");
  const [sectors, setSectors] = useState<string[]>([]);
  const [duration, setDuration] = useState("180");
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState("14:30");
  const [plan, setPlan] = useState<TourPlan | null>(null);
  const [debrief, setDebrief] = useState<Prospect | null>(null);

  const candidates = useMemo(
    () =>
      prospects.filter(
        (p) =>
          p.to_visit &&
          !["signe", "perdu"].includes(p.status) &&
          (!cities.length || cities.some((c) => (cityByName(c)?.name ?? c).toLowerCase() === (p.city ?? "").toLowerCase())) &&
          (!sectors.length || sectors.includes(p.sector)),
      ),
    [prospects, cities, sectors],
  );
  const sectorsInPlay = [...new Set((plan?.stops.map((s) => s.prospect.sector) ?? candidates.map((c) => c.sector)))];
  const dow = new Date(date + "T12:00:00").getDay();

  const toggle = (list: string[], v: string, set: (l: string[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function save() {
    if (!plan) return;
    await db.insert("tours", { day: date, start_time: start, cities, sectors, duration_min: Number(duration), prospect_ids: plan.stops.map((s) => s.prospect.id) });
    toast("Tournée enregistrée", `${plan.stops.length} arrêts le ${frDate(date)}`);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <Field label="Villes" group>
          <div className="flex flex-wrap gap-2">
            {settings.cities.map((c) => (
              <Chip key={c} active={cities.includes(c)} onClick={() => toggle(cities, c, setCities)}>
                {c}
              </Chip>
            ))}
            {cities
              .filter((c) => !settings.cities.includes(c))
              .map((c) => (
                <Chip key={c} active onClick={() => toggle(cities, c, setCities)}>
                  {c} ×
                </Chip>
              ))}
          </div>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (extraCity.trim()) setCities([...cities, extraCity.trim()]);
              setExtraCity("");
            }}
          >
            <input className="field" placeholder="Autre ville" value={extraCity} onChange={(e) => setExtraCity(e.target.value)} />
            <Button type="submit" variant="secondary">
              Ajouter
            </Button>
          </form>
        </Field>
        <Field label="Secteurs ciblés (aucun = tous)" group>
          <div className="flex flex-wrap gap-2">
            {SECTORS.filter((s) => settings.activeSectors.includes(s.id)).map((s) => (
              <Chip key={s.id} active={sectors.includes(s.id)} onClick={() => toggle(sectors, s.id, setSectors)}>
                {s.short}
              </Chip>
            ))}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Jour">
            <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Départ">
            <input type="time" className="field" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
        </div>
        <Field label="Durée disponible" group>
          <Segmented
            value={duration}
            onChange={setDuration}
            options={[
              { value: "60", label: "1 h" },
              { value: "120", label: "2 h" },
              { value: "180", label: "3 h" },
              { value: "240", label: "4 h" },
            ]}
          />
        </Field>
        <Button size="lg" className="w-full" onClick={() => setPlan(planTour(candidates, { date, start, durationMin: Number(duration) }))}>
          Proposer la tournée ({candidates.length} à visiter)
        </Button>
        {candidates.length === 0 && (
          <p className="text-[14px] text-ink-2">
            Aucun commerce « à visiter » avec ces critères.{" "}
            <Link href="/clients/nouveau" className="text-blue">
              Ajouter un prospect
            </Link>
          </p>
        )}
        <div className="rounded-2xl bg-mist p-5">
          <p className="kicker">Organiser sa tournée</p>
          <ul className="mt-3 space-y-2 text-[15px] leading-snug">
            {tourAdvice.map((a, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue">—</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {plan ? (
            <motion.div key="plan" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="kicker">
                {frDate(date, { weekday: "long", day: "numeric", month: "long" })} · {hhmmFr(start)} → {hhmmFr(plan.endsAt)}
              </p>
              <h2 className="display mt-2 text-[40px] md:text-[56px]">
                {plan.stops.length} arrêts{cities.length ? `, ${cities.join(", ")}` : ""}.
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {mapsLinks(plan.stops.map((s) => s.prospect)).map((href, i, all) => (
                  <ButtonLink key={href} href={href} external>
                    <Icon name="map" size={18} /> Ouvrir l&apos;itinéraire{all.length > 1 ? ` (${i + 1}/${all.length})` : ""}
                  </ButtonLink>
                ))}
                <Button variant="secondary" onClick={save} disabled={!plan.stops.length}>
                  Enregistrer
                </Button>
              </div>
              <ol className="mt-8 border-l border-line pl-6">
                {plan.stops.map((st, i) => (
                  <motion.li key={st.prospect.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative pb-7">
                    <span className="absolute -left-[33px] top-0 grid size-4 place-items-center rounded-full bg-blue text-[9px] font-bold text-white">{i + 1}</span>
                    <p className="num text-[14px] font-semibold text-ink-2">
                      {hhmmFr(st.eta)}
                      {st.travelMin > 0 && <span className="font-normal text-ink-3"> · {st.travelMin} min de trajet</span>}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Link href={`/clients/${st.prospect.id}`} className="text-[20px] font-semibold tracking-tight hover:text-blue">
                        {st.prospect.name}
                      </Link>
                      <Tag tone={st.verdict === "ideal" ? "ok" : st.verdict === "eviter" ? "signal" : "mist"}>{VERDICT_LABEL[st.verdict]}</Tag>
                    </div>
                    <p className="text-[14px] text-ink-2">
                      {sectorLabel(st.prospect.sector)} · {st.prospect.address ?? st.prospect.city}
                      {st.prospect.owner_name && ` · demander ${st.prospect.owner_name}`}
                    </p>
                    {st.prospect.hook && <p className="mt-2 text-[15px] italic">« {st.prospect.hook} »</p>}
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setDebrief(st.prospect)}>
                        Débrief
                      </Button>
                      <ButtonLink size="sm" variant="ghost" href={`/scripts/prompteur?prospect=${st.prospect.id}&canal=physique`}>
                        Script
                      </ButtonLink>
                    </div>
                  </motion.li>
                ))}
              </ol>
              {plan.skipped.length > 0 && (
                <div className="mt-2">
                  <p className="kicker">Pas cette fois</p>
                  <ul className="mt-2 space-y-1 text-[14px] text-ink-2">
                    {plan.skipped.map((s) => (
                      <li key={s.prospect.id}>
                        {s.prospect.name} — {s.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="kicker">Avant de partir</p>
              <h2 className="display mt-2 text-[36px] md:text-[48px]">Chaque métier a son heure.</h2>
              <p className="mt-3 max-w-xl text-[17px] text-ink-2">
                La tournée tient compte des créneaux ci-dessous : un boulanger à midi ou un restaurant pendant le service, c&apos;est une visite gâchée.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12">
          <SectionTitle kicker={`${dayName(dow)}`} title="Créneaux des secteurs en jeu" />
          <div className="grid gap-3 md:grid-cols-2">
            {(sectorsInPlay.length ? sectorsInPlay : SECTORS.slice(0, 4).map((s) => s.id)).map((sid) => {
              const t = timingFor(sid);
              const closed = t.usuallyClosed.includes(dow as never);
              return (
                <div key={sid} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{getSector(sid)?.name ?? sid}</p>
                    {closed && <Tag tone="signal">souvent fermé ce jour</Tag>}
                  </div>
                  <p className="mt-2 text-[14px]">
                    <span className="font-semibold text-ok">Oui : </span>
                    {t.best.map((w) => `${hhmmFr(w.from)}–${hhmmFr(w.to)}`).join(", ")}
                  </p>
                  <p className="mt-1 text-[14px]">
                    <span className="font-semibold text-signal">Non : </span>
                    {t.avoid.map((w) => `${w.label.toLowerCase()} (${hhmmFr(w.from)}–${hhmmFr(w.to)})`).join(", ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Sheet open={!!debrief} onClose={() => setDebrief(null)} title={debrief ? `Débrief · ${debrief.name}` : ""}>
        {debrief && <DebriefForm prospect={debrief} onDone={() => setDebrief(null)} compact />}
      </Sheet>
    </div>
  );
}

/* -------------------------------------------------------------- Méthode */

function Method() {
  const f = useFill();
  const key = `approche.checklist.${todayISO()}`;
  const [checked, setChecked] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    try {
      setChecked(JSON.parse(localStorage.getItem(key) ?? "[]"));
    } catch {}
  }, [key]);
  const toggle = (id: string) => {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    setChecked(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };
  const groups: { id: "tenue" | "materiel" | "preparation"; label: string }[] = [
    { id: "tenue", label: "Tenue" },
    { id: "materiel", label: "Matériel" },
    { id: "preparation", label: "Préparation" },
  ];

  return (
    <div className="space-y-20">
      <section>
        <SectionTitle kicker="Avant la tournée" title="La checklist">
          <span className="num text-[15px] text-ink-2">
            {checked.length}/{checklist.length}
          </span>
        </SectionTitle>
        <div className="h-1.5 overflow-hidden rounded-full bg-mist">
          <motion.div className="h-full bg-blue" animate={{ width: `${(checked.length / checklist.length) * 100}%` }} />
        </div>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.id}>
              <p className="kicker">{g.label}</p>
              <ul className="mt-3 space-y-1">
                {checklist
                  .filter((c) => c.group === g.id)
                  .map((c) => (
                    <li key={c.id}>
                      <button onClick={() => toggle(c.id)} className="flex w-full gap-3 rounded-2xl px-2 py-2.5 text-left hover:bg-mist">
                        <motion.span
                          animate={{ scale: checked.includes(c.id) ? [1, 1.2, 1] : 1 }}
                          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border ${checked.includes(c.id) ? "border-blue bg-blue text-white" : "border-ink-3"}`}
                        >
                          {checked.includes(c.id) && <Icon name="check" size={14} strokeWidth={2.4} />}
                        </motion.span>
                        <span>
                          <span className={`block text-[16px] font-medium ${checked.includes(c.id) ? "text-ink-3 line-through" : ""}`}>{c.label}</span>
                          <span className="block text-[14px] text-ink-2">{c.detail}</span>
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle kicker="Déroulé d'une visite" title="Les 5 temps" />
        <ol className="space-y-12">
          {visitSteps.map((v) => (
            <motion.li key={v.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className="grid gap-6 md:grid-cols-[120px_1fr]">
              <div>
                <p className="display text-[64px] text-blue md:text-[88px]">{v.n}</p>
                <p className="num text-[14px] font-semibold text-ink-2">{v.duration}</p>
              </div>
              <div>
                <h3 className="text-[26px] font-semibold tracking-tight md:text-[32px]">{v.title}</h3>
                <p className="mt-1 text-[17px] text-ink-2">{v.goal}</p>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <MiniList title="Faire" items={v.do.map(f)} />
                  <div>
                    <p className="kicker text-blue">Dire</p>
                    <ul className="mt-2 space-y-2">
                      {v.say.map((s, i) => (
                        <li key={i} className="rounded-xl bg-blue-soft px-3 py-2 text-[15px] leading-snug">
                          « {f(s)} »
                        </li>
                      ))}
                    </ul>
                  </div>
                  <MiniList title="Éviter" items={v.avoid} tone="signal" />
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section>
        <SectionTitle kicker="Imprévus" title="Que faire si…" />
        <div className="border-t border-line">
          {whatIf.map((w) => (
            <div key={w.id} className="border-b border-line">
              <button onClick={() => setOpen(open === w.id ? null : w.id)} className="flex w-full items-center justify-between py-5 text-left">
                <span className="text-[20px] font-semibold tracking-tight">…{w.situation.replace(/^(que faire )?si\s*/i, "").replace(/^\w/, (c) => c.toLowerCase())}</span>
                <motion.span animate={{ rotate: open === w.id ? 45 : 0 }} className="text-ink-3">
                  <Icon name="plus" size={22} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === w.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid gap-5 pb-6 md:grid-cols-[1fr_1fr_1.2fr]">
                      <p className="text-[15px] text-ink-2">
                        <span className="font-semibold text-ink">Ce qui se passe : </span>
                        {w.read}
                      </p>
                      <MiniList title="Faire" items={w.do.map(f)} />
                      <div className="rounded-2xl bg-blue p-4 text-white">
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-white/70">Dire</p>
                        <p className="mt-2 text-[17px] leading-relaxed">« {f(w.say)} »</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle kicker="À garder en tête" title="Règles d'or du terrain" />
        <ol className="grid gap-x-10 gap-y-5 md:grid-cols-2">
          {fieldRules.map((r, i) => (
            <li key={i} className="flex gap-4 text-[17px] leading-snug">
              <span className="num w-7 shrink-0 font-semibold text-blue">{String(i + 1).padStart(2, "0")}</span>
              {r}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function MiniList({ title, items, tone }: { title: string; items: string[]; tone?: "signal" }) {
  return (
    <div>
      <p className={`kicker ${tone === "signal" ? "text-signal" : ""}`}>{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2 text-[15px] leading-snug">
            <span className={tone === "signal" ? "text-signal" : "text-ink-3"}>—</span>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------- Débrief */

function QuickDebrief() {
  const { rows: prospects } = useTable("prospects");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Prospect | null>(null);
  const [quickName, setQuickName] = useState("");
  const [quickSector, setQuickSector] = useState("boulangerie");
  const [quickCity, setQuickCity] = useState("Sète");
  const list = prospects
    .filter((p) => !q || [p.name, p.city].some((v) => v?.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => Number(b.to_visit) - Number(a.to_visit))
    .slice(0, 8);

  async function createQuick() {
    if (!quickName.trim()) return;
    const p = await db.insert("prospects", { name: quickName.trim(), sector: quickSector, city: quickCity, status: "contacte", to_visit: false, next_action_at: addDays(todayISO(), 2) });
    setPicked(p);
  }

  if (picked)
    return (
      <div className="max-w-xl">
        <button onClick={() => setPicked(null)} className="mb-4 inline-flex items-center gap-1.5 text-[15px] text-ink-2">
          <Icon name="back" size={16} /> Changer de commerce
        </button>
        <h2 className="display text-[40px]">{picked.name}</h2>
        <p className="mb-8 mt-1 text-ink-2">
          {sectorLabel(picked.sector)} · {picked.city}
        </p>
        <DebriefForm prospect={picked} onDone={() => setPicked(null)} />
      </div>
    );

  return (
    <div className="grid max-w-4xl gap-12 md:grid-cols-2">
      <div>
        <p className="kicker">Quel commerce ?</p>
        <input className="field mt-3" placeholder="Rechercher" value={q} onChange={(e) => setQ(e.target.value)} />
        <ul className="mt-3 space-y-1">
          {list.map((p) => (
            <li key={p.id}>
              <button onClick={() => setPicked(p)} className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left hover:bg-mist">
                <span>
                  <span className="block font-semibold">{p.name}</span>
                  <span className="text-[13px] text-ink-2">
                    {sectorLabel(p.sector)} · {p.city}
                  </span>
                </span>
                {p.to_visit && <Tag tone="blue">à visiter</Tag>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="kicker">Pas encore de fiche ?</p>
        <div className="mt-3 space-y-3 rounded-[22px] bg-mist p-5">
          <input className="field bg-white" placeholder="Nom du commerce" value={quickName} onChange={(e) => setQuickName(e.target.value)} />
          <select className="field bg-white" value={quickSector} onChange={(e) => setQuickSector(e.target.value)}>
            {SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input className="field bg-white" placeholder="Ville" value={quickCity} onChange={(e) => setQuickCity(e.target.value)} />
          <Button className="w-full" onClick={createQuick} disabled={!quickName.trim()}>
            Créer et débriefer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <TerrainPage />
    </Suspense>
  );
}
