
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, MapPin } from 'lucide-react';
import ClientForm from './ClientForm';

interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  numeroPermis: string;
  dateNaissance: string;
  statut: 'actif' | 'inactif';
  dateInscription: string;
}

const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '0123456789',
      adresse: '123 Rue de la Paix',
      ville: 'Paris',
      codePostal: '75001',
      numeroPermis: 'ABC123456789',
      dateNaissance: '1985-03-15',
      statut: 'actif',
      dateInscription: '2024-01-15'
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Marie',
      email: 'marie.martin@email.com',
      telephone: '0987654321',
      adresse: '456 Avenue des Champs',
      ville: 'Lyon',
      codePostal: '69001',
      numeroPermis: 'DEF987654321',
      dateNaissance: '1990-07-22',
      statut: 'actif',
      dateInscription: '2024-02-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.includes(searchTerm)
  );

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'dateInscription'>) => {
    if (editingClient) {
      setClients(prev => prev.map(c => 
        c.id === editingClient.id ? { ...clientData, id: editingClient.id, dateInscription: editingClient.dateInscription } : c
      ));
    } else {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        dateInscription: new Date().toISOString().split('T')[0]
      };
      setClients(prev => [...prev, newClient]);
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setClients(prev => prev.filter(c => c.id !== id));
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Clients</h2>
          <p className="text-gray-600">Gérez votre base de données clients</p>
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
              placeholder="Rechercher par nom, email ou téléphone..."
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
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{client.prenom} {client.nom}</CardTitle>
                    <p className="text-sm text-gray-600">Client depuis {new Date(client.dateInscription).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <Badge className={client.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {client.statut === 'actif' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{client.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{client.ville}, {client.codePostal}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">Permis: {client.numeroPermis}</p>
                <p className="text-sm text-gray-600">Né(e) le: {new Date(client.dateNaissance).toLocaleDateString('fr-FR')}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClient(client)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
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
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
