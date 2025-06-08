
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import VehicleManagement from "@/components/VehicleManagement";
import ClientManagement from "@/components/ClientManagement";
import ContractManagement from "@/components/ContractManagement";
import ContractTermsSettings from "@/components/ContractTermsSettings";
import ContractForm from "@/components/ContractForm";
import { useSupabaseContracts } from "@/hooks/useSupabaseContracts";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { addContract } = useSupabaseContracts();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showContractForm, setShowContractForm] = useState(false);
  const [preselectedClientId, setPreselectedClientId] = useState<string | undefined>();
  const [preselectedVehicleId, setPreselectedVehicleId] = useState<string | undefined>();

  // Gérer les paramètres de navigation depuis d'autres composants
  useEffect(() => {
    if (location.state?.preselectedClientId || location.state?.preselectedVehicleId) {
      setPreselectedClientId(location.state.preselectedClientId);
      setPreselectedVehicleId(location.state.preselectedVehicleId);
      setActiveTab("contrats");
      setShowContractForm(true);
    }
  }, [location.state]);

  if (!user) {
    return null;
  }

  const handleCreateContractForClient = (clientId: string) => {
    setPreselectedClientId(clientId);
    setPreselectedVehicleId(undefined);
    setActiveTab("contrats");
    setShowContractForm(true);
  };

  const handleCreateContractForVehicle = (vehicleId: string) => {
    setPreselectedVehicleId(vehicleId);
    setPreselectedClientId(undefined);
    setActiveTab("contrats");
    setShowContractForm(true);
  };

  const handleSaveContract = async (contractData: any) => {
    await addContract(contractData);
    setShowContractForm(false);
    setPreselectedClientId(undefined);
    setPreselectedVehicleId(undefined);
  };

  const handleCancelContractForm = () => {
    setShowContractForm(false);
    setPreselectedClientId(undefined);
    setPreselectedVehicleId(undefined);
  };

  const renderContent = () => {
    if (activeTab === "contrats" && showContractForm) {
      return (
        <ContractForm
          onSave={handleSaveContract}
          onCancel={handleCancelContractForm}
          preselectedClientId={preselectedClientId}
          preselectedVehicleId={preselectedVehicleId}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "vehicules":
        return <VehicleManagement onCreateContract={handleCreateContractForVehicle} />;
      case "clients":
        return <ClientManagement onCreateContract={handleCreateContractForClient} />;
      case "contrats":
        return <ContractManagement />;
      case "parametres":
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
