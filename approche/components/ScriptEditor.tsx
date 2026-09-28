"use client";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Field } from "@/components/ui/primitives";
import type { ScriptStep } from "@/content/types";

interface EditableStep extends ScriptStep {
  _k: string;
}

/** Éditeur de script : une étape = un titre, un objectif, des répliques (une par ligne), un conseil. */
export function ScriptEditor({
  initialTitle,
  initialSteps,
  onSave,
  saveLabel = "Enregistrer",
}: {
  initialTitle: string;
  initialSteps: ScriptStep[];
  onSave: (title: string, steps: ScriptStep[]) => Promise<void> | void;
  saveLabel?: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [steps, setSteps] = useState<EditableStep[]>(initialSteps.map((s, i) => ({ ...s, branches: s.branches ?? [], _k: `${s.id}-${i}` })));
  const [busy, setBusy] = useState(false);

  const update = (k: string, patch: Partial<ScriptStep>) => setSteps((all) => all.map((s) => (s._k === k ? { ...s, ...patch } : s)));

  async function save() {
    setBusy(true);
    const clean: ScriptStep[] = steps
      .map(({ _k, ...s }) => {
        void _k;
        return { ...s, lines: s.lines.map((l) => l.trim()).filter(Boolean), tip: s.tip?.trim() || undefined };
      })
      .filter((s) => s.title.trim() && s.lines.length);
    await onSave(title.trim() || initialTitle, clean);
    setBusy(false);
  }

  return (
    <div className="space-y-6 pb-4">
      <Field label="Titre du script">
        <input className="field font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-4">
        {steps.map((s, i) => (
          <Reorder.Item key={s._k} value={s} className="rounded-2xl bg-mist p-4">
            <div className="flex items-center gap-2">
              <span className="num cursor-grab text-[13px] font-semibold text-ink-3 active:cursor-grabbing" title="Glisser pour réordonner">
                ⋮⋮ {i + 1}
              </span>
              <input className="field bg-white font-semibold" value={s.title} onChange={(e) => update(s._k, { title: e.target.value })} aria-label="Titre de l'étape" />
              <button onClick={() => setSteps(steps.filter((x) => x._k !== s._k))} className="grid size-10 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-white hover:text-signal" aria-label="Supprimer l'étape">
                <Icon name="trash" size={17} />
              </button>
            </div>
            <input className="field mt-2 bg-white text-[15px]" placeholder="Objectif de l'étape" value={s.goal} onChange={(e) => update(s._k, { goal: e.target.value })} />
            <textarea
              className="field mt-2 min-h-32 bg-white text-[15px] leading-relaxed"
              value={s.lines.join("\n")}
              onChange={(e) => update(s._k, { lines: e.target.value.split("\n") })}
              placeholder="Une réplique par ligne. Variables : {prenom} {commerce} {dirigeant} {ville}"
            />
            <input className="field mt-2 bg-white text-[15px]" placeholder="Conseil (facultatif)" value={s.tip ?? ""} onChange={(e) => update(s._k, { tip: e.target.value })} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => setSteps([...steps, { id: `etape-${Date.now()}`, title: "Nouvelle étape", goal: "", lines: [""], _k: `n-${Date.now()}` }])}
        >
          <Icon name="plus" size={16} /> Ajouter une étape
        </Button>
        <Button onClick={save} disabled={busy}>
          {busy ? "Enregistrement…" : saveLabel}
        </Button>
      </div>
    </div>
  );
}
