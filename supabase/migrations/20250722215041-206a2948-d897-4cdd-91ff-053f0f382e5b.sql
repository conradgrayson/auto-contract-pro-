-- Ajouter les colonnes manquantes pour les réductions dans la table contracts
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS reduction_type TEXT DEFAULT 'aucune',
ADD COLUMN IF NOT EXISTS reduction_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS montant_reduction NUMERIC DEFAULT 0;