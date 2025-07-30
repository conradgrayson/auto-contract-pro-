import React from 'react';
import jsPDF from 'jspdf';
import { ContratPartenaire } from '@/hooks/useSupabaseContratsPartenaires';

interface ContratPartenairePDFGeneratorProps {
  contrat: ContratPartenaire;
}

export const generateContratPartenairePDF = (contrat: ContratPartenaire) => {
  // Récupérer les termes personnalisés depuis localStorage
  const getContractTerms = () => {
    const savedTerms = localStorage.getItem('contractTerms');
    const defaultTerms = {
      generalTerms: '',
      companyInfo: `Pro-Excellence - Location de Véhicules
123 Avenue de la Paix, Lomé, Togo
Tél: +228 22 12 34 56
Email: contact@pro-excellence.tg`,
      paymentTerms: ''
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
  pdf.text('CONTRAT DE PARTENARIAT', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`N° ${contrat.numero_contrat}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Date d'établissement: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 20;

  // Informations en deux colonnes
  const colWidth = (pageWidth - 3 * margin) / 2;
  
  // Colonne gauche - Partenaire
  let leftY = currentY;
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMATIONS PARTENAIRE', margin, leftY);
  
  leftY += 8;
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  leftY = addText(`Nom/Raison sociale: ${contrat.nom_partenaire}`, margin, leftY, { spacing: 4 });
  leftY = addText(`Type: ${getTypeLabel(contrat.type_partenariat)}`, margin, leftY, { spacing: 4 });
  leftY = addText(`Email: ${contrat.email_partenaire}`, margin, leftY, { spacing: 4 });
  leftY = addText(`Téléphone: ${contrat.telephone_partenaire}`, margin, leftY, { spacing: 4 });
  leftY = addText(`Adresse: ${contrat.adresse_partenaire}`, margin, leftY, { 
    spacing: 4,
    maxWidth: colWidth - 5
  });

  // Colonne droite - Contrat
  let rightY = currentY;
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DÉTAILS DU CONTRAT', margin + colWidth + 10, rightY);
  
  rightY += 8;
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  rightY = addText(`Date de début: ${new Date(contrat.date_debut).toLocaleDateString('fr-FR')}`, margin + colWidth + 10, rightY, { spacing: 4 });
  if (contrat.heure_debut) {
    rightY = addText(`Heure de début: ${contrat.heure_debut}`, margin + colWidth + 10, rightY, { spacing: 4 });
  }
  rightY = addText(`Date de fin: ${new Date(contrat.date_fin).toLocaleDateString('fr-FR')}`, margin + colWidth + 10, rightY, { spacing: 4 });
  if (contrat.heure_fin) {
    rightY = addText(`Heure de fin: ${contrat.heure_fin}`, margin + colWidth + 10, rightY, { spacing: 4 });
  }
  rightY = addText(`Montant: ${contrat.montant_total.toLocaleString('fr-FR')} CFA`, margin + colWidth + 10, rightY, { spacing: 4 });
  rightY = addText(`Statut: ${getStatusLabel(contrat.statut)}`, margin + colWidth + 10, rightY, { spacing: 4 });

  currentY = Math.max(leftY, rightY) + 15;

  // Objet du contrat
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OBJET DU CONTRAT', margin, currentY);
  
  currentY += 10;
  
  // Encadré pour l'objet
  const objHeight = 30;
  pdf.setFillColor(248, 248, 248);
  pdf.rect(margin, currentY, pageWidth - 2 * margin, objHeight, 'F');
  pdf.setDrawColor(128, 128, 128);
  pdf.rect(margin, currentY, pageWidth - 2 * margin, objHeight);
  
  currentY += 8;
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  currentY = addText(contrat.objet_contrat, margin + 5, currentY, {
    maxWidth: pageWidth - 2 * margin - 10,
    spacing: 4
  });

  // Nouvelle page pour les conditions
  pdf.addPage();
  currentY = 30;

  // Conditions générales
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONDITIONS GÉNÉRALES ET PARTICULIÈRES', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 20;

  const articles = [
    {
      title: "Article 1 - Objet et durée",
      content: `Le présent contrat a pour objet de définir les modalités du partenariat entre les parties pour la période allant du ${new Date(contrat.date_debut).toLocaleDateString('fr-FR')} au ${new Date(contrat.date_fin).toLocaleDateString('fr-FR')}.`
    },
    {
      title: "Article 2 - Obligations des parties",
      content: "Chaque partie s'engage à respecter les termes et conditions définis dans le présent contrat et à agir de bonne foi dans l'exécution de ses obligations. Les prestations devront être réalisées dans les délais convenus et selon les standards de qualité requis."
    },
    {
      title: "Article 3 - Conditions financières",
      content: `Le montant total du partenariat s'élève à ${contrat.montant_total.toLocaleString('fr-FR')} CFA, payable selon les modalités convenues entre les parties. Les factures devront être réglées dans un délai de 30 jours suivant leur émission.`
    },
    {
      title: "Article 4 - Confidentialité",
      content: "Les parties s'engagent à maintenir la confidentialité de toutes les informations échangées dans le cadre de ce partenariat. Cette obligation subsiste pendant toute la durée du contrat et 5 ans après son expiration."
    },
    {
      title: "Article 5 - Résiliation",
      content: "Le présent contrat peut être résilié par l'une ou l'autre des parties avec un préavis de 30 jours, sauf cas de force majeure ou manquement grave aux obligations contractuelles. En cas de résiliation anticipée, les prestations déjà effectuées devront être réglées."
    }
  ];

  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  articles.forEach((article) => {
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = 30;
    }
    
    pdf.setFont('helvetica', 'bold');
    currentY = addText(article.title, margin, currentY, { fontSize: 11, spacing: 5 });
    
    pdf.setFont('helvetica', 'normal');
    currentY = addText(article.content, margin, currentY, { 
      fontSize: 10, 
      spacing: 10,
      maxWidth: pageWidth - 2 * margin
    });
  });

  // Conditions particulières si elles existent
  if (contrat.conditions_particulieres) {
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = 30;
    } else {
      currentY += 10;
    }
    
    pdf.setFont('helvetica', 'bold');
    currentY = addText("Conditions particulières", margin, currentY, { fontSize: 11, spacing: 5 });
    
    pdf.setFont('helvetica', 'normal');
    currentY = addText(contrat.conditions_particulieres, margin, currentY, { 
      fontSize: 10, 
      spacing: 10,
      maxWidth: pageWidth - 2 * margin
    });
  }

  // Article final
  if (currentY > pageHeight - 40) {
    pdf.addPage();
    currentY = 30;
  } else {
    currentY += 15;
  }

  pdf.setFont('helvetica', 'bold');
  currentY = addText("Article 6 - Droit applicable et juridiction", margin, currentY, { fontSize: 11, spacing: 5 });
  
  pdf.setFont('helvetica', 'normal');
  currentY = addText("Le présent contrat est régi par le droit togolais. Tout litige relatif à son interprétation ou à son exécution sera soumis aux tribunaux compétents de Lomé, Togo.", margin, currentY, { 
    fontSize: 10, 
    spacing: 15,
    maxWidth: pageWidth - 2 * margin
  });

  // Nouvelle page pour les signatures
  pdf.addPage();
  currentY = 30;

  // Section signatures
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SIGNATURES', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 20;
  
  pdf.setTextColor(64, 64, 64);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Fait à Lomé, le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 40;
  
  // Signatures en deux colonnes
  const sigColWidth = (pageWidth - 3 * margin) / 2;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Pour l\'entreprise', margin + sigColWidth / 2, currentY, { align: 'center' });
  pdf.text('Pour le partenaire', margin + sigColWidth + 10 + sigColWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.text('PRO-EXCELLENCE', margin + sigColWidth / 2, currentY, { align: 'center' });
  pdf.text(contrat.nom_partenaire, margin + sigColWidth + 10 + sigColWidth / 2, currentY, { align: 'center' });
  
  currentY += 30;
  
  // Lignes de signature
  pdf.setDrawColor(128, 128, 128);
  pdf.line(margin, currentY, margin + sigColWidth, currentY);
  pdf.line(margin + sigColWidth + 10, currentY, pageWidth - margin, currentY);
  
  currentY += 8;
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  pdf.text('Signature et cachet', margin + sigColWidth / 2, currentY, { align: 'center' });
  pdf.text('Signature', margin + sigColWidth + 10 + sigColWidth / 2, currentY, { align: 'center' });

  // Métadonnées
  pdf.setProperties({
    title: `Contrat de Partenariat - ${contrat.numero_contrat}`,
    subject: 'Contrat de partenariat commercial',
    author: 'Pro-Excellence',
    keywords: 'contrat, partenariat, commercial',
    creator: 'Pro-Excellence - Système de gestion'
  });

  return pdf;
};

const ContratPartenairePDFGenerator: React.FC<ContratPartenairePDFGeneratorProps> = ({ contrat }) => {
  return null; // Ce composant ne rend rien visuellement
};

export default ContratPartenairePDFGenerator;