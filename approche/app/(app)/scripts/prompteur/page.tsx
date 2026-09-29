"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { Segmented } from "@/components/ui/primitives";
import { Teleprompter } from "@/components/Teleprompter";
import { getSector } from "@/content/sectors";
import { phoneScripts } from "@/content/phone-method";
import type { Channel } from "@/content/types";
import { useTable } from "@/lib/data/hooks";
import { effectiveScript, prospectScript, stepsToSections, type PrompterSection } from "@/lib/scripts";
import { useSession } from "@/lib/session";
import { fillPlaceholders } from "@/lib/format";
import { useRouter } from "next/navigation";

function Prompteur() {
  const params = useSearchParams();
  const router = useRouter();
  const { rows: customs } = useTable("custom_scripts");
  const { rows: prospects } = useTable("prospects");
  const { me } = useSession();
  const prospectId = params.get("prospect");
  const prospect = prospects.find((p) => p.id === prospectId);
  const sectorId = params.get("secteur") ?? prospect?.sector ?? null;
  const channel = (params.get("canal") as Channel) ?? "physique";
  const customId = params.get("custom");
  const phoneId = params.get("phone");
  const sector = getSector(sectorId);

  const { title, sections } = useMemo((): { title: string; sections: PrompterSection[] } => {
    if (phoneId) {
      const ps = phoneScripts.find((x) => x.id === phoneId);
      return ps ? { title: ps.title, sections: [{ title: ps.title, lines: ps.lines, tip: ps.tip }] } : { title: "", sections: [] };
    }
    if (customId) {
      const c = customs.find((x) => x.id === customId);
      return c ? { title: c.title, sections: stepsToSections(c.steps) } : { title: "", sections: [] };
    }
    // Client avec un script sur mesure : c'est lui qu'on lit
    const own = prospectScript(prospect?.id, channel, customs);
    if (own) return { title: `${prospect!.name} · sur mesure`, sections: stepsToSections(own.steps) };
    const out: PrompterSection[] = [];
    if (prospect?.intel?.accroche) out.push({ title: "Accroche personnalisée", lines: [prospect.intel.accroche] });
    if (prospect?.intel?.questions?.length) out.push({ title: "Questions à poser", lines: prospect.intel.questions });
    if (sector) out.push(...stepsToSections(effectiveScript(sector, channel, customs).script.steps));
    return { title: prospect ? prospect.name : sector ? `${sector.short} · ${channel === "physique" ? "terrain" : "téléphone"}` : "", sections: out };
  }, [phoneId, customId, customs, prospect, sector, channel]);

  const vars = {
    prenom: me?.display_name,
    commerce: prospect?.name,
    dirigeant: prospect?.owner_name ?? undefined,
    ville: prospect?.city ?? undefined,
  };
  const filled = sections.map((s) => ({ ...s, lines: s.lines.map((l) => fillPlaceholders(l, vars)) }));

  return (
    <div className="flex flex-col pt-6" style={{ height: "calc(100dvh - var(--dock-h) - env(safe-area-inset-bottom) - 28px)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="grid size-10 place-items-center rounded-full bg-mist" aria-label="Retour">
            <Icon name="back" size={18} />
          </button>
          <div>
            <p className="kicker">Téléprompteur</p>
            <p className="text-[18px] font-semibold tracking-tight">{title || "Choisissez un script"}</p>
          </div>
        </div>
        {sector && !customId && !phoneId && (
          <Segmented
            size="sm"
            value={channel}
            onChange={(c) => {
              const q = new URLSearchParams(params.toString());
              q.set("canal", c);
              router.replace(`/scripts/prompteur?${q.toString()}`);
            }}
            options={[
              { value: "physique", label: "Terrain" },
              { value: "telephone", label: "Téléphone" },
            ]}
          />
        )}
      </div>
      {filled.length ? (
        <div className="min-h-0 flex-1">
          <Teleprompter key={`${title}-${channel}`} sections={filled} />
        </div>
      ) : (
        <p className="pt-10 text-ink-2">
          Aucun script trouvé.{" "}
          <Link href="/scripts" className="text-blue">
            Ouvrir la bibliothèque
          </Link>
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Prompteur />
    </Suspense>
  );
}
