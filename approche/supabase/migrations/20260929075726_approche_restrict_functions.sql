-- Déjà intégré à 20260929075620_approche_init.sql pour les nouvelles bases ;
-- gardé séparément pour coller à l'historique du projet Supabase « approche ».
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_associate() from public, anon;
grant execute on function public.is_associate() to authenticated;
