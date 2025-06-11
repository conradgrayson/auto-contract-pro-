
-- Créer une fonction pour générer la référence chauffeur
CREATE OR REPLACE FUNCTION public.generate_chauffeur_reference()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.referencechauffeur := 'CHAUF-' || LPAD(NEXTVAL('chauffeur_ref_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Créer le trigger pour générer automatiquement la référence chauffeur
CREATE TRIGGER set_chauffeur_reference
  BEFORE INSERT ON public.chauffeurs
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_chauffeur_reference();

-- Créer les politiques RLS pour la table chauffeurs
CREATE POLICY "All authenticated users can view all chauffeurs" 
  ON public.chauffeurs 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create chauffeurs" 
  ON public.chauffeurs 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chauffeurs" 
  ON public.chauffeurs 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chauffeurs" 
  ON public.chauffeurs 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques pour le bucket des photos
CREATE POLICY "Allow authenticated users to upload ID photos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'client-id-photos');

CREATE POLICY "Allow authenticated users to view ID photos" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'client-id-photos');

CREATE POLICY "Allow authenticated users to update their ID photos" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'client-id-photos');

CREATE POLICY "Allow authenticated users to delete their ID photos" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'client-id-photos');
