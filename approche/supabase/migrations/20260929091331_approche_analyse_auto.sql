-- Analyse automatique d'un nouveau client (recherche web + script sur mesure).
alter table public.prospects
  add column if not exists analysis_status text check (analysis_status in ('en_cours','fait','erreur')),
  add column if not exists analysis_step text,
  add column if not exists analysis_error text,
  add column if not exists analysis_at timestamptz;

-- Un script peut appartenir à un client précis (script unique issu de l'analyse).
alter table public.custom_scripts
  add column if not exists prospect_id uuid references public.prospects (id) on delete cascade;
create index if not exists custom_scripts_prospect_idx on public.custom_scripts (prospect_id);

do $$
begin
  alter publication supabase_realtime add table public.custom_scripts;
exception when duplicate_object or undefined_object then null;
end $$;
