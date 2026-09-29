-- Un compte par associé, choisi après la connexion au compte commun MJAGENCY.
-- Les comptes eux-mêmes se créent dans Authentication → Users, avec le même
-- mot de passe que le compte commun (voir README, « Créer les comptes »).
insert into public.associates (email, display_name) values
  ('mjagency.officiel+jeremy@gmail.com', 'Jérémy'),
  ('mjagency.officiel+matheis@gmail.com', 'Matheis')
on conflict (email) do update set display_name = excluded.display_name;
