
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, FileText, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseVehicles } from '@/hooks/useSupabaseVehicles';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ContractTermsSettings = () => {
  const { toast } = useToast();
  const { vehicles, deleteVehicle } = useSupabaseVehicles();
  const { clients, deleteClient } = useSupabaseClients();
  const { contracts, deleteContract } = useSupabaseContracts();
  const [isClearing, setIsClearing] = useState(false);
  
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

  const handleClearAllData = async () => {
    setIsClearing(true);
    
    try {
      // Supprimer tous les contrats d'abord (à cause des foreign keys)
      for (const contract of contracts) {
        await deleteContract(contract.id);
      }

      // Supprimer tous les véhicules
      for (const vehicle of vehicles) {
        await deleteVehicle(vehicle.id);
      }
      
      // Supprimer tous les clients
      for (const client of clients) {
        await deleteClient(client.id);
      }
      
      // Effacer les données localStorage
      localStorage.clear();
      
      toast({
        title: "Données supprimées",
        description: "Toutes les données ont été supprimées avec succès.",
      });
      
      // Recharger la page pour remettre à zéro complètement
      window.location.reload();
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression des données.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
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

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Zone Dangereuse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Cette action supprimera définitivement toutes vos données : véhicules, clients, contrats et paramètres.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2" disabled={isClearing}>
                    <Trash2 className="h-4 w-4" />
                    {isClearing ? "Suppression..." : "Effacer toutes les données"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Elle supprimera définitivement tous vos véhicules, clients, contrats et paramètres.
                      Toutes les données seront perdues et ne pourront pas être récupérées.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAllData}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Oui, tout supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
