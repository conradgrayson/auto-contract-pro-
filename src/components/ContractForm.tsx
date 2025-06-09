
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

interface Contract {
  id: string;
  clientId: string;
  clientNom: string;
  clientPrenom: string;
  vehicleId: string;
  vehicleMarque: string;
  vehicleModele: string;
  vehicleImmatriculation: string;
  dateDebut: string;
  dateFin: string;
  prixJour: number;
  nbJours: number;
  montantTotal: number;
  statut: 'actif' | 'termine' | 'annule';
  dateCreation: string;
  conditions?: string;
}

interface ContractFormProps {
  contract?: Contract | null;
  onSave: (contract: Omit<Contract, 'id' | 'dateCreation' | 'montantTotal' | 'nbJours'>) => void;
  onCancel: () => void;
}

const ContractForm = ({ contract, onSave, onCancel }: ContractFormProps) => {
  const { clients, loading: clientsLoading } = useSupabaseClients();
  const { vehicles, loading: vehiclesLoading } = useSupabaseVehicles();

  const [formData, setFormData] = useState({
    clientId: contract?.clientId || '',
    clientNom: contract?.clientNom || '',
    clientPrenom: contract?.clientPrenom || '',
    vehicleId: contract?.vehicleId || '',
    vehicleMarque: contract?.vehicleMarque || '',
    vehicleModele: contract?.vehicleModele || '',
    vehicleImmatriculation: contract?.vehicleImmatriculation || '',
    dateDebut: contract?.dateDebut || '',
    dateFin: contract?.dateFin || '',
    prixJour: contract?.prixJour || 0,
    statut: contract?.statut || 'actif' as const,
    conditions: contract?.conditions || ''
  });

  const calculateTotal = () => {
    if (formData.dateDebut && formData.dateFin && formData.prixJour) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);
      const nbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
      return nbJours > 0 ? nbJours * formData.prixJour : 0;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        clientId,
        clientNom: selectedClient.nom,
        clientPrenom: selectedClient.prenom
      }));
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleId,
        vehicleMarque: selectedVehicle.marque,
        vehicleModele: selectedVehicle.modele,
        vehicleImmatriculation: selectedVehicle.immatriculation,
        prixJour: selectedVehicle.prixParJour
      }));
    }
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
                    <Label htmlFor="prixJour">Prix par jour (CFA) *</Label>
                    <Input
                      id="prixJour"
                      type="number"
                      value={formData.prixJour}
                      onChange={(e) => handleChange('prixJour', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="100"
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
                        <SelectItem value="actif">En cours</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                        <SelectItem value="annule">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">Conditions particulières</Label>
                  <Textarea
                    id="conditions"
                    value={formData.conditions}
                    onChange={(e) => handleChange('conditions', e.target.value)}
                    placeholder="Ajoutez des conditions particulières pour ce contrat..."
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
              {formData.clientNom && (
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium">{formData.clientPrenom} {formData.clientNom}</p>
                </div>
              )}

              {formData.vehicleMarque && (
                <div>
                  <p className="text-sm text-gray-600">Véhicule</p>
                  <p className="font-medium">{formData.vehicleMarque} {formData.vehicleModele}</p>
                  <p className="text-sm text-gray-500">{formData.vehicleImmatriculation}</p>
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

              {formData.prixJour > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="font-medium">{formData.prixJour.toLocaleString()} CFA / jour</p>
                </div>
              )}

              {calculateTotal() > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-primary">{calculateTotal().toLocaleString()} CFA</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
