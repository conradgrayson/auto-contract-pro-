import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { ContratPartenaire } from '@/hooks/useSupabaseContratsPartenaires';
import { generateContratPartenairePDF } from './ContratPartenairePDFGenerator';

interface ContratPartenairePreviewProps {
  contrat: ContratPartenaire;
  onBack: () => void;
}

const ContratPartenairePreview = ({ contrat, onBack }: ContratPartenairePreviewProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    const pdf = generateContratPartenairePDF(contrat);
    pdf.save(`contrat-partenaire-${contrat.numero_contrat}.pdf`);
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'fournisseur': 'Fournisseur',
      'client_entreprise': 'Client Entreprise', 
      'assurance': 'Assurance',
      'maintenance': 'Maintenance',
      'partenaire_commercial': 'Partenaire Commercial',
      'sous_traitant': 'Sous-traitant',
      'autre': 'Autre',
    };
    return types[type] || type;
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif';
      case 'expire': return 'Expiré';
      case 'suspendu': return 'Suspendu';
      case 'termine': return 'Terminé';
      default: return statut;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold">Contrat Partenaire - {contrat.numero_contrat}</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={handleSavePDF} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Sauvegarder PDF
          </Button>
        </div>
      </div>

      {/* Document imprimable */}
      <div id="contrat-partenaire-content" className="print-page bg-white">
        <style>
          {`
            @media print {
              .print-page {
                margin: 0;
                padding: 20mm;
                font-size: 12px;
                line-height: 1.4;
                color: black;
                background: white;
                box-shadow: none;
                width: 210mm;
                min-height: 297mm;
              }
              .print-section {
                page-break-inside: avoid;
                margin-bottom: 15mm;
              }
              .print-header {
                text-align: center;
                margin-bottom: 20mm;
                page-break-after: avoid;
              }
              .print-info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15mm;
                margin-bottom: 15mm;
                page-break-inside: avoid;
              }
              .print-conditions {
                page-break-before: always;
                font-size: 11px;
                line-height: 1.3;
              }
              .print-conditions h3 {
                font-size: 14px;
                margin-bottom: 10mm;
              }
              .print-conditions p {
                margin-bottom: 5mm;
                text-align: justify;
              }
              .print-signature-section {
                page-break-before: always;
                margin-top: 20mm;
              }
              .print-signature-boxes {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20mm;
                margin-top: 30mm;
              }
              .signature-box {
                text-align: center;
                border-top: 1px solid #000;
                padding-top: 5mm;
                margin-top: 20mm;
              }
            }
          `}
        </style>

        <div className="max-w-4xl mx-auto p-8">
          {/* En-tête */}
          <div className="text-center mb-12 print-header">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">CONTRAT DE PARTENARIAT</h1>
            <p className="text-lg text-gray-600">N° {contrat.numero_contrat}</p>
            <p className="text-sm text-gray-500 mt-2">
              Date d'établissement : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Informations principales */}
          <div className="print-info-grid print-section">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informations du Partenaire
              </h3>
              <div className="space-y-2">
                <p><strong>Nom/Raison sociale :</strong> {contrat.nom_partenaire}</p>
                <p><strong>Type de partenariat :</strong> {getTypeLabel(contrat.type_partenariat)}</p>
                <p><strong>Email :</strong> {contrat.email_partenaire}</p>
                <p><strong>Téléphone :</strong> {contrat.telephone_partenaire}</p>
                <p><strong>Adresse :</strong> {contrat.adresse_partenaire}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Détails du Contrat
              </h3>
              <div className="space-y-2">
                <p><strong>Date de début :</strong> {new Date(contrat.date_debut).toLocaleDateString('fr-FR')}</p>
                <p><strong>Date de fin :</strong> {new Date(contrat.date_fin).toLocaleDateString('fr-FR')}</p>
                <p><strong>Montant total :</strong> {contrat.montant_total.toLocaleString('fr-FR')} CFA</p>
                <p><strong>Statut :</strong> {getStatusLabel(contrat.statut)}</p>
              </div>
            </div>
          </div>

          {/* Objet du contrat */}
          <div className="mb-8 print-section">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Objet du Contrat
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap text-justify">
              {contrat.objet_contrat}
            </p>
          </div>

          {/* Conditions particulières sur une nouvelle page */}
          <div className="print-conditions">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              CONDITIONS GÉNÉRALES ET PARTICULIÈRES
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Article 1 - Objet et durée</h4>
                <p>
                  Le présent contrat a pour objet de définir les modalités du partenariat entre les parties 
                  pour la période allant du {new Date(contrat.date_debut).toLocaleDateString('fr-FR')} 
                  au {new Date(contrat.date_fin).toLocaleDateString('fr-FR')}.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Article 2 - Obligations des parties</h4>
                <p>
                  Chaque partie s'engage à respecter les termes et conditions définis dans le présent contrat 
                  et à agir de bonne foi dans l'exécution de ses obligations.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Article 3 - Conditions financières</h4>
                <p>
                  Le montant total du partenariat s'élève à {contrat.montant_total.toLocaleString('fr-FR')} CFA, 
                  payable selon les modalités convenues entre les parties.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Article 4 - Résiliation</h4>
                <p>
                  Le présent contrat peut être résilié par l'une ou l'autre des parties avec un préavis 
                  de 30 jours, sauf cas de force majeure ou manquement grave aux obligations contractuelles.
                </p>
              </div>

              {contrat.conditions_particulieres && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conditions particulières</h4>
                  <p className="whitespace-pre-wrap text-justify">
                    {contrat.conditions_particulieres}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Article 5 - Droit applicable</h4>
                <p>
                  Le présent contrat est régi par le droit en vigueur. Tout litige relatif à son interprétation 
                  ou à son exécution sera soumis aux tribunaux compétents.
                </p>
              </div>
            </div>
          </div>

          {/* Section signatures sur une nouvelle page */}
          <div className="print-signature-section">
            <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">
              SIGNATURES
            </h3>
            
            <p className="text-center mb-8">
              Fait à _________________, le {new Date().toLocaleDateString('fr-FR')}
            </p>

            <div className="print-signature-boxes">
              <div className="text-center">
                <p className="font-semibold mb-4">Pour l'entreprise</p>
                <div className="signature-box">
                  <p className="text-sm">Signature et cachet</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-semibold mb-4">Pour le partenaire</p>
                <p className="text-sm mb-4">{contrat.nom_partenaire}</p>
                <div className="signature-box">
                  <p className="text-sm">Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratPartenairePreview;