/**
 * Analyse automatique d'un nouveau client, exécutée côté serveur après la réponse HTTP :
 *   1. prompt de recherche unique (fiche + secteur + historique + prix)
 *   2. recherche approfondie sur le web par Claude → rapport rangé dans la fiche
 *   3. rédaction d'un script terrain et d'un script téléphone uniques
 * L'avancement est écrit dans prospects.analysis_status / analysis_step :
 * l'interface le suit en temps réel, même si l'utilisateur change de page.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildResearchPrompt } from "@/lib/prompt";
import { parseReport } from "@/lib/report";
import { assembleScript } from "@/lib/customScript";
import { mergeSettings, pricingOfOffers } from "@/lib/settings-core";
import { aiErrorMessage, claudeClient, research, writeScripts } from "@/lib/claude.server";
import { getSector } from "@/content/sectors";
import { profileById } from "@/content/profiles";
import type { Interaction, Prospect, SettingsData } from "@/lib/types";

async function step(sb: SupabaseClient, id: string, label: string) {
  await sb.from("prospects").update({ analysis_step: label }).eq("id", id);
}

function outline(steps: { title: string; lines: string[] }[]) {
  return steps.map((s, i) => `${i + 1}. ${s.title}\n${s.lines.map((l) => `   - ${l}`).join("\n")}`).join("\n");
}

function scriptBrief(p: Prospect, reportRaw: string, settings: SettingsData) {
  const sector = getSector(p.sector);
  const disc = p.disc ? profileById[p.disc] : null;
  const intel = parseReport(reportRaw);
  const draftTerrain = assembleScript(p, intel, "physique");
  const draftTel = assembleScript(p, intel, "telephone");
  return [
    `Écris deux scripts de prospection uniques pour ce commerce : un pour la visite en boutique (« physique ») et un pour l'appel (« telephone »).`,
    "",
    "## LE COMMERCE",
    `Nom : ${p.name}`,
    `Secteur : ${sector?.name ?? p.sector}${p.sub_activity ? ` (${p.sub_activity})` : ""}`,
    `Ville : ${p.city ?? "inconnue"}${p.address ? `, ${p.address}` : ""}`,
    `Dirigeant : ${p.owner_name ?? "inconnu (faire demander « le ou la gérant(e) »)"}`,
    p.field_notes ? `Observations terrain : ${p.field_notes}` : "",
    disc ? `Profil détecté : ${disc.name} — ${disc.tagline} Ce qu'il veut entendre : ${disc.wants.join(" ; ")}. À éviter : ${disc.avoid.join(" ; ")}.` : "Profil comportemental : inconnu.",
    "",
    "## RAPPORT DE RECHERCHE (source principale, ne rien inventer au-delà)",
    reportRaw.slice(0, 24000),
    "",
    "## NOS OFFRES ET PRIX ACTUELS",
    pricingOfOffers(settings),
    "",
    "## CHARPENTE DE DÉPART (à réécrire entièrement pour ce commerce)",
    "Terrain :",
    outline(draftTerrain.steps),
    "",
    "Téléphone :",
    outline(draftTel.steps),
    "",
    "## CONSIGNES",
    "- « physique » : 6 à 8 étapes. Entrée et repérage du décideur (le demander par son nom si on le connaît) ; accroche de 10 secondes appuyée sur un fait précis du rapport ; constat personnalisé ; 3 à 5 questions qui font parler ; proposition reliée au problème qu'il aura exprimé (offre recommandée, formule de paiement adaptée, prix possible en face à face) ; réponses aux objections probables ; sortie avec un micro-engagement (RDV avec deux créneaux précis, ou audit gratuit).",
    "- « telephone » : 6 à 8 étapes. Ouverture ; passage du barrage adapté à ce commerce ; accroche ; 2 ou 3 questions courtes ; proposition de rendez-vous avec deux créneaux précis adaptés aux horaires du métier ; objections probables ; conclusion et confirmation. JAMAIS de prix au téléphone : on vend le rendez-vous.",
    "- Chaque étape : un titre court, un objectif en une phrase, 2 à 5 répliques à dire telles quelles, un conseil de posture (ou chaîne vide).",
    disc ? `- Adapte le ton et le rythme au profil ${disc.name}.` : "- Ton chaleureux et direct, rythme posé.",
    "- Utilise le vrai nom du commerce et du dirigeant. Le seul espace réservé autorisé est {prenom} (le prénom du vendeur).",
    "- Aucune statistique inventée, aucune fausse urgence. Si une information manque, formule une question plutôt qu'une affirmation.",
  ]
    .filter((l) => l !== "")
    .join("\n");
}

/**
 * Vercel coupe la fonction à 300 s. On garde de la marge : la recherche a
 * 190 s au plus, le script le temps qui reste (sinon, assemblage automatique).
 */
const RESEARCH_BUDGET_MS = 190_000;
const TOTAL_BUDGET_MS = 270_000;

export async function runAnalysis(sb: SupabaseClient, prospectId: string, authorName?: string) {
  const client = claudeClient();
  const startedAt = Date.now();
  try {
    const [{ data: p }, { data: inter }, { data: settingsRow }, { data: prompts }] = await Promise.all([
      sb.from("prospects").select("*").eq("id", prospectId).single(),
      sb.from("interactions").select("*").eq("prospect_id", prospectId),
      sb.from("app_settings").select("data").eq("id", 1).maybeSingle(),
      sb.from("research_prompts").select("version").eq("prospect_id", prospectId).order("version", { ascending: false }).limit(1),
    ]);
    if (!p) throw new Error("Fiche introuvable.");
    const prospect = p as Prospect;
    const settings = mergeSettings(settingsRow?.data ?? {});

    // 1. Prompt unique, versionné
    const prompt = buildResearchPrompt({ prospect, interactions: (inter ?? []) as Interaction[], settings, authorName });
    const { data: promptRow } = await sb
      .from("research_prompts")
      .insert({ prospect_id: prospectId, version: (prompts?.[0]?.version ?? 0) + 1, prompt })
      .select("id")
      .single();

    // 2. Recherche approfondie
    await step(sb, prospectId, "Recherche sur le web");
    const raw = await research(client, prompt, AbortSignal.timeout(RESEARCH_BUDGET_MS));
    const parsed = parseReport(raw);
    if (parsed.found.length < 3) throw new Error("Le rapport de recherche est inexploitable (titres manquants).");
    await sb.from("research_reports").insert({ prospect_id: prospectId, prompt_id: promptRow?.id ?? null, raw, parsed, source: "api" });
    await sb.from("prospects").update({ intel: parsed, hook: parsed.accroche ?? prospect.hook, analysis_step: "Rédaction du script sur mesure" }).eq("id", prospectId);

    // 3. Scripts uniques (repli : assemblage automatique si la rédaction échoue)
    const enriched = { ...prospect, intel: parsed };
    let scripts: { physique: ReturnType<typeof assembleScript>["steps"]; telephone: ReturnType<typeof assembleScript>["steps"] };
    try {
      const left = TOTAL_BUDGET_MS - (Date.now() - startedAt);
      if (left < 15_000) throw new Error("Plus le temps de rédiger : assemblage automatique.");
      scripts = await writeScripts(client, scriptBrief(enriched, raw, settings), AbortSignal.timeout(left));
    } catch {
      scripts = { physique: assembleScript(enriched, parsed, "physique").steps, telephone: assembleScript(enriched, parsed, "telephone").steps };
    }
    await sb.from("custom_scripts").delete().eq("prospect_id", prospectId);
    await sb.from("custom_scripts").insert([
      { sector: prospect.sector, channel: "physique", base_key: null, prospect_id: prospectId, title: `${prospect.name} — terrain (sur mesure)`, steps: scripts.physique },
      { sector: prospect.sector, channel: "telephone", base_key: null, prospect_id: prospectId, title: `${prospect.name} — téléphone (sur mesure)`, steps: scripts.telephone },
    ]);

    await sb.from("prospects").update({ analysis_status: "fait", analysis_step: null, analysis_error: null, analysis_at: new Date().toISOString() }).eq("id", prospectId);
  } catch (err) {
    await sb
      .from("prospects")
      .update({ analysis_status: "erreur", analysis_step: null, analysis_error: aiErrorMessage(err).slice(0, 300) })
      .eq("id", prospectId);
  }
}
