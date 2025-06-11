
-- Créer une séquence pour les numéros de contrat/facture (6 chiffres)
CREATE SEQUENCE IF NOT EXISTS contract_facture_number_seq START 1;

-- Modifier la fonction pour générer des numéros à 6 chiffres
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.numerocontrat := LPAD(NEXTVAL('contract_facture_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$function$;

-- Ajouter une colonne pour la réduction dans les contrats
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS reduction_type TEXT DEFAULT 'aucune',
ADD COLUMN IF NOT EXISTS reduction_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS montant_reduction NUMERIC DEFAULT 0;

-- Mettre à jour les contrats existants avec des numéros à 6 chiffres
UPDATE public.contracts 
SET numerocontrat = LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 6, '0')
WHERE numerocontrat NOT SIMILAR TO '[0-9]{6}';
