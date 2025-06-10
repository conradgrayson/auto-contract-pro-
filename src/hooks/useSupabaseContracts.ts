
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Contract {
  id: string;
  clientId: string;
  vehicleId: string;
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
  caution: number;
  kilometrageDepart?: number;
  kilometrageRetour?: number;
  statut: 'actif' | 'termine' | 'annule';
  numeroContrat: string;
  etatVehiculeDepart?: string;
  etatVehiculeRetour?: string;
  notes?: string;
  dateCreation: string;
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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapper les données de la base vers notre interface
      const mappedContracts = (data || []).map(contract => ({
        id: contract.id,
        clientId: contract.clientid,
        vehicleId: contract.vehicleid,
        dateDebut: contract.datedebut,
        dateFin: contract.datefin,
        prixTotal: contract.prixtotal,
        caution: contract.caution,
        kilometrageDepart: contract.kilometragedepart,
        kilometrageRetour: contract.kilometrageretour,
        statut: contract.statut as 'actif' | 'termine' | 'annule',
        numeroContrat: contract.numerocontrat,
        etatVehiculeDepart: contract.etatvehiculedepart,
        etatVehiculeRetour: contract.etatvehiculeretour,
        notes: contract.notes,
        dateCreation: contract.created_at,
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

  const addContract = async (contractData: Omit<Contract, 'id' | 'dateCreation' | 'numeroContrat'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      // Le numerocontrat sera généré automatiquement par le trigger
      const dbData = {
        user_id: user.id,
        clientid: contractData.clientId,
        vehicleid: contractData.vehicleId,
        datedebut: contractData.dateDebut,
        datefin: contractData.dateFin,
        prixtotal: contractData.prixTotal,
        caution: contractData.caution,
        kilometragedepart: contractData.kilometrageDepart,
        kilometrageretour: contractData.kilometrageRetour,
        statut: contractData.statut,
        etatvehiculedepart: contractData.etatVehiculeDepart,
        etatvehiculeretour: contractData.etatVehiculeRetour,
        notes: contractData.notes,
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedContract = {
        id: data.id,
        clientId: data.clientid,
        vehicleId: data.vehicleid,
        dateDebut: data.datedebut,
        dateFin: data.datefin,
        prixTotal: data.prixtotal,
        caution: data.caution,
        kilometrageDepart: data.kilometragedepart,
        kilometrageRetour: data.kilometrageretour,
        statut: data.statut as 'actif' | 'termine' | 'annule',
        numeroContrat: data.numerocontrat,
        etatVehiculeDepart: data.etatvehiculedepart,
        etatVehiculeRetour: data.etatvehiculeretour,
        notes: data.notes,
        dateCreation: data.created_at,
      };

      setContracts(prev => [mappedContract, ...prev]);
      toast({
        title: "Contrat créé",
        description: `Le contrat ${data.numerocontrat} a été créé avec succès.`,
      });
      
      return mappedContract;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le contrat",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContract = async (id: string, contractData: Omit<Contract, 'id' | 'dateCreation' | 'numeroContrat'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      const dbData = {
        clientid: contractData.clientId,
        vehicleid: contractData.vehicleId,
        datedebut: contractData.dateDebut,
        datefin: contractData.dateFin,
        prixtotal: contractData.prixTotal,
        caution: contractData.caution,
        kilometragedepart: contractData.kilometrageDepart,
        kilometrageretour: contractData.kilometrageRetour,
        statut: contractData.statut,
        etatvehiculedepart: contractData.etatVehiculeDepart,
        etatvehiculeretour: contractData.etatVehiculeRetour,
        notes: contractData.notes,
      };

      const { data, error } = await supabase
        .from('contracts')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedContract = {
        id: data.id,
        clientId: data.clientid,
        vehicleId: data.vehicleid,
        dateDebut: data.datedebut,
        dateFin: data.datefin,
        prixTotal: data.prixtotal,
        caution: data.caution,
        kilometrageDepart: data.kilometragedepart,
        kilometrageRetour: data.kilometrageretour,
        statut: data.statut as 'actif' | 'termine' | 'annule',
        numeroContrat: data.numerocontrat,
        etatVehiculeDepart: data.etatvehiculedepart,
        etatVehiculeRetour: data.etatvehiculeretour,
        notes: data.notes,
        dateCreation: data.created_at,
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
        .eq('id', id);

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
