import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleBasicInfoProps {
  formData: {
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
  };
  onChange: (field: string, value: string | number) => void;
}

const VehicleBasicInfo = ({ formData, onChange }: VehicleBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="marque">Marque *</Label>
        <Input
          id="marque"
          value={formData.marque}
          onChange={(e) => onChange('marque', e.target.value)}
          placeholder="ex: Peugeot"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modele">Modèle *</Label>
        <Input
          id="modele"
          value={formData.modele}
          onChange={(e) => onChange('modele', e.target.value)}
          placeholder="ex: 308"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="immatriculation">Immatriculation *</Label>
        <Input
          id="immatriculation"
          value={formData.immatriculation}
          onChange={(e) => onChange('immatriculation', e.target.value)}
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
          onChange={(e) => onChange('annee', parseInt(e.target.value))}
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
          onChange={(e) => onChange('couleur', e.target.value)}
          placeholder="ex: Bleu"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carburant">Carburant *</Label>
        <Select value={formData.carburant} onValueChange={(value) => onChange('carburant', value)}>
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
        <Select value={formData.places.toString()} onValueChange={(value) => onChange('places', parseInt(value))}>
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
          onChange={(e) => onChange('kilometrage', parseInt(e.target.value) || 0)}
          placeholder="0"
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prixJour">Prix par jour (CFA) *</Label>
        <Input
          id="prixJour"
          type="number"
          value={formData.prixJour}
          onChange={(e) => onChange('prixJour', parseFloat(e.target.value) || 0)}
          placeholder="0"
          min="0"
          step="100"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="statut">Statut</Label>
        <Select value={formData.statut} onValueChange={(value) => onChange('statut', value)}>
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
  );
};

export default VehicleBasicInfo;
