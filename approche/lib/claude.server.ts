/**
 * Appels à l'API Claude, côté serveur uniquement (la clé ne quitte jamais le serveur).
 */
import Anthropic from "@anthropic-ai/sdk";
import type { ScriptStep } from "@/content/types";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

/** La clé telle que collée dans Vercel, débarrassée d'éventuels espaces, guillemets ou texte autour. */
function apiKey() {
  const raw = process.env.ANTHROPIC_API_KEY ?? "";
  return raw.match(/sk-ant-[\w-]+/)?.[0] ?? raw.trim();
}
export const aiEnabled = () => Boolean(apiKey());

/** Client unique : clé nettoyée, et quelques relances de plus en cas d'indisponibilité passagère. */
export function claudeClient() {
  return new Anthropic({ apiKey: apiKey(), maxRetries: 4 });
}

/** Message d'erreur lisible dans la fiche client. */
export function aiErrorMessage(err: unknown) {
  if (err instanceof Anthropic.APIUserAbortError || err instanceof Anthropic.APIConnectionTimeoutError)
    return "La recherche a pris trop de temps : relancez l'analyse (ajouter le site web ou l'Instagram du commerce l'accélère).";
  if (err instanceof Anthropic.AuthenticationError) return "Clé API refusée : vérifiez ANTHROPIC_API_KEY sur Vercel (elle commence par sk-ant-).";
  if (err instanceof Anthropic.PermissionDeniedError) return "Cette clé API n'a pas accès au modèle demandé.";
  if (err instanceof Anthropic.RateLimitError) return "Trop de requêtes d'un coup : relancez l'analyse dans une minute.";
  if (err instanceof Anthropic.APIError) {
    const msg = err.message ?? "";
    if (err.status === 402 || /credit balance|billing/i.test(msg)) return "Crédits API épuisés : rechargez le compte sur la console Claude, puis relancez l'analyse.";
    if ((err.status ?? 0) >= 500) return `Service Claude momentanément indisponible (${err.status}) : relancez l'analyse dans quelques minutes.`;
    return `Erreur API (${err.status ?? "?"}) : ${msg}`;
  }
  return (err as Error)?.message ?? String(err);
}

/** Repli automatique vers un autre modèle si la requête est déclinée par un filtre de sécurité. */
const FALLBACK = { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } as const;

export function textOf(content: Anthropic.Beta.BetaContentBlock[]) {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/** Consignes de rythme : l'analyse doit tenir en une à deux minutes. */
const RESEARCH_SYSTEM =
  "Tu prépares une visite de prospection qui a lieu aujourd'hui : va à l'essentiel. Fais 2 à 5 recherches web ciblées (fiche Google, site, réseaux sociaux, avis), sans t'attarder, puis rédige. Rapport dense : quelques puces factuelles par section, aucune répétition, aucune introduction ni conclusion. Respecte exactement les titres de sections demandés.";

/** Recherche sur le web ; reprend le tour si l'API le met en pause. `signal` coupe au-delà du temps imparti. */
export async function research(client: Anthropic, prompt: string, signal?: AbortSignal): Promise<string> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: prompt }];
  let final: Anthropic.Beta.BetaMessage | null = null;
  for (let turn = 0; turn < 4; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      system: RESEARCH_SYSTEM,
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
          max_uses: 5,
          user_location: { type: "approximate", city: "Sète", region: "Occitanie", country: "FR", timezone: "Europe/Paris" },
        },
      ],
      messages,
      ...FALLBACK,
    } as unknown as Anthropic.Beta.MessageCreateParamsStreaming, { signal });
    final = await stream.finalMessage();
    if (final.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: final.content as Anthropic.Beta.BetaContentBlockParam[] });
  }
  if (!final) throw new Error("Aucune réponse de l'API.");
  if (final.stop_reason === "refusal") throw new Error("La recherche a été refusée par le modèle.");
  return textOf(final.content);
}

const STEP_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["titre", "objectif", "repliques", "conseil"],
  properties: {
    titre: { type: "string" },
    objectif: { type: "string" },
    repliques: { type: "array", items: { type: "string" } },
    conseil: { type: "string" },
  },
};
const SCRIPT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["physique", "telephone"],
  properties: {
    physique: { type: "array", items: STEP_SCHEMA },
    telephone: { type: "array", items: STEP_SCHEMA },
  },
};

type RawStep = { titre: string; objectif: string; repliques: string[]; conseil: string };

const toSteps = (raw: RawStep[], prefix: string): ScriptStep[] =>
  raw
    .filter((s) => s.titre?.trim() && s.repliques?.some((r) => r.trim()))
    .map((s, i) => ({
      id: `${prefix}-${i + 1}`,
      title: s.titre.trim(),
      goal: s.objectif.trim(),
      lines: s.repliques.map((r) => r.trim()).filter(Boolean),
      tip: s.conseil.trim() || undefined,
    }));

/** Rédige les deux scripts sur mesure (terrain + téléphone) en JSON structuré. */
export async function writeScripts(client: Anthropic, brief: string, signal?: AbortSignal): Promise<{ physique: ScriptStep[]; telephone: ScriptStep[] }> {
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: SCRIPT_SCHEMA } },
    system:
      "Tu es le directeur commercial de MJAGENCY, agence web et marketing digital de Sète. Tu écris des scripts de prospection oraux, en français, au vouvoiement, pour Jérémy et Matheis. Chaque réplique est une phrase qu'on dit vraiment à voix haute à ce commerçant précis : courte, naturelle, sans jargon marketing, sans flatterie creuse, sans fausse urgence ni statistique inventée.",
    messages: [{ role: "user", content: brief }],
    ...FALLBACK,
  } as unknown as Anthropic.Beta.MessageCreateParamsStreaming, { signal });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new Error("La rédaction du script a été refusée par le modèle.");
  const text = textOf(msg.content);
  let data: { physique: RawStep[]; telephone: RawStep[] };
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Le script renvoyé n'est pas lisible.");
  }
  const physique = toSteps(data.physique ?? [], "terrain");
  const telephone = toSteps(data.telephone ?? [], "tel");
  if (!physique.length || !telephone.length) throw new Error("Le script renvoyé est vide.");
  return { physique, telephone };
}
