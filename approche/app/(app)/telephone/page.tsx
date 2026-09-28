"use client";
import { useFill } from "@/lib/useFill";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Field, PageHeader, SectionTitle, Segmented, Tag } from "@/components/ui/primitives";
import { compliance, followUpRules, goldenRules, outcomes, phoneScripts, sessionTips } from "@/content/phone-method";
import { sectorLabel } from "@/content/sectors";
import { db, useTable } from "@/lib/data/hooks";
import { useSettings } from "@/lib/settings";
import { useSession } from "@/lib/session";
import { slotVerdict, VERDICT_LABEL, type SlotVerdict } from "@/lib/timing";
import { hhmmFr, todayISO } from "@/lib/format";
import { useCallSession } from "@/store/callSession";

type Tab = "session" | "scripts" | "regles";
const ORDER: Record<SlotVerdict, number> = { ideal: 0, ok: 1, eviter: 2, ferme: 3 };

export default function TelephonePage() {
  const [tab, setTab] = useState<Tab>("session");
  const active = useCallSession((s) => s.sessionId && s.index < s.queue.length);
  return (
    <div>
      <PageHeader
        kicker="Plan de prospection téléphonique"
        title={
          <>
            Le téléphone. <span className="text-ink-3">On vend le rendez-vous, jamais le prix.</span>
          </>
        }
        actions={
          <>
            {active && (
              <ButtonLink href="/telephone/session">
                <Icon name="phone" size={18} /> Reprendre la session
              </ButtonLink>
            )}
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: "session", label: "Session" },
                { value: "scripts", label: "Scripts" },
                { value: "regles", label: "Règles" },
              ]}
            />
          </>
        }
      />
      {tab === "session" && <Planner />}
      {tab === "scripts" && <GenericScripts />}
      {tab === "regles" && <Rules />}
    </div>
  );
}

function Planner() {
  const { rows: prospects } = useTable("prospects");
  const { rows: tasks } = useTable("tasks");
  const { settings } = useSettings();
  const { me } = useSession();
  const router = useRouter();
  const start = useCallSession((s) => s.start);
  const [duration, setDuration] = useState(String(settings.callSessionMinutes));
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(Math.ceil(d.getMinutes() / 5) * 5 % 60).padStart(2, "0")}`;
  });
  const [deselected, setDeselected] = useState<string[]>([]);

  const at = useMemo(() => {
    const d = new Date(`${todayISO()}T${time}:00`);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [time]);

  const list = useMemo(() => {
    const due = new Set(tasks.filter((t) => !t.done && t.due_at <= todayISO() && t.prospect_id && ["rappel", "sms"].includes(t.kind)).map((t) => t.prospect_id!));
    return prospects
      .filter((p) => p.phone && !["signe", "perdu"].includes(p.status))
      .map((p) => ({ p, v: slotVerdict(p.sector, at), due: due.has(p.id) }))
      .sort((a, b) => Number(b.due) - Number(a.due) || ORDER[a.v.verdict] - ORDER[b.v.verdict] || Number(a.p.assigned_to !== me?.id) - Number(b.p.assigned_to !== me?.id));
  }, [prospects, tasks, at, me?.id]);

  // Objectif de la session : ~1 appel toutes les 3 minutes, pauses comprises
  const capacity = Math.round(Number(duration) / 3);
  const selected = list.filter((x) => !deselected.includes(x.p.id) && x.v.verdict !== "ferme").slice(0, capacity);

  async function go() {
    const session = await db.insert("call_sessions", {
      planned_at: at.toISOString(),
      duration_min: Number(duration),
      prospect_ids: selected.map((s) => s.p.id),
      started_at: new Date().toISOString(),
    });
    start(session.id, selected.map((s) => s.p.id), Number(duration));
    router.push("/telephone/session");
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[360px_1fr]">
      <div className="space-y-6">
        <Field label="Durée du bloc" group>
          <Segmented
            value={duration}
            onChange={setDuration}
            options={["30", "45", "60", "90"].map((v) => ({ value: v, label: `${v} min` }))}
          />
        </Field>
        <Field label="Heure de début">
          <input type="time" className="field max-w-[180px]" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <div className="rounded-[22px] bg-ink p-6 text-white">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-white/60">Ce bloc</p>
          <p className="display mt-2 text-[56px]">{selected.length}</p>
          <p className="text-[15px] text-white/70">appels prévus, environ un toutes les 3 minutes.</p>
          <Button size="lg" className="mt-5 w-full" onClick={go} disabled={!selected.length}>
            <Icon name="phone" size={18} /> Démarrer le mode Appel
          </Button>
        </div>
        <ul className="space-y-2 text-[14px] text-ink-2">
          {sessionTips.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-blue">—</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <SectionTitle kicker={`À ${hhmmFr(time)}`} title="La liste d'appels" />
        {list.length === 0 && (
          <p className="text-ink-2">
            Aucun prospect avec un numéro.{" "}
            <Link href="/clients/nouveau" className="text-blue">
              Ajouter un prospect
            </Link>
          </p>
        )}
        <ul className="border-t border-line">
          {list.map(({ p, v, due }) => {
            const on = selected.some((s) => s.p.id === p.id);
            const off = deselected.includes(p.id);
            return (
              <li key={p.id} className="flex items-center gap-3 border-b border-line py-3">
                <button
                  onClick={() => setDeselected(off ? deselected.filter((x) => x !== p.id) : [...deselected, p.id])}
                  className={`grid size-7 shrink-0 place-items-center rounded-full border ${on ? "border-blue bg-blue text-white" : "border-ink-3"}`}
                  aria-label={on ? "Retirer de la session" : "Ajouter à la session"}
                >
                  {on && <Icon name="check" size={14} strokeWidth={2.4} />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="truncate text-[13px] text-ink-2">
                    {sectorLabel(p.sector)} · {p.city} · {p.phone}
                  </p>
                </div>
                {due && <Tag tone="ink">relance</Tag>}
                <Tag tone={v.verdict === "ideal" ? "ok" : v.verdict === "ok" ? "mist" : "signal"}>{VERDICT_LABEL[v.verdict]}</Tag>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function GenericScripts() {
  const f = useFill();
  const [open, setOpen] = useState<string | null>(phoneScripts[0]?.id ?? null);
  return (
    <div className="grid gap-10 md:grid-cols-[280px_1fr]">
      <nav className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-col md:px-0">
        {phoneScripts.map((s) => (
          <button
            key={s.id}
            onClick={() => setOpen(s.id)}
            className={`shrink-0 rounded-2xl px-4 py-3 text-left text-[15px] font-medium ${open === s.id ? "bg-ink text-white" : "bg-mist hover:bg-fog"}`}
          >
            {s.title}
          </button>
        ))}
      </nav>
      <AnimatePresence mode="wait">
        {phoneScripts
          .filter((s) => s.id === open)
          .map((s) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="kicker">{s.maxDuration ? `${s.maxDuration} max` : "Script"}</p>
              <h2 className="display mt-2 text-[36px] md:text-[52px]">{s.title}</h2>
              <p className="mt-3 text-[17px] text-ink-2">{s.context}</p>
              <div className="mt-6 space-y-4 border-l-2 border-blue/30 pl-5">
                {s.lines.map((l, i) => (
                  <p key={i} className={`text-[19px] leading-relaxed ${s.id.startsWith("sms") ? "rounded-2xl bg-mist p-4 font-mono text-[15px]" : ""}`}>
                    {f(l)}
                  </p>
                ))}
              </div>
              {s.tip && <p className="mt-4 text-[15px] italic text-ink-2">{f(s.tip)}</p>}
              {!s.id.startsWith("sms") && (
                <ButtonLink href={`/scripts/prompteur?phone=${s.id}`} className="mt-6" size="sm">
                  <Icon name="play" size={14} /> Téléprompteur
                </ButtonLink>
              )}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

function Rules() {
  return (
    <div className="space-y-20">
      <section>
        <SectionTitle kicker="Au téléphone" title="Les règles d'or" />
        <ol className="grid gap-x-12 gap-y-8 md:grid-cols-2">
          {goldenRules.map((r, i) => (
            <li key={i} className="grid grid-cols-[48px_1fr] gap-2">
              <span className="display text-[40px] text-blue">{i + 1}</span>
              <div>
                <p className="text-[20px] font-semibold tracking-tight">{r.title}</p>
                <p className="mt-1 text-[16px] leading-relaxed text-ink-2">{r.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <SectionTitle kicker="Relances automatiques" title="Après chaque appel" />
        <ul className="divide-y divide-line border-y border-line">
          {followUpRules.map((r, i) => (
            <li key={i} className="grid gap-2 py-4 md:grid-cols-[220px_1fr_120px]">
              <span className="font-semibold">
                {outcomes.find((o) => o.id === r.outcome)?.label}
                {r.afterCount > 1 && ` × ${r.afterCount}`}
              </span>
              <span className="text-[15px] text-ink-2">{r.action}</span>
              <span className="num text-[14px] text-ink-3 md:text-right">{r.delayDays === 0 ? "le jour même" : `J+${r.delayDays}`}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <SectionTitle kicker="Conformité" title="Prospecter dans les règles" />
        <div className="grid gap-4 md:grid-cols-2">
          {compliance.map((c) => (
            <div key={c.title} className="rounded-[22px] border border-line p-5">
              <p className="text-[18px] font-semibold">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.points.map((p, i) => (
                  <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink-2">
                    <span className="text-blue">—</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
