"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip, Dots, Field } from "@/components/ui/primitives";
import { celebrate, toast } from "@/components/ui/Toast";
import { debriefObjections, nextActions } from "@/content/field-method";
import { profiles } from "@/content/profiles";
import { temperatures } from "@/content/thermometer";
import type { DiscProfile, Temperature } from "@/content/types";
import { db } from "@/lib/data/hooks";
import { addDays, todayISO } from "@/lib/format";
import type { InteractionChannel, InteractionOutcome, Prospect } from "@/lib/types";

const INTEREST_TO_TEMP: Temperature[] = ["glace", "froid", "tiede", "chaud", "brulant"];

/** Débrief en 30 secondes : 4 touches et c'est rangé dans la fiche. */
export function DebriefForm({
  prospect,
  channel = "physique",
  onDone,
  compact,
}: {
  prospect: Prospect;
  channel?: InteractionChannel;
  onDone?: () => void;
  compact?: boolean;
}) {
  const [disc, setDisc] = useState<DiscProfile | null>(prospect.disc);
  const [interest, setInterest] = useState<number | null>(null);
  const [objection, setObjection] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [date, setDate] = useState<string>(addDays(todayISO(), 2));
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  function pickAction(id: string) {
    setAction(id);
    const a = nextActions.find((x) => x.id === id);
    if (a) setDate(addDays(todayISO(), a.defaultDelayDays));
  }

  async function save() {
    setBusy(true);
    const a = nextActions.find((x) => x.id === action);
    const label = a?.label ?? null;
    const isRdv = !!label && /rdv/i.test(label);
    const isDrop = !!label && /abandon/i.test(label);
    const temperature = interest ? INTEREST_TO_TEMP[interest - 1] : prospect.temperature;
    const outcome: InteractionOutcome = channel === "physique" ? (isRdv ? "rdv" : "visite") : isRdv ? "rdv" : "note";
    await db.insert("interactions", {
      prospect_id: prospect.id,
      channel,
      outcome,
      disc,
      temperature,
      interest,
      objection,
      next_action: label,
      next_action_at: a && !isDrop ? date : null,
      notes: notes.trim() || null,
    });
    const patch: Partial<Prospect> = {
      disc,
      temperature,
      next_action: isDrop ? null : label,
      next_action_at: a && !isDrop ? date : null,
    };
    if (channel === "physique") patch.to_visit = false;
    if (isRdv && ["a_contacter", "contacte", "interesse"].includes(prospect.status)) patch.status = "rdv";
    else if (isDrop) patch.status = "perdu";
    else if (prospect.status === "a_contacter") patch.status = interest && interest >= 4 ? "interesse" : "contacte";
    else if (prospect.status === "contacte" && interest && interest >= 4) patch.status = "interesse";
    if (label && /repasser/i.test(label)) patch.to_visit = true;
    await db.update("prospects", prospect.id, patch);
    if (a && !isDrop) {
      await db.insert("tasks", {
        prospect_id: prospect.id,
        title: `${label} — ${prospect.name}`,
        kind: isRdv ? "rdv" : /repasser/i.test(label!) ? "repasser" : /sms/i.test(label!) ? "sms" : /audit|envoy/i.test(label!) ? "email" : "rappel",
        due_at: date,
      });
    }
    setBusy(false);
    if (isRdv) celebrate("RDV décroché", `${prospect.name} — bien joué.`);
    else toast("Débrief enregistré", prospect.name);
    onDone?.();
  }

  return (
    <div className={compact ? "space-y-5" : "space-y-7"}>
      <Field label="Attitude détectée" group>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {profiles.map((p) => (
            <motion.button
              key={p.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setDisc(disc === p.id ? null : p.id)}
              className={`rounded-2xl px-3 py-3 text-left text-[14px] font-semibold transition-colors ${disc === p.id ? "text-white" : "bg-mist"}`}
              style={disc === p.id ? { background: p.color } : undefined}
            >
              {p.name}
            </motion.button>
          ))}
        </div>
      </Field>
      <Field label={`Intérêt${interest ? ` · ${temperatures[interest - 1]?.name ?? ""}` : ""}`} group>
        <Dots value={interest} onChange={setInterest} label="Intérêt de 1 à 5" />
      </Field>
      <Field label="Objection principale" group>
        <div className="flex flex-wrap gap-2">
          {debriefObjections.map((o) => (
            <Chip key={o} active={objection === o} onClick={() => setObjection(objection === o ? null : o)}>
              {o}
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Prochaine action" group>
        <div className="flex flex-wrap gap-2">
          {nextActions.map((a) => (
            <Chip key={a.id} active={action === a.id} onClick={() => pickAction(a.id)}>
              {a.label}
            </Chip>
          ))}
        </div>
        {action && !/abandon/i.test(nextActions.find((a) => a.id === action)?.label ?? "") && (
          <input type="date" className="field mt-3 max-w-[220px]" value={date} onChange={(e) => setDate(e.target.value)} />
        )}
      </Field>
      <Field label="Une phrase à retenir (facultatif)">
        <textarea className="field min-h-20" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ce qu'il a dit, ce qu'il faut ramener la prochaine fois…" />
      </Field>
      <Button size="lg" className="w-full" onClick={save} disabled={busy || (!interest && !action && !notes.trim())}>
        {busy ? "Enregistrement…" : "Ranger dans la fiche"}
      </Button>
    </div>
  );
}
