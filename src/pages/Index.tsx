
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import VehicleManagement from '@/components/VehicleManagement';
import ClientManagement from '@/components/ClientManagement';
import ContractManagement from '@/components/ContractManagement';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'contracts':
        return <ContractManagement />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h2>
            <p className="text-gray-600">Section en cours de développement</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
