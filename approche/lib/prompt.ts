/**
 * Générateur de prompt de recherche approfondie, unique par entreprise.
 * Le prompt est ASSEMBLÉ à partir de la fiche, du secteur, de l'historique
 * et des réglages : chaque bloc n'apparaît que s'il a du sens pour ce commerce.
 */
import { agency } from "@/content/agency";
import { pricingSummary, type Offer } from "@/content/offers";
import { getSector } from "@/content/sectors";
import { profileById } from "@/content/profiles";
import type { Interaction, Prospect, SettingsData } from "@/lib/types";
import { statusLabel } from "@/lib/types";
import { frDate } from "@/lib/format";

/** Titres fixes : le parseur s'appuie dessus pour recoller le rapport dans la fiche. */
export const REPORT_SECTIONS = [
  { key: "synthese", title: "1. SYNTHÈSE" },
  { key: "presence", title: "2. PRÉSENCE DIGITALE ACTUELLE" },
  { key: "site", title: "3. SITE WEB" },
  { key: "reseaux", title: "4. RÉSEAUX SOCIAUX" },
  { key: "avis", title: "5. AVIS GOOGLE" },
  { key: "concurrents", title: "6. CONCURRENTS LOCAUX" },
  { key: "saisonnalite", title: "7. SAISONNALITÉ" },
  { key: "opportunites", title: "8. OPPORTUNITÉS CONCRÈTES" },
  { key: "problemes", title: "9. LES 3 PROBLÈMES DIGITAUX LES PLUS COÛTEUX" },
  { key: "offre", title: "10. OFFRE MJAGENCY RECOMMANDÉE" },
  { key: "accroche", title: "11. ACCROCHE D'OUVERTURE" },
  { key: "questions", title: "12. 5 QUESTIONS À POSER" },
  { key: "objections", title: "13. OBJECTIONS PROBABLES" },
  { key: "budget", title: "14. BUDGET RÉALISTE" },
  { key: "manquants", title: "15. INFORMATIONS NON TROUVÉES" },
] as const;

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function seasonContext(d: Date, sectorSeason?: string) {
  const m = d.getMonth();
  const phase =
    m >= 5 && m <= 7
      ? "en pleine saison estivale : le commerce est probablement débordé, les touristes représentent une part importante de la clientèle"
      : m === 8 || m === 9
        ? "en fin de saison : c'est le moment où les commerçants du littoral font le bilan de l'été et ont un peu plus de temps"
        : m >= 10 || m <= 1
          ? "en basse saison : le littoral est calme, les commerces vivent de la clientèle locale et préparent l'année"
          : "en avant-saison : les commerces préparent l'arrivée des touristes et des curistes";
  return `Nous sommes en ${MONTHS[m]} ${d.getFullYear()}, ${phase}.${sectorSeason ? ` Repère sectoriel : ${sectorSeason}` : ""}`;
}

function line(label: string, v: unknown) {
  if (v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length)) return null;
  return `- ${label} : ${v}`;
}

export interface PromptInput {
  prospect: Prospect;
  interactions: Interaction[];
  settings: SettingsData;
  authorName?: string;
  now?: Date;
}

export function buildResearchPrompt({ prospect: p, interactions, settings, authorName, now = new Date() }: PromptInput): string {
  const sector = getSector(p.sector);
  const sectorName = sector?.name ?? p.sector;
  const out: string[] = [];

  /* 1 — Rôle et contexte agence */
  out.push(
    `Tu es un analyste en marketing digital local, missionné par ${agency.name}, agence web et marketing digital basée à ${agency.base}. ` +
      `Tu prépares le dossier de prospection d'un commerce que ${authorName ?? "l'un des associés"} va rencontrer. ` +
      `Fais une recherche approfondie sur le web (Google, Google Maps, réseaux sociaux, annuaires, plateformes du secteur) et rédige un rapport factuel, sourcé et directement exploitable sur le terrain.`,
  );
  out.push("");
  out.push("## QUI NOUS SOMMES");
  out.push(`${agency.name} — ${agency.positioning}`);
  out.push(`Zone : ${agency.zone.join(", ")}.`);
  out.push(`Notre ton : ${agency.tone}`);
  out.push(`Ce que nous vendons :`);
  const offers: Offer[] = settings.offers;
  for (const o of offers) out.push(`- ${o.name} : ${o.promise} Tarifs actuels : ${pricingSummary(o)}.`);

  /* 2 — La cible */
  out.push("");
  out.push(`## L'ENTREPRISE À ANALYSER : ${p.name.toUpperCase()}`);
  const known = [
    line("Nom", p.name),
    line("Secteur", sectorName + (p.sub_activity ? ` — ${p.sub_activity}` : "")),
    line("Adresse", [p.address, p.city].filter(Boolean).join(", ")),
    line("Téléphone", p.phone),
    line("Email", p.email),
    line("Site web", p.website),
    line("Instagram", p.instagram),
    line("Facebook", p.facebook),
    line("TikTok", p.tiktok),
    line("Fiche Google", p.google_url),
    p.google_rating !== null ? line("Note Google relevée", `${String(p.google_rating).replace(".", ",")} / 5${p.google_reviews !== null ? ` sur ${p.google_reviews} avis` : ""}`) : line("Nombre d'avis Google", p.google_reviews),
    line("Création", p.founded_year ? `${p.founded_year} (${now.getFullYear() - p.founded_year} ans d'activité)` : null),
    line("Taille", p.employees !== null ? `${p.employees} salarié${p.employees > 1 ? "s" : ""}` : null),
    line("Dirigeant", p.owner_name),
    line("Horaires", p.hours),
    line("Concurrents connus", p.competitors),
    line("Observations terrain", p.field_notes),
    line("Profil comportemental détecté", p.disc ? `${profileById[p.disc].name} — ${profileById[p.disc].tagline}` : null),
    line("Température actuelle", p.temperature),
    line("Étape dans notre pipeline", statusLabel(p.status)),
  ].filter(Boolean);
  out.push(...(known as string[]));

  /* 3 — Historique */
  const hist = [...interactions].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6);
  if (hist.length) {
    out.push("");
    out.push("## CE QUI S'EST DÉJÀ PASSÉ AVEC EUX");
    for (const i of hist) {
      const bits = [
        frDate(i.created_at),
        i.channel === "physique" ? "visite" : i.channel === "telephone" ? "appel" : i.channel,
        i.outcome && i.outcome !== "visite" ? i.outcome.replace(/_/g, " ") : null,
        i.objection ? `objection : « ${i.objection} »` : null,
        i.interest ? `intérêt ${i.interest}/5` : null,
        i.notes,
      ].filter(Boolean);
      out.push(`- ${bits.join(" · ")}`);
    }
    out.push("Tiens compte de ces échanges : ne propose pas une approche qui a déjà échoué, rebondis sur les objections déjà exprimées.");
  }

  /* 4 — Contexte du moment */
  out.push("");
  out.push("## CONTEXTE");
  out.push(seasonContext(now, sector?.timing.seasonNote));
  if (sector) {
    out.push(`Douleurs typiques du secteur à vérifier chez eux (ne les affirme que si tu trouves des indices) : ${sector.reality.pains.slice(0, 5).join(" ; ")}.`);
    if (sector.compliance) out.push(`Contraintes réglementaires du secteur à respecter dans tes recommandations : ${sector.compliance}`);
  }

  /* 5 — Hypothèses tirées de la fiche */
  const hyp: string[] = [];
  if (!p.website) hyp.push("Aucun site n'est renseigné. Vérifie s'il existe un site (y compris une vieille page ou un sous-domaine de réseau/franchise) ; s'il n'y en a pas, analyse leur présence uniquement via Google et les réseaux, et estime ce qu'un site leur apporterait concrètement.");
  else hyp.push(`Ouvre ${p.website} et teste-le comme un client pressé sur téléphone : temps d'affichage perçu, lisibilité, bouton d'appel, itinéraire, horaires à jour, informations clés en moins de 5 secondes, année du copyright, mentions légales, HTTPS.`);
  if (!p.instagram && !p.facebook && !p.tiktok) hyp.push("Aucun réseau social renseigné : cherche-les (nom du commerce + ville) et dis clairement s'ils n'existent pas.");
  if (p.instagram || p.facebook) hyp.push("Pour chaque réseau trouvé : date du dernier post, fréquence sur les 3 derniers mois, type de contenus, engagement moyen (likes/commentaires), cohérence visuelle.");
  if (p.google_reviews !== null && p.google_reviews < 30) hyp.push(`Le volume d'avis semble faible (${p.google_reviews}) : compare avec les 3 concurrents les plus proches et dis si c'est un frein visible.`);
  if (p.google_rating !== null && p.google_rating < 4.3) hyp.push(`La note (${String(p.google_rating).replace(".", ",")}) mérite une analyse fine : thèmes des avis négatifs récents, et le gérant y répond-il ?`);
  if (p.google_rating !== null && p.google_rating >= 4.6) hyp.push("La note est excellente : cherche comment elle pourrait être mieux exploitée (site, réseaux, vitrine) — c'est un argument de vente pour eux.");
  if (p.founded_year && now.getFullYear() - p.founded_year >= 20) hyp.push("Entreprise ancienne : cherche une éventuelle reprise récente ou transmission (nouveau gérant, changement de nom), souvent un moment où l'on modernise son image.");
  if (p.founded_year && now.getFullYear() - p.founded_year <= 3) hyp.push("Entreprise récente : cherche comment elle s'est lancée (ouverture, travaux, presse locale) et ce qui manque encore à sa visibilité.");
  if (p.competitors) hyp.push(`Concurrents cités sur le terrain : ${p.competitors}. Identifie-les précisément et compare leur présence digitale point par point.`);
  if (p.field_notes) hyp.push("Les observations terrain ci-dessus sont fiables : appuie-toi dessus et cherche en ligne ce qui les confirme ou les nuance.");
  out.push("");
  out.push("## POINTS À VÉRIFIER EN PRIORITÉ");
  hyp.forEach((h) => out.push(`- ${h}`));

  /* 6 — Questions sectorielles */
  if (sector) {
    out.push("");
    out.push(`## QUESTIONS SPÉCIFIQUES AU SECTEUR (${sector.name.toUpperCase()})`);
    out.push(`Plateformes à vérifier : ${sector.research.platforms.join(", ")}.`);
    sector.research.questions.forEach((q) => out.push(`- ${q}`));
  } else {
    out.push("");
    out.push("## QUESTIONS SPÉCIFIQUES AU SECTEUR");
    out.push(`Secteur hors bibliothèque (${p.sector}) : identifie toi-même les plateformes et annuaires propres à ce métier, et comment les clients choisissent ce type de prestataire.`);
  }

  /* 7 — Infos manquantes */
  const missing = [
    !p.address && "l'adresse exacte",
    !p.phone && "le téléphone",
    !p.email && "l'email",
    !p.owner_name && "le nom du dirigeant",
    !p.hours && "les horaires",
    p.google_rating === null && "la note et le nombre d'avis Google",
    !p.founded_year && "l'année de création (Pappers, Societe.com, annuaire des entreprises)",
    p.employees === null && "la taille de l'équipe",
    !p.google_url && "le lien de la fiche Google",
  ].filter(Boolean) as string[];
  if (missing.length) {
    out.push("");
    out.push("## INFORMATIONS MANQUANTES À TROUVER");
    out.push(`Trouve si possible : ${missing.join(", ")}. Indique la source. Si tu ne trouves pas, dis-le dans la section 15 au lieu d'inventer.`);
  }

  /* 8 — Analyse demandée */
  out.push("");
  out.push("## ANALYSE DEMANDÉE");
  out.push("- Présence digitale actuelle : où les trouve-t-on, et qu'y voit-on en premier ?");
  out.push("- Qualité du site : vitesse perçue, rendu mobile, référencement local (titre, ville, métier, fiche Google liée), design, appels à l'action.");
  out.push("- Réseaux : fréquence, engagement, types de contenus, dernière publication.");
  out.push("- Avis Google : thèmes positifs et négatifs récurrents (cite 2-3 extraits courts), taux et ton des réponses du gérant.");
  out.push(`- 3 concurrents locaux (même métier, ${p.city ?? "même ville"} et alentours) : note, nombre d'avis, site, réseaux, ce qu'ils font mieux ou moins bien.`);
  out.push("- Saisonnalité : comment l'activité varie dans l'année, et ce que cela implique pour le calendrier d'une action digitale.");
  out.push("- Opportunités concrètes et chiffrables sans inventer (ex. : « aucune photo depuis 2021 », « horaires faux le dimanche », « 14 avis sans réponse »).");

  /* 9 — Format imposé */
  out.push("");
  out.push("## FORMAT DE SORTIE — OBLIGATOIRE");
  out.push("Réponds en français, sans introduction ni conclusion, en utilisant EXACTEMENT ces titres de niveau 2, dans cet ordre (l'application découpe ton rapport sur ces titres) :");
  REPORT_SECTIONS.forEach((s) => out.push(`## ${s.title}`));
  out.push("");
  out.push("Consignes par section :");
  out.push("- 1 : 4 lignes maximum, l'essentiel à savoir avant d'entrer.");
  out.push("- 9 : exactement 3 problèmes, du plus coûteux au moins coûteux, chacun avec ce qu'il fait perdre concrètement (clients, temps, image).");
  out.push("- 10 : une offre principale + éventuellement une offre d'entrée, avec la formule de paiement la plus adaptée (direct / abonnement / mixte) et le prix tiré de notre grille ci-dessus. Justifie en 3 lignes.");
  out.push(`- 11 : une accroche orale de 2 phrases maximum, au vouvoiement, personnalisée avec un fait précis trouvé pendant la recherche${p.owner_name ? `, adressée à ${p.owner_name}` : ""}. Aucune flatterie creuse.`);
  out.push("- 12 : exactement 5 questions ouvertes, numérotées 1. à 5., qui font parler le gérant de ses vrais problèmes (méthode SPIN).");
  out.push("- 13 : exactement 3 objections probables, chacune au format :");
  out.push("  - Objection : « … »");
  out.push("    Réponse : … (accueillir, questionner, recadrer, proposer — en 3 phrases orales)");
  out.push("- 14 : une fourchette réaliste en euros et une phrase qui la justifie (taille, moyens apparents, saison).");
  out.push("- 15 : liste de ce que tu n'as pas pu vérifier.");
  out.push("");
  out.push("Règles : aucune statistique inventée, aucune supposition présentée comme un fait (écris « probablement » ou « à vérifier sur place »), cite tes sources (URL) en fin de section quand c'est possible. Si tu ne trouves pas l'entreprise, dis-le en section 1 et base-toi sur les informations fournies.");

  return out.join("\n");
}
