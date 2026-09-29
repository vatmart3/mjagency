"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Field, Sheet, Tag } from "@/components/ui/primitives";
import { celebrate, toast } from "@/components/ui/Toast";
import { Teleprompter } from "@/components/Teleprompter";
import { phoneScripts, outcomes, type CallOutcome } from "@/content/phone-method";
import { getSector, sectorLabel } from "@/content/sectors";
import { profileById } from "@/content/profiles";
import { db, useTable } from "@/lib/data/hooks";
import { effectiveScript, prospectScript, stepsToSections, type PrompterSection } from "@/lib/scripts";
import { useSession } from "@/lib/session";
import { useSettings } from "@/lib/settings";
import { callsToNextRdv, computeStats } from "@/lib/stats";
import { proposeFollowUp } from "@/lib/followup";
import { nextBestSlot, slotVerdict, VERDICT_LABEL } from "@/lib/timing";
import { addDays, fillPlaceholders, frDate, hhmmFr, todayISO } from "@/lib/format";
import { useDictation } from "@/lib/speech";
import { useCallSession } from "@/store/callSession";
import type { Prospect } from "@/lib/types";

function useTick(active: boolean) {
  const [, set] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => set((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [active]);
}
const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const OUTCOME_STYLE: Record<CallOutcome, string> = {
  pas_de_reponse: "bg-mist text-ink",
  messagerie: "bg-mist text-ink",
  barrage: "bg-mist text-ink",
  refus: "bg-signal/10 text-signal",
  rappel: "bg-blue-soft text-blue",
  rdv: "bg-blue text-white",
};

export default function CallMode() {
  const router = useRouter();
  const s = useCallSession();
  const { rows: prospects, loading } = useTable("prospects");
  const { rows: interactions } = useTable("interactions");
  const { rows: customs } = useTable("custom_scripts");
  const { settings } = useSettings();
  const { me } = useSession();
  const [sheet, setSheet] = useState<null | { kind: "rdv" | "rappel" | "sms"; prospect: Prospect; sms?: string }>(null);
  const [date, setDate] = useState(addDays(todayISO(), 1));
  const [time, setTime] = useState("10:00");
  const [notesOpen, setNotesOpen] = useState(false);
  useTick(!!s.startedAt);

  const current = prospects.find((p) => p.id === s.queue[s.index]);
  const done = s.index >= s.queue.length;
  const elapsed = s.startedAt ? Date.now() - s.startedAt : 0;
  const remaining = s.durationMin * 60000 - elapsed;

  const dict = useDictation((t) => current && s.setNote(current.id, `${s.notes[current.id] ? s.notes[current.id] + " " : ""}${t}`));

  const sections = useMemo((): PrompterSection[] => {
    if (!current) return [];
    const sector = getSector(current.sector);
    const out: PrompterSection[] = [];
    // Priorité au script sur mesure du client, sinon script du secteur (ou générique)
    const own = prospectScript(current.id, "telephone", customs);
    if (own) out.push(...stepsToSections(own.steps));
    else if (sector) {
      if (current.hook) out.push({ title: "Accroche perso", lines: [current.hook] });
      out.push(...stepsToSections(effectiveScript(sector, "telephone", customs).script.steps));
    } else {
      if (current.hook) out.push({ title: "Accroche perso", lines: [current.hook] });
      const o = phoneScripts.find((p) => p.id === "ouverture");
      const r = phoneScripts.find((p) => p.id === "prise-rdv");
      [o, r].forEach((x) => x && out.push({ title: x.title, lines: x.lines, tip: x.tip }));
    }
    const vars = { prenom: me?.display_name, commerce: current.name, dirigeant: current.owner_name ?? undefined, ville: current.city ?? undefined };
    return out.map((x) => ({ ...x, lines: x.lines.map((l) => fillPlaceholders(l, vars)) }));
  }, [current, customs, me?.display_name]);

  // Deux créneaux précis à proposer pour le RDV
  const slots = useMemo(() => {
    if (!current) return [];
    const res: Date[] = [];
    let from = new Date(addDays(todayISO(), 1) + "T08:00:00");
    for (let k = 0; k < 6 && res.length < 2; k++) {
      const n = nextBestSlot(current.sector, from);
      if (!n) break;
      if (!res.some((r) => r.toDateString() === n.toDateString())) res.push(n);
      from = new Date(n.getTime() + 24 * 3600000);
      from.setHours(8, 0, 0, 0);
    }
    return res;
  }, [current]);

  if (!s.sessionId && !loading)
    return (
      <main className="mx-auto grid min-h-dvh max-w-lg place-items-center px-6 text-center">
        <div>
          <p className="display text-[40px]">Aucune session en cours.</p>
          <ButtonLink href="/telephone" className="mt-6">
            Préparer une session
          </ButtonLink>
        </div>
      </main>
    );

  async function outcome(o: CallOutcome) {
    if (!current) return;
    const p = current;
    s.record(p.id, o);
    const note = s.notes[p.id]?.trim() || null;
    const callSec = s.callStartedAt ? Math.round((Date.now() - s.callStartedAt) / 1000) : null;
    await db.insert("interactions", { prospect_id: p.id, channel: "telephone", outcome: o, notes: note, duration_sec: callSec });
    if (p.status === "a_contacter" && o !== "pas_de_reponse" && o !== "messagerie") await db.update("prospects", p.id, { status: "contacte" });

    if (o === "rdv" || o === "rappel") {
      if (o === "rdv" && slots[0]) {
        setDate(slots[0].toISOString().slice(0, 10));
        setTime(`${String(slots[0].getHours()).padStart(2, "0")}:${String(slots[0].getMinutes()).padStart(2, "0")}`);
      } else {
        setDate(addDays(todayISO(), 2));
        setTime("10:00");
      }
      setSheet({ kind: o, prospect: p });
      return;
    }
    const f = proposeFollowUp(p, o, interactions);
    if (f) {
      await db.insert("tasks", { prospect_id: p.id, title: `${f.action} — ${p.name}`, kind: f.smsScriptId ? "sms" : "rappel", due_at: f.dueAt, preferred_slot: f.slot });
      await db.update("prospects", p.id, { next_action: f.action, next_action_at: f.dueAt });
    }
    // Après une messagerie, on propose toujours le SMS type, quelle que soit la relance programmée
    const smsId = f?.smsScriptId ?? (o === "messagerie" ? "sms-apres-messagerie" : undefined);
    if (smsId) {
      const tpl = phoneScripts.find((x) => x.id === smsId)?.lines[0];
      if (tpl) {
        setSheet({ kind: "sms", prospect: p, sms: fillPlaceholders(tpl, { prenom: me?.display_name, commerce: p.name, dirigeant: p.owner_name ?? undefined, ville: p.city ?? undefined }) });
        return;
      }
    }
    toast(outcomes.find((x) => x.id === o)?.label ?? o, f ? `${f.action}${f.slot ? ` · vers ${hhmmFr(f.slot)}` : ""} (${frDate(f.dueAt, { day: "numeric", month: "short" })})` : undefined);
    s.next();
  }

  async function confirmSheet() {
    if (!sheet) return;
    const p = sheet.prospect;
    if (sheet.kind === "rdv") {
      await db.insert("tasks", { prospect_id: p.id, title: `RDV ${p.name}`, kind: "rdv", due_at: date, preferred_slot: time });
      await db.update("prospects", p.id, { status: ["proposition", "signe"].includes(p.status) ? p.status : "rdv", next_action: `RDV le ${frDate(date)} à ${hhmmFr(time)}`, next_action_at: date });
      const st = computeStats([...interactions], prospects, { userId: me?.id });
      const nx = callsToNextRdv(st, settings);
      celebrate("RDV décroché", `${p.name} · ${frDate(date, { weekday: "long", day: "numeric" })} ${hhmmFr(time)}. Prochain dans ~${nx.per} appels.`);
    } else if (sheet.kind === "rappel") {
      await db.insert("tasks", { prospect_id: p.id, title: `Rappeler ${p.name}`, kind: "rappel", due_at: date, preferred_slot: time });
      await db.update("prospects", p.id, { next_action: `Rappeler à ${hhmmFr(time)}`, next_action_at: date });
      toast("Rappel planifié", `${frDate(date)} à ${hhmmFr(time)}`);
    }
    setSheet(null);
    s.next();
  }

  async function finish() {
    if (s.sessionId) await db.update("call_sessions", s.sessionId, { ended_at: new Date().toISOString() }).catch(() => undefined);
    s.reset();
    router.push("/");
  }

  if (done) {
    const r = s.results;
    const count = (o: string) => r.filter((x) => x.outcome === o).length;
    return (
      <main className="mx-auto max-w-2xl px-6 pb-20 pt-16">
        <p className="kicker">Session terminée · {mmss(elapsed)}</p>
        <h1 className="display mt-3 text-[56px] md:text-[80px]">
          {r.length} appels{count("rdv") ? <span className="text-blue">, {count("rdv")} RDV</span> : ""}.
        </h1>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {outcomes.map((o) => (
            <div key={o.id} className="rounded-2xl bg-mist p-4">
              <p className="num text-[32px] font-semibold">{count(o.id)}</p>
              <p className="text-[13px] text-ink-2">{o.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[17px] text-ink-2">
          {count("rdv") ? "Bravo. Confirmez chaque RDV par SMS la veille." : "Pas de RDV cette fois : c'est la moyenne qui compte, pas une session. Les relances sont programmées."}
        </p>
        <div className="mt-8 flex gap-2">
          <Button size="lg" onClick={finish}>
            Terminer
          </Button>
          <ButtonLink href="/telephone" variant="secondary" size="lg">
            Nouvelle session
          </ButtonLink>
        </div>
      </main>
    );
  }

  if (!current) return <div className="grid min-h-dvh place-items-center text-ink-2">Chargement…</div>;
  const v = slotVerdict(current.sector, new Date());
  const history = interactions.filter((i) => i.prospect_id === current.id).slice(0, 3);

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-white" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Barre haute */}
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 md:px-6">
        <Link href="/telephone" className="grid size-9 place-items-center rounded-full bg-mist" aria-label="Quitter le mode Appel">
          <Icon name="close" size={16} />
        </Link>
        <div className="flex items-center gap-4 text-[13px]">
          <span className="num">
            <span className="text-ink-3">Appel </span>
            <span className="font-semibold">
              {s.index + 1}/{s.queue.length}
            </span>
          </span>
          <span className={`num font-semibold ${remaining < 0 ? "text-signal" : ""}`}>
            <Icon name="timer" size={14} className="-mt-0.5 mr-1 inline" />
            {remaining < 0 ? `+${mmss(-remaining)}` : mmss(remaining)}
          </span>
          {s.callStartedAt && <span className="num rounded-full bg-blue px-2.5 py-1 font-semibold text-white">{mmss(Date.now() - s.callStartedAt)}</span>}
        </div>
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-mist">
          <div className="h-full bg-blue transition-all" style={{ width: `${(s.index / s.queue.length) * 100}%` }} />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] md:grid-cols-[300px_1fr_280px] md:grid-rows-1">
        {/* Fiche prospect */}
        <aside className="border-b border-line p-4 md:overflow-y-auto md:border-b-0 md:border-r md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <p className="kicker">
                {sectorLabel(current.sector)} · {current.city}
              </p>
              <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight md:text-[30px]">{current.name}</h1>
              <p className="text-[14px] text-ink-2">{current.owner_name ? `Demander ${current.owner_name}` : "Dirigeant inconnu : demander le/la gérant(e)"}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag tone={v.verdict === "ideal" ? "ok" : v.verdict === "ok" ? "mist" : "signal"}>{VERDICT_LABEL[v.verdict]}</Tag>
                {current.disc && <Tag>{profileById[current.disc].name}</Tag>}
                {current.google_rating !== null && <Tag>Google {String(current.google_rating).replace(".", ",")}</Tag>}
              </div>
              <a
                href={`tel:${current.phone?.replace(/\s/g, "")}`}
                onClick={() => s.startCall()}
                className="mt-4 flex h-14 items-center justify-center gap-2 rounded-full bg-ok text-[17px] font-semibold text-white active:scale-[0.97]"
              >
                <Icon name="phone" size={20} /> {current.phone}
              </a>
              {!s.callStartedAt && (
                <button onClick={() => s.startCall()} className="mt-2 w-full text-center text-[13px] text-ink-3">
                  Lancer le chrono sans composer
                </button>
              )}
              <div className="mt-5 hidden space-y-3 text-[14px] md:block">
                {current.field_notes && <p className="leading-relaxed text-ink-2">{current.field_notes}</p>}
                {history.map((h) => (
                  <p key={h.id} className="text-ink-3">
                    {frDate(h.created_at, { day: "numeric", month: "short" })} · {h.outcome?.replace(/_/g, " ") ?? h.channel}
                    {h.objection ? ` · ${h.objection}` : ""}
                  </p>
                ))}
                {current.disc && (
                  <p className="rounded-xl bg-mist p-3 text-[13px] leading-relaxed">
                    <span className="font-semibold">{profileById[current.disc].name} : </span>
                    {profileById[current.disc].wants[0]}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </aside>

        {/* Téléprompteur */}
        <section className="min-h-0 p-4 md:p-6">
          <Teleprompter key={current.id} sections={sections} compact />
        </section>

        {/* Issues + notes */}
        <aside className="hidden flex-col gap-4 border-l border-line p-6 md:flex">
          <OutcomeGrid onPick={outcome} />
          <Notes value={s.notes[current.id] ?? ""} onChange={(t) => s.setNote(current.id, t)} dict={dict} />
          <button onClick={() => s.next()} className="mt-auto text-[13px] text-ink-3 hover:text-ink">
            Passer sans noter →
          </button>
        </aside>
      </div>

      {/* Mobile : issues en bas */}
      <div className="border-t border-line bg-white p-3 md:hidden" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <OutcomeGrid onPick={outcome} />
        <div className="mt-2 flex items-center justify-between">
          <button onClick={() => setNotesOpen(true)} className="text-[14px] font-medium text-blue">
            Notes{s.notes[current.id] ? " •" : ""}
          </button>
          <button onClick={() => s.next()} className="text-[13px] text-ink-3">
            Passer →
          </button>
        </div>
      </div>

      <Sheet open={notesOpen} onClose={() => setNotesOpen(false)} title="Notes d'appel">
        <div className="pb-4">
          <Notes value={s.notes[current.id] ?? ""} onChange={(t) => s.setNote(current.id, t)} dict={dict} />
        </div>
      </Sheet>

      <Sheet open={!!sheet} onClose={() => (setSheet(null), s.next())} title={sheet?.kind === "rdv" ? "Le RDV" : sheet?.kind === "rappel" ? "Quand rappeler ?" : "SMS de suivi"}>
        {sheet?.kind === "sms" ? (
          <div className="space-y-4 pb-4">
            <p className="rounded-2xl bg-mist p-4 text-[16px] leading-relaxed">{sheet.sms}</p>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`sms:${sheet.prospect.phone?.replace(/\s/g, "")}?&body=${encodeURIComponent(sheet.sms ?? "")}`} external={false}>
                Envoyer le SMS
              </ButtonLink>
              <Button
                variant="secondary"
                onClick={async () => {
                  await navigator.clipboard?.writeText(sheet.sms ?? "");
                  toast("SMS copié");
                }}
              >
                Copier
              </Button>
              <Button variant="quiet" onClick={() => (setSheet(null), s.next())}>
                Suivant
              </Button>
            </div>
          </div>
        ) : (
          sheet && (
            <div className="space-y-4 pb-4">
              {sheet.kind === "rdv" && slots.length > 0 && (
                <div>
                  <p className="text-[14px] text-ink-2">Proposez toujours deux créneaux précis :</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {slots.map((d) => (
                      <button
                        key={d.toISOString()}
                        onClick={() => {
                          setDate(d.toISOString().slice(0, 10));
                          setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
                        }}
                        className="rounded-full bg-blue-soft px-4 py-2 text-[15px] font-medium text-blue"
                      >
                        {frDate(d.toISOString(), { weekday: "long", day: "numeric" })} {hhmmFr(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field label="Heure">
                  <input type="time" className="field" value={time} onChange={(e) => setTime(e.target.value)} />
                </Field>
              </div>
              <Button size="lg" className="w-full" onClick={confirmSheet}>
                {sheet.kind === "rdv" ? "Confirmer le RDV" : "Planifier le rappel"}
              </Button>
            </div>
          )
        )}
      </Sheet>
    </main>
  );
}

function OutcomeGrid({ onPick }: { onPick: (o: CallOutcome) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-2">
      {outcomes.map((o) => (
        <motion.button
          key={o.id}
          whileTap={{ scale: 0.94 }}
          onClick={() => onPick(o.id)}
          title={o.hint}
          className={`h-14 rounded-2xl px-2 text-[14px] font-semibold leading-tight ${OUTCOME_STYLE[o.id]} ${o.id === "rdv" ? "shadow-[0_8px_20px_rgba(0,113,227,0.3)]" : ""}`}
        >
          {o.id === "rdv" ? "RDV ✓" : o.label}
        </motion.button>
      ))}
    </div>
  );
}

function Notes({ value, onChange, dict }: { value: string; onChange: (t: string) => void; dict: { supported: boolean; listening: boolean; toggle: () => void } }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="kicker">Notes</p>
        {dict.supported && (
          <button onClick={dict.toggle} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${dict.listening ? "bg-signal text-white" : "bg-mist"}`}>
            <Icon name="mic" size={15} /> {dict.listening ? "J'écoute…" : "Dicter"}
          </button>
        )}
      </div>
      <textarea className="field mt-2 min-h-32 text-[15px]" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Ce qu'il a dit, le nom du décideur, le bon moment…" />
    </div>
  );
}
