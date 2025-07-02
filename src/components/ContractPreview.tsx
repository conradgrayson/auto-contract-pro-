import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('contract-content');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
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
    
    pdf.save(`contrat-${contract.numeroContrat}.pdf`);
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
          <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Document imprimable */}
      <div id="contract-content" className="print-page bg-white">
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
                <p><strong>NB :</strong> La caution est restituée à la fin du contrat de location en intégralité / Déduction s'il y'a de dégâts résultant de la location.</p>
                <p>La voiture doit être utilisée uniquement à ………………................................................................……………… Et demeure sous la responsabilité du locataire durant toute la durée de ce présent contrat.</p>
                
                <p><strong>1. CONDITIONS ET DISPOSITIONS GENERALES</strong></p>
                <p>• Le chauffeur dont les références ont été mentionné sur ce contrat et le locataire (s'il a de permis de conduire valide) sont les seuls autorisés à conduire ladite voiture durant tout le contrat.</p>
                <p>• Franchise à la charge du locataire, par évènement ; demeure réservé les cas de fautes graves du conducteur, qui sont à sa charge.</p>
                <p>• Les frais de location sont payés en totalité à la signature du présent contrat. Le véhicule doit être restitué à la fin du contrat avec le même niveau de carburant noté, et dans le même état qu'au début du contrat.</p>
                <p>• En cas de retard pour le retour du véhicule, le locataire sera contraint de payer une pénalité de 5 000FCFA qui lui sera facturée par Heure. Un retard plus de 02 heures est considéré comme une prolongation de contrat d'une journée.</p>
                <p>• Une somme de 2 000FCFA est perçue à la restitution du véhicule pour les frais de lavage.</p>
                <p>• Un service de livraison/récupération du véhicule est disponible sur demande. Les frais supplémentaires correspondants 5.000 FCFA vous seront facturés</p>
                
                <p><strong>2. INTERDICTIONS</strong></p>
                <p>L'utilisation du véhicule est strictement interdite dans les cas suivants :</p>
                <p>• Pour le transport de personnes ou de marchandise contre dédommagement.</p>
                <p>• Transport de matières dangereuses / Tirer, pousser ou propulser un autre véhicule</p>
                <p>• La sous location / Mettre la voiture louée en gage</p>
                <p>• Pour des cours d'Auto – Ecole / Participation à des courses ou compétitions de toutes sortes</p>
                <p>Le non-respect des interdictions oblige l'Agence à retirer le véhicule immédiatement auprès du locataire sans restitution du reliquat.</p>
                
                <p><strong>3. RESPONSABILITE, CONDUITE, EMPLOI, ENTRETIEN</strong></p>
                <p>• Le locataire doit vérifier l'état de la voiture à sa prise car tous dommages ultérieurs découverts à la fin du contrat seront à sa charge.</p>
                <p>• Le locataire peut utiliser, avec approbation de l'Agence, la voiture louée hors de la zone précisée au préambule du contrat tout en effectuant un complément selon sa nouvelle destination (5 000fcfa de surplus journalier selon chaque région franchise et de 15 000fcfa de surplus journalier pour les hors frontières).</p>
                <p>• Le locataire est responsable du contrôle des niveaux d'huile, de l'eau, du liquide de frein et de la pression des pneus. L'entretien du véhicule en général.</p>
                <p>• Le locataire s'engage à conduire correctement le véhicule et à respecter les limites de vitesse du code de la route en circulation. Nos voitures sont équipés d'un système de Localisation.</p>
                <p>• En cas d'accident ou de problème de tout genre ; contactez immédiatement l'Agence. Nous vous donnerons la marche à suivre pour effectuer des réparations ou bénéficier d'un véhicule de remplacement.</p>
                <p>• En cas de réparation de la voiture pour des petites pannes, les responsabilités sont partagées à part égales.</p>
                
                <p><strong>4. CAUTIONNEMENT</strong></p>
                <p>• Le cautionnaire ayant pris connaissance des contours et conditions du contrat de location, s'engage à répondre en qualité caution solidaire du locataire au cas où surviendrait un litige ou un dommage qui engage sa responsabilité.</p>
                <p>• Le cautionnaire est responsable au même titre que le locataire en cas de dommages et détérioration du bien louer.</p>
                <p>• Il est responsable des impayés de la location si le locataire n'arrive pas à payer</p>
                <p>• Il est aussi responsable en cas de perte du bien loué.</p>
                
                <p><strong>5. PROLONGATION DE LA DUREE DU CONTRAT</strong></p>
                <p>Une prolongation de la durée du contrat n'est possible qu'avec l'approbation de l'Agence 24 heures avant la fin de la durée contractuelle en cours. L'Agence peut refuser la prolongation sans avoir à donner de raison. En cas d'approbation de la prolongation de la durée, toutes les conditions du contrat d'origine continuent à s'appliquer en l'absence d'accords écrits contraires : La tacite reconduction du contrat est nulle et de nul effet.</p>
                
                <p><strong>RESTITUTION ANTICIPEE DU BIEN EN LOCATION - CAS D'ACCIDENT ET DE VOL</strong></p>
                <p><strong>6.</strong> Pour une durée minimum de deux jours, en cas de résiliation de contrat par faute ou désir du locataire, seule la moitié du reliquat lui sera restituée.</p>
                <p><strong>7.</strong> Le véhicule est assuré aux tiers compte tenu des conditions de nos assureurs. Eventuellement, en cas d'accident, tous dommages occasionnés par notre véhicule est pris en charge par notre assurance ; par contre, les dommages sur notre véhicule ne le sont pas. Tout locataire de ce véhicule consent à cette condition d'assurance et accepte à sa charge toutes dépenses liées aux formalités administratives et à la réparation dudit véhicule en cas d'accident.</p>
                <p>Pour tout accident survenu au cours du contrat, le locataire doit prévenir dans l'immédiat l'agence et établir un constat par la police ou la gendarmerie. Le locataire est tenu de réparer tous dommages occasionnés dans le garage de l'Agence et de remettre la voiture en état dans les sept (dégâts majeurs), les trois (dégâts mineurs) premiers jours qui suivent l'accident; passer ce délai, le locataire s'oblige de verser les frais de location journalières de ladite voiture à l'Agence jusqu'à réparation totale de ce dernier.</p>
                <p>En cas de vol ou en cas d'accident grave, où le véhicule est totalement irrécupérable, le locataire s'oblige de verser à l'Agence les fonds correspondant à la valeur de la voiture ou d'acheter la même voiture de même valeur d'achat que l'ancienne et de même caractéristique dans un délai maximum de quarante-cinq (45) jours qui suivent le vol ou l'accident.</p>
                <p><strong>8. LITIGE</strong></p>
                <p>Tout différend relatif à l'interprétation ou à l'exécution des clauses du présent contrat et ses suites sera réglé à l'amiable. A défaut du règlement à l'amiable et sauf compromis, tout différend sera réglé par toute autorité pénale.</p>
                <p>Le soussigné déclare avoir lu et approuvé sans restriction des conditions et les dispositions générales du présent contrat.</p>
                
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
