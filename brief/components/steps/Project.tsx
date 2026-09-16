"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { NEEDS, SECTORS } from "@/lib/options";
import type { BriefValues } from "@/lib/schema";
import { ChipGroup, ListChoice } from "@/components/ui/Choice";
import TextField from "@/components/ui/TextField";
import StepShell, { Em } from "./StepShell";
import type { StepProps } from "./types";

export default function Project({ auto }: StepProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const sector = useWatch({ control, name: "sector" });
  const need = useWatch({ control, name: "need" });

  return (
    <StepShell
      number="01"
      kicker="Le projet"
      title={
        <>
          Votre entreprise, en <Em>trois réponses.</Em>
        </>
      }
    >
      <TextField
        autoFocus
        label="Nom de l'entreprise"
        placeholder="Chez Léon"
        autoComplete="organization"
        error={errors.company?.message}
        {...register("company")}
      />

      <ChipGroup
        name="sector"
        label="Votre secteur"
        options={SECTORS}
        value={sector}
        onChange={(v) => setValue("sector", v, { shouldValidate: true, shouldDirty: true })}
        error={errors.sector?.message}
      />

      <AnimatePresence initial={false}>
        {sector === "autre" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <TextField
              label="Précisez"
              placeholder="École de voile"
              error={errors.sectorOther?.message}
              {...register("sectorOther")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ListChoice
        name="need"
        label="De quoi avez-vous besoin ?"
        options={NEEDS}
        value={need}
        onChange={(v) => {
          setValue("need", v, { shouldValidate: true, shouldDirty: true });
          if (v !== "refonte") auto();
        }}
        error={errors.need?.message}
      />

      <AnimatePresence initial={false}>
        {need === "refonte" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <TextField
              label="L'adresse du site actuel"
              placeholder="chez-leon.fr"
              inputMode="url"
              spellCheck={false}
              hint="Facultatif — mais on y jette un œil avant l'appel."
              error={errors.currentUrl?.message}
              {...register("currentUrl")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  );
}
