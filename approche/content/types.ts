/**
 * Types du contenu commercial d'APPROCHE.
 * Tout le contenu vit dans /content en TypeScript versionné : c'est la
 * valeur principale de l'app. Les scripts modifiés depuis l'interface
 * sont stockés à part (table Supabase `custom_scripts`) et viennent
 * surcharger ces fichiers sans jamais les écraser.
 */

export type SectorId =
  | "boulangerie"
  | "restaurant"
  | "bar-cafe"
  | "food-truck"
  | "coiffeur"
  | "beaute"
  | "sport"
  | "garage"
  | "artisan-btp"
  | "immobilier"
  | "commerce"
  | "caviste"
  | "hebergement"
  | "comptable"
  | "sante"
  | "juridique";

export type DiscProfile = "fonceur" | "analytique" | "relationnel" | "prudent";
export type Channel = "physique" | "telephone";

/** Température d'intérêt, de la plus froide à la plus chaude. */
export type Temperature = "glace" | "froid" | "tiede" | "chaud" | "brulant";

/** Identifiants des offres MJAGENCY (les prix vivent dans les réglages). */
export type OfferId =
  | "audit"
  | "fiche-google"
  | "nfc-avis"
  | "fidelite"
  | "site-vitrine"
  | "site-ecommerce"
  | "site-premium"
  | "reseaux-sociaux"
  | "agent-ia"
  | "logiciel";

/** Jours : 0 = dimanche, 1 = lundi … 6 = samedi (comme Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimeWindow {
  /** Libellé court affiché : « Milieu d'après-midi » */
  label: string;
  /** Jours concernés. Absent = tous les jours ouvrés du secteur. */
  days?: Weekday[];
  /** « HH:MM » */
  from: string;
  /** « HH:MM » */
  to: string;
  /** Pourquoi ce créneau (une phrase). */
  why: string;
}

export interface SectorTiming {
  /** Créneaux recommandés, du meilleur au moins bon. Valables terrain ET téléphone sauf mention. */
  best: TimeWindow[];
  /** Créneaux à éviter absolument. */
  avoid: TimeWindow[];
  /** Jours de fermeture habituels du secteur (indicatif). */
  usuallyClosed: Weekday[];
  /** Nuance propre au téléphone (ex. : « appeler le fixe du salon, pas le portable perso »). */
  phoneNote: string;
  /** Saisonnalité sur le littoral (Bassin de Thau) : quand prospecter, quand oublier. */
  seasonNote: string;
}

export interface ScriptStep {
  /** Identifiant court, unique dans le script : "accroche", "constat"… */
  id: string;
  /** Titre de l'étape : « Accroche (10 secondes) » */
  title: string;
  /** Objectif de l'étape en une phrase. */
  goal: string;
  /** Répliques à dire, dans l'ordre. Style oral, naturel, vouvoiement. Chaque entrée = une phrase ou deux. */
  lines: string[];
  /** Conseil de posture ou de ton (facultatif). */
  tip?: string;
  /** Embranchements : « S'il répond X » → « Dites Y ». */
  branches?: { if: string; then: string }[];
}

export interface Script {
  id: string;
  title: string;
  channel: Channel;
  /** Durée indicative : « 3 à 5 min » */
  duration: string;
  steps: ScriptStep[];
}

export interface SpinQuestion {
  /** S = Situation, P = Problème, I = Implication, N = Besoin (Need-payoff) */
  type: "S" | "P" | "I" | "N";
  question: string;
  /** Ce qu'on cherche à apprendre / faire réaliser. */
  why: string;
}

/** Réponse à une objection en 4 temps : Accueillir → Questionner → Recadrer → Proposer. */
export interface Objection {
  id: string;
  /** L'objection telle que le commerçant la dit. */
  objection: string;
  /** Ce qu'elle cache souvent. */
  hidden: string;
  accueillir: string;
  questionner: string;
  recadrer: string;
  proposer: string;
}

export interface OfferPitch {
  offer: OfferId;
  /** Pourquoi cette offre pour ce secteur, en une ou deux phrases orales. */
  pitch: string;
}

export interface SectorSheet {
  id: SectorId;
  /** « Boulangerie-pâtisserie » */
  name: string;
  /** « Boulangerie » (pour les puces, le dock…) */
  short: string;
  /** Sous-activités couvertes : « boulangerie de quartier », « pâtisserie fine »… */
  examples: string[];
  /** Phrase d'introduction éditoriale (une ligne). */
  tagline: string;
  reality: {
    /** Rythme d'une journée / semaine type. */
    rhythm: string;
    /** Douleurs typiques (5 à 7). */
    pains: string[];
    /** Ce qui leur fait perdre des clients (4 à 6). */
    clientLoss: string[];
    /** Saisonnalité, avec un focus littoral / tourisme. */
    seasonality: string;
    /** Habitudes digitales typiques du secteur aujourd'hui. */
    digitalHabits: string;
  };
  offers: {
    /** Offres à pousser en priorité (2 ou 3). */
    priority: OfferPitch[];
    /** Offre d'entrée « pied dans la porte » (1 ou 2). */
    entry: OfferPitch[];
    /** Suite logique après la première vente. */
    upsell: string;
  };
  timing: SectorTiming;
  scripts: {
    physique: Script;
    telephone: Script;
  };
  /** 5 à 7 questions SPIN. */
  discovery: SpinQuestion[];
  /** Au moins 6 objections. */
  objections: Objection[];
  /** Arguments honnêtes, formulés « en général », jamais de fausse statistique. */
  proofs: string[];
  /** Signaux d'achat propres au secteur. */
  buyingSignals: string[];
  /** Pour le générateur de prompt de recherche. */
  research: {
    /** Plateformes à vérifier : « TheFork », « Uber Eats », « PagesJaunes »… */
    platforms: string[];
    /** Questions de recherche spécifiques au secteur (6 à 10). */
    questions: string[];
  };
  /** Pitch d'accroche de 30 secondes (défi chronométré). */
  pitch30s: string;
  /** Règles de conformité propres au secteur (santé, juridique…). Absent si rien de spécial. */
  compliance?: string;
}

/* ------------------------------------------------------------------ */
/* Méthode & lecture de l'attitude                                     */
/* ------------------------------------------------------------------ */

export interface DiscProfileSheet {
  id: DiscProfile;
  name: string; // « Le Fonceur »
  tagline: string;
  recognize: {
    vocabulary: string[];
    pace: string;
    posture: string;
    questions: string[];
    environment: string;
    phone: string;
  };
  wants: string[];
  avoid: string[];
  close: string;
  /** Phrases types qui fonctionnent avec ce profil. */
  phrases: string[];
  /** Couleur d'accent (hex) utilisée dans l'interface. */
  color: string;
}

export interface TemperatureLevel {
  id: Temperature;
  name: string;
  verbal: string[];
  nonVerbal: string[];
  phone: string[];
  action: string;
  /** Exemple de phrase à dire à ce niveau. */
  line: string;
}

export interface Signal {
  id: string;
  label: string;
  category: "verbal" | "non-verbal" | "telephone" | "contexte";
  /** Poids par profil DISC (0 à 3). */
  disc: Partial<Record<DiscProfile, number>>;
  /** Effet sur la température (-3 … +3). */
  heat: number;
}

export interface NextLineRule {
  id: string;
  when: {
    profile?: DiscProfile;
    minHeat?: number;
    maxHeat?: number;
    anySignals?: string[];
    allSignals?: string[];
  };
  line: string;
  why: string;
  priority: number;
}

/* ------------------------------------------------------------------ */
/* Entraînement                                                        */
/* ------------------------------------------------------------------ */

export interface Scenario {
  id: string;
  sector: SectorId;
  channel: Channel;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Ce que voit le vendeur : nom du commerce + ville + ce qui est observable. */
  seller: {
    business: string;
    city: string;
    context: string;
  };
  /** Carte secrète du « prospect ». */
  character: {
    firstName: string;
    age: number;
    role: string;
    disc: DiscProfile;
    mood: string;
    /** Budget réel, ex. « 600 € max, en 3 fois » */
    budget: string;
    backstory: string;
    /** Objection cachée qui ne sort qu'à un moment précis. */
    hiddenObjection: string;
    /** Quand la sortir : « seulement après qu'on vous a parlé de prix ». */
    hiddenWhen: string;
    /** Ce qui le fera dire oui. */
    yesTrigger: string;
    /** 2 ou 3 tics / comportements pour incarner le rôle. */
    quirks: string[];
    /** Première réplique du prospect. */
    opening: string;
  };
}

export type EvalCriterion =
  | "accroche"
  | "ecoute"
  | "decouverte"
  | "objections"
  | "offre"
  | "conclusion"
  | "attitude";
