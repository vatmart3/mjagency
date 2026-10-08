// Session : un cookie httpOnly « expiration.signature », signé en HMAC-SHA256.
// Uniquement Web Crypto, pour tourner à l'identique dans le proxy et dans les
// routes, sans dépendre d'un runtime particulier.

export const COOKIE_SESSION = "fripe_session";
export const DUREE_SESSION_S = 60 * 60 * 24 * 30; // 30 jours : on reste connecté sur le téléphone

const encoder = new TextEncoder();

function secret(): string | null {
  const s = process.env.SESSION_SECRET || process.env.APP_PASSWORD;
  return s ? `fripe-session-v1:${s}` : null;
}

export function motDePasseConfigure(): boolean {
  return Boolean(process.env.APP_PASSWORD);
}

async function hmac(cle: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(cle),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return base64url(new Uint8Array(sig));
}

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function egalTempsConstant(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function creerJeton(maintenant = Date.now()): Promise<string> {
  const cle = secret();
  if (!cle) throw new Error("APP_PASSWORD manquant");
  const expiration = Math.floor(maintenant / 1000) + DUREE_SESSION_S;
  return `${expiration}.${await hmac(cle, `session:${expiration}`)}`;
}

export async function jetonValide(jeton: string | undefined, maintenant = Date.now()): Promise<boolean> {
  const cle = secret();
  if (!cle || !jeton) return false;
  const [exp, sig] = jeton.split(".");
  const expiration = Number(exp);
  if (!Number.isInteger(expiration) || !sig) return false;
  if (expiration < Math.floor(maintenant / 1000)) return false;
  return egalTempsConstant(sig, await hmac(cle, `session:${expiration}`));
}

// Les deux côtés passent par un HMAC avant comparaison : longueur fixe,
// donc une comparaison en temps constant qui ne trahit pas la longueur.
export async function motDePasseCorrect(saisi: string): Promise<boolean> {
  const attendu = process.env.APP_PASSWORD;
  if (!attendu) return false;
  const cle = "fripe-password-check";
  return egalTempsConstant(await hmac(cle, saisi), await hmac(cle, attendu));
}

// Une requête qui modifie quelque chose doit venir de l'app elle-même.
export function origineAutorisee(req: Request): boolean {
  const origine = req.headers.get("origin");
  if (!origine) return true; // navigateurs anciens / même origine sans en-tête
  const hote = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origine).host === hote;
  } catch {
    return false;
  }
}
