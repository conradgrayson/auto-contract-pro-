
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Chauffeur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  numeropermis: string;
  dateexpiration: string;
  statut: 'actif' | 'inactif';
  referencechauffeur: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseChauffeurs = () => {
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchChauffeurs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chauffeurs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedChauffeurs = (data || []).map(chauffeur => ({
        id: chauffeur.id,
        nom: chauffeur.nom,
        prenom: chauffeur.prenom,
        telephone: chauffeur.telephone,
        numeropermis: chauffeur.numeropermis,
        dateexpiration: chauffeur.dateexpiration,
        statut: chauffeur.statut as 'actif' | 'inactif',
        referencechauffeur: chauffeur.referencechauffeur,
        created_at: chauffeur.created_at,
        updated_at: chauffeur.updated_at,
      }));
      
      setChauffeurs(mappedChauffeurs);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les chauffeurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addChauffeur = async (chauffeurData: Omit<Chauffeur, 'id' | 'created_at' | 'updated_at' | 'referencechauffeur'>) => {
    if (!user) return null;

    try {
      const dbData = {
        user_id: user.id,
        nom: chauffeurData.nom,
        prenom: chauffeurData.prenom,
        telephone: chauffeurData.telephone,
        numeropermis: chauffeurData.numeropermis,
        dateexpiration: chauffeurData.dateexpiration,
        statut: chauffeurData.statut,
      };

      const { data, error } = await supabase
        .from('chauffeurs')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      const mappedChauffeur = {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        numeropermis: data.numeropermis,
        dateexpiration: data.dateexpiration,
        statut: data.statut as 'actif' | 'inactif',
        referencechauffeur: data.referencechauffeur,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setChauffeurs(prev => [mappedChauffeur, ...prev]);
      toast({
        title: "Chauffeur créé",
        description: `Le chauffeur ${data.referencechauffeur} a été créé avec succès.`,
      });
      
      return mappedChauffeur;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le chauffeur",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateChauffeur = async (id: string, chauffeurData: Omit<Chauffeur, 'id' | 'created_at' | 'updated_at' | 'referencechauffeur'>) => {
    if (!user) return null;

    try {
      const dbData = {
        nom: chauffeurData.nom,
        prenom: chauffeurData.prenom,
        telephone: chauffeurData.telephone,
        numeropermis: chauffeurData.numeropermis,
        dateexpiration: chauffeurData.dateexpiration,
        statut: chauffeurData.statut,
      };

      const { data, error } = await supabase
        .from('chauffeurs')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedChauffeur = {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        numeropermis: data.numeropermis,
        dateexpiration: data.dateexpiration,
        statut: data.statut as 'actif' | 'inactif',
        referencechauffeur: data.referencechauffeur,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setChauffeurs(prev => prev.map(c => c.id === id ? mappedChauffeur : c));
      toast({
        title: "Chauffeur modifié",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
      
      return mappedChauffeur;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le chauffeur",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteChauffeur = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chauffeurs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setChauffeurs(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Chauffeur supprimé",
        description: "Le chauffeur a été supprimé avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le chauffeur",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchChauffeurs();
    }
  }, [user]);

  return {
    chauffeurs,
    loading,
    addChauffeur,
    updateChauffeur,
    deleteChauffeur,
    refetch: fetchChauffeurs
  };
};
