"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { PageHeader, Tag } from "@/components/ui/primitives";
import { SECTORS, getSector } from "@/content/sectors";
import { searchLibrary } from "@/lib/scripts";
import { useTable } from "@/lib/data/hooks";
import { useFavorites } from "@/lib/favorites";
import { useSettings } from "@/lib/settings";

export default function ScriptsIndex() {
  const [q, setQ] = useState("");
  const { rows: customs } = useTable("custom_scripts");
  const { favorites } = useFavorites();
  const { settings } = useSettings();
  const hits = useMemo(() => searchLibrary(q, customs), [q, customs]);
  const active = SECTORS.filter((s) => settings.activeSectors.includes(s.id));
  const inactive = SECTORS.filter((s) => !settings.activeSectors.includes(s.id));

  const favItems = favorites
    .map((f) => {
      const [sid, rest] = f.key.split("|");
      const s = getSector(sid);
      if (!s) return null;
      if (f.kind === "objection") {
        const o = s.objections.find((x) => x.id === rest);
        return o ? { href: `/scripts/${s.id}#obj-${o.id}`, label: `« ${o.objection} »`, sub: s.short } : null;
      }
      if (f.kind === "script") return { href: `/scripts/${s.id}#script-${rest}`, label: `Script ${rest === "physique" ? "terrain" : "téléphone"}`, sub: s.short };
      return { href: `/scripts/${s.id}`, label: s.name, sub: "Secteur" };
    })
    .filter(Boolean) as { href: string; label: string; sub: string }[];

  return (
    <div>
      <PageHeader
        kicker="Bibliothèque de scripts"
        title={
          <>
            {SECTORS.length} métiers. <span className="text-ink-3">Une façon de parler à chacun.</span>
          </>
        }
        lede="Réalité du métier, créneaux, scripts terrain et téléphone, questions de découverte, objections et signaux d'achat. Modifiables, duplicables, lisibles en téléprompteur."
      />

      <div className="sticky top-0 z-30 -mx-4 bg-white/85 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="relative">
          <Icon name="search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input className="field pl-10" placeholder="« mon neveu », « Planity », « saison », « trop cher »…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {q.trim().length >= 2 ? (
        <section className="mt-6">
          <p className="kicker">{hits.length} résultat{hits.length > 1 ? "s" : ""}</p>
          <ul className="mt-3 border-t border-line">
            {hits.map((h, i) => (
              <li key={i}>
                <Link href={`/scripts/${h.sector.id}${h.anchor}`} className="block border-b border-line py-4 hover:bg-mist/60">
                  <div className="flex items-center gap-2">
                    <Tag tone={h.kind === "objection" ? "blue" : "mist"}>{h.kind}</Tag>
                    <span className="text-[15px] font-semibold">{h.label}</span>
                  </div>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{h.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <>
          {favItems.length > 0 && (
            <section className="mt-8">
              <p className="kicker">Mes favoris</p>
              <div className="scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
                {favItems.map((f) => (
                  <Link key={f.href} href={f.href} className="shrink-0 rounded-2xl bg-mist px-4 py-3 hover:bg-fog">
                    <p className="max-w-[240px] truncate text-[15px] font-semibold">{f.label}</p>
                    <p className="text-[12px] text-ink-2">{f.sub}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <section className="mt-10">
            <ol className="border-t border-line">
              {[...active, ...inactive].map((s, i) => {
                const variants = customs.filter((c) => c.sector === s.id).length;
                const off = !settings.activeSectors.includes(s.id);
                return (
                  <motion.li key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
                    <Link href={`/scripts/${s.id}`} className={`group grid grid-cols-[48px_1fr_auto] items-baseline gap-3 border-b border-line py-5 md:grid-cols-[72px_1.2fr_2fr_auto] ${off ? "opacity-50" : ""}`}>
                      <span className="num text-[15px] font-medium text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[24px] font-semibold tracking-tight transition-colors group-hover:text-blue md:text-[30px]">{s.name}</span>
                      <span className="col-span-2 col-start-2 text-[15px] leading-snug text-ink-2 md:col-span-1 md:col-start-3">{s.tagline}</span>
                      <span className="row-start-1 flex items-center gap-2 justify-self-end text-[13px] text-ink-3 md:col-start-4">
                        {variants > 0 && <Tag tone="blue">{variants} perso</Tag>}
                        {s.objections.length} objections
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
