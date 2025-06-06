
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import VehicleManagement from '@/components/VehicleManagement';
import ClientManagement from '@/components/ClientManagement';
import ContractManagement from '@/components/ContractManagement';
import ContractTermsSettings from '@/components/ContractTermsSettings';

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
        return <ContractTermsSettings />;
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
