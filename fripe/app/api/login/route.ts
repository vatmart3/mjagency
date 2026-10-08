import { NextResponse } from "next/server";
import {
  COOKIE_SESSION,
  creerJeton,
  DUREE_SESSION_S,
  motDePasseConfigure,
  motDePasseCorrect,
  origineAutorisee,
} from "@/lib/auth.ts";
import { ipDe, verifierLimite } from "@/lib/rate-limit.ts";

export async function POST(req: Request) {
  if (!origineAutorisee(req)) {
    return NextResponse.json({ erreur: "Origine refusée." }, { status: 403 });
  }
  if (!motDePasseConfigure()) {
    return NextResponse.json(
      { erreur: "APP_PASSWORD n'est pas configuré sur le serveur : l'app reste verrouillée." },
      { status: 503 },
    );
  }

  // Contre le forçage du mot de passe : 8 essais par quart d'heure et par IP.
  const limite = verifierLimite(`login:${ipDe(req)}`, [{ limite: 8, dureeMs: 15 * 60_000 }]);
  if (!limite.ok) {
    return NextResponse.json(
      { erreur: `Trop d'essais. Réessaie dans ${Math.ceil(limite.reessayerDansS / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(limite.reessayerDansS) } },
    );
  }

  let motDePasse = "";
  try {
    const corps = (await req.json()) as { motDePasse?: unknown };
    if (typeof corps.motDePasse === "string") motDePasse = corps.motDePasse.slice(0, 500);
  } catch {
    // corps illisible : traité comme un mot de passe vide
  }

  if (!(await motDePasseCorrect(motDePasse))) {
    await new Promise((r) => setTimeout(r, 400)); // freine les essais en rafale
    return NextResponse.json({ erreur: "Mot de passe incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESSION, await creerJeton(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_SESSION_S,
  });
  return res;
}
