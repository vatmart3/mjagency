/* =====================================================================
   MJ LAB — CONTENU DU SITE
   ---------------------------------------------------------------------
   Tout ce qui s'affiche se modifie ici, sans toucher aux composants.

   • Ajouter / retirer une activité : éditer le tableau `activities`
     (de 2 à 8 entrées). L'arche 3D se découpe automatiquement en autant
     de segments, la navigation, le formulaire et les pages
     /activites/[slug] suivent.
   • Les valeurs marquées `todo: true` ou commentées `TODO` sont des
     emplacements à remplir : rien n'y est inventé.
   ===================================================================== */

export type Activity = {
  /** Identifiant d'URL : /activites/<slug> */
  slug: string;
  /** Nom affiché en très grand (le point final est ajouté automatiquement) */
  name: string;
  /** Code d'expérience affiché en Geist Mono */
  code: string;
  /** Phrase de positionnement (1 phrase) */
  pitch: string;
  /** Description longue, pour la page de l'activité */
  description: string;
  /** 3 tags en Geist Mono */
  tags: [string, string, string];
  /** Offres détaillées sur la page de l'activité */
  offers: { title: string; text: string }[];
  /** Libellé court utilisé dans le formulaire */
  formLabel: string;
  /** Type de visuel de remplacement en attendant les vraies images */
  mockup: "browser" | "shop" | "box" | "app" | "live";
  /** Image réelle (dans /public). Laisser vide pour garder le mockup. */
  image?: string;
  /** Lien externe éventuel (site dédié de l'activité) */
  externalUrl?: string;
};

export type Project = {
  title: string;
  year: string;
  category: string;
  place: string;
  /** slug de l'activité liée */
  activity: string;
  /** Taille dans la grille éditoriale */
  size: "xl" | "lg" | "md" | "sm" | "tall";
  /** Image dans /public (ex. "/projets/au-bon-pain.jpg"). Vide = placeholder. */
  image?: string;
  url?: string;
  /** Projet de démonstration à remplacer */
  placeholder?: boolean;
};

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
  /** true = valeur provisoire, un badge « À compléter » s'affiche */
  todo?: boolean;
};

export const site = {
  name: "MJ LAB",
  // TODO : remplacer par le domaine définitif (sert au SEO, au sitemap, à l'OG).
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.mjlab.fr",
  signature: "Une vision · plusieurs possibilités",
  submarkText: "UNE VISION · PLUSIEURS ACTIVITÉS · ",
  tagline: "Des idées qui prennent forme.",
  description:
    "MJ LAB réunit les activités de Jérémy Vatuone et Matheis Farrieux à Sète et Frontignan : sites web, e-commerce, achat-revente, produits numériques et live. Une vision, plusieurs possibilités.",
  locale: "fr_FR",
  location: {
    label: "Sète",
    region: "Bassin de Thau",
    coords: "43.40°N / 3.69°E",
    cities: ["Sète", "Frontignan"],
  },
  founders: [
    {
      firstName: "Jérémy",
      lastName: "Vatuone",
      role: "Co-fondateur",
      // TODO : rôle précis (ex. « Stratégie & commerce »)
      focus: "Rôle à préciser",
      // TODO : phrase signée par Jérémy
      quote: "Une phrase de Jérémy, à écrire avec lui : ce qui le fait avancer.",
      portrait: "/portraits/jeremy.webp",
    },
    {
      firstName: "Matheis",
      lastName: "Farrieux",
      role: "Co-fondateur",
      // TODO : rôle précis (ex. « Design & produit »)
      focus: "Rôle à préciser",
      // TODO : phrase signée par Matheis
      quote: "Une phrase de Matheis, à écrire avec lui : sa façon de construire.",
      portrait: "/portraits/matheis.webp",
    },
  ],
  contact: {
    // Repris du site MJ Agency — à confirmer pour MJ LAB.
    email: "mjagency.officiel@gmail.com",
    phone: "+33 6 47 57 13 70",
    phoneHref: "tel:+33647571370",
  },
  social: [
    // TODO : renseigner les vraies URL. Les entrées avec url vide ne s'affichent pas.
    { label: "Instagram", url: "" },
    { label: "TikTok", url: "" },
    { label: "Twitch", url: "" },
    { label: "LinkedIn", url: "" },
  ],
  nav: [
    { label: "Activités", href: "/#activites" },
    { label: "Méthode", href: "/#methode" },
    { label: "Duo", href: "/#duo" },
    { label: "Projets", href: "/#projets" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

/* ---------------------------------------------------------------------
   HERO
   --------------------------------------------------------------------- */
export const hero = {
  // Le titre est découpé en lignes ; le point final bordeaux est ajouté.
  titleLines: ["Des idées", "qui prennent", "forme"],
  subtitle:
    "MJ LAB réunit nos activités sous une seule vision : créer, lancer et faire grandir des projets concrets, du web au commerce.",
  ctaPrimary: "Lancer un projet",
  ctaSecondary: "Explorer le lab",
  offer: "Appel découverte offert — 20 min",
  reassurance: "RÉPONSE SOUS 24 H · SANS ENGAGEMENT",
};

/* ---------------------------------------------------------------------
   MANIFESTE
   --------------------------------------------------------------------- */
export const manifesto = {
  text:
    "On ne fait pas une seule chose. On construit un laboratoire : chaque activité est une expérience, chaque projet une preuve. Une vision commune, plusieurs façons de lui donner forme.",
  notes: ["NOTE-01 : la vision d'abord", "NOTE-02 : l'exécution ensuite", "NOTE-03 : une preuve par projet"],
};

/* ---------------------------------------------------------------------
   ACTIVITÉS — 2 à 8 entrées. L'ordre ici = l'ordre des segments de l'arche.
   --------------------------------------------------------------------- */
export const activities: Activity[] = [
  {
    slug: "mjagency",
    name: "MJAGENCY",
    code: "EXP-01",
    pitch: "Sites web et marketing digital pour les commerces locaux et les indépendants.",
    description:
      "L'activité historique du lab. Des sites rapides, pensés pour le mobile et pour Google, qui transforment les visiteurs en clients — et le marketing qui va avec, pour les commerces et indépendants du Bassin de Thau et d'ailleurs.",
    tags: ["SITES WEB", "SEO LOCAL", "MARKETING"],
    offers: [
      { title: "Site vitrine", text: "Un site sur mesure, rapide et référencé dès la mise en ligne." },
      { title: "Référencement local", text: "Structure, vitesse, fiche Google Business Profile, données locales." },
      { title: "Marketing digital", text: "Réseaux sociaux, campagnes et contenus pour faire venir les clients." },
    ],
    formLabel: "Un site web / du marketing",
    mockup: "browser",
    externalUrl: "https://www.mjagency.eu",
  },
  {
    slug: "mj-e-comm",
    name: "MJ E-COMM",
    code: "EXP-02",
    pitch: "Boutiques en ligne et e-commerce, de la fiche produit au paiement.",
    description:
      "Des boutiques en ligne pensées pour vendre : catalogue, tunnel d'achat, paiement, logistique. On conçoit, on lance, puis on optimise avec les chiffres.",
    tags: ["BOUTIQUES", "PAIEMENT", "CONVERSION"],
    offers: [
      { title: "Création de boutique", text: "Catalogue, paiement sécurisé, livraison : prête à vendre." },
      { title: "Optimisation", text: "Fiches produits, vitesse, tunnel d'achat : chaque étape compte." },
      { title: "Accompagnement", text: "Suivi des ventes et évolutions, mois après mois." },
    ],
    formLabel: "Une boutique en ligne",
    mockup: "shop",
  },
  {
    slug: "mj-store",
    name: "MJ STORE",
    code: "EXP-03",
    pitch: "Achat-revente : dénicher, valoriser, revendre au juste prix.",
    description:
      "Le terrain du commerce pur. On source, on remet en valeur et on revend — une école permanente du produit, du prix et du client, qui nourrit toutes les autres activités.",
    tags: ["ACHAT", "REVENTE", "SOURCING"],
    offers: [
      { title: "Sourcing", text: "Repérer les bons produits au bon moment." },
      { title: "Valorisation", text: "Photos, annonces, présentation : donner envie." },
      { title: "Revente", text: "Les bons canaux, le juste prix, un suivi sérieux." },
    ],
    formLabel: "Acheter / vendre",
    mockup: "box",
  },
  {
    slug: "lab-produits",
    name: "LAB PRODUITS",
    code: "EXP-04",
    pitch: "Applications, SaaS et agents IA développés en interne.",
    description:
      "Le cœur expérimental du lab. On conçoit nos propres outils : applications, logiciels en ligne et agents IA, testés sur nos activités avant d'être proposés à d'autres.",
    tags: ["SAAS", "AGENTS IA", "APPS"],
    offers: [
      { title: "Applications", text: "Des outils simples pour des problèmes concrets." },
      { title: "SaaS", text: "Des logiciels en ligne, testés d'abord sur nos propres activités." },
      { title: "Agents IA", text: "Automatiser ce qui prend du temps, garder l'humain là où il compte." },
    ],
    formLabel: "Une app / un outil IA",
    mockup: "app",
  },
  {
    slug: "mj-stream",
    name: "MJ STREAM",
    code: "EXP-05",
    pitch: "Lives TikTok et Twitch : jeux vidéo, conseils et coulisses du lab.",
    description:
      "La scène en direct du lab. Des lives sur TikTok et Twitch autour du jeu vidéo, des conseils business et des coulisses de nos projets — pour partager, échanger et construire une communauté.",
    tags: ["TIKTOK", "TWITCH", "LIVE"],
    offers: [
      { title: "Lives gaming", text: "Des sessions de jeu vidéo en direct, dans la bonne humeur." },
      { title: "Lives conseils", text: "Web, commerce, entrepreneuriat : on répond en direct." },
      { title: "Partenariats", text: "Marques et créateurs : construisons un format ensemble." },
    ],
    formLabel: "Un live / un partenariat",
    mockup: "live",
  },
];

/* ---------------------------------------------------------------------
   MÉTHODE — « Le protocole »
   --------------------------------------------------------------------- */
export const protocol = [
  {
    phase: "PHASE 01",
    title: "Observer",
    text: "On écoute, on regarde le terrain, les clients, les chiffres. Avant de créer, on comprend.",
    figure: "observe",
  },
  {
    phase: "PHASE 02",
    title: "Concevoir",
    text: "On dessine la solution la plus simple qui marche. Une idée claire, un plan précis.",
    figure: "design",
  },
  {
    phase: "PHASE 03",
    title: "Lancer",
    text: "On met en ligne, on ouvre, on vend. Vite, proprement, sans attendre la perfection.",
    figure: "launch",
  },
  {
    phase: "PHASE 04",
    title: "Faire grandir",
    text: "On mesure, on ajuste, on recommence. Chaque version est meilleure que la précédente.",
    figure: "grow",
  },
] as const;

/* ---------------------------------------------------------------------
   CHIFFRES — N'INVENTER AUCUN CHIFFRE.
   Le nombre d'activités est calculé depuis la liste ci-dessus.
   --------------------------------------------------------------------- */
export const stats: Stat[] = [
  { value: activities.length, label: "ACTIVITÉS LANCÉES" },
  // TODO : nombre réel de projets livrés
  { value: 0, suffix: "+", label: "PROJETS LIVRÉS", todo: true },
  // TODO : années d'expérience cumulées réelles
  { value: 0, label: "ANNÉES D'EXPÉRIENCE CUMULÉES", todo: true },
  // TODO : nombre réel de villes couvertes
  { value: 0, label: "VILLES COUVERTES", todo: true },
];

/* ---------------------------------------------------------------------
   PROJETS — « Carnet de labo »
   Remplacer les entrées `placeholder: true` par de vrais projets.
   --------------------------------------------------------------------- */
export const projects: Project[] = [
  {
    title: "Au Bon Pain",
    year: "2026",
    category: "WEB",
    place: "SÈTE",
    activity: "mjagency",
    size: "xl",
    url: "https://www.mjagency.eu/au-bon-pain",
  },
  { title: "Projet à venir", year: "2026", category: "E-COMMERCE", place: "FRONTIGNAN", activity: "mj-e-comm", size: "tall", placeholder: true },
  { title: "Projet à venir", year: "2026", category: "SAAS", place: "SÈTE", activity: "lab-produits", size: "md", placeholder: true },
  { title: "Projet à venir", year: "2026", category: "WEB", place: "BASSIN DE THAU", activity: "mjagency", size: "sm", placeholder: true },
  { title: "Projet à venir", year: "2026", category: "LIVE", place: "EN LIGNE", activity: "mj-stream", size: "lg", placeholder: true },
  { title: "Projet à venir", year: "2026", category: "REVENTE", place: "SÈTE", activity: "mj-store", size: "md", placeholder: true },
];

/* ---------------------------------------------------------------------
   CTA FINAL + FORMULAIRE
   --------------------------------------------------------------------- */
export const finalCta = {
  title: ["Une idée ?", "On lui donne forme"],
  text: "Racontez-nous votre projet en quatre étapes. On revient vers vous sous 24 h, avec une première piste concrète.",
};

export const form = {
  budgets: ["< 1 000 €", "1 000 – 3 000 €", "3 000 – 8 000 €", "> 8 000 €", "À définir ensemble"],
  delays: ["Dès que possible", "Sous 1 mois", "1 à 3 mois", "Pas pressé"],
  otherLabel: "Autre chose",
};

/**
 * Rareté — à n'activer QUE si c'est vrai.
 * Ex. { enabled: true, label: "3 créneaux disponibles ce mois-ci" }
 */
export const scarcity = {
  enabled: false,
  label: "3 créneaux disponibles ce mois-ci",
};

/* ---------------------------------------------------------------------
   MENTIONS LÉGALES — n'inventer aucune donnée.
   Valeurs reprises des mentions publiées sur mjagency.eu, à confirmer
   pour MJ LAB (l'entité juridique peut être différente).
   --------------------------------------------------------------------- */
export const legal = {
  // TODO : raison sociale de MJ LAB (si différente de MJ Agency)
  companyName: "TODO — raison sociale",
  // TODO : statut juridique
  legalForm: "TODO — statut juridique",
  // TODO : SIRET
  siret: "TODO — SIRET",
  // TODO : adresse du siège
  address: "TODO — adresse du siège",
  // TODO : TVA
  vat: "TODO — TVA intracommunautaire ou mention d'exonération",
  // TODO : responsable de la publication
  publisher: "TODO — responsable de la publication",
  email: site.contact.email,
  phone: site.contact.phone,
  host: {
    name: "Vercel Inc.",
    // TODO : recopier l'adresse officielle depuis vercel.com/legal
    address: "TODO — adresse de l'hébergeur (voir vercel.com/legal)",
    url: "https://vercel.com",
  },
  lastUpdate: "TODO — date de mise à jour",
};
