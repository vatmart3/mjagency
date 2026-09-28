-- =====================================================================
-- APPROCHE — schéma complet (Supabase / Postgres 15+)
-- À exécuter une fois dans Supabase → SQL Editor (ou `supabase db push`).
-- Idempotent autant que possible : on peut le relancer sans casser.
--
-- Principe de sécurité : seules les adresses listées dans `associates`
-- (Jérémy et Matheis) ont accès aux données. Tout le monde voit tout
-- entre associés, personne d'autre ne voit rien (RLS partout).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Associés autorisés
-- ---------------------------------------------------------------------
create table if not exists public.associates (
  email text primary key check (email = lower(email)),
  display_name text not null,
  created_at timestamptz not null default now()
);

-- ⚠️ Remplacez ces deux adresses par les vôtres AVANT de créer les comptes.
insert into public.associates (email, display_name) values
  ('jeremy@mjagency.eu', 'Jérémy'),
  ('matheis@mjagency.eu', 'Matheis')
on conflict (email) do nothing;

-- Vrai si l'utilisateur connecté est un associé. SECURITY DEFINER pour
-- lire `associates` sans exposer la table.
create or replace function public.is_associate()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.associates a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_associate() from public;
grant execute on function public.is_associate() to authenticated;

-- ---------------------------------------------------------------------
-- 2. Profils (créés automatiquement à l'inscription)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null,
  color text not null default '#0071E3',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  select display_name into v_name from public.associates where email = lower(new.email);
  insert into public.profiles (id, email, display_name, color)
  values (
    new.id,
    lower(new.email),
    coalesce(v_name, split_part(new.email, '@', 1)),
    case when lower(coalesce(v_name, '')) like 'mat%' then '#1D1D1F' else '#0071E3' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 3. Réglages partagés (une seule ligne, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.app_settings (
  id smallint primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
insert into public.app_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 4. Prospects / clients
-- ---------------------------------------------------------------------
create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null,                         -- SectorId ou libellé libre
  sub_activity text,
  address text,
  city text,
  phone text,
  email text,
  website text,
  instagram text,
  facebook text,
  tiktok text,
  google_url text,
  google_rating numeric(2,1) check (google_rating between 0 and 5),
  google_reviews integer check (google_reviews >= 0),
  founded_year integer check (founded_year between 1800 and 2100),
  employees integer check (employees >= 0),
  owner_name text,
  hours text,
  competitors text,
  field_notes text,
  photos text[] not null default '{}',         -- chemins Supabase Storage
  disc text check (disc in ('fonceur','analytique','relationnel','prudent')),
  temperature text check (temperature in ('glace','froid','tiede','chaud','brulant')),
  status text not null default 'a_contacter'
    check (status in ('a_contacter','contacte','interesse','rdv','proposition','signe','perdu')),
  to_visit boolean not null default true,
  potential_amount numeric(10,2),
  signed_amount numeric(10,2),
  signed_at timestamptz,
  signed_by uuid references auth.users (id) on delete set null,
  next_action text,
  next_action_at date,
  assigned_to uuid references auth.users (id) on delete set null,
  lat double precision,
  lng double precision,
  hook text,                                    -- accroche personnalisée (issue du rapport)
  intel jsonb,                                  -- dernier rapport parsé
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists prospects_status_idx on public.prospects (status);
create index if not exists prospects_city_idx on public.prospects (city);
create index if not exists prospects_next_action_idx on public.prospects (next_action_at);

-- ---------------------------------------------------------------------
-- 5. Historique des interactions (visites, appels, SMS…)
-- ---------------------------------------------------------------------
create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  channel text not null check (channel in ('physique','telephone','sms','email','autre')),
  outcome text,          -- pas_de_reponse | messagerie | barrage | refus | rappel | rdv | visite | note | signe
  disc text check (disc in ('fonceur','analytique','relationnel','prudent')),
  temperature text check (temperature in ('glace','froid','tiede','chaud','brulant')),
  interest smallint check (interest between 1 and 5),
  objection text,
  next_action text,
  next_action_at date,
  notes text,
  duration_sec integer,
  created_at timestamptz not null default now()
);
create index if not exists interactions_prospect_idx on public.interactions (prospect_id, created_at desc);
create index if not exists interactions_user_idx on public.interactions (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 6. Tâches / relances
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid references public.prospects (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  title text not null,
  kind text not null default 'rappel',   -- rappel | repasser | sms | email | audit | rdv | autre
  due_at date not null,
  preferred_slot text,                   -- ex. « 15:00 » quand on change de créneau
  done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists tasks_due_idx on public.tasks (done, due_at);

-- ---------------------------------------------------------------------
-- 7. Prompts de recherche (versionnés) et rapports
-- ---------------------------------------------------------------------
create table if not exists public.research_prompts (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  version integer not null,
  prompt text not null,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (prospect_id, version)
);

create table if not exists public.research_reports (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  prompt_id uuid references public.research_prompts (id) on delete set null,
  raw text not null,
  parsed jsonb not null default '{}'::jsonb,
  source text not null default 'manuel' check (source in ('manuel','api')),
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists research_reports_prospect_idx on public.research_reports (prospect_id, created_at desc);

-- ---------------------------------------------------------------------
-- 8. Scripts personnalisés (surcharges / variantes de /content)
-- ---------------------------------------------------------------------
create table if not exists public.custom_scripts (
  id uuid primary key default gen_random_uuid(),
  sector text not null,
  channel text not null check (channel in ('physique','telephone')),
  base_key text,                    -- ex. « boulangerie:physique » si c'est une surcharge du script d'origine
  title text not null,
  steps jsonb not null default '[]'::jsonb,
  notes text,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  kind text not null,               -- script | objection | secteur
  key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, key)
);

-- ---------------------------------------------------------------------
-- 9. Tournées terrain et sessions d'appels
-- ---------------------------------------------------------------------
create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  day date not null,
  start_time text,
  cities text[] not null default '{}',
  sectors text[] not null default '{}',
  duration_min integer not null default 180,
  prospect_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.call_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  planned_at timestamptz not null,
  duration_min integer not null default 45,
  prospect_ids uuid[] not null default '{}',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 10. Entraînement
-- ---------------------------------------------------------------------
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  code text,                                   -- code à 4 chiffres (mode duo)
  mode text not null check (mode in ('duo','flash','defi','ia')),
  sector text,
  channel text check (channel in ('physique','telephone')),
  difficulty smallint check (difficulty between 1 and 5),
  scenario jsonb,
  seller_id uuid references auth.users (id) on delete set null,
  player_id uuid references auth.users (id) on delete set null,   -- celui qui joue le prospect
  state text not null default 'lobby' check (state in ('lobby','running','evaluating','done','cancelled')),
  scores jsonb,                                -- { accroche: 4, ecoute: 3, … }
  comment text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_sec integer,
  source_prospect_id uuid references public.prospects (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists training_code_idx on public.training_sessions (code) where state <> 'done';

create table if not exists public.flashcard_reviews (
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  card_key text not null,
  ease real not null default 2.5,
  interval_days integer not null default 0,
  reps integer not null default 0,
  last_grade smallint,
  due_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, card_key)
);

-- ---------------------------------------------------------------------
-- 11. updated_at automatique
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['prospects','custom_scripts','training_sessions','app_settings','flashcard_reviews'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 12. Row Level Security : associés uniquement, partout
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','app_settings','prospects','interactions','tasks','research_prompts',
    'research_reports','custom_scripts','favorites','tours','call_sessions',
    'training_sessions','flashcard_reviews'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "associes_all" on public.%I', t);
    execute format(
      'create policy "associes_all" on public.%I for all to authenticated using (public.is_associate()) with check (public.is_associate())',
      t
    );
  end loop;
end $$;

-- La liste des associés n'est lisible par personne via l'API.
alter table public.associates enable row level security;
drop policy if exists "associes_read_self" on public.associates;
create policy "associes_read_self" on public.associates
  for select to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

-- ---------------------------------------------------------------------
-- 13. Stockage des photos (bucket privé)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('prospect-photos', 'prospect-photos', false)
on conflict (id) do nothing;

drop policy if exists "photos_associes_select" on storage.objects;
drop policy if exists "photos_associes_insert" on storage.objects;
drop policy if exists "photos_associes_update" on storage.objects;
drop policy if exists "photos_associes_delete" on storage.objects;

create policy "photos_associes_select" on storage.objects
  for select to authenticated using (bucket_id = 'prospect-photos' and public.is_associate());
create policy "photos_associes_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'prospect-photos' and public.is_associate());
create policy "photos_associes_update" on storage.objects
  for update to authenticated using (bucket_id = 'prospect-photos' and public.is_associate());
create policy "photos_associes_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'prospect-photos' and public.is_associate());

-- ---------------------------------------------------------------------
-- 14. Temps réel (mode Duo + rafraîchissement des listes)
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['training_sessions','prospects','interactions','tasks'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object or undefined_object then null;
    end;
  end loop;
end $$;

alter table public.training_sessions replica identity full;
