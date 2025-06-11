
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Chauffeur {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  telephone: string;
  numeroPermis: string;
  dateExpiration: string;
  statut: 'actif' | 'inactif';
  referenceChauffeur: string;
  dateCreation: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseChauffeurs = () => {
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchChauffeurs();
    }
  }, [user]);

  const fetchChauffeurs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chauffeurs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapper les données de la base vers notre interface
      const mappedChauffeurs = (data || []).map(chauffeur => ({
        id: chauffeur.id,
        user_id: chauffeur.user_id,
        nom: chauffeur.nom,
        prenom: chauffeur.prenom,
        telephone: chauffeur.telephone,
        numeroPermis: chauffeur.numeropermis,
        dateExpiration: chauffeur.dateexpiration,
        statut: chauffeur.statut as 'actif' | 'inactif',
        referenceChauffeur: chauffeur.referencechauffeur,
        dateCreation: chauffeur.created_at,
        created_at: chauffeur.created_at,
        updated_at: chauffeur.updated_at,
      }));
      
      setChauffeurs(mappedChauffeurs);
    } catch (error) {
      console.error('Erreur lors de la récupération des chauffeurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addChauffeur = async (chauffeurData: Omit<Chauffeur, 'id' | 'dateCreation' | 'referenceChauffeur' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      const dbData = {
        user_id: user.id,
        nom: chauffeurData.nom,
        prenom: chauffeurData.prenom,
        telephone: chauffeurData.telephone,
        numeropermis: chauffeurData.numeroPermis,
        dateexpiration: chauffeurData.dateExpiration,
        statut: chauffeurData.statut,
        // Ne pas inclure referencechauffeur car il est auto-généré par le trigger
      };

      const { data, error } = await supabase
        .from('chauffeurs')
        .insert(dbData as any) // Type assertion pour contourner la contrainte referencechauffeur
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedChauffeur = {
        id: data.id,
        user_id: data.user_id,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        numeroPermis: data.numeropermis,
        dateExpiration: data.dateexpiration,
        statut: data.statut as 'actif' | 'inactif',
        referenceChauffeur: data.referencechauffeur,
        dateCreation: data.created_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setChauffeurs(prev => [mappedChauffeur, ...prev]);
      return mappedChauffeur;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du chauffeur:', error);
      throw error;
    }
  };

  const updateChauffeur = async (id: string, chauffeurData: Omit<Chauffeur, 'id' | 'dateCreation' | 'referenceChauffeur' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      const dbData = {
        nom: chauffeurData.nom,
        prenom: chauffeurData.prenom,
        telephone: chauffeurData.telephone,
        numeropermis: chauffeurData.numeroPermis,
        dateexpiration: chauffeurData.dateExpiration,
        statut: chauffeurData.statut,
      };

      const { data, error } = await supabase
        .from('chauffeurs')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedChauffeur = {
        id: data.id,
        user_id: data.user_id,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        numeroPermis: data.numeropermis,
        dateExpiration: data.dateexpiration,
        statut: data.statut as 'actif' | 'inactif',
        referenceChauffeur: data.referencechauffeur,
        dateCreation: data.created_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setChauffeurs(prev => prev.map(c => c.id === id ? mappedChauffeur : c));
      return mappedChauffeur;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du chauffeur:', error);
      throw error;
    }
  };

  const deleteChauffeur = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chauffeurs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setChauffeurs(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du chauffeur:', error);
      throw error;
    }
  };

  return {
    chauffeurs,
    loading,
    addChauffeur,
    updateChauffeur,
    deleteChauffeur,
    refreshChauffeurs: fetchChauffeurs,
  };
};
