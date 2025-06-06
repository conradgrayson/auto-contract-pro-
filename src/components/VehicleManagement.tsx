
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Car, Fuel, Users, Calendar } from 'lucide-react';
import VehicleForm from './VehicleForm';

interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  annee: number;
  couleur: string;
  carburant: string;
  places: number;
  kilometrage: number;
  prixJour: number;
  statut: 'disponible' | 'loue' | 'maintenance';
  photo?: string;
}

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      marque: 'Peugeot',
      modele: '308',
      immatriculation: 'AA-123-BB',
      annee: 2023,
      couleur: 'Bleu',
      carburant: 'Essence',
      places: 5,
      kilometrage: 15000,
      prixJour: 45,
      statut: 'disponible'
    },
    {
      id: '2',
      marque: 'Renault',
      modele: 'Clio',
      immatriculation: 'CC-456-DD',
      annee: 2022,
      couleur: 'Rouge',
      carburant: 'Diesel',
      places: 5,
      kilometrage: 25000,
      prixJour: 35,
      statut: 'loue'
    },
    {
      id: '3',
      marque: 'BMW',
      modele: 'Série 3',
      immatriculation: 'EE-789-FF',
      annee: 2024,
      couleur: 'Noir',
      carburant: 'Essence',
      places: 5,
      kilometrage: 5000,
      prixJour: 75,
      statut: 'maintenance'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'loue': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
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

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => 
        v.id === editingVehicle.id ? { ...vehicleData, id: editingVehicle.id } : v
      ));
    } else {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: Date.now().toString()
      };
      setVehicles(prev => [...prev, newVehicle]);
    }
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
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
              placeholder="Rechercher par marque, modèle ou immatriculation..."
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
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.marque} {vehicle.modele}</CardTitle>
                  <p className="text-sm text-gray-600">{vehicle.immatriculation}</p>
                </div>
                <Badge className={getStatusColor(vehicle.statut)}>
                  {getStatusLabel(vehicle.statut)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{vehicle.annee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-gray-400" />
                  <span>{vehicle.carburant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{vehicle.places} places</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <span>{vehicle.kilometrage.toLocaleString()} km</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-lg font-semibold text-primary">{vehicle.prixJour}€/jour</p>
                <p className="text-sm text-gray-600">Couleur: {vehicle.couleur}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditVehicle(vehicle)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
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
