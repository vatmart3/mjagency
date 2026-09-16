"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FEATURES, labelOf, type FeatureId, type SectorId } from "@/lib/options";
import type { BriefValues } from "@/lib/schema";
import { TileMulti } from "@/components/ui/Choice";
import { cx } from "@/lib/cx";
import StepShell, { Em } from "./StepShell";

/** Ce que demandent le plus souvent les entreprises d'un secteur donné. */
const USUAL: Record<SectorId, FeatureId[]> = {
  restaurant: ["carte", "reservation", "avis"],
  artisan: ["galerie", "devis", "avis"],
  commerce: ["galerie", "click-collect", "avis"],
  beaute: ["rdv", "galerie", "avis"],
  sante: ["rdv", "carte"],
  immobilier: ["galerie", "devis"],
  tourisme: ["galerie", "reservation", "multilingue"],
  autre: ["galerie", "devis"],
};

export default function Features() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const features = (useWatch({ control, name: "features" }) ?? []) as FeatureId[];
  const advice = useWatch({ control, name: "featuresAdvice" }) ?? false;
  const sector = (useWatch({ control, name: "sector" }) ?? "autre") as SectorId;

  const toggle = (v: FeatureId) => {
    const next = features.includes(v) ? features.filter((f) => f !== v) : [...features, v];
    setValue("features", next, { shouldValidate: true, shouldDirty: true });
    if (next.length) setValue("featuresAdvice", false, { shouldDirty: true });
  };

  const usual = USUAL[sector] ?? USUAL.autre;

  return (
    <StepShell
      number="03"
      kicker="Les fonctionnalités"
      title={
        <>
          Ce que votre site devra <Em>savoir faire.</Em>
        </>
      }
      lead={`Dans votre secteur, on nous demande le plus souvent ${usual
        .map((f) => labelOf(FEATURES, f))
        .join(", ")}.`}
    >
      <TileMulti
        label="Cochez tout ce qui vous parle"
        options={FEATURES}
        values={features}
        onToggle={toggle}
        error={errors.features?.message}
      />

      <button
        type="button"
        data-cursor="pointer"
        aria-pressed={advice}
        onClick={() => {
          const next = !advice;
          setValue("featuresAdvice", next, { shouldValidate: true, shouldDirty: true });
          if (next) setValue("features", [], { shouldValidate: true, shouldDirty: true });
        }}
        className={cx(
          "group flex items-center gap-3 font-ui text-[0.95rem] transition-colors duration-300",
          advice ? "text-[var(--color-accent)]" : "text-[var(--muted)] hover:text-[var(--color-ink)]",
        )}
      >
        <span
          aria-hidden
          className={cx(
            "h-px w-8 transition-all duration-500 [transition-timing-function:var(--ease-editorial)]",
            advice ? "w-12 bg-[var(--color-accent)]" : "bg-[var(--hair-strong)] group-hover:w-10",
          )}
        />
        Je ne sais pas, conseillez-moi
      </button>
    </StepShell>
  );
}
