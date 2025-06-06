
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Users, FileText, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Véhicules Total', value: '24', icon: Car, color: 'text-blue-600' },
    { title: 'Véhicules Loués', value: '18', icon: Car, color: 'text-green-600' },
    { title: 'Clients Actifs', value: '156', icon: Users, color: 'text-purple-600' },
    { title: 'Contrats ce Mois', value: '42', icon: FileText, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { type: 'Nouveau contrat', client: 'Jean Dupont', vehicle: 'Peugeot 308', date: '2024-06-06' },
    { type: 'Retour véhicule', client: 'Marie Martin', vehicle: 'Renault Clio', date: '2024-06-05' },
    { type: 'Nouveau client', client: 'Pierre Durand', vehicle: '-', date: '2024-06-05' },
  ];

  const alerts = [
    { message: 'Révision programmée - BMW Série 3 (AA-123-BB)', priority: 'high' },
    { message: 'Assurance expire dans 15 jours - Mercedes Classe A', priority: 'medium' },
    { message: 'Retour prévu aujourd\'hui - Volkswagen Golf', priority: 'low' },
  ];

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
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.client} - {activity.vehicle}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              ))}
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
              {alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.priority === 'high' ? 'bg-red-50 border-red-400' :
                  alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <p className="text-sm text-gray-800">{alert.message}</p>
                </div>
              ))}
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
            <button className="p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <span className="block text-sm font-medium">Nouveau Contrat</span>
            </button>
            <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <span className="block text-sm font-medium">Ajouter Client</span>
            </button>
            <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Car className="h-6 w-6 mx-auto mb-2" />
              <span className="block text-sm font-medium">Ajouter Véhicule</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
