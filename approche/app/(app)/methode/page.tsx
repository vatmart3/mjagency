"use client";
import { useFill } from "@/lib/useFill";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHeader, Segmented, SectionTitle } from "@/components/ui/primitives";
import { toast } from "@/components/ui/Toast";
import { profiles, profileById } from "@/content/profiles";
import { temperatures } from "@/content/thermometer";
import { analyzeSignals, signals } from "@/content/signals";
import { ethics } from "@/content/ethics";
import type { Signal } from "@/content/types";
import { db, useTable } from "@/lib/data/hooks";
import { fillPlaceholders } from "@/lib/format";
import { useSession } from "@/lib/session";

type Tab = "lecture" | "profils" | "thermometre" | "ethique";

export default function MethodePage() {
  const [tab, setTab] = useState<Tab>("lecture");
  return (
    <div>
      <PageHeader
        kicker="Méthode d'approche"
        title={
          <>
            Lire la personne <span className="text-ink-3">avant de lui parler de vous.</span>
          </>
        }
        actions={
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "lecture", label: "En direct" },
              { value: "profils", label: "Profils" },
              { value: "thermometre", label: "Thermomètre" },
              { value: "ethique", label: "Éthique" },
            ]}
          />
        }
      />
      {tab === "lecture" && <LiveReading />}
      {tab === "profils" && <Profiles />}
      {tab === "thermometre" && <Thermometer />}
      {tab === "ethique" && <Ethics />}
    </div>
  );
}

/* ------------------------------------------------------- Lecture en direct */

const CATEGORIES: { id: Signal["category"]; label: string }[] = [
  { id: "verbal", label: "Ce qu'il dit" },
  { id: "non-verbal", label: "Ce qu'il fait" },
  { id: "telephone", label: "Au téléphone" },
  { id: "contexte", label: "Le contexte" },
];

function LiveReading() {
  const [picked, setPicked] = useState<string[]>([]);
  const [prospectId, setProspectId] = useState("");
  const { rows: prospects } = useTable("prospects");
  const { me } = useSession();
  const target = prospects.find((p) => p.id === prospectId);
  const vars = { prenom: me?.display_name, commerce: target?.name, dirigeant: target?.owner_name ?? undefined, ville: target?.city ?? undefined };
  const raw = useMemo(() => analyzeSignals(picked), [picked]);
  const fill = (l: { text: string; why: string }) => ({ ...l, text: fillPlaceholders(l.text, vars) });
  const a = { ...raw, line: fill(raw.line), alternatives: raw.alternatives.map(fill) };
  const tempIndex = temperatures.findIndex((t) => t.id === a.temperature);
  const profile = a.profile ? profileById[a.profile] : null;
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function apply() {
    if (!prospectId) return;
    await db.update("prospects", prospectId, { disc: a.profile, temperature: a.temperature });
    toast("Lecture enregistrée sur la fiche");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="max-w-2xl text-[16px] text-ink-2">
          Pendant ou juste après l&apos;échange, cochez ce que vous avez observé. L&apos;app en déduit le profil probable, la température et la meilleure phrase à dire ensuite. Règles fixes, pas d&apos;IA.
        </p>
        <div className="mt-8 space-y-8">
          {CATEGORIES.map((c) => (
            <div key={c.id}>
              <p className="kicker">{c.label}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {signals
                  .filter((s) => s.category === c.id)
                  .map((s) => {
                    const on = picked.includes(s.id);
                    return (
                      <motion.button
                        key={s.id}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => toggle(s.id)}
                        aria-pressed={on}
                        className={`rounded-full px-4 py-2.5 text-left text-[14px] font-medium leading-tight transition-colors ${
                          on ? (s.heat > 0 ? "bg-blue text-white" : s.heat < 0 ? "bg-ink text-white" : "bg-ink-2 text-white") : "bg-mist hover:bg-fog"
                        }`}
                      >
                        {s.label}
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-[28px] bg-white p-6 shadow-[var(--shadow-lift)] ring-1 ring-line">
          <div className="flex items-center justify-between">
            <p className="kicker">Lecture</p>
            {picked.length > 0 && (
              <button onClick={() => setPicked([])} className="text-[13px] text-ink-3 hover:text-ink">
                Tout effacer ({picked.length})
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-ink-3">Profil probable</p>
              <AnimatePresence mode="wait">
                <motion.p key={profile?.id ?? "none"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-[22px] font-semibold tracking-tight" style={{ color: profile?.color }}>
                  {profile?.name ?? "—"}
                </motion.p>
              </AnimatePresence>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-mist">
                <motion.div className="h-full" style={{ background: profile?.color ?? "#a1a1a6" }} animate={{ width: `${Math.round(a.confidence * 100)}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-ink-3">confiance {Math.round(a.confidence * 100)} %</p>
            </div>
            <div>
              <p className="text-[12px] text-ink-3">Température</p>
              <p className="mt-1 text-[22px] font-semibold tracking-tight">{temperatures[tempIndex]?.name}</p>
              <div className="mt-2 flex gap-1">
                {temperatures.map((t, i) => (
                  <motion.span key={t.id} className="h-1 flex-1 rounded-full" animate={{ background: i <= tempIndex ? "#0071e3" : "#ebebef" }} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blue p-5 text-white">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-white/70">Prochaine phrase</p>
            <AnimatePresence mode="wait">
              <motion.p key={a.line.text} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-[20px] font-semibold leading-snug">
                « {a.line.text} »
              </motion.p>
            </AnimatePresence>
            <p className="mt-2 text-[14px] text-white/80">{a.line.why}</p>
          </div>

          {a.alternatives.length > 0 && (
            <div className="mt-4 space-y-2">
              {a.alternatives.map((l) => (
                <div key={l.text} className="rounded-2xl bg-mist px-4 py-3">
                  <p className="text-[15px] font-medium">« {l.text} »</p>
                  <p className="mt-0.5 text-[13px] text-ink-2">{l.why}</p>
                </div>
              ))}
            </div>
          )}

          {a.advice.length > 0 && (
            <ul className="mt-5 space-y-2">
              {a.advice.map((x, i) => (
                <li key={i} className="flex gap-2 text-[14px] leading-snug">
                  <span className="text-blue">—</span>
                  {x}
                </li>
              ))}
            </ul>
          )}

          {temperatures[tempIndex] && (
            <p className="mt-5 border-t border-line pt-4 text-[14px] leading-relaxed text-ink-2">
              <span className="font-semibold text-ink">À ce niveau : </span>
              {temperatures[tempIndex].action}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <select className="field py-2 text-[14px]" value={prospectId} onChange={(e) => setProspectId(e.target.value)} aria-label="Prospect">
              <option value="">Enregistrer sur un prospect…</option>
              {prospects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={apply} disabled={!prospectId || !picked.length}>
              OK
            </Button>
          </div>
        </div>
        <p className="mt-4 px-2 text-[12px] leading-relaxed text-ink-3">{ethics.intro}</p>
      </aside>
    </div>
  );
}

/* ---------------------------------------------------------------- Profils */

function Profiles() {
  return (
    <div className="space-y-24">
      {profiles.map((p, i) => (
        <motion.section key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="num text-[14px] font-semibold" style={{ color: p.color }}>
                0{i + 1}
              </p>
              <h2 className="display mt-2 text-[52px] md:text-[72px]" style={{ color: p.color }}>
                {p.name}
              </h2>
              <p className="mt-3 text-[20px] leading-snug">{p.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.recognize.vocabulary.map((v) => (
                  <span key={v} className="rounded-full px-3 py-1.5 text-[14px]" style={{ background: `${p.color}14`, color: p.color }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Block title="Débit">{p.recognize.pace}</Block>
              <Block title="Posture">{p.recognize.posture}</Block>
              <Block title="Son commerce">{p.recognize.environment}</Block>
              <Block title="Au téléphone">{p.recognize.phone}</Block>
              <div className="sm:col-span-2">
                <p className="kicker">Les questions qu&apos;il pose</p>
                <ul className="mt-2 space-y-1.5">
                  {p.recognize.questions.map((q) => (
                    <li key={q} className="text-[16px]">
                      « {q.replace(/^«\s*|\s*»$/g, "")} »
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ListBlock title="Ce qu'il veut entendre" items={p.wants} color={p.color} />
            <ListBlock title="À éviter" items={p.avoid} color="#d70015" />
            <div className="rounded-[22px] p-5 text-white" style={{ background: p.color }}>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-white/75">Comment conclure</p>
              <p className="mt-2 text-[17px] leading-relaxed">{p.close}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="kicker">Phrases qui marchent</p>
            <div className="scrollbar-none -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2">
              {p.phrases.map((ph) => (
                <p key={ph} className="w-[280px] shrink-0 rounded-2xl bg-mist p-4 text-[16px] leading-snug">
                  « {ph.replace(/^«\s*|\s*»$/g, "")} »
                </p>
              ))}
            </div>
          </div>
        </motion.section>
      ))}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="kicker">{title}</p>
      <p className="mt-2 text-[15px] leading-relaxed">{children}</p>
    </div>
  );
}

function ListBlock({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className="rounded-[22px] border border-line p-5">
      <p className="kicker" style={{ color }}>
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((x) => (
          <li key={x} className="flex gap-2 text-[15px] leading-snug">
            <span style={{ color }}>—</span>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------ Thermomètre */

function Thermometer() {
  const f = useFill();
  const [sel, setSel] = useState(2);
  const t = temperatures[sel];
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {temperatures.map((x, i) => (
          <motion.button
            key={x.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSel(i)}
            className="relative h-28 overflow-hidden rounded-[18px] text-left md:h-40"
            style={{ background: `rgba(0,113,227,${0.08 + i * 0.2})` }}
          >
            {sel === i && <motion.span layoutId="thermo" className="absolute inset-0 rounded-[18px] ring-2 ring-ink ring-offset-2" />}
            <span className={`absolute bottom-3 left-3 text-[14px] font-semibold md:text-[20px] ${i >= 3 ? "text-white" : "text-ink"}`}>{x.name}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10">
          <h2 className="display text-[48px] md:text-[72px]">{t.name}.</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <ListBlock title="Ce qu'il dit" items={t.verbal} color="#0071e3" />
            <ListBlock title="Ce qu'il fait" items={t.nonVerbal} color="#0071e3" />
            <ListBlock title="Au téléphone" items={t.phone} color="#0071e3" />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.3fr_1fr]">
            <div className="rounded-[22px] bg-ink p-6 text-white">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-white/60">Action recommandée</p>
              <p className="mt-2 text-[19px] leading-relaxed">{t.action}</p>
            </div>
            <div className="rounded-[22px] bg-blue-soft p-6">
              <p className="kicker text-blue">À dire</p>
              <p className="mt-2 text-[19px] font-semibold leading-snug">« {f(t.line.replace(/^«\s*|\s*»$/g, ""))} »</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- Éthique */

function Ethics() {
  return (
    <div className="max-w-4xl">
      <SectionTitle kicker="Notre ligne" title={ethics.title} />
      <p className="text-[20px] leading-relaxed md:text-[24px]">{ethics.intro}</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {ethics.principles.map((p) => (
          <div key={p.title}>
            <p className="text-[19px] font-semibold tracking-tight">{p.title}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{p.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-[22px] border border-signal/20 bg-signal/5 p-6">
        <p className="kicker text-signal">Jamais</p>
        <ul className="mt-3 space-y-2">
          {ethics.never.map((n) => (
            <li key={n} className="flex gap-3 text-[16px]">
              <Icon name="close" size={18} className="mt-0.5 shrink-0 text-signal" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
