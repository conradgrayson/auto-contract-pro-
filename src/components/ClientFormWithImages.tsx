
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, User } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { Client } from '@/hooks/useSupabaseClients';

interface ClientFormWithImagesProps {
  client?: Client | null;
  onSave: (client: Omit<Client, 'id' | 'dateInscription'>) => void;
  onCancel: () => void;
}

const ClientFormWithImages = ({ client, onSave, onCancel }: ClientFormWithImagesProps) => {
  const [formData, setFormData] = useState({
    nom: client?.nom || '',
    prenom: client?.prenom || '',
    email: client?.email || '',
    telephone: client?.telephone || '',
    adresse: client?.adresse || '',
    ville: client?.ville || '',
    codePostal: client?.codePostal || '',
    numeroPermis: client?.numeroPermis || '',
    dateNaissance: client?.dateNaissance || '',
    numeroCarteId: client?.numeroCarteId || '',
    statut: client?.statut || 'actif' as const,
    photoCarteId: client?.photoCarteId || '',
    urlCarteId: client?.urlCarteId || '',
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
      urlCarteId: url,
      photoCarteId: fileName
    }));
  };

  const handleImageRemoved = () => {
    setFormData(prev => ({
      ...prev,
      urlCarteId: '',
      photoCarteId: ''
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
            {client ? 'Modifier le Client' : 'Nouveau Client'}
          </h2>
          <p className="text-gray-600">
            {client ? 'Modifiez les informations du client' : 'Ajoutez un nouveau client à votre base de données'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du Client
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
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
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleChange('dateNaissance', e.target.value)}
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
                <Label htmlFor="numeroCarteId">Numéro de carte d'identité</Label>
                <Input
                  id="numeroCarteId"
                  value={formData.numeroCarteId}
                  onChange={(e) => handleChange('numeroCarteId', e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse *</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville *</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleChange('ville', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codePostal">Code postal *</Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => handleChange('codePostal', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Upload de la carte d'identité */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Documents</h3>
              <ImageUpload
                label="Carte d'identité"
                currentImageUrl={formData.urlCarteId}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                folder="clients"
                accept="image/*"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {client ? 'Modifier' : 'Créer le Client'}
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

export default ClientFormWithImages;
