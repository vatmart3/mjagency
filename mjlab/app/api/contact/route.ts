import { NextResponse } from "next/server";
import { activities, site } from "@/content/site";

/* =====================================================================
   /api/contact — reçoit le formulaire et l'envoie par e-mail via Resend.
   Variables d'environnement (voir README) :
     RESEND_API_KEY  clé Resend (obligatoire pour envoyer)
     CONTACT_TO      destinataire(s), séparés par des virgules
     CONTACT_FROM    expéditeur sur un domaine vérifié chez Resend
   ===================================================================== */

export const runtime = "nodejs";

type Payload = {
  activity?: string;
  idea?: string;
  budget?: string;
  delay?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  website?: string; // champ piège
};

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// limitation simple, par instance : 5 envois / 10 min / IP
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

/** Diagnostic : indique si l'envoi est configuré, sans révéler aucune valeur. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.RESEND_API_KEY),
    from: Boolean(process.env.CONTACT_FROM),
    to: Boolean(process.env.CONTACT_TO),
  });
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // robot : succès de façade, rien n'est envoyé
  if (body.website) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const data = {
    activity: clean(body.activity, 60),
    idea: typeof body.idea === "string" ? body.idea.trim().slice(0, 400) : "",
    budget: clean(body.budget, 60),
    delay: clean(body.delay, 60),
    firstName: clean(body.firstName, 80),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
  };
  if (!data.firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.idea.length < 3) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY manquante — demande non envoyée");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const activity = activities.find((a) => a.slug === data.activity)?.name ?? (data.activity === "autre" ? "Autre" : data.activity || "—");
  const to = (process.env.CONTACT_TO || site.contact.email).split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.CONTACT_FROM || "MJ LAB <onboarding@resend.dev>";
  const rows: [string, string][] = [
    ["Activité", activity],
    ["Projet", data.idea],
    ["Budget", data.budget || "—"],
    ["Délai", data.delay || "—"],
    ["Prénom", data.firstName],
    ["E-mail", data.email],
    ["Téléphone", data.phone || "—"],
  ];
  const text = rows.map(([k, v]) => `${k} : ${v}`).join("\n");
  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#252326;background:#F5F0E9;padding:24px">
<p style="font:600 22px Poppins,Arial;margin:0 0 16px">Nouveau projet — ${esc(activity)}<span style="color:#641E32">.</span></p>
<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;font:12px monospace;text-transform:uppercase;color:#641E32;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `Projet MJ LAB — ${activity} — ${data.firstName}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[contact] Resend", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (e) {
    console.error("[contact] Resend injoignable", e);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
