
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import VehicleBasicInfo from './VehicleBasicInfo';
import VehiclePhotosUpload from './VehiclePhotosUpload';

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
  photos?: string[];
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
    photos: vehicle?.photos || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({ ...prev, photos }));
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
            <VehicleBasicInfo 
              formData={formData} 
              onChange={handleChange}
            />

            <VehiclePhotosUpload 
              photos={formData.photos}
              onPhotosChange={handlePhotosChange}
            />

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
