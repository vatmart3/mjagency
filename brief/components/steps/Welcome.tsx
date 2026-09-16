"use client";

import { useFormContext } from "react-hook-form";
import type { BriefValues } from "@/lib/schema";
import TextField from "@/components/ui/TextField";
import StepShell, { Em } from "./StepShell";

export default function Welcome() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BriefValues>();

  return (
    <StepShell
      number="00"
      kicker="Accueil"
      title={
        <>
          Votre futur site <Em>commence ici.</Em>
        </>
      }
      lead="9 étapes, environ 4 minutes, et on vous recontacte sous 24 h avec une première direction."
    >
      <TextField
        display
        autoFocus
        label="Pour commencer — votre prénom"
        placeholder="Julie"
        autoComplete="given-name"
        enterKeyHint="next"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
      <p className="max-w-[40ch] font-ui text-[0.85rem] leading-relaxed text-[var(--muted)]">
        Rien d'autre pour l'instant. Juste à côté, une maquette vide : elle va
        se construire au fil de vos réponses.
      </p>
    </StepShell>
  );
}
