"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { BriefValues } from "@/lib/schema";
import UrlList from "@/components/ui/UrlList";
import CharCounter from "@/components/ui/CharCounter";
import { MonoLabel, FieldError } from "@/components/ui/Label";
import StepShell, { Em } from "./StepShell";

export default function Inspiration() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const inspirations = (useWatch({ control, name: "inspirations" }) ?? []) as string[];
  const avoid = useWatch({ control, name: "avoid" }) ?? "";

  const inspirationError =
    errors.inspirations?.message ??
    (Array.isArray(errors.inspirations)
      ? errors.inspirations.find(Boolean)?.message
      : undefined);

  return (
    <StepShell
      number="06"
      kicker="Les inspirations"
      title={
        <>
          Montrez-nous ce que vous <Em>aimez.</Em>
        </>
      }
      lead="Même hors de votre métier. Un site qui vous plaît en dit plus long qu'un paragraphe."
    >
      <UrlList
        label="Jusqu'à trois sites"
        values={inspirations}
        onChange={(next) =>
          setValue("inspirations", next.filter((v) => v.trim() !== ""), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        error={inspirationError}
      />

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <MonoLabel>Ce que vous ne voulez surtout pas</MonoLabel>
          <CharCounter value={avoid.length} max={150} />
        </div>
        <textarea
          data-cursor="text"
          rows={3}
          maxLength={150}
          placeholder="Pas de carrousel, pas de fond sombre, pas de photos de banque d'images."
          className="w-full resize-none border-0 border-b border-[var(--hair-strong)] bg-transparent pb-3 font-ui text-[clamp(1rem,1.7vw,1.2rem)] leading-relaxed outline-none focus:border-[var(--color-accent)]"
          {...register("avoid")}
        />
        <FieldError message={errors.avoid?.message} />
      </div>
    </StepShell>
  );
}
