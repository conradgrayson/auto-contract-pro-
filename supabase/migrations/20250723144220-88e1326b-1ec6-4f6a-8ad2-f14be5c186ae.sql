-- Mettre à jour les politiques RLS pour permettre à tous les utilisateurs authentifiés de créer des contrats
DROP POLICY "Authenticated users can create contracts" ON public.contracts;

CREATE POLICY "All authenticated users can create contracts" 
ON public.contracts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Mettre à jour la politique de lecture pour permettre à tous de voir tous les contrats
DROP POLICY "All authenticated users can view all contracts" ON public.contracts;

CREATE POLICY "All authenticated users can view all contracts" 
ON public.contracts 
FOR SELECT 
TO authenticated
USING (true);

-- Mettre à jour la politique de modification pour permettre à tous de modifier
DROP POLICY "Users can update their own contracts" ON public.contracts;

CREATE POLICY "All authenticated users can update contracts" 
ON public.contracts 
FOR UPDATE 
TO authenticated
USING (true);

-- Mettre à jour la politique de suppression pour permettre à tous de supprimer
DROP POLICY "Users can delete their own contracts" ON public.contracts;

CREATE POLICY "All authenticated users can delete contracts" 
ON public.contracts 
FOR DELETE 
TO authenticated
USING (true);