// La page unique tourne toujours en mode démo : Supabase n'est jamais appelé.
export function createBrowserClient(): never {
  throw new Error("Supabase indisponible dans la version page unique.");
}
export function createServerClient(): never {
  throw new Error("Supabase indisponible dans la version page unique.");
}
