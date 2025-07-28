import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface ContratPartenaire {
  id: string;
  user_id: string;
  nom_partenaire: string;
  email_partenaire: string;
  telephone_partenaire: string;
  adresse_partenaire: string;
  type_partenariat: string;
  objet_contrat: string;
  date_debut: string;
  date_fin: string;
  heure_debut?: string;
  heure_fin?: string;
  montant_total: number;
  statut: string;
  conditions_particulieres?: string;
  numero_contrat: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseContratsPartenaires = () => {
  const [contratsPartenaires, setContratsPartenaires] = useState<ContratPartenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchContratsPartenaires = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contrats_partenaires')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des contrats partenaires:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les contrats partenaires",
          variant: "destructive",
        });
        return;
      }

      const mappedData: ContratPartenaire[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        nom_partenaire: item.nom_partenaire,
        email_partenaire: item.email_partenaire,
        telephone_partenaire: item.telephone_partenaire,
        adresse_partenaire: item.adresse_partenaire,
        type_partenariat: item.type_partenariat,
        objet_contrat: item.objet_contrat,
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        heure_debut: item.heure_debut,
        heure_fin: item.heure_fin,
        montant_total: item.montant_total,
        statut: item.statut,
        conditions_particulieres: item.conditions_particulieres,
        numero_contrat: item.numero_contrat,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      setContratsPartenaires(mappedData);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des contrats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContratPartenaire = async (contratData: Omit<ContratPartenaire, 'id' | 'numero_contrat' | 'created_at' | 'updated_at'>) => {
    try {
      const dataToInsert = {
        user_id: contratData.user_id,
        nom_partenaire: contratData.nom_partenaire,
        email_partenaire: contratData.email_partenaire,
        telephone_partenaire: contratData.telephone_partenaire,
        adresse_partenaire: contratData.adresse_partenaire,
        type_partenariat: contratData.type_partenariat,
        objet_contrat: contratData.objet_contrat,
        date_debut: contratData.date_debut,
        date_fin: contratData.date_fin,
        heure_debut: contratData.heure_debut || null,
        heure_fin: contratData.heure_fin || null,
        montant_total: contratData.montant_total,
        statut: contratData.statut,
        conditions_particulieres: contratData.conditions_particulieres || null,
        numero_contrat: 'TEMP', // Le trigger générera le vrai numéro
      };

      const { data, error } = await supabase
        .from('contrats_partenaires')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du contrat partenaire:', error);
        toast({
          title: "Erreur",
          description: `Impossible d'ajouter le contrat partenaire: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const newContrat: ContratPartenaire = {
        id: data.id,
        user_id: data.user_id,
        nom_partenaire: data.nom_partenaire,
        email_partenaire: data.email_partenaire,
        telephone_partenaire: data.telephone_partenaire,
        adresse_partenaire: data.adresse_partenaire,
        type_partenariat: data.type_partenariat,
        objet_contrat: data.objet_contrat,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        heure_debut: data.heure_debut,
        heure_fin: data.heure_fin,
        montant_total: data.montant_total,
        statut: data.statut,
        conditions_particulieres: data.conditions_particulieres,
        numero_contrat: data.numero_contrat,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setContratsPartenaires(prev => [newContrat, ...prev]);
      
      toast({
        title: "Succès",
        description: "Contrat partenaire ajouté avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du contrat",
        variant: "destructive",
      });
    }
  };

  const updateContratPartenaire = async (id: string, contratData: Omit<ContratPartenaire, 'id' | 'numero_contrat' | 'created_at' | 'updated_at'>) => {
    try {
      const dataToUpdate = {
        nom_partenaire: contratData.nom_partenaire,
        email_partenaire: contratData.email_partenaire,
        telephone_partenaire: contratData.telephone_partenaire,
        adresse_partenaire: contratData.adresse_partenaire,
        type_partenariat: contratData.type_partenariat,
        objet_contrat: contratData.objet_contrat,
        date_debut: contratData.date_debut,
        date_fin: contratData.date_fin,
        heure_debut: contratData.heure_debut || null,
        heure_fin: contratData.heure_fin || null,
        montant_total: contratData.montant_total,
        statut: contratData.statut,
        conditions_particulieres: contratData.conditions_particulieres || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('contrats_partenaires')
        .update(dataToUpdate)
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour du contrat partenaire:', error);
        toast({
          title: "Erreur",
          description: `Impossible de mettre à jour le contrat partenaire: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      await fetchContratsPartenaires();
      
      toast({
        title: "Succès",
        description: "Contrat partenaire mis à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du contrat",
        variant: "destructive",
      });
    }
  };

  const deleteContratPartenaire = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contrats_partenaires')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression du contrat partenaire:', error);
        toast({
          title: "Erreur",
          description: `Impossible de supprimer le contrat partenaire: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      setContratsPartenaires(prev => prev.filter(contrat => contrat.id !== id));
      
      toast({
        title: "Succès",
        description: "Contrat partenaire supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du contrat",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchContratsPartenaires();
    }
  }, [user]);

  return {
    contratsPartenaires,
    loading,
    addContratPartenaire,
    updateContratPartenaire,
    deleteContratPartenaire,
    refetch: fetchContratsPartenaires,
  };
};