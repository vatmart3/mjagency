"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AUDIENCES, GOALS, type AudienceId } from "@/lib/options";
import type { BriefValues } from "@/lib/schema";
import { ChipMulti, ListChoice } from "@/components/ui/Choice";
import StepShell, { Em } from "./StepShell";
import type { StepProps } from "./types";

export default function Goal({ auto }: StepProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const firstName = useWatch({ control, name: "firstName" });
  const goal = useWatch({ control, name: "goal" });
  const audience = (useWatch({ control, name: "audience" }) ?? []) as AudienceId[];

  const toggle = (v: AudienceId) => {
    const next = audience.includes(v) ? audience.filter((a) => a !== v) : [...audience, v];
    setValue("audience", next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <StepShell
      number="02"
      kicker="L'objectif"
      title={
        <>
          Que doit vous <Em>rapporter</Em> votre site en priorité
          {firstName ? `, ${firstName}` : ""} ?
        </>
      }
      lead="Un site qui poursuit un seul but marche mieux qu'un site qui en poursuit cinq."
    >
      <ListChoice
        name="goal"
        label="La priorité"
        options={GOALS}
        value={goal}
        onChange={(v) => {
          setValue("goal", v, { shouldValidate: true, shouldDirty: true });
          auto();
        }}
        error={errors.goal?.message}
      />

      <ChipMulti
        label="À qui vous adressez-vous ?"
        options={AUDIENCES}
        values={audience}
        onToggle={toggle}
        error={errors.audience?.message}
      />
    </StepShell>
  );
}
