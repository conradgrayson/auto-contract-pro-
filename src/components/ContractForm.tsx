import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useSupabaseVehicles } from '@/hooks/useSupabaseVehicles';
import { useSupabaseChauffeurs } from '@/hooks/useSupabaseChauffeurs';
import { Contract } from '@/hooks/useSupabaseContracts';

interface ContractFormProps {
  contract?: Contract | null;
  onSave: (contract: Omit<Contract, 'id' | 'dateCreation' | 'numeroContrat'>) => void;
  onCancel: () => void;
}

const ContractForm = ({ contract, onSave, onCancel }: ContractFormProps) => {
  const { clients, loading: clientsLoading } = useSupabaseClients();
  const { vehicles, loading: vehiclesLoading } = useSupabaseVehicles();
  const { chauffeurs, loading: chauffeursLoading } = useSupabaseChauffeurs();

  const [formData, setFormData] = useState({
    clientId: contract?.clientId || '',
    vehicleId: contract?.vehicleId || '',
    dateDebut: contract?.dateDebut || '',
    dateFin: contract?.dateFin || '',
    heureRecuperation: contract?.heureRecuperation || '',
    heureRendu: contract?.heureRendu || '',
    prixTotal: 0,
    caution: contract?.caution || 300000,
    kilometrageDepart: contract?.kilometrageDepart || undefined,
    kilometrageRetour: contract?.kilometrageRetour || undefined,
    statut: contract?.statut || 'actif' as const,
    etatVehiculeDepart: contract?.etatVehiculeDepart || '',
    etatVehiculeRetour: contract?.etatVehiculeRetour || '',
    notes: contract?.notes || '',
    avecChauffeur: contract?.avecChauffeur || false,
    chauffeurId: contract?.chauffeurId || '',
    reductionType: contract?.reductionType || 'aucune' as const,
    reductionValue: contract?.reductionValue || 0,
    montantReduction: contract?.montantReduction || 0,
  });

  const calculateReduction = (subtotal: number) => {
    if (formData.reductionType === 'pourcentage') {
      return (subtotal * formData.reductionValue) / 100;
    } else if (formData.reductionType === 'montant') {
      return formData.reductionValue;
    }
    return 0;
  };

  const calculateTotal = () => {
    if (formData.dateDebut && formData.dateFin) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);
      const nbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
      
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      if (selectedVehicle && nbJours > 0) {
        const subtotal = nbJours * selectedVehicle.prixParJour;
        const reduction = calculateReduction(subtotal);
        return subtotal - reduction;
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

  const getSelectedChauffeur = () => {
    return chauffeurs.find(c => c.id === formData.chauffeurId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    const reduction = calculateReduction(getNbJours() * (getSelectedVehicle()?.prixParJour || 0));
    onSave({
      ...formData,
      prixTotal: total,
      montantReduction: reduction,
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

  const handleChauffeurChange = (chauffeurId: string) => {
    setFormData(prev => ({
      ...prev,
      chauffeurId
    }));
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (clientsLoading || vehiclesLoading || chauffeursLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  const subtotal = getNbJours() * (getSelectedVehicle()?.prixParJour || 0);
  const reduction = calculateReduction(subtotal);

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
                    <Label htmlFor="heureRecuperation">Heure de récupération</Label>
                    <Input
                      id="heureRecuperation"
                      type="time"
                      value={formData.heureRecuperation}
                      onChange={(e) => handleChange('heureRecuperation', e.target.value)}
                      placeholder="08:00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heureRendu">Heure de rendu</Label>
                    <Input
                      id="heureRendu"
                      type="time"
                      value={formData.heureRendu}
                      onChange={(e) => handleChange('heureRendu', e.target.value)}
                      placeholder="18:00"
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

                {/* Location avec chauffeur */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="avecChauffeur"
                      checked={formData.avecChauffeur}
                      onCheckedChange={(checked) => handleChange('avecChauffeur', checked)}
                    />
                    <Label htmlFor="avecChauffeur" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Location avec chauffeur
                    </Label>
                  </div>

                  {formData.avecChauffeur && (
                    <div className="space-y-2">
                      <Label htmlFor="chauffeur">Chauffeur</Label>
                      <Select value={formData.chauffeurId} onValueChange={handleChauffeurChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un chauffeur" />
                        </SelectTrigger>
                        <SelectContent>
                          {chauffeurs.length === 0 ? (
                            <SelectItem value="no-chauffeurs" disabled>
                              Aucun chauffeur disponible
                            </SelectItem>
                          ) : (
                            chauffeurs
                              .filter(chauffeur => chauffeur.statut === 'actif')
                              .map(chauffeur => (
                                <SelectItem key={chauffeur.id} value={chauffeur.id}>
                                  {chauffeur.prenom} {chauffeur.nom} ({chauffeur.referenceChauffeur})
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Réduction */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Réduction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reductionType">Type de réduction</Label>
                      <Select value={formData.reductionType} onValueChange={(value) => handleChange('reductionType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aucune">Aucune réduction</SelectItem>
                          <SelectItem value="pourcentage">Pourcentage (%)</SelectItem>
                          <SelectItem value="montant">Montant fixe (CFA)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.reductionType !== 'aucune' && (
                      <div className="space-y-2">
                        <Label htmlFor="reductionValue">
                          {formData.reductionType === 'pourcentage' ? 'Pourcentage (%)' : 'Montant (CFA)'}
                        </Label>
                        <Input
                          id="reductionValue"
                          type="number"
                          value={formData.reductionValue}
                          onChange={(e) => handleChange('reductionValue', parseFloat(e.target.value) || 0)}
                          min="0"
                          max={formData.reductionType === 'pourcentage' ? '100' : undefined}
                          step={formData.reductionType === 'pourcentage' ? '0.1' : '1000'}
                        />
                      </div>
                    )}

                    {formData.reductionType !== 'aucune' && reduction > 0 && (
                      <div className="space-y-2">
                        <Label>Montant de la réduction</Label>
                        <div className="p-2 bg-gray-100 rounded border">
                          {reduction.toLocaleString()} CFA
                        </div>
                      </div>
                    )}
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

              {formData.avecChauffeur && getSelectedChauffeur() && (
                <div>
                  <p className="text-sm text-gray-600">Chauffeur</p>
                  <p className="font-medium">{getSelectedChauffeur()?.prenom} {getSelectedChauffeur()?.nom}</p>
                  <p className="text-sm text-gray-500">{getSelectedChauffeur()?.referenceChauffeur}</p>
                </div>
              )}

              {formData.dateDebut && formData.dateFin && (
                <div>
                  <p className="text-sm text-gray-600">Période</p>
                  <p className="font-medium">
                    {new Date(formData.dateDebut).toLocaleDateString('fr-FR')} - {new Date(formData.dateFin).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-500">{getNbJours()} jour(s)</p>
                  {(formData.heureRecuperation || formData.heureRendu) && (
                    <p className="text-sm text-gray-500">
                      {formData.heureRecuperation && `Récupération: ${formData.heureRecuperation}`}
                      {formData.heureRecuperation && formData.heureRendu && ' | '}
                      {formData.heureRendu && `Rendu: ${formData.heureRendu}`}
                    </p>
                  )}
                </div>
              )}

              {getSelectedVehicle() && (
                <div>
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="font-medium">{getSelectedVehicle()?.prixParJour.toLocaleString()} CFA / jour</p>
                </div>
              )}

              {subtotal > 0 && (
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Sous-total</p>
                    <p className="font-medium">{subtotal.toLocaleString()} CFA</p>
                  </div>
                  
                  {reduction > 0 && (
                    <div className="flex justify-between text-red-600">
                      <p className="text-sm">Réduction</p>
                      <p className="font-medium">-{reduction.toLocaleString()} CFA</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t pt-2">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-primary">{calculateTotal().toLocaleString()} CFA</p>
                  </div>
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
