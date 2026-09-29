"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/primitives";
import { celebrate, toast, toastError } from "@/components/ui/Toast";
import { db, useTable } from "@/lib/data/hooks";
import { buildResearchPrompt } from "@/lib/prompt";
import { parseReport } from "@/lib/report";
import { useSettings } from "@/lib/settings";
import { useSession } from "@/lib/session";
import { aiCall, startAnalysis, useAiStatus } from "@/lib/ai";
import { assembleAndSave, useProspectScripts } from "@/components/clients/Analysis";
import { frDate, frTime } from "@/lib/format";
import type { Prospect } from "@/lib/types";

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function PromptPanel({ prospect, onReport }: { prospect: Prospect; onReport: () => void }) {
  const { rows: allPrompts, loading } = useTable("research_prompts");
  const { rows: allInteractions } = useTable("interactions");
  const { settings, loading: settingsLoading } = useSettings();
  const { me } = useSession();
  const ai = useAiStatus();
  const prospectScripts = useProspectScripts(prospect.id);
  const prompts = useMemo(() => allPrompts.filter((p) => p.prospect_id === prospect.id).sort((a, b) => b.version - a.version), [allPrompts, prospect.id]);
  const interactions = useMemo(() => allInteractions.filter((i) => i.prospect_id === prospect.id), [allInteractions, prospect.id]);
  const [versionId, setVersionId] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);
  const [report, setReport] = useState("");
  const [running, setRunning] = useState(false);
  const creating = useRef(false);

  const fresh = useMemo(
    () => buildResearchPrompt({ prospect, interactions, settings, authorName: me?.display_name }),
    [prospect, interactions, settings, me?.display_name],
  );
  const current = prompts.find((p) => p.id === versionId) ?? prompts[0];
  const outdated = current && current.prompt !== fresh;

  // Premier prompt généré automatiquement dès l'ouverture du dossier
  useEffect(() => {
    if (loading || settingsLoading || prompts.length || creating.current) return;
    creating.current = true;
    setPrinting(true);
    // Si l'associé a ouvert le dossier au même moment, sa v1 existe déjà : on garde la sienne.
    void db
      .insert("research_prompts", { prospect_id: prospect.id, version: 1, prompt: fresh })
      .catch(() => undefined)
      .finally(() => setTimeout(() => setPrinting(false), 1600));
  }, [loading, settingsLoading, prompts.length, prospect.id, fresh]);

  async function regenerate() {
    setPrinting(true);
    const r = await db.insert("research_prompts", { prospect_id: prospect.id, version: (prompts[0]?.version ?? 0) + 1, prompt: fresh });
    setVersionId(r.id);
    setTimeout(() => setPrinting(false), 1600);
  }

  async function doCopy() {
    if (current && (await copy(current.prompt))) toast("Prompt copié", "Collez-le dans Claude ou ChatGPT.");
  }

  // Vrai lien <a> (window.open est bloqué dans certains cadres) : on copie au clic, le lien s'ouvre ensuite.
  function copyBeforeOpen() {
    if (!current) return;
    void copy(current.prompt).then((ok) => ok && toast("Prompt copié", "Il ne reste qu'à coller (⌘V / appui long)."));
  }

  async function saveReport(raw: string, source: "manuel" | "api") {
    const parsed = parseReport(raw);
    if (parsed.found.length < 3) {
      toastError("Rapport non reconnu", "Les titres fixes du prompt sont introuvables. Vérifiez le copier-coller.");
      return;
    }
    await db.insert("research_reports", { prospect_id: prospect.id, prompt_id: current?.id ?? null, raw, parsed, source });
    await db.update("prospects", prospect.id, { intel: parsed, hook: parsed.accroche ?? prospect.hook });
    // Script sur mesure assemblé à partir du rapport (on ne remplace pas un script déjà écrit)
    const fresh = !prospectScripts.all.length;
    if (fresh) await assembleAndSave({ ...prospect, intel: parsed }, []);
    setReport("");
    celebrate("Dossier enrichi", `${parsed.found.length} sections rangées${fresh ? ", script sur mesure prêt" : ""}.`);
    onReport();
  }

  async function runHere() {
    if (!current) return;
    setRunning(true);
    try {
      // Avec Supabase : analyse complète en arrière-plan (rapport + script sur mesure)
      if (ai.analyse) {
        await startAnalysis(prospect.id);
        toast("Analyse lancée", "Rapport et script sur mesure arrivent dans 2 à 4 minutes.");
        return;
      }
      const { text } = await aiCall<{ text: string }>({ mode: "research", prompt: current.prompt });
      await saveReport(text, "api");
    } catch (e) {
      toastError("Recherche impossible", (e as Error).message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="kicker">Prompt de recherche approfondie</p>
            <p className="mt-1 text-[15px] text-ink-2">
              Assemblé à partir de la fiche, du secteur, de l&apos;historique et de votre grille de prix. Unique à ce commerce.
            </p>
          </div>
          {prompts.length > 0 && (
            <select className="field w-auto py-2 text-[14px]" value={current?.id} onChange={(e) => setVersionId(e.target.value)} aria-label="Version du prompt">
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>
                  v{p.version} · {frDate(p.created_at, { day: "numeric", month: "short" })} {frTime(p.created_at)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* L'imprimante */}
        <div className="relative mt-5">
          <div className="relative z-10 h-4 rounded-full bg-ink shadow-[0_6px_14px_rgba(0,0,0,0.25)]" />
          <div className="-mt-2 overflow-hidden px-3">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: printing ? 1.5 : 0.6, ease: printing ? [0.3, 0, 0.2, 1] : [0.22, 1, 0.36, 1] }}
                  className="relative rounded-b-[16px] bg-white px-5 pb-6 pt-7 shadow-[var(--shadow-soft)] ring-1 ring-line"
                >
                  <div className="mb-4 flex items-center justify-between font-mono text-[11px] text-ink-3">
                    <span>MJAGENCY · RECHERCHE · v{current.version}</span>
                    <span>{frDate(current.created_at, { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                  </div>
                  <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-ink">{current.prompt}</pre>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-[16px] bg-gradient-to-t from-white" />
                </motion.div>
              )}
            </AnimatePresence>
            {!current && <div className="h-48 animate-pulse rounded-b-[16px] bg-mist" />}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={doCopy} disabled={!current}>
            <Icon name="copy" size={18} /> Copier le prompt
          </Button>
          <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer" onClick={copyBeforeOpen} className={buttonClass("secondary", "md", "active:scale-[0.96] transition-transform")}>
            Ouvrir Claude <Icon name="external" size={16} />
          </a>
          <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" onClick={copyBeforeOpen} className={buttonClass("secondary", "md", "active:scale-[0.96] transition-transform")}>
            Ouvrir ChatGPT <Icon name="external" size={16} />
          </a>
          {ai.enabled && (
            <Button variant="ink" onClick={runHere} disabled={!current || running || prospect.analysis_status === "en_cours"}>
              <Icon name="sparkle" size={18} />{" "}
              {prospect.analysis_status === "en_cours" ? "Analyse en cours…" : running ? "Recherche en cours (1 à 3 min)…" : ai.analyse ? "Analyse approfondie + script" : "Lancer la recherche ici"}
            </Button>
          )}
        </div>
        {outdated && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-blue-soft px-4 py-3 text-[14px]">
            <span className="text-blue">La fiche a changé depuis cette version.</span>
            <Button size="sm" onClick={regenerate}>
              Regénérer (v{(prompts[0]?.version ?? 0) + 1})
            </Button>
          </div>
        )}
      </div>

      <div>
        <p className="kicker">Retour de la recherche</p>
        <p className="mt-1 text-[15px] text-ink-2">Collez ici la réponse complète. Les sections sont reconnues par leurs titres et rangées dans l&apos;onglet Intel.</p>
        <textarea
          className="field mt-4 min-h-44 font-mono text-[13px]"
          placeholder={"## 1. SYNTHÈSE\n…\n## 11. ACCROCHE D'OUVERTURE\n…"}
          value={report}
          onChange={(e) => setReport(e.target.value)}
        />
        <div className="mt-3 flex items-center gap-3">
          <Button onClick={() => saveReport(report, "manuel")} disabled={report.trim().length < 80}>
            Ranger dans la fiche
          </Button>
          {report.trim().length >= 80 && <Tag tone="blue">{parseReport(report).found.length} / 15 sections détectées</Tag>}
        </div>
      </div>
    </div>
  );
}
