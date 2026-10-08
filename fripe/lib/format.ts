import type { Annonce } from "./schema.ts";

export function formatPrix(n: number): string {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
  return `${s} €`;
}

// Le texte de « Tout copier » : les champs dans l'ordre du formulaire Vinted,
// pour pouvoir le garder dans les notes et remplir de haut en bas.
export function toutCopier(a: Annonce): string {
  const lignes = [
    `TITRE`,
    a.titre,
    ``,
    `DESCRIPTION`,
    a.description,
    ``,
    `Catégorie : ${a.fiche.categorie}`,
    `Marque : ${a.fiche.marque}`,
    `Taille : ${a.fiche.taille}`,
    `État : ${a.fiche.etat}`,
    `Couleur : ${a.fiche.couleurs.join(", ") || "—"}`,
    `Matière : ${a.fiche.matiere}`,
    `Prix : ${formatPrix(a.prix.conseille)} (accepter jusqu'à ${formatPrix(a.prix.plancher)})`,
  ];
  return lignes.join("\n");
}
