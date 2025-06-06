
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface Client {
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
}

interface ClientFormProps {
  client?: Client | null;
  onSave: (client: Omit<Client, 'id' | 'dateInscription'>) => void;
  onCancel: () => void;
}

const ClientForm = ({ client, onSave, onCancel }: ClientFormProps) => {
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
    statut: client?.statut || 'actif' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            {client ? 'Modifier le Client' : 'Ajouter un Client'}
          </h2>
          <p className="text-gray-600">
            {client ? 'Modifiez les informations du client' : 'Ajoutez un nouveau client à votre base de données'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
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
                  placeholder="ex: Jean"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  placeholder="ex: Dupont"
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
                  placeholder="ex: jean.dupont@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="ex: 0123456789"
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
                  placeholder="ex: ABC123456789"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="adresse">Adresse *</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleChange('adresse', e.target.value)}
                    placeholder="ex: 123 Rue de la Paix"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal *</Label>
                  <Input
                    id="codePostal"
                    value={formData.codePostal}
                    onChange={(e) => handleChange('codePostal', e.target.value)}
                    placeholder="ex: 75001"
                    required
                  />
                </div>

                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="ville">Ville *</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleChange('ville', e.target.value)}
                    placeholder="ex: Paris"
                    required
                  />
                </div>
              </div>
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

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {client ? 'Modifier' : 'Ajouter'}
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

export default ClientForm;
