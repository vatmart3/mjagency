/** Qui est MJAGENCY : injecté dans chaque prompt de recherche et dans le prospect IA. */
export const agency = {
  name: "MJAGENCY",
  site: "mjagency.eu",
  founders: [
    { id: "jeremy", name: "Jérémy", role: "fondateur" },
    { id: "matheis", name: "Matheis", role: "associé" },
  ],
  base: "Sète (Hérault), Bassin de Thau",
  zone: ["Sète", "Frontignan", "Balaruc-les-Bains", "Balaruc-le-Vieux", "Mèze", "Marseillan", "Bouzigues", "Montpellier"],
  positioning:
    "Agence web et marketing digital de proximité : deux associés qui se déplacent, parlent simplement et livrent vite. Le soin d'un studio (design éditorial, rendu premium, sites rapides sur téléphone) au prix d'une agence locale.",
  tone:
    "Direct, chaleureux, concret. On tutoie jamais un prospect, on parle comme un commerçant parle à un voisin de confiance : pas de jargon, pas de promesse en l'air, des exemples locaux.",
  services: [
    "Sites vitrines et e-commerce (de 490 € à 1 900 € et plus, jusqu'au premium sur mesure ~10 k€)",
    "Gestion des réseaux sociaux (Instagram, Facebook, TikTok)",
    "Agents IA (réponses automatiques aux clients, prise de rendez-vous, pré-qualification)",
    "Logiciels sur mesure (planning, devis, suivi, stock)",
    "Cartes NFC d'avis Google",
    "Carte de fidélité digitale (Apple / Google Wallet)",
    "Optimisation de fiche Google et référencement local",
  ],
  promise:
    "Faire en sorte que le commerce soit trouvé, choisi et recommandé par les gens du coin et les visiteurs de passage.",
  goalPerMonth: 3000,
};

export type AgencyContext = typeof agency;
