/**
 * Cible de build. "artifact" = page unique autonome (claude.ai) : pas de serveur,
 * pas d'impression ni de téléchargement, liens externes par <a> uniquement.
 */
export const IS_ARTIFACT = process.env.NEXT_PUBLIC_TARGET === "artifact";
