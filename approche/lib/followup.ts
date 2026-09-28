import { followUpRules, type CallOutcome } from "@/content/phone-method";
import { nextBestSlot } from "@/lib/timing";
import { addDays, fromMinutes, todayISO } from "@/lib/format";
import type { Interaction, Prospect } from "@/lib/types";

export interface FollowUp {
  action: string;
  dueAt: string;
  slot: string | null;
  smsScriptId?: string;
  changeSlot: boolean;
}

/** Relance automatique proposée après un appel, selon les règles de /content/phone-method. */
export function proposeFollowUp(prospect: Prospect, outcome: CallOutcome, history: Interaction[]): FollowUp | null {
  const count = history.filter((i) => i.prospect_id === prospect.id && i.outcome === outcome).length + 1;
  const rules = followUpRules.filter((r) => r.outcome === outcome).sort((a, b) => b.afterCount - a.afterCount);
  const rule = rules.find((r) => count >= r.afterCount);
  if (!rule) return null;
  const due = addDays(todayISO(), rule.delayDays);
  let slot: string | null = null;
  if (rule.changeSlot) {
    // Changer de créneau : prochain « meilleur créneau » du secteur à une heure différente de d'habitude
    const lastHours = history.filter((i) => i.prospect_id === prospect.id).map((i) => new Date(i.created_at).getHours());
    const from = new Date(due + "T08:00:00");
    for (let k = 0; k < 4; k++) {
      const s = nextBestSlot(prospect.sector, from);
      if (!s) break;
      if (!lastHours.includes(s.getHours())) {
        slot = fromMinutes(s.getHours() * 60 + s.getMinutes());
        break;
      }
      from.setTime(s.getTime() + 90 * 60000);
    }
  }
  return { action: rule.action, dueAt: due, slot, smsScriptId: rule.smsScriptId, changeSlot: !!rule.changeSlot };
}
