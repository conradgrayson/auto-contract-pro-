-- Créer la table pour les contrats partenaires
CREATE TABLE public.contrats_partenaires (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    nom_partenaire TEXT NOT NULL,
    email_partenaire TEXT NOT NULL,
    telephone_partenaire TEXT NOT NULL,
    adresse_partenaire TEXT NOT NULL,
    type_partenariat TEXT NOT NULL, -- exemple: 'fournisseur', 'client_entreprise', 'assurance', etc.
    objet_contrat TEXT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    montant_total NUMERIC NOT NULL DEFAULT 0,
    statut TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'expire', 'suspendu', 'termine')),
    conditions_particulieres TEXT,
    numero_contrat TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une séquence pour les numéros de contrats partenaires
CREATE SEQUENCE IF NOT EXISTS contrat_partenaire_number_seq START 1;

-- Créer une fonction pour générer les numéros de contrats partenaires
CREATE OR REPLACE FUNCTION public.generate_contrat_partenaire_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_contrat := 'PART-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('contrat_partenaire_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour générer automatiquement les numéros
CREATE TRIGGER trigger_generate_contrat_partenaire_number
BEFORE INSERT ON public.contrats_partenaires
FOR EACH ROW
EXECUTE FUNCTION public.generate_contrat_partenaire_number();

-- Activer RLS
ALTER TABLE public.contrats_partenaires ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour permettre à tous les utilisateurs authentifiés de gérer les contrats partenaires
CREATE POLICY "All authenticated users can view all contrats partenaires"
ON public.contrats_partenaires
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can create contrats partenaires"
ON public.contrats_partenaires
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "All authenticated users can update contrats partenaires"
ON public.contrats_partenaires
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can delete contrats partenaires"
ON public.contrats_partenaires
FOR DELETE
TO authenticated
USING (true);