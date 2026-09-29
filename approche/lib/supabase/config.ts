export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Sans Supabase configuré, l'app tourne en « mode démo » : données locales au navigateur. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Compte commun de l'agence : il ouvre la porte, puis chacun choisit qui il est
 * (Jérémy ou Matheis) et l'app bascule sur son compte personnel, même mot de passe.
 */
export const SHARED_LOGIN_EMAIL = (process.env.NEXT_PUBLIC_SHARED_LOGIN_EMAIL ?? "mjagency.officiel@gmail.com").toLowerCase();
export const isSharedAccount = (email: string | null | undefined) => (email ?? "").toLowerCase() === SHARED_LOGIN_EMAIL;
