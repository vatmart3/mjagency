import type { Channel, DiscProfile, OfferId, Scenario, ScriptStep, Temperature } from "@/content/types";
import type { Offer } from "@/content/offers";

/** Statuts du pipeline, dans l'ordre. */
export const PIPELINE = [
  { id: "a_contacter", label: "À contacter" },
  { id: "contacte", label: "Contacté" },
  { id: "interesse", label: "Intéressé" },
  { id: "rdv", label: "RDV" },
  { id: "proposition", label: "Proposition" },
  { id: "signe", label: "Signé" },
  { id: "perdu", label: "Perdu" },
] as const;
export type PipelineStatus = (typeof PIPELINE)[number]["id"];

export const statusLabel = (s: PipelineStatus) => PIPELINE.find((p) => p.id === s)?.label ?? s;

/** Couleur des points sur la carte, selon le statut. */
export const STATUS_COLOR: Record<PipelineStatus, string> = {
  a_contacter: "#9CC9F5",
  contacte: "#5AA9F0",
  interesse: "#2B8CEB",
  rdv: "#0071E3",
  proposition: "#0050A8",
  signe: "#0A2F5C",
  perdu: "#C7CCD1",
};

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  color: string;
}

export interface Prospect {
  id: string;
  name: string;
  sector: string;
  sub_activity: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  google_url: string | null;
  google_rating: number | null;
  google_reviews: number | null;
  founded_year: number | null;
  employees: number | null;
  owner_name: string | null;
  hours: string | null;
  competitors: string | null;
  field_notes: string | null;
  photos: string[];
  disc: DiscProfile | null;
  temperature: Temperature | null;
  status: PipelineStatus;
  to_visit: boolean;
  potential_amount: number | null;
  signed_amount: number | null;
  signed_at: string | null;
  signed_by: string | null;
  next_action: string | null;
  next_action_at: string | null;
  assigned_to: string | null;
  lat: number | null;
  lng: number | null;
  hook: string | null;
  intel: ParsedReport | null;
  /** Analyse automatique (recherche web + script sur mesure) */
  analysis_status?: "en_cours" | "fait" | "erreur" | null;
  analysis_step?: string | null;
  analysis_error?: string | null;
  analysis_at?: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type InteractionChannel = Channel | "sms" | "email" | "autre";
export type InteractionOutcome =
  | "pas_de_reponse"
  | "messagerie"
  | "barrage"
  | "refus"
  | "rappel"
  | "rdv"
  | "visite"
  | "note"
  | "signe";

export interface Interaction {
  id: string;
  prospect_id: string;
  user_id: string | null;
  channel: InteractionChannel;
  outcome: InteractionOutcome | null;
  disc: DiscProfile | null;
  temperature: Temperature | null;
  interest: number | null;
  objection: string | null;
  next_action: string | null;
  next_action_at: string | null;
  notes: string | null;
  duration_sec: number | null;
  created_at: string;
}

export interface Task {
  id: string;
  prospect_id: string | null;
  user_id: string | null;
  title: string;
  kind: string;
  due_at: string;
  preferred_slot: string | null;
  done: boolean;
  done_at: string | null;
  created_at: string;
}

export interface ResearchPrompt {
  id: string;
  prospect_id: string;
  version: number;
  prompt: string;
  created_by: string | null;
  created_at: string;
}

export interface ParsedReport {
  synthese?: string;
  presence?: string;
  site?: string;
  reseaux?: string;
  avis?: string;
  concurrents?: string;
  saisonnalite?: string;
  opportunites?: string;
  problemes?: string;
  offre?: string;
  accroche?: string;
  questions?: string[];
  objections?: { objection: string; reponse: string }[];
  budget?: string;
  manquants?: string;
  /** Sections reconnues / attendues, pour signaler un rapport incomplet. */
  found: string[];
  missing: string[];
}

export interface ResearchReport {
  id: string;
  prospect_id: string;
  prompt_id: string | null;
  raw: string;
  parsed: ParsedReport;
  source: "manuel" | "api";
  created_by: string | null;
  created_at: string;
}

export interface CustomScript {
  id: string;
  sector: string;
  /** Script unique d'un client (issu de l'analyse), sinon null */
  prospect_id?: string | null;
  channel: Channel;
  base_key: string | null;
  title: string;
  steps: ScriptStep[];
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  user_id: string;
  kind: "script" | "objection" | "secteur";
  key: string;
  created_at: string;
}

export interface Tour {
  id: string;
  user_id: string | null;
  day: string;
  start_time: string | null;
  cities: string[];
  sectors: string[];
  duration_min: number;
  prospect_ids: string[];
  created_at: string;
}

export interface CallSession {
  id: string;
  user_id: string | null;
  planned_at: string;
  duration_min: number;
  prospect_ids: string[];
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export type TrainingMode = "duo" | "flash" | "defi" | "ia";
export type TrainingState = "lobby" | "running" | "evaluating" | "done" | "cancelled";

export interface TrainingSession {
  id: string;
  code: string | null;
  mode: TrainingMode;
  sector: string | null;
  channel: Channel | null;
  difficulty: number | null;
  scenario: Scenario | null;
  seller_id: string | null;
  player_id: string | null;
  state: TrainingState;
  scores: Partial<Record<string, number>> | null;
  comment: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_sec: number | null;
  source_prospect_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FlashcardReview {
  user_id: string;
  card_key: string;
  ease: number;
  interval_days: number;
  reps: number;
  last_grade: number | null;
  due_at: string;
  updated_at: string;
}

export interface SettingsData {
  offers: Offer[];
  activeSectors: string[];
  cities: string[];
  callSessionMinutes: number;
  goalPerPerson: number;
  defaultBasket: number;
  /** Taux par défaut quand il n'y a pas encore d'historique. */
  defaultRates: {
    pickup: number; // décroché / appels
    meeting: number; // RDV / conversations
    close: number; // signatures / RDV
    visitMeeting: number; // RDV / visites
  };
  workingDaysPerWeek: number;
  /** Offre mise en avant par défaut dans le prompt. */
  highlightOffers: OfferId[];
}

export interface AppSettingsRow {
  id: 1;
  data: Partial<SettingsData>;
  updated_at: string;
}

export interface Tables {
  profiles: Profile;
  prospects: Prospect;
  interactions: Interaction;
  tasks: Task;
  research_prompts: ResearchPrompt;
  research_reports: ResearchReport;
  custom_scripts: CustomScript;
  favorites: Favorite;
  tours: Tour;
  call_sessions: CallSession;
  training_sessions: TrainingSession;
  flashcard_reviews: FlashcardReview;
  app_settings: AppSettingsRow;
}
export type TableName = keyof Tables;
