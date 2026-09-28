/**
 * /api/ai — pont optionnel vers l'API Claude.
 * N'existe réellement que si ANTHROPIC_API_KEY est défini : sans clé, GET
 * répond { enabled: false } et l'interface propose le copier-coller vers
 * claude.ai / ChatGPT à la place. Toute l'app fonctionne sans.
 *
 * POST { mode: "research", prompt }                 → rapport de recherche (avec recherche web)
 * POST { mode: "chat", system, messages[] }         → réplique du prospect IA (entraînement)
 */
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
const enabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

async function authorized(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Mode démo : autorisé en local, refusé en production sauf choix explicite.
    return process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_AI === "1";
  }
  const sb = await getServerSupabase();
  const { data } = await sb.auth.getUser();
  if (!data.user) return false;
  const { data: ok } = await sb.rpc("is_associate");
  return ok === true;
}

export async function GET() {
  return NextResponse.json({ enabled: enabled(), model: enabled() ? MODEL : null });
}

type ChatMessage = { role: "user" | "assistant"; content: string };
interface Body {
  mode: "research" | "chat";
  prompt?: string;
  system?: string;
  messages?: ChatMessage[];
}

function textOf(content: Anthropic.Beta.BetaContentBlock[]) {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

export async function POST(req: Request) {
  if (!enabled()) return NextResponse.json({ error: "Aucune clé API configurée." }, { status: 404 });
  if (!(await authorized())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    if (body.mode === "research") {
      if (!body.prompt || body.prompt.length > 60_000) return NextResponse.json({ error: "Prompt manquant ou trop long." }, { status: 400 });
      const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: body.prompt }];
      let final: Anthropic.Beta.BetaMessage | null = null;
      // La recherche web tourne côté serveur ; on reprend si l'API met le tour en pause.
      for (let turn = 0; turn < 4; turn++) {
        const stream = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 32000,
          thinking: { type: "adaptive" },
          output_config: { effort: "high" },
          betas: ["server-side-fallback-2026-07-01"],
          tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 15, user_location: { type: "approximate", city: "Sète", region: "Occitanie", country: "FR", timezone: "Europe/Paris" } }],
          messages,
          // Repli automatique sur un autre modèle si la requête est déclinée par un filtre de sécurité.
          fallbacks: "default",
        } as unknown as Anthropic.Beta.MessageCreateParamsStreaming);
        final = await stream.finalMessage();
        if (final.stop_reason !== "pause_turn") break;
        messages.push({ role: "assistant", content: final.content as Anthropic.Beta.BetaContentBlockParam[] });
      }
      if (!final) throw new Error("Aucune réponse.");
      if (final.stop_reason === "refusal") return NextResponse.json({ error: "La recherche a été refusée par le modèle." }, { status: 422 });
      return NextResponse.json({ text: textOf(final.content), model: final.model });
    }

    if (body.mode === "chat") {
      const msgs = (body.messages ?? []).filter((m) => m.content?.trim()).slice(-40);
      if (!body.system || !msgs.length || msgs[0].role !== "user") return NextResponse.json({ error: "Conversation invalide." }, { status: 400 });
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 2000,
        thinking: { type: "adaptive" },
        output_config: { effort: "low" },
        betas: ["server-side-fallback-2026-07-01"],
        system: body.system,
        messages: msgs,
        fallbacks: "default",
      } as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming);
      if (response.stop_reason === "refusal") return NextResponse.json({ error: "Réponse refusée par le modèle." }, { status: 422 });
      return NextResponse.json({ text: textOf(response.content) });
    }

    return NextResponse.json({ error: "Mode inconnu." }, { status: 400 });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute." }, { status: 429 });
    if (err instanceof Anthropic.AuthenticationError) return NextResponse.json({ error: "Clé API invalide." }, { status: 500 });
    if (err instanceof Anthropic.APIError) return NextResponse.json({ error: `Erreur API (${err.status ?? "?"}) : ${err.message}` }, { status: 502 });
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
