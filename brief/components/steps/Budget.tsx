"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BUDGETS, TIMINGS } from "@/lib/options";
import type { BriefValues } from "@/lib/schema";
import { ChipGroup, ListChoice } from "@/components/ui/Choice";
import StepShell, { Em } from "./StepShell";
import type { StepProps } from "./types";

export default function Budget({ auto }: StepProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const budget = useWatch({ control, name: "budget" });
  const timing = useWatch({ control, name: "timing" });

  return (
    <StepShell
      number="08"
      kicker="Budget & délai"
      title={
        <>
          Parlons <Em>chiffres</Em> — franchement.
        </>
      }
      lead="Le dire tout de suite évite deux rendez-vous pour rien. Nous adaptons le périmètre, jamais la qualité."
      footnote="Devis gratuit, sans engagement. Paiement en plusieurs fois possible sur les projets au-delà de 1 500 €."
    >
      <ListChoice
        name="budget"
        label="Votre budget"
        options={BUDGETS}
        value={budget}
        onChange={(v) => {
          setValue("budget", v, { shouldValidate: true, shouldDirty: true });
          if (timing) auto();
        }}
        error={errors.budget?.message}
      />

      <ChipGroup
        name="timing"
        label="Pour quand ?"
        options={TIMINGS}
        value={timing}
        onChange={(v) => {
          setValue("timing", v, { shouldValidate: true, shouldDirty: true });
          if (budget) auto();
        }}
        error={errors.timing?.message}
      />
    </StepShell>
  );
}
