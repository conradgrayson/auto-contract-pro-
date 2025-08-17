import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, Search, Eye } from 'lucide-react';
import { useSupabaseContracts } from '@/hooks/useSupabaseContracts';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useSupabaseVehicles } from '@/hooks/useSupabaseVehicles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FactureManagement = () => {
  const { contracts, loading } = useSupabaseContracts();
  const { clients } = useSupabaseClients();
  const { vehicles } = useSupabaseVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacture, setSelectedFacture] = useState(null);

  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getVehicleById = (id: string) => vehicles.find(v => v.id === id);

  const facturesWithDetails = contracts.map(contract => {
    const client = getClientById(contract.clientId);
    const vehicle = getVehicleById(contract.vehicleId);
    
    const dateDebut = new Date(contract.dateDebut);
    const dateFin = new Date(contract.dateFin);
    // Aligne le calcul avec le contrat: utilise nbJours du contrat si dispo, sinon même formule (sans +1)
    const computedNbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
    const nbJours = (contract as any).nbJours && (contract as any).nbJours > 0 ? (contract as any).nbJours : Math.max(0, computedNbJours);
    const prixJour = (contract as any).prixJour ?? (vehicle?.prixParJour || 0);
    const subtotal = nbJours * prixJour;
    const reductionByType = contract.reductionType === 'pourcentage'
      ? Math.round((subtotal * (contract.reductionValue || 0)) / 100)
      : contract.reductionType === 'montant'
        ? (contract.reductionValue || 0)
        : (contract.montantReduction || 0);
    const reduction = Math.max(0, Math.min(subtotal, reductionByType));
    const montantTotal = Math.max(0, subtotal - reduction);

    return {
      ...contract,
      clientNom: client?.nom || 'N/A',
      clientPrenom: client?.prenom || 'N/A',
      clientNumeroPermis: client?.numeroPermis || undefined,
      clientNumeroCNI: client?.numeroCarteId || undefined,
      vehicleMarque: vehicle?.marque || 'N/A',
      vehicleModele: vehicle?.modele || 'N/A',
      vehicleImmatriculation: vehicle?.immatriculation || 'N/A',
      heureRecuperation: contract.heureRecuperation,
      heureRendu: contract.heureRendu,
      nbJours,
      prixJour,
      montantTotal,
      subtotal,
      reduction
    };
  });

  const filteredFactures = facturesWithDetails.filter(facture =>
    facture.numeroContrat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.clientPrenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrintFacture = async (facture: any) => {
    const factureElement = document.getElementById(`facture-${facture.id}`);
    if (!factureElement) return;

    // Temporarily show the element for capture
    factureElement.style.display = 'block';
    factureElement.style.position = 'absolute';
    factureElement.style.left = '-9999px';

    const canvas = await html2canvas(factureElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    // Hide the element again
    factureElement.style.display = 'none';
    factureElement.style.position = '';
    factureElement.style.left = '';

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`facture-${facture.numeroContrat}.pdf`);
  };

  const renderFacturePreview = (facture: any, visible: boolean = false) => {
    const today = new Date().toLocaleDateString('fr-FR');

    return (
      <div id={`facture-${facture.id}`} className="bg-white p-8" style={{ display: visible ? 'block' : 'none' }}>
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
                127 Rue AFG DJIDJOLE<br />
                Lomé, Togo<br />
                Tél: 00228 70 62 45 75 / 99 07 52 06<br />
                Email: proexcellence.tg@gmail.com<br />
                www.pro-excellence.com
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">FACTURE</h2>
            <p className="text-gray-600">N° {facture.numeroContrat}</p>
            <p className="text-sm text-gray-500 mt-2">Date: {today}</p>
          </div>
        </div>

        {/* Section Référence du Locataire */}
        <div className="mb-6 p-4 border border-gray-300">
          <h3 className="font-bold text-center mb-4">REFERENCE DU LOCATAIRE</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>Nom : {facture.clientNom}</div>
            <div>Prénoms : {facture.clientPrenom}</div>
            <div>Adresse à l'Etranger : ........................</div>
            <div>Adresse : ................................</div>
            <div>Profession : ..............................</div>
            <div>N° de téléphone : ........................</div>
            <div>N° de carte d'identité : {facture.clientNumeroCNI || '................'}</div>
            <div>Nationalité : ...........................</div>
            <div>N° de permis de conduire : {facture.clientNumeroPermis || '................'}</div>
            <div className="col-span-2">Raison de la location : ................................</div>
          </div>
          
          <h4 className="font-bold mt-4 mb-2">DESCRIPTION DE LA VOITURE</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>Marque : {facture.vehicleMarque}</div>
            <div>Modèle : {facture.vehicleModele}</div>
            <div>Immatriculation : {facture.vehicleImmatriculation}</div>
          </div>

          <h4 className="font-bold mt-4 mb-2">REFERENCE DU CHAUFFEUR</h4>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>Nom : ................................</div>
            <div>Prénoms : ............................</div>
            <div>Adresse : .............................</div>
            <div>N° de téléphone : ....................</div>
            <div>N° de carte d'identité : .............</div>
            <div>Nationalité : ........................</div>
            <div className="col-span-2">N° de permis de conduire : ...............</div>
          </div>

          <h4 className="font-bold mt-4 mb-2">LA LOCATION</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>Date et heure début : {new Date(facture.dateDebut).toLocaleDateString('fr-FR')} {facture.heureRecuperation || '...........'}</div>
            <div>Date et heure fin : {new Date(facture.dateFin).toLocaleDateString('fr-FR')} {facture.heureRendu || '...........'}</div>
            <div>Soit : {facture.nbJours} Jour(s)</div>
            <div>Prix de location : {facture.prixJour.toLocaleString()} CFA/jour</div>
            <div>Net à payer HT : {facture.montantTotal.toLocaleString()} CFA</div>
            <div>Caution : ................................</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">FACTURER À:</h3>
            <p>{facture.clientPrenom} {facture.clientNom}</p>
            {facture.clientNumeroPermis && (
              <p className="text-sm text-gray-600">Permis: {facture.clientNumeroPermis}</p>
            )}
            {facture.clientNumeroCNI && (
              <p className="text-sm text-gray-600">CNI: {facture.clientNumeroCNI}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">DÉTAILS:</h3>
            <p>Facture N° {facture.numeroContrat}</p>
            <p>Période: {new Date(facture.dateDebut).toLocaleDateString('fr-FR')} - {new Date(facture.dateFin).toLocaleDateString('fr-FR')}</p>
            {facture.heureRecuperation && (
              <p>Heure de prise: {facture.heureRecuperation}</p>
            )}
            {facture.heureRendu && (
              <p>Heure de restitution: {facture.heureRendu}</p>
            )}
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
                Location {facture.vehicleMarque} {facture.vehicleModele}<br />
                <span className="text-sm text-gray-500">{facture.vehicleImmatriculation}</span>
              </td>
              <td className="text-center py-3">{facture.nbJours} jour(s)</td>
              <td className="text-right py-3">{facture.prixJour.toLocaleString()} CFA</td>
              <td className="text-right py-3">{facture.subtotal.toLocaleString()} CFA</td>
            </tr>
            
            {facture.reduction > 0 && (
              <tr className="border-b border-gray-100">
                <td className="py-3 text-red-600">
                  Réduction {facture.reductionType === 'pourcentage' ? `(${facture.reductionValue}%)` : ''}
                </td>
                <td className="text-center py-3">-</td>
                <td className="text-right py-3">-</td>
                <td className="text-right py-3 text-red-600">-{facture.reduction.toLocaleString()} CFA</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-3 font-semibold">TOTAL TTC:</td>
              <td className="text-right py-3 font-bold text-lg text-primary">{facture.montantTotal.toLocaleString()} CFA</td>
            </tr>
          </tfoot>
        </table>

        <div className="text-sm text-gray-600">
          <p><strong>Conditions de paiement:</strong> Paiement à la prise du véhicule</p>
          <p><strong>Modalités:</strong> Espèces, mobile money (Flooz, T-Money), chèque acceptés</p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Pro-Excellence - N° RCCM : TG-LFW-01-2022-A10-00507</p>
          <p>Prestation de service - Nettoyage de Bureau -Achat/Vente/Location d'Appartement – Achat/Vente/Location de Voiture- Réalisation de jardin</p>
          <p>Document généré automatiquement - Facture N° {facture.numeroContrat}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Factures</h2>
          <p className="text-gray-600">Gérez et téléchargez vos factures</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro de facture ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">N° Facture</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Véhicule</th>
                  <th className="text-left py-3 px-4">Période</th>
                  <th className="text-right py-3 px-4">Montant</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactures.map((facture) => (
                  <tr key={facture.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{facture.numeroContrat}</td>
                    <td className="py-3 px-4">{facture.clientPrenom} {facture.clientNom}</td>
                    <td className="py-3 px-4">{facture.vehicleMarque} {facture.vehicleModele}</td>
                    <td className="py-3 px-4">
                      {new Date(facture.dateDebut).toLocaleDateString('fr-FR')} - {new Date(facture.dateFin).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">{facture.montantTotal.toLocaleString()} CFA</td>
                    <td className="py-3 px-4">
                      <Badge variant={facture.statut === 'actif' ? 'default' : facture.statut === 'termine' ? 'secondary' : 'destructive'}>
                        {facture.statut}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFacture(facture)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintFacture(facture)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Render hidden facture previews for PDF generation */}
      {facturesWithDetails.map(facture => renderFacturePreview(facture))}

      {/* Modal for facture preview */}
      {selectedFacture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Aperçu Facture N° {selectedFacture.numeroContrat}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePrintFacture(selectedFacture)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFacture(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
              {renderFacturePreview(selectedFacture, true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactureManagement;