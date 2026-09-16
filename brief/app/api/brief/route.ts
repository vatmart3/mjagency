import { NextResponse } from "next/server";
import { Resend } from "resend";
import { agencyEmail, clientEmail } from "@/lib/email";
import { MAX_FILES, MAX_TOTAL_BYTES, briefSchema, checkFiles } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.BRIEF_TO_EMAIL || "jeremyvatuonepro@gmail.com";
/** Tant que le domaine n'est pas vérifié chez Resend, on part de l'adresse de test. */
const FROM = process.env.BRIEF_FROM_EMAIL || "MJAGENCY <onboarding@resend.dev>";

/* ── Garde-fou : quelques envois par adresse IP, pas davantage ────────── */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    // Ménage : l'instance serverless ne doit pas enfler indéfiniment.
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "inconnue";

  if (rateLimited(ip)) {
    return fail("Trop d'envois depuis cette connexion. Réessayez dans quelques minutes.", 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Requête illisible.", 400);
  }

  const raw = form.get("payload");
  if (typeof raw !== "string") return fail("Brief manquant.", 400);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail("Brief illisible.", 400);
  }

  const result = briefSchema.safeParse(parsed);
  if (!result.success) {
    const first = result.error.issues[0];
    return fail(
      first ? `${first.path.join(".") || "formulaire"} : ${first.message}` : "Brief incomplet.",
      400,
    );
  }
  const values = result.data;

  // Piège à robots : on répond « c'est envoyé » sans rien envoyer.
  if (values.website && values.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  /* Pièces jointes */
  const uploads = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (uploads.length > MAX_FILES) return fail("Trois fichiers au maximum.", 400);
  const problem = checkFiles(uploads.map((f) => ({ name: f.name, type: f.type, size: f.size })));
  if (problem) return fail(problem, 400);
  const total = uploads.reduce((n, f) => n + f.size, 0);
  if (total > MAX_TOTAL_BYTES) return fail("4 Mo au total, pas plus.", 413);

  const attachments = await Promise.all(
    uploads.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()),
    })),
  );

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[brief] RESEND_API_KEY absente : impossible d'envoyer le brief.");
    return fail("L'envoi est momentanément indisponible. Écrivez-nous à mjagency.officiel@gmail.com.", 500);
  }

  const resend = new Resend(apiKey);
  const agency = agencyEmail(values, uploads.map((f) => f.name));
  const client = clientEmail(values);

  // L'email de l'agence d'abord : c'est lui qui ne doit jamais se perdre.
  const sent = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: values.email,
    subject: agency.subject,
    html: agency.html,
    text: agency.text,
    attachments,
  });

  if (sent.error) {
    console.error("[brief] envoi agence refusé :", sent.error);
    return fail("L'envoi a échoué. Réessayez, ou écrivez-nous à mjagency.officiel@gmail.com.", 502);
  }

  // La confirmation du client ne doit jamais faire échouer le brief.
  try {
    const confirmation = await resend.emails.send({
      from: FROM,
      to: values.email,
      replyTo: TO,
      subject: client.subject,
      html: client.html,
      text: client.text,
    });
    if (confirmation.error) {
      console.error("[brief] confirmation client refusée :", confirmation.error);
    }
  } catch (err) {
    console.error("[brief] confirmation client en échec :", err);
  }

  return NextResponse.json({ ok: true, id: sent.data?.id ?? null });
}

export function GET() {
  return fail("Méthode non autorisée.", 405);
}
