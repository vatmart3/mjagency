"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CONTACT_PREFS, REFERRALS, TIME_SLOTS } from "@/lib/options";
import type { BriefValues } from "@/lib/schema";
import { ChipGroup } from "@/components/ui/Choice";
import TextField from "@/components/ui/TextField";
import { FieldError } from "@/components/ui/Label";
import { cx } from "@/lib/cx";
import StepShell, { Em } from "./StepShell";

const LEGAL_URL = process.env.NEXT_PUBLIC_LEGAL_URL ?? "https://mjagency.eu/mentions-legales";

export default function Contact() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BriefValues>();
  const contactPref = useWatch({ control, name: "contactPref" });
  const timeSlot = useWatch({ control, name: "timeSlot" });
  const referral = useWatch({ control, name: "referral" });
  const rgpd = useWatch({ control, name: "rgpd" }) ?? false;

  return (
    <StepShell
      number="09"
      kicker="On vous recontacte"
      title={
        <>
          Dernière étape : <Em>comment vous joindre ?</Em>
        </>
      }
      lead="Un seul appel, au moment que vous choisissez. Pas de liste de diffusion, pas de démarchage."
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <TextField
          autoFocus
          label="Nom complet"
          placeholder="Julie Martin"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          placeholder="julie@chez-leon.fr"
          autoComplete="email"
          spellCheck={false}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <TextField
        label="Téléphone"
        type="tel"
        inputMode="tel"
        placeholder="06 12 34 56 78"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <ChipGroup
          name="contactPref"
          label="Vous préférez"
          options={CONTACT_PREFS}
          value={contactPref}
          onChange={(v) => setValue("contactPref", v, { shouldValidate: true, shouldDirty: true })}
          error={errors.contactPref?.message}
        />
        <ChipGroup
          name="timeSlot"
          label="Le meilleur créneau"
          options={TIME_SLOTS}
          value={timeSlot}
          onChange={(v) => setValue("timeSlot", v, { shouldValidate: true, shouldDirty: true })}
          error={errors.timeSlot?.message}
        />
      </div>

      <ChipGroup
        name="referral"
        label="Comment nous avez-vous connus ?"
        options={REFERRALS}
        value={referral}
        onChange={(v) => setValue("referral", v, { shouldValidate: true, shouldDirty: true })}
        error={errors.referral?.message}
      />

      {/* Piège à robots : invisible, hors du parcours clavier. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Ne remplissez pas ce champ
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="border-t border-[var(--hair)] pt-7">
        <label
          data-cursor="pointer"
          className="flex cursor-pointer items-start gap-4 has-[:focus-visible]:[&_.box]:shadow-[0_0_0_2px_var(--color-accent)]"
        >
          <input type="checkbox" className="sr-only" {...register("rgpd")} />
          <span
            className={cx(
              "box mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors duration-300",
              rgpd
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                : "border-[var(--hair-strong)]",
            )}
          >
            <span
              aria-hidden
              className={cx(
                "block h-2 w-3 -translate-y-px rotate-[-45deg] border-b-2 border-l-2 border-white transition-opacity duration-200",
                rgpd ? "opacity-100" : "opacity-0",
              )}
            />
          </span>
          <span className="font-ui text-[0.92rem] leading-relaxed text-[var(--color-ink)]">
            J'accepte que MJAGENCY utilise ces informations pour me recontacter au sujet de mon
            projet.{" "}
            <a
              href={LEGAL_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor="pointer"
              className="underline decoration-[var(--hair-strong)] underline-offset-4 transition-colors hover:decoration-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Mentions légales
            </a>
          </span>
        </label>
        <FieldError message={errors.rgpd?.message} />
      </div>
    </StepShell>
  );
}
