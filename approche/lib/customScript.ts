/**
 * Script sur mesure d'un client, assemblé sans IA à partir de son rapport
 * de recherche et du script de son secteur. Sert de repli quand l'API
 * Claude n'est pas branchée, et de charpente fournie à l'IA sinon.
 */
import { getSector } from "@/content/sectors";
import { profileById } from "@/content/profiles";
import { phoneScripts } from "@/content/phone-method";
import type { Channel, ScriptStep } from "@/content/types";
import type { ParsedReport, Prospect } from "@/lib/types";

const firstLines = (text: string | undefined, n: number) =>
  (text ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").replace(/\*\*/g, "").trim())
    .filter((l) => l.length > 12)
    .slice(0, n);

export function assembleScript(p: Prospect, intel: ParsedReport, channel: Channel): { title: string; steps: ScriptStep[] } {
  const sector = getSector(p.sector);
  const base = sector?.scripts[channel].steps ?? [];
  const disc = p.disc ? profileById[p.disc] : null;
  const problems = firstLines(intel.problemes, 3);
  const offer = firstLines(intel.offre, 2);
  const steps: ScriptStep[] = [];

  // 1. Entrée / ouverture du secteur (repérage du décideur, barrage…)
  const opening = channel === "telephone" ? base.slice(0, 2) : base.slice(0, 1);
  if (opening.length) steps.push(...opening.map((s) => ({ ...s, id: `base-${s.id}` })));
  else if (channel === "telephone") {
    const o = phoneScripts.find((x) => x.id === "ouverture");
    if (o) steps.push({ id: "ouverture", title: o.title, goal: o.context, lines: o.lines, tip: o.tip });
  }

  // 2. Accroche issue de la recherche
  if (intel.accroche)
    steps.push({
      id: "accroche-sur-mesure",
      title: "Accroche sur mesure",
      goal: "Montrer en une phrase que vous connaissez ce commerce.",
      lines: [intel.accroche],
      tip: disc ? `${disc.name} : ${disc.wants[0]}` : "Dites-la en regardant la personne, puis taisez-vous.",
    });

  // 3. Constat : les problèmes trouvés, formulés comme des observations
  if (problems.length)
    steps.push({
      id: "constat",
      title: "Le constat",
      goal: "Nommer un problème précis, vérifiable, sans juger.",
      lines: [
        `En préparant ma visite, j'ai remarqué une chose : ${problems[0].charAt(0).toLowerCase()}${problems[0].slice(1).replace(/\.$/, "")}.`,
        ...problems.slice(1).map((pb) => `Et aussi : ${pb.charAt(0).toLowerCase()}${pb.slice(1)}`),
        "Est-ce que c'est quelque chose que vous aviez vu ?",
      ],
      tip: "Un seul constat bien choisi vaut mieux que trois. Gardez les autres si la personne s'ouvre.",
    });

  // 4. Découverte : les questions du rapport
  if (intel.questions?.length)
    steps.push({
      id: "questions",
      title: "Les questions à poser",
      goal: "Faire parler la personne de ses vrais problèmes.",
      lines: intel.questions.slice(0, channel === "telephone" ? 3 : 5),
      tip: "Une question, puis on écoute jusqu'au bout. On note les mots exacts.",
    });

  // 5. Proposition (jamais de prix au téléphone)
  if (offer.length)
    steps.push({
      id: "proposition",
      title: channel === "telephone" ? "Ce qu'on peut faire (sans prix)" : "La proposition",
      goal: channel === "telephone" ? "Donner envie du rendez-vous, pas vendre au téléphone." : "Relier l'offre au problème qu'il vient de décrire.",
      lines:
        channel === "telephone"
          ? ["Concrètement, on a déjà une idée de ce qui pourrait vous faire gagner des clients.", "Le plus simple, c'est que je vous le montre en vingt minutes, chez vous."]
          : offer,
      tip: channel === "telephone" ? "Si on vous demande le prix : « ça dépend de ce qu'on garde, c'est justement l'objet du rendez-vous »." : undefined,
    });

  // 6. Objections probables, en embranchements
  if (intel.objections?.length)
    steps.push({
      id: "objections",
      title: "Objections probables",
      goal: "Être prêt avant qu'elles arrivent.",
      lines: ["Si une objection arrive : on accueille, on pose une question, on recadre, on propose."],
      branches: intel.objections.map((o) => ({ if: `il dit « ${o.objection} »`, then: o.reponse })),
    });

  // 7. Sortie / conclusion du secteur (RDV avec deux créneaux)
  const closing = base.slice(-1);
  steps.push(...closing.map((s) => ({ ...s, id: `base-${s.id}` })));

  return {
    title: `${p.name} — ${channel === "telephone" ? "téléphone" : "terrain"} (sur mesure)`,
    steps,
  };
}
