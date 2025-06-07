
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
      setVehicles(data || []);
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
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          ...vehicleData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => [data, ...prev]);
      toast({
        title: "Véhicule ajouté",
        description: "Le nouveau véhicule a été ajouté avec succès.",
      });
      
      return data;
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
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => prev.map(v => v.id === id ? data : v));
      toast({
        title: "Véhicule modifié",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
      
      return data;
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
