
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, User, Phone, Calendar, IdCard } from 'lucide-react';
import ChauffeurForm from './ChauffeurForm';
import { useSupabaseChauffeurs, Chauffeur } from '@/hooks/useSupabaseChauffeurs';

const ChauffeurManagement = () => {
  const { chauffeurs, loading, addChauffeur, updateChauffeur, deleteChauffeur } = useSupabaseChauffeurs();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingChauffeur, setEditingChauffeur] = useState<Chauffeur | null>(null);

  const filteredChauffeurs = chauffeurs.filter(chauffeur =>
    chauffeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chauffeur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chauffeur.telephone.includes(searchTerm) ||
    chauffeur.referenceChauffeur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveChauffeur = async (chauffeurData: Omit<Chauffeur, 'id' | 'dateCreation' | 'referenceChauffeur'>) => {
    if (editingChauffeur) {
      await updateChauffeur(editingChauffeur.id, chauffeurData);
    } else {
      await addChauffeur(chauffeurData);
    }
    setShowForm(false);
    setEditingChauffeur(null);
  };

  const handleEditChauffeur = (chauffeur: Chauffeur) => {
    setEditingChauffeur(chauffeur);
    setShowForm(true);
  };

  const handleDeleteChauffeur = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      await deleteChauffeur(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <ChauffeurForm
        chauffeur={editingChauffeur}
        onSave={handleSaveChauffeur}
        onCancel={() => {
          setShowForm(false);
          setEditingChauffeur(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Chauffeurs</h2>
          <p className="text-gray-600">Gérez votre équipe de chauffeurs</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Chauffeur
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, téléphone ou référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chauffeur Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChauffeurs.map((chauffeur) => (
          <Card key={chauffeur.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{chauffeur.prenom} {chauffeur.nom}</CardTitle>
                    <p className="text-sm text-gray-600">{chauffeur.referenceChauffeur}</p>
                  </div>
                </div>
                <Badge className={chauffeur.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {chauffeur.statut === 'actif' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{chauffeur.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-gray-400" />
                  <span>Permis: {chauffeur.numeroPermis}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Expire le: {new Date(chauffeur.dateExpiration).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditChauffeur(chauffeur)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteChauffeur(chauffeur.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChauffeurs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun chauffeur trouvé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucun chauffeur ne correspond à votre recherche.' : 'Commencez par ajouter votre premier chauffeur.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChauffeurManagement;
