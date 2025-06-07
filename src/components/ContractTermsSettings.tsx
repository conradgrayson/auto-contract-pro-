import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, FileText } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

const ContractTermsSettings = () => {
  const { toast } = useToast();
  const [terms, setTerms] = useLocalStorage('contractTerms', {
    generalTerms: `• Le véhicule doit être retourné avec le même niveau de carburant qu'au départ.
• Tout retard dans la restitution du véhicule sera facturé une journée supplémentaire.
• Le locataire s'engage à respecter le code de la route et à utiliser le véhicule dans les conditions normales.
• Une caution de 300,000 CFA est demandée et sera restituée après vérification de l'état du véhicule.
• En cas d'accident, le locataire doit immédiatement contacter Pro-Excellence et les autorités compétentes.
• Les frais de péage, d'essence et de stationnement sont à la charge du locataire.
• Il est interdit de sous-louer le véhicule ou de le prêter à un tiers.
• Le locataire doit être âgé d'au moins 23 ans et posséder un permis de conduire valide depuis au moins 2 ans.`,
    
    companyInfo: `Pro-Excellence - Location de Véhicules
123 Avenue de la Paix
Lomé, Togo
Tél: +228 22 12 34 56
Email: contact@pro-excellence.tg
RCCM: TG-LOM 2024 B 1234
NIF: 1234567890123`,

    paymentTerms: `Conditions de paiement: Paiement à la prise du véhicule
Modalités: Espèces, mobile money (Flooz, T-Money), chèque acceptés
Une caution de 300,000 CFA est exigée et sera restituée après restitution du véhicule en bon état.`
  });

  const handleSave = () => {
    // Les termes sont automatiquement sauvegardés grâce à useLocalStorage
    toast({
      title: "Termes sauvegardés",
      description: "Les termes du contrat ont été sauvegardés avec succès !",
    });
  };

  const handleChange = (field: string, value: string) => {
    setTerms(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Termes du Contrat</h2>
        <p className="text-gray-600">Modifiez les conditions générales et informations de votre entreprise</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Conditions Générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="generalTerms">Conditions générales de location</Label>
              <Textarea
                id="generalTerms"
                value={terms.generalTerms}
                onChange={(e) => handleChange('generalTerms', e.target.value)}
                rows={12}
                placeholder="Saisissez les conditions générales..."
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Entreprise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="companyInfo">Coordonnées de l'entreprise</Label>
                <Textarea
                  id="companyInfo"
                  value={terms.companyInfo}
                  onChange={(e) => handleChange('companyInfo', e.target.value)}
                  rows={6}
                  placeholder="Informations de votre entreprise..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conditions de Paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Modalités de paiement</Label>
                <Textarea
                  id="paymentTerms"
                  value={terms.paymentTerms}
                  onChange={(e) => handleChange('paymentTerms', e.target.value)}
                  rows={4}
                  placeholder="Conditions de paiement..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractTermsSettings;
