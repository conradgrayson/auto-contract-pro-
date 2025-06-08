
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Car, FileText } from 'lucide-react';
import VehicleForm from './VehicleForm';
import { useSupabaseVehicles, Vehicle } from '@/hooks/useSupabaseVehicles';
import { useNavigate } from 'react-router-dom';

interface VehicleManagementProps {
  onCreateContract?: (vehicleId: string) => void;
}

const VehicleManagement = ({ onCreateContract }: VehicleManagementProps) => {
  const navigate = useNavigate();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, loading } = useSupabaseVehicles();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.couleur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'loue': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'loue': return 'Loué';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const handleSaveVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, vehicleData);
    } else {
      await addVehicle(vehicleData);
    }
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      await deleteVehicle(id);
    }
  };

  const handleCreateContractForVehicle = (vehicleId: string) => {
    if (onCreateContract) {
      onCreateContract(vehicleId);
    } else {
      // Naviguer vers la page contrats avec le véhicule présélectionné
      navigate('/contrats', { state: { preselectedVehicleId: vehicleId } });
    }
  };

  if (showForm) {
    return (
      <VehicleForm
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
        onCancel={() => {
          setShowForm(false);
          setEditingVehicle(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des véhicules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Véhicules</h2>
          <p className="text-gray-600">Gérez votre flotte de véhicules</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Véhicule
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par marque, modèle, immatriculation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {vehicle.marque} {vehicle.modele}
                </CardTitle>
                <Badge className={getStatusColor(vehicle.statut)}>
                  {getStatusLabel(vehicle.statut)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{vehicle.immatriculation}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Année</p>
                  <p className="font-medium">{vehicle.annee}</p>
                </div>
                <div>
                  <p className="text-gray-600">Couleur</p>
                  <p className="font-medium">{vehicle.couleur}</p>
                </div>
                <div>
                  <p className="text-gray-600">Places</p>
                  <p className="font-medium">{vehicle.nombrePlaces}</p>
                </div>
                <div>
                  <p className="text-gray-600">Kilométrage</p>
                  <p className="font-medium">{vehicle.kilometrage.toLocaleString()} km</p>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <p className="text-2xl font-bold text-primary">
                  {vehicle.prixParJour.toLocaleString()} CFA/jour
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCreateContractForVehicle(vehicle.id)}
                  className="flex items-center gap-1 flex-1"
                  disabled={vehicle.statut !== 'disponible'}
                >
                  <FileText className="h-4 w-4" />
                  Contrat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditVehicle(vehicle)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucun véhicule ne correspond à votre recherche.' : 'Commencez par ajouter votre premier véhicule.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleManagement;
