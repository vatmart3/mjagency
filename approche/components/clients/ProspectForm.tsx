"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Segmented } from "@/components/ui/primitives";
import { NumberInput } from "@/components/ui/NumberInput";
import { SECTORS } from "@/content/sectors";
import { CITY_NAMES, cityByName } from "@/content/cities";
import { profiles } from "@/content/profiles";
import { temperatures } from "@/content/thermometer";
import { PIPELINE, type Prospect } from "@/lib/types";
import { useSession } from "@/lib/session";

export type ProspectDraft = Partial<Prospect>;

const EMPTY: ProspectDraft = { name: "", sector: "boulangerie", city: "Sète", status: "a_contacter", to_visit: true, photos: [] };

/** Formulaire complet d'une fiche entreprise, pensé pour le pouce : sections repliables, champs 16 px. */
export function ProspectForm({
  initial,
  onSubmit,
  submitLabel = "Enregistrer",
  busy,
}: {
  initial?: ProspectDraft;
  onSubmit: (d: ProspectDraft) => void;
  submitLabel?: string;
  busy?: boolean;
}) {
  const { profiles: team } = useSession();
  const [d, setD] = useState<ProspectDraft>({ ...EMPTY, ...initial });
  const isCustomSector = !!d.sector && !SECTORS.some((s) => s.id === d.sector);
  const [customSector, setCustomSector] = useState(isCustomSector);
  const set = <K extends keyof Prospect>(k: K, v: Prospect[K] | null) => setD((x) => ({ ...x, [k]: v }));
  const txt = (k: keyof Prospect) => ({
    value: (d[k] as string | null | undefined) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, (e.target.value || null) as never),
  });
  const numField = (k: keyof Prospect, decimal = false, min?: number, max?: number) => ({
    value: (d[k] as number | null | undefined) ?? null,
    decimal,
    min,
    max,
    onChange: (n: number | null) => set(k, n as never),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!d.name?.trim()) return;
    const city = cityByName(d.city);
    onSubmit({ ...d, name: d.name.trim(), lat: d.lat ?? null, lng: d.lng ?? null, city: city?.name ?? d.city ?? null });
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      <Block title="L'essentiel">
        <Field label="Nom du commerce" className="md:col-span-2">
          <input className="field text-[19px] font-semibold" placeholder="Ex. Boulangerie du Pont Levis" required {...txt("name")} autoFocus={!initial?.id} />
        </Field>
        <Field label="Secteur" group>
          {customSector ? (
            <div className="flex gap-2">
              <input className="field" placeholder="Secteur libre" {...txt("sector")} />
              <Button type="button" variant="quiet" size="sm" onClick={() => (setCustomSector(false), set("sector", "boulangerie"))}>
                Liste
              </Button>
            </div>
          ) : (
            <select
              className="field"
              value={d.sector ?? ""}
              onChange={(e) => (e.target.value === "__libre" ? (setCustomSector(true), set("sector", "")) : set("sector", e.target.value))}
            >
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              <option value="__libre">Autre (saisie libre)…</option>
            </select>
          )}
        </Field>
        <Field label="Sous-activité">
          <input className="field" placeholder="Ex. pâtisserie fine, bar à vin…" {...txt("sub_activity")} />
        </Field>
        <Field label="Adresse">
          <input className="field" placeholder="N° et rue" {...txt("address")} />
        </Field>
        <Field label="Ville">
          <input className="field" list="cities" {...txt("city")} />
          <datalist id="cities">
            {CITY_NAMES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Téléphone">
          <input className="field" type="tel" inputMode="tel" {...txt("phone")} />
        </Field>
        <Field label="Email">
          <input className="field" type="email" inputMode="email" {...txt("email")} />
        </Field>
        <Field label="Dirigeant">
          <input className="field" placeholder="Prénom Nom" {...txt("owner_name")} />
        </Field>
        <Field label="Horaires">
          <input className="field" placeholder="Mar–Sam 9h–19h" {...txt("hours")} />
        </Field>
      </Block>

      <Block title="Présence en ligne">
        <Field label="Site web">
          <input className="field" inputMode="url" placeholder="exemple.fr" {...txt("website")} />
        </Field>
        <Field label="Fiche Google (lien)">
          <input className="field" inputMode="url" {...txt("google_url")} />
        </Field>
        <Field label="Note Google">
          <NumberInput placeholder="4,3" {...numField("google_rating", true, 0, 5)} />
        </Field>
        <Field label="Nombre d'avis">
          <NumberInput placeholder="58" {...numField("google_reviews", false, 0)} />
        </Field>
        <Field label="Instagram">
          <input className="field" placeholder="@compte" {...txt("instagram")} />
        </Field>
        <Field label="Facebook">
          <input className="field" {...txt("facebook")} />
        </Field>
        <Field label="TikTok">
          <input className="field" placeholder="@compte" {...txt("tiktok")} />
        </Field>
      </Block>

      <Block title="L'entreprise">
        <Field label="Année de création">
          <NumberInput placeholder="2015" {...numField("founded_year", false, 1800, 2100)} />
        </Field>
        <Field label="Salariés">
          <NumberInput placeholder="3" {...numField("employees", false, 0)} />
        </Field>
        <Field label="Concurrents connus" className="md:col-span-2">
          <input className="field" placeholder="Qui, où, ce qu'ils font mieux" {...txt("competitors")} />
        </Field>
        <Field label="Observations terrain" className="md:col-span-2">
          <textarea className="field min-h-28" placeholder="Vitrine, affichage, ambiance, file d'attente, ce que dit le gérant…" {...txt("field_notes")} />
        </Field>
      </Block>

      <Block title="Lecture & pipeline">
        <Field label="Profil détecté" className="md:col-span-2" group>
          <div className="flex flex-wrap gap-2">
            {profiles.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => set("disc", d.disc === p.id ? null : p.id)}
                className={`h-10 rounded-full px-4 text-[14px] font-medium transition-colors ${d.disc === p.id ? "text-white" : "bg-mist text-ink"}`}
                style={d.disc === p.id ? { background: p.color } : undefined}
              >
                {p.name}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Température" className="md:col-span-2" group>
          <div className="flex flex-wrap gap-2">
            {temperatures.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => set("temperature", d.temperature === t.id ? null : t.id)}
                className={`h-10 rounded-full px-4 text-[14px] font-medium ${d.temperature === t.id ? "bg-blue text-white" : "bg-mist text-ink"}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Statut">
          <select className="field" value={d.status} onChange={(e) => set("status", e.target.value as Prospect["status"])}>
            {PIPELINE.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Montant potentiel (€)">
          <NumberInput placeholder="1 500" {...numField("potential_amount", true, 0)} />
        </Field>
        {d.status === "signe" && (
          <Field label="Montant signé (€)">
            <NumberInput placeholder="1 500" {...numField("signed_amount", true, 0)} />
          </Field>
        )}
        <Field label="Suivi par">
          <select className="field" value={d.assigned_to ?? ""} onChange={(e) => set("assigned_to", e.target.value || null)}>
            <option value="">Les deux</option>
            {team.map((u) => (
              <option key={u.id} value={u.id}>
                {u.display_name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Prochaine action">
          <input className="field" placeholder="Rappeler, repasser, envoyer l'audit…" {...txt("next_action")} />
        </Field>
        <Field label="Date">
          <input className="field" type="date" {...txt("next_action_at")} />
        </Field>
        <Field label="Tournée terrain" group>
          <Segmented
            value={d.to_visit ? "oui" : "non"}
            onChange={(v) => set("to_visit", v === "oui")}
            options={[
              { value: "oui", label: "À visiter" },
              { value: "non", label: "Pas de visite" },
            ]}
          />
        </Field>
      </Block>

      <div className="sticky z-20 flex justify-end" style={{ bottom: "calc(var(--dock-h) + env(safe-area-inset-bottom) + 20px)" }}>
        <Button type="submit" size="lg" disabled={busy} className="shadow-[var(--shadow-lift)]">
          {busy ? "Enregistrement…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 w-full border-b border-line pb-2 text-[20px] font-semibold tracking-tight">{title}</legend>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}
