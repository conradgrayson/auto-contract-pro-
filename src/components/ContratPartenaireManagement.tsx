import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useSupabaseContratsPartenaires, ContratPartenaire } from '@/hooks/useSupabaseContratsPartenaires';
import ContratPartenaireForm from './ContratPartenaireForm';
import { useAuth } from '@/hooks/useAuth';

const ContratPartenaireManagement = () => {
  const { contratsPartenaires, loading, addContratPartenaire, updateContratPartenaire, deleteContratPartenaire } = useSupabaseContratsPartenaires();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContrat, setEditingContrat] = useState<ContratPartenaire | null>(null);
  const [previewContrat, setPreviewContrat] = useState<ContratPartenaire | null>(null);

  const filteredContrats = contratsPartenaires.filter(contrat =>
    contrat.nom_partenaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.numero_contrat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.type_partenariat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.objet_contrat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'expire':
        return 'bg-red-100 text-red-800';
      case 'suspendu':
        return 'bg-yellow-100 text-yellow-800';
      case 'termine':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'Actif';
      case 'expire':
        return 'Expiré';
      case 'suspendu':
        return 'Suspendu';
      case 'termine':
        return 'Terminé';
      default:
        return statut;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'fournisseur': 'Fournisseur',
      'client_entreprise': 'Client Entreprise',
      'assurance': 'Assurance',
      'maintenance': 'Maintenance',
      'partenaire_commercial': 'Partenaire Commercial',
      'sous_traitant': 'Sous-traitant',
      'autre': 'Autre',
    };
    return types[type] || type;
  };

  const handleSaveContrat = async (contratData: Omit<ContratPartenaire, 'id' | 'numero_contrat' | 'created_at' | 'updated_at'>) => {
    if (editingContrat) {
      await updateContratPartenaire(editingContrat.id, contratData);
    } else {
      await addContratPartenaire(contratData);
    }
    setShowForm(false);
    setEditingContrat(null);
  };

  const handleEditContrat = (contrat: ContratPartenaire) => {
    setEditingContrat(contrat);
    setShowForm(true);
    setPreviewContrat(null);
  };

  const handleDeleteContrat = async (id: string) => {
    await deleteContratPartenaire(id);
  };

  const handlePreviewContrat = (contrat: ContratPartenaire) => {
    setPreviewContrat(contrat);
    setShowForm(false);
    setEditingContrat(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <ContratPartenaireForm
        contrat={editingContrat}
        onSave={handleSaveContrat}
        onCancel={() => {
          setShowForm(false);
          setEditingContrat(null);
        }}
      />
    );
  }

  if (previewContrat) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setPreviewContrat(null)}
            className="flex items-center gap-2"
          >
            Retour à la liste
          </Button>
          <h2 className="text-2xl font-bold">Aperçu du contrat partenaire</h2>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{previewContrat.numero_contrat}</CardTitle>
                <p className="text-gray-600">{previewContrat.nom_partenaire}</p>
              </div>
              <Badge className={getStatusColor(previewContrat.statut)}>
                {getStatusLabel(previewContrat.statut)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Informations du partenaire</h4>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Nom:</span> {previewContrat.nom_partenaire}</p>
                    <p><span className="font-medium">Type:</span> {getTypeLabel(previewContrat.type_partenariat)}</p>
                    <p><span className="font-medium">Email:</span> {previewContrat.email_partenaire}</p>
                    <p><span className="font-medium">Téléphone:</span> {previewContrat.telephone_partenaire}</p>
                    <p><span className="font-medium">Adresse:</span> {previewContrat.adresse_partenaire}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Détails du contrat</h4>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Période:</span> {new Date(previewContrat.date_debut).toLocaleDateString('fr-FR')} - {new Date(previewContrat.date_fin).toLocaleDateString('fr-FR')}</p>
                    <p><span className="font-medium">Montant:</span> {previewContrat.montant_total.toLocaleString('fr-FR')} CFA</p>
                    <p><span className="font-medium">Statut:</span> {getStatusLabel(previewContrat.statut)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Objet du contrat</h4>
              <p className="mt-2 text-gray-600 whitespace-pre-wrap">{previewContrat.objet_contrat}</p>
            </div>

            {previewContrat.conditions_particulieres && (
              <div>
                <h4 className="font-semibold text-gray-900">Conditions particulières</h4>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{previewContrat.conditions_particulieres}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={() => handleEditContrat(previewContrat)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Contrats Partenaires</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau contrat partenaire
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un contrat, partenaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredContrats.length > 0 ? (
        <div className="grid gap-4">
          {filteredContrats.map((contrat) => (
            <Card key={contrat.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{contrat.numero_contrat}</h3>
                        <Badge className={getStatusColor(contrat.statut)}>
                          {getStatusLabel(contrat.statut)}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{contrat.nom_partenaire}</p>
                      <p className="text-sm text-gray-500">{getTypeLabel(contrat.type_partenariat)}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Période</p>
                      <p className="text-sm">
                        {new Date(contrat.date_debut).toLocaleDateString('fr-FR')} - {new Date(contrat.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-500">{contrat.objet_contrat}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Montant</p>
                      <p className="text-lg font-bold text-primary">
                        {contrat.montant_total.toLocaleString('fr-FR')} CFA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewContrat(contrat)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditContrat(contrat)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce contrat partenaire ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteContrat(contrat.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Aucun contrat partenaire ne correspond à votre recherche.' : 'Commencez par créer votre premier contrat partenaire.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContratPartenaireManagement;