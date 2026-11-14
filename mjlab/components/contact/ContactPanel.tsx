"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { activities, form as formContent, hero, site } from "@/content/site";
import { useForm, useUI } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import SegmentGlyph from "@/components/ui/SegmentGlyph";
import { ArrowLeft, ArrowUpRight, Close } from "@/components/ui/Icons";

const STEPS = 4;
const ease = [0.22, 1, 0.36, 1] as const;

/** Formulaire en 4 étapes, plein écran. Étape 1 en un clic (micro-engagement),
    progression visible, réponses gardées si on ferme en cours de route. */
export default function ContactPanel() {
  const { contactOpen, closeContact } = useUI();
  const { step, data, sent, update, setStep, markSent, reset } = useForm();
  const hydrated = useHydrated();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // focus : à l'ouverture, au changement d'étape ; retour au déclencheur à la fermeture
  useEffect(() => {
    if (contactOpen) {
      returnFocus.current = document.activeElement as HTMLElement;
      const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 450);
      return () => clearTimeout(t);
    } else {
      returnFocus.current?.focus?.();
    }
  }, [contactOpen, step, sent]);

  // arrière-plan inerte pendant que le panneau est ouvert
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#contenu, header, footer");
    els.forEach((el) => (el.inert = contactOpen));
    return () => els.forEach((el) => (el.inert = false));
  }, [contactOpen]);

  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContact();
      if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("button:not([disabled]), input, textarea, a[href]");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen, closeContact]);

  const go = (s: number) => setStep(Math.max(0, Math.min(STEPS - 1, s)));
  const canNext = [!!data.activity, data.idea.trim().length >= 3, !!data.budget && !!data.delay, true][step];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!data.firstName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setStatus("error");
      setErrorMsg("Il manque votre prénom ou une adresse e-mail valide.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: fd.get("website") ?? "" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("idle");
      markSent();
    } catch {
      setStatus("error");
      setErrorMsg("L'envoi n'a pas abouti. Vos réponses sont gardées : réessayez, ou écrivez-nous directement.");
    }
  };

  const activityName = activities.find((a) => a.slug === data.activity)?.name ?? (data.activity ? formContent.otherLabel : "");
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Projet — ${activityName || "MJ LAB"}`)}&body=${encodeURIComponent(
    `${data.idea}\n\nBudget : ${data.budget}\nDélai : ${data.delay}\n\n${data.firstName}\n${data.email}\n${data.phone}`
  )}`;

  return (
    <AnimatePresence>
      {contactOpen && hydrated && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-step-title"
          data-theme="light"
          className="fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-creme text-noir"
          data-lenis-prevent
          initial={{ clipPath: "circle(0% at 95% 5%)" }}
          animate={{ clipPath: "circle(150% at 95% 5%)" }}
          exit={{ clipPath: "circle(0% at 95% 5%)" }}
          transition={{ duration: 0.8, ease }}
        >
          {/* barre du haut */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-creme/90 py-4 backdrop-blur gutter md:py-5">
            <span className="font-display text-[1.5rem] font-bold tracking-[-0.04em]">
              MJ<span className="text-bordeaux">.</span>
              <span className="mono ml-3 align-middle text-noir/60">LANCER UN PROJET</span>
            </span>
            <div className="flex items-center gap-4">
              {!sent && (
                <span className="mono hidden text-noir/70 sm:inline" aria-live="polite">
                  ÉTAPE {step + 1}/{STEPS}
                </span>
              )}
              <button
                type="button"
                onClick={closeContact}
                aria-label="Fermer le panneau (vos réponses sont gardées)"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-noir text-creme transition-colors hover:bg-bordeaux"
              >
                <Close />
              </button>
            </div>
          </div>
          {!sent && (
            <div className="gutter">
              <div className="flex gap-1.5" aria-hidden="true">
                {Array.from({ length: STEPS }, (_, i) => (
                  <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-beige">
                    <span
                      className="block h-full rounded-full bg-bordeaux transition-transform duration-700 ease-[var(--ease-out)]"
                      style={{ transform: `scaleX(${i <= step ? 1 : 0})`, transformOrigin: "left" }}
                    />
                  </span>
                ))}
              </div>
              <p className="mono mt-2 text-noir/70 sm:hidden">ÉTAPE {step + 1}/{STEPS}</p>
            </div>
          )}

          <div className="flex flex-1 flex-col justify-center py-10 gutter md:py-14">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
                  <CheckDot />
                  <h2 id="contact-step-title" tabIndex={-1} data-autofocus className="display-tight mt-10 text-[clamp(2.6rem,6vw,5.5rem)] outline-none">
                    C&apos;est entre de bonnes mains<span className="text-bordeaux">.</span>
                  </h2>
                  <p className="mt-5 text-[1.05rem] leading-relaxed text-noir/80">
                    Merci {data.firstName}. On revient vers vous sous 24 h avec une première piste — et l&apos;appel découverte de 20 min, offert, si vous le souhaitez.
                  </p>
                  <p className="mono mt-4 text-noir/60">{hero.reassurance}</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={closeContact} className="rounded-full bg-noir px-6 py-3.5 font-medium text-creme hover:bg-bordeaux">
                      Retour au site
                    </button>
                    <button type="button" onClick={reset} className="rounded-full bg-beige px-6 py-3.5 font-medium text-noir hover:bg-beige/70">
                      Nouveau projet
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease }}
                  className="mx-auto w-full max-w-[64rem]"
                >
                  {step === 0 && (
                    <>
                      <StepTitle n={1} title="Pour quelle activité ?" hint="Un clic suffit." />
                      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {activities.map((a, i) => (
                          <Tile
                            key={a.slug}
                            selected={data.activity === a.slug}
                            autoFocus={i === 0}
                            onClick={() => {
                              update({ activity: a.slug });
                              setTimeout(() => go(1), 260);
                            }}
                          >
                            <span className="flex items-start justify-between gap-3">
                              <span className="mono text-noir/60">{a.code}</span>
                              <SegmentGlyph index={i} count={activities.length} className="w-14" />
                            </span>
                            <span className="mt-4 block font-display text-[1.6rem] font-bold leading-none tracking-[-0.04em]">
                              {a.name}<span className="text-bordeaux">.</span>
                            </span>
                            <span className="mt-2 block text-[0.92rem] text-noir/75">{a.formLabel}</span>
                          </Tile>
                        ))}
                        <Tile
                          selected={data.activity === "autre"}
                          onClick={() => {
                            update({ activity: "autre" });
                            setTimeout(() => go(1), 260);
                          }}
                        >
                          <span className="mono text-noir/60">EXP-??</span>
                          <span className="mt-4 block font-display text-[1.6rem] font-bold leading-none tracking-[-0.04em]">
                            {formContent.otherLabel}<span className="text-bordeaux">.</span>
                          </span>
                          <span className="mt-2 block text-[0.92rem] text-noir/75">Une idée qui ne rentre dans aucune case.</span>
                        </Tile>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <StepTitle n={2} title="Votre projet en une phrase" hint={activityName ? `Pour ${activityName}` : undefined} />
                      <label htmlFor="idea" className="sr-only">Votre projet en une phrase</label>
                      <textarea
                        id="idea"
                        data-autofocus
                        rows={3}
                        maxLength={400}
                        value={data.idea}
                        onChange={(e) => update({ idea: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && canNext) { e.preventDefault(); go(2); }
                        }}
                        placeholder="Ex. : un site pour ma boulangerie, avec la commande en ligne."
                        className="mt-8 w-full resize-none border-b-2 border-noir/20 bg-transparent pb-3 font-display text-[clamp(1.5rem,3.4vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.03em] placeholder:text-noir/35 focus:border-bordeaux focus:outline-none"
                      />
                      <p className="mono mt-2 text-right text-noir/55">{data.idea.length}/400</p>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <StepTitle n={3} title="Budget et délai" hint="Une fourchette suffit, rien n'engage." />
                      <fieldset className="mt-8">
                        <legend className="mono mb-3 text-noir/70">BUDGET</legend>
                        <div className="flex flex-wrap gap-2">
                          {formContent.budgets.map((b, i) => (
                            <Chip key={b} selected={data.budget === b} onClick={() => update({ budget: b })} autoFocus={i === 0}>
                              {b}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className="mt-8">
                        <legend className="mono mb-3 text-noir/70">DÉLAI</legend>
                        <div className="flex flex-wrap gap-2">
                          {formContent.delays.map((d) => (
                            <Chip key={d} selected={data.delay === d} onClick={() => update({ delay: d })}>
                              {d}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    </>
                  )}

                  {step === 3 && (
                    <form onSubmit={submit} noValidate>
                      <StepTitle n={4} title="Vos coordonnées" hint="Pour vous répondre, rien de plus." />
                      <div className="mt-8 grid gap-6 md:grid-cols-3">
                        <Field id="firstName" label="Prénom" required value={data.firstName} onChange={(v) => update({ firstName: v })} autoComplete="given-name" autoFocus />
                        <Field id="email" label="E-mail" type="email" required value={data.email} onChange={(v) => update({ email: v })} autoComplete="email" />
                        <Field id="phone" label="Téléphone (facultatif)" type="tel" value={data.phone} onChange={(v) => update({ phone: v })} autoComplete="tel" />
                      </div>
                      {/* champ piège anti-robots */}
                      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                        <label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
                      </div>
                      <p className="mt-6 max-w-[40rem] text-[0.85rem] leading-relaxed text-noir/70">
                        Vos réponses servent uniquement à vous recontacter au sujet de ce projet. Voir notre{" "}
                        <a href="/confidentialite" className="underline underline-offset-2">politique de confidentialité</a>.
                      </p>
                      {status === "error" && (
                        <p role="alert" className="mt-4 rounded-xl bg-bordeaux/10 px-4 py-3 text-[0.92rem] text-bordeaux">
                          {errorMsg}{" "}
                          <a href={mailto} className="font-medium underline underline-offset-2">Écrire par e-mail</a>
                        </p>
                      )}
                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="group inline-flex items-center gap-3 rounded-full bg-bordeaux px-7 py-4 text-[1rem] font-medium text-blanc transition-colors hover:bg-bordeaux-light disabled:opacity-60"
                        >
                          {status === "sending" ? "Envoi…" : "Envoyer mon projet"}
                          <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
                        </button>
                        <span className="mono text-noir/65">{hero.reassurance}</span>
                      </div>
                    </form>
                  )}

                  {/* navigation entre étapes */}
                  <div className="mt-10 flex items-center justify-between">
                    {step > 0 ? (
                      <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-2 rounded-full px-1 py-2 text-[0.95rem] font-medium text-noir/75 hover:text-noir">
                        <ArrowLeft /> Retour
                      </button>
                    ) : (
                      <span className="mono text-noir/55">{hero.offer.toUpperCase()}</span>
                    )}
                    {step > 0 && step < STEPS - 1 && (
                      <button
                        type="button"
                        disabled={!canNext}
                        onClick={() => go(step + 1)}
                        className="inline-flex items-center gap-2 rounded-full bg-noir px-6 py-3.5 text-[0.95rem] font-medium text-creme transition-colors hover:bg-bordeaux disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Continuer <ArrowUpRight size={15} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepTitle({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div>
      <p className="mono text-bordeaux">Q-0{n}</p>
      <h2 id="contact-step-title" className="display-tight mt-3 text-[clamp(2.3rem,5.6vw,5rem)]">
        {title}
      </h2>
      {hint && <p className="mt-3 text-[1rem] text-noir/70">{hint}</p>}
    </div>
  );
}

function Tile({ children, selected, onClick, autoFocus }: { children: React.ReactNode; selected: boolean; onClick: () => void; autoFocus?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-autofocus={autoFocus ? "" : undefined}
      className={`group rounded-[20px] border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
        selected ? "border-bordeaux bg-bordeaux/[0.06]" : "border-beige bg-blanc/50 hover:border-noir/40"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({ children, selected, onClick, autoFocus }: { children: React.ReactNode; selected: boolean; onClick: () => void; autoFocus?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-autofocus={autoFocus ? "" : undefined}
      className={`rounded-full border px-5 py-3 text-[0.95rem] font-medium transition-colors duration-300 ${
        selected ? "border-bordeaux bg-bordeaux text-blanc" : "border-noir/20 bg-transparent text-noir hover:border-noir"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  id, label, value, onChange, type = "text", required, autoComplete, autoFocus,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; autoComplete?: string; autoFocus?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mono text-noir/70">
        {label.toUpperCase()} {required && <span className="text-bordeaux">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete}
        data-autofocus={autoFocus ? "" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b-2 border-noir/20 bg-transparent pb-2 font-display text-[1.5rem] font-semibold tracking-[-0.02em] focus:border-bordeaux focus:outline-none"
      />
    </div>
  );
}

/** Le point bordeaux grossit, puis trace un « check ». */
function CheckDot() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden="true">
      <motion.circle cx="60" cy="60" fill="var(--bordeaux)" initial={{ r: 6 }} animate={{ r: 56 }} transition={{ duration: 0.7, ease }} />
      <motion.path
        d="M38 62 L54 77 L84 45"
        fill="none"
        stroke="var(--creme)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.55, duration: 0.6, ease }}
      />
    </svg>
  );
}
