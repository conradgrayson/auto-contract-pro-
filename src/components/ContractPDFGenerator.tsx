import React from 'react';
import jsPDF from 'jspdf';

interface Contract {
  id: string;
  clientNom: string;
  clientPrenom: string;
  vehicleMarque: string;
  vehicleModele: string;
  vehicleImmatriculation: string;
  dateDebut: string;
  dateFin: string;
  prixJour: number;
  nbJours: number;
  montantTotal: number;
  numeroContrat: string;
  reductionType?: string;
  reductionValue?: number;
  montantReduction?: number;
  heureRecuperation?: string;
  heureRendu?: string;
  caution?: number;
}

interface ContractTerms {
  generalTerms: string;
  companyInfo: string;
  paymentTerms: string;
}

interface ContractPDFGeneratorProps {
  contract: Contract;
}

export const generateContractPDF = (contract: Contract) => {
  // Récupérer les termes personnalisés depuis localStorage
  const getContractTerms = (): ContractTerms => {
    const savedTerms = localStorage.getItem('contractTerms');
    console.log('Données récupérées du localStorage:', savedTerms);
    
    if (savedTerms) {
      try {
        const parsed = JSON.parse(savedTerms);
        console.log('Données parsées:', parsed);
        return parsed;
      } catch (e) {
        console.error('Erreur lors du parsing des termes du contrat:', e);
      }
    }
    
    // Valeurs par défaut si aucune donnée sauvegardée
    return {
      generalTerms: `• Le véhicule doit être retourné avec le même niveau de carburant qu'au départ.
• Tout retard dans la restitution du véhicule sera facturé une journée supplémentaire.
• Le locataire s'engage à respecter le code de la route et à utiliser le véhicule dans les conditions normales.`,
      companyInfo: `Pro-Excellence - Location de Véhicules
123 Avenue de la Paix
Lomé, Togo
Tél: +228 22 12 34 56`,
      paymentTerms: `Paiement à la prise du véhicule
Modalités: Espèces, mobile money, chèque acceptés`
    };
  };

  const contractTerms = getContractTerms();
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  let currentY = 25;

  // Couleurs du design professionnel
  const primaryBlue = [0, 102, 204]; // Bleu principal
  const darkGray = [64, 64, 64]; // Gris foncé
  const lightGray = [128, 128, 128]; // Gris clair
  const bgGray = [248, 248, 248]; // Gris de fond

  // Fonction pour ajouter du texte avec contrôle de page
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const fontSize = options.fontSize || 10;
    const lineHeight = options.lineHeight || 1.4;
    const maxWidth = options.maxWidth || pageWidth - 2 * margin;
    
    if (y > pageHeight - 30) {
      pdf.addPage();
      currentY = 25;
      return currentY;
    }
    
    if (options.color) {
      pdf.setTextColor(options.color[0], options.color[1], options.color[2]);
    } else {
      pdf.setTextColor(0, 0, 0);
    }
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', options.fontStyle || 'normal');
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    
    return y + (lines.length * fontSize * lineHeight * 0.35) + (options.spacing || 4);
  };

  // EN-TÊTE PROFESSIONNEL SIMPLE ET EFFICACE
  // Fond bleu pour l'en-tête
  pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.rect(0, 0, pageWidth, 55, 'F');

  // SECTION GAUCHE - Nom de l'entreprise très visible
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRO-EXCELLENCE', margin, 25);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Location de Véhicules', margin, 35);
  
  pdf.setFontSize(10);
  pdf.text('Lomé, Togo • Tél: +228 70 62 45 75 / 99 07 52 06', margin, 45);

  // SECTION DROITE - Informations du contrat alignées
  const now = new Date();
  const dateOnly = now.toLocaleDateString('fr-FR');
  const timeOnly = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  const rightX = pageWidth - margin;
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  
  // Numéro de contrat
  pdf.text(`Contrat N° ${contract.numeroContrat}`, rightX, 25, { align: 'right' });
  
  // Date et heure
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Créé le ${dateOnly} à ${timeOnly}`, rightX, 35, { align: 'right' });

  currentY = 70;

  // TITRE DU DOCUMENT - Section séparée avec style professionnel
  pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONTRAT DE LOCATION', pageWidth / 2, currentY, { align: 'center' });
  
  // Double ligne décorative
  pdf.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setLineWidth(2);
  pdf.line(margin + 50, currentY + 5, pageWidth - margin - 50, currentY + 5);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 60, currentY + 8, pageWidth - margin - 60, currentY + 8);

  currentY += 25;

  // SECTION CLIENT ET VÉHICULE
  const colWidth = (pageWidth - 3 * margin) / 2;
  
  // Encadré Client
  pdf.setFillColor(bgGray[0], bgGray[1], bgGray[2]);
  pdf.rect(margin, currentY, colWidth, 35, 'F');
  pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.rect(margin, currentY, colWidth, 35);
  
  pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMATIONS CLIENT', margin + 5, currentY + 8);
  
  pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nom: ${contract.clientNom}`, margin + 5, currentY + 16);
  pdf.text(`Prénom: ${contract.clientPrenom}`, margin + 5, currentY + 22);
  pdf.text(`Date du contrat: ${new Date().toLocaleDateString('fr-FR')}`, margin + 5, currentY + 28);

  // Encadré Véhicule
  pdf.setFillColor(bgGray[0], bgGray[1], bgGray[2]);
  pdf.rect(margin + colWidth + 10, currentY, colWidth, 35, 'F');
  pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.rect(margin + colWidth + 10, currentY, colWidth, 35);
  
  pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VÉHICULE LOUÉ', margin + colWidth + 15, currentY + 8);
  
  pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Marque: ${contract.vehicleMarque}`, margin + colWidth + 15, currentY + 16);
  pdf.text(`Modèle: ${contract.vehicleModele}`, margin + colWidth + 15, currentY + 22);
  pdf.text(`Immatriculation: ${contract.vehicleImmatriculation}`, margin + colWidth + 15, currentY + 28);

  currentY += 50;

  // TABLEAU DES DÉTAILS DE LOCATION - Style professionnel
  pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DÉTAILS DE LA LOCATION', margin, currentY);
  
  currentY += 12;

  // En-tête du tableau
  pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', margin + 5, currentY + 5.5);
  pdf.text('Quantité', margin + 80, currentY + 5.5, { align: 'center' });
  pdf.text('Prix unitaire', margin + 120, currentY + 5.5, { align: 'right' });
  pdf.text('Total', pageWidth - margin - 5, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Lignes du tableau
  const tableData = [
    [`Location (${new Date(contract.dateDebut).toLocaleDateString('fr-FR')} - ${new Date(contract.dateFin).toLocaleDateString('fr-FR')})`, `${contract.nbJours} jour(s)`, `${contract.prixJour.toLocaleString()} CFA`, `${(contract.nbJours * contract.prixJour).toLocaleString()} CFA`]
  ];

  if (contract.heureRecuperation) {
    tableData.push([`Heure de récupération: ${contract.heureRecuperation}`, '', '', '']);
  }
  if (contract.heureRendu) {
    tableData.push([`Heure de rendu: ${contract.heureRendu}`, '', '', '']);
  }

  pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  tableData.forEach((row, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(bgGray[0], bgGray[1], bgGray[2]);
      pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');
    }
    
    pdf.text(row[0], margin + 5, currentY + 5.5);
    if (row[1]) pdf.text(row[1], margin + 80, currentY + 5.5, { align: 'center' });
    if (row[2]) pdf.text(row[2], margin + 120, currentY + 5.5, { align: 'right' });
    if (row[3]) pdf.text(row[3], pageWidth - margin - 5, currentY + 5.5, { align: 'right' });
    
    currentY += 8;
  });

  // Réduction si applicable
  if (contract.montantReduction && contract.montantReduction > 0) {
    pdf.setTextColor(220, 53, 69);
    pdf.text(`Réduction ${contract.reductionType === 'pourcentage' ? `(${contract.reductionValue}%)` : ''}`, margin + 5, currentY + 5.5);
    pdf.text(`-${contract.montantReduction.toLocaleString()} CFA`, pageWidth - margin - 5, currentY + 5.5, { align: 'right' });
    currentY += 8;
  }

  // Ligne de séparation
  pdf.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setLineWidth(1);
  pdf.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
  currentY += 8;

  // Total
  pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.rect(margin, currentY, pageWidth - 2 * margin, 10, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL TTC', margin + 5, currentY + 6.5);
  pdf.text(`${contract.montantTotal.toLocaleString()} CFA`, pageWidth - margin - 5, currentY + 6.5, { align: 'right' });

  currentY += 20;

  if (contract.caution) {
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Caution: ${contract.caution.toLocaleString()} CFA`, margin, currentY);
    currentY += 10;
  }

  // CONDITIONS DE PAIEMENT
  if (contractTerms.paymentTerms.trim()) {
    pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    currentY = addText('CONDITIONS DE PAIEMENT', margin, currentY, { spacing: 8 });
    
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    currentY = addText(contractTerms.paymentTerms, margin, currentY, { spacing: 15 });
  }

  // NOUVELLE PAGE POUR CONDITIONS GÉNÉRALES (optimisée pour tenir sur 2 pages)
  pdf.addPage();
  currentY = 20;

  // En-tête de page 2 (compact)
  pdf.setFillColor(bgGray[0], bgGray[1], bgGray[2]);
  pdf.rect(0, 0, pageWidth, 20, 'F');
  
  pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONDITIONS GÉNÉRALES DE LOCATION', pageWidth / 2, 13, { align: 'center' });

  currentY = 30;

  // Conditions générales (réduction automatique de la police pour tenir sur 2 pages)
  if (contractTerms.generalTerms.trim()) {
    const maxWidth = pageWidth - 2 * margin;
    const maxTermsBottomY = pageHeight - 85; // laisse de la place pour les signatures

    let termsFont = 9; // taille de base
    const minFont = 7; // taille minimale pour lisibilité
    const lineHeight = 1.2;
    const spacing = 3;

    let lines: string[] = [];

    // Ajuste la taille de police jusqu'à ce que le texte tienne dans l'espace disponible
    while (termsFont >= minFont) {
      pdf.setFontSize(termsFont);
      lines = pdf.splitTextToSize(contractTerms.generalTerms, maxWidth);
      const predictedHeight = (lines.length * termsFont * lineHeight * 0.35) + spacing;
      if (currentY + predictedHeight <= maxTermsBottomY) break;
      termsFont -= 0.5;
    }

    // Rendu des conditions générales
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(termsFont);
    pdf.text(lines, margin, currentY);

    // Positionne le curseur à la fin de la zone allouée (évite d'ajouter une 3e page)
    currentY = maxTermsBottomY;
  }

  // SIGNATURES (toujours en bas de la page 2)
  const sigAreaTop = pageHeight - 70;
  currentY = Math.max(currentY + 10, sigAreaTop);

  pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SIGNATURES', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 12;
  
  pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Fait à Lomé, le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 22;
  
  // Zones de signature
  const sigWidth = 60;
  const leftSigX = margin + 20;
  const rightSigX = pageWidth - margin - sigWidth - 20;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Le Locataire', leftSigX + sigWidth/2, currentY, { align: 'center' });
  pdf.text('Pro-Excellence', rightSigX + sigWidth/2, currentY, { align: 'center' });
  
  currentY += 22;
  
  // Lignes de signature
  pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.line(leftSigX, currentY, leftSigX + sigWidth, currentY);
  pdf.line(rightSigX, currentY, rightSigX + sigWidth, currentY);

  // Pied de page professionnel
  currentY = pageHeight - 20;
  pdf.setFillColor(bgGray[0], bgGray[1], bgGray[2]);
  pdf.rect(0, currentY - 10, pageWidth, 30, 'F');
  
  pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Pro-Excellence - N° RCCM : TG-LFW-01-2022-A10-00507', pageWidth / 2, currentY, { align: 'center' });
  pdf.text(`Document généré automatiquement - Contrat N° ${contract.numeroContrat}`, pageWidth / 2, currentY + 5, { align: 'center' });

  // Métadonnées
  pdf.setProperties({
    title: `Contrat de Location - ${contract.numeroContrat}`,
    subject: 'Contrat de location de véhicule',
    author: 'Pro-Excellence',
    keywords: 'contrat, location, véhicule, pro-excellence',
    creator: 'Pro-Excellence - Système de gestion'
  });

  return pdf;
};

const ContractPDFGenerator: React.FC<ContractPDFGeneratorProps> = ({ contract }) => {
  return null; // Ce composant ne rend rien visuellement
};

export default ContractPDFGenerator;