-- Add time fields to partner contracts table
ALTER TABLE public.contrats_partenaires 
ADD COLUMN heure_debut TIME,
ADD COLUMN heure_fin TIME;

-- Add comment to explain the new columns
COMMENT ON COLUMN public.contrats_partenaires.heure_debut IS 'Heure de début du contrat partenaire';
COMMENT ON COLUMN public.contrats_partenaires.heure_fin IS 'Heure de fin du contrat partenaire';