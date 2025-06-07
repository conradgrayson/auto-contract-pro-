import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, FileText, Printer, Eye, Calendar } from 'lucide-react';
import ContractForm from './ContractForm';
import ContractPreview from './ContractPreview';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

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
}

const ContractManagement = () => {
  const { toast } = useToast();
  const [contracts, setContracts] = useLocalStorage<Contract[]>('contracts', [
    {
      id: '1',
      clientId: '1',
      clientNom: 'Dupont',
      clientPrenom: 'Jean',
      vehicleId: '1',
      vehicleMarque: 'Peugeot',
      vehicleModele: '308',
      vehicleImmatriculation: 'AA-123-BB',
      dateDebut: '2024-06-06',
      dateFin: '2024-06-13',
      prixJour: 25000,
      nbJours: 7,
      montantTotal: 175000,
      statut: 'actif',
      dateCreation: '2024-06-06',
      conditions: 'Véhicule à retourner avec le plein de carburant'
    },
    {
      id: '2',
      clientId: '2',
      clientNom: 'Martin',
      clientPrenom: 'Marie',
      vehicleId: '2',
      vehicleMarque: 'Renault',
      vehicleModele: 'Clio',
      vehicleImmatriculation: 'CC-456-DD',
      dateDebut: '2024-05-15',
      dateFin: '2024-05-22',
      prixJour: 20000,
      nbJours: 7,
      montantTotal: 140000,
      statut: 'termine',
      dateCreation: '2024-05-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [previewContract, setPreviewContract] = useState<Contract | null>(null);

  const filteredContracts = contracts.filter(contract =>
    contract.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.clientPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.vehicleMarque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.vehicleModele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.vehicleImmatriculation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'termine': return 'bg-blue-100 text-blue-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'actif': return 'En cours';
      case 'termine': return 'Terminé';
      case 'annule': return 'Annulé';
      default: return status;
    }
  };

  const handleSaveContract = (contractData: Omit<Contract, 'id' | 'dateCreation' | 'montantTotal' | 'nbJours'>) => {
    const dateDebut = new Date(contractData.dateDebut);
    const dateFin = new Date(contractData.dateFin);
    const nbJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
    const montantTotal = nbJours * contractData.prixJour;

    if (editingContract) {
      setContracts(prev => prev.map(c => 
        c.id === editingContract.id 
          ? { ...contractData, id: editingContract.id, dateCreation: editingContract.dateCreation, nbJours, montantTotal }
          : c
      ));
      toast({
        title: "Contrat modifié",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
    } else {
      const newContract: Contract = {
        ...contractData,
        id: Date.now().toString(),
        dateCreation: new Date().toISOString().split('T')[0],
        nbJours,
        montantTotal
      };
      setContracts(prev => [...prev, newContract]);
      toast({
        title: "Contrat créé",
        description: "Le nouveau contrat a été créé avec succès.",
      });
    }
    setShowForm(false);
    setEditingContract(null);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setShowForm(true);
  };

  const handleDeleteContract = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      setContracts(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Contrat supprimé",
        description: "Le contrat a été supprimé avec succès.",
      });
    }
  };

  const handlePreviewContract = (contract: Contract) => {
    setPreviewContract(contract);
  };

  if (showForm) {
    return (
      <ContractForm
        contract={editingContract}
        onSave={handleSaveContract}
        onCancel={() => {
          setShowForm(false);
          setEditingContract(null);
        }}
      />
    );
  }

  if (previewContract) {
    return (
      <ContractPreview
        contract={previewContract}
        onBack={() => setPreviewContract(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Contrats</h2>
          <p className="text-gray-600">Gérez vos contrats de location</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Contrat
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par client ou véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contract List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {contract.clientPrenom} {contract.clientNom}
                    </h3>
                    <p className="text-sm text-gray-600">Client</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {contract.vehicleMarque} {contract.vehicleModele}
                    </h3>
                    <p className="text-sm text-gray-600">{contract.vehicleImmatriculation}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(contract.dateDebut).toLocaleDateString('fr-FR')} - {new Date(contract.dateFin).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{contract.nbJours} jour(s)</p>
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{contract.montantTotal.toLocaleString()} CFA</p>
                    <p className="text-sm text-gray-600">{contract.prixJour.toLocaleString()} CFA/jour</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <Badge className={getStatusColor(contract.statut)}>
                    {getStatusLabel(contract.statut)}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewContract(contract)}
                      title="Voir le contrat"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditContract(contract)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContract(contract.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contrat trouvé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucun contrat ne correspond à votre recherche.' : 'Commencez par créer votre premier contrat.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractManagement;
