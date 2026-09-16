"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import type { BriefValues } from "@/lib/schema";
import Palettes, { CustomColors } from "@/components/ui/Palettes";
import FileDrop from "@/components/ui/FileDrop";
import { cx } from "@/lib/cx";
import StepShell, { Em } from "./StepShell";

export default function Colors({ files, onFiles }: { files: File[]; onFiles: (f: File[]) => void }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const palette = useWatch({ control, name: "palette" });
  const custom = (useWatch({ control, name: "customColors" }) ?? []) as string[];
  const hasBrand = useWatch({ control, name: "hasBrand" }) ?? false;

  return (
    <StepShell
      number="05"
      kicker="Les couleurs"
      title={
        <>
          Une palette, et la maquette <Em>change de peau.</Em>
        </>
      }
    >
      <Palettes
        label="Huit palettes"
        value={palette === "custom" ? undefined : palette}
        onChange={(v) => setValue("palette", v, { shouldValidate: true, shouldDirty: true })}
        error={errors.palette?.message}
      />

      <CustomColors
        active={palette === "custom"}
        colors={custom}
        onActivate={() =>
          setValue("palette", palette === "custom" ? "" : "custom", {
            shouldValidate: palette === "custom",
            shouldDirty: true,
          })
        }
        onChange={(next) =>
          setValue("customColors", next.filter(Boolean), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        error={errors.customColors?.message}
      />

      <div className="border-t border-[var(--hair)] pt-6">
        <button
          type="button"
          data-cursor="pointer"
          aria-pressed={hasBrand}
          onClick={() => setValue("hasBrand", !hasBrand, { shouldDirty: true })}
          className={cx(
            "font-ui text-[0.95rem] tracking-[-0.01em] transition-colors duration-300",
            hasBrand ? "text-[var(--color-accent)]" : "hover:text-[var(--color-accent)]",
          )}
        >
          J'ai déjà un logo / une charte
          <span aria-hidden className="ml-2 text-[var(--muted)]">
            {hasBrand ? "—" : "+"}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {hasBrand && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-6">
                <FileDrop label="Vos fichiers, joints à l'email" files={files} onChange={onFiles} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepShell>
  );
}
