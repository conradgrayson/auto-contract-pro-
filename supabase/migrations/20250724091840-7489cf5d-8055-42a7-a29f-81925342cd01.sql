-- Mettre à jour les politiques RLS pour permettre à tous les utilisateurs authentifiés d'accéder à toutes les données

-- Clients: Permettre à tous les utilisateurs authentifiés de voir et gérer tous les clients
DROP POLICY IF EXISTS "All authenticated users can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;

CREATE POLICY "All authenticated users can view all clients" 
ON public.clients 
FOR SELECT 
USING (true);

CREATE POLICY "All authenticated users can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "All authenticated users can update clients" 
ON public.clients 
FOR UPDATE 
USING (true);

CREATE POLICY "All authenticated users can delete clients" 
ON public.clients 
FOR DELETE 
USING (true);

-- Véhicules: Permettre à tous les utilisateurs authentifiés de voir et gérer tous les véhicules
DROP POLICY IF EXISTS "All authenticated users can view all vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can create vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON public.vehicles;

CREATE POLICY "All authenticated users can view all vehicles" 
ON public.vehicles 
FOR SELECT 
USING (true);

CREATE POLICY "All authenticated users can create vehicles" 
ON public.vehicles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "All authenticated users can update vehicles" 
ON public.vehicles 
FOR UPDATE 
USING (true);

CREATE POLICY "All authenticated users can delete vehicles" 
ON public.vehicles 
FOR DELETE 
USING (true);

-- Chauffeurs: Permettre à tous les utilisateurs authentifiés de voir et gérer tous les chauffeurs
DROP POLICY IF EXISTS "All authenticated users can view all chauffeurs" ON public.chauffeurs;
DROP POLICY IF EXISTS "Authenticated users can create chauffeurs" ON public.chauffeurs;
DROP POLICY IF EXISTS "Users can update their own chauffeurs" ON public.chauffeurs;
DROP POLICY IF EXISTS "Users can delete their own chauffeurs" ON public.chauffeurs;

CREATE POLICY "All authenticated users can view all chauffeurs" 
ON public.chauffeurs 
FOR SELECT 
USING (true);

CREATE POLICY "All authenticated users can create chauffeurs" 
ON public.chauffeurs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "All authenticated users can update chauffeurs" 
ON public.chauffeurs 
FOR UPDATE 
USING (true);

CREATE POLICY "All authenticated users can delete chauffeurs" 
ON public.chauffeurs 
FOR DELETE 
USING (true);

-- Contract Terms: Permettre à tous les utilisateurs authentifiés de voir et gérer tous les termes de contrat
DROP POLICY IF EXISTS "Users can view their own contract terms" ON public.contract_terms;
DROP POLICY IF EXISTS "Users can create their own contract terms" ON public.contract_terms;
DROP POLICY IF EXISTS "Users can update their own contract terms" ON public.contract_terms;
DROP POLICY IF EXISTS "Users can delete their own contract terms" ON public.contract_terms;

CREATE POLICY "All authenticated users can view all contract terms" 
ON public.contract_terms 
FOR SELECT 
USING (true);

CREATE POLICY "All authenticated users can create contract terms" 
ON public.contract_terms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "All authenticated users can update contract terms" 
ON public.contract_terms 
FOR UPDATE 
USING (true);

CREATE POLICY "All authenticated users can delete contract terms" 
ON public.contract_terms 
FOR DELETE 
USING (true);