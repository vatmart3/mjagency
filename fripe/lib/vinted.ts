// Tout ce qui décrit Vinted lui-même : les états proposés dans le formulaire
// de dépôt, les limites de saisie, l'ordre des champs.

export const ETATS = [
  "Neuf avec étiquette",
  "Neuf sans étiquette",
  "Très bon état",
  "Bon état",
  "Satisfaisant",
] as const;

export type Etat = (typeof ETATS)[number];

// Limites volontairement prudentes : un titre ou une description qui les
// respecte se colle sans jamais être tronqué par le formulaire.
export const TITRE_MAX = 80;
export const TITRE_CIBLE = 60;
export const DESCRIPTION_MAX = 1800;

export const PHOTOS_MIN = 1;
export const PHOTOS_MAX = 8;

// Ordre des champs dans le formulaire « Vends un article », pour « Tout copier ».
export const ORDRE_SAISIE = [
  "Titre",
  "Description",
  "Catégorie",
  "Marque",
  "Taille",
  "État",
  "Couleur",
  "Matière",
  "Prix",
] as const;
