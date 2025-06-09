
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
  onSave: (contract: Omit<Contract, 'id' | 'dateCreation' | 'numeroContrat'>) => void;
  onCancel: () => void;
}

const ContractForm = ({ contract, onSave, onCancel }: ContractFormProps) => {
  const { clients, loading: clientsLoading } = useSupabaseClients();
  const { vehicles, loading: vehiclesLoading } = useSupabaseVehicles();

  const [formData, setFormData] = useState({
    clientId: contract?.clientId || '',
    vehicleId: contract?.vehicleId || '',
    dateDebut: contract?.dateDebut || '',
    dateFin: contract?.dateFin || '',
    prixTotal: 0,
    caution: contract?.caution || 300000,
    kilometrageDepart: contract?.kilometrageDepart || undefined,
    kilometrageRetour: contract?.kilometrageRetour || undefined,
    statut: contract?.statut || 'actif' as const,
    etatVehiculeDepart: contract?.etatVehiculeDepart || '',
    etatVehiculeRetour: contract?.etatVehiculeRetour || '',
    notes: contract?.notes || ''
  });

  const calculateTotal = () => {
    if (formData.dateDebut && formData.dateFin) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);
      const nbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
      
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      if (selectedVehicle && nbJours > 0) {
        return nbJours * selectedVehicle.prixParJour;
      }
    }
    return 0;
  };

  const getNbJours = () => {
    if (formData.dateDebut && formData.dateFin) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);
      const nbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
      return nbJours > 0 ? nbJours : 0;
    }
    return 0;
  };

  const getSelectedClient = () => {
    return clients.find(c => c.id === formData.clientId);
  };

  const getSelectedVehicle = () => {
    return vehicles.find(v => v.id === formData.vehicleId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    onSave({
      ...formData,
      prixTotal: total
    });
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      clientId
    }));
  };

  const handleVehicleChange = (vehicleId: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleId
    }));
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (clientsLoading || vehiclesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg text-gray-600">Chargement des données...</p>
      </div>
    );
  }

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
                    <Select value={formData.clientId} onValueChange={handleClientChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.length === 0 ? (
                          <SelectItem value="no-clients" disabled>
                            Aucun client disponible
                          </SelectItem>
                        ) : (
                          clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.prenom} {client.nom}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Véhicule *</Label>
                    <Select value={formData.vehicleId} onValueChange={handleVehicleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.length === 0 ? (
                          <SelectItem value="no-vehicles" disabled>
                            Aucun véhicule disponible
                          </SelectItem>
                        ) : (
                          vehicles
                            .filter(vehicle => vehicle.statut === 'disponible')
                            .map(vehicle => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.marque} {vehicle.modele} - {vehicle.immatriculation}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Date de début *</Label>
                    <Input
                      id="dateDebut"
                      type="date"
                      value={formData.dateDebut}
                      onChange={(e) => handleChange('dateDebut', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFin">Date de fin *</Label>
                    <Input
                      id="dateFin"
                      type="date"
                      value={formData.dateFin}
                      onChange={(e) => handleChange('dateFin', e.target.value)}
                      min={formData.dateDebut}
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
              {getSelectedClient() && (
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium">{getSelectedClient()?.prenom} {getSelectedClient()?.nom}</p>
                </div>
              )}

              {getSelectedVehicle() && (
                <div>
                  <p className="text-sm text-gray-600">Véhicule</p>
                  <p className="font-medium">{getSelectedVehicle()?.marque} {getSelectedVehicle()?.modele}</p>
                  <p className="text-sm text-gray-500">{getSelectedVehicle()?.immatriculation}</p>
                </div>
              )}

              {formData.dateDebut && formData.dateFin && (
                <div>
                  <p className="text-sm text-gray-600">Période</p>
                  <p className="font-medium">
                    {new Date(formData.dateDebut).toLocaleDateString('fr-FR')} - {new Date(formData.dateFin).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-500">{getNbJours()} jour(s)</p>
                </div>
              )}

              {getSelectedVehicle() && (
                <div>
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="font-medium">{getSelectedVehicle()?.prixParJour.toLocaleString()} CFA / jour</p>
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
