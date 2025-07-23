import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { ContratPartenaire } from '@/hooks/useSupabaseContratsPartenaires';
import { useAuth } from '@/hooks/useAuth';

interface ContratPartenaireFormProps {
  contrat?: ContratPartenaire | null;
  onSave: (contratData: Omit<ContratPartenaire, 'id' | 'numero_contrat' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const ContratPartenaireForm = ({ contrat, onSave, onCancel }: ContratPartenaireFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    user_id: user?.id || '',
    nom_partenaire: contrat?.nom_partenaire || '',
    email_partenaire: contrat?.email_partenaire || '',
    telephone_partenaire: contrat?.telephone_partenaire || '',
    adresse_partenaire: contrat?.adresse_partenaire || '',
    type_partenariat: contrat?.type_partenariat || 'fournisseur',
    objet_contrat: contrat?.objet_contrat || '',
    date_debut: contrat?.date_debut || '',
    date_fin: contrat?.date_fin || '',
    montant_total: contrat?.montant_total || 0,
    statut: contrat?.statut || 'actif',
    conditions_particulieres: contrat?.conditions_particulieres || '',
  });

  const typesPartenariat = [
    { value: 'fournisseur', label: 'Fournisseur' },
    { value: 'client_entreprise', label: 'Client Entreprise' },
    { value: 'assurance', label: 'Assurance' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'partenaire_commercial', label: 'Partenaire Commercial' },
    { value: 'sous_traitant', label: 'Sous-traitant' },
    { value: 'autre', label: 'Autre' },
  ];

  const statutOptions = [
    { value: 'actif', label: 'Actif' },
    { value: 'expire', label: 'Expiré' },
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'termine', label: 'Terminé' },
  ];

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getNbJours = () => {
    if (!formData.date_debut || !formData.date_fin) return 0;
    const debut = new Date(formData.date_debut);
    const fin = new Date(formData.date_fin);
    const diffTime = Math.abs(fin.getTime() - debut.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ ...prev, user_id: user.id }));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">
          {contrat ? 'Modifier le contrat partenaire' : 'Nouveau contrat partenaire'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du partenaire */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du Partenaire</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="nom_partenaire">Nom du partenaire *</Label>
                <Input
                  id="nom_partenaire"
                  value={formData.nom_partenaire}
                  onChange={(e) => handleChange('nom_partenaire', e.target.value)}
                  placeholder="Nom de l'entreprise ou du partenaire"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_partenaire">Email *</Label>
                <Input
                  id="email_partenaire"
                  type="email"
                  value={formData.email_partenaire}
                  onChange={(e) => handleChange('email_partenaire', e.target.value)}
                  placeholder="contact@partenaire.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone_partenaire">Téléphone *</Label>
                <Input
                  id="telephone_partenaire"
                  value={formData.telephone_partenaire}
                  onChange={(e) => handleChange('telephone_partenaire', e.target.value)}
                  placeholder="+228 XX XX XX XX"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="adresse_partenaire">Adresse *</Label>
                <Textarea
                  id="adresse_partenaire"
                  value={formData.adresse_partenaire}
                  onChange={(e) => handleChange('adresse_partenaire', e.target.value)}
                  placeholder="Adresse complète du partenaire"
                  required
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_partenariat">Type de partenariat *</Label>
                <Select
                  value={formData.type_partenariat}
                  onValueChange={(value) => handleChange('type_partenariat', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesPartenariat.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut *</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleChange('statut', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Détails du contrat */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du Contrat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objet_contrat">Objet du contrat *</Label>
                <Textarea
                  id="objet_contrat"
                  value={formData.objet_contrat}
                  onChange={(e) => handleChange('objet_contrat', e.target.value)}
                  placeholder="Description de l'objet du contrat"
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_debut">Date de début *</Label>
                  <Input
                    id="date_debut"
                    type="date"
                    value={formData.date_debut}
                    onChange={(e) => handleChange('date_debut', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_fin">Date de fin *</Label>
                  <Input
                    id="date_fin"
                    type="date"
                    value={formData.date_fin}
                    onChange={(e) => handleChange('date_fin', e.target.value)}
                    min={formData.date_debut}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant_total">Montant total (CFA)</Label>
                <Input
                  id="montant_total"
                  type="number"
                  value={formData.montant_total}
                  onChange={(e) => handleChange('montant_total', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions_particulieres">Conditions particulières</Label>
                <Textarea
                  id="conditions_particulieres"
                  value={formData.conditions_particulieres}
                  onChange={(e) => handleChange('conditions_particulieres', e.target.value)}
                  placeholder="Conditions spécifiques à ce contrat..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.nom_partenaire && (
                <div>
                  <p className="font-medium">{formData.nom_partenaire}</p>
                  <p className="text-sm text-gray-500">{typesPartenariat.find(t => t.value === formData.type_partenariat)?.label}</p>
                </div>
              )}

              {(formData.date_debut && formData.date_fin) && (
                <div>
                  <p className="text-sm font-medium">Période du contrat</p>
                  <p className="text-sm text-gray-600">
                    {new Date(formData.date_debut).toLocaleDateString('fr-FR')} - {new Date(formData.date_fin).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-500">{getNbJours()} jour(s)</p>
                </div>
              )}

              {formData.montant_total > 0 && (
                <div>
                  <p className="text-sm font-medium">Montant</p>
                  <p className="text-lg font-bold text-primary">
                    {formData.montant_total.toLocaleString('fr-FR')} CFA
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button type="submit" className="w-full">
                  {contrat ? 'Mettre à jour' : 'Créer le contrat'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default ContratPartenaireForm;