
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, UserCheck } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { Chauffeur } from '@/hooks/useSupabaseChauffeurs';

interface ChauffeurFormWithImagesProps {
  chauffeur?: Chauffeur | null;
  onSave: (chauffeur: Omit<Chauffeur, 'id' | 'dateCreation' | 'referenceChauffeur' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const ChauffeurFormWithImages = ({ chauffeur, onSave, onCancel }: ChauffeurFormWithImagesProps) => {
  const [formData, setFormData] = useState({
    nom: chauffeur?.nom || '',
    prenom: chauffeur?.prenom || '',
    telephone: chauffeur?.telephone || '',
    numeroPermis: chauffeur?.numeroPermis || '',
    dateExpiration: chauffeur?.dateExpiration || '',
    statut: chauffeur?.statut || 'actif' as const,
    photoPermis: chauffeur?.photoPermis || '',
    urlPermis: chauffeur?.urlPermis || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUploaded = (url: string, fileName: string) => {
    setFormData(prev => ({
      ...prev,
      urlPermis: url,
      photoPermis: fileName
    }));
  };

  const handleImageRemoved = () => {
    setFormData(prev => ({
      ...prev,
      urlPermis: '',
      photoPermis: ''
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {chauffeur ? 'Modifier le Chauffeur' : 'Nouveau Chauffeur'}
          </h2>
          <p className="text-gray-600">
            {chauffeur ? 'Modifiez les informations du chauffeur' : 'Ajoutez un nouveau chauffeur à votre équipe'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Informations du Chauffeur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroPermis">Numéro de permis *</Label>
                <Input
                  id="numeroPermis"
                  value={formData.numeroPermis}
                  onChange={(e) => handleChange('numeroPermis', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateExpiration">Date d'expiration du permis *</Label>
                <Input
                  id="dateExpiration"
                  type="date"
                  value={formData.dateExpiration}
                  onChange={(e) => handleChange('dateExpiration', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload du permis de conduire */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Documents</h3>
              <ImageUpload
                label="Permis de conduire"
                currentImageUrl={formData.urlPermis}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                folder="chauffeurs"
                accept="image/*"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {chauffeur ? 'Modifier' : 'Créer le Chauffeur'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChauffeurFormWithImages;
