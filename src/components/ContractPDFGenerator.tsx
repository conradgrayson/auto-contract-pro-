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
    const defaultTerms = {
      generalTerms: `• Le véhicule doit être retourné avec le même niveau de carburant qu'au départ.
• Tout retard dans la restitution du véhicule sera facturé une journée supplémentaire.
• Le locataire s'engage à respecter le code de la route et à utiliser le véhicule dans les conditions normales.
• Une caution de 300,000 CFA est demandée et sera restituée après vérification de l'état du véhicule.
• En cas d'accident, le locataire doit immédiatement contacter Pro-Excellence et les autorités compétentes.`,
      companyInfo: `Pro-Excellence - Location de Véhicules
123 Avenue de la Paix, Lomé, Togo
Tél: +228 22 12 34 56
Email: contact@pro-excellence.tg`,
      paymentTerms: `Paiement à la prise du véhicule. Espèces, mobile money acceptés.
Caution de 300,000 CFA exigée.`
    };
    
    if (savedTerms) {
      try {
        return { ...defaultTerms, ...JSON.parse(savedTerms) };
      } catch (e) {
        return defaultTerms;
      }
    }
    return defaultTerms;
  };

  const contractTerms = getContractTerms();
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  let currentY = 30;

  // Fonction pour ajouter du texte avec contrôle de page
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    if (y > pageHeight - 30) {
      pdf.addPage();
      currentY = 30;
      return currentY;
    }
    
    if (options.color) {
      pdf.setTextColor(options.color[0], options.color[1], options.color[2]);
    } else {
      pdf.setTextColor(0, 0, 0);
    }
    pdf.setFontSize(options.fontSize || 10);
    pdf.setFont('helvetica', options.fontStyle || 'normal');
    
    const lines = pdf.splitTextToSize(text, options.maxWidth || pageWidth - 2 * margin);
    pdf.text(lines, x, y);
    
    return y + (lines.length * (options.fontSize || 10) * 0.4) + (options.spacing || 5);
  };

  // En-tête avec informations personnalisées de l'entreprise
  const companyLines = contractTerms.companyInfo.split('\n');
  
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(companyLines[0] || 'PRO-EXCELLENCE', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(64, 64, 64);
  
  // Afficher les autres lignes des informations de l'entreprise
  for (let i = 1; i < companyLines.length; i++) {
    if (companyLines[i].trim()) {
      pdf.text(companyLines[i].trim(), pageWidth / 2, currentY, { align: 'center' });
      currentY += 4;
    }
  }
  
  currentY += 15;
  
  // Ligne de séparation
  pdf.setDrawColor(0, 102, 204);
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // Titre du contrat
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONTRAT DE LOCATION', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`N° ${contract.numeroContrat}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 15;

  // Informations en deux colonnes
  const colWidth = (pageWidth - 3 * margin) / 2;
  
  // Colonne gauche - Client
  let leftY = currentY;
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMATIONS CLIENT', margin, leftY);
  
  leftY += 8;
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  leftY = addText(`Nom: ${contract.clientNom}`, margin, leftY, { spacing: 3 });
  leftY = addText(`Prénom: ${contract.clientPrenom}`, margin, leftY, { spacing: 3 });
  leftY = addText(`Date du contrat: ${new Date().toLocaleDateString('fr-FR')}`, margin, leftY, { spacing: 3 });

  // Colonne droite - Véhicule
  let rightY = currentY;
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VÉHICULE LOUÉ', margin + colWidth + 10, rightY);
  
  rightY += 8;
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  rightY = addText(`Marque: ${contract.vehicleMarque}`, margin + colWidth + 10, rightY, { spacing: 3 });
  rightY = addText(`Modèle: ${contract.vehicleModele}`, margin + colWidth + 10, rightY, { spacing: 3 });
  rightY = addText(`Immatriculation: ${contract.vehicleImmatriculation}`, margin + colWidth + 10, rightY, { spacing: 3 });

  currentY = Math.max(leftY, rightY) + 10;

  // Détails de la location
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DÉTAILS DE LA LOCATION', margin, currentY);
  
  currentY += 10;
  
  // Ligne de séparation
  pdf.setDrawColor(128, 128, 128);
  pdf.setLineWidth(0.2);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // Tableau des détails
  const tableData = [
    ['Date de début', new Date(contract.dateDebut).toLocaleDateString('fr-FR')],
    ['Date de fin', new Date(contract.dateFin).toLocaleDateString('fr-FR')],
    ['Durée', `${contract.nbJours} jour(s)`],
    ['Prix par jour', `${contract.prixJour.toLocaleString()} CFA`],
  ];

  if (contract.heureRecuperation) {
    tableData.push(['Heure de récupération', contract.heureRecuperation]);
  }
  if (contract.heureRendu) {
    tableData.push(['Heure de rendu', contract.heureRendu]);
  }

  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  tableData.forEach(([label, value]) => {
    pdf.text(label + ':', margin, currentY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, margin + 50, currentY);
    pdf.setFont('helvetica', 'normal');
    currentY += 6;
  });

  currentY += 10;

  // Facturation
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FACTURATION', margin, currentY);
  
  currentY += 10;
  
  // Encadré facturation
  const factBox = {
    x: margin,
    y: currentY,
    width: pageWidth - 2 * margin,
    height: 30
  };
  
  pdf.setFillColor(248, 248, 248);
  pdf.rect(factBox.x, factBox.y, factBox.width, factBox.height, 'F');
  pdf.setDrawColor(128, 128, 128);
  pdf.rect(factBox.x, factBox.y, factBox.width, factBox.height);
  
  currentY += 8;
  
  const subtotal = contract.nbJours * contract.prixJour;
  const reduction = contract.montantReduction || 0;
  
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  pdf.text(`Location (${contract.nbJours} jour(s) × ${contract.prixJour.toLocaleString()} CFA)`, margin + 5, currentY);
  pdf.text(`${subtotal.toLocaleString()} CFA`, pageWidth - margin - 5, currentY, { align: 'right' });
  
  currentY += 6;
  
  if (reduction > 0) {
    pdf.setTextColor(220, 53, 69);
    const reductionText = `Réduction ${contract.reductionType === 'pourcentage' ? `(${contract.reductionValue}%)` : ''}`;
    pdf.text(reductionText, margin + 5, currentY);
    pdf.text(`-${reduction.toLocaleString()} CFA`, pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 6;
  }
  
  // Total
  pdf.setDrawColor(128, 128, 128);
  pdf.line(margin + 5, currentY, pageWidth - margin - 5, currentY);
  currentY += 6;
  
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL TTC', margin + 5, currentY);
  pdf.text(`${contract.montantTotal.toLocaleString()} CFA`, pageWidth - margin - 5, currentY, { align: 'right' });
  
  if (contract.caution) {
    currentY += 8;
    pdf.setTextColor(64, 64, 64);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Caution: ${contract.caution.toLocaleString()} CFA`, margin + 5, currentY);
  }

  // Nouvelle page pour les conditions
  pdf.addPage();
  currentY = 30;

  // Conditions générales
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONDITIONS GÉNÉRALES DE LOCATION', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 15;

  // Utiliser les conditions personnalisées
  const generalTermsLines = contractTerms.generalTerms.split('\n').filter(line => line.trim());
  const paymentTermsLines = contractTerms.paymentTerms.split('\n').filter(line => line.trim());

  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Afficher les conditions générales personnalisées
  generalTermsLines.forEach((line, index) => {
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = 30;
    }
    
    currentY = addText(line, margin, currentY, { 
      fontSize: 10, 
      spacing: 5,
      maxWidth: pageWidth - 2 * margin
    });
  });

  // Ajouter les conditions de paiement si elles existent
  if (paymentTermsLines.length > 0) {
    currentY += 10;
    
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = 30;
    }
    
    pdf.setFont('helvetica', 'bold');
    currentY = addText("CONDITIONS DE PAIEMENT", margin, currentY, { fontSize: 11, spacing: 8 });
    
    pdf.setFont('helvetica', 'normal');
    paymentTermsLines.forEach((line) => {
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        currentY = 30;
      }
      
      currentY = addText(line, margin, currentY, { 
        fontSize: 10, 
        spacing: 5,
        maxWidth: pageWidth - 2 * margin
      });
    });
  }

  // Section signatures
  if (currentY > pageHeight - 80) {
    pdf.addPage();
    currentY = 30;
  } else {
    currentY += 20;
  }

  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SIGNATURES', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 20;
  
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Fait à Lomé, le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 30;
  
  // Signatures en deux colonnes
  const sigColWidth = (pageWidth - 3 * margin) / 2;
  
  pdf.text('Le Locataire', margin + sigColWidth / 2, currentY, { align: 'center' });
  pdf.text('Pro-Excellence', margin + sigColWidth + 10 + sigColWidth / 2, currentY, { align: 'center' });
  
  currentY += 20;
  
  // Lignes de signature
  pdf.setDrawColor(128, 128, 128);
  pdf.line(margin, currentY, margin + sigColWidth, currentY);
  pdf.line(margin + sigColWidth + 10, currentY, pageWidth - margin, currentY);

  // Métadonnées
  pdf.setProperties({
    title: `Contrat de Location - ${contract.numeroContrat}`,
    subject: 'Contrat de location de véhicule',
    author: 'Pro-Excellence',
    keywords: 'contrat, location, véhicule',
    creator: 'Pro-Excellence - Système de gestion'
  });

  return pdf;
};

const ContractPDFGenerator: React.FC<ContractPDFGeneratorProps> = ({ contract }) => {
  return null; // Ce composant ne rend rien visuellement
};

export default ContractPDFGenerator;