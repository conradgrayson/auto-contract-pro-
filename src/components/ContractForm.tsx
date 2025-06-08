
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useSupabaseVehicles } from '@/hooks/useSupabaseVehicles';
import { Contract } from '@/hooks/useSupabaseContracts';

interface ContractFormProps {
  contract?: Contract | null;
  onSave: (contract: {
    clientid: string;
    vehicleid: string;
    datedebut: string;
    datefin: string;
    prixtotal: number;
    caution?: number;
    statut?: 'actif' | 'termine' | 'annule';
    notes?: string;
  }) => void;
  onCancel: () => void;
  preselectedClientId?: string;
  preselectedVehicleId?: string;
}

const ContractForm = ({ contract, onSave, onCancel, preselectedClientId, preselectedVehicleId }: ContractFormProps) => {
  const { clients } = useSupabaseClients();
  const { vehicles } = useSupabaseVehicles();

  const [formData, setFormData] = useState({
    clientid: contract?.clientid || preselectedClientId || '',
    vehicleid: contract?.vehicleid || preselectedVehicleId || '',
    datedebut: contract?.datedebut || '',
    datefin: contract?.datefin || '',
    caution: contract?.caution || 300000,
    statut: contract?.statut || 'actif' as const,
    notes: contract?.notes || ''
  });

  const selectedClient = clients.find(c => c.id === formData.clientid);
  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleid);

  const calculateTotal = () => {
    if (formData.datedebut && formData.datefin && selectedVehicle) {
      const dateDebut = new Date(formData.datedebut);
      const dateFin = new Date(formData.datefin);
      const nbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
      return nbJours > 0 ? nbJours * selectedVehicle.prixParJour : 0;
    }
    return 0;
  };

  const getNbJours = () => {
    if (formData.datedebut && formData.datefin) {
      const dateDebut = new Date(formData.datedebut);
      const dateFin = new Date(formData.datefin);
      const nbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
      return nbJours > 0 ? nbJours : 0;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    onSave({
      ...formData,
      prixtotal: total
    });
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
            {contract ? 'Modifier le Contrat' : 'Nouveau Contrat'}
          </h2>
          <p className="text-gray-600">
            {contract ? 'Modifiez les informations du contrat' : 'Créez un nouveau contrat de location'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Contrat</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client *</Label>
                    <Select value={formData.clientid} onValueChange={(value) => handleChange('clientid', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.prenom} {client.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Véhicule *</Label>
                    <Select value={formData.vehicleid} onValueChange={(value) => handleChange('vehicleid', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.marque} {vehicle.modele} - {vehicle.immatriculation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Date de début *</Label>
                    <Input
                      id="dateDebut"
                      type="date"
                      value={formData.datedebut}
                      onChange={(e) => handleChange('datedebut', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFin">Date de fin *</Label>
                    <Input
                      id="dateFin"
                      type="date"
                      value={formData.datefin}
                      onChange={(e) => handleChange('datefin', e.target.value)}
                      min={formData.datedebut}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caution">Caution (CFA)</Label>
                    <Input
                      id="caution"
                      type="number"
                      value={formData.caution}
                      onChange={(e) => handleChange('caution', parseFloat(e.target.value) || 0)}
                      placeholder="300000"
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statut">Statut</Label>
                    <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actif">En cours</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                        <SelectItem value="annule">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes particulières</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Ajoutez des notes particulières pour ce contrat..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {contract ? 'Modifier' : 'Créer le Contrat'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Résumé */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Résumé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedClient && (
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium">{selectedClient.prenom} {selectedClient.nom}</p>
                  <p className="text-sm text-gray-500">{selectedClient.email}</p>
                </div>
              )}

              {selectedVehicle && (
                <div>
                  <p className="text-sm text-gray-600">Véhicule</p>
                  <p className="font-medium">{selectedVehicle.marque} {selectedVehicle.modele}</p>
                  <p className="text-sm text-gray-500">{selectedVehicle.immatriculation}</p>
                </div>
              )}

              {formData.datedebut && formData.datefin && (
                <div>
                  <p className="text-sm text-gray-600">Période</p>
                  <p className="font-medium">
                    {new Date(formData.datedebut).toLocaleDateString('fr-FR')} - {new Date(formData.datefin).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-500">{getNbJours()} jour(s)</p>
                </div>
              )}

              {selectedVehicle && (
                <div>
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="font-medium">{selectedVehicle.prixParJour.toLocaleString()} CFA / jour</p>
                </div>
              )}

              {calculateTotal() > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-primary">{calculateTotal().toLocaleString()} CFA</p>
                </div>
              )}

              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Caution</p>
                <p className="font-medium">{formData.caution.toLocaleString()} CFA</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
