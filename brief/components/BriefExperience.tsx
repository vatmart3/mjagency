"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch, type DefaultValues } from "react-hook-form";

import { GridMarks, ProgressRail, TopBar } from "./Chrome";
import CustomCursor from "./CustomCursor";
import SmoothScroll from "./SmoothScroll";
import MockupStage from "./scene/MockupStage";
import Button, { Arrow } from "./ui/Button";

import Welcome from "./steps/Welcome";
import Project from "./steps/Project";
import Goal from "./steps/Goal";
import Features from "./steps/Features";
import Style from "./steps/Style";
import Colors from "./steps/Colors";
import Inspiration from "./steps/Inspiration";
import Assets from "./steps/Assets";
import Budget from "./steps/Budget";
import Contact from "./steps/Contact";
import Done from "./steps/Done";

import { deriveTarget } from "@/lib/mockup";
import { BRIEF_DEFAULTS, briefSchema, type BriefValues } from "@/lib/schema";
import { LAST_STEP, STEPS, timeLeft } from "@/lib/steps";
import { clearProgress, loadProgress, saveProgress } from "@/lib/storage";
import { usePointerTracking } from "@/lib/pointer";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cx } from "@/lib/cx";

type Phase = "form" | "sending" | "done";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BriefExperience() {
  const reduced = useReducedMotion();
  usePointerTracking(!reduced);

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("form");
  const [files, setFiles] = useState<File[]>([]);
  const [failure, setFailure] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [resume, setResume] = useState<{ step: number; values: Partial<BriefValues> } | null>(null);

  const form = useForm<BriefValues>({
    resolver: zodResolver(briefSchema),
    defaultValues: BRIEF_DEFAULTS,
    mode: "onTouched",
    shouldFocusError: false,
  });
  const { control, getValues, trigger, reset } = form;

  const values = useWatch({ control }) as Partial<BriefValues>;
  const target = useMemo(
    () => deriveTarget(values, phase === "form" ? step : STEPS.length, STEPS.length),
    [values, step, phase],
  );

  const columnRef = useRef<HTMLDivElement>(null);
  const autoTimer = useRef<number | null>(null);

  /* ── Reprendre où l'on en était ─────────────────────────────────────── */

  useEffect(() => {
    const found = loadProgress();
    if (found && found.step > 0) setResume({ step: found.step, values: found.values });
  }, []);

  /* ── Sauvegarde discrète, à chaque respiration ──────────────────────── */

  const dirtyRef = useRef(false);
  useEffect(() => {
    if (phase !== "form") return;
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      return;
    }
    const id = window.setTimeout(() => {
      saveProgress(getValues(), step);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1600);
    }, 700);
    return () => window.clearTimeout(id);
  }, [values, step, phase, getValues]);

  /* ── Navigation ─────────────────────────────────────────────────────── */

  const goTo = useCallback(
    (next: number) => {
      setStep(next);
      columnRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  const submit = useCallback(async () => {
    setFailure(null);
    setPhase("sending");
    try {
      const body = new FormData();
      body.append("payload", JSON.stringify(getValues()));
      for (const f of files) body.append("files", f);
      const res = await fetch("/api/brief", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Envoi impossible.");
      clearProgress();
      setPhase("done");
    } catch (err) {
      setPhase("form");
      setFailure(
        err instanceof Error && err.message
          ? err.message
          : "L'envoi a échoué. Réessayez dans un instant.",
      );
    }
  }, [files, getValues]);

  const advance = useCallback(async () => {
    const ok = await trigger(STEPS[step].fields, { shouldFocus: true });
    if (!ok) return;
    if (step === LAST_STEP) {
      await submit();
      return;
    }
    goTo(step + 1);
  }, [goTo, step, submit, trigger]);

  /** Choix unique : on laisse 400 ms au visiteur pour voir son choix se poser. */
  const auto = useCallback(() => {
    if (autoTimer.current) window.clearTimeout(autoTimer.current);
    autoTimer.current = window.setTimeout(async () => {
      const ok = await trigger(STEPS[step].fields, { shouldFocus: false });
      if (ok && step < LAST_STEP) goTo(step + 1);
    }, 400);
  }, [goTo, step, trigger]);

  useEffect(
    () => () => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current);
    },
    [],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    const el = e.target as HTMLElement;
    if (el.tagName === "TEXTAREA" || el.tagName === "BUTTON" || el.tagName === "A") return;
    e.preventDefault();
    void advance();
  };

  /* ── Rendu ──────────────────────────────────────────────────────────── */

  const current = STEPS[step];
  const progress = phase === "done" ? 1 : (step + (phase === "sending" ? 1 : 0)) / STEPS.length;

  const screen = (() => {
    switch (current.id) {
      case "welcome":
        return <Welcome />;
      case "project":
        return <Project auto={auto} />;
      case "goal":
        return <Goal auto={auto} />;
      case "features":
        return <Features />;
      case "style":
        return <Style />;
      case "colors":
        return <Colors files={files} onFiles={setFiles} />;
      case "inspiration":
        return <Inspiration />;
      case "assets":
        return <Assets />;
      case "budget":
        return <Budget auto={auto} />;
      case "contact":
        return <Contact />;
    }
  })();

  const enter = reduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" };
  const from = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 26, clipPath: "inset(0% 0% 100% 0%)" };
  const leave = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: -18, clipPath: "inset(100% 0% 0% 0%)" };

  return (
    <FormProvider {...form}>
      <SmoothScroll enabled={!reduced} />
      <CustomCursor reduced={reduced} />
      <ProgressRail progress={progress} />
      <TopBar
        number={phase === "done" ? "--" : current.number}
        total={String(STEPS.length - 1).padStart(2, "0")}
        kicker={current.kicker}
        timeLeft={timeLeft(step)}
        saved={saved}
        done={phase === "done"}
      />
      <GridMarks />

      <main className="relative flex min-h-[100svh] flex-col lg:h-[100svh] lg:flex-row lg:overflow-hidden">
        {/* La scène — bandeau haut sur mobile, colonne de droite sur grand écran */}
        <aside
          role="img"
          aria-label="Aperçu de votre futur site : la maquette se construit au fil de vos réponses."
          className="sticky top-0 order-1 z-10 h-[35svh] w-full shrink-0 overflow-hidden border-b border-[var(--hair)] bg-[var(--color-mist)] lg:order-2 lg:h-full lg:w-[55%] lg:border-b-0 lg:border-l"
        >
          <MockupStage target={target} spin={phase === "done"} reduced={reduced} />
          <span className="pointer-events-none absolute bottom-4 left-[var(--rail)] font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Aperçu · se construit à mesure
          </span>
        </aside>

        {/* Le parcours */}
        <section
          ref={columnRef}
          onKeyDown={onKeyDown}
          className="quiet-scroll order-2 flex w-full flex-1 flex-col px-[var(--rail)] pb-16 pt-12 lg:order-1 lg:w-[45%] lg:overflow-y-auto lg:pt-28"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase === "done" ? "done" : current.id}
              initial={from}
              animate={enter}
              exit={leave}
              transition={{ duration: reduced ? 0.15 : 0.62, ease: EASE }}
              className="flex-1"
            >
              {phase === "done" ? <Done values={getValues()} /> : screen}
            </motion.div>
          </AnimatePresence>

          {phase !== "done" && (
            <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--hair)] pt-7">
              {step > 0 && (
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => goTo(step - 1)}
                  aria-label="Étape précédente"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-[var(--hair-strong)] transition-colors duration-300 hover:border-[var(--color-ink)]"
                >
                  <span
                    aria-hidden
                    className="transition-transform duration-500 [transition-timing-function:var(--ease-editorial)] group-hover:-translate-x-0.5"
                  >
                    ←
                  </span>
                </button>
              )}

              <Button onClick={() => void advance()} disabled={phase === "sending"}>
                {phase === "sending"
                  ? "Envoi en cours…"
                  : step === LAST_STEP
                    ? "Envoyer mon brief"
                    : "Continuer"}
                {phase !== "sending" && <Arrow />}
              </Button>

              <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--muted)]">
                ou appuyez sur Entrée
              </span>

              {failure && (
                <p role="alert" className="w-full font-mono text-[11px] text-[#b3261e]">
                  {failure}
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Reprendre où l'on en était */}
      <AnimatePresence>
        {resume && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 border border-[var(--hair-strong)] bg-[var(--color-paper)] px-5 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-ui text-[0.9rem]">
                Reprendre où vous en étiez&nbsp;?
                <span className="ml-2 font-mono text-[11px] text-[var(--muted)]">
                  étape {STEPS[Math.min(resume.step, LAST_STEP)].number}
                </span>
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => {
                    clearProgress();
                    setResume(null);
                  }}
                  className="font-ui text-[0.85rem] text-[var(--muted)] transition-colors hover:text-[var(--color-ink)]"
                >
                  Recommencer
                </button>
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => {
                    reset({ ...BRIEF_DEFAULTS, ...resume.values } as DefaultValues<BriefValues>);
                    setStep(Math.min(resume.step, LAST_STEP));
                    setResume(null);
                  }}
                  className={cx(
                    "rounded-full bg-[var(--color-ink)] px-5 py-2 font-ui text-[0.85rem] text-white",
                    "transition-colors duration-300 hover:bg-[var(--color-accent)]",
                  )}
                >
                  Reprendre
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FormProvider>
  );
}
