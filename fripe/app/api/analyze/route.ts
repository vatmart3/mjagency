import { NextResponse } from "next/server";
import { COOKIE_SESSION, jetonValide, origineAutorisee } from "@/lib/auth.ts";
import { analyserArticle, ErreurAnalyse, type Photo } from "@/lib/claude.ts";
import { ipDe, verifierLimite } from "@/lib/rate-limit.ts";
import { AnnonceSchema, ConsigneSchema, InfosSchema, ReglagesSchema } from "@/lib/schema.ts";
import { PHOTOS_MAX, PHOTOS_MIN } from "@/lib/vinted.ts";

export const runtime = "nodejs";
export const maxDuration = 60;

const TYPES_ACCEPTES = new Set(["image/jpeg", "image/png", "image/webp"]);
const TAILLE_MAX_PHOTO = 4 * 1024 * 1024; // une photo compressée côté client pèse ~300 Ko

const STATUTS: Record<ErreurAnalyse["code"], number> = {
  config: 500,
  cle: 502,
  refus: 422,
  invalide: 502,
  surcharge: 503,
  quota: 429,
  reseau: 504,
  inconnue: 500,
};

function erreur(message: string, status: number, code = "requete", headers?: HeadersInit) {
  return NextResponse.json({ erreur: message, code }, { status, headers });
}

export async function POST(req: Request) {
  // Le proxy filtre déjà ; on revérifie ici pour que la route ne dépende
  // jamais d'une configuration de matcher.
  const cookie = req.headers.get("cookie") ?? "";
  const jeton = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_SESSION}=`))
    ?.slice(COOKIE_SESSION.length + 1);
  if (!(await jetonValide(jeton))) return erreur("Session expirée. Reconnecte-toi.", 401, "auth");
  if (!origineAutorisee(req)) return erreur("Origine refusée.", 403);

  const limite = verifierLimite(`analyse:${ipDe(req)}`, [
    { limite: Number(process.env.RATE_LIMIT_PER_MINUTE) || 6, dureeMs: 60_000 },
    { limite: Number(process.env.RATE_LIMIT_PER_DAY) || 150, dureeMs: 24 * 3600_000 },
  ]);
  if (!limite.ok) {
    return erreur(
      `Doucement ! Réessaie dans ${limite.reessayerDansS} s.`,
      429,
      "limite",
      { "Retry-After": String(limite.reessayerDansS) },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return erreur("Envoi illisible. Réessaie.", 400);
  }

  const fichiers = form.getAll("photos").filter((f): f is File => f instanceof File);
  if (fichiers.length < PHOTOS_MIN || fichiers.length > PHOTOS_MAX) {
    return erreur(`Ajoute entre ${PHOTOS_MIN} et ${PHOTOS_MAX} photos.`, 400);
  }

  const photos: Photo[] = [];
  for (const f of fichiers) {
    if (!TYPES_ACCEPTES.has(f.type)) return erreur("Format de photo non pris en charge (JPEG, PNG ou WebP).", 415);
    if (f.size > TAILLE_MAX_PHOTO) return erreur("Une photo est trop lourde.", 413);
    photos.push({
      mediaType: f.type as Photo["mediaType"],
      base64: Buffer.from(await f.arrayBuffer()).toString("base64"),
    });
  }

  const infos = InfosSchema.safeParse(lireJson(form.get("infos")));
  const reglages = ReglagesSchema.safeParse(lireJson(form.get("reglages")));
  const consigne = ConsigneSchema.safeParse(form.get("consigne") ?? undefined);
  const brutPrecedente = form.get("precedente");
  const precedente = brutPrecedente ? AnnonceSchema.safeParse(lireJson(brutPrecedente)) : null;
  if (!infos.success || !reglages.success || !consigne.success || (precedente && !precedente.success)) {
    return erreur("Informations de l'article invalides.", 400);
  }

  try {
    const resultat = await analyserArticle({
      photos,
      infos: infos.data,
      reglages: reglages.data,
      consigne: consigne.data,
      precedente: precedente?.data,
    });
    return NextResponse.json(resultat, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const err = e instanceof ErreurAnalyse ? e : new ErreurAnalyse("inconnue", "Une erreur inattendue est survenue.");
    if (!(e instanceof ErreurAnalyse)) console.error("[analyse]", e);
    return erreur(err.message, STATUTS[err.code], err.code);
  }
}

function lireJson(v: FormDataEntryValue | null): unknown {
  if (typeof v !== "string" || !v) return {};
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}
