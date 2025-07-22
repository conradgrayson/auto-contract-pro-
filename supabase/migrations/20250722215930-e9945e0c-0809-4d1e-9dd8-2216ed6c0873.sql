-- Nettoyer la table contracts en supprimant la colonne chauffeurid dupliquée
ALTER TABLE public.contracts DROP COLUMN IF EXISTS chauffeurid;