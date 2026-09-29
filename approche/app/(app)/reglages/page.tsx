"use client";
import { ask } from "@/components/ui/Confirm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip, Field, PageHeader, SectionTitle, Tag } from "@/components/ui/primitives";
import { NumberInput } from "@/components/ui/NumberInput";
import { toast } from "@/components/ui/Toast";
import { DEFAULT_OFFERS, pricingSummary, type Offer } from "@/content/offers";
import { SECTORS } from "@/content/sectors";
import { CITY_NAMES } from "@/content/cities";
import { useSettings, saveSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { useTable } from "@/lib/data/hooks";
import { resetDemoData } from "@/lib/data/repo";
import { useSession } from "@/lib/session";
import { usePrefs } from "@/store/prefs";
import { csvEscape, todayISO } from "@/lib/format";
import { statusLabel } from "@/lib/types";
import { useAiEnabled } from "@/lib/ai";
import { IS_ARTIFACT } from "@/lib/target";
import type { SettingsData } from "@/lib/types";

export default function Settings() {
  const { settings, loading } = useSettings();
  const [draft, setDraft] = useState<SettingsData>(settings);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty) setDraft(settings);
  }, [settings, dirty]);
  const set = (patch: Partial<SettingsData>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };

  async function save() {
    await saveSettings(draft, settings);
    setDirty(false);
    toast("Réglages enregistrés", "Partagés avec votre associé.");
  }

  if (loading) return <div className="mt-16 h-96 animate-pulse rounded-3xl bg-mist" />;

  return (
    <div>
      <PageHeader kicker="Réglages" title="Les règles du jeu." lede="Prix, secteurs, villes et objectifs sont partagés entre les deux associés. L'affichage (3D, animations) est propre à cet appareil." />

      {dirty && (
        <div className="sticky top-3 z-40 mb-6 flex items-center justify-between gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-white shadow-[var(--shadow-lift)]">
          <span className="text-[14px]">Modifications non enregistrées</span>
          <span className="flex gap-1">
            <Button size="sm" variant="quiet" className="text-white/70" onClick={() => (setDraft(settings), setDirty(false))}>
              Annuler
            </Button>
            <Button size="sm" onClick={save}>
              Enregistrer
            </Button>
          </span>
        </div>
      )}

      <div className="space-y-20">
        <Offers offers={draft.offers} onChange={(offers) => set({ offers })} />

        <section>
          <SectionTitle kicker="Objectifs" title="Ce qu'on vise" />
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Objectif mensuel par personne (€)">
              <NumberInput value={draft.goalPerPerson} min={0} onChange={(n) => set({ goalPerPerson: n ?? 0 })} />
            </Field>
            <Field label="Panier moyen par défaut (€)" hint="Utilisé tant qu'il y a moins de 2 signatures.">
              <NumberInput value={draft.defaultBasket} min={0} onChange={(n) => set({ defaultBasket: n ?? 0 })} />
            </Field>
            <Field label="Jours de prospection par semaine">
              <NumberInput value={draft.workingDaysPerWeek} min={1} max={7} onChange={(n) => set({ workingDaysPerWeek: n ?? 5 })} />
            </Field>
            <Field label="Durée d'une session d'appels (min)">
              <NumberInput value={draft.callSessionMinutes} min={5} max={240} onChange={(n) => set({ callSessionMinutes: n ?? 45 })} />
            </Field>
          </div>
          <p className="kicker mt-8">Taux par défaut (avant d&apos;avoir assez d&apos;historique)</p>
          <div className="mt-3 grid gap-4 md:grid-cols-4">
            {(
              [
                ["pickup", "Décroché / appels"],
                ["meeting", "RDV / conversations"],
                ["visitMeeting", "RDV / visites"],
                ["close", "Signatures / RDV"],
              ] as const
            ).map(([k, label]) => (
              <Field key={k} label={`${label} (%)`}>
                <NumberInput
                  value={Math.round(draft.defaultRates[k] * 100)}
                  min={1}
                  max={100}
                  onChange={(n) => n !== null && set({ defaultRates: { ...draft.defaultRates, [k]: n / 100 } })}
                />
              </Field>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle kicker="Périmètre" title="Secteurs actifs" />
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <Chip
                key={s.id}
                active={draft.activeSectors.includes(s.id)}
                onClick={() => set({ activeSectors: draft.activeSectors.includes(s.id) ? draft.activeSectors.filter((x) => x !== s.id) : [...draft.activeSectors, s.id] })}
              >
                {s.name}
              </Chip>
            ))}
          </div>
        </section>

        <Cities cities={draft.cities} onChange={(cities) => set({ cities })} />

        <Device />
        {IS_ARTIFACT ? <ArtifactNote /> : <Exports />}
        <Account />
      </div>
    </div>
  );
}

function Offers({ offers, onChange }: { offers: Offer[]; onChange: (o: Offer[]) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const upd = (id: string, fn: (o: Offer) => Offer) => onChange(offers.map((o) => (o.id === id ? fn(o) : o)));
  return (
    <section>
      <SectionTitle kicker="Catalogue" title="Offres et prix">
        <span className="text-[13px] text-ink-2">Injectés dans les prompts de recherche</span>
      </SectionTitle>
      <div className="border-t border-line">
        {offers.map((o) => (
          <div key={o.id} className="border-b border-line">
            <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full flex-wrap items-baseline justify-between gap-2 py-4 text-left">
              <span className="text-[19px] font-semibold tracking-tight">{o.name}</span>
              <span className="text-[14px] text-ink-2">{pricingSummary(o)}</span>
            </button>
            {open === o.id && (
              <div className="grid gap-5 pb-6 md:grid-cols-3">
                <Formula
                  title="Paiement direct"
                  enabled={!!o.pricing.direct}
                  onToggle={(on) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, direct: on ? { price: DEFAULT_OFFERS.find((d) => d.id === o.id)?.pricing.direct?.price ?? 0 } : null } }))}
                >
                  {o.pricing.direct && (
                    <Field label="Prix (€)">
                      <NumberInput decimal value={o.pricing.direct.price} min={0} onChange={(v) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, direct: { price: (v ?? 0) } } }))} />
                    </Field>
                  )}
                </Formula>
                <Formula
                  title="Abonnement mensuel"
                  enabled={!!o.pricing.abonnement}
                  onToggle={(on) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, abonnement: on ? { monthly: 49, months: 12 } : null } }))}
                >
                  {o.pricing.abonnement && (
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="€/mois">
                        <NumberInput decimal value={o.pricing.abonnement.monthly} min={0} onChange={(v) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, abonnement: { ...x.pricing.abonnement!, monthly: (v ?? 0) } } }))} />
                      </Field>
                      <Field label="Durée (mois)">
                        <NumberInput value={o.pricing.abonnement.months} min={0} onChange={(v) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, abonnement: { ...x.pricing.abonnement!, months: (v ?? 0) } } }))} />
                      </Field>
                    </div>
                  )}
                </Formula>
                <Formula
                  title="Mixte"
                  enabled={!!o.pricing.mixte}
                  onToggle={(on) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, mixte: on ? { upfront: 190, monthly: 29, months: 12 } : null } }))}
                >
                  {o.pricing.mixte && (
                    <div className="grid grid-cols-3 gap-2">
                      <Field label="Acompte">
                        <NumberInput decimal value={o.pricing.mixte.upfront} min={0} onChange={(v) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, mixte: { ...x.pricing.mixte!, upfront: (v ?? 0) } } }))} />
                      </Field>
                      <Field label="€/mois">
                        <NumberInput decimal value={o.pricing.mixte.monthly} min={0} onChange={(v) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, mixte: { ...x.pricing.mixte!, monthly: (v ?? 0) } } }))} />
                      </Field>
                      <Field label="Mois">
                        <NumberInput value={o.pricing.mixte.months} min={0} onChange={(v) => upd(o.id, (x) => ({ ...x, pricing: { ...x.pricing, mixte: { ...x.pricing.mixte!, months: (v ?? 0) } } }))} />
                      </Field>
                    </div>
                  )}
                </Formula>
                <Field label="Gamme affichée (facultatif)" className="md:col-span-3">
                  <input className="field" placeholder="ex. 490 € → 1 900 €" value={o.fromLabel ?? ""} onChange={(e) => upd(o.id, (x) => ({ ...x, fromLabel: e.target.value || undefined }))} />
                </Field>
                <Field label="Promesse" className="md:col-span-3">
                  <textarea className="field min-h-20" value={o.promise} onChange={(e) => upd(o.id, (x) => ({ ...x, promise: e.target.value }))} />
                </Field>
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="mt-3 text-[13px] text-ink-3 hover:text-ink" onClick={async () => (await ask("Revenir aux prix par défaut ?", { action: "Revenir aux défauts" })) && onChange(DEFAULT_SETTINGS.offers)}>
        Revenir aux prix par défaut
      </button>
    </section>
  );
}

function Formula({ title, enabled, onToggle, children }: { title: string; enabled: boolean; onToggle: (on: boolean) => void; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl p-4 ${enabled ? "bg-mist" : "border border-dashed border-line"}`}>
      <label className="flex items-center justify-between">
        <span className="text-[15px] font-semibold">{title}</span>
        <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} className="size-5 accent-[#0071e3]" />
      </label>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Cities({ cities, onChange }: { cities: string[]; onChange: (c: string[]) => void }) {
  const [v, setV] = useState("");
  return (
    <section>
      <SectionTitle kicker="Terrain" title="Villes" />
      <div className="flex flex-wrap gap-2">
        {cities.map((c) => (
          <Chip key={c} active onClick={() => onChange(cities.filter((x) => x !== c))}>
            {c} <Icon name="close" size={12} />
          </Chip>
        ))}
        {CITY_NAMES.filter((c) => !cities.includes(c)).map((c) => (
          <Chip key={c} onClick={() => onChange([...cities, c])}>
            + {c}
          </Chip>
        ))}
      </div>
      <form
        className="mt-3 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (v.trim() && !cities.includes(v.trim())) onChange([...cities, v.trim()]);
          setV("");
        }}
      >
        <input className="field" placeholder="Ajouter une ville" value={v} onChange={(e) => setV(e.target.value)} />
        <Button type="submit" variant="secondary">
          Ajouter
        </Button>
      </form>
    </section>
  );
}

function Device() {
  const { three, motion, set } = usePrefs();
  const ai = useAiEnabled();
  return (
    <section>
      <SectionTitle kicker="Cet appareil" title="Affichage" />
      <div className="space-y-3">
        <Toggle label="Éléments 3D" hint="Carte du Bassin de Thau, anneau d'objectif. Désactivez sur un vieux téléphone : une version 2D prend le relais." on={three} onChange={(v) => set({ three: v })} />
        <Toggle label="Animations" hint="Transitions et micro-interactions. Le réglage « réduire les animations » du téléphone est toujours respecté." on={motion} onChange={(v) => set({ motion: v })} />
      </div>
      <p className="mt-4 text-[14px] text-ink-2">
        API Claude : {ai ? <Tag tone="ok">branchée</Tag> : <Tag>non configurée — copier-coller vers Claude / ChatGPT</Tag>}
      </p>
    </section>
  );
}

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="flex w-full items-center justify-between gap-6 rounded-2xl bg-mist p-4 text-left" role="switch" aria-checked={on}>
      <span>
        <span className="block text-[16px] font-semibold">{label}</span>
        <span className="block text-[14px] text-ink-2">{hint}</span>
      </span>
      <span className={`relative h-8 w-[52px] shrink-0 rounded-full transition-colors ${on ? "bg-blue" : "bg-ink-3/40"}`}>
        <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[24px]" : "translate-x-1"}`} />
      </span>
    </button>
  );
}

function Exports() {
  const { rows: prospects } = useTable("prospects");
  const { nameOf } = useSession();
  const router = useRouter();
  const [pdf, setPdf] = useState("");
  function csv() {
    const cols = [
      "name", "sector", "sub_activity", "address", "city", "phone", "email", "website", "instagram", "facebook", "tiktok", "google_url",
      "google_rating", "google_reviews", "founded_year", "employees", "owner_name", "hours", "competitors", "field_notes", "disc",
      "temperature", "status", "potential_amount", "signed_amount", "next_action", "next_action_at", "assigned_to", "created_at",
    ] as const;
    const header = cols.join(";");
    const lines = prospects.map((p) =>
      cols.map((c) => csvEscape(c === "status" ? statusLabel(p.status) : c === "assigned_to" ? (p.assigned_to ? nameOf(p.assigned_to) : "") : p[c])).join(";"),
    );
    const blob = new Blob(["﻿" + [header, ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `approche-prospects-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <section>
      <SectionTitle kicker="Exports" title="Sortir les données" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line p-5">
          <p className="text-[17px] font-semibold">Prospects en CSV</p>
          <p className="mt-1 text-[14px] text-ink-2">{prospects.length} fiches, séparateur « ; », ouvrable dans Excel et Numbers.</p>
          <Button className="mt-4" onClick={csv}>
            <Icon name="download" size={16} /> Télécharger
          </Button>
        </div>
        <div className="rounded-2xl border border-line p-5">
          <p className="text-[17px] font-semibold">Fiche client en PDF</p>
          <select className="field mt-3" value={pdf} onChange={(e) => setPdf(e.target.value)} aria-label="Fiche à exporter">
            <option value="">Choisir un dossier…</option>
            {prospects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Button className="mt-3" disabled={!pdf} onClick={() => router.push(`/clients/${pdf}/imprimer`)}>
            <Icon name="printer" size={16} /> Exporter
          </Button>
        </div>
      </div>
    </section>
  );
}

function Account() {
  const { me, demo, signOut } = useSession();
  const router = useRouter();
  return (
    <section>
      <SectionTitle kicker="Compte" title={me?.display_name ?? ""} />
      <p className="text-[15px] text-ink-2">
        {me?.email} · {demo ? "mode démo (données dans ce navigateur)" : "connecté à Supabase"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={async () => (await signOut(), router.replace("/login"))}>
          <Icon name="logout" size={16} /> Se déconnecter
        </Button>
        {demo && (
          <Button variant="danger" onClick={async () => (await ask("Remettre les données de démonstration à zéro ?", { action: "Réinitialiser" })) && (resetDemoData(), toast("Données de démo réinitialisées"))}>
            Réinitialiser la démo
          </Button>
        )}
        <ButtonLink href="/methode" variant="quiet">
          Charte éthique
        </ButtonLink>
      </div>
    </section>
  );
}

function ArtifactNote() {
  return (
    <section>
      <SectionTitle kicker="Version de démonstration" title="Ce qui change ici" />
      <ul className="space-y-2 text-[15px] leading-relaxed text-ink-2">
        <li>Les données restent dans ce navigateur, sur cet appareil. Rien n&apos;est partagé avec votre associé.</li>
        <li>L&apos;export CSV et l&apos;export PDF d&apos;une fiche sont disponibles dans la version installée (Vercel + Supabase).</li>
        <li>Le mode Duo se synchronise entre deux onglets du même navigateur ; entre deux téléphones, il faut la version installée.</li>
        <li>Appel et SMS depuis l&apos;app peuvent ne pas s&apos;ouvrir ici : le numéro reste affiché, à composer à la main.</li>
      </ul>
    </section>
  );
}
