import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { messageUtilisateur, SYSTEM_PROMPT } from "./prompt.ts";
import { AnnonceSchema, normaliserAnnonce, type Annonce, type Infos, type Reglages } from "./schema.ts";

export const MODELE = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const EFFORTS = ["low", "medium", "high"] as const;
type Effort = (typeof EFFORTS)[number];
const EFFORT: Effort = (EFFORTS as readonly string[]).includes(process.env.ANTHROPIC_EFFORT ?? "")
  ? (process.env.ANTHROPIC_EFFORT as Effort)
  : "low"; // la vitesse prime : quelques secondes par annonce

// Modèles qui acceptent la relance automatique côté serveur quand un filtre
// de sécurité refuse à tort (« fallbacks: "default" »). Pour un autre modèle
// posé dans ANTHROPIC_MODEL, on n'envoie pas le paramètre.
const MODELES_AVEC_FALLBACK = new Set(["claude-sonnet-5-5", "claude-opus-5-5", "claude-opus-5", "claude-fable-5-1"]);

const TENTATIVES_MAX = 3; // 1 appel + 2 relances si la sortie est invalide

// Le format de sortie contraint le modèle à un JSON conforme au schéma.
// Les longueurs (titre, description…) ne peuvent pas être imposées par l'API :
// le SDK les retire du schéma envoyé, et on les revérifie ici avec Zod.
const FORMAT_ANNONCE = betaZodOutputFormat(AnnonceSchema);

let client: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new ErreurAnalyse("config", "ANTHROPIC_API_KEY n'est pas configurée sur le serveur.");
  client ??= new Anthropic({ maxRetries: 2, timeout: 55_000 });
  return client;
}

export type CodeErreur = "config" | "refus" | "invalide" | "surcharge" | "quota" | "cle" | "reseau" | "inconnue";

export class ErreurAnalyse extends Error {
  constructor(
    public code: CodeErreur,
    message: string,
  ) {
    super(message);
  }
}

export type Photo = { mediaType: "image/jpeg" | "image/png" | "image/webp"; base64: string };

export type ResultatAnalyse = {
  annonce: Annonce;
  meta: { modele: string; tentatives: number; dureeMs: number; tokensEntree: number; tokensSortie: number };
};

export async function analyserArticle(opts: {
  photos: Photo[];
  infos: Infos;
  reglages: Reglages;
  consigne?: string;
  precedente?: Annonce;
}): Promise<ResultatAnalyse> {
  const debut = Date.now();
  const texte = messageUtilisateur({ ...opts, nbPhotos: opts.photos.length });

  const images: Anthropic.Beta.BetaContentBlockParam[] = opts.photos.flatMap((p, i) => [
    { type: "text" as const, text: `Photo ${i + 1}${i === 0 ? " (photo de couverture)" : ""} :` },
    { type: "image" as const, source: { type: "base64" as const, media_type: p.mediaType, data: p.base64 } },
  ]);

  let correction = "";
  let maxTokens = 6000;
  let tokensEntree = 0;
  let tokensSortie = 0;

  for (let tentative = 1; tentative <= TENTATIVES_MAX; tentative++) {
    const reponse = await appeler({
      contenu: [...images, { type: "text", text: correction ? `${texte}\n\n${correction}` : texte }],
      maxTokens,
    });
    tokensEntree += reponse.usage.input_tokens;
    tokensSortie += reponse.usage.output_tokens;

    if (reponse.stop_reason === "refusal") {
      throw new ErreurAnalyse("refus", "L'analyse a été refusée pour ces photos. Essaie avec d'autres photos de l'article.");
    }

    const brut = reponse.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (reponse.stop_reason === "max_tokens") {
      maxTokens = 12000;
      correction = "Ta réponse précédente a été coupée car trop longue : sois plus concis, surtout dans la description.";
      continue;
    }

    let json: unknown;
    try {
      json = JSON.parse(brut);
    } catch {
      correction = "Ta réponse précédente n'était pas un JSON valide. Réponds uniquement avec l'objet JSON demandé.";
      continue;
    }

    const valide = AnnonceSchema.safeParse(json);
    if (valide.success) {
      return {
        annonce: normaliserAnnonce(valide.data),
        meta: { modele: reponse.model, tentatives: tentative, dureeMs: Date.now() - debut, tokensEntree, tokensSortie },
      };
    }

    const problemes = valide.error.issues
      .slice(0, 6)
      .map((i) => `- ${i.path.join(".") || "(racine)"} : ${i.message}`)
      .join("\n");
    correction = `Ta réponse précédente ne respectait pas ces contraintes, corrige-les :\n${problemes}`;
  }

  throw new ErreurAnalyse("invalide", "La réponse de l'IA était inutilisable après plusieurs essais. Relance l'analyse.");
}

async function appeler(opts: { contenu: Anthropic.Beta.BetaContentBlockParam[]; maxTokens: number }) {
  const avecFallback = MODELES_AVEC_FALLBACK.has(MODELE) && process.env.ANTHROPIC_FALLBACKS !== "off";
  try {
    return await anthropic().beta.messages.create({
      model: MODELE,
      max_tokens: opts.maxTokens,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: opts.contenu }],
      thinking: { type: "adaptive" },
      output_config: { effort: EFFORT, format: FORMAT_ANNONCE },
      ...(avecFallback ? { fallbacks: "default" as const, betas: ["server-side-fallback-2026-07-01"] } : {}),
    });
  } catch (e) {
    throw traduireErreur(e);
  }
}

function traduireErreur(e: unknown): ErreurAnalyse {
  if (e instanceof ErreurAnalyse) return e;
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    return new ErreurAnalyse("cle", "La clé API Anthropic est refusée. Vérifie ANTHROPIC_API_KEY.");
  }
  if (e instanceof Anthropic.NotFoundError) {
    return new ErreurAnalyse("config", `Le modèle « ${MODELE} » est introuvable. Vérifie ANTHROPIC_MODEL.`);
  }
  if (e instanceof Anthropic.RateLimitError) {
    return new ErreurAnalyse("quota", "Limite de l'API Anthropic atteinte. Réessaie dans une minute.");
  }
  if (e instanceof Anthropic.BadRequestError) {
    const msg = e.message.toLowerCase();
    if (msg.includes("credit") || msg.includes("billing")) {
      return new ErreurAnalyse("quota", "Crédits API épuisés. Recharge ton compte Anthropic.");
    }
    console.error("[analyse] requête refusée", e.message);
    return new ErreurAnalyse("inconnue", "La requête a été refusée par l'API. Essaie avec moins de photos.");
  }
  if (e instanceof Anthropic.InternalServerError) {
    return new ErreurAnalyse("surcharge", "Le service d'IA est surchargé. Réessaie dans quelques secondes.");
  }
  if (e instanceof Anthropic.APIConnectionError) {
    return new ErreurAnalyse("reseau", "Impossible de joindre le service d'IA. Réessaie.");
  }
  if (e instanceof Anthropic.APIError && e.status === 402) {
    return new ErreurAnalyse("quota", "Crédits API épuisés. Recharge ton compte Anthropic.");
  }
  console.error("[analyse] erreur inattendue", e);
  return new ErreurAnalyse("inconnue", "Une erreur inattendue est survenue. Réessaie.");
}
