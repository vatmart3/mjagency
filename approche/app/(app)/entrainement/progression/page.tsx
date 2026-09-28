"use client";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Chip, Empty, PageHeader, SectionTitle } from "@/components/ui/primitives";
import { evalCriteria } from "@/content/training";
import { sectorLabel } from "@/content/sectors";
import type { EvalCriterion } from "@/content/types";
import { useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { frDate } from "@/lib/format";
import type { TrainingSession } from "@/lib/types";

/** Couleurs de série validées (contraste, daltonisme) : associé 1 = bleu, associé 2 = orange brûlé. */
const SERIES = ["#0071E3", "#C2410C"];
const MODE_LABEL = { duo: "Duo", flash: "Flashcards", defi: "Défi 30 s", ia: "Prospect IA" } as const;

function score(s: TrainingSession, k: EvalCriterion | "moyenne") {
  const sc = s.scores ?? {};
  if (k !== "moyenne") return typeof sc[k] === "number" ? (sc[k] as number) : null;
  const v = evalCriteria.map((c) => sc[c.id]).filter((x): x is number => typeof x === "number");
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

export default function Progression() {
  const { rows } = useTable("training_sessions");
  const { profiles, me } = useSession();
  const [k, setK] = useState<EvalCriterion | "moyenne">("moyenne");
  const people = [...profiles].sort((a, b) => a.display_name.localeCompare(b.display_name)).slice(0, 2);
  const done = rows.filter((r) => r.state === "done" && r.scores && ["duo", "ia"].includes(r.mode)).sort((a, b) => a.created_at.localeCompare(b.created_at));
  const all = rows.filter((r) => r.state === "done").sort((a, b) => b.created_at.localeCompare(a.created_at));

  const avgBy = (uid: string) =>
    evalCriteria.map((c) => {
      const v = done.filter((d) => d.seller_id === uid).map((d) => d.scores?.[c.id]).filter((x): x is number => typeof x === "number");
      return { c, v: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null };
    });
  const myAvg = me ? avgBy(me.id) : [];
  const weak = myAvg.filter((x) => x.v !== null).sort((a, b) => (a.v ?? 5) - (b.v ?? 5)).slice(0, 2);

  return (
    <div>
      <PageHeader
        kicker="Salle d'entraînement"
        title="Progression."
        lede={
          weak.length ? (
            <>
              Tu perds des points sur <span className="font-semibold text-ink">{weak[0].c.label.toLowerCase()}</span>
              {weak[1] && (
                <>
                  {" "}
                  et <span className="font-semibold text-ink">{weak[1].c.label.toLowerCase()}</span>
                </>
              )}
              . {weak[0].c.lookFor[0] ? `À travailler : ${weak[0].c.lookFor[0].toLowerCase()}.` : ""}
            </>
          ) : (
            "Faites un premier Duo pour voir apparaître vos courbes."
          )
        }
      />
      {done.length === 0 ? (
        <Empty title="Pas encore de session notée." />
      ) : (
        <>
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            <Chip active={k === "moyenne"} onClick={() => setK("moyenne")}>
              Moyenne
            </Chip>
            {evalCriteria.map((c) => (
              <Chip key={c.id} active={k === c.id} onClick={() => setK(c.id)}>
                {c.label}
              </Chip>
            ))}
          </div>
          <LineChart sessions={done} people={people} k={k} />
          <section className="mt-16">
            <SectionTitle kicker="Comparaison amicale" title="Moyenne par compétence" />
            <Legend people={people} />
            <div className="mt-5 space-y-5">
              {evalCriteria.map((c) => (
                <div key={c.id} className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                  <span className="text-[15px] font-medium">{c.label}</span>
                  <div className="space-y-[2px]">
                    {people.map((p, i) => {
                      const v = avgBy(p.id).find((x) => x.c.id === c.id)?.v ?? null;
                      return (
                        <div key={p.id} className="flex items-center gap-3" title={`${p.display_name} : ${v?.toFixed(1) ?? "—"}/5`}>
                          <div className="h-3 flex-1 overflow-hidden rounded-r-[4px] bg-mist">
                            <motion.div className="h-full rounded-r-[4px]" style={{ background: SERIES[i] }} initial={{ width: 0 }} animate={{ width: `${((v ?? 0) / 5) * 100}%` }} transition={{ duration: 0.8 }} />
                          </div>
                          <span className="num w-10 text-right text-[13px] text-ink-2">{v !== null ? v.toFixed(1).replace(".", ",") : "—"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="mt-16">
        <SectionTitle kicker="Historique" title="Toutes les sessions" />
        <ul className="border-t border-line">
          {all.slice(0, 40).map((s) => {
            const avg = score(s, "moyenne");
            const who = profiles.find((p) => p.id === s.seller_id)?.display_name ?? "—";
            return (
              <li key={s.id} className="grid grid-cols-[1fr_auto] gap-2 border-b border-line py-3 md:grid-cols-[120px_140px_1fr_auto]">
                <span className="text-[14px] text-ink-2">{frDate(s.created_at)}</span>
                <span className="text-[14px] font-medium">
                  {MODE_LABEL[s.mode]} · {who}
                </span>
                <span className="hidden truncate text-[14px] text-ink-2 md:block">
                  {sectorLabel(s.sector)}
                  {s.comment && ` — ${s.comment}`}
                </span>
                <span className="num text-right font-semibold">{avg !== null ? `${avg.toFixed(1).replace(".", ",")}/5` : ""}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Legend({ people }: { people: { id: string; display_name: string }[] }) {
  return (
    <div className="flex gap-4 text-[13px] text-ink-2">
      {people.map((p, i) => (
        <span key={p.id} className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ background: SERIES[i] }} />
          {p.display_name}
        </span>
      ))}
    </div>
  );
}

function LineChart({ sessions, people, k }: { sessions: TrainingSession[]; people: { id: string; display_name: string }[]; k: EvalCriterion | "moyenne" }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 800;
  const H = 260;
  const pad = { l: 28, r: 70, t: 16, b: 28 };
  const xs = sessions.map((s) => new Date(s.created_at).getTime());
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs, x0 + 86400000);
  const X = (t: number) => pad.l + ((t - x0) / (x1 - x0)) * (W - pad.l - pad.r);
  const Y = (v: number) => pad.t + (1 - (v - 1) / 4) * (H - pad.t - pad.b);

  const series = people.map((p, i) => ({
    p,
    color: SERIES[i],
    pts: sessions
      .filter((s) => s.seller_id === p.id)
      .map((s) => ({ t: new Date(s.created_at).getTime(), v: score(s, k), s }))
      .filter((d): d is { t: number; v: number; s: TrainingSession } => d.v !== null),
  }));
  const hoverT = hover !== null ? xs[hover] : null;

  return (
    <div className="relative mt-4">
      <Legend people={people} />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full touch-none"
        role="img"
        aria-label="Évolution des notes par session"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W;
          let best = 0;
          xs.forEach((t, i) => Math.abs(X(t) - x) < Math.abs(X(xs[best]) - x) && (best = i));
          setHover(best);
        }}
        onPointerLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={Y(v)} y2={Y(v)} stroke="rgba(0,0,0,0.06)" />
            <text x={pad.l - 10} y={Y(v) + 4} fontSize="11" textAnchor="end" fill="#6e6e73">
              {v}
            </text>
          </g>
        ))}
        {hoverT !== null && <line x1={X(hoverT)} x2={X(hoverT)} y1={pad.t} y2={H - pad.b} stroke="#a1a1a6" strokeWidth="1" />}
        {series.map(({ p, color, pts }) =>
          pts.length ? (
            <g key={p.id}>
              <motion.path
                d={pts.map((d, i) => `${i ? "L" : "M"}${X(d.t)},${Y(d.v)}`).join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
              {pts.map((d) => (
                <circle key={d.s.id} cx={X(d.t)} cy={Y(d.v)} r={hoverT === d.t ? 5 : 4} fill={color} stroke="#fff" strokeWidth="2" />
              ))}
              <text x={X(pts[pts.length - 1].t) + 10} y={Y(pts[pts.length - 1].v) + 4} fontSize="12" fill="#1d1d1f" fontWeight="600">
                {p.display_name}
              </text>
            </g>
          ) : null,
        )}
        <text x={pad.l} y={H - 6} fontSize="11" fill="#6e6e73">
          {frDate(new Date(x0).toISOString(), { day: "numeric", month: "short" })}
        </text>
        <text x={W - pad.r} y={H - 6} fontSize="11" fill="#6e6e73" textAnchor="end">
          {frDate(new Date(x1).toISOString(), { day: "numeric", month: "short" })}
        </text>
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-[13px] shadow-[var(--shadow-soft)] ring-1 ring-line">
          <p className="text-ink-2">{frDate(sessions[hover].created_at)}</p>
          {series.map(({ p, color, pts }) => {
            const d = pts.find((x) => x.t === xs[hover]);
            return d ? (
              <p key={p.id} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: color }} />
                <span className="num font-semibold">{d.v.toFixed(1).replace(".", ",")}</span>
                <span className="text-ink-2">{p.display_name}</span>
              </p>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
