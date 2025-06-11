
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Chauffeur } from '@/hooks/useSupabaseChauffeurs';

interface ChauffeurFormProps {
  chauffeur?: Chauffeur | null;
  onSave: (chauffeurData: Omit<Chauffeur, 'id' | 'dateCreation' | 'referenceChauffeur'>) => Promise<void>;
  onCancel: () => void;
}

const ChauffeurForm = ({ chauffeur, onSave, onCancel }: ChauffeurFormProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    numeroPermis: '',
    dateExpiration: '',
    statut: 'actif' as 'actif' | 'inactif',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (chauffeur) {
      setFormData({
        nom: chauffeur.nom,
        prenom: chauffeur.prenom,
        telephone: chauffeur.telephone,
        numeroPermis: chauffeur.numeroPermis,
        dateExpiration: chauffeur.dateExpiration,
        statut: chauffeur.statut,
      });
    }
  }, [chauffeur]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {chauffeur ? 'Modifier le chauffeur' : 'Nouveau chauffeur'}
          </h2>
          <p className="text-gray-600">
            {chauffeur ? 'Modifiez les informations du chauffeur' : 'Ajoutez un nouveau chauffeur à votre équipe'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleInputChange('statut', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations du permis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numeroPermis">Numéro de permis *</Label>
                <Input
                  id="numeroPermis"
                  value={formData.numeroPermis}
                  onChange={(e) => handleInputChange('numeroPermis', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateExpiration">Date d'expiration *</Label>
                <Input
                  id="dateExpiration"
                  type="date"
                  value={formData.dateExpiration}
                  onChange={(e) => handleInputChange('dateExpiration', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sauvegarde...' : chauffeur ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChauffeurForm;
