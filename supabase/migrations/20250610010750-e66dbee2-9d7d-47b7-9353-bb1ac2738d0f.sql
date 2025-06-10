
-- Modifier la table clients pour ajouter les nouvelles informations
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS numerocarteid text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS photocarteid text;

-- Modifier la table contracts pour ajouter les nouvelles informations
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS conditions text;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS adresselivraison text;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS chauffeurid text;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS heurerecuperation time;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS heurerendu time;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS niveaucarburantdepart text;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS niveaucarburantretour text;

-- Créer une table pour les chauffeurs
CREATE TABLE IF NOT EXISTS public.chauffeurs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  numeropermis text NOT NULL,
  dateexpiration date NOT NULL,
  referencechauffeur text NOT NULL UNIQUE,
  statut text NOT NULL DEFAULT 'actif',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Créer une séquence pour les références chauffeurs
CREATE SEQUENCE IF NOT EXISTS chauffeur_ref_seq START 1;

-- Ajouter les politiques RLS pour la table chauffeurs
ALTER TABLE public.chauffeurs ENABLE ROW LEVEL SECURITY;

-- Créer un bucket pour les photos des cartes d'identité
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-id-photos', 'client-id-photos', true)
ON CONFLICT (id) DO NOTHING;
