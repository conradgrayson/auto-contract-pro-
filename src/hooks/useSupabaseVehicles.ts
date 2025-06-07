
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  annee: number;
  couleur: string;
  typeCarburant: string;
  nombrePlaces: number;
  kilometrage: number;
  prixParJour: number;
  statut: 'disponible' | 'loue' | 'maintenance';
  photos?: string[];
  equipements?: string[];
  description?: string;
}

export const useSupabaseVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchVehicles = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapper les données de la base vers notre interface
      const mappedVehicles = (data || []).map(vehicle => ({
        id: vehicle.id,
        marque: vehicle.marque,
        modele: vehicle.modele,
        immatriculation: vehicle.immatriculation,
        annee: vehicle.annee,
        couleur: vehicle.couleur,
        typeCarburant: vehicle.typecarburant,
        nombrePlaces: vehicle.nombreplaces,
        kilometrage: vehicle.kilometrage,
        prixParJour: vehicle.prixparjour,
        statut: vehicle.statut,
        photos: vehicle.photos || [],
        equipements: vehicle.equipements || [],
        description: vehicle.description || '',
      }));
      
      setVehicles(mappedVehicles);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les véhicules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      const dbData = {
        user_id: user.id,
        marque: vehicleData.marque,
        modele: vehicleData.modele,
        immatriculation: vehicleData.immatriculation,
        annee: vehicleData.annee,
        couleur: vehicleData.couleur,
        typecarburant: vehicleData.typeCarburant,
        nombreplaces: vehicleData.nombrePlaces,
        kilometrage: vehicleData.kilometrage,
        prixparjour: vehicleData.prixParJour,
        statut: vehicleData.statut,
        photos: vehicleData.photos || [],
        equipements: vehicleData.equipements || [],
        description: vehicleData.description || '',
      };

      const { data, error } = await supabase
        .from('vehicles')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedVehicle = {
        id: data.id,
        marque: data.marque,
        modele: data.modele,
        immatriculation: data.immatriculation,
        annee: data.annee,
        couleur: data.couleur,
        typeCarburant: data.typecarburant,
        nombrePlaces: data.nombreplaces,
        kilometrage: data.kilometrage,
        prixParJour: data.prixparjour,
        statut: data.statut,
        photos: data.photos || [],
        equipements: data.equipements || [],
        description: data.description || '',
      };

      setVehicles(prev => [mappedVehicle, ...prev]);
      toast({
        title: "Véhicule ajouté",
        description: "Le nouveau véhicule a été ajouté avec succès.",
      });
      
      return mappedVehicle;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le véhicule",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateVehicle = async (id: string, vehicleData: Omit<Vehicle, 'id'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      const dbData = {
        marque: vehicleData.marque,
        modele: vehicleData.modele,
        immatriculation: vehicleData.immatriculation,
        annee: vehicleData.annee,
        couleur: vehicleData.couleur,
        typecarburant: vehicleData.typeCarburant,
        nombreplaces: vehicleData.nombrePlaces,
        kilometrage: vehicleData.kilometrage,
        prixparjour: vehicleData.prixParJour,
        statut: vehicleData.statut,
        photos: vehicleData.photos || [],
        equipements: vehicleData.equipements || [],
        description: vehicleData.description || '',
      };

      const { data, error } = await supabase
        .from('vehicles')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedVehicle = {
        id: data.id,
        marque: data.marque,
        modele: data.modele,
        immatriculation: data.immatriculation,
        annee: data.annee,
        couleur: data.couleur,
        typeCarburant: data.typecarburant,
        nombrePlaces: data.nombreplaces,
        kilometrage: data.kilometrage,
        prixParJour: data.prixparjour,
        statut: data.statut,
        photos: data.photos || [],
        equipements: data.equipements || [],
        description: data.description || '',
      };

      setVehicles(prev => prev.map(v => v.id === id ? mappedVehicle : v));
      toast({
        title: "Véhicule modifié",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
      
      return mappedVehicle;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le véhicule",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  return {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles
  };
};
