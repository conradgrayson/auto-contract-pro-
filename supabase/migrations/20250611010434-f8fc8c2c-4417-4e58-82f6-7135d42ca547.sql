
-- Créer un bucket de stockage pour les documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Créer les politiques pour le bucket documents
CREATE POLICY "Tous peuvent voir les documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Utilisateurs authentifiés peuvent uploader" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Utilisateurs peuvent mettre à jour leurs documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Utilisateurs peuvent supprimer leurs documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Ajouter les colonnes pour les images dans la table clients
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS photo_carte_id TEXT,
ADD COLUMN IF NOT EXISTS url_carte_id TEXT;

-- Ajouter les colonnes pour les images dans la table chauffeurs
ALTER TABLE public.chauffeurs 
ADD COLUMN IF NOT EXISTS photo_permis TEXT,
ADD COLUMN IF NOT EXISTS url_permis TEXT;

-- Ajouter les colonnes pour la location avec chauffeur dans la table contracts
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS avec_chauffeur BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS chauffeur_id UUID REFERENCES public.chauffeurs(id);
