
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Users, FileText, Phone, Mail } from 'lucide-react';
import ClientForm from './ClientForm';
import { useSupabaseClients, Client } from '@/hooks/useSupabaseClients';
import { useNavigate } from 'react-router-dom';

interface ClientManagementProps {
  onCreateContract?: (clientId: string) => void;
}

const ClientManagement = ({ onCreateContract }: ClientManagementProps) => {
  const navigate = useNavigate();
  const { clients, addClient, updateClient, deleteClient, loading } = useSupabaseClients();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'actif': return 'Actif';
      case 'inactif': return 'Inactif';
      default: return status;
    }
  };

  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'dateInscription'>) => {
    if (editingClient) {
      await updateClient(editingClient.id, clientData);
    } else {
      await addClient(clientData);
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      await deleteClient(id);
    }
  };

  const handleCreateContractForClient = (clientId: string) => {
    if (onCreateContract) {
      onCreateContract(clientId);
    } else {
      // Naviguer vers la page contrats avec le client présélectionné
      navigate('/contrats', { state: { preselectedClientId: clientId } });
    }
  };

  if (showForm) {
    return (
      <ClientForm
        client={editingClient}
        onSave={handleSaveClient}
        onCancel={() => {
          setShowForm(false);
          setEditingClient(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Clients</h2>
          <p className="text-gray-600">Gérez votre base de clients</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Client
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, prénom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {client.prenom} {client.nom}
                </CardTitle>
                <Badge className={getStatusColor(client.statut)}>
                  {getStatusLabel(client.statut)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{client.telephone}</span>
                </div>
              </div>
              
              <div className="text-sm">
                <p className="text-gray-600">Adresse</p>
                <p className="font-medium">{client.adresse}</p>
                <p className="text-gray-500">{client.ville}, {client.codePostal}</p>
              </div>

              <div className="text-sm">
                <p className="text-gray-600">Permis de conduire</p>
                <p className="font-medium">{client.numeroPermis}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCreateContractForClient(client.id)}
                  className="flex items-center gap-1 flex-1"
                  disabled={client.statut !== 'actif'}
                >
                  <FileText className="h-4 w-4" />
                  Contrat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClient(client)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucun client ne correspond à votre recherche.' : 'Commencez par ajouter votre premier client.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientManagement;
