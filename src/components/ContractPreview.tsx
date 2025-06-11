import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';

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
  numeroContrat: string;
  reductionType?: string;
  reductionValue?: number;
  montantReduction?: number;
}

interface ContractPreviewProps {
  contract: Contract;
  onBack: () => void;
}

const ContractPreview = ({ contract, onBack }: ContractPreviewProps) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('fr-FR');
  const subtotal = contract.nbJours * contract.prixJour;
  const reduction = contract.montantReduction || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Contrat de Location</h2>
            <p className="text-gray-600">Contrat N° {contract.numeroContrat}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Document imprimable */}
      <div className="print-page bg-white">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* En-tête avec logo */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/0299e6f3-d1cf-4311-b2b6-4f9ece97de80.png" 
                  alt="Pro-Excellence Logo" 
                  className="h-16 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-primary">PRO-EXCELLENCE</h1>
                  <p className="text-gray-600">Location de Véhicules</p>
                  <p className="text-sm text-gray-500 mt-2">
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris, France<br />
                    Tél: +33 1 23 45 67 89<br />
                    Email: contact@pro-excellence.fr
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900">CONTRAT DE LOCATION</h2>
                <p className="text-gray-600">N° {contract.numeroContrat}</p>
                <p className="text-sm text-gray-500 mt-2">Date: {today}</p>
              </div>
            </div>

            {/* Informations client et véhicule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  INFORMATIONS CLIENT
                </h3>
                <div className="space-y-2">
                  <p><strong>Nom:</strong> {contract.clientNom}</p>
                  <p><strong>Prénom:</strong> {contract.clientPrenom}</p>
                  <p><strong>Date du contrat:</strong> {new Date(contract.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  VÉHICULE LOUÉ
                </h3>
                <div className="space-y-2">
                  <p><strong>Marque:</strong> {contract.vehicleMarque}</p>
                  <p><strong>Modèle:</strong> {contract.vehicleModele}</p>
                  <p><strong>Immatriculation:</strong> {contract.vehicleImmatriculation}</p>
                </div>
              </div>
            </div>

            {/* Détails de la location */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                DÉTAILS DE LA LOCATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date de début</p>
                  <p className="font-medium">{new Date(contract.dateDebut).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date de fin</p>
                  <p className="font-medium">{new Date(contract.dateFin).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="font-medium">{contract.nbJours} jour(s)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prix par jour</p>
                  <p className="font-medium">{contract.prixJour.toLocaleString()} CFA</p>
                </div>
              </div>
            </div>

            {/* Facturation avec réduction */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                FACTURATION
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Location ({contract.nbJours} jour(s) × {contract.prixJour.toLocaleString()} CFA)</span>
                  <span>{subtotal.toLocaleString()} CFA</span>
                </div>
                
                {reduction > 0 && (
                  <div className="flex justify-between items-center mb-2 text-red-600">
                    <span>Réduction {contract.reductionType === 'pourcentage' ? `(${contract.reductionValue}%)` : ''}</span>
                    <span>-{reduction.toLocaleString()} CFA</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-300">
                  <span>TOTAL TTC</span>
                  <span className="text-primary">{contract.montantTotal.toLocaleString()} CFA</span>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                CONDITIONS DE LOCATION
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>• Le véhicule doit être retourné avec le même niveau de carburant qu'au départ.</p>
                <p>• Tout retard dans la restitution du véhicule sera facturé une journée supplémentaire.</p>
                <p>• Le locataire s'engage à respecter le code de la route et à utiliser le véhicule dans les conditions normales.</p>
                <p>• Une caution de 500€ est demandée et sera restituée après vérification de l'état du véhicule.</p>
                {contract.conditions && (
                  <p>• <strong>Conditions particulières:</strong> {contract.conditions}</p>
                )}
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Signature du locataire</p>
                <p className="text-xs text-gray-500 mb-8">Lu et approuvé</p>
                <div className="border-t border-gray-300 pt-2">
                  <p className="text-sm">{contract.clientPrenom} {contract.clientNom}</p>
                  <p className="text-xs text-gray-500">Date: ________________</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Signature Pro-Excellence</p>
                <p className="text-xs text-gray-500 mb-8">Le représentant</p>
                <div className="border-t border-gray-300 pt-2">
                  <p className="text-sm">Pro-Excellence</p>
                  <p className="text-xs text-gray-500">Date: {today}</p>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Pro-Excellence - RCCM: TG-LOM 2024 B 1234 - NIF: 1234567890123</p>
              <p>Document généré automatiquement - Contrat N° {contract.numeroContrat}</p>
            </div>
          </CardContent>
        </Card>

        {/* FACTURE (pas Proforma) */}
        <Card className="shadow-lg mt-8">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/0299e6f3-d1cf-4311-b2b6-4f9ece97de80.png" 
                  alt="Pro-Excellence Logo" 
                  className="h-16 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-primary">PRO-EXCELLENCE</h1>
                  <p className="text-gray-600">Location de Véhicules</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900">FACTURE</h2>
                <p className="text-gray-600">N° {contract.numeroContrat}</p>
                <p className="text-sm text-gray-500 mt-2">Date: {today}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">FACTURER À:</h3>
                <p>{contract.clientPrenom} {contract.clientNom}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">DÉTAILS:</h3>
                <p>Contrat N° {contract.numeroContrat}</p>
                <p>Période: {new Date(contract.dateDebut).toLocaleDateString('fr-FR')} - {new Date(contract.dateFin).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Description</th>
                  <th className="text-center py-2">Quantité</th>
                  <th className="text-right py-2">Prix unitaire</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3">
                    Location {contract.vehicleMarque} {contract.vehicleModele}<br />
                    <span className="text-sm text-gray-500">{contract.vehicleImmatriculation}</span>
                  </td>
                  <td className="text-center py-3">{contract.nbJours} jour(s)</td>
                  <td className="text-right py-3">{contract.prixJour.toLocaleString()} CFA</td>
                  <td className="text-right py-3">{subtotal.toLocaleString()} CFA</td>
                </tr>
                
                {reduction > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-red-600">
                      Réduction {contract.reductionType === 'pourcentage' ? `(${contract.reductionValue}%)` : ''}
                    </td>
                    <td className="text-center py-3">-</td>
                    <td className="text-right py-3">-</td>
                    <td className="text-right py-3 text-red-600">-{reduction.toLocaleString()} CFA</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-3 font-semibold">TOTAL TTC:</td>
                  <td className="text-right py-3 font-bold text-lg text-primary">{contract.montantTotal.toLocaleString()} CFA</td>
                </tr>
              </tfoot>
            </table>

            <div className="text-sm text-gray-600">
              <p><strong>Conditions de paiement:</strong> Paiement à la prise du véhicule</p>
              <p><strong>Modalités:</strong> Espèces, mobile money, chèque acceptés</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractPreview;
