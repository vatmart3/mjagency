"use client";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Field, PageHeader, SectionTitle, Segmented } from "@/components/ui/primitives";
import { useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { useSettings } from "@/lib/settings";
import { averageBasket, computeStats, inversePlan, monthStart, sectorRanking, streak, type PersonStats } from "@/lib/stats";
import { addDays, eur, num, pct, todayISO } from "@/lib/format";
import { sectorLabel } from "@/content/sectors";

type Period = "mois" | "30j" | "tout";

export default function Dashboard() {
  const { rows: interactions } = useTable("interactions");
  const { rows: prospects } = useTable("prospects");
  const { settings } = useSettings();
  const { me, profiles } = useSession();
  const [who, setWho] = useState<string>(me?.id ?? "");
  const [period, setPeriod] = useState<Period>("mois");
  const [goal, setGoal] = useState<number | null>(null);
  const [basketOverride, setBasketOverride] = useState<number | null>(null);

  const since = period === "mois" ? monthStart() : period === "30j" ? addDays(todayISO(), -30) : undefined;
  const people = [...profiles].sort((a, b) => a.display_name.localeCompare(b.display_name));

  const plan = useMemo(() => {
    const uid = who === "global" ? null : who;
    const st = computeStats(interactions, prospects, { userId: uid });
    const b = averageBasket(prospects, settings, uid);
    const basket = basketOverride ? { value: basketOverride, fromData: false } : b;
    const g = goal ?? settings.goalPerPerson * (who === "global" ? Math.max(1, people.length) : 1);
    return { st, basket, p: inversePlan(st, basket, settings, g) };
  }, [interactions, prospects, settings, who, goal, basketOverride, people.length]);

  const kpi = (uid: string | null) => computeStats(interactions, prospects, { userId: uid, since });
  const cols: { id: string | null; label: string; s: PersonStats }[] = [...people.map((p) => ({ id: p.id, label: p.display_name, s: kpi(p.id) })), { id: null, label: "Global", s: kpi(null) }];
  const ranking = sectorRanking(
    interactions.filter((i) => !since || i.created_at.slice(0, 10) >= since),
    prospects,
  );
  const monthRevenue = computeStats(interactions, prospects, { userId: who === "global" ? null : who, since: monthStart() }).revenue;

  const rows: { label: string; get: (s: PersonStats) => string }[] = [
    { label: "Appels passés", get: (s) => num(s.calls) },
    { label: "Visites terrain", get: (s) => num(s.visits) },
    { label: "Taux de décroché", get: (s) => pct(s.pickupRate) },
    { label: "RDV obtenus", get: (s) => num(s.rdv) },
    { label: "Taux de RDV", get: (s) => pct(s.rdvRate) },
    { label: "Signatures", get: (s) => num(s.signed) },
    { label: "Taux de signature", get: (s) => pct(s.closeRate) },
    { label: "CA signé", get: (s) => eur(s.revenue) },
  ];

  const { p, basket } = plan;
  return (
    <div>
      <PageHeader
        kicker="Tableau de bord"
        title={
          <>
            {eur(settings.goalPerPerson)} par mois, <span className="text-ink-3">chacun.</span>
          </>
        }
        lede={`Ce mois-ci : ${eur(monthRevenue)} signés${who === "global" ? " à deux" : ""}. Le calcul ci-dessous part de l'objectif et redescend jusqu'au nombre d'appels, avec vos vrais taux dès qu'il y a assez d'historique.`}
        actions={
          <Segmented
            value={who || me?.id || "global"}
            onChange={setWho}
            options={[...people.map((x) => ({ value: x.id, label: x.display_name })), { value: "global", label: "À deux" }]}
          />
        }
      />

      {/* Calculateur inverse, en cascade typographique */}
      <section>
        <SectionTitle kicker="Calculateur inverse" title="Ce qu'il faut faire, chaque semaine" />
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <ol className="space-y-1">
            {[
              { n: eur(p.goal), t: "d'objectif mensuel" },
              { n: `÷ ${eur(basket.value)}`, t: basket.fromData ? "de panier moyen (vos signatures)" : "de panier moyen (valeur par défaut)" },
              { n: `= ${p.sales} vente${p.sales > 1 ? "s" : ""}`, t: "à signer dans le mois" },
              { n: `÷ ${pct(p.rates.close)}`, t: p.rates.closeFromData ? "de signature après RDV (réel)" : "de signature après RDV (estimé)" },
              { n: `= ${p.rdv} RDV`, t: "à décrocher dans le mois" },
            ].map((l, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex flex-wrap items-baseline gap-x-4 border-b border-line py-3">
                <span className="display num text-[34px] md:text-[48px]">{l.n}</span>
                <span className="text-[15px] text-ink-2">{l.t}</span>
              </motion.li>
            ))}
            <motion.li initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-6">
              <p className="display text-[44px] leading-[1.02] md:text-[72px]">
                <span className="text-blue">{p.callsPerWeek} appels</span> et <span className="text-blue">{p.visitsPerWeek} visites</span> par semaine.
              </p>
              <p className="mt-3 text-[17px] text-ink-2">
                Soit environ {p.perDay} contacts par jour sur {settings.workingDaysPerWeek} jours. Taux appel → RDV : {pct(p.rates.callRdv)}, visite → RDV : {pct(p.rates.visitRdv)}
                {p.rates.rdvFromData ? " (vos chiffres réels)." : " (estimations, affinées dès 20 appels ou 8 visites)."}
              </p>
            </motion.li>
          </ol>
          <aside className="space-y-4 rounded-[22px] bg-mist p-5">
            <p className="kicker">Et si…</p>
            <Field label="Objectif mensuel (€)">
              <input className="field bg-white" inputMode="numeric" placeholder={String(settings.goalPerPerson)} value={goal ?? ""} onChange={(e) => setGoal(e.target.value ? Number(e.target.value) : null)} />
            </Field>
            <Field label="Panier moyen (€)">
              <input className="field bg-white" inputMode="numeric" placeholder={String(Math.round(averageBasket(prospects, settings).value))} value={basketOverride ?? ""} onChange={(e) => setBasketOverride(e.target.value ? Number(e.target.value) : null)} />
            </Field>
            <p className="text-[13px] leading-relaxed text-ink-2">Monter le panier moyen (abonnements, offres groupées) fait fondre le nombre d&apos;appels plus vite que n&apos;importe quel effort de volume.</p>
          </aside>
        </div>
      </section>

      {/* KPIs */}
      <section className="mt-20">
        <SectionTitle kicker="Indicateurs" title="Les chiffres, sans maquillage">
          <Segmented
            size="sm"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "mois", label: "Ce mois" },
              { value: "30j", label: "30 jours" },
              { value: "tout", label: "Tout" },
            ]}
          />
        </SectionTitle>
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[420px] text-left">
            <thead>
              <tr className="border-b border-ink">
                <th className="py-3 text-[13px] font-medium text-ink-2" />
                {cols.map((c) => (
                  <th key={c.label} className={`py-3 text-right text-[15px] font-semibold ${c.id === null ? "text-blue" : ""}`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-line">
                  <td className="py-3.5 text-[15px] text-ink-2">{r.label}</td>
                  {cols.map((c) => (
                    <td key={c.label} className={`num py-3.5 text-right text-[19px] font-semibold ${c.id === null ? "text-blue" : ""}`}>
                      {r.get(c.s)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-3.5 text-[15px] text-ink-2">Série en cours</td>
                {cols.map((c) => (
                  <td key={c.label} className="num py-3.5 text-right text-[19px] font-semibold">
                    {c.id ? `${streak(interactions, c.id).days} j` : ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Secteurs */}
      <section className="mt-20">
        <SectionTitle kicker="Où ça convertit" title="Classement des secteurs" />
        {ranking.length === 0 ? (
          <p className="text-ink-2">Pas encore assez d&apos;activité sur la période.</p>
        ) : (
          <ol className="border-t border-line">
            {ranking.map((r, i) => (
              <motion.li key={r.sector} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="grid grid-cols-[36px_1fr_auto] items-baseline gap-3 border-b border-line py-4 md:grid-cols-[48px_1fr_110px_110px_130px]">
                <span className="num text-[15px] font-semibold text-ink-3">{i + 1}</span>
                <span className="text-[20px] font-semibold tracking-tight">{sectorLabel(r.sector)}</span>
                <span className="num text-right text-[15px] text-ink-2 md:text-left">
                  <span className="md:hidden">{pct(r.rate)} · </span>
                  {r.contacts} contacts
                </span>
                <span className="num hidden text-[15px] md:block">{pct(r.rate)} de RDV</span>
                <span className="num hidden text-right text-[15px] font-semibold md:block">{r.signed ? `${r.signed} · ${eur(r.revenue)}` : "—"}</span>
              </motion.li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
