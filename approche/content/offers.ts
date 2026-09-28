import type { OfferId } from "./types";

/**
 * Catalogue MJAGENCY par défaut. Les prix sont modifiables dans Réglages
 * (stockés dans `app_settings`) : ces valeurs ne servent qu'au premier
 * démarrage et au mode démo.
 *
 * Trois formules par offre :
 *  - direct      : paiement unique
 *  - abonnement  : mensualité sur une durée d'engagement
 *  - mixte       : acompte + mensualité
 */

export interface OfferPricing {
  direct: { price: number } | null;
  abonnement: { monthly: number; months: number } | null;
  mixte: { upfront: number; monthly: number; months: number } | null;
}

export interface Offer {
  id: OfferId;
  name: string;
  short: string;
  /** Ce que le commerçant obtient, en une phrase concrète. */
  promise: string;
  includes: string[];
  /** Délai de livraison indicatif. */
  delay: string;
  pricing: OfferPricing;
  /** Libellé « à partir de » affiché si le prix est sur devis. */
  fromLabel?: string;
  /** Offre d'entrée (pied dans la porte). */
  entry?: boolean;
}

export const DEFAULT_OFFERS: Offer[] = [
  {
    id: "audit",
    name: "Audit digital gratuit",
    short: "Audit",
    promise: "Un état des lieux clair de ce que voient vos clients quand ils vous cherchent sur internet, en 20 minutes.",
    includes: [
      "Analyse de la fiche Google (photos, horaires, avis, catégories)",
      "Test du site sur téléphone (vitesse, lisibilité, bouton d'appel)",
      "Comparaison avec 3 concurrents du secteur dans la ville",
      "3 actions prioritaires, dont au moins une faisable seul et gratuitement",
    ],
    delay: "Restitution sous 48 h",
    pricing: { direct: { price: 0 }, abonnement: null, mixte: null },
    entry: true,
  },
  {
    id: "fiche-google",
    name: "Fiche Google optimisée",
    short: "Fiche Google",
    promise: "Une fiche Google complète, à jour et bien classée sur les recherches locales de votre métier.",
    includes: [
      "Revue complète des catégories, services, attributs et horaires (y compris jours fériés et saison)",
      "Photos retravaillées et publiées",
      "Réponses types aux avis, rédigées dans votre ton",
      "Suivi mensuel : publications et réponse aux nouveaux avis (formule abonnement)",
    ],
    delay: "Mise en place sous 5 jours",
    pricing: {
      direct: { price: 190 },
      abonnement: { monthly: 39, months: 12 },
      mixte: { upfront: 90, monthly: 25, months: 12 },
    },
    entry: true,
  },
  {
    id: "nfc-avis",
    name: "Carte NFC d'avis Google",
    short: "Carte NFC avis",
    promise: "Le client pose son téléphone sur la carte au comptoir et arrive directement sur la page pour laisser un avis.",
    includes: [
      "Carte ou présentoir de comptoir NFC + QR code de secours",
      "Lien direct vers le formulaire d'avis de votre fiche",
      "Personnalisation au logo",
      "Conseils pour demander l'avis au bon moment, sans forcer",
    ],
    delay: "Livrée sous 7 jours",
    pricing: {
      direct: { price: 79 },
      abonnement: { monthly: 9, months: 12 },
      mixte: { upfront: 39, monthly: 5, months: 12 },
    },
    entry: true,
  },
  {
    id: "fidelite",
    name: "Carte de fidélité digitale",
    short: "Fidélité digitale",
    promise: "Une carte de fidélité dans le téléphone de vos clients, sans application à télécharger, avec des relances automatiques.",
    includes: [
      "Carte ajoutée au portefeuille du téléphone (Apple / Google Wallet)",
      "Tampons ou points, récompense au choix",
      "Notifications ciblées (nouveauté, jour creux, anniversaire)",
      "Tableau de bord : clients fidèles, fréquence de visite",
    ],
    delay: "Opérationnelle sous 10 jours",
    pricing: {
      direct: { price: 490 },
      abonnement: { monthly: 49, months: 12 },
      mixte: { upfront: 190, monthly: 29, months: 12 },
    },
  },
  {
    id: "site-vitrine",
    name: "Site vitrine",
    short: "Site vitrine",
    promise: "Un site rapide, beau sur téléphone, qui répond aux questions de vos clients et les fait appeler ou venir.",
    includes: [
      "Essentiel (490 €) : une page complète, bouton d'appel, itinéraire, horaires",
      "Pro (990 €) : jusqu'à 5 pages, textes rédigés, référencement local",
      "Signature (1 900 €) : design sur mesure, photos, réservation ou devis en ligne",
      "Nom de domaine, hébergement et certificat de sécurité la première année",
    ],
    delay: "2 à 4 semaines",
    pricing: {
      direct: { price: 990 },
      abonnement: { monthly: 59, months: 24 },
      mixte: { upfront: 390, monthly: 35, months: 18 },
    },
    fromLabel: "490 € → 1 900 €",
  },
  {
    id: "site-ecommerce",
    name: "Site e-commerce",
    short: "E-commerce",
    promise: "Vendre en ligne, en click & collect ou en livraison locale, sans dépendre d'une plateforme qui prend une commission.",
    includes: [
      "Catalogue produits, paiement sécurisé, click & collect",
      "Gestion simple des stocks et des commandes depuis le téléphone",
      "Formation d'une heure pour être autonome",
      "Référencement des fiches produits",
    ],
    delay: "4 à 6 semaines",
    pricing: {
      direct: { price: 1900 },
      abonnement: { monthly: 99, months: 24 },
      mixte: { upfront: 700, monthly: 59, months: 24 },
    },
    fromLabel: "dès 1 900 €",
  },
  {
    id: "site-premium",
    name: "Site premium sur mesure",
    short: "Premium",
    promise: "Un site d'image haut de gamme, animations et 3D, pensé comme une vitrine de marque.",
    includes: [
      "Direction artistique complète et maquettes",
      "Animations, 3D légère, photos et vidéo",
      "Réservation, espace client ou configurateur sur mesure",
      "Accompagnement référencement sur 3 mois",
    ],
    delay: "6 à 10 semaines",
    pricing: {
      direct: { price: 4900 },
      abonnement: null,
      mixte: { upfront: 2000, monthly: 250, months: 12 },
    },
    fromLabel: "4 900 € → 10 000 €",
  },
  {
    id: "reseaux-sociaux",
    name: "Gestion des réseaux sociaux",
    short: "Réseaux sociaux",
    promise: "Une présence régulière et soignée sur Instagram et Facebook, sans que vous ayez à y penser.",
    includes: [
      "Ligne éditoriale et calendrier mensuel validé avec vous",
      "8 à 12 publications par mois + stories",
      "Une séance photo / vidéo sur place par mois",
      "Bilan mensuel simple : ce qui a marché, ce qu'on ajuste",
    ],
    delay: "Démarrage sous 10 jours",
    pricing: {
      direct: null,
      abonnement: { monthly: 390, months: 6 },
      mixte: { upfront: 290, monthly: 290, months: 6 },
    },
    fromLabel: "dès 290 €/mois",
  },
  {
    id: "agent-ia",
    name: "Agent IA",
    short: "Agent IA",
    promise: "Un assistant qui répond à vos clients 24 h/24 (messages, site, réservations) et vous fait gagner des heures chaque semaine.",
    includes: [
      "Réponses automatiques aux questions fréquentes (horaires, tarifs, disponibilités)",
      "Prise de rendez-vous ou pré-qualification des demandes",
      "Branché sur votre site, Instagram ou WhatsApp",
      "Vous gardez la main : transfert vers vous dès que c'est nécessaire",
    ],
    delay: "2 à 3 semaines",
    pricing: {
      direct: { price: 1490 },
      abonnement: { monthly: 129, months: 12 },
      mixte: { upfront: 690, monthly: 79, months: 12 },
    },
  },
  {
    id: "logiciel",
    name: "Logiciel sur mesure",
    short: "Logiciel",
    promise: "Un outil taillé pour votre façon de travailler : planning, devis, suivi de chantier, stock… au lieu de trois tableurs.",
    includes: [
      "Atelier d'une demi-journée pour cartographier votre fonctionnement",
      "Application web utilisable sur téléphone et ordinateur",
      "Hébergement, sauvegardes, maintenance",
      "Évolutions au fil de l'eau",
    ],
    delay: "6 à 12 semaines",
    pricing: {
      direct: { price: 3900 },
      abonnement: null,
      mixte: { upfront: 1500, monthly: 190, months: 18 },
    },
    fromLabel: "sur devis, dès 2 900 €",
  },
];

export const OFFER_IDS = DEFAULT_OFFERS.map((o) => o.id);

export function offerName(id: OfferId, offers: Offer[] = DEFAULT_OFFERS): string {
  return offers.find((o) => o.id === id)?.name ?? id;
}

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** Résumé texte des 3 formules d'une offre, pour l'affichage et le prompt. */
export function pricingSummary(o: Offer): string {
  const parts: string[] = [];
  if (o.pricing.direct) parts.push(o.pricing.direct.price === 0 ? "gratuit" : `${eur(o.pricing.direct.price)} en paiement direct`);
  if (o.pricing.abonnement) parts.push(`${eur(o.pricing.abonnement.monthly)}/mois sur ${o.pricing.abonnement.months} mois`);
  if (o.pricing.mixte) parts.push(`${eur(o.pricing.mixte.upfront)} + ${eur(o.pricing.mixte.monthly)}/mois sur ${o.pricing.mixte.months} mois`);
  const base = parts.join(" · ");
  return o.fromLabel ? `${base} (gamme ${o.fromLabel})` : base;
}
