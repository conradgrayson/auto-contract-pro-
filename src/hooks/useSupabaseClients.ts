
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  numeroPermis: string;
  dateNaissance: string;
  statut: 'actif' | 'inactif';
  dateInscription: string;
  numeroCarteId?: string;
  photoCarteId?: string;
  urlCarteId?: string;
}

export const useSupabaseClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapper les données de la base vers notre interface
      const mappedClients = (data || []).map(client => ({
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
        ville: client.ville,
        codePostal: client.codepostal,
        numeroPermis: client.numeropermis,
        dateNaissance: client.datenaissance,
        statut: client.statut as 'actif' | 'inactif',
        dateInscription: client.dateinscription,
        numeroCarteId: client.numerocarteid || undefined,
        photoCarteId: client.photo_carte_id || undefined,
        urlCarteId: client.url_carte_id || undefined,
      }));
      
      setClients(mappedClients);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'dateInscription'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      const dbData = {
        user_id: user.id,
        nom: clientData.nom,
        prenom: clientData.prenom,
        email: clientData.email,
        telephone: clientData.telephone,
        adresse: clientData.adresse,
        ville: clientData.ville,
        codepostal: clientData.codePostal,
        numeropermis: clientData.numeroPermis,
        datenaissance: clientData.dateNaissance,
        statut: clientData.statut,
        numerocarteid: clientData.numeroCarteId || null,
        photo_carte_id: clientData.photoCarteId || null,
        url_carte_id: clientData.urlCarteId || null,
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedClient = {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        ville: data.ville,
        codePostal: data.codepostal,
        numeroPermis: data.numeropermis,
        dateNaissance: data.datenaissance,
        statut: data.statut as 'actif' | 'inactif',
        dateInscription: data.dateinscription,
        numeroCarteId: data.numerocarteid || undefined,
        photoCarteId: data.photo_carte_id || undefined,
        urlCarteId: data.url_carte_id || undefined,
      };

      setClients(prev => [mappedClient, ...prev]);
      toast({
        title: "Client ajouté",
        description: "Le nouveau client a été ajouté avec succès.",
      });
      
      return mappedClient;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le client",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateClient = async (id: string, clientData: Omit<Client, 'id' | 'dateInscription'>) => {
    if (!user) return null;

    try {
      // Mapper les données vers les noms de colonnes de la base
      const dbData = {
        nom: clientData.nom,
        prenom: clientData.prenom,
        email: clientData.email,
        telephone: clientData.telephone,
        adresse: clientData.adresse,
        ville: clientData.ville,
        codepostal: clientData.codePostal,
        numeropermis: clientData.numeroPermis,
        datenaissance: clientData.dateNaissance,
        statut: clientData.statut,
        numerocarteid: clientData.numeroCarteId || null,
        photo_carte_id: clientData.photoCarteId || null,
        url_carte_id: clientData.urlCarteId || null,
      };

      const { data, error } = await supabase
        .from('clients')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Mapper les données retournées vers notre interface
      const mappedClient = {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        ville: data.ville,
        codePostal: data.codepostal,
        numeroPermis: data.numeropermis,
        dateNaissance: data.datenaissance,
        statut: data.statut as 'actif' | 'inactif',
        dateInscription: data.dateinscription,
        numeroCarteId: data.numerocarteid || undefined,
        photoCarteId: data.photo_carte_id || undefined,
        urlCarteId: data.url_carte_id || undefined,
      };

      setClients(prev => prev.map(c => c.id === id ? mappedClient : c));
      toast({
        title: "Client modifié",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
      
      return mappedClient;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le client",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setClients(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};
