
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  annee: number;
  couleur: string;
  carburant: string;
  places: number;
  kilometrage: number;
  prixJour: number;
  statut: 'disponible' | 'loue' | 'maintenance';
}

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
  onCancel: () => void;
}

const VehicleForm = ({ vehicle, onSave, onCancel }: VehicleFormProps) => {
  const [formData, setFormData] = useState({
    marque: vehicle?.marque || '',
    modele: vehicle?.modele || '',
    immatriculation: vehicle?.immatriculation || '',
    annee: vehicle?.annee || new Date().getFullYear(),
    couleur: vehicle?.couleur || '',
    carburant: vehicle?.carburant || '',
    places: vehicle?.places || 5,
    kilometrage: vehicle?.kilometrage || 0,
    prixJour: vehicle?.prixJour || 0,
    statut: vehicle?.statut || 'disponible' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | number) => {
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
            {vehicle ? 'Modifier le Véhicule' : 'Ajouter un Véhicule'}
          </h2>
          <p className="text-gray-600">
            {vehicle ? 'Modifiez les informations du véhicule' : 'Ajoutez un nouveau véhicule à votre flotte'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Véhicule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="marque">Marque *</Label>
                <Input
                  id="marque"
                  value={formData.marque}
                  onChange={(e) => handleChange('marque', e.target.value)}
                  placeholder="ex: Peugeot"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modele">Modèle *</Label>
                <Input
                  id="modele"
                  value={formData.modele}
                  onChange={(e) => handleChange('modele', e.target.value)}
                  placeholder="ex: 308"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="immatriculation">Immatriculation *</Label>
                <Input
                  id="immatriculation"
                  value={formData.immatriculation}
                  onChange={(e) => handleChange('immatriculation', e.target.value)}
                  placeholder="ex: AA-123-BB"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annee">Année *</Label>
                <Input
                  id="annee"
                  type="number"
                  value={formData.annee}
                  onChange={(e) => handleChange('annee', parseInt(e.target.value))}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="couleur">Couleur *</Label>
                <Input
                  id="couleur"
                  value={formData.couleur}
                  onChange={(e) => handleChange('couleur', e.target.value)}
                  placeholder="ex: Bleu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carburant">Carburant *</Label>
                <Select value={formData.carburant} onValueChange={(value) => handleChange('carburant', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le carburant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Essence">Essence</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybride">Hybride</SelectItem>
                    <SelectItem value="Électrique">Électrique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="places">Nombre de places *</Label>
                <Select value={formData.places.toString()} onValueChange={(value) => handleChange('places', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 places</SelectItem>
                    <SelectItem value="4">4 places</SelectItem>
                    <SelectItem value="5">5 places</SelectItem>
                    <SelectItem value="7">7 places</SelectItem>
                    <SelectItem value="9">9 places</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kilometrage">Kilométrage</Label>
                <Input
                  id="kilometrage"
                  type="number"
                  value={formData.kilometrage}
                  onChange={(e) => handleChange('kilometrage', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prixJour">Prix par jour (€) *</Label>
                <Input
                  id="prixJour"
                  type="number"
                  value={formData.prixJour}
                  onChange={(e) => handleChange('prixJour', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
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
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="loue">Loué</SelectItem>
                    <SelectItem value="maintenance">En maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {vehicle ? 'Modifier' : 'Ajouter'}
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

export default VehicleForm;
