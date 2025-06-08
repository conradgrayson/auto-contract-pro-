
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Users, FileText, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { useSupabaseVehicles } from '@/hooks/useSupabaseVehicles';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useSupabaseContracts } from '@/hooks/useSupabaseContracts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { vehicles } = useSupabaseVehicles();
  const { clients } = useSupabaseClients();
  const { contracts } = useSupabaseContracts();

  const vehiculesLoues = vehicles.filter(v => v.statut === 'loue').length;
  const clientsActifs = clients.filter(c => c.statut === 'actif').length;
  const contratsActifs = contracts.filter(c => c.statut === 'actif').length;

  const stats = [
    { title: 'Véhicules Total', value: vehicles.length.toString(), icon: Car, color: 'text-blue-600' },
    { title: 'Véhicules Loués', value: vehiculesLoues.toString(), icon: Car, color: 'text-green-600' },
    { title: 'Clients Actifs', value: clientsActifs.toString(), icon: Users, color: 'text-purple-600' },
    { title: 'Contrats Actifs', value: contratsActifs.toString(), icon: FileText, color: 'text-orange-600' },
  ];

  const recentContracts = contracts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getAlerts = () => {
    const alerts = [];
    
    // Véhicules en maintenance
    const vehiculesEnMaintenance = vehicles.filter(v => v.statut === 'maintenance');
    if (vehiculesEnMaintenance.length > 0) {
      alerts.push({
        message: `${vehiculesEnMaintenance.length} véhicule(s) en maintenance`,
        priority: 'high' as const
      });
    }

    // Contrats se terminant bientôt (dans les 3 prochains jours)
    const today = new Date();
    const inThreeDays = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const contratsFinissantBientot = contracts.filter(c => {
      const dateFin = new Date(c.datefin);
      return c.statut === 'actif' && dateFin <= inThreeDays && dateFin >= today;
    });

    if (contratsFinissantBientot.length > 0) {
      alerts.push({
        message: `${contratsFinissantBientot.length} contrat(s) se termine(nt) dans les 3 prochains jours`,
        priority: 'medium' as const
      });
    }

    // Véhicules disponibles
    const vehiculesDisponibles = vehicles.filter(v => v.statut === 'disponible');
    if (vehiculesDisponibles.length > 0) {
      alerts.push({
        message: `${vehiculesDisponibles.length} véhicule(s) disponible(s) pour location`,
        priority: 'low' as const
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'nouveau-contrat':
        navigate('/contrats');
        break;
      case 'ajouter-client':
        navigate('/clients');
        break;
      case 'ajouter-vehicule':
        navigate('/vehicules');
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tableau de Bord</h2>
        <p className="text-gray-600">Vue d'ensemble de votre activité</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Contrats Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContracts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun contrat récent</p>
              ) : (
                recentContracts.map((contract, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{contract.numerocontrat}</p>
                      <p className="text-sm text-gray-600">
                        {contract.client?.prenom} {contract.client?.nom} - {contract.vehicle?.marque} {contract.vehicle?.modele}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(contract.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune alerte</p>
              ) : (
                alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.priority === 'high' ? 'bg-red-50 border-red-400' :
                    alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <p className="text-sm text-gray-800">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleQuickAction('nouveau-contrat')}
              className="p-4 h-auto flex-col gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">Nouveau Contrat</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction('ajouter-client')}
              className="p-4 h-auto flex-col gap-2 bg-green-600 text-white hover:bg-green-700"
            >
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Ajouter Client</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction('ajouter-vehicule')}
              className="p-4 h-auto flex-col gap-2 bg-purple-600 text-white hover:bg-purple-700"
            >
              <Car className="h-6 w-6" />
              <span className="text-sm font-medium">Ajouter Véhicule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
