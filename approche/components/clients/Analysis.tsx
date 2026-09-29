"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Empty, Segmented, Sheet, Tag } from "@/components/ui/primitives";
import { celebrate, toast, toastError } from "@/components/ui/Toast";
import { ScriptEditor } from "@/components/ScriptEditor";
import type { Channel, ScriptStep } from "@/content/types";
import { db, useTable } from "@/lib/data/hooks";
import { assembleScript } from "@/lib/customScript";
import { startAnalysis, useAiStatus } from "@/lib/ai";
import { useFill } from "@/lib/useFill";
import { frDate, frTime } from "@/lib/format";
import type { CustomScript, Prospect } from "@/lib/types";

const STEPS = ["Préparation du prompt", "Recherche sur le web", "Rédaction du script sur mesure"];

/** Scripts uniques d'un client, par canal. */
export function useProspectScripts(prospectId: string) {
  const { rows } = useTable("custom_scripts");
  return useMemo(() => {
    const mine = rows.filter((c) => c.prospect_id === prospectId).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    return { physique: mine.find((c) => c.channel === "physique") ?? null, telephone: mine.find((c) => c.channel === "telephone") ?? null, all: mine };
  }, [rows, prospectId]);
}

/** Crée (ou remplace) les deux scripts sur mesure assemblés à partir du rapport, sans IA. */
export async function assembleAndSave(p: Prospect, existing: CustomScript[]) {
  if (!p.intel) return;
  for (const c of existing) await db.remove("custom_scripts", c.id);
  for (const channel of ["physique", "telephone"] as Channel[]) {
    const { title, steps } = assembleScript(p, p.intel, channel);
    await db.insert("custom_scripts", { sector: p.sector, channel, base_key: null, prospect_id: p.id, title, steps });
  }
}

/**
 * Bandeau d'analyse : se lance tout seul pour un nouveau client (si l'API est branchée),
 * suit l'avancement en temps réel et annonce quand le script est prêt.
 */
export function AnalysisBanner({ prospect, autoStart, onDone }: { prospect: Prospect; autoStart: boolean; onDone: () => void }) {
  const ai = useAiStatus();
  const started = useRef(false);
  const prev = useRef(prospect.analysis_status);
  const [busy, setBusy] = useState(false);

  async function launch() {
    setBusy(true);
    try {
      await startAnalysis(prospect.id);
    } catch (e) {
      toastError("Analyse impossible", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (autoStart && ai.analyse && !started.current && !prospect.analysis_status && !prospect.intel) {
      started.current = true;
      void launch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, ai.analyse, prospect.analysis_status, prospect.intel]);

  useEffect(() => {
    if (prev.current === "en_cours" && prospect.analysis_status === "fait") {
      celebrate("Analyse terminée", "Rapport rangé et script sur mesure prêt.");
      onDone();
    }
    prev.current = prospect.analysis_status;
  }, [prospect.analysis_status, onDone]);

  const status = prospect.analysis_status;
  if (!ai.analyse && status !== "en_cours") return null;

  const current = Math.max(0, STEPS.indexOf(prospect.analysis_step ?? ""));
  return (
    <AnimatePresence mode="wait">
      {status === "en_cours" ? (
        <motion.div key="run" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 overflow-hidden rounded-2xl bg-ink p-5 text-white">
          <div className="flex items-center gap-3">
            <motion.span className="size-5 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} />
            <p className="text-[17px] font-semibold">Analyse approfondie en cours</p>
          </div>
          <ol className="mt-4 space-y-2">
            {STEPS.map((s, i) => (
              <li key={s} className={`flex items-center gap-2 text-[15px] ${i < current ? "text-white/60 line-through" : i === current ? "text-white" : "text-white/40"}`}>
                <span className={`size-1.5 rounded-full ${i <= current ? "bg-white" : "bg-white/30"}`} />
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[13px] text-white/60">Compter 2 à 4 minutes. Vous pouvez quitter la page : le script sera rangé dans la fiche.</p>
        </motion.div>
      ) : status === "erreur" ? (
        <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-signal/10 p-4">
          <p className="text-[15px] text-signal">L&apos;analyse a échoué : {prospect.analysis_error ?? "erreur inconnue"}</p>
          <Button size="sm" variant="danger" onClick={launch} disabled={busy}>
            Relancer
          </Button>
        </motion.div>
      ) : !prospect.intel ? (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-blue-soft p-4">
          <p className="text-[15px]">Laissez Claude analyser ce client sur le web et écrire son script sur mesure.</p>
          <Button size="sm" onClick={launch} disabled={busy}>
            <Icon name="sparkle" size={16} /> Analyse approfondie
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Onglet « Script » : les deux scripts uniques du client. */
export function ProspectScriptsPanel({ prospect, goPrompt }: { prospect: Prospect; goPrompt: () => void }) {
  const scripts = useProspectScripts(prospect.id);
  const ai = useAiStatus();
  const [channel, setChannel] = useState<Channel>("physique");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const f = useFill({ commerce: prospect.name, dirigeant: prospect.owner_name ?? undefined, ville: prospect.city ?? undefined });
  const current = scripts[channel];

  async function relaunch() {
    setBusy(true);
    try {
      await startAnalysis(prospect.id);
      toast("Analyse relancée", "Le nouveau script remplacera l'actuel.");
    } catch (e) {
      toastError("Analyse impossible", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!scripts.all.length)
    return (
      <Empty title="Pas encore de script sur mesure.">
        {ai.analyse ? (
          <>
            <p>Lancez l&apos;analyse approfondie : Claude cherche sur le web puis écrit un script terrain et un script téléphone pour ce client.</p>
            <Button className="mt-4" onClick={relaunch} disabled={busy || prospect.analysis_status === "en_cours"}>
              <Icon name="sparkle" size={16} /> Analyse approfondie
            </Button>
          </>
        ) : prospect.intel ? (
          <>
            <p>Le rapport est rangé : on peut assembler un script unique à partir de ses constats, questions et objections.</p>
            <Button className="mt-4" onClick={async () => (await assembleAndSave(prospect, []), toast("Script sur mesure prêt"))}>
              Assembler le script sur mesure
            </Button>
          </>
        ) : (
          <>
            <p>Faites d&apos;abord la recherche (onglet Prompt), collez le rapport : le script sur mesure sera assemblé automatiquement.</p>
            <Button className="mt-4" onClick={goPrompt}>
              Aller au prompt
            </Button>
          </>
        )}
      </Empty>
    );

  async function save(title: string, steps: ScriptStep[]) {
    if (!current) return;
    await db.update("custom_scripts", current.id, { title, steps });
    setEditing(false);
    toast("Script enregistré");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={channel}
          onChange={setChannel}
          options={[
            { value: "physique", label: "Terrain" },
            { value: "telephone", label: "Téléphone" },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          {current && (
            <ButtonLink href={`/scripts/prompteur?custom=${current.id}&prospect=${prospect.id}`} size="sm">
              <Icon name="play" size={14} /> Téléprompteur
            </ButtonLink>
          )}
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)} disabled={!current}>
            <Icon name="edit" size={14} /> Modifier
          </Button>
          {ai.analyse ? (
            <Button size="sm" variant="quiet" onClick={relaunch} disabled={busy || prospect.analysis_status === "en_cours"}>
              <Icon name="sparkle" size={14} /> Refaire l&apos;analyse
            </Button>
          ) : (
            prospect.intel && (
              <Button size="sm" variant="quiet" onClick={async () => (await assembleAndSave(prospect, scripts.all), toast("Script réassemblé depuis le dernier rapport"))}>
                Réassembler
              </Button>
            )
          )}
        </div>
      </div>
      {current ? (
        <>
          <p className="mt-4 text-[13px] text-ink-3">
            <Tag tone="blue">Unique à {prospect.name}</Tag> <span className="ml-1">mis à jour le {frDate(current.updated_at)} à {frTime(current.updated_at)}</span>
          </p>
          <ol className="mt-6 space-y-8">
            {current.steps.map((st, i) => (
              <li key={st.id + i} className="grid gap-3 md:grid-cols-[200px_1fr]">
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
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="mt-6 text-ink-2">Pas de script pour ce canal.</p>
      )}
      <Sheet open={editing} onClose={() => setEditing(false)} title="Modifier le script sur mesure" wide>
        {current && <ScriptEditor initialTitle={current.title} initialSteps={current.steps} onSave={save} />}
      </Sheet>
    </div>
  );
}
