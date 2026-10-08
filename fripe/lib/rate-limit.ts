// Limiteur à fenêtre glissante, en mémoire.
//
// Sur Vercel chaque instance de fonction a sa propre mémoire : la limite est
// donc approximative (par instance), mais elle suffit à couper une boucle
// folle ou un script qui martèle la route. Le vrai verrou reste le mot de
// passe ; pour une limite stricte multi-instances, brancher un stockage
// partagé (Upstash, Vercel KV) derrière la même signature.

type Fenetre = { limite: number; dureeMs: number };

const journaux = new Map<string, number[]>();

export function verifierLimite(
  cle: string,
  fenetres: Fenetre[],
  maintenant = Date.now(),
): { ok: true } | { ok: false; reessayerDansS: number } {
  const plusLongue = Math.max(...fenetres.map((f) => f.dureeMs));
  const horodatages = (journaux.get(cle) ?? []).filter((t) => maintenant - t < plusLongue);

  for (const f of fenetres) {
    const dansFenetre = horodatages.filter((t) => maintenant - t < f.dureeMs);
    if (dansFenetre.length >= f.limite) {
      const plusAncien = dansFenetre[0];
      journaux.set(cle, horodatages);
      return { ok: false, reessayerDansS: Math.max(1, Math.ceil((plusAncien + f.dureeMs - maintenant) / 1000)) };
    }
  }

  horodatages.push(maintenant);
  journaux.set(cle, horodatages);

  // Ménage occasionnel pour que la Map ne grossisse pas indéfiniment.
  if (journaux.size > 5000) {
    for (const [k, v] of journaux) if (!v.some((t) => maintenant - t < plusLongue)) journaux.delete(k);
  }
  return { ok: true };
}

export function ipDe(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "local").trim();
}

export function _reinitialiserPourTests() {
  journaux.clear();
}
