/**
 * Les valeurs viennent souvent d'un copier-coller (guillemets, espaces
 * insécables, texte autour…). On n'en garde que l'URL et la clé elles-mêmes :
 * un seul caractère accentué dans un en-tête HTTP fait échouer toute requête.
 */
function extract(raw: string | undefined, pattern: RegExp) {
  const text = raw ?? "";
  return text.match(pattern)?.[0] ?? text.trim();
}

export const SUPABASE_URL = extract(process.env.NEXT_PUBLIC_SUPABASE_URL, /https:\/\/[A-Za-z0-9.-]+\.supabase\.(?:co|in)/);
export const SUPABASE_ANON_KEY = extract(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, /eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+|sb_publishable_[\w-]+/);

/** Sans Supabase configuré, l'app tourne en « mode démo » : données locales au navigateur. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Compte commun de l'agence : il ouvre la porte, puis chacun choisit qui il est
 * (Jérémy ou Matheis) et l'app bascule sur son compte personnel, même mot de passe.
 */
export const SHARED_LOGIN_EMAIL = (process.env.NEXT_PUBLIC_SHARED_LOGIN_EMAIL ?? "mjagency.officiel@gmail.com").toLowerCase();
export const isSharedAccount = (email: string | null | undefined) => (email ?? "").toLowerCase() === SHARED_LOGIN_EMAIL;
