
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Contract {
  id: string;
  clientid: string;
  vehicleid: string;
  numerocontrat: string;
  datedebut: string;
  datefin: string;
  prixtotal: number;
  caution: number;
  statut: 'actif' | 'termine' | 'annule';
  etatvehiculedepart?: string;
  etatvehiculeretour?: string;
  kilometragedepart?: number;
  kilometrageretour?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations avec les autres tables
  client?: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  vehicle?: {
    marque: string;
    modele: string;
    immatriculation: string;
    prixparjour: number;
  };
}

export const useSupabaseContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchContracts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          clients:clientid (nom, prenom, email, telephone),
          vehicles:vehicleid (marque, modele, immatriculation, prixparjour)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedContracts: Contract[] = (data || []).map(contract => ({
        ...contract,
        statut: contract.statut as 'actif' | 'termine' | 'annule',
        client: contract.clients,
        vehicle: contract.vehicles,
      }));
      
      setContracts(mappedContracts);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contrats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContract = async (contractData: {
    clientid: string;
    vehicleid: string;
    datedebut: string;
    datefin: string;
    prixtotal: number;
    caution?: number;
    statut?: 'actif' | 'termine' | 'annule';
    notes?: string;
  }) => {
    if (!user) return null;

    try {
      // Préparer les données pour l'insertion en excluant numerocontrat (généré par le trigger)
      const insertData = {
        user_id: user.id,
        clientid: contractData.clientid,
        vehicleid: contractData.vehicleid,
        datedebut: contractData.datedebut,
        datefin: contractData.datefin,
        prixtotal: contractData.prixtotal,
        caution: contractData.caution || 300000,
        statut: contractData.statut || 'actif',
        notes: contractData.notes || null,
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert(insertData)
        .select(`
          *,
          clients:clientid (nom, prenom, email, telephone),
          vehicles:vehicleid (marque, modele, immatriculation, prixparjour)
        `)
        .single();

      if (error) throw error;

      const mappedContract: Contract = {
        ...data,
        statut: data.statut as 'actif' | 'termine' | 'annule',
        client: data.clients,
        vehicle: data.vehicles,
      };

      setContracts(prev => [mappedContract, ...prev]);
      toast({
        title: "Contrat créé",
        description: "Le nouveau contrat a été créé avec succès.",
      });
      
      return mappedContract;
    } catch (error: any) {
      console.error('Erreur lors de la création du contrat:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le contrat",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContract = async (id: string, contractData: Partial<Contract>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('contracts')
        .update(contractData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          clients:clientid (nom, prenom, email, telephone),
          vehicles:vehicleid (marque, modele, immatriculation, prixparjour)
        `)
        .single();

      if (error) throw error;

      const mappedContract: Contract = {
        ...data,
        statut: data.statut as 'actif' | 'termine' | 'annule',
        client: data.clients,
        vehicle: data.vehicles,
      };

      setContracts(prev => prev.map(c => c.id === id ? mappedContract : c));
      toast({
        title: "Contrat modifié",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
      
      return mappedContract;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le contrat",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteContract = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setContracts(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Contrat supprimé",
        description: "Le contrat a été supprimé avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contrat",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user]);

  return {
    contracts,
    loading,
    addContract,
    updateContract,
    deleteContract,
    refetch: fetchContracts
  };
};
