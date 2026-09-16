"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ASSET_KEYS, ASSET_STATES, type AssetStateId } from "@/lib/options";
import type { BriefValues } from "@/lib/schema";
import { Segmented } from "@/components/ui/Choice";
import StepShell, { Em } from "./StepShell";

type AssetKey = keyof BriefValues["assets"];

export default function Assets() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const assets = useWatch({ control, name: "assets" });

  return (
    <StepShell
      number="07"
      kicker="Ce que vous avez déjà"
      title={
        <>
          Qu'avez-vous <Em>sous la main ?</Em>
        </>
      }
      lead="Aucune mauvaise réponse : cela nous dit simplement par où commencer."
      footnote="Il manque des photos ou des textes ? C'est fréquent, et c'est prévu — nous les produisons avec vous."
    >
      <div className="border-t border-[var(--hair)]">
        {ASSET_KEYS.map((a) => (
          <Segmented
            key={a.id}
            label={a.label}
            options={ASSET_STATES}
            value={assets?.[a.id as AssetKey] as AssetStateId | undefined}
            onChange={(v) =>
              setValue(`assets.${a.id as AssetKey}`, v, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.assets?.[a.id as AssetKey]?.message}
          />
        ))}
      </div>
    </StepShell>
  );
}
