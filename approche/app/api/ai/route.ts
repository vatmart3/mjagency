/**
 * /api/ai — pont optionnel vers l'API Claude.
 * N'existe réellement que si ANTHROPIC_API_KEY est défini : sans clé, GET
 * répond { enabled: false } et l'interface propose le copier-coller vers
 * claude.ai / ChatGPT à la place. Toute l'app fonctionne sans.
 *
 * POST { mode: "analyse", prospectId }          → analyse complète en arrière-plan (recherche web + script sur mesure)
 * POST { mode: "research", prompt }             → rapport de recherche (avec recherche web)
 * POST { mode: "chat", system, messages[] }     → réplique du prospect IA (entraînement)
 */
import Anthropic from "@anthropic-ai/sdk";
import { after, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerSupabase } from "@/lib/supabase/server";
import { aiEnabled, aiErrorMessage, claudeClient, MODEL, research, textOf } from "@/lib/claude.server";
import { runAnalysis } from "@/lib/analysis.server";

export const runtime = "nodejs";
export const maxDuration = 300;

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
  return NextResponse.json({ enabled: aiEnabled(), analyse: aiEnabled() && isSupabaseConfigured, model: aiEnabled() ? MODEL : null });
}

type ChatMessage = { role: "user" | "assistant"; content: string };
interface Body {
  mode: "analyse" | "research" | "chat";
  prospectId?: string;
  prompt?: string;
  system?: string;
  messages?: ChatMessage[];
}

export async function POST(req: Request) {
  if (!aiEnabled()) return NextResponse.json({ error: "Aucune clé API configurée." }, { status: 404 });
  if (!(await authorized())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const client = claudeClient();

  try {
    if (body.mode === "analyse") {
      if (!isSupabaseConfigured) return NextResponse.json({ error: "L'analyse automatique nécessite Supabase." }, { status: 400 });
      const id = body.prospectId;
      if (!id) return NextResponse.json({ error: "Client manquant." }, { status: 400 });
      const sb = await getServerSupabase();
      const { data: p } = await sb.from("prospects").select("id, analysis_status, analysis_at").eq("id", id).maybeSingle();
      if (!p) return NextResponse.json({ error: "Fiche introuvable." }, { status: 404 });
      const running = p.analysis_status === "en_cours" && p.analysis_at && Date.now() - new Date(p.analysis_at).getTime() < 8 * 60_000;
      if (running) return NextResponse.json({ started: false, running: true }, { status: 202 });
      await sb
        .from("prospects")
        .update({ analysis_status: "en_cours", analysis_step: "Préparation du prompt", analysis_error: null, analysis_at: new Date().toISOString() })
        .eq("id", id);
      const { data: auth } = await sb.auth.getUser();
      const { data: profile } = auth.user ? await sb.from("profiles").select("display_name").eq("id", auth.user.id).maybeSingle() : { data: null };
      // Le travail continue après la réponse : l'interface suit l'avancement en temps réel.
      after(() => runAnalysis(sb, id, profile?.display_name ?? undefined));
      return NextResponse.json({ started: true }, { status: 202 });
    }

    if (body.mode === "research") {
      if (!body.prompt || body.prompt.length > 60_000) return NextResponse.json({ error: "Prompt manquant ou trop long." }, { status: 400 });
      const text = await research(client, body.prompt);
      return NextResponse.json({ text, model: MODEL });
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
    if (err instanceof Anthropic.APIError) return NextResponse.json({ error: aiErrorMessage(err) }, { status: 502 });
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
