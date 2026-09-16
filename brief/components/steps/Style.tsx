"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { BriefValues } from "@/lib/schema";
import StyleCards from "@/components/ui/StyleCards";
import Slider from "@/components/ui/Slider";
import StepShell, { Em } from "./StepShell";

export default function Style() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const style = useWatch({ control, name: "style" });
  const bold = useWatch({ control, name: "bold" }) ?? 35;
  const modern = useWatch({ control, name: "modern" }) ?? 55;

  return (
    <StepShell
      number="04"
      kicker="Le style"
      title={
        <>
          L'ambiance qui vous <Em>ressemble.</Em>
        </>
      }
      lead="Ce n'est pas un choix définitif : c'est une direction. La maquette, à côté, l'adopte immédiatement."
    >
      <StyleCards
        label="Six ambiances"
        value={style}
        onChange={(v) => setValue("style", v, { shouldValidate: true, shouldDirty: true })}
        error={errors.style?.message}
      />

      <div className="grid gap-8 pt-2 sm:grid-cols-2">
        <Slider
          label="Du plus sobre au plus audacieux"
          left="Sobre"
          right="Audacieux"
          value={bold}
          onChange={(v) => setValue("bold", v, { shouldDirty: true })}
        />
        <Slider
          label="Du plus classique au plus moderne"
          left="Classique"
          right="Moderne"
          value={modern}
          onChange={(v) => setValue("modern", v, { shouldDirty: true })}
        />
      </div>
    </StepShell>
  );
}
