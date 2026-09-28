"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GoalRing, ThauMap } from "@/components/three/Visuals";
import { useSession } from "@/lib/session";
import { db, useTable } from "@/lib/data/hooks";
import { useSettings } from "@/lib/settings";
import { averageBasket, callsToNextRdv, computeStats, inversePlan, monthStart, streak } from "@/lib/stats";
import { STATUS_COLOR, statusLabel, type Prospect } from "@/lib/types";
import { eur, frDate, hhmmFr, plural, todayISO } from "@/lib/format";
import { positionOf } from "@/lib/timing";
import { sectorLabel } from "@/content/sectors";
import { goldenRules } from "@/content/phone-method";
import { fieldRules } from "@/content/field-method";
import { toast } from "@/components/ui/Toast";

const fade = (i: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } });

export default function BriefPage() {
  const { me, partner } = useSession();
  const router = useRouter();
  const { rows: prospects } = useTable("prospects");
  const { rows: interactions } = useTable("interactions");
  const { rows: tasks } = useTable("tasks");
  const { settings } = useSettings();
  const today = todayISO();

  const data = useMemo(() => {
    const all = computeStats(interactions, prospects, { userId: me?.id });
    const month = computeStats(interactions, prospects, { userId: me?.id, since: monthStart() });
    const basket = averageBasket(prospects, settings, me?.id);
    const plan = inversePlan(all, basket, settings);
    const next = callsToNextRdv(all, settings);
    const st = streak(interactions, me?.id);
    const myTasks = tasks
      .filter((t) => !t.done && t.due_at <= today && (!t.user_id || t.user_id === me?.id))
      .sort((a, b) => (a.preferred_slot ?? "99").localeCompare(b.preferred_slot ?? "99"));
    const callsToday = interactions.filter((i) => i.user_id === me?.id && i.channel === "telephone" && i.created_at.slice(0, 10) === today).length;
    // Tournée du jour : la ville qui a le plus de commerces à visiter
    const toVisit = prospects.filter((p) => p.to_visit && !["signe", "perdu"].includes(p.status));
    const byCity = new Map<string, number>();
    toVisit.forEach((p) => p.city && byCity.set(p.city, (byCity.get(p.city) ?? 0) + 1));
    const tourCity = [...byCity.entries()].sort((a, b) => b[1] - a[1])[0];
    const callsPlanned = Math.max(0, Math.ceil(plan.callsPerWeek / settings.workingDaysPerWeek) - callsToday);
    return { month, plan, next, st, myTasks, tourCity, callsPlanned, callsToday };
  }, [interactions, prospects, tasks, settings, me?.id, today]);

  const progress = data.month.revenue / settings.goalPerPerson;
  const dayIndex = Math.floor(Date.now() / 86400000);
  const tip = dayIndex % 2 ? goldenRules[dayIndex % goldenRules.length] : { title: "Règle terrain", detail: fieldRules[dayIndex % fieldRules.length] };

  const points = prospects.map((p) => {
    const pos = positionOf(p);
    return { id: p.id, lat: pos.lat, lng: pos.lng, color: STATUS_COLOR[p.status], label: p.name, sub: statusLabel(p.status), hot: p.temperature === "brulant" || p.status === "rdv" };
  });

  const byId = new Map(prospects.map((p) => [p.id, p]));
  const headline: string[] = [];
  if (data.callsPlanned) headline.push(plural(data.callsPlanned, "appel"));
  if (data.tourCity) headline.push(`1 tournée ${data.tourCity[0].replace(/-/g, "\u2011")}`);
  if (data.myTasks.length) headline.push(plural(data.myTasks.length, "relance"));
  if (!headline.length) headline.push("journée libre, prenez de l'avance");

  async function done(id: string) {
    await db.update("tasks", id, { done: true, done_at: new Date().toISOString() });
    toast("Relance faite", "Une de moins.");
  }

  return (
    <div>
      {/* Une de magazine */}
      <section className="pt-10 md:pt-16">
        <motion.p {...fade(0)} className="kicker flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{frDate(today, { weekday: "long", day: "numeric", month: "long" })}</span>
          <span className="h-3 w-px bg-fog" />
          <span>Le Brief de {me?.display_name}</span>
        </motion.p>
        <motion.h1 {...fade(1)} className="display mt-4 max-w-5xl text-[46px] sm:text-[64px] md:text-[96px]">
          Aujourd&apos;hui&nbsp;: <span className="text-blue">{headline.join(", ")}</span>.
        </motion.h1>
        <motion.div {...fade(2)} className="mt-8 grid gap-x-10 gap-y-4 border-t border-line pt-6 text-[17px] leading-snug md:grid-cols-3 md:text-[19px]">
          <p>
            <span className="font-semibold">
              {data.st.days > 0 ? `${plural(data.st.days, "jour")} de suite.` : "Nouvelle série à lancer."}
            </span>{" "}
            <span className="text-ink-2">
              {data.st.today ? "La série est sauvée pour aujourd'hui." : "Une seule action aujourd'hui garde la série vivante."}
            </span>
          </p>
          <p>
            <span className="font-semibold">Tu es à {plural(data.next.remaining, "appel")} d&apos;un RDV.</span>{" "}
            <span className="text-ink-2">
              {data.next.fromData ? `Ton rythme réel : un RDV tous les ${data.next.per} appels.` : `Estimation : un RDV tous les ${data.next.per} appels environ.`}
            </span>
          </p>
          <p>
            <span className="font-semibold">{eur(data.month.revenue)} signés ce mois.</span>{" "}
            <span className="text-ink-2">
              {progress >= 1 ? "Objectif atteint. Tout le reste est du bonus." : `Encore ${eur(Math.max(0, settings.goalPerPerson - data.month.revenue))} pour les ${eur(settings.goalPerPerson)}.`}
            </span>
          </p>
        </motion.div>
        <motion.div {...fade(3)} className="mt-8 flex flex-wrap gap-2">
          <ButtonLink href="/telephone" size="lg">
            <Icon name="phone" size={20} /> Lancer les appels
          </ButtonLink>
          <ButtonLink href="/terrain" variant="secondary" size="lg">
            <Icon name="terrain" size={20} /> Préparer la tournée
          </ButtonLink>
          <ButtonLink href="/terrain?debrief=1" variant="secondary" size="lg">
            Débrief 30 s
          </ButtonLink>
          <ButtonLink href="/clients/nouveau" variant="quiet" size="lg">
            <Icon name="plus" size={20} /> Prospect
          </ButtonLink>
        </motion.div>
      </section>

      {/* Carte + objectif */}
      <section className="mt-14 grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <motion.div {...fade(4)} className="relative overflow-hidden rounded-[28px] bg-mist">
          <div className="absolute left-5 top-4 z-10">
            <p className="kicker">Le terrain</p>
            <p className="mt-1 text-[22px] font-semibold tracking-tight">Bassin de Thau</p>
          </div>
          <div className="absolute right-4 top-4 z-10 hidden flex-col gap-1 text-[12px] text-ink-2 sm:flex">
            {(["a_contacter", "interesse", "rdv", "signe"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: STATUS_COLOR[s] }} /> {statusLabel(s)}
              </span>
            ))}
          </div>
          <ThauMap points={points} height={440} onOpen={(id) => router.push(`/clients/${id}`)} />
        </motion.div>
        <motion.div {...fade(5)} className="flex flex-col items-center justify-center rounded-[28px] border border-line p-6 text-center">
          <p className="kicker">Objectif du mois</p>
          <div className="relative my-2">
            <GoalRing progress={progress} size={230} />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div>
                <p className="display num text-[44px]">{Math.round(progress * 100)}%</p>
                <p className="text-[13px] text-ink-2">de {eur(settings.goalPerPerson)}</p>
              </div>
            </div>
          </div>
          <p className="max-w-[260px] text-[15px] text-ink-2">
            Au rythme actuel : <span className="font-semibold text-ink">{data.plan.callsPerWeek} appels</span> et{" "}
            <span className="font-semibold text-ink">{data.plan.visitsPerWeek} visites</span> par semaine.
          </p>
          <Link href="/tableau" className="mt-3 text-[14px] font-medium text-blue">
            Voir le calcul →
          </Link>
        </motion.div>
      </section>

      {/* Relances */}
      <section className="mt-16 grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex items-end justify-between border-b border-line pb-3">
            <h2 className="text-[28px] font-semibold tracking-tight">À faire aujourd&apos;hui</h2>
            <span className="num text-[15px] text-ink-2">{data.myTasks.length}</span>
          </div>
          {data.myTasks.length === 0 ? (
            <p className="py-8 text-[17px] text-ink-2">Aucune relance en retard. Bonne base pour une session d&apos;appels.</p>
          ) : (
            <ul>
              {data.myTasks.map((t, k) => {
                const p = t.prospect_id ? byId.get(t.prospect_id) : undefined;
                return (
                  <motion.li key={t.id} {...fade(k)} className="flex items-center gap-4 border-b border-line py-4">
                    <span className="num w-14 shrink-0 text-[15px] font-semibold text-ink-2">{t.preferred_slot ? hhmmFr(t.preferred_slot) : "—"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-medium leading-snug">{t.title}</p>
                      {p && (
                        <Link href={`/clients/${p.id}`} className="text-[14px] text-ink-2 hover:text-blue">
                          {p.name} · {sectorLabel(p.sector)} · {p.city}
                          {t.due_at < today && <span className="ml-2 text-signal">en retard</span>}
                        </Link>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => done(t.id)}
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-ink-2 hover:bg-blue hover:text-white"
                      aria-label="Marquer comme fait"
                    >
                      <Icon name="check" size={20} />
                    </motion.button>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
        <aside>
          <p className="kicker">Le conseil du jour</p>
          <blockquote className="mt-3 border-l-2 border-blue pl-5">
            <p className="text-[22px] font-semibold leading-snug tracking-tight">{tip.title}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{tip.detail}</p>
          </blockquote>
          <HotList prospects={prospects} />
          {partner && <p className="mt-8 text-[14px] text-ink-3">Tableau partagé avec {partner.display_name}.</p>}
        </aside>
      </section>
    </div>
  );
}

function HotList({ prospects }: { prospects: Prospect[] }) {
  const hot = prospects.filter((p) => ["interesse", "rdv", "proposition"].includes(p.status)).slice(0, 4);
  if (!hot.length) return null;
  return (
    <div className="mt-10">
      <p className="kicker">Les chauds</p>
      <ul className="mt-3 space-y-1">
        {hot.map((p) => (
          <li key={p.id}>
            <Link href={`/clients/${p.id}`} className="flex items-center justify-between rounded-2xl px-3 py-2.5 hover:bg-mist">
              <span className="font-medium">{p.name}</span>
              <span className="text-[13px] text-ink-2">{statusLabel(p.status)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
