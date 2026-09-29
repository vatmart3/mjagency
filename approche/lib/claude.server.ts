/**
 * Appels à l'API Claude, côté serveur uniquement (la clé ne quitte jamais le serveur).
 */
import Anthropic from "@anthropic-ai/sdk";
import type { ScriptStep } from "@/content/types";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
export const aiEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

/** Repli automatique vers un autre modèle si la requête est déclinée par un filtre de sécurité. */
const FALLBACK = { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } as const;

export function textOf(content: Anthropic.Beta.BetaContentBlock[]) {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/** Recherche approfondie avec recherche web ; reprend le tour si l'API le met en pause. */
export async function research(client: Anthropic, prompt: string): Promise<string> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: prompt }];
  let final: Anthropic.Beta.BetaMessage | null = null;
  for (let turn = 0; turn < 4; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
          max_uses: 15,
          user_location: { type: "approximate", city: "Sète", region: "Occitanie", country: "FR", timezone: "Europe/Paris" },
        },
      ],
      messages,
      ...FALLBACK,
    } as unknown as Anthropic.Beta.MessageCreateParamsStreaming);
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
export async function writeScripts(client: Anthropic, brief: string): Promise<{ physique: ScriptStep[]; telephone: ScriptStep[] }> {
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high", format: { type: "json_schema", schema: SCRIPT_SCHEMA } },
    system:
      "Tu es le directeur commercial de MJAGENCY, agence web et marketing digital de Sète. Tu écris des scripts de prospection oraux, en français, au vouvoiement, pour Jérémy et Matheis. Chaque réplique est une phrase qu'on dit vraiment à voix haute à ce commerçant précis : courte, naturelle, sans jargon marketing, sans flatterie creuse, sans fausse urgence ni statistique inventée.",
    messages: [{ role: "user", content: brief }],
    ...FALLBACK,
  } as unknown as Anthropic.Beta.MessageCreateParamsStreaming);
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
